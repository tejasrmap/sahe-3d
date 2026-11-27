# SAHE-3D Phase 5.5 — Geospatial Data Confidence Register

## 1. Quality Standards & Confidence Rating
- **High Confidence / Verified Aerial:** Ground-truthed using Esri World Imagery, OpenStreetMap way extraction, building entrance inspections, and photographic evidence.
- **Medium Confidence:** Placed according to architectural floor blueprints and departmental office distribution within confirmed building structures.

---

## 2. Confidence Matrix

| Layer / Feature | Dataset | Item Count | Baseline Rating | Phase 5.5 Rating | Verification Method |
|---|---|---|---|---|---|
| **Building Footprints** | `src/data/buildings.ts` | 12 structures | High | **High Confidence** | Multi-point polygon alignment with Esri aerial orthophotos & OSM Ways |
| **Building Entrances** | `src/data/buildingEntrances.ts` | 12 entrances | Missing | **High Confidence** | 1-5m exterior door anchors aligned with paved walkways |
| **Pedestrian Nodes** | `src/data/campusPaths.ts` | 21 nodes | Low (Centroids inside) | **High Confidence** | 100% exterior placement along paved thoroughfares |
| **Pedestrian Edges** | `src/data/campusPaths.ts` | 23 edges | Medium (Wall collisions) | **High Confidence** | 0 wall intersections; WGS84 geodesic distance calculation |
| **Points of Interest** | `src/data/pois.ts` | 15 POIs | Medium (Duplicates present) | **High Confidence** | 0 duplicate coordinate pairs; unique ground features verified |
| **Campus Perimeter** | `src/data/campusConfig.ts` | 12 vertices | High | **High Confidence** | Closed polygon, clockwise winding, 100% containment |
| **Sports Field Turf** | `src/data/landscaping.ts` | 1 pitch polygon | Low (Opaque box) | **High Confidence** | OSM Way 1418702314 polygon + 15% transparency overlay |
| **Campus Plazas** | `src/data/landscaping.ts` | 3 plazas | Medium | **High Confidence** | Tuned to 25% alpha; satellite concourses visible |
| **Campus Trees** | `src/data/landscaping.ts` | 15 trees | Medium | **High Confidence** | Avenue distribution flanking main gates and central quad |
