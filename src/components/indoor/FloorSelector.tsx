import React from 'react';
import { IndoorFloor } from '../../data/indoor/types';
import { GlassPanel } from '../ui/GlassPanel';
import { ChevronUp, ChevronDown, Layers } from 'lucide-react';
import { clsx } from 'clsx';

interface FloorSelectorProps {
  floors: IndoorFloor[];
  activeFloorNumber: number;
  onSelectFloor: (floorNumber: number) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  activeFloorNumber,
  onSelectFloor,
}) => {
  // Sort descending so top floor is at the top (like an elevator control panel)
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  const currentIndex = sortedFloors.findIndex((f) => f.floorNumber === activeFloorNumber);

  const handleNextFloor = () => {
    if (currentIndex > 0) {
      onSelectFloor(sortedFloors[currentIndex - 1].floorNumber);
    }
  };

  const handlePrevFloor = () => {
    if (currentIndex < sortedFloors.length - 1) {
      onSelectFloor(sortedFloors[currentIndex + 1].floorNumber);
    }
  };

  const activeFloor = floors.find((f) => f.floorNumber === activeFloorNumber) || floors[0];

  return (
    <div className="flex flex-col items-center gap-2 pointer-events-auto select-none">
      {/* Elevator Up / Down Buttons */}
      <GlassPanel className="p-1 flex flex-col items-center gap-1 border border-white/15 shadow-2xl rounded-2xl bg-slate-950/80 backdrop-blur-xl">
        <button
          type="button"
          onClick={handleNextFloor}
          disabled={currentIndex <= 0}
          title="Floor Above"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Floor Buttons Stack */}
        <div className="flex flex-col gap-1 py-1">
          {sortedFloors.map((floor) => {
            const isActive = floor.floorNumber === activeFloorNumber;
            return (
              <button
                key={floor.floorNumber}
                type="button"
                onClick={() => onSelectFloor(floor.floorNumber)}
                className={clsx(
                  'relative w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-neon-green scale-105 z-10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                )}
                title={floor.name}
              >
                <span>{floor.levelLabel}</span>
                {isActive && (
                  <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handlePrevFloor}
          disabled={currentIndex >= sortedFloors.length - 1}
          title="Floor Below"
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </GlassPanel>

      {/* Current Floor Elevation Badge */}
      <GlassPanel className="px-2.5 py-1 text-[10px] font-semibold text-slate-300 border border-white/10 rounded-full flex items-center gap-1 shadow-lg">
        <Layers className="w-3 h-3 text-emerald-400" />
        <span>+{activeFloor.elevationMeters}m</span>
      </GlassPanel>
    </div>
  );
};
