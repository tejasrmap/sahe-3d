import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as Cesium from 'cesium';
import { Viewer } from 'resium';
import { CAMPUS_CONFIG } from '../../data/campusConfig';
import { Building, POI, NavigationRoute as NavigationRouteType, MapLayerState } from '../../types/campus';
import { CampusBoundary } from './CampusBoundary';
import { BuildingLayer, MapRenderMode } from './BuildingLayer';
import { LandscapingLayer } from './LandscapingLayer';
import { POILayer } from './POILayer';
import { NavigationRoute } from './NavigationRoute';
import { UserLocation } from './UserLocation';
import { BuildingLOD } from '../../systems/architecture/buildingGenerator';

// Setup Cesium Ion token if configured in environment
const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
if (ionToken) {
  Cesium.Ion.defaultAccessToken = ionToken;
}

interface CampusMapProps {
  layers: MapLayerState;
  renderMode?: MapRenderMode;
  selectedBuilding: Building | null;
  hoveredBuildingId: string | null;
  selectedPoi: POI | null;
  route: NavigationRouteType | null;
  userLat: number | null;
  userLon: number | null;
  userAccuracy: number | null;
  onSelectBuilding: (building: Building) => void;
  onHoverBuilding: (buildingId: string | null) => void;
  onSelectPoi: (poi: POI) => void;
  onViewerReady?: (viewer: Cesium.Viewer) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  layers,
  renderMode = 'architectural',
  selectedBuilding,
  hoveredBuildingId,
  selectedPoi,
  route,
  userLat,
  userLon,
  userAccuracy,
  onSelectBuilding,
  onHoverBuilding,
  onSelectPoi,
  onViewerReady,
}) => {
  const viewerRef = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);
  const updateLODRef = useRef<(() => void) | null>(null);
  const satelliteLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const osmLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const [currentLOD, setCurrentLOD] = useState<BuildingLOD>('LOD3');

  // Initialize camera and imagery layers once viewer is mounted
  const handleViewerLoaded = useCallback(
    async (viewer: Cesium.Viewer) => {
      if (!viewer || viewer.isDestroyed() || isInitializedRef.current) return;
      isInitializedRef.current = true;

      // Enable atmospheric effects, lighting & shadows
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.depthTestAgainstTerrain = false;
      viewer.scene.highDynamicRange = true;
      viewer.shadows = true;

      // Dynamic Camera Distance calculation with hysteresis to prevent rapid LOD thrashing
      const updateLOD = () => {
        if (!viewer || viewer.isDestroyed()) return;
        const height = viewer.camera.positionCartographic.height;
        setCurrentLOD((prev) => {
          if (prev === 'LOD3' && height > 375) return 'LOD2';
          if (prev === 'LOD2' && height < 325) return 'LOD3';
          if (prev === 'LOD2' && height > 1050) return 'LOD1';
          if (prev === 'LOD1' && height < 950) return 'LOD2';
          return prev;
        });
      };

      updateLODRef.current = updateLOD;
      viewer.camera.moveEnd.addEventListener(updateLOD);

      // Fly to initial SAHE campus view
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          CAMPUS_CONFIG.longitude,
          CAMPUS_CONFIG.latitude - 0.003, // slight southern offset for pitch view
          CAMPUS_CONFIG.initialHeight
        ),
        orientation: {
          heading: Cesium.Math.toRadians(CAMPUS_CONFIG.defaultHeading),
          pitch: Cesium.Math.toRadians(CAMPUS_CONFIG.defaultPitch),
          roll: CAMPUS_CONFIG.defaultRoll,
        },
        duration: 2.8,
      });

      // Configure high-resolution Esri World Imagery for satellite
      try {
        const esriProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
          { enablePickFeatures: false }
        );
        if (!viewer.isDestroyed()) {
          const satLayer = viewer.imageryLayers.addImageryProvider(esriProvider);
          satelliteLayerRef.current = satLayer;
          satLayer.show = layers.satellite;
        }
      } catch (err) {
        console.warn('Esri satellite imagery fallback load error:', err);
      }

      // Add OpenStreetMap layer as alternate vector street base map
      try {
        const osmProvider = new Cesium.UrlTemplateImageryProvider({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          maximumLevel: 19,
        });
        if (!viewer.isDestroyed()) {
          const osmLayer = viewer.imageryLayers.addImageryProvider(osmProvider, 0);
          osmLayerRef.current = osmLayer;
          osmLayer.show = !layers.satellite;
        }
      } catch (err) {
        console.warn('OSM layer load error:', err);
      }

      if (onViewerReady) {
        onViewerReady(viewer);
      }
    },
    [onViewerReady]
  );

  useEffect(() => {
    if (viewerRef.current?.cesiumElement && !isInitializedRef.current) {
      handleViewerLoaded(viewerRef.current.cesiumElement);
    }

    return () => {
      if (viewerRef.current?.cesiumElement && updateLODRef.current) {
        const v = viewerRef.current.cesiumElement as Cesium.Viewer;
        if (!v.isDestroyed()) {
          v.camera.moveEnd.removeEventListener(updateLODRef.current);
        }
      }
    };
  }, [handleViewerLoaded]);

  // Update imagery layer visibility cleanly without reinitializing viewer or flying camera
  useEffect(() => {
    if (satelliteLayerRef.current) {
      satelliteLayerRef.current.show = layers.satellite;
    }
    if (osmLayerRef.current) {
      osmLayerRef.current.show = !layers.satellite;
    }
  }, [layers.satellite]);

  // Handle building selection flyTo
  useEffect(() => {
    if (selectedBuilding && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement as Cesium.Viewer;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          selectedBuilding.longitude,
          selectedBuilding.latitude - 0.0012,
          selectedBuilding.height + 150
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-38),
          roll: 0,
        },
        duration: 1.8,
      });
    }
  }, [selectedBuilding]);

  // Handle POI selection flyTo
  useEffect(() => {
    if (selectedPoi && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement as Cesium.Viewer;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          selectedPoi.longitude,
          selectedPoi.latitude - 0.0008,
          90
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-35),
          roll: 0,
        },
        duration: 1.5,
      });
    }
  }, [selectedPoi]);

  // Handle Route flyTo
  useEffect(() => {
    if (route && route.coordinates.length > 0 && viewerRef.current?.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement as Cesium.Viewer;
      const midIdx = Math.floor(route.coordinates.length / 2);
      const [midLon, midLat] = route.coordinates[midIdx];

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(midLon, midLat - 0.002, 350),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
        duration: 2.0,
      });
    }
  }, [route]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#080B12] overflow-hidden select-none">
      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        infoBox={false}
        selectionIndicator={false}
        className="w-full h-full"
      >
        {/* Campus Boundary Layer */}
        <CampusBoundary visible={layers.boundary} />

        {/* Campus Landscaping (Plazas, Lawns, Trees, Streetlights) in Architectural Mode */}
        <LandscapingLayer visible={renderMode === 'architectural'} />

        {/* 3D Buildings Layer with LOD and Architectural Profiles */}
        <BuildingLayer
          visible={layers.buildings}
          showLabels={layers.labels}
          renderMode={renderMode}
          currentLOD={currentLOD}
          selectedBuildingId={selectedBuilding?.id}
          hoveredBuildingId={hoveredBuildingId}
          onSelectBuilding={onSelectBuilding}
          onHoverBuilding={onHoverBuilding}
        />

        {/* POI Markers Layer */}
        <POILayer
          visible={layers.pois}
          showLabels={layers.labels}
          selectedPoiId={selectedPoi?.id}
          onSelectPoi={onSelectPoi}
        />

        {/* Dynamic Walking Route Layer */}
        <NavigationRoute route={route} />

        {/* User Geolocation Layer */}
        <UserLocation
          latitude={userLat}
          longitude={userLon}
          accuracy={userAccuracy}
        />
      </Viewer>
    </div>
  );
};
