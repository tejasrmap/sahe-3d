import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import { CAMPUS_POIS } from '../../data/pois';
import { CAMPUS_CONFIG } from '../../data/campusConfig';
import { Building, POI, MapLayerState } from '../../types/campus';
import { GlassPanel } from '../ui/GlassPanel';
import { IconButton } from '../ui/IconButton';
import { MapRenderMode } from '../map/BuildingLayer';
import { CameraPresetType } from '../../hooks/useCameraPresets';
import { TimeOfDayPreset } from '../../systems/lighting/timeOfDaySystem';
import {
  Compass,
  Navigation,
  Bookmark,
  Building2,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Drama,
  Trophy,
  Coffee,
  Home,
  Car,
  Shield,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  ExternalLink,
  Sparkles,
  Camera,
  Layers,
  Footprints,
  Eye,
  Sun,
  Sunset,
  Moon,
  Keyboard,
  RotateCcw,
  Play,
  Check,
  DoorOpen
} from 'lucide-react';
import { clsx } from 'clsx';

export type SidebarSection = 'explore' | 'navigation' | 'modes' | 'presets' | 'help';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedBuildingId: string | null;
  onSelectBuilding: (building: Building) => void;
  onSelectPoi: (poi: POI) => void;
  onOpenNavigation: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  renderMode?: MapRenderMode;
  onToggleRenderMode?: () => void;
  timeOfDay?: TimeOfDayPreset;
  onSelectTimeOfDay?: (time: TimeOfDayPreset) => void;
  onStartImmersive?: () => void;
  onOpenIndoor?: (building?: Building) => void;
  onSelectPreset?: (preset: CameraPresetType) => void;
  onFlyToPresetLocation?: (presetId: string) => void;
  onOpenTour?: () => void;
  onResetWelcome?: () => void;
  layers?: MapLayerState;
  onToggleLayer?: (layer: keyof MapLayerState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  selectedBuildingId,
  onSelectBuilding,
  onSelectPoi,
  onOpenNavigation,
  favoriteIds,
  onToggleFavorite,
  renderMode = 'architectural',
  onToggleRenderMode,
  timeOfDay = 'goldenHour',
  onSelectTimeOfDay,
  onStartImmersive,
  onOpenIndoor,
  onSelectPreset,
  onFlyToPresetLocation,
  onOpenTour,
  onResetWelcome,
  layers,
  onToggleLayer,
}) => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('explore');
  const [exploreFilter, setExploreFilter] = useState<string>('all');
  const [routeFrom, setRouteFrom] = useState<string>('main-entrance-portal');
  const [routeTo, setRouteTo] = useState<string>('cse-it-complex');

  // Filter buildings for explore section
  const filteredBuildings = CAMPUS_BUILDINGS.filter((b) => {
    if (exploreFilter === 'all') return true;
    if (exploreFilter === 'academic') return b.category === 'academic';
    if (exploreFilter === 'amenities') {
      return ['cafeteria', 'sports', 'medical', 'parking'].includes(b.category);
    }
    if (exploreFilter === 'hostel') return b.category === 'hostel';
    if (exploreFilter === 'saved') return favoriteIds.includes(b.id);
    return b.category === exploreFilter;
  });

  const quickPresets = [
    { id: 'overview', name: 'Campus Aerial Overview', icon: Compass, desc: 'High-altitude full perimeter view' },
    { id: 'quad', name: 'Academic Quadrangle', icon: GraduationCap, desc: 'CSE, ECE, Mech & Admin blocks' },
    { id: 'sports', name: 'Sports & Athletic Arena', icon: Trophy, desc: 'Cricket ground & Indoor gymnasium' },
    { id: 'hostels', name: 'Hostels & Residences', icon: Home, desc: 'Boys and Girls residential blocks' },
    { id: 'gate', name: 'Ceremonial Main Gate', icon: DoorOpen, desc: 'North entrance portal & boulevard' },
  ];

  const handlePresetClick = (presetId: string) => {
    if (onFlyToPresetLocation) {
      onFlyToPresetLocation(presetId);
    } else if (onSelectPreset) {
      if (presetId === 'overview') onSelectPreset('overview');
      else if (presetId === 'quad') onSelectPreset('architectural');
      else if (presetId === 'sports') onSelectPreset('architectural');
      else onSelectPreset('overview');
    }
  };

  return (
    <aside
      aria-label="Campus navigation sidebar"
      className={clsx(
        'fixed top-20 bottom-6 left-3 z-30 flex transition-all duration-300 pointer-events-none',
        isOpen ? 'w-84 sm:w-96' : 'w-16 sm:w-20'
      )}
    >
      <GlassPanel className="flex flex-col w-full h-full border border-white/10 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto bg-slate-950/85 backdrop-blur-xl">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Campus Directory
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                {CAMPUS_BUILDINGS.length} Buildings
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
          )}

          <IconButton
            size="sm"
            variant="ghost"
            icon={isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            onClick={onToggle}
          />
        </div>

        {/* 5 Main Navigation Sections (Visible Text Tabs) */}
        {isOpen ? (
          <div className="grid grid-cols-5 p-1.5 mx-2 my-2 rounded-xl bg-slate-900/90 border border-white/5 shrink-0 text-[11px] font-medium text-center">
            <button
              type="button"
              onClick={() => setActiveSection('explore')}
              className={clsx(
                'py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5',
                activeSection === 'explore'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('navigation')}
              className={clsx(
                'py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5',
                activeSection === 'navigation'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('modes')}
              className={clsx(
                'py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5',
                activeSection === 'modes'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('presets')}
              className={clsx(
                'py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5',
                activeSection === 'presets'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('help')}
              className={clsx(
                'py-1.5 rounded-lg transition-all flex flex-col items-center gap-0.5',
                activeSection === 'help'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
          </div>
        ) : (
          /* Collapsed View: Clear vertical pill with visible labels under each icon */
          <div className="flex-1 flex flex-col items-center py-2 gap-3 overflow-y-auto scrollbar-none text-[10px] font-medium text-slate-400">
            <button
              type="button"
              onClick={() => {
                setActiveSection('explore');
                onToggle();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-colors"
              title="Explore Buildings Directory"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="scale-90">Explore</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('navigation');
                onToggle();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-colors"
              title="Walking Directions & Routes"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span className="scale-90">Routes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('modes');
                onToggle();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-colors"
              title="Digital Twin Modes & Walk"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="scale-90">Modes</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('presets');
                onToggle();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-colors"
              title="Quick Camera Presets"
            >
              <Camera className="w-4 h-4 text-teal-300" />
              <span className="scale-90">Presets</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSection('help');
                onToggle();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-colors"
              title="Help & Welcome Guide"
            >
              <Info className="w-4 h-4 text-slate-300" />
              <span className="scale-90">Help</span>
            </button>
          </div>
        )}

        {/* Section Content (When Expanded) */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-white/10 space-y-4">
            {/* 1. EXPLORE SECTION */}
            {activeSection === 'explore' && (
              <div className="space-y-3">
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    { id: 'all', label: 'All (12)' },
                    { id: 'academic', label: 'Academic' },
                    { id: 'amenities', label: 'Amenities' },
                    { id: 'hostel', label: 'Hostels' },
                    { id: 'saved', label: `Saved (${favoriteIds.length})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setExploreFilter(filter.id)}
                      className={clsx(
                        'px-2.5 py-1 rounded-lg transition-colors font-medium',
                        exploreFilter === filter.id
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Building Cards List */}
                <div className="space-y-2">
                  {filteredBuildings.map((building) => {
                    const isSelected = selectedBuildingId === building.id;
                    const isFav = favoriteIds.includes(building.id);
                    return (
                      <div
                        key={building.id}
                        onClick={() => onSelectBuilding(building)}
                        className={clsx(
                          'p-3 rounded-xl border transition-all cursor-pointer group',
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/15'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                                {building.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                              <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold">
                                {building.code}
                              </span>
                              <span>{building.floors} Floors</span>
                              <span>•</span>
                              <span className="capitalize">{building.category}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(building.id);
                            }}
                            className="p-1 text-slate-400 hover:text-yellow-400 transition-colors"
                            title={isFav ? 'Remove from Saved' : 'Save Building'}
                          >
                            <Bookmark className={clsx('w-3.5 h-3.5', isFav && 'fill-yellow-400 text-yellow-400')} />
                          </button>
                        </div>
                        {building.departments.length > 0 && (
                          <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-1">
                            {building.departments.join(', ')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Map Layers Inside Directory */}
                {layers && onToggleLayer && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      Map Layer Toggles
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => onToggleLayer('satellite')}
                        className={clsx(
                          'p-2 rounded-lg border text-left flex items-center justify-between',
                          layers.satellite ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <span>Satellite Imagery</span>
                        {layers.satellite && <Check className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleLayer('buildings')}
                        className={clsx(
                          'p-2 rounded-lg border text-left flex items-center justify-between',
                          layers.buildings ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <span>3D Buildings</span>
                        {layers.buildings && <Check className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleLayer('boundary')}
                        className={clsx(
                          'p-2 rounded-lg border text-left flex items-center justify-between',
                          layers.boundary ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <span>Perimeter Boundary</span>
                        {layers.boundary && <Check className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleLayer('pois')}
                        className={clsx(
                          'p-2 rounded-lg border text-left flex items-center justify-between',
                          layers.pois ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <span>Points of Interest</span>
                        {layers.pois && <Check className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. NAVIGATION & ROUTES SECTION */}
            {activeSection === 'navigation' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm mb-1">
                    <Navigation className="w-4 h-4" />
                    Turn-by-Turn Pedestrian Navigation
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Dijkstra shortest-path routing along verified outdoor paved pathways with zero building intersections.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenNavigation}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md hover:scale-[1.01] transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Interactive Routing Panel</span>
                </button>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2.5">
                  <span className="font-bold text-slate-300 text-xs">Quick Route Calculator</span>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400">From:</label>
                    <select
                      value={routeFrom}
                      onChange={(e) => setRouteFrom(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                    >
                      {CAMPUS_BUILDINGS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400">To:</label>
                    <select
                      value={routeTo}
                      onChange={(e) => setRouteTo(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                    >
                      {CAMPUS_BUILDINGS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenNavigation();
                    }}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-emerald-300 font-semibold text-[11px] transition-colors"
                  >
                    Calculate Shortest Walking Route
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                    Accessible Campus Routing
                  </span>
                  <p>All 23 campus path edges feature curb ramps, paving, and obstacle-free traversal.</p>
                </div>
              </div>
            )}

            {/* 3. MODES SECTION */}
            {activeSection === 'modes' && (
              <div className="space-y-3.5 text-xs">
                {/* 3D Architectural Twin vs Satellite */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    3D Digital Twin Rendering Style
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (renderMode !== 'architectural' && onToggleRenderMode) onToggleRenderMode();
                      }}
                      className={clsx(
                        'p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all',
                        renderMode === 'architectural'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      )}
                    >
                      Architectural Twin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (renderMode !== 'geographic' && onToggleRenderMode) onToggleRenderMode();
                      }}
                      className={clsx(
                        'p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all',
                        renderMode === 'geographic'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      )}
                    >
                      Geographic Satellite
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {renderMode === 'architectural'
                      ? 'Procedural architectural facades, windows, doors, roof parapets, and 3D campus foliage enabled.'
                      : 'High-resolution satellite imagery draped over 3D terrain and building extrusions.'}
                  </p>
                </div>

                {/* Immersive Walk Mode */}
                {onStartImmersive && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                      <Footprints className="w-4 h-4" />
                      Immersive First-Person Walk Mode
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Explore campus grounds on foot using WASD keyboard controls, collision boundaries, and mouse look.
                    </p>
                    <button
                      type="button"
                      onClick={onStartImmersive}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                    >
                      Enter Walking Mode (WASD)
                    </button>
                  </div>
                )}

                {/* Indoor Exploration */}
                {onOpenIndoor && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-300" />
                      Indoor Digital Twin
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Inspect multi-floor room blueprints, lab facilities, faculty rooms, stairs, and elevators.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenIndoor()}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
                    >
                      Explore Building Interiors
                    </button>
                  </div>
                )}

                {/* Lighting Controls */}
                {onSelectTimeOfDay && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                    <span className="font-bold text-white text-xs">Lighting & Atmosphere</span>
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => onSelectTimeOfDay('noon')}
                        className={clsx(
                          'p-2 rounded-lg border text-center font-medium flex items-center justify-center gap-1',
                          timeOfDay === 'noon' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <Sun className="w-3 h-3" />
                        <span>Day</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectTimeOfDay('goldenHour')}
                        className={clsx(
                          'p-2 rounded-lg border text-center font-medium flex items-center justify-center gap-1',
                          timeOfDay === 'goldenHour' ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 font-bold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <Sunset className="w-3 h-3" />
                        <span>Sunset</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectTimeOfDay('night')}
                        className={clsx(
                          'p-2 rounded-lg border text-center font-medium flex items-center justify-center gap-1',
                          timeOfDay === 'night' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold' : 'bg-white/5 border-white/5 text-slate-400'
                        )}
                      >
                        <Moon className="w-3 h-3" />
                        <span>Night</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. PRESETS SECTION */}
            {activeSection === 'presets' && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Camera Vantage Points
                </span>
                <div className="space-y-2">
                  {quickPresets.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetClick(preset.id)}
                        className="w-full p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.07] hover:border-emerald-500/30 transition-all text-left flex items-start gap-3 group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block">
                            {preset.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {preset.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. HELP & ABOUT SECTION */}
            {activeSection === 'help' && (
              <div className="space-y-3.5 text-xs">
                {/* Guided Tour Launcher */}
                {onOpenTour && (
                  <button
                    type="button"
                    onClick={onOpenTour}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">Start Guided Campus Tour</span>
                        <span className="text-[11px] text-emerald-300">Cinematic automated flight</span>
                      </div>
                    </div>
                  </button>
                )}

                {/* Keyboard Shortcuts */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
                    Keyboard Controls
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
                      <span className="font-mono text-emerald-400 font-bold">WASD</span>
                      <span>Walk</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
                      <span className="font-mono text-emerald-400 font-bold">Shift</span>
                      <span>Sprint</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
                      <span className="font-mono text-emerald-400 font-bold">Mouse</span>
                      <span>Look / Pan</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-white/5">
                      <span className="font-mono text-emerald-400 font-bold">ESC</span>
                      <span>Exit Mode</span>
                    </div>
                  </div>
                </div>

                {/* Reset Welcome Guide */}
                {onResetWelcome && (
                  <button
                    type="button"
                    onClick={onResetWelcome}
                    className="w-full py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-teal-300" />
                    <span>Reset First-Time Welcome Guide</span>
                  </button>
                )}

                {/* About SAHE */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300 block">About SAHE Campus</span>
                  <p>{CAMPUS_CONFIG.campusFullName}</p>
                  <p>{CAMPUS_CONFIG.campusLocation}</p>
                  <p className="text-emerald-400 font-medium pt-1">{CAMPUS_CONFIG.accreditation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassPanel>
    </aside>
  );
};
