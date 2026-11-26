import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Compass,
  Locate,
  Layers,
  Building2,
  MapPin,
  Maximize2,
  Minimize2,
  Eye,
  Globe2,
  Mountain,
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { IconButton } from '../ui/IconButton';
import { Tooltip } from '../ui/Tooltip';
import { MapLayerState } from '../../types/campus';

interface MapControlsProps {
  layers: MapLayerState;
  onToggleLayer: (layer: keyof MapLayerState) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onLocateMe: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isLocating?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  layers,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onLocateMe,
  isFullscreen,
  onToggleFullscreen,
  isLocating = false,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Zoom & Camera Controls */}
      <GlassPanel className="p-1.5 flex flex-col gap-1 border border-white/10 shadow-xl">
        <Tooltip content="Zoom In (+)" position="left">
          <IconButton
            icon={<ZoomIn className="w-4 h-4" />}
            label="Zoom In"
            onClick={onZoomIn}
          />
        </Tooltip>
        <Tooltip content="Zoom Out (-)" position="left">
          <IconButton
            icon={<ZoomOut className="w-4 h-4" />}
            label="Zoom Out"
            onClick={onZoomOut}
          />
        </Tooltip>
        <div className="w-full h-px bg-white/10 my-0.5" />
        <Tooltip content="Reset Camera to SAHE Campus" position="left">
          <IconButton
            icon={<Compass className="w-4 h-4 text-emerald-400" />}
            label="Reset Campus View"
            onClick={onResetCamera}
          />
        </Tooltip>
        <Tooltip content="Locate My Position" position="left">
          <IconButton
            icon={<Locate className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-400' : ''}`} />}
            label="My Location"
            onClick={onLocateMe}
          />
        </Tooltip>
      </GlassPanel>

      {/* Layer Visibility Toggles */}
      <GlassPanel className="p-1.5 flex flex-col gap-1 border border-white/10 shadow-xl">
        <Tooltip content={layers.satellite ? 'Satellite Imagery Active' : 'Switch to Satellite'} position="left">
          <IconButton
            icon={<Globe2 className="w-4 h-4" />}
            label="Satellite Imagery"
            active={layers.satellite}
            variant={layers.satellite ? 'primary' : 'ghost'}
            onClick={() => onToggleLayer('satellite')}
          />
        </Tooltip>
        <Tooltip content={layers.buildings ? 'Hide 3D Buildings' : 'Show 3D Buildings'} position="left">
          <IconButton
            icon={<Building2 className="w-4 h-4" />}
            label="3D Buildings"
            active={layers.buildings}
            variant={layers.buildings ? 'primary' : 'ghost'}
            onClick={() => onToggleLayer('buildings')}
          />
        </Tooltip>
        <Tooltip content={layers.pois ? 'Hide Points of Interest' : 'Show Points of Interest'} position="left">
          <IconButton
            icon={<MapPin className="w-4 h-4" />}
            label="Points of Interest"
            active={layers.pois}
            variant={layers.pois ? 'primary' : 'ghost'}
            onClick={() => onToggleLayer('pois')}
          />
        </Tooltip>
        <Tooltip content={layers.labels ? 'Hide Campus Labels' : 'Show Campus Labels'} position="left">
          <IconButton
            icon={<Eye className="w-4 h-4" />}
            label="Labels & Text"
            active={layers.labels}
            variant={layers.labels ? 'primary' : 'ghost'}
            onClick={() => onToggleLayer('labels')}
          />
        </Tooltip>
        <Tooltip content={layers.boundary ? 'Hide Campus Boundary' : 'Show Campus Boundary'} position="left">
          <IconButton
            icon={<Layers className="w-4 h-4" />}
            label="Campus Boundary"
            active={layers.boundary}
            variant={layers.boundary ? 'primary' : 'ghost'}
            onClick={() => onToggleLayer('boundary')}
          />
        </Tooltip>
      </GlassPanel>

      {/* Fullscreen control */}
      <GlassPanel className="p-1.5 border border-white/10 shadow-xl">
        <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} position="left">
          <IconButton
            icon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            label="Toggle Fullscreen"
            onClick={onToggleFullscreen}
          />
        </Tooltip>
      </GlassPanel>
    </div>
  );
};
