import React, { useState, useMemo } from 'react';
import { IndoorBuildingData, IndoorRoom, RoomCategory } from '../../data/indoor/types';
import { GlassPanel } from '../ui/GlassPanel';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';

interface IndoorSearchProps {
  buildingData: IndoorBuildingData;
  onSelectRoom: (room: IndoorRoom, targetFloor: number) => void;
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const IndoorSearch: React.FC<IndoorSearchProps> = ({
  buildingData,
  onSelectRoom,
  activeCategory,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Flatten all rooms across all floors
  const allRooms = useMemo(() => {
    const list: IndoorRoom[] = [];
    for (const floor of buildingData.floors) {
      list.push(...floor.rooms);
    }
    return list;
  }, [buildingData]);

  // Filtered rooms
  const matchingRooms = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allRooms.filter(
      (r) =>
        r.number.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.department && r.department.toLowerCase().includes(q)) ||
        (r.equipment && r.equipment.some((e) => e.toLowerCase().includes(q)))
    ).slice(0, 8);
  }, [query, allRooms]);

  const categories = [
    { id: null, label: 'All Rooms' },
    { id: 'laboratory', label: 'Labs' },
    { id: 'classroom', label: 'Classrooms' },
    { id: 'department_office', label: 'Offices' },
    { id: 'seminar_hall', label: 'Seminar Halls' },
    { id: 'library', label: 'Library' },
  ];

  return (
    <div className="relative w-full max-w-md pointer-events-auto select-none">
      <div className="relative">
        <GlassPanel className="h-10 px-3 flex items-center gap-2 border border-white/15 rounded-xl shadow-lg bg-slate-950/80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search room (e.g. 'G02', 'NVIDIA', 'HOD', 'VLSI')..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </GlassPanel>

        {/* Dropdown Results */}
        {isOpen && matchingRooms.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-50">
            <GlassPanel className="p-1.5 border border-white/20 rounded-xl shadow-2xl bg-slate-950/95 backdrop-blur-2xl max-h-72 overflow-y-auto space-y-1">
              {matchingRooms.map((room) => {
                const floorObj = buildingData.floors.find((f) => f.floorNumber === room.floor);
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      onSelectRoom(room, room.floor);
                      setIsOpen(false);
                    }}
                    className="w-full p-2 rounded-lg flex items-center justify-between text-left hover:bg-white/10 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {room.number}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {floorObj ? floorObj.levelLabel + ' Floor' : `Floor ${room.floor}`}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {room.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </GlassPanel>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm font-bold'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
