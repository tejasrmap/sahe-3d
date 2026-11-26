# SAHE-3D Cesium Viewer Lifecycle & Initialization Audit

## 1. Lifecycle Architecture

In React applications with 3D WebGL runtimes (CesiumJS via Resium), uncontrolled re-renders can trigger viewer recreation, WebGL context thrashing, and memory leaks.

### Rectifications Implemented in `src/components/map/CampusMap.tsx`

1. **Initialization Guard (`isInitializedRef`):**
   - Ensures Cesium scene properties (HDR, lighting, shadow maps) and initial camera flight execute strictly once upon mount.
   - Prevents React Strict Mode or dynamic prop re-renders from re-triggering `viewer.camera.flyTo()`.

2. **Decoupled Imagery Layer Visibility:**
   - Removed `layers.satellite` from `handleViewerLoaded` dependencies.
   - Satellite and street map visibility are managed via independent `useEffect` hooks that simply update `layer.show`, causing zero camera disruption.

3. **Event Listener Cleanup:**
   - `updateLOD` is stored in a ref (`updateLODRef.current`) and cleanly deregistered on unmount via:
     `v.camera.moveEnd.removeEventListener(updateLODRef.current)`

4. **LOD Transition Hysteresis:**
   - Added a 25m deadband buffer to avoid rapid oscillating transitions between LOD levels when zooming continuously near boundary thresholds (350m and 1000m).
