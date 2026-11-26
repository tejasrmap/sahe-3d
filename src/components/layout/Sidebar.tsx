import React, { useState } from 'react';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import { CAMPUS_POIS } from '../../data/pois';
import { CAMPUS_CONFIG } from '../../data/campusConfig';
import { Building, POI, BuildingCategory } from '../../types/campus';
import { GlassPanel } from '../ui/GlassPanel';
import { IconButton } from '../ui/IconButton';
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
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedBuildingId: string | null;
  onSelectBuilding: (building: Building) => void;
  onSelectPoi: (poi: POI) => void;
  onOpenNavigation: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

type SidebarTab = 'discover' | 'navigation' | 'favorites' | 'about';

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  selectedBuildingId,
  onSelectBuilding,
  onSelectPoi,
  onOpenNavigation,
  favoriteIds,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Places', icon: Compass },
    { id: 'academic', label: 'Academic Blocks', icon: GraduationCap },
    { id: 'administration', label: 'Administration & Library', icon: Shield },
    { id: 'laboratory', label: 'Advanced Labs', icon: FlaskConical },
    { id: 'auditorium', label: 'Auditoriums', icon: Drama },
    { id: 'sports', label: 'Sports Complex', icon: Trophy },
    { id: 'cafeteria', label: 'Food & Dining', icon: Coffee },
    { id: 'hostel', label: 'Student Hostels', icon: Home },
    { id: 'medical', label: 'Health Center', icon: HeartPulse },
    { id: 'parking', label: 'Parking Plazas', icon: Car },
  ];

  const filteredBuildings = CAMPUS_BUILDINGS.filter((b) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'laboratory') {
      return b.facilities.some((f) => f.toLowerCase().includes('lab') || f.toLowerCase().includes('coe'));
    }
    return b.category === selectedCategory;
  });

  const favoriteBuildings = CAMPUS_BUILDINGS.filter((b) => favoriteIds.includes(b.id));

  return (
    <aside
      aria-label="Campus navigation sidebar"
      className={clsx(
        'fixed top-20 bottom-6 left-3 z-30 flex transition-all duration-300 pointer-events-none',
        isOpen ? 'w-80 sm:w-96' : 'w-14'
      )}
    >
      <GlassPanel className="flex flex-col w-full h-full border border-white/10 shadow-2xl overflow-hidden pointer-events-auto">
        {/* Sidebar Header with Toggle */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Directory & Guide
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
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

        {/* Navigation Tabs (Top pill bar) */}
        {isOpen && (
          <div className="grid grid-cols-4 p-1.5 mx-2 my-2 rounded-xl bg-slate-950/60 border border-white/5 shrink-0 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={clsx(
                'py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1',
                activeTab === 'discover'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('navigation');
                onOpenNavigation();
              }}
              className={clsx(
                'py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1',
                activeTab === 'navigation'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={clsx(
                'py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1',
                activeTab === 'favorites'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={clsx(
                'py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1',
                activeTab === 'about'
                  ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Info</span>
            </button>
          </div>
        )}

        {/* Expanded View Content */}
        {isOpen ? (
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
            {/* TAB 1: DISCOVER */}
            {activeTab === 'discover' && (
              <>
                {/* Horizontal Category Chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={clsx(
                          'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors border',
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400 shadow-sm'
                            : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border-white/5'
                        )}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Building List Cards */}
                <div className="space-y-2">
                  {filteredBuildings.map((building) => {
                    const isSelected = selectedBuildingId === building.id;
                    const isFav = favoriteIds.includes(building.id);

                    return (
                      <div
                        key={building.id}
                        className={clsx(
                          'p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer group',
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/40 shadow-neon-green'
                            : 'bg-slate-800/40 hover:bg-slate-800/80 border-white/5'
                        )}
                        onClick={() => onSelectBuilding(building)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-white/10 text-emerald-400">
                              {building.code}
                            </span>
                            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                              {building.category}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(building.id);
                            }}
                            className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5"
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isFav ? 'fill-emerald-400 text-emerald-400' : ''
                              }`}
                            />
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                          {building.name}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {building.description}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                          <span>{building.floors} Floors • ~{building.height}m</span>
                          <span className="text-emerald-400 font-medium group-hover:underline flex items-center gap-1">
                            Explore <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* TAB 2: NAVIGATION SHORTCUT */}
            {activeTab === 'navigation' && (
              <div className="p-3 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <Navigation className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Campus Route Finder</h4>
                <p className="text-xs text-slate-300">
                  Select start point and destination to find exact walking routes, distances, and travel times.
                </p>
                <button
                  type="button"
                  onClick={onOpenNavigation}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-neon-green transition-all"
                >
                  Open Route Navigator
                </button>
              </div>
            )}

            {/* TAB 3: FAVORITES */}
            {activeTab === 'favorites' && (
              <div>
                {favoriteBuildings.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium text-slate-300">No saved locations</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click the bookmark icon on any building to quickly access it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoriteBuildings.map((building) => (
                      <div
                        key={building.id}
                        onClick={() => onSelectBuilding(building)}
                        className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 cursor-pointer text-left transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{building.name}</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">{building.code}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-1">{building.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ABOUT CAMPUS */}
            {activeTab === 'about' && (
              <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5 space-y-3 text-xs text-slate-300">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{CAMPUS_CONFIG.campusFullName}</h4>
                  <p className="text-slate-400">{CAMPUS_CONFIG.campusLocation}</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accreditation:</span>
                    <span className="text-emerald-400 font-medium">{CAMPUS_CONFIG.accreditation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Established:</span>
                    <span className="text-white font-medium">{CAMPUS_CONFIG.established}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campus Area:</span>
                    <span className="text-white font-medium">{CAMPUS_CONFIG.areaAcres} Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Geographic Center:</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {CAMPUS_CONFIG.latitude.toFixed(4)}° N, {CAMPUS_CONFIG.longitude.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Collapsed View: Icon column */
          <div className="flex-1 flex flex-col items-center py-3 gap-2 overflow-y-auto scrollbar-none">
            <IconButton
              size="md"
              icon={<GraduationCap className="w-4 h-4" />}
              label="Academic Blocks"
              onClick={() => {
                setSelectedCategory('academic');
                setActiveTab('discover');
                onToggle();
              }}
            />
            <IconButton
              size="md"
              icon={<Shield className="w-4 h-4" />}
              label="Administration"
              onClick={() => {
                setSelectedCategory('administration');
                setActiveTab('discover');
                onToggle();
              }}
            />
            <IconButton
              size="md"
              icon={<Drama className="w-4 h-4" />}
              label="Auditorium"
              onClick={() => {
                setSelectedCategory('auditorium');
                setActiveTab('discover');
                onToggle();
              }}
            />
            <IconButton
              size="md"
              icon={<Trophy className="w-4 h-4" />}
              label="Sports Complex"
              onClick={() => {
                setSelectedCategory('sports');
                setActiveTab('discover');
                onToggle();
              }}
            />
            <IconButton
              size="md"
              icon={<Coffee className="w-4 h-4" />}
              label="Cafeteria"
              onClick={() => {
                setSelectedCategory('cafeteria');
                setActiveTab('discover');
                onToggle();
              }}
            />
            <IconButton
              size="md"
              icon={<Home className="w-4 h-4" />}
              label="Hostels"
              onClick={() => {
                setSelectedCategory('hostel');
                setActiveTab('discover');
                onToggle();
              }}
            />
            <IconButton
              size="md"
              icon={<HeartPulse className="w-4 h-4" />}
              label="Medical Center"
              onClick={() => {
                setSelectedCategory('medical');
                setActiveTab('discover');
                onToggle();
              }}
            />
          </div>
        )}
      </GlassPanel>
    </aside>
  );
};
