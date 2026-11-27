# SAHE-3D Phase 7.3: Corrected Geometry & Metric Validation Report

## 1. Overview
This report documents the rectified metric geometries of the southern campus infrastructure for Siddhartha Academy of Higher Education (SAHE), Kanuru, Vijayawada.

All coordinates are projected to UTM Zone 44N ($WGS84$) for millimeter-accurate distance, setback, and collision calculations.

## 2. Rectified Southern Spatial Inventory
| Feature ID | Feature Name | Classification | Center Lat/Lon | Ground Footprint Area | Distance to Highway | Overlap Area |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `main-entrance-portal` | Main Entrance Arch Portal | `covered_canopy` | 16.482210° N, 80.691420° E | 48.0 m² | +9.44 m (North) | 0.0000 m² |
| `sbi-ncc-bank-block` | State Bank of India & NCC | `independent_building` | 16.482280° N, 80.691240° E | 200.0 m² | +6.46 m (North) | 0.0000 m² |
| `parking-plaza` | Two-Wheeler Shed 1 (West) | `covered_canopy` | 16.482380° N, 80.690960° E | 540.0 m² | +10.87 m (North) | 0.0000 m² |
| `bike-stand-2` | Two-Wheeler Shed 2 (East) | `covered_canopy` | 16.482240° N, 80.691760° E | 646.0 m² | +20.17 m (North) | 0.0000 m² |
| `bus-terminal-parking` | University Bus Terminal | `outdoor_facility` | 16.482280° N, 80.692180° E | 1,260.0 m² | +32.41 m (North) | 0.0000 m² |

## 3. Perimeter Boundary Rectification
The southern compound boundary in `src/data/campusConfig.ts` was adjusted from the canal water line (16.481650° N) to follow the northern highway curb setback (Lat 16.482100° N to 16.482600° N):
- South-West Wall corner: `[80.690000, 16.482600]`
- Highway Curb West setback: `[80.690700, 16.482300]`
- Main Entrance West curb: `[80.691350, 16.482100]`
- Main Entrance East curb: `[80.691450, 16.482100]`
- Bus Terminal South curb: `[80.692350, 16.481900]`
- South-East compound corner: `[80.694850, 16.481750]`

## 4. 3D Architectural Rendering Enhancements
1. **Covered Canopies (`parking-plaza`, `bike-stand-2`)**:
   - Elevated roof rendering from `height - 0.5m` to `height` (3.8m).
   - Semi-translucent industrial steel canopy material (`#475569` @ 0.85 alpha).
   - Full open ground clearance allowing vehicle parking floor visibility.
2. **Main Entrance Portal (`main-entrance-portal`)**:
   - Elevated cross-header lintel spanning from `height - 1.8m` (4.7m) to `height` (6.5m).
   - Open vehicular clearance allowing uninterrupted views through the ceremonial avenue.
