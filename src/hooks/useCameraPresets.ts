import { useState, useRef, useEffect, useCallback } from 'react';
import * as Cesium from 'cesium';
import { CAMPUS_CONFIG } from '../data/campusConfig';
import { Building } from '../types/campus';

export type CameraPresetType =
  | 'overview'
  | 'architectural'
  | 'ground'
  | 'orbit'
  | 'walking';

export function useCameraPresets(viewer: Cesium.Viewer | null, selectedBuilding: Building | null) {
  const [activePreset, setActivePreset] = useState<CameraPresetType>('overview');
  const [isOrbiting, setIsOrbiting] = useState(false);
  const orbitAngleRef = useRef(0);
  const orbitFrameIdRef = useRef<number | null>(null);

  // Stop orbit when preset changes
  const stopOrbit = useCallback(() => {
    setIsOrbiting(false);
    if (orbitFrameIdRef.current) {
      cancelAnimationFrame(orbitFrameIdRef.current);
      orbitFrameIdRef.current = null;
    }
  }, []);

  // 1. Campus Overview
  const flyToCampusOverview = useCallback(() => {
    if (!viewer) return;
    stopOrbit();
    setActivePreset('overview');

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        CAMPUS_CONFIG.longitude,
        CAMPUS_CONFIG.latitude - 0.0035,
        CAMPUS_CONFIG.initialHeight
      ),
      orientation: {
        heading: Cesium.Math.toRadians(CAMPUS_CONFIG.defaultHeading),
        pitch: Cesium.Math.toRadians(CAMPUS_CONFIG.defaultPitch),
        roll: 0,
      },
      duration: 2.2,
    });
  }, [viewer, stopOrbit]);

  // 2. Architectural View (Focus on selected building or central academic plaza)
  const flyToArchitecturalView = useCallback(
    (targetBuilding?: Building | null) => {
      if (!viewer) return;
      stopOrbit();
      setActivePreset('architectural');

      const bldg = targetBuilding || selectedBuilding;
      const lon = bldg ? bldg.longitude : CAMPUS_CONFIG.longitude;
      const lat = bldg ? bldg.latitude : CAMPUS_CONFIG.latitude;
      const height = bldg ? bldg.height + 90 : 160;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon + 0.0008, lat - 0.0012, height),
        orientation: {
          heading: Cesium.Math.toRadians(335),
          pitch: Cesium.Math.toRadians(-32),
          roll: 0,
        },
        duration: 2.0,
      });
    },
    [viewer, selectedBuilding, stopOrbit]
  );

  // 3. Ground Level (Pedestrian Eye-Level View)
  const flyToGroundLevel = useCallback(
    (targetBuilding?: Building | null) => {
      if (!viewer) return;
      stopOrbit();
      setActivePreset('ground');

      const bldg = targetBuilding || selectedBuilding;
      const lon = bldg ? bldg.longitude : CAMPUS_CONFIG.longitude;
      const lat = bldg ? bldg.latitude : CAMPUS_CONFIG.latitude;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat - 0.0006, 5),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(12), // slight upward tilt
          roll: 0,
        },
        duration: 2.2,
      });
    },
    [viewer, selectedBuilding, stopOrbit]
  );

  // 4. Building Orbit (360 Degree Turntable Animation)
  const startBuildingOrbit = useCallback(
    (targetBuilding?: Building | null) => {
      if (!viewer) return;
      stopOrbit();
      setActivePreset('orbit');
      setIsOrbiting(true);

      const bldg = targetBuilding || selectedBuilding;
      const targetLon = bldg ? bldg.longitude : CAMPUS_CONFIG.longitude;
      const targetLat = bldg ? bldg.latitude : CAMPUS_CONFIG.latitude;
      const orbitRadius = bldg ? Math.max(80, bldg.height * 2.8) : 220;
      const orbitAltitude = bldg ? bldg.height * 1.5 : 90;

      let angle = viewer.camera.heading;

      const animateOrbit = () => {
        angle += 0.0035; // smooth rotation speed
        orbitAngleRef.current = angle;

        const offsetX = (orbitRadius * Math.sin(angle)) / 105000;
        const offsetY = (orbitRadius * Math.cos(angle)) / 111000;

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            targetLon + offsetX,
            targetLat + offsetY,
            orbitAltitude
          ),
          orientation: {
            heading: angle + Math.PI,
            pitch: Cesium.Math.toRadians(-28),
            roll: 0,
          },
        });

        orbitFrameIdRef.current = requestAnimationFrame(animateOrbit);
      };

      orbitFrameIdRef.current = requestAnimationFrame(animateOrbit);
    },
    [viewer, selectedBuilding, stopOrbit]
  );

  // 5. Walking Exploration (Walk through the central academic promenade)
  const startWalkingExploration = useCallback(() => {
    if (!viewer) return;
    stopOrbit();
    setActivePreset('walking');

    // Start at South Avenue looking north towards CSE and Admin
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(80.6922, 16.4832, 3),
      orientation: {
        heading: Cesium.Math.toRadians(5),
        pitch: Cesium.Math.toRadians(8),
        roll: 0,
      },
      duration: 2.5,
    });
  }, [viewer, stopOrbit]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (orbitFrameIdRef.current) {
        cancelAnimationFrame(orbitFrameIdRef.current);
      }
    };
  }, []);

  return {
    activePreset,
    isOrbiting,
    flyToCampusOverview,
    flyToArchitecturalView,
    flyToGroundLevel,
    startBuildingOrbit,
    startWalkingExploration,
    stopOrbit,
  };
}
