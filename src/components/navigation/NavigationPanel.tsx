import React from 'react';
import { NavigationTarget } from '../../hooks/useCampusNavigation';
import { NavigationRoute } from '../../types/campus';
import { GlassPanel } from '../ui/GlassPanel';
import { RouteSummary } from './RouteSummary';
import {
  Navigation,
  ArrowUpDown,
  X,
  MapPin,
  CircleDot,
  LocateFixed,
  Footprints,
} from 'lucide-react';

interface NavigationPanelProps {
  startPoint: NavigationTarget | null;
  destination: NavigationTarget | null;
  route: NavigationRoute | null;
  availableTargets: NavigationTarget[];
  onSelectStart: (target: NavigationTarget | null) => void;
  onSelectDestination: (target: NavigationTarget | null) => void;
  onReverseRoute: () => void;
  onClearRoute: () => void;
  onUseMyLocation: () => void;
  onClose: () => void;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  startPoint,
  destination,
  route,
  availableTargets,
  onSelectStart,
  onSelectDestination,
  onReverseRoute,
  onClearRoute,
  onUseMyLocation,
  onClose,
}) => {
  return (
    <GlassPanel className="p-4 w-full border border-white/15 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">
              Campus Walking Navigation
            </h3>
            <span className="text-[11px] text-slate-400">Pedestrian Pathways</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inputs (Start & Destination) */}
      <div className="space-y-2 relative">
        {/* Start Point Input */}
        <div className="flex items-center gap-2">
          <div className="text-emerald-400 shrink-0">
            <CircleDot className="w-4 h-4" />
          </div>
          <div className="flex-1 relative">
            <select
              value={startPoint?.id || ''}
              onChange={(e) => {
                const target = availableTargets.find((t) => t.id === e.target.value) || null;
                onSelectStart(target);
              }}
              className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select starting location...</option>
              {availableTargets.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={onUseMyLocation}
            title="Use My Location"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-white/10 transition-colors"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>

        {/* Reverse route button */}
        <div className="flex items-center justify-center my-0.5">
          <button
            type="button"
            onClick={onReverseRoute}
            title="Reverse Start and Destination"
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Input */}
        <div className="flex items-center gap-2">
          <div className="text-rose-400 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <select
              value={destination?.id || ''}
              onChange={(e) => {
                const target = availableTargets.find((t) => t.id === e.target.value) || null;
                onSelectDestination(target);
              }}
              className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select destination...</option>
              {availableTargets.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Route results or guidance */}
      {route ? (
        <RouteSummary route={route} onClear={onClearRoute} />
      ) : (
        <div className="p-3 text-center rounded-xl bg-slate-800/30 border border-dashed border-white/10 text-slate-400 text-xs">
          Select both start point and destination to compute campus walking path.
        </div>
      )}

      {/* Footer controls */}
      {route && (
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClearRoute}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Clear Route
          </button>
        </div>
      )}
    </GlassPanel>
  );
};
