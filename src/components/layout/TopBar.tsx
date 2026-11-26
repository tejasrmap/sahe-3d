import React from 'react';
import { Compass, Sparkles, Layers, Locate, Maximize2, Minimize2, Map } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { IconButton } from '../ui/IconButton';
import { CampusSearch } from '../search/CampusSearch';
import { SearchResultItem } from '../../hooks/useCampusSearch';

interface TopBarProps {
  onSelectItem: (item: SearchResultItem) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onLocateMe: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleLayersMenu: () => void;
  isLayersMenuOpen: boolean;
  isLocating?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSelectItem,
  onToggleSidebar,
  isSidebarOpen,
  onLocateMe,
  isFullscreen,
  onToggleFullscreen,
  onToggleLayersMenu,
  isLayersMenuOpen,
  isLocating = false,
}) => {
  return (
    <header className="fixed top-3 left-3 right-3 z-30 flex items-center justify-between gap-3 pointer-events-none">
      {/* Left: University Branding */}
      <div className="pointer-events-auto">
        <GlassPanel className="h-12 px-3.5 flex items-center gap-3 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex items-center gap-3 text-left focus:outline-none group"
            title="Toggle Campus Directory & Navigation"
          >
            {/* Logo Emblem */}
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-sm">
              <div className="w-full h-full bg-slate-950/90 rounded-xl flex items-center justify-center">
                <Compass className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* University Identity */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm font-extrabold tracking-tight text-white">SAHE</span>
                <span className="text-xs font-semibold text-emerald-400">EXPLORER</span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Campus Digital Twin
              </span>
            </div>
          </button>
        </GlassPanel>
      </div>

      {/* Center: Universal Search */}
      <div className="pointer-events-auto flex-1 max-w-xl mx-auto">
        <CampusSearch onSelectItem={onSelectItem} />
      </div>

      {/* Right: Quick Action Controls */}
      <div className="pointer-events-auto">
        <GlassPanel className="h-12 px-2 flex items-center gap-1.5 border border-white/10">
          <IconButton
            icon={<Map className="w-4 h-4" />}
            label="Campus Directory"
            active={isSidebarOpen}
            variant={isSidebarOpen ? 'primary' : 'ghost'}
            onClick={onToggleSidebar}
          />
          <IconButton
            icon={<Layers className="w-4 h-4" />}
            label="Map Layers"
            active={isLayersMenuOpen}
            variant={isLayersMenuOpen ? 'primary' : 'ghost'}
            onClick={onToggleLayersMenu}
          />
          <IconButton
            icon={<Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />}
            label="My Location"
            onClick={onLocateMe}
          />
          <IconButton
            icon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            label="Toggle Fullscreen"
            onClick={onToggleFullscreen}
            className="hidden sm:inline-flex"
          />
        </GlassPanel>
      </div>
    </header>
  );
};
