import React, { useEffect, useState, useRef } from 'react';
import * as Cesium from 'cesium';
import { CAMPUS_TOUR_STOPS, TourStop } from '../../systems/tour/campusTourSystem';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import { Building } from '../../types/campus';
import { GlassPanel } from '../ui/GlassPanel';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  X,
  Compass,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface CampusTourModalProps {
  viewer: Cesium.Viewer | null;
  isOpen: boolean;
  onSelectBuilding: (building: Building) => void;
  onClose: () => void;
}

export const CampusTourModal: React.FC<CampusTourModalProps> = ({
  viewer,
  isOpen,
  onSelectBuilding,
  onClose,
}) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStop = CAMPUS_TOUR_STOPS[currentStopIndex];

  // Fly to current stop
  useEffect(() => {
    if (!isOpen || !viewer) return;

    const stop = CAMPUS_TOUR_STOPS[currentStopIndex];
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        stop.camera.longitude,
        stop.camera.latitude,
        stop.camera.height
      ),
      orientation: {
        heading: Cesium.Math.toRadians(stop.camera.heading),
        pitch: Cesium.Math.toRadians(stop.camera.pitch),
        roll: 0,
      },
      duration: stop.camera.duration,
    });

    if (stop.buildingId) {
      const bldg = CAMPUS_BUILDINGS.find((b) => b.id === stop.buildingId);
      if (bldg) {
        onSelectBuilding(bldg);
      }
    }

    setProgress(0);
  }, [currentStopIndex, isOpen, viewer, onSelectBuilding]);

  // Handle auto-advance timer
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const durationMs = currentStop.durationSeconds * 1000;
    const intervalMs = 100;
    let elapsed = 0;

    progressIntervalRef.current = setInterval(() => {
      elapsed += intervalMs;
      setProgress(Math.min(100, (elapsed / durationMs) * 100));
    }, intervalMs);

    timerRef.current = setTimeout(() => {
      if (currentStopIndex < CAMPUS_TOUR_STOPS.length - 1) {
        setCurrentStopIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentStopIndex, isOpen, isPlaying, currentStop.durationSeconds]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStopIndex < CAMPUS_TOUR_STOPS.length - 1) {
      setCurrentStopIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStopIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-auto">
      <GlassPanel className="p-4 border border-white/20 shadow-2xl rounded-2xl bg-slate-950/90 backdrop-blur-2xl space-y-3">
        {/* Progress Bar Header */}
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-100 shadow-neon-green"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950 shadow-sm">
              {currentStop.badge}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Guided Digital Tour
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Description */}
        <div>
          <h3 className="text-base font-bold text-white tracking-tight leading-snug">
            {currentStop.title}
          </h3>
          <span className="text-xs text-emerald-400 font-medium block mt-0.5 mb-1.5">
            {currentStop.subtitle}
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStop.description}
          </p>
        </div>

        {/* Bottom Playback Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          <span className="text-xs text-slate-400 font-mono">
            {currentStopIndex + 1} / {CAMPUS_TOUR_STOPS.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStopIndex === 0}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Stop"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-neon-green transition-transform active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStopIndex === CAMPUS_TOUR_STOPS.length - 1}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next Stop"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
              title="Restart Tour"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            End Tour
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};
