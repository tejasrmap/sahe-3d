import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as Cesium from 'cesium';
import { CAMPUS_CONFIG } from './data/campusConfig';
import { CAMPUS_BUILDINGS } from './data/buildings';
import { CAMPUS_POIS } from './data/pois';
import { Building, POI, MapLayerState } from './types/campus';
import { useCampusNavigation } from './hooks/useCampusNavigation';
import { useUserLocation } from './hooks/useUserLocation';
import { useCameraPresets, CameraPresetType } from './hooks/useCameraPresets';
import { useFirstPersonController } from './hooks/useFirstPersonController';
import { SearchResultItem } from './hooks/useCampusSearch';
import { CampusMap } from './components/map/CampusMap';
import { MapRenderMode } from './components/map/BuildingLayer';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { BuildingDetailsPanel } from './components/buildings/BuildingDetailsPanel';
import { NavigationPanel } from './components/navigation/NavigationPanel';
import { MapControls } from './components/map/MapControls';
import { CameraPresetsBar } from './components/map/CameraPresetsBar';
import { ImmersiveHUD } from './components/immersive/ImmersiveHUD';
import { CampusTourModal } from './components/immersive/CampusTourModal';
import { MobileTouchControls } from './components/immersive/MobileTouchControls';
import { TimeOfDayPreset, applyTimeOfDay } from './systems/lighting/timeOfDaySystem';
import { getNearbyDiscoveries, ProximityTarget } from './systems/discovery/proximityEngine';
import { IndoorExplorationModal } from './components/indoor/IndoorExplorationModal';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WelcomeModal, ONBOARDING_STORAGE_KEY } from './components/onboarding/WelcomeModal';
import { GlassPanel } from './components/ui/GlassPanel';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(30);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  // Digital Twin Mode: 'architectural' (realistic facades, windows, trees) vs 'geographic' (satellite + extrusion)
  const [renderMode, setRenderMode] = useState<MapRenderMode>('architectural');

  // Time of Day Lighting Preset
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayPreset>('goldenHour');

  // Guided Campus Tour Modal
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Indoor Building Digital Twin Modal
  const [isIndoorOpen, setIsIndoorOpen] = useState(false);
  const [indoorBuilding, setIndoorBuilding] = useState<Building | null>(null);

  // Proximity discovery in first-person mode
  const [nearestDiscovery, setNearestDiscovery] = useState<ProximityTarget | null>(null);

  // Layer Visibility State
  const [layers, setLayers] = useState<MapLayerState>({
    satellite: true,
    buildings: true,
    pois: true,
    boundary: true,
    labels: true,
    terrain3D: true,
  });

  // First-Time User Onboarding Welcome Overlay
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(ONBOARDING_STORAGE_KEY);
    } catch {
      return true;
    }
  });

  // UI Panels State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Selection State
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  // Notification Message
  const [notification, setNotification] = useState<{ type: 'info' | 'success' | 'warn'; message: string } | null>(null);

  // First-Person Controller Hook
  const {
    isActive: isFirstPersonActive,
    isSprinting,
    isColliding,
    currentSpeedKmh,
    position: fpPosition,
    getCurrentPosition,
    enterFirstPerson,
    exitFirstPerson,
    handleVirtualMovement,
    handleVirtualLook,
  } = useFirstPersonController(viewer);

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sahe_campus_favorites');
      return saved ? JSON.parse(saved) : ['cse-it-complex', 'admin-central-library'];
    } catch {
      return ['cse-it-complex', 'admin-central-library'];
    }
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('sahe_campus_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  // Navigation Hook
  const {
    startPoint,
    setStartPoint,
    destination,
    setDestination,
    route,
    isNavigating,
    setIsNavigating,
    availableTargets,
    setTargetFromBuilding,
    setTargetFromCoordinates,
    reverseRoute,
    clearRoute,
  } = useCampusNavigation();

  // User Geolocation Hook
  const {
    latitude: userLat,
    longitude: userLon,
    accuracy: userAccuracy,
    loading: isLocating,
    error: locationError,
    isWithinCampus,
    requestLocation,
  } = useUserLocation();

  // Camera Presets & Cinematic Orbit Hook
  const {
    activePreset,
    isOrbiting,
    flyToCampusOverview,
    flyToArchitecturalView,
    flyToGroundLevel,
    startBuildingOrbit,
    startWalkingExploration,
    stopOrbit,
  } = useCameraPresets(viewer, selectedBuilding);

  // First-Person Mode Enter Handler
  const handleStartImmersive = useCallback(() => {
    stopOrbit();
    setIsTourOpen(false);
    setIsSidebarOpen(false);
    setIsNavigationOpen(false);
    // If a building is selected, spawn near its entrance, else Main Gate
    if (selectedBuilding) {
      enterFirstPerson(selectedBuilding.longitude - 0.0003, selectedBuilding.latitude - 0.0003);
    } else {
      enterFirstPerson(80.6922, 16.4832); // Main Gate
    }
    setNotification({
      type: 'info',
      message: 'First-Person Mode Active. Use WASD / Arrows to walk, Shift to sprint, Mouse to look, ESC to exit.',
    });
  }, [stopOrbit, selectedBuilding, enterFirstPerson]);

  // Guided Tour Launch Handler
  const handleStartTour = useCallback(() => {
    stopOrbit();
    if (isFirstPersonActive) {
      exitFirstPerson();
    }
    setIsSidebarOpen(false);
    setIsNavigationOpen(false);
    setIsTourOpen(true);
  }, [stopOrbit, isFirstPersonActive, exitFirstPerson]);

  // Indoor Digital Twin Launch Handler
  const handleOpenIndoor = useCallback(
    (bldg?: Building) => {
      const target = bldg || selectedBuilding || CAMPUS_BUILDINGS[0];
      stopOrbit();
      if (isFirstPersonActive) {
        exitFirstPerson();
      }
      setIndoorBuilding(target);
      setIsIndoorOpen(true);
      setIsNavigationOpen(false);
      setIsSidebarOpen(false);
      setNotification({
        type: 'info',
        message: `Entered Indoor Digital Twin for ${target.name}.`,
      });
    },
    [selectedBuilding, stopOrbit, isFirstPersonActive, exitFirstPerson]
  );

  // Handle Preset Selection
  const handleSelectPreset = useCallback(
    (preset: CameraPresetType) => {
      switch (preset) {
        case 'overview':
          flyToCampusOverview();
          break;
        case 'architectural':
          flyToArchitecturalView(selectedBuilding);
          break;
        case 'ground':
          flyToGroundLevel(selectedBuilding);
          break;
        case 'orbit':
          startBuildingOrbit(selectedBuilding);
          break;
        case 'walking':
          handleStartImmersive();
          break;
      }
    },
    [flyToCampusOverview, flyToArchitecturalView, flyToGroundLevel, startBuildingOrbit, handleStartImmersive, selectedBuilding]
  );

  // Apply Lighting on viewer ready or timeOfDay change
  useEffect(() => {
    if (viewer) {
      applyTimeOfDay(viewer, timeOfDay);
    }
  }, [viewer, timeOfDay]);

  // Proximity discovery interval in first-person mode
  useEffect(() => {
    if (!isFirstPersonActive) {
      setNearestDiscovery(null);
      return;
    }
    const interval = setInterval(() => {
      const currentPos = getCurrentPosition ? getCurrentPosition() : fpPosition;
      const discoveries = getNearbyDiscoveries(currentPos.lat, currentPos.lon, 65);
      setNearestDiscovery(discoveries.nearestBuilding || discoveries.nearestPoi || null);
    }, 400);
    return () => clearInterval(interval);
  }, [isFirstPersonActive, getCurrentPosition, fpPosition]);

  // Toggle between Architectural Twin and Geographic Mode
  const handleToggleRenderMode = useCallback(() => {
    setRenderMode((prev) => {
      const nextMode = prev === 'architectural' ? 'geographic' : 'architectural';
      setNotification({
        type: 'info',
        message: nextMode === 'architectural'
          ? 'Architectural Digital Twin Mode Activated (Procedural Facades, Windows, Roofs, Landscaping)'
          : 'Geographic Satellite Mode Activated (Simplified Extrusion)',
      });
      return nextMode;
    });
  }, []);

  // Initial loading progress with fallback dismiss
  useEffect(() => {
    const timer1 = setTimeout(() => setLoadProgress(65), 400);
    const timer2 = setTimeout(() => setLoadProgress(90), 1000);
    const fallbackTimer = setTimeout(() => {
      setLoadProgress(100);
      setIsLoading(false);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Handle viewer ready callback from CampusMap
  const handleViewerReady = useCallback((viewerInstance: Cesium.Viewer) => {
    setViewer(viewerInstance);
    setLoadProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
  }, []);

  // Show location error if any
  useEffect(() => {
    if (locationError) {
      setNotification({ type: 'warn', message: locationError });
    }
  }, [locationError]);

  // When user location is resolved
  useEffect(() => {
    if (userLat !== null && userLon !== null && viewer) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(userLon, userLat - 0.001, 200),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-40),
          roll: 0,
        },
        duration: 2.0,
      });

      if (isWithinCampus) {
        setNotification({
          type: 'success',
          message: 'Located within SAHE campus grounds.',
        });
      } else {
        setNotification({
          type: 'info',
          message: 'You are outside SAHE campus. Simulated campus route will connect from Main Gate.',
        });
      }
    }
  }, [userLat, userLon, isWithinCampus, viewer]);

  // Layer toggle handler
  const handleToggleLayer = useCallback((layerKey: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  // Camera Actions
  const handleZoomIn = useCallback(() => {
    if (viewer) {
      stopOrbit();
      viewer.camera.zoomIn(viewer.camera.positionCartographic.height * 0.35);
    }
  }, [viewer, stopOrbit]);

  const handleZoomOut = useCallback(() => {
    if (viewer) {
      stopOrbit();
      viewer.camera.zoomOut(viewer.camera.positionCartographic.height * 0.45);
    }
  }, [viewer, stopOrbit]);

  const handleResetCamera = useCallback(() => {
    flyToCampusOverview();
    setSelectedBuilding(null);
    setSelectedPoi(null);
  }, [flyToCampusOverview]);

  const handleFlyToPresetLocation = useCallback(
    (presetId: string) => {
      if (!viewer) return;
      stopOrbit();
      switch (presetId) {
        case 'overview':
          flyToCampusOverview();
          break;
        case 'quad':
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.6924, 16.4848 - 0.0018, 220),
            orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-35), roll: 0 },
            duration: 1.8,
          });
          break;
        case 'sports':
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.6914, 16.4834 - 0.0018, 250),
            orientation: { heading: Cesium.Math.toRadians(80), pitch: Cesium.Math.toRadians(-35), roll: 0 },
            duration: 1.8,
          });
          break;
        case 'hostels':
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.6953, 16.4846 - 0.0020, 280),
            orientation: { heading: Cesium.Math.toRadians(270), pitch: Cesium.Math.toRadians(-35), roll: 0 },
            duration: 1.8,
          });
          break;
        case 'gate':
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.6914, 16.4820 - 0.0012, 180),
            orientation: { heading: Cesium.Math.toRadians(345), pitch: Cesium.Math.toRadians(-30), roll: 0 },
            duration: 1.8,
          });
          break;
        default:
          flyToCampusOverview();
      }
    },
    [viewer, stopOrbit, flyToCampusOverview]
  );

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  }, []);

  // Select building
  const handleSelectBuilding = useCallback(
    (building: Building) => {
      stopOrbit();
      setSelectedBuilding(building);
      setSelectedPoi(null);
    },
    [stopOrbit]
  );

  // Select POI
  const handleSelectPoi = useCallback(
    (poi: POI) => {
      stopOrbit();
      setSelectedPoi(poi);
      const bldg = CAMPUS_BUILDINGS.find((b) => b.id === poi.buildingId);
      if (bldg) {
        setSelectedBuilding(bldg);
      }
    },
    [stopOrbit]
  );

  // Search result selection
  const handleSelectSearchResult = useCallback(
    (item: SearchResultItem) => {
      stopOrbit();
      if (item.type === 'building' || item.buildingId) {
        const bldg = CAMPUS_BUILDINGS.find((b) => b.id === (item.buildingId || item.id.replace('bld-', '')));
        if (bldg) {
          setSelectedBuilding(bldg);
          setSelectedPoi(null);
          return;
        }
      }

      if (item.type === 'poi') {
        const poi = CAMPUS_POIS.find((p) => p.id === item.id.replace('poi-', ''));
        if (poi) {
          setSelectedPoi(poi);
          return;
        }
      }

      // Fly camera to custom coordinates if any
      if (viewer) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(item.longitude, item.latitude - 0.001, 150),
          duration: 1.8,
        });
      }
    },
    [viewer, stopOrbit]
  );

  // Navigate here from Building panel
  const handleNavigateToBuilding = useCallback(
    (buildingId: string) => {
      setTargetFromBuilding(buildingId, true);
      setIsNavigationOpen(true);
      setIsSidebarOpen(false);
    },
    [setTargetFromBuilding]
  );

  return (
    <div className="relative w-screen h-screen bg-[#080B12] text-slate-100 overflow-hidden font-sans">
      {/* 3D Geospatial & Architectural Campus Viewer */}
      <CampusMap
        layers={layers}
        renderMode={renderMode}
        selectedBuilding={selectedBuilding}
        hoveredBuildingId={hoveredBuildingId}
        selectedPoi={selectedPoi}
        route={route}
        userLat={userLat}
        userLon={userLon}
        userAccuracy={userAccuracy}
        onSelectBuilding={handleSelectBuilding}
        onHoverBuilding={setHoveredBuildingId}
        onSelectPoi={handleSelectPoi}
        onViewerReady={handleViewerReady}
      />

      {/* Top Floating Navigation Bar (Hidden in First-Person) */}
      {!isFirstPersonActive && (
        <TopBar
          onSelectItem={handleSelectSearchResult}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          onLocateMe={requestLocation}
          onResetCamera={handleResetCamera}
          onOpenHelp={() => setIsWelcomeOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleLayersMenu={() => setIsLayersMenuOpen((prev) => !prev)}
          isLayersMenuOpen={isLayersMenuOpen}
          isLocating={isLocating}
        />
      )}

      {/* Left Collapsible Floating Directory Sidebar */}
      {!isFirstPersonActive && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          selectedBuildingId={selectedBuilding?.id || null}
          onSelectBuilding={handleSelectBuilding}
          onSelectPoi={handleSelectPoi}
          onOpenNavigation={() => {
            setIsNavigationOpen(true);
            setIsSidebarOpen(false);
          }}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          renderMode={renderMode}
          onToggleRenderMode={handleToggleRenderMode}
          timeOfDay={timeOfDay}
          onSelectTimeOfDay={setTimeOfDay}
          onStartImmersive={handleStartImmersive}
          onOpenIndoor={handleOpenIndoor}
          onSelectPreset={handleSelectPreset}
          onFlyToPresetLocation={handleFlyToPresetLocation}
          onOpenTour={handleStartTour}
          onResetWelcome={() => setIsWelcomeOpen(true)}
          layers={layers}
          onToggleLayer={handleToggleLayer}
        />
      )}

      {/* Right Floating Map Controls */}
      {!isFirstPersonActive && (
        <div className="fixed right-4 top-20 z-30 hidden sm:flex flex-col pointer-events-auto">
          <MapControls
            layers={layers}
            onToggleLayer={handleToggleLayer}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetCamera={handleResetCamera}
            onLocateMe={requestLocation}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            isLocating={isLocating}
          />
        </div>
      )}

      {/* Bottom Center Cinematic Camera & Mode Presets Dock */}
      {!isFirstPersonActive && (
        <CameraPresetsBar
          activePreset={activePreset}
          isOrbiting={isOrbiting}
          renderMode={renderMode}
          timeOfDay={timeOfDay}
          onSelectPreset={handleSelectPreset}
          onToggleRenderMode={handleToggleRenderMode}
          onStartImmersive={handleStartImmersive}
          onStartTour={handleStartTour}
          onSelectTimeOfDay={setTimeOfDay}
        />
      )}

      {/* First-Person Immersive HUD */}
      {isFirstPersonActive && (
        <ImmersiveHUD
          speedKmh={currentSpeedKmh}
          isSprinting={isSprinting}
          isColliding={isColliding}
          nearestDiscovery={nearestDiscovery}
          activeRoute={route}
          currentTimePreset={timeOfDay}
          onSelectTimePreset={setTimeOfDay}
          onInspectBuilding={(b) => {
            setSelectedBuilding(b);
          }}
          onExit={exitFirstPerson}
        />
      )}

      {/* Mobile Touch Controls in First-Person */}
      {isFirstPersonActive && (
        <div className="sm:hidden">
          <MobileTouchControls
            onMove={handleVirtualMovement}
            onLook={handleVirtualLook}
            isSprinting={isSprinting}
            onToggleSprint={() => {}}
          />
        </div>
      )}

      {/* Campus Tour Modal */}
      <CampusTourModal
        viewer={viewer}
        isOpen={isTourOpen}
        onSelectBuilding={(b) => {
          setSelectedBuilding(b);
        }}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Building Details Panel (Slide in on right) */}
      <BuildingDetailsPanel
        building={selectedBuilding}
        onClose={() => {
          stopOrbit();
          setSelectedBuilding(null);
        }}
        onNavigateHere={handleNavigateToBuilding}
        onExploreBuilding={(b) => startBuildingOrbit(b)}
        onExploreInterior={(b) => handleOpenIndoor(b)}
        isFavorite={selectedBuilding ? favoriteIds.includes(selectedBuilding.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Indoor Multi-Floor Building Digital Twin Modal */}
      <IndoorExplorationModal
        building={indoorBuilding || selectedBuilding}
        isOpen={isIndoorOpen}
        onClose={() => {
          setIsIndoorOpen(false);
          setNotification({
            type: 'info',
            message: 'Returned to Outdoor Campus Map.',
          });
        }}
      />

      {/* Active Navigation Panel (Floating drawer on top-left) */}
      {isNavigationOpen && !isFirstPersonActive && (
        <div className="fixed top-20 left-3 sm:left-20 z-40 w-full sm:w-96 max-w-[calc(100vw-24px)] pointer-events-auto">
          <NavigationPanel
            startPoint={startPoint}
            destination={destination}
            route={route}
            availableTargets={availableTargets}
            onSelectStart={setStartPoint}
            onSelectDestination={setDestination}
            onReverseRoute={reverseRoute}
            onClearRoute={clearRoute}
            onUseMyLocation={() => {
              if (userLat !== null && userLon !== null) {
                setTargetFromCoordinates(userLat, userLon, 'My Location', true);
              } else {
                requestLocation();
              }
            }}
            onClose={() => setIsNavigationOpen(false)}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Hidden in First-Person) */}
      {!isFirstPersonActive && (
        <MobileNavigation
          onOpenDirectory={() => setIsSidebarOpen((prev) => !prev)}
          onOpenNavigation={() => setIsNavigationOpen((prev) => !prev)}
          onOpenLayers={() => setIsLayersMenuOpen((prev) => !prev)}
          onOpenSearch={() => {}}
          onLocateMe={requestLocation}
          onStartImmersive={handleStartImmersive}
          onStartTour={handleStartTour}
          isLocating={isLocating}
          isDirectoryOpen={isSidebarOpen}
          isNavigationOpen={isNavigationOpen}
          isLayersOpen={isLayersMenuOpen}
        />
      )}

      {/* First-Time User Experience Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen && !isLoading}
        onClose={() => setIsWelcomeOpen(false)}
        onExploreCampus={() => {
          handleResetCamera();
          setNotification({
            type: 'info',
            message: 'Welcome to SAHE 3D! Click any building or use the directory to explore.',
          });
        }}
        onFindBuilding={() => {
          setIsSidebarOpen(true);
        }}
        onStartTour={() => {
          handleStartTour();
        }}
        onExploreDepartments={() => {
          setIsSidebarOpen(true);
        }}
        onExploreFacilities={() => {
          setIsSidebarOpen(true);
        }}
      />

      {/* User Toast Notification */}
      {notification && (
        <div className="fixed bottom-16 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-bounce-in">
          <GlassPanel className="px-4 py-2.5 flex items-center gap-2.5 text-xs font-medium border border-white/15 shadow-2xl">
            {notification.type === 'warn' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-slate-200">{notification.message}</span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-0.5 rounded text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </GlassPanel>
        </div>
      )}

      {/* Initial Application Loading Screen with Fail-safe bypass */}
      {isLoading && (
        <LoadingScreen
          progress={loadProgress}
          onDismiss={() => setIsLoading(false)}
        />
      )}
    </div>
  );
}

export default App;
