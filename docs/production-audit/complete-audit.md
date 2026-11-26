# SAHE-3D — Complete Production Codebase Audit Report

**Audit Target:** SAHE-3D Campus Explorer  
**Codebase:** React + TypeScript + Vite + CesiumJS (Resium)  
**Workspace:** `C:\Users\tejag\Downloads\SAHE-DT`  
**Audit Date:** November 2026  
**Auditor:** Senior Full-Stack & Geospatial Production Engineer

---

## 1. Issue Classification Matrix

| Priority | Issue Count | Description | Primary Modules |
| :---: | :---: | :--- | :--- |
| **P0** | 2 | Critical lifecycle / state bugs causing scene resets or memory leaks | `CampusMap.tsx`, `useFirstPersonController.ts` |
| **P1** | 3 | High-impact functional problems in basemap layering and navigation | `CampusMap.tsx`, `IndoorMapCanvas.tsx`, `App.tsx` |
| **P2** | 3 | Medium-priority architectural truthfulness and LOD stability issues | `RoomDetailsCard.tsx`, `BuildingLayer.tsx`, `IndoorExplorationModal.tsx` |
| **P3** | 2 | UI/UX polish, touch event containment, and accessibility focus rings | `MobileTouchControls.tsx`, `TopBar.tsx`, `MapControls.tsx` |

---

## 2. Detailed Issue Reports

### Issue P0-1: Cesium Viewer Re-initialization & Imagery Duplication on Layer Toggle
- **File & Function:** `src/components/map/CampusMap.tsx` — `handleViewerLoaded`
- **Observed Problem:** Whenever the user toggles the Satellite layer (`layers.satellite`), the entire `handleViewerLoaded` callback is recreated because `layers.satellite` is in its dependency array `[onViewerReady, layers.satellite]`. The attached `useEffect` re-fires, triggering `viewer.camera.flyTo()` back to the initial campus view, creating duplicate Esri and OSM imagery layers on `viewer.imageryLayers`, and stacking duplicate `updateLOD` listeners on `viewer.camera.moveEnd`.
- **Reproduction Steps:**
  1. Open the application.
  2. Pan/zoom into the CSE Complex or Library.
  3. Click the Satellite layer toggle button in MapControls.
  4. The camera suddenly jumps/flies back to the campus entrance overview, and imagery layers duplicate in memory.
- **Root Cause:** Accidental inclusion of dynamic reactive state (`layers.satellite`) in the Cesium viewer mount callback dependency array, combined with missing initialization guards and unmount event listener cleanup.
- **Proposed Fix:**
  - Add `isInitializedRef` guard to execute viewer setup strictly once.
  - Remove `layers.satellite` from `handleViewerLoaded` dependency array.
  - Manage `satelliteLayerRef.current.show` and `osmLayerRef.current.show` in an independent, targeted `useEffect`.
  - Return a cleanup function from the viewer effect that removes the `updateLOD` listener via `viewer.camera.moveEnd.removeEventListener(updateLOD)`.
- **Verification Method:** Toggle satellite layer multiple times in the browser; verify camera position does not reset, imagery layer count remains constant at 2 (Esri + OSM), and no duplicate listeners are registered.

---

### Issue P0-2: First-Person Mode Live Coordinate Discovery Stale Reference
- **File & Function:** `src/hooks/useFirstPersonController.ts` & `src/App.tsx`
- **Observed Problem:** The proximity discovery interval in `App.tsx` checks `fpPosition.lat` and `fpPosition.lon` every 400ms. Because `fpPosition` is assigned to `posRef.current` (which mutates in place inside `requestAnimationFrame`), `App.tsx` receives the initial coordinate reference. In certain React reconciliation phases, discoveries can fail to update or reference initial gate coordinates.
- **Root Cause:** Mutable ref object passed directly as hook return value without a snapshot getter or reactive position sync.
- **Proposed Fix:** Expose a reactive position state snapshot or `getPosition()` accessor that reads live coordinates during the proximity engine tick.
- **Verification Method:** Enter first-person mode, walk toward the Saraswathi Statue or Library, verify discovery HUD badge updates smoothly in real time.

---

### Issue P1-1: Competing Imagery Basemaps Without Mutual Exclusivity
- **File & Function:** `src/components/map/CampusMap.tsx`
- **Observed Problem:** Both Esri World Imagery (index 1) and OpenStreetMap (index 0) are added to `viewer.imageryLayers`. When satellite imagery is disabled (`layers.satellite = false`), the Esri layer is hidden, but OSM layer visibility is not explicitly synchronized, causing potential tile bleeding or unexpected default blue marble rendering if OSM fails.
- **Root Cause:** Implicit basemap layering without an explicit toggle synchronization between the satellite layer and the street basemap layer.
- **Proposed Fix:** Explicitly toggle `osmLayerRef.current.show = !layers.satellite` (or when Esri encounters load failures) so the user experiences a clear switch between satellite and vector street basemap.
- **Verification Method:** Toggle satellite off in UI; verify clear OpenStreetMap vector tiles render without visual artifacts.

---

### Issue P1-2: Indoor Navigation Route Disconnection on Floor Transitions
- **File & Function:** `src/components/indoor/IndoorMapCanvas.tsx` — `navigationRoutePoints`
- **Observed Problem:** When navigating to a room on an upper floor (e.g. Floor 2) and viewing Floor 1, the route line disappeared completely without indicating the vertical transition point (staircase / elevator beacon).
- **Root Cause:** Filter strictly checked `targetRoom.floor !== floor.floorNumber` and returned `null` instead of rendering a multi-floor beacon pointing to the connecting staircase/elevator.
- **Proposed Fix:** When the target room is on a different floor, render the path to the connecting vertical transit point (staircase/elevator) with a vertical transfer indicator badge.
- **Verification Method:** Search for a room on Level 2 while on Ground Floor; verify route draws directly to the nearest staircase/elevator.

---

### Issue P2-1: Lack of Truthfulness & Ground-Truth Disclaimers on Floor Plans
- **File & Function:** `src/components/indoor/RoomDetailsCard.tsx` & `IndoorExplorationModal.tsx`
- **Observed Problem:** The indoor digital twin renders high-fidelity 2.5D/3D blueprints, but does not clearly communicate to visitors that the room layouts are **source-based procedural estimations** rather than official civil engineering blueprints signed by the university.
- **Root Cause:** Missing metadata disclaimers in the UI headers and room cards.
- **Proposed Fix:** Add an explicit badge (`Source-Based Architectural Approximation`) and an institutional note indicating that floor plans are derived from academic departmental directories and spatial estimations.
- **Verification Method:** Inspect any room details card; verify accuracy classification badge and disclaimer are visible.

---

### Issue P2-2: Rapid LOD Thrashing During Continuous Camera Movement
- **File & Function:** `src/components/map/CampusMap.tsx` — `updateLOD`
- **Observed Problem:** Zooming near 350m or 1000m camera elevation causes `currentLOD` state to alternate rapidly between `LOD2` and `LOD3` or `LOD1` and `LOD2`, causing unnecessary React re-renders of the `BuildingLayer`.
- **Root Cause:** Rigid threshold comparisons (`height > 350`) without hysteresis deadband.
- **Proposed Fix:** Introduce a 25m hysteresis buffer between LOD transition boundaries.
- **Verification Method:** Slowly zoom in and out around 350m; verify stable single LOD transition without flicker.

---

### Issue P3-1: Mobile Touch Joystick Event Propagation
- **File & Function:** `src/components/immersive/MobileTouchControls.tsx`
- **Observed Problem:** Dragging the virtual touch joystick on mobile screens can occasionally propagate touch events to the underlying Cesium canvas.
- **Root Cause:** Missing `e.stopPropagation()` on joystick touch handlers.
- **Proposed Fix:** Add `e.stopPropagation()` and `e.preventDefault()` on joystick touch surfaces.
- **Verification Method:** Test touch joystick on mobile viewport; verify camera does not jerk or fight touch gestures.

---

### Issue P3-2: Visible Focus Rings for Keyboard Accessibility
- **File & Function:** `src/components/layout/TopBar.tsx`, `src/components/map/MapControls.tsx`
- **Observed Problem:** Certain floating icon buttons lacked explicit `focus-visible:ring-2` focus outlines for keyboard-only users.
- **Proposed Fix:** Add Tailwind `focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none` across all interactive control buttons.
- **Verification Method:** Navigate with `Tab` key; verify distinct glowing focus rings on all interactive elements.
