import React from 'react';
import {
  Compass,
  Building2,
  Eye,
  Orbit,
  Footprints,
  Sparkles,
  Globe2,
  Play,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { Tooltip } from '../ui/Tooltip';
import { CameraPresetType } from '../../hooks/useCameraPresets';
import { MapRenderMode } from './BuildingLayer';
import { TimeOfDayPreset } from '../../systems/lighting/timeOfDaySystem';
import { clsx } from 'clsx';

interface CameraPresetsBarProps {
  activePreset: CameraPresetType;
  isOrbiting: boolean;
  renderMode: MapRenderMode;
  timeOfDay: TimeOfDayPreset;
  onSelectPreset: (preset: CameraPresetType) => void;
  onToggleRenderMode: () => void;
  onStartImmersive: () => void;
  onStartTour: () => void;
  onSelectTimeOfDay: (time: TimeOfDayPreset) => void;
}

export const CameraPresetsBar: React.FC<CameraPresetsBarProps> = ({
  activePreset,
  isOrbiting,
  renderMode,
  timeOfDay,
  onSelectPreset,
  onToggleRenderMode,
  onStartImmersive,
  onStartTour,
  onSelectTimeOfDay,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2 pointer-events-auto">
      {/* Mode Switcher Pill */}
      <GlassPanel className="h-11 px-1.5 flex items-center gap-1 border border-white/10 shadow-2xl rounded-2xl">
        <button
          type="button"
          onClick={onToggleRenderMode}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300',
            renderMode === 'architectural'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-neon-green'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          )}
          title="Switch to Realistic Architectural Digital Twin"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Architectural</span>
        </button>

        <button
          type="button"
          onClick={onToggleRenderMode}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300',
            renderMode === 'geographic'
              ? 'bg-emerald-500 text-slate-950 shadow-neon-green'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          )}
          title="Switch to Geographic Satellite View"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Geographic</span>
        </button>
      </GlassPanel>

      {/* Cinematic Camera Presets Dock */}
      <GlassPanel className="h-11 px-2 flex items-center gap-1 border border-white/10 shadow-2xl rounded-2xl">
        <Tooltip content="Campus Aerial Overview" position="top">
          <button
            type="button"
            onClick={() => onSelectPreset('overview')}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors',
              activePreset === 'overview' && !isOrbiting
                ? 'bg-white/15 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Overview</span>
          </button>
        </Tooltip>

        <Tooltip content="Architectural 3D Perspective" position="top">
          <button
            type="button"
            onClick={() => onSelectPreset('architectural')}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors',
              activePreset === 'architectural' && !isOrbiting
                ? 'bg-white/15 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Architecture</span>
          </button>
        </Tooltip>

        <Tooltip content="360° Building Orbit Turntable" position="top">
          <button
            type="button"
            onClick={() => onSelectPreset('orbit')}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors',
              isOrbiting
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold animate-pulse border border-emerald-500/40'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isOrbiting ? 'Orbiting...' : 'Orbit'}</span>
          </button>
        </Tooltip>

        <Tooltip content="Ground-Level Pedestrian Perspective" position="top">
          <button
            type="button"
            onClick={() => onSelectPreset('ground')}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors',
              activePreset === 'ground' && !isOrbiting
                ? 'bg-white/15 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ground</span>
          </button>
        </Tooltip>

        {/* Guided Tour Trigger */}
        <Tooltip content="Automated Guided Campus Tour" position="top">
          <button
            type="button"
            onClick={onStartTour}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Tour</span>
          </button>
        </Tooltip>

        {/* First-Person Immersive Walk Trigger */}
        <Tooltip content="Enter First-Person Immersive Walk (WASD + Mouse)" position="top">
          <button
            type="button"
            onClick={onStartImmersive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-neon-green hover:brightness-110 transition-all active:scale-95 ml-1"
          >
            <Footprints className="w-4 h-4 fill-current" />
            <span>Immersive Walk</span>
          </button>
        </Tooltip>
      </GlassPanel>

      {/* Time of Day Sun/Night Controls */}
      <GlassPanel className="h-11 px-2 flex items-center gap-1 border border-white/10 shadow-2xl rounded-2xl">
        <Tooltip content="Morning (08:30)" position="top">
          <button
            type="button"
            onClick={() => onSelectTimeOfDay('morning')}
            className={clsx(
              'p-2 rounded-xl transition-colors',
              timeOfDay === 'morning' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
            )}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content="Golden Hour (17:00)" position="top">
          <button
            type="button"
            onClick={() => onSelectTimeOfDay('goldenHour')}
            className={clsx(
              'p-2 rounded-xl transition-colors',
              timeOfDay === 'goldenHour' ? 'bg-orange-500/20 text-orange-300' : 'text-slate-400 hover:text-white'
            )}
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content="Night Campus Lighting (20:30)" position="top">
          <button
            type="button"
            onClick={() => onSelectTimeOfDay('night')}
            className={clsx(
              'p-2 rounded-xl transition-colors',
              timeOfDay === 'night' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
            )}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </GlassPanel>
    </div>
  );
};
