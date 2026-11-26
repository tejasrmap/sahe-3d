import React from 'react';
import {
  Compass,
  Footprints,
  Navigation,
  X,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  MapPin,
  Flame,
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { ProximityTarget } from '../../systems/discovery/proximityEngine';
import { NavigationRoute, Building } from '../../types/campus';
import { TimeOfDayPreset, TIME_PRESETS } from '../../systems/lighting/timeOfDaySystem';
import { clsx } from 'clsx';

interface ImmersiveHUDProps {
  speedKmh: number;
  isSprinting: boolean;
  isColliding: boolean;
  nearestDiscovery: ProximityTarget | null;
  activeRoute: NavigationRoute | null;
  currentTimePreset: TimeOfDayPreset;
  onSelectTimePreset: (preset: TimeOfDayPreset) => void;
  onInspectBuilding: (building: Building) => void;
  onExit: () => void;
  // Mobile virtual joystick props
  onVirtualMove?: (moveX: number, moveY: number, sprint: boolean) => void;
}

export const ImmersiveHUD: React.FC<ImmersiveHUDProps> = ({
  speedKmh,
  isSprinting,
  isColliding,
  nearestDiscovery,
  activeRoute,
  currentTimePreset,
  onSelectTimePreset,
  onInspectBuilding,
  onExit,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 font-sans select-none">
      {/* Top HUD Bar: Direction, Speed, Time of Day, Exit */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Walking Metrics */}
        <GlassPanel className="h-11 px-3.5 flex items-center gap-3 border border-white/10 shadow-2xl rounded-2xl">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isSprinting ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {isSprinting ? 'Sprinting' : 'Walking Pace'}
              </span>
              <span className="text-xs font-bold text-white">
                {speedKmh} km/h
              </span>
            </div>
          </div>

          {/* Collision Warning Banner */}
          {isColliding && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Wall Collision</span>
            </div>
          )}
        </GlassPanel>

        {/* Center: Time-of-Day Quick Switcher */}
        <GlassPanel className="h-11 px-2 hidden sm:flex items-center gap-1 border border-white/10 shadow-2xl rounded-2xl">
          {(Object.keys(TIME_PRESETS) as TimeOfDayPreset[]).map((key) => {
            const preset = TIME_PRESETS[key];
            const isSelected = currentTimePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectTimePreset(key)}
                className={clsx(
                  'px-2.5 py-1 rounded-xl text-xs font-medium transition-all duration-200',
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-neon-green'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )}
              >
                {preset.label.split(' ')[0]}
              </button>
            );
          })}
        </GlassPanel>

        {/* Right: Controls & Exit Button */}
        <div className="flex items-center gap-2">
          <GlassPanel className="h-11 px-3 hidden md:flex items-center gap-2 border border-white/10 text-xs text-slate-300 rounded-2xl">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-emerald-400">WASD</kbd>
            <span>Move</span>
            <span className="text-white/20">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-emerald-400">Shift</kbd>
            <span>Sprint</span>
            <span className="text-white/20">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-emerald-400">Mouse</kbd>
            <span>Look</span>
          </GlassPanel>

          <button
            type="button"
            onClick={onExit}
            className="h-11 px-4 flex items-center gap-1.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold shadow-lg transition-all active:scale-95"
            title="Exit First-Person Mode (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Exit Mode</span>
            <kbd className="hidden sm:inline-block ml-1 text-[10px] text-rose-200 opacity-60 font-mono">ESC</kbd>
          </button>
        </div>
      </div>

      {/* Crosshair Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full border border-emerald-400/60 bg-emerald-400/20 shadow-neon-green" />
      </div>

      {/* Bottom Area: Proximity Discovery & Navigation Guidance */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        {/* Active Route Step-by-Step HUD Prompt */}
        {activeRoute && activeRoute.steps.length > 0 ? (
          <GlassPanel className="p-3 max-w-md border border-emerald-500/30 shadow-2xl rounded-2xl space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 fill-current" />
                Next Route Step
              </span>
              <span className="text-[11px] text-slate-400">
                {activeRoute.distanceMeters}m remaining
              </span>
            </div>
            <p className="text-xs font-medium text-white leading-snug">
              {activeRoute.steps[1] || activeRoute.steps[0]}
            </p>
          </GlassPanel>
        ) : (
          <div />
        )}

        {/* Nearby Building / POI Interactive Discovery Card */}
        {nearestDiscovery && (
          <GlassPanel className="p-3 max-w-sm border border-white/15 shadow-2xl rounded-2xl animate-fade-in flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block truncate">
                Discovered • {nearestDiscovery.distanceMeters}m away
              </span>
              <h4 className="text-sm font-bold text-white truncate">
                {nearestDiscovery.name}
              </h4>
            </div>

            {nearestDiscovery.building && (
              <button
                type="button"
                onClick={() => onInspectBuilding(nearestDiscovery.building!)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-neon-green transition-all"
              >
                View Info
              </button>
            )}
          </GlassPanel>
        )}
      </div>
    </div>
  );
};
