import React, { useState, useEffect } from 'react';
import {
  Compass,
  Building2,
  Navigation,
  Play,
  GraduationCap,
  HeartHandshake,
  X,
  Sparkles,
  ArrowRight,
  MapPin,
  Check
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { CAMPUS_CONFIG } from '../../data/campusConfig';
import { CAMPUS_BUILDINGS } from '../../data/buildings';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCampus: () => void;
  onFindBuilding: () => void;
  onStartTour: () => void;
  onExploreDepartments: () => void;
  onExploreFacilities: () => void;
}

export const ONBOARDING_STORAGE_KEY = 'sahe_onboarding_completed';

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onExploreCampus,
  onFindBuilding,
  onStartTour,
  onExploreDepartments,
  onExploreFacilities,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
  }, [dontShowAgain]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all duration-300">
      <div 
        className="relative w-full max-w-xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <GlassPanel className="relative p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-slate-950/90 shadow-2xl shadow-teal-950/50 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss Welcome Guide"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Emblem & Tag */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950/90 rounded-2xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                  SAHE 3D DIGITAL TWIN
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                  VRSEC CAMPUS
                </span>
              </div>
              <h1 id="welcome-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                Discover SAHE Campus
              </h1>
            </div>
          </div>

          {/* Supporting Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Explore buildings, academic departments, student facilities and pathways through an interactive 3D campus digital twin.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white">{CAMPUS_BUILDINGS.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">3D Structures</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <span className="text-lg font-black text-emerald-400">24.5</span>
              <span className="text-[11px] text-slate-400 font-medium">Acres Extent</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-teal-300">100%</span>
              <span className="text-[11px] text-slate-400 font-medium">Georeferenced</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => {
                handleDismiss();
                onExploreCampus();
              }}
              className="w-full h-12 flex items-center justify-between px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Compass className="w-4 h-4" />
                Explore Campus (Free Fly)
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleDismiss();
                  onFindBuilding();
                }}
                className="h-11 flex items-center justify-center gap-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Find a Building</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDismiss();
                  onStartTour();
                }}
                className="h-11 flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/20 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Guided Tour</span>
              </button>
            </div>
          </div>

          {/* Secondary Quick Discovery Links */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-white/10 text-xs text-slate-400">
            <span className="font-medium text-slate-400">Quick explore:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleDismiss();
                  onExploreDepartments();
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                Academic Departments
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDismiss();
                  onExploreFacilities();
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                Student Facilities
              </button>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
