# SAHE Main Gate Geometry & Entrance Portal Audit

## 1. Architectural & Spatial Specifications
The SAHE University Grand Entrance Arch is a monumental ceremonial gateway consisting of two concrete pylon structures supporting an overhead architectural lintel/cross-beam with university signage. The portal spans the 12-meter dual-carriageway campus access avenue (`VR Siddartha Engineering College Road`, OSM Way 844184733).

- **Structure Classification**: Covered canopy / Entrance portal arch
- **Target Dimensions**: Width 12.0 m (across driveway) x Depth 4.0 m (along driveway)
- **Portal Clear Height**: 4.8 m (vertical vehicle clearance for buses/fire tenders)
- **Total Structure Height**: 6.5 m
- **Driveway Azimuth**: 20.20° NNE (aligned with entrance road centerline)

## 2. Coordinate Discrepancy & Rectification
| Attribute | Baseline (Erroneous) | Rectified (Ground Truth) | Improvement Delta |
| :--- | :--- | :--- | :--- |
| **Latitude** | 16.481806° N | 16.482210° N | +44.7 meters North |
| **Longitude** | 80.691194° E | 80.691420° E | +24.1 meters East |
| **Highway Relationship** | 32.5 m South (Canal bank) | 9.44 m North (Campus grounds) | Crosses to proper side |
| **Road Alignment** | Displaced in residential lane | Straddles Way 844184733 | 100% Avenue alignment |
| **3D Rendering** | Solid concrete cube (0-6.5m) | Elevated Arch Portal (4.8m clearance) | Vehicular pass-through |

## 3. Rectified Footprint Vertices (WGS84)
```json
[
  [80.6913738, 16.4821742],
  [80.6914792, 16.4822118],
  [80.6914662, 16.4822458],
  [80.6913608, 16.4822082],
  [80.6913738, 16.4821742]
]
```
- **Calculated Footprint Area**: 48.0 m²
- **Clearance to Highway Centerline**: 9.44 m
- **Pairwise Overlap with Adjacent Features**: 0.0000 m²
