# SAHE Campus Explorer — Phase 2: Architectural 3D Digital Twin Report

**Institution:** Siddhartha Academy of Higher Education (SAHE) / Velagapudi Ramakrishna Siddhartha Engineering College (VRSEC)  
**Location:** Chalasani Nagar, Kanuru, Vijayawada, Andhra Pradesh – 520007, India  
**Date:** November 2026  
**Status:** Completed & Production Verified  

---

## 1. Executive Summary

Phase 2 upgrades the SAHE Campus Explorer from a basic extruded 3D geographic map into an authentic, multi-tier **Architectural 3D Digital Twin**. The implementation incorporates procedural architectural building generation (multi-floor bands, window glazing, structural spandrels, roof parapets, penthouses, solar PV arrays, and entrance porticos), real-world South Indian campus architectural typology, dynamic Level-of-Detail (LOD), campus landscaping (trees, plazas, turf lawns, streetlights), and cinematic camera presets (including continuous building orbit turntable).

---

## 2. Features Implemented

1. **Procedural Architecture Generation Engine:**
   - Multi-tier floor levels with alternating window ribbon bands and structural RCC spandrels.
   - Tailored architectural profiles per building typology (academic, administrative, acoustic auditorium, sports arena, residential hostel, dining pavilion, medical clinic, entrance portal).
   - Roof architecture generation: perimeter parapet walls, elevator/stair penthouse towers, HVAC cooling chiller banks, and photovoltaic solar canopy arrays.
   - Grand entrance porticos: multi-column canopies, covered arrival plazas, and accessible ramps.

2. **Dual Visualization Modes:**
   - **Architectural Digital Twin Mode:** Full procedural building facades, windows, floor lines, roof equipment, trees, landscaping, and enhanced atmospheric lighting.
   - **Geographic Satellite Mode:** High-performance massing extrusion overlaid on high-resolution satellite imagery for classic GIS navigation.
   - Seamless one-click mode switcher docked in the bottom camera bar.

3. **Multi-Distance Level of Detail (LOD) System:**
   - **LOD 1 (Camera Distance > 1000m):** Base footprint massing with optimized rendering.
   - **LOD 2 (Camera Distance 350m – 1000m):** Floor-by-floor window bands, structural floor dividing belts, and roof parapet walls.
   - **LOD 3 (Camera Distance < 350m):** High architectural detail, entrance porticos with structural columns, glass vestibules, elevator penthouses, HVAC units, and solar arrays.
   - Automatic LOD adaptation triggered on camera move without UI freezing.

4. **Campus Landscaping & Vegetation:**
   - 28 spatially distributed indigenous trees (Neem, Gulmohar with red blooms, Columnar Ashoka, Royal Palms) positioned along the Main Entrance Boulevard, Academic Spine, and Perimeter Road.
   - Paved campus plazas (Central Knowledge Plaza, Auditorium Forecourt, Academic Spine).
   - Manicured lawn areas (Central Academic Quad, Auditorium Green, Main Athletic Turf).
   - Avenue LED solar streetlights.

5. **Cinematic Camera Experience & Orbit Controller:**
   - **Campus Overview:** Aerial 45° perspective of the entire campus.
   - **Architectural 3D:** Oblique perspective optimized for architectural appreciation.
   - **Ground Level:** 2-meter pedestrian eye-level view looking up at campus structures.
   - **Building Orbit:** Continuous 360° smooth turntable orbit around any selected building.
   - **Walking Exploration:** Ground-level camera positioned on the main academic promenade.
   - **Reset View:** Returns smoothly to initial campus orientation.

6. **Enhanced Building Interaction Panel:**
   - Displays **Architecture Confidence Rating**:
     - *Photo-Calibrated Digital Twin* (Green)
     - *Verified Geometry & Facade* (Cyan)
     - *Procedural Approximation* (Amber)
   - "Explore Orbit" button that triggers instant 360° orbit around the active building.

---

## 3. Upgraded Buildings & Architectural Profiles

| Building Code | Building Name | Architectural Style | Floors | Height | Key Upgraded Architectural Elements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CSE-BLK`** | VR Siddhartha CSE Complex | Modern Institutional | 5 | 26m | Ribbon window bands, cobalt blue accent chajjas, 4-column tech portico, rooftop server cooling units & solar array. |
| **`EE-BLK`** | ECE & Electrical Sciences | Modern Institutional | 4 | 24m | Continuous horizontal sunshades, shaded exterior corridors, rooftop solar panel array. |
| **`ME-CE`** | Mech & Civil Engineering | Industrial Engineering | 4 | 22m | Double-height ground floor workshop bays, industrial ventilation louvers, 4-column entrance canopy. |
| **`ADMIN-LIB`** | Central Admin & Library | Classical Academic | 4 | 20m | Monumental 6-column ceremonial portico, double-glazed emerald tint curtain wall, central courtyard. |
| **`AUD-CTR`** | Dr. Zakir Husain Auditorium | Acoustic Auditorium | 2 | 18m | Terracotta/brick-red acoustic facade, elevated fly-tower stage roof profile, wide arrival steps. |
| **`CAFE`** | Central Cafeteria | Pavilion Dining | 2 | 12m | Floor-to-ceiling panoramic glass facade, shaded outdoor pergola dining terrace. |
| **`SPORT-CTR`** | Indoor Sports Complex | High-Bay Sports | 2 | 14m | High-bay stadium volume, clerestory ribbon windows beneath roofline, curved truss roof profile. |
| **`HSTL-B`** | Siddhartha Boys Residency | Residential Dormitory | 5 | 22m | Repetitive dorm window grid, exterior service stairwell tower, rooftop solar water heaters. |
| **`HSTL-G`** | Aditya Women's Residency | Residential Dormitory | 5 | 22m | Enclosed courtyard residential blocks, private balconies, security screening. |
| **`MED-CTR`** | University Health Center | Clinical Healthcare | 2 | 10m | Emergency covered ambulance portico, barrier-free entrance ramp, clean clinical facade. |
| **`GATE-1`** | Grand Entrance Arch & Portal | Monumental Portal | 1 | 8m | Multi-lane ceremonial arch spanning approach road, dual security booths, automated boom barriers. |
| **`PARK-A`** | Multi-Zone Parking Plaza | Canopy Infrastructure | 1 | 4m | Photovoltaic solar roof canopies shading two-wheelers and vehicles, paved driving bays. |

---

## 4. Performance Optimizations

1. **Geometry Caching (`modelCache`):** Procedural geometry calculations for all 12 buildings and their floor bands are computed once and cached, eliminating repetitive geometry generation during camera pan and zoom.
2. **Camera Distance-Based LOD:** Distant buildings render as simplified base polygons, while complex architectural elements (HVAC, solar arrays, porticos, tree canopies) are culled beyond their visual threshold.
3. **Optimized Asset Footprint:** Zero heavy external 3D model downloads; lightweight procedural generation keeps the production bundle under **345 kB** (gzipped: **95 kB**).

---

## 5. Visual Proof & Screenshots

The following verification screenshots were captured during automated live testing of the running application:

- **Architectural Digital Twin Overview:** [`docs/screenshot-phase2-architectural-twin.png`](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshot-phase2-architectural-twin.png)
- **Architectural 3D Perspective Preset:** [`docs/screenshot-phase2-architectural-preset.png`](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshot-phase2-architectural-preset.png)
- **360° Building Turntable Orbit:** [`docs/screenshot-phase2-building-orbit.png`](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshot-phase2-building-orbit.png)
- **Geographic Satellite Mode Switch:** [`docs/screenshot-phase2-geographic-mode.png`](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshot-phase2-geographic-mode.png)
- **Ground-Level Pedestrian View:** [`docs/screenshot-phase2-ground-level.png`](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshot-phase2-ground-level.png)

---

## 6. Build Verification

- **Command:** `npm run build`
- **Modules Transformed:** 2,209 modules
- **Output:**
  - `dist/index.html` (1.58 kB)
  - `dist/assets/index-CEqdfrJv.css` (56.58 kB)
  - `dist/assets/index-Gg28Cfkh.js` (343.45 kB)
- **Status:** **0 Errors, 0 Warnings (Build time: ~6.18s)**
