import React from 'react';
import { NavigationRoute } from '../../types/campus';
import { formatDistance, formatWalkingTime } from '../../utils/distance';
import { Footprints, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface RouteSummaryProps {
  route: NavigationRoute;
  onClear: () => void;
}

export const RouteSummary: React.FC<RouteSummaryProps> = ({ route, onClear }) => {
  return (
    <div className="space-y-3">
      {/* Route distance and travel time summary card */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900/60 border border-emerald-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Walking Distance</span>
              <span className="text-base font-bold text-white">
                {formatDistance(route.distanceMeters)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Est. Travel Time</span>
              <span className="text-base font-bold text-white">
                {formatWalkingTime(route.estimatedMinutes)}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div className="bg-emerald-400 h-full w-full rounded-full animate-pulse" />
        </div>
      </div>

      {/* Step by Step Walking Directions */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Turn-by-Turn Directions
        </span>
        {route.steps.map((step, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === route.steps.length - 1;

          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-200 py-1.5 px-2 rounded-lg bg-slate-800/30 border border-white/5"
            >
              {isFirst ? (
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : isLast ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-slate-700 text-[9px] font-bold text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  {idx}
                </span>
              )}
              <span className="leading-snug">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
