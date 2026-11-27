# SAHE-3D Phase 5.5 — Baseline Inventory & Problem Statement

## 1. Executive Summary & Git Baseline
- **Project:** SAHE-3D — Siddhartha Academy of Higher Education (VR Siddhartha Engineering College) Digital Twin
- **Location:** Kanuru, Vijayawada, Andhra Pradesh, India (16.4835° N, 80.6930° E)
- **Baseline Git Commit:** `b9a6497136d643f7bc6986b2fb4d13ed3c11a148` (Merge pull request #1 from tejasrmap/fix/reference-campus-reconciliation)
- **Active Working Branch:** `fix/phase55-navigation-poi-validation`
- **Target Repository:** `https://github.com/tejasrmap/sahe-3d`
- **Live Production URL:** `https://sahe-3d.vercel.app`
- **Reference Application (Read-Only):** `https://sahe3dbysahithi.vercel.app/`

---

## 2. Baseline Geospatial Files Inspected
1. `src/data/buildings.ts`: 12 campus buildings with polygonal footprints, heights, and metadata.
2. `src/data/campusConfig.ts`: Geographic center, bounding box, 12-vertex campus perimeter boundary polygon.
3. `src/data/campusPaths.ts`: Pedestrian graph nodes and edges.
4. `src/data/pois.ts`: 15 campus points of interest.
5. `src/data/landscaping.ts`: Campus plazas, green turf polygons, 3D avenue trees, and luminaires.
6. `src/components/map/LandscapingLayer.tsx`: Cesium classification rendering layer for landscaping polygons.
7. `src/utils/routing.ts`: Dijkstra algorithm and A* graph routing engine.

---

## 3. Defects Identified in Baseline Audit
1. **Opaque Green Rectangle over Sports Ground:**
   - In `src/data/landscaping.ts`, `lawn-cricket-oval` was defined as a crude 4-corner bounding box (`[80.6904, 16.4832]` to `[80.6915, 16.4841]`).
   - In `src/components/map/LandscapingLayer.tsx`, it was rendered with `Cesium.Color.fromCssColorString(lawn.color).withAlpha(0.9)`.
   - Result: A completely opaque, harsh green rectangle obscured the satellite imagery of the running track, turf pitch, and athletic field markings.
2. **Missing Building Entrance Architecture:**
   - Pedestrian path nodes for buildings were placed at raw building polygon centroids (`node-cse`, `node-auditorium`, `node-canteen`, etc.).
   - As a consequence, 10 out of 11 building-associated navigation nodes were located physically **INSIDE** building footprints.
   - Routes calculated to these buildings forced virtual pedestrians to penetrate solid exterior walls.
3. **Pedestrian Routing Wall Collisions:**
   - Straight-line edges between centroids traversed building footprints (e.g., edges cut through the Auditorium and Cafeteria).
   - Lack of outdoor paved avenue junction nodes forced artificial wall-crossing vectors.
4. **Duplicate POI Coordinates:**
   - `poi-sbi-atm` and `poi-medical-dispensary` shared identical coordinates (`16.482809, 80.693648`).
   - `poi-central-lib` and `poi-placement-cell` shared identical coordinates (`16.484796, 80.692981`).
   - Result: Markers stacked directly on top of each other, creating UI occlusion and ambiguous spatial navigation.
