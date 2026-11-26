import React from 'react';
import { IndoorRoom, RoomCategory } from '../../data/indoor/types';
import { GlassPanel } from '../ui/GlassPanel';
import {
  X,
  Navigation,
  Sparkles,
  Users,
  GraduationCap,
  Maximize2,
  Tag,
  Monitor,
  CheckCircle,
} from 'lucide-react';

interface RoomDetailsCardProps {
  room: IndoorRoom | null;
  onClose: () => void;
  onNavigateToRoom: (room: IndoorRoom) => void;
  isNavigatingTo?: boolean;
}

const CATEGORY_COLORS: Record<RoomCategory, { bg: string; text: string; border: string }> = {
  laboratory: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  classroom: { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  faculty_office: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
  department_office: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  seminar_hall: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  meeting_room: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  library: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
  reception: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30' },
  server_room: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
  student_lounge: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  washroom: { bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/30' },
  storage: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' },
  corridor: { bg: 'bg-slate-700/20', text: 'text-slate-400', border: 'border-slate-700/30' },
  staircase: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
  elevator: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300', border: 'border-fuchsia-500/30' },
  cafeteria: { bg: 'bg-amber-600/20', text: 'text-amber-400', border: 'border-amber-600/30' },
};

export const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
  room,
  onClose,
  onNavigateToRoom,
  isNavigatingTo = false,
}) => {
  if (!room) return null;

  const style = CATEGORY_COLORS[room.category] || CATEGORY_COLORS.classroom;

  return (
    <div className="w-full sm:w-96 pointer-events-auto animate-fade-in font-sans">
      <GlassPanel className="p-4 border border-white/20 shadow-2xl rounded-2xl bg-slate-950/90 backdrop-blur-2xl space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-sm">
                {room.number}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
                {room.category.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug">
              {room.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Room Stats */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
          {room.capacity && (
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Capacity: <strong className="text-white">{room.capacity}</strong></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-300">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{room.dimensions.width}m × {room.dimensions.length}m</span>
          </div>
          {room.department && (
            <div className="col-span-2 flex items-center gap-2 text-slate-300 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{room.department}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-xs text-slate-300 leading-relaxed">
            {room.description}
          </p>
        )}

        {/* Equipment & Lab Facilities */}
        {room.equipment && room.equipment.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Monitor className="w-3 h-3 text-amber-400" />
              Installed Equipment & Hardware
            </span>
            <div className="flex flex-wrap gap-1">
              {room.equipment.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/80 border border-white/5 text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onNavigateToRoom(room)}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md ${
              isNavigatingTo
                ? 'bg-emerald-600 text-white shadow-neon-green'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-neon-green active:scale-98'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>{isNavigatingTo ? 'Indoor Path Active' : 'Navigate to Room'}</span>
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};
