import { useState, useRef, useEffect, useCallback } from 'react';
import * as Cesium from 'cesium';
import { CAMPUS_CONFIG } from '../data/campusConfig';
import { resolveMovementWithCollision } from '../systems/physics/collisionSystem';

export interface FirstPersonState {
  isActive: boolean;
  lon: number;
  lat: number;
  height: number;
  heading: number; // in radians
  pitch: number; // in radians
  speedKmh: number;
  isSprinting: boolean;
  isColliding: boolean;
}

const HUMAN_EYE_HEIGHT = 1.75; // meters above ground
const WALK_SPEED_MPS = 1.6; // ~5.7 km/h
const SPRINT_SPEED_MPS = 3.6; // ~13 km/h
const MOUSE_SENSITIVITY = 0.0022;

export function useFirstPersonController(viewer: Cesium.Viewer | null) {
  const [isActive, setIsActive] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);

  // Position & Orientation refs for 60fps physics loop without React re-render churn
  const posRef = useRef<{ lon: number; lat: number; height: number }>({
    lon: 80.6922,
    lat: 16.4832,
    height: HUMAN_EYE_HEIGHT,
  });
  const headingRef = useRef(0); // 0 = North
  const pitchRef = useRef(0); // 0 = Horizon

  // Active Keys
  const keysRef = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    turnLeft: boolean;
    turnRight: boolean;
    sprint: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
    sprint: false,
  });

  const isMouseDownRef = useRef(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Enter First-Person Mode
  const enterFirstPerson = useCallback(
    (initialLon?: number, initialLat?: number) => {
      if (!viewer) return;
      const startLon = initialLon ?? 80.6922;
      const startLat = initialLat ?? 16.4832;

      posRef.current = { lon: startLon, lat: startLat, height: HUMAN_EYE_HEIGHT };
      headingRef.current = 0;
      pitchRef.current = 0;

      // Disable default Cesium globe drag rotation while in First-Person mode
      viewer.scene.screenSpaceCameraController.enableRotate = false;
      viewer.scene.screenSpaceCameraController.enableTranslate = false;
      viewer.scene.screenSpaceCameraController.enableZoom = false;
      viewer.scene.screenSpaceCameraController.enableTilt = false;
      viewer.scene.screenSpaceCameraController.enableLook = false;

      // Smooth fly into human eye-level
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(startLon, startLat, HUMAN_EYE_HEIGHT),
        orientation: {
          heading: 0,
          pitch: 0,
          roll: 0,
        },
        duration: 1.8,
        complete: () => {
          setIsActive(true);
        },
      });
    },
    [viewer]
  );

  // Exit First-Person Mode
  const exitFirstPerson = useCallback(() => {
    if (!viewer) return;
    setIsActive(false);
    setCurrentSpeedKmh(0);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Restore standard Cesium orbital camera controls
    viewer.scene.screenSpaceCameraController.enableRotate = true;
    viewer.scene.screenSpaceCameraController.enableTranslate = true;
    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.scene.screenSpaceCameraController.enableTilt = true;
    viewer.scene.screenSpaceCameraController.enableLook = true;

    // Smoothly fly back to campus overview
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
      duration: 2.0,
    });
  }, [viewer]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Escape' && isActive) {
        exitFirstPerson();
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'w' || e.key === 'ArrowUp') keysRef.current.forward = true;
      if (key === 's' || e.key === 'ArrowDown') keysRef.current.backward = true;
      if (key === 'a') keysRef.current.left = true;
      if (key === 'd') keysRef.current.right = true;
      if (e.key === 'ArrowLeft') keysRef.current.turnLeft = true;
      if (e.key === 'ArrowRight') keysRef.current.turnRight = true;
      if (e.key === 'Shift') {
        keysRef.current.sprint = true;
        setIsSprinting(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || e.key === 'ArrowUp') keysRef.current.forward = false;
      if (key === 's' || e.key === 'ArrowDown') keysRef.current.backward = false;
      if (key === 'a') keysRef.current.left = false;
      if (key === 'd') keysRef.current.right = false;
      if (e.key === 'ArrowLeft') keysRef.current.turnLeft = false;
      if (e.key === 'ArrowRight') keysRef.current.turnRight = false;
      if (e.key === 'Shift') {
        keysRef.current.sprint = false;
        setIsSprinting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, exitFirstPerson]);

  // Mouse Look Listeners
  useEffect(() => {
    if (!isActive) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDownRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      headingRef.current += dx * MOUSE_SENSITIVITY;
      // Clamp pitch between -60 and +60 degrees
      pitchRef.current = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, pitchRef.current - dy * MOUSE_SENSITIVITY)
      );
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive]);

  // Main 60FPS Physics, Movement & Collision Loop
  useEffect(() => {
    if (!isActive || !viewer) return;

    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      const keys = keysRef.current;

      // Handle Arrow Left / Right smooth turning
      if (keys.turnLeft) headingRef.current -= 1.8 * dt;
      if (keys.turnRight) headingRef.current += 1.8 * dt;

      // Movement Vector
      let moveForward = 0;
      let moveRight = 0;

      if (keys.forward) moveForward += 1;
      if (keys.backward) moveForward -= 1;
      if (keys.right) moveRight += 1;
      if (keys.left) moveRight -= 1;

      const isMoving = moveForward !== 0 || moveRight !== 0;
      const speedMps = keys.sprint ? SPRINT_SPEED_MPS : WALK_SPEED_MPS;

      if (isMoving) {
        // Normalize diagonal vector
        const mag = Math.hypot(moveForward, moveRight);
        const normForward = (moveForward / mag) * speedMps * dt;
        const normRight = (moveRight / mag) * speedMps * dt;

        // Heading angle (0 = North, +PI/2 = East)
        const h = headingRef.current;
        const sinH = Math.sin(h);
        const cosH = Math.cos(h);

        // Convert meter displacement to geographic degree displacement
        // ~111,000 meters per degree lat; ~105,000 meters per degree lon at 16.48° N
        const deltaNorthMeters = normForward * cosH - normRight * sinH;
        const deltaEastMeters = normForward * sinH + normRight * cosH;

        const deltaLat = deltaNorthMeters / 111000;
        const deltaLon = deltaEastMeters / 105000;

        const currentLon = posRef.current.lon;
        const currentLat = posRef.current.lat;
        const candidateLon = currentLon + deltaLon;
        const candidateLat = currentLat + deltaLat;

        // Perform collision resolution against buildings and perimeter
        const resolved = resolveMovementWithCollision(
          currentLon,
          currentLat,
          candidateLon,
          candidateLat
        );

        posRef.current.lon = resolved.lon;
        posRef.current.lat = resolved.lat;
        setIsColliding(resolved.collided);
        setCurrentSpeedKmh(Math.round(speedMps * 3.6));
      } else {
        setIsColliding(false);
        setCurrentSpeedKmh(0);
      }

      // Update Cesium Camera
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          posRef.current.lon,
          posRef.current.lat,
          HUMAN_EYE_HEIGHT
        ),
        orientation: {
          heading: headingRef.current,
          pitch: pitchRef.current,
          roll: 0,
        },
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, viewer]);

  // Touch Movement Input for Mobile
  const handleVirtualMovement = useCallback((moveX: number, moveY: number, sprint = false) => {
    keysRef.current.forward = moveY > 0.2;
    keysRef.current.backward = moveY < -0.2;
    keysRef.current.right = moveX > 0.2;
    keysRef.current.left = moveX < -0.2;
    keysRef.current.sprint = sprint;
    setIsSprinting(sprint);
  }, []);

  const handleVirtualLook = useCallback((deltaYaw: number, deltaPitch: number) => {
    headingRef.current += deltaYaw * 0.04;
    pitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitchRef.current - deltaPitch * 0.04));
  }, []);

  const getCurrentPosition = useCallback(() => {
    return { ...posRef.current };
  }, []);

  return {
    isActive,
    isSprinting,
    isColliding,
    currentSpeedKmh,
    position: posRef.current,
    getCurrentPosition,
    enterFirstPerson,
    exitFirstPerson,
    handleVirtualMovement,
    handleVirtualLook,
  };
}
