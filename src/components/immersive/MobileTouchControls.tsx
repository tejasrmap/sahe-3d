import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Footprints, Flame, Eye } from 'lucide-react';

interface MobileTouchControlsProps {
  onMove: (moveX: number, moveY: number, sprint: boolean) => void;
  onLook: (deltaYaw: number, deltaPitch: number) => void;
  isSprinting: boolean;
  onToggleSprint: () => void;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  onMove,
  onLook,
  isSprinting,
  onToggleSprint,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Look touch track
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Joystick touch handlers
  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = joystickBaseRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    touchStartRef.current = { x: centerX, y: centerY };
    setIsJoystickActive(true);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const maxRadius = 45;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(maxRadius, dist);
    const angle = Math.atan2(dy, dx);

    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    setStickPos({ x: clampedX, y: clampedY });

    // Normalized outputs (-1 to +1, invert Y for forward)
    const normX = clampedX / maxRadius;
    const normY = -clampedY / maxRadius;
    onMove(normX, normY, isSprinting);
  };

  const handleJoystickTouchEnd = () => {
    setIsJoystickActive(false);
    setStickPos({ x: 0, y: 0 });
    touchStartRef.current = null;
    onMove(0, 0, false);
  };

  // Look touch area handlers
  const handleLookTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    lookTouchIdRef.current = touch.identifier;
    lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lookTouchIdRef.current === null) return;
    const touch = Array.from(e.touches).find((t) => t.identifier === lookTouchIdRef.current);
    if (!touch) return;

    const dx = touch.clientX - lastLookPosRef.current.x;
    const dy = touch.clientY - lastLookPosRef.current.y;
    lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };

    onLook(dx, dy);
  };

  const handleLookTouchEnd = () => {
    lookTouchIdRef.current = null;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 sm:hidden">
      {/* Left Area: Virtual Analog Joystick */}
      <div
        ref={joystickBaseRef}
        onTouchStart={handleJoystickTouchStart}
        onTouchMove={handleJoystickTouchMove}
        onTouchEnd={handleJoystickTouchEnd}
        className="absolute bottom-6 left-6 w-32 h-32 rounded-full bg-slate-900/60 border border-white/20 backdrop-blur-md flex items-center justify-center pointer-events-auto touch-none shadow-2xl"
      >
        <div
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 border border-white/40 shadow-neon-green flex items-center justify-center transition-transform"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          }}
        >
          <Footprints className="w-5 h-5 text-slate-950" />
        </div>
      </div>

      {/* Right Area: Touch Swipe Look Zone */}
      <div
        onTouchStart={handleLookTouchStart}
        onTouchMove={handleLookTouchMove}
        onTouchEnd={handleLookTouchEnd}
        className="absolute top-20 bottom-24 right-0 w-1/2 pointer-events-auto touch-none flex items-center justify-end pr-4 opacity-40 hover:opacity-100 transition-opacity"
      >
        <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1 bg-slate-900/40 px-2 py-1 rounded-full border border-white/10">
          <Eye className="w-3 h-3" /> Swipe to Look
        </div>
      </div>

      {/* Sprint Toggle Pill */}
      <button
        type="button"
        onClick={onToggleSprint}
        className={`absolute bottom-24 left-6 pointer-events-auto px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 shadow-lg ${
          isSprinting
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30'
            : 'bg-slate-900/80 text-slate-300 border-white/20'
        }`}
      >
        <Flame className="w-3.5 h-3.5" />
        <span>{isSprinting ? 'Sprinting' : 'Sprint'}</span>
      </button>
    </div>
  );
};
