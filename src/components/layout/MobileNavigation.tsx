import React from 'react';
import { Compass, Navigation, Layers, Locate, Footprints, Play } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { clsx } from 'clsx';

interface MobileNavigationProps {
  onOpenDirectory: () => void;
  onOpenNavigation: () => void;
  onOpenLayers: () => void;
  onOpenSearch: () => void;
  onLocateMe: () => void;
  onStartImmersive?: () => void;
  onStartTour?: () => void;
  isLocating?: boolean;
  isDirectoryOpen: boolean;
  isNavigationOpen: boolean;
  isLayersOpen: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onOpenDirectory,
  onOpenNavigation,
  onOpenLayers,
  onOpenSearch,
  onLocateMe,
  onStartImmersive,
  onStartTour,
  isLocating = false,
  isDirectoryOpen,
  isNavigationOpen,
  isLayersOpen,
}) => {
  return (
    <div className="fixed bottom-2 left-2 right-2 z-30 sm:hidden pointer-events-auto">
      <GlassPanel className="h-14 px-2 flex items-center justify-around border border-white/10 shadow-2xl rounded-2xl">
        <button
          type="button"
          onClick={onOpenDirectory}
          className={clsx(
            'flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
            isDirectoryOpen ? 'text-emerald-400 font-bold' : 'text-slate-400'
          )}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>

        <button
          type="button"
          onClick={onOpenNavigation}
          className={clsx(
            'flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
            isNavigationOpen ? 'text-emerald-400 font-bold' : 'text-slate-400'
          )}
        >
          <Navigation className="w-4 h-4" />
          <span>Route</span>
        </button>

        {onStartImmersive && (
          <button
            type="button"
            onClick={onStartImmersive}
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Footprints className="w-4 h-4" />
            <span>Walk</span>
          </button>
        )}

        {onStartTour && (
          <button
            type="button"
            onClick={onStartTour}
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tour</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenLayers}
          className={clsx(
            'flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors',
            isLayersOpen ? 'text-emerald-400 font-bold' : 'text-slate-400'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Layers</span>
        </button>

        <button
          type="button"
          onClick={onLocateMe}
          className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Locate</span>
        </button>
      </GlassPanel>
    </div>
  );
};
