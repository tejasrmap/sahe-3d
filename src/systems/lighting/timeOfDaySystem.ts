import * as Cesium from 'cesium';

export type TimeOfDayPreset = 'morning' | 'noon' | 'goldenHour' | 'sunset' | 'night';

export interface TimePresetConfig {
  id: TimeOfDayPreset;
  label: string;
  hour: number;
  minute: number;
  sunIntensity: number;
  ambientLightColor: string;
  streetlightsOn: boolean;
  buildingLightsOn: boolean;
  shadows: boolean;
}

export const TIME_PRESETS: Record<TimeOfDayPreset, TimePresetConfig> = {
  morning: {
    id: 'morning',
    label: 'Morning (08:30)',
    hour: 8,
    minute: 30,
    sunIntensity: 1.6,
    ambientLightColor: '#FFFFFF',
    streetlightsOn: false,
    buildingLightsOn: false,
    shadows: true,
  },
  noon: {
    id: 'noon',
    label: 'Noon (12:30)',
    hour: 12,
    minute: 30,
    sunIntensity: 2.2,
    ambientLightColor: '#FFFFFF',
    streetlightsOn: false,
    buildingLightsOn: false,
    shadows: true,
  },
  goldenHour: {
    id: 'goldenHour',
    label: 'Golden Hour (17:00)',
    hour: 17,
    minute: 0,
    sunIntensity: 1.8,
    ambientLightColor: '#FED7AA', // warm golden ambient
    streetlightsOn: false,
    buildingLightsOn: true,
    shadows: true,
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset (18:15)',
    hour: 18,
    minute: 15,
    sunIntensity: 1.1,
    ambientLightColor: '#FDA4AF', // dusk rose tint
    streetlightsOn: true,
    buildingLightsOn: true,
    shadows: true,
  },
  night: {
    id: 'night',
    label: 'Night (20:30)',
    hour: 20,
    minute: 30,
    sunIntensity: 0.35,
    ambientLightColor: '#1E293B', // readable cool navy ambient so buildings remain visible
    streetlightsOn: true,
    buildingLightsOn: true,
    shadows: false,
  },
};

/**
 * Apply Time of Day preset to Cesium Viewer
 */
export function applyTimeOfDay(viewer: Cesium.Viewer, preset: TimeOfDayPreset): void {
  if (!viewer || viewer.isDestroyed()) return;

  const config = TIME_PRESETS[preset];

  // Set date: 2026-11-26 at specified hour:minute in IST (+05:30)
  // Convert IST to UTC (subtract 5 hrs 30 mins)
  const utcDate = new Date(Date.UTC(2026, 10, 26, config.hour - 5, config.minute - 30));
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(utcDate);
  viewer.clock.shouldAnimate = false;

  // Configure Scene Lighting & Shadows
  viewer.scene.globe.enableLighting = true;
  viewer.shadows = config.shadows;
  viewer.scene.highDynamicRange = true;

  if (viewer.scene.skyAtmosphere) {
    viewer.scene.skyAtmosphere.show = true;
  }
}
