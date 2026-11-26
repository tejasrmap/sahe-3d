import React, { useState, useEffect } from 'react';
import { Building } from '../../types/campus';
import { IndoorBuildingData, IndoorFloor, IndoorRoom } from '../../data/indoor/types';
import { getIndoorBuildingData } from '../../data/indoor';
import { FloorSelector } from './FloorSelector';
import { IndoorMapCanvas } from './IndoorMapCanvas';
import { RoomDetailsCard } from './RoomDetailsCard';
import { IndoorSearch } from './IndoorSearch';
import { GlassPanel } from '../ui/GlassPanel';
import {
  X,
  Building2,
  Layers,
  ArrowLeft,
  Navigation,
  Compass,
  Sparkles,
  Info,
} from 'lucide-react';

interface IndoorExplorationModalProps {
  building: Building | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IndoorExplorationModal: React.FC<IndoorExplorationModalProps> = ({
  building,
  isOpen,
  onClose,
}) => {
  const [indoorData, setIndoorData] = useState<IndoorBuildingData | null>(null);
  const [activeFloorNumber, setActiveFloorNumber] = useState<number>(0);
  const [selectedRoom, setSelectedRoom] = useState<IndoorRoom | null>(null);
  const [targetRoom, setTargetRoom] = useState<IndoorRoom | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Load building indoor data when opened
  useEffect(() => {
    if (building && isOpen) {
      const data = getIndoorBuildingData(building);
      setIndoorData(data);
      setActiveFloorNumber(0); // default to ground floor
      setSelectedRoom(null);
      setTargetRoom(null);
      setFilterCategory(null);
    }
  }, [building, isOpen]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !building || !indoorData) return null;

  const activeFloor: IndoorFloor =
    indoorData.floors.find((f) => f.floorNumber === activeFloorNumber) || indoorData.floors[0];

  const handleSelectRoomFromSearch = (room: IndoorRoom, targetFloor: number) => {
    setActiveFloorNumber(targetFloor);
    setSelectedRoom(room);
  };

  const handleNavigateToRoom = (room: IndoorRoom) => {
    setTargetRoom(room);
    setActiveFloorNumber(room.floor);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070B13]/95 backdrop-blur-xl select-none font-sans overflow-hidden animate-fade-in">
      {/* Top Indoor Navigation Bar */}
      <header className="h-16 px-4 md:px-6 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-slate-950/80 z-30">
        {/* Left: Building Title & Back to Campus */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95"
            title="Return to Outdoor Campus Map (ESC)"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Exit to Campus</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-sm">
              {indoorData.buildingCode}
            </span>
            <div>
              <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-md">
                {indoorData.buildingName}
              </h1>
              <span className="text-[11px] text-slate-400 block truncate">
                {indoorData.confidence === 'procedurally-estimated' ? '○ Procedural Architectural Layout' : '● Source-Based Floor Blueprint'} · {activeFloor.name}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search & Room Finder */}
        <div className="hidden md:flex flex-1 max-w-sm justify-center">
          <IndoorSearch
            buildingData={indoorData}
            onSelectRoom={handleSelectRoomFromSearch}
            activeCategory={filterCategory}
            onSelectCategory={setFilterCategory}
          />
        </div>

        {/* Right: Floor Badge & Close Button */}
        <div className="flex items-center gap-2">
          <GlassPanel className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 rounded-xl">
            <Layers className="w-3.5 h-3.5" />
            <span>Floor {activeFloor.levelLabel} of {indoorData.totalFloors}</span>
          </GlassPanel>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Indoor View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Floating Elevator Floor Selector */}
        <div className="absolute left-4 top-4 z-30">
          <FloorSelector
            floors={indoorData.floors}
            activeFloorNumber={activeFloorNumber}
            onSelectFloor={(num) => {
              setActiveFloorNumber(num);
              // If selected room is on a different floor, clear selection
              if (selectedRoom && selectedRoom.floor !== num) {
                setSelectedRoom(null);
              }
            }}
          />
        </div>

        {/* Floor Plan 2.5D / 3D Canvas */}
        <IndoorMapCanvas
          floor={activeFloor}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          targetRoom={targetRoom}
          filterCategory={filterCategory}
        />

        {/* Selected Room Details Drawer (Floating Bottom Right) */}
        {selectedRoom && (
          <div className="absolute right-4 bottom-4 z-40">
            <RoomDetailsCard
              room={selectedRoom}
              onClose={() => setSelectedRoom(null)}
              onNavigateToRoom={handleNavigateToRoom}
              isNavigatingTo={targetRoom?.id === selectedRoom.id}
            />
          </div>
        )}

        {/* Active Navigation Waypoint Toast */}
        {targetRoom && targetRoom.floor === activeFloorNumber && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <GlassPanel className="px-4 py-2 border border-emerald-500/40 rounded-full shadow-neon-green flex items-center gap-2 text-xs font-bold text-emerald-300 bg-slate-950/90">
              <Navigation className="w-3.5 h-3.5 text-emerald-400 fill-current animate-pulse" />
              <span>Route Active: Entrance → {targetRoom.number} ({targetRoom.name})</span>
              <button
                type="button"
                onClick={() => setTargetRoom(null)}
                className="ml-2 text-slate-400 hover:text-white"
                title="Cancel Route"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </GlassPanel>
          </div>
        )}
      </div>
    </div>
  );
};
