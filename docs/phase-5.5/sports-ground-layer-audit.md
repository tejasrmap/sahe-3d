# SAHE-3D Phase 5.5 — Sports Ground & Athletic Field Layer Audit

## 1. Problem Statement
In earlier releases, an intense, opaque green rectangle overlaid the western sports field of the SAHE campus. This obscured the satellite imagery underneath, hiding the 400m running track, football pitch, cricket wicket, and spectator pavilions.

## 2. Root Cause Analysis
1. **Geometry Discrepancy:**
   - In `src/data/landscaping.ts`, `lawn-cricket-oval` was defined as an uncalibrated 4-corner bounding box:
     ```ts
     coordinates: [
       [80.6904, 16.4832],
       [80.6915, 16.4832],
       [80.6915, 16.4841],
       [80.6904, 16.4841],
       [80.6904, 16.4832]
     ]
     ```
   - This box did not reflect the oriented trapezoidal boundary of the actual athletic pitch.
2. **Material Opacity Excess:**
   - In `src/components/map/LandscapingLayer.tsx`, `CAMPUS_LAWNS` were rendered with:
     ```tsx
     material: Cesium.Color.fromCssColorString(lawn.color).withAlpha(0.9)
     ```
   - An alpha value of `0.9` (90% opaque) completely masked the high-resolution Esri World Imagery satellite layer beneath it.

## 3. Rectification Implemented
1. **Authoritative Field Boundary:**
   - Extracted canonical OpenStreetMap ground polygon (`Way 1418702314`, tagged as `leisure=pitch`, `sport=cricket`):
     ```ts
     coordinates: [
       [80.6906700, 16.4842784],
       [80.6902094, 16.4828948],
       [80.6912690, 16.4824624],
       [80.6919357, 16.4842135],
       [80.6906700, 16.4842784]
     ]
     ```
2. **Dynamic Opacity Tuning:**
   - Updated `LandscapingLayer.tsx` to apply subtle transparent tints:
     - `athletic-turf`: `alpha = 0.15` (15% tint)
     - Standard campus lawns: `alpha = 0.22` (22% tint)
     - Paved gathering plazas: `alpha = 0.25` (25% tint)
3. **Visual Verification:**
   - The satellite image of the lush grass outfield, clay cricket pitch, running track lanes, and football markings is now 100% visible and sharp through the terrain classification layer.
   - Verified in headless Chrome capture `02_sports_field_satellite.png`.
