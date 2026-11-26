import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Globe, MapPin, ArrowRight } from 'lucide-react';
import { CAMPUS_CONFIG } from '../../data/campusConfig';

interface LoadingScreenProps {
  progress?: number;
  statusMessage?: string;
  onDismiss?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress = 85,
  statusMessage = 'Initializing SAHE 3D Geospatial Digital Twin...',
  onDismiss,
}) => {
  const [showManualBypass, setShowManualBypass] = useState(false);

  useEffect(() => {
    // Show manual entrance option after 3.2 seconds if loading takes longer
    const timer = setTimeout(() => {
      setShowManualBypass(true);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B12] text-white overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Background ambient decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />
      
      {/* Grid background texture */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Animated Badge & Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-[1px] shadow-2xl shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950/90 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Compass className="w-10 h-10 text-emerald-400 animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-lg">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-2">
          <span>SAHE</span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            CAMPUS EXPLORER
          </span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-emerald-400/90 font-semibold mb-2">
          {CAMPUS_CONFIG.tagline}
        </p>
        <p className="text-xs text-slate-400 max-w-xs mb-8">
          Kanuru, Vijayawada • Digital Twin & Interactive 3D GIS
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-4 overflow-hidden border border-white/5 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500 shadow-neon-green"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{statusMessage}</span>
        </div>

        {/* Location coordinates badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 text-[11px] text-slate-400 backdrop-blur-md">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{CAMPUS_CONFIG.latitude.toFixed(4)}° N, {CAMPUS_CONFIG.longitude.toFixed(4)}° E</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </div>

        {/* Manual launch fallback button */}
        {showManualBypass && onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-950/40"
          >
            <span>Enter Campus Explorer Directly</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
