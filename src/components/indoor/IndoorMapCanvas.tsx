import React, { useState, useRef, useMemo, useEffect } from 'react';
import { IndoorFloor, IndoorRoom, RoomCategory } from '../../data/indoor/types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Layers,
  Sparkles,
  Navigation,
  Eye,
  Box,
} from 'lucide-react';

interface IndoorMapCanvasProps {
  floor: IndoorFloor;
  selectedRoom: IndoorRoom | null;
  onSelectRoom: (room: IndoorRoom) => void;
  targetRoom: IndoorRoom | null; // For active indoor navigation route
  filterCategory: string | null;
}

const CATEGORY_FILLS: Record<RoomCategory, { fill: string; stroke: string; text: string; bg: string }> = {
  laboratory: { fill: 'rgba(16, 185, 129, 0.16)', stroke: '#10B981', text: '#34D399', bg: '#064E3B' },
  classroom: { fill: 'rgba(6, 182, 212, 0.14)', stroke: '#06B6D4', text: '#22D3EE', bg: '#164E63' },
  faculty_office: { fill: 'rgba(245, 158, 11, 0.15)', stroke: '#F59E0B', text: '#FBBF24', bg: '#78350F' },
  department_office: { fill: 'rgba(59, 130, 246, 0.18)', stroke: '#3B82F6', text: '#60A5FA', bg: '#1E3A8A' },
  seminar_hall: { fill: 'rgba(168, 85, 247, 0.20)', stroke: '#A855F7', text: '#C084FC', bg: '#581C87' },
  meeting_room: { fill: 'rgba(99, 102, 241, 0.16)', stroke: '#6366F1', text: '#818CF8', bg: '#312E81' },
  library: { fill: 'rgba(20, 184, 166, 0.18)', stroke: '#14B8A6', text: '#2DD4BF', bg: '#134E4A' },
  reception: { fill: 'rgba(244, 63, 94, 0.18)', stroke: '#F43F5E', text: '#FB7185', bg: '#881337' },
  server_room: { fill: 'rgba(239, 68, 68, 0.22)', stroke: '#EF4444', text: '#F87171', bg: '#7F1D1D' },
  student_lounge: { fill: 'rgba(249, 115, 22, 0.16)', stroke: '#F97316', text: '#FB923C', bg: '#7C2D12' },
  washroom: { fill: 'rgba(14, 165, 233, 0.16)', stroke: '#0EA5E9', text: '#38BDF8', bg: '#075985' },
  storage: { fill: 'rgba(100, 116, 139, 0.15)', stroke: '#64748B', text: '#94A3B8', bg: '#334155' },
  corridor: { fill: 'rgba(30, 41, 59, 0.6)', stroke: '#334155', text: '#64748B', bg: '#0F172A' },
  staircase: { fill: 'rgba(236, 72, 153, 0.22)', stroke: '#EC4899', text: '#F472B6', bg: '#831843' },
  elevator: { fill: 'rgba(217, 70, 239, 0.25)', stroke: '#D946EF', text: '#E879F9', bg: '#701A75' },
  cafeteria: { fill: 'rgba(217, 119, 6, 0.20)', stroke: '#D97706', text: '#F59E0B', bg: '#78350F' },
};

export const IndoorMapCanvas: React.FC<IndoorMapCanvasProps> = ({
  floor,
  selectedRoom,
  onSelectRoom,
  targetRoom,
  filterCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan and Zoom
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [is3DView, setIs3DView] = useState(false);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  // SVG coordinate scaling (1 meter = 16 SVG units)
  const SCALE = 16;
  const svgWidth = (floor.planWidth + 4) * SCALE;
  const svgHeight = (floor.planLength + 4) * SCALE;

  // Reset View
  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, prev * 1.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev * 0.8));

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.max(0.4, Math.min(2.8, prev * factor)));
  };

  // Compute indoor path points if navigating to a target room
  const navigationRoutePoints = useMemo(() => {
    if (!targetRoom) return null;

    const startX = (floor.planWidth / 2) * SCALE;
    const startY = (floor.planLength - 2) * SCALE;
    const midY = 16 * SCALE; // main corridor centerline

    // Target room is on current floor: route straight to room entrance
    if (targetRoom.floor === floor.floorNumber) {
      const targetDoorX = (targetRoom.position.x + targetRoom.dimensions.width / 2) * SCALE;
      const targetDoorY = (targetRoom.position.y + (targetRoom.position.y < 16 ? targetRoom.dimensions.length : 0)) * SCALE;

      return [
        { x: startX, y: startY },
        { x: startX, y: midY },
        { x: targetDoorX, y: midY },
        { x: targetDoorX, y: targetDoorY },
      ];
    }

    // Target room is on another floor: route to connecting vertical transit hub (Staircase / Elevator)
    const stairs = floor.staircases?.[0] || { position: { x: 4, y: 14 } };
    const stairX = (stairs.position.x + 2) * SCALE;
    const stairY = (stairs.position.y + 2) * SCALE;

    return [
      { x: startX, y: startY },
      { x: startX, y: midY },
      { x: stairX, y: midY },
      { x: stairX, y: stairY },
    ];
  }, [targetRoom, floor]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none bg-[#090D16] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Background Architectural Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Canvas Action Controls */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIs3DView((prev) => !prev)}
          className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-xl ${
            is3DView
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-400 shadow-neon-green'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-white/15'
          }`}
          title="Toggle 3D Isometric View"
        >
          <Box className="w-4 h-4" />
          <span className="text-[11px] font-bold">{is3DView ? '3D View' : '2D Plan'}</span>
        </button>

        <div className="p-1 rounded-2xl bg-slate-900/80 border border-white/15 shadow-xl flex flex-col gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Floor Alignment"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Floor Plan SVG Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) ${
            is3DView ? 'perspective(1000px) rotateX(24deg) rotateZ(-6deg)' : ''
          }`,
        }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="filter drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="indoor-grid" width={SCALE * 2} height={SCALE * 2} patternUnits="userSpaceOnUse">
              <rect width={SCALE * 2} height={SCALE * 2} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>

            {/* Glowing neon navigation marker */}
            <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Floor Foundation Slab */}
          <rect
            x={SCALE}
            y={SCALE}
            width={floor.planWidth * SCALE}
            height={floor.planLength * SCALE}
            rx={12}
            fill="#0F172A"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <rect
            x={SCALE}
            y={SCALE}
            width={floor.planWidth * SCALE}
            height={floor.planLength * SCALE}
            rx={12}
            fill="url(#indoor-grid)"
          />

          {/* 2. Corridors & Walkways */}
          {floor.corridors.map((c) => {
            const cx1 = (c.startX + 1) * SCALE;
            const cy1 = (c.startY + 1) * SCALE;
            const cx2 = (c.endX + 1) * SCALE;
            const cy2 = (c.endY + 1) * SCALE;
            const strokeW = c.width * SCALE;

            return (
              <g key={c.id}>
                <line
                  x1={cx1}
                  y1={cy1}
                  x2={cx2}
                  y2={cy2}
                  stroke="#1E293B"
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                />
                <line
                  x1={cx1}
                  y1={cy1}
                  x2={cx2}
                  y2={cy2}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                />
              </g>
            );
          })}

          {/* 3. Staircases */}
          {floor.staircases.map((stair) => {
            const sx = (stair.position.x + 1) * SCALE;
            const sy = (stair.position.y + 1) * SCALE;
            const sw = stair.dimensions.width * SCALE;
            const sl = stair.dimensions.length * SCALE;
            const steps = 7;

            return (
              <g key={stair.id}>
                {/* Stairwell Outer Wall */}
                <rect
                  x={sx}
                  y={sy}
                  width={sw}
                  height={sl}
                  rx={4}
                  fill="rgba(236, 72, 153, 0.12)"
                  stroke="#EC4899"
                  strokeWidth="2"
                />
                {/* Tread Lines */}
                {Array.from({ length: steps }).map((_, i) => (
                  <line
                    key={i}
                    x1={sx}
                    y1={sy + (sl / (steps + 1)) * (i + 1)}
                    x2={sx + sw}
                    y2={sy + (sl / (steps + 1)) * (i + 1)}
                    stroke="rgba(236, 72, 153, 0.6)"
                    strokeWidth="1.5"
                  />
                ))}
                {/* Label */}
                <text
                  x={sx + sw / 2}
                  y={sy + sl / 2 + 3}
                  textAnchor="middle"
                  fill="#F472B6"
                  fontSize="9"
                  fontWeight="bold"
                >
                  STAIRS
                </text>
              </g>
            );
          })}

          {/* 4. Elevators */}
          {floor.elevators.map((lift) => {
            const lx = (lift.position.x + 1) * SCALE;
            const ly = (lift.position.y + 1) * SCALE;
            const lw = lift.dimensions.width * SCALE;
            const ll = lift.dimensions.length * SCALE;

            return (
              <g key={lift.id}>
                <rect
                  x={lx}
                  y={ly}
                  width={lw}
                  height={ll}
                  rx={4}
                  fill="rgba(217, 70, 239, 0.18)"
                  stroke="#D946EF"
                  strokeWidth="2"
                />
                <line x1={lx} y1={ly} x2={lx + lw} y2={ly + ll} stroke="rgba(217,70,239,0.3)" strokeWidth="1" />
                <line x1={lx + lw} y1={ly} x2={lx} y2={ly + ll} stroke="rgba(217,70,239,0.3)" strokeWidth="1" />
                <text
                  x={lx + lw / 2}
                  y={ly + ll / 2 + 3}
                  textAnchor="middle"
                  fill="#E879F9"
                  fontSize="9"
                  fontWeight="bold"
                >
                  LIFT
                </text>
              </g>
            );
          })}

          {/* 5. Rooms */}
          {floor.rooms.map((room) => {
            const rx = (room.position.x + 1) * SCALE;
            const ry = (room.position.y + 1) * SCALE;
            const rw = room.dimensions.width * SCALE;
            const rl = room.dimensions.length * SCALE;

            const isSelected = selectedRoom?.id === room.id;
            const isTarget = targetRoom?.id === room.id;
            const isHovered = hoveredRoomId === room.id;
            const isFilteredOut = filterCategory && room.category !== filterCategory;

            const colors = CATEGORY_FILLS[room.category] || CATEGORY_FILLS.classroom;

            return (
              <g
                key={room.id}
                onClick={() => onSelectRoom(room)}
                onMouseEnter={() => setHoveredRoomId(room.id)}
                onMouseLeave={() => setHoveredRoomId(null)}
                className="cursor-pointer transition-all duration-200"
                opacity={isFilteredOut ? 0.25 : 1.0}
              >
                {/* Room Floor Slab */}
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rl}
                  rx={5}
                  fill={isSelected ? colors.fill.replace('0.1', '0.35') : colors.fill}
                  stroke={isSelected || isTarget ? '#22C55E' : isHovered ? '#FFFFFF' : colors.stroke}
                  strokeWidth={isSelected || isTarget ? '3' : isHovered ? '2' : '1.5'}
                  filter={isSelected ? 'url(#neon-glow)' : undefined}
                />

                {/* Door Opening notch on room boundary */}
                <rect
                  x={rx + rw / 2 - 8}
                  y={ry > 16 * SCALE ? ry - 1 : ry + rl - 2}
                  width={16}
                  height={3}
                  fill="#0F172A"
                />

                {/* Room Number Pill Badge */}
                <rect
                  x={rx + 6}
                  y={ry + 6}
                  width={Math.max(48, room.number.length * 7 + 8)}
                  height={15}
                  rx={3}
                  fill={colors.bg}
                  stroke={colors.stroke}
                  strokeWidth="0.8"
                />
                <text
                  x={rx + 10}
                  y={ry + 17}
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  {room.number}
                </text>

                {/* Room Name Label */}
                <text
                  x={rx + 8}
                  y={ry + 32}
                  fill={colors.text}
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none"
                >
                  {room.name.length > Math.floor(rw / 7)
                    ? room.name.substring(0, Math.floor(rw / 7) - 2) + '…'
                    : room.name}
                </text>

                {/* Capacity or Department Tag */}
                {room.capacity && rw > 90 && (
                  <text
                    x={rx + 8}
                    y={ry + rl - 8}
                    fill="rgba(255,255,255,0.4)"
                    fontSize="8"
                    className="pointer-events-none"
                  >
                    Cap: {room.capacity}
                  </text>
                )}

                {/* Selected Room Beacon / Pin */}
                {isSelected && (
                  <circle
                    cx={rx + rw / 2}
                    cy={ry + rl / 2}
                    r={6}
                    fill="#22C55E"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* 6. Active Indoor Navigation Route */}
          {navigationRoutePoints && (
            <g>
              <polyline
                points={navigationRoutePoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#22C55E"
                strokeWidth="4"
                strokeDasharray="6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neon-glow)"
              />
              {/* Start Pin */}
              <circle
                cx={navigationRoutePoints[0].x}
                cy={navigationRoutePoints[0].y}
                r={7}
                fill="#3B82F6"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {/* Target Room Pin */}
              <circle
                cx={navigationRoutePoints[navigationRoutePoints.length - 1].x}
                cy={navigationRoutePoints[navigationRoutePoints.length - 1].y}
                r={8}
                fill="#22C55E"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                className="animate-pulse"
              />
            </g>
          )}

          {/* 7. Exit Indicator */}
          {floor.exits &&
            floor.exits.map((exit) => (
              <g key={exit.id}>
                <rect
                  x={(exit.position.x + 1) * SCALE - 20}
                  y={(exit.position.y + 1) * SCALE - 5}
                  width={40}
                  height={12}
                  rx={2}
                  fill="#10B981"
                />
                <text
                  x={(exit.position.x + 1) * SCALE}
                  y={(exit.position.y + 1) * SCALE + 4}
                  textAnchor="middle"
                  fill="#022C22"
                  fontSize="8"
                  fontWeight="900"
                >
                  MAIN EXIT
                </text>
              </g>
            ))}
        </svg>
      </div>

      {/* Map Compass Rose */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 text-[10px] font-bold text-slate-400">
        <Compass className="w-4 h-4 text-emerald-400" />
        <span>North ↑ • Scale 1:100</span>
      </div>
    </div>
  );
};
