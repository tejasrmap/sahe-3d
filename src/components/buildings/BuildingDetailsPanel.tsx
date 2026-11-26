import React, { useState } from 'react';
import { Building } from '../../types/campus';
import { ARCHITECTURAL_PROFILES } from '../../systems/architecture/architectureProfiles';
import {
  X,
  Navigation,
  Bookmark,
  Share2,
  Clock,
  Phone,
  Layers,
  GraduationCap,
  Sparkles,
  MapPin,
  Check,
  Building2,
  Orbit,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { IconButton } from '../ui/IconButton';

interface BuildingDetailsPanelProps {
  building: Building | null;
  onClose: () => void;
  onNavigateHere: (buildingId: string) => void;
  onExploreBuilding?: (building: Building) => void;
  onExploreInterior?: (building: Building) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (buildingId: string) => void;
}

export const BuildingDetailsPanel: React.FC<BuildingDetailsPanelProps> = ({
  building,
  onClose,
  onNavigateHere,
  onExploreBuilding,
  onExploreInterior,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);

  if (!building) return null;

  const profile = ARCHITECTURAL_PROFILES[building.id];

  const handleShare = () => {
    const text = `${building.name} (${building.code}) - SAHE Campus, Kanuru [${building.latitude}, ${building.longitude}]`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getConfidenceBadge = () => {
    if (!profile) return null;
    switch (profile.confidence) {
      case 'verified-photo-calibrated':
        return {
          label: 'Photo-Calibrated Digital Twin',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'verified-geometry-estimated-facade':
        return {
          label: 'Verified Geometry & Facade',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'procedurally-estimated':
      default:
        return {
          label: 'Procedural Approximation',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
    }
  };

  const badge = getConfidenceBadge();

  return (
    <aside aria-label="Building details" className="fixed md:absolute right-0 bottom-0 md:top-20 md:bottom-6 md:right-6 z-40 w-full md:w-[420px] max-h-[85vh] md:max-h-[calc(100vh-120px)] flex flex-col pointer-events-auto">
      <GlassPanel className="flex flex-col h-full overflow-hidden border border-white/15 shadow-2xl rounded-t-3xl md:rounded-2xl">
        {/* Top Header / Image Banner */}
        <div className="relative h-44 w-full bg-slate-950 shrink-0 overflow-hidden">
          {building.imageUrl ? (
            <img
              src={building.imageUrl}
              alt={building.name}
              className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-slate-600" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Actions: Close, Favorite, Share */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold tracking-wide rounded-lg bg-emerald-500/90 text-slate-950 shadow-md">
              {building.code}
            </span>
            <div className="flex items-center gap-1.5">
              {onToggleFavorite && (
                <IconButton
                  size="sm"
                  variant="secondary"
                  icon={
                    <Bookmark
                      className={`w-4 h-4 ${
                        isFavorite ? 'fill-emerald-400 text-emerald-400' : 'text-slate-300'
                      }`}
                    />
                  }
                  label={isFavorite ? 'Remove bookmark' : 'Bookmark'}
                  onClick={() => onToggleFavorite(building.id)}
                />
              )}
              <IconButton
                size="sm"
                variant="secondary"
                icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-300" />}
                label={copied ? 'Copied' : 'Share Location'}
                onClick={handleShare}
              />
              <IconButton
                size="sm"
                variant="secondary"
                icon={<X className="w-4 h-4" />}
                label="Close"
                onClick={onClose}
              />
            </div>
          </div>

          {/* Category & Title on Header */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {building.category}
              </span>
              {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
              {building.name}
            </h2>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-800/50 border border-white/5 text-center">
            <div className="p-1">
              <span className="text-[11px] text-slate-400 block">Floors</span>
              <span className="text-sm font-bold text-white flex items-center justify-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                {building.floors} Levels
              </span>
            </div>
            <div className="p-1 border-x border-white/5">
              <span className="text-[11px] text-slate-400 block">Height</span>
              <span className="text-sm font-bold text-white">
                ~{building.height} Meters
              </span>
            </div>
            <div className="p-1">
              <span className="text-[11px] text-slate-400 block">Structure</span>
              <span className="text-sm font-bold text-emerald-400 truncate">
                RCC Frame
              </span>
            </div>
          </div>

          {/* Architectural Notes */}
          {profile && (
            <div className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Architectural Specification
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {profile.confidenceNotes}
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Overview
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {building.description}
            </p>
          </div>

          {/* Departments */}
          {building.departments.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                Academic Departments
              </h3>
              <div className="space-y-1.5">
                {building.departments.map((dept) => (
                  <div
                    key={dept}
                    className="p-2 rounded-lg bg-slate-800/40 border border-white/5 text-xs text-slate-200"
                  >
                    {dept}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {building.facilities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Key Facilities & Laboratories
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {building.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/70 border border-white/5 text-slate-200"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Operating Hours & Contact */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
            {building.operatingHours && (
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Operating Hours: {building.operatingHours}</span>
              </div>
            )}
            {building.contact && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{building.contact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="p-3 border-t border-white/10 bg-slate-950/60 backdrop-blur-md flex flex-col gap-2">
          {onExploreInterior && (
            <button
              type="button"
              onClick={() => onExploreInterior(building)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-neon-green transition-all duration-200 active:scale-[0.98]"
            >
              <Layers className="w-4 h-4 fill-current" />
              <span>Explore Interior (Multi-Floor Digital Twin)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {onExploreBuilding && (
              <button
                type="button"
                onClick={() => onExploreBuilding(building)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-white/10 transition-colors"
              >
                <Orbit className="w-4 h-4 text-emerald-400" />
                <span>360° Orbit</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateHere(building.id)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-colors active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Navigate Here</span>
            </button>
          </div>
        </div>
      </GlassPanel>
    </aside>
  );
};
