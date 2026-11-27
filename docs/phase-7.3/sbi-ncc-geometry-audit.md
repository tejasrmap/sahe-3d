# SBI & NCC Complex Geometry & Setback Audit

## 1. Architectural & Spatial Specifications
The State Bank of India (VRSEC Campus Branch) and National Cadet Corps (NCC) complex is a permanent G+1 administrative and public utility building located directly west of the campus ceremonial entrance avenue. It features dedicated ATM vestibules, teller counters, branch manager offices, and NCC officer headquarters.

- **Structure Classification**: Independent physical building (`independent_building`)
- **Building Footprint Dimensions**: 16.0 m (East-West) x 12.5 m (North-South)
- **Total Plinth Footprint Area**: 200.0 m²
- **Building Height**: 8.0 m (G+1 floors)
- **Official Schedule Area**: 400.0 m² (total built-up area across 2 floors)

## 2. Coordinate Discrepancy & Rectification
| Attribute | Baseline (Erroneous) | Rectified (Ground Truth) | Improvement Delta |
| :--- | :--- | :--- | :--- |
| **Latitude** | 16.481853° N | 16.482280° N | +47.2 meters North |
| **Longitude** | 80.690978° E | 80.691240° E | +28.0 meters East |
| **Highway Relationship** | 28.1 m South (Canal bank) | 6.46 m North (Inside campus compound) | On campus grounds |
| **Relative Placement** | Overlapping residential lots | Immediately West of Gate avenue | Verified site plan match |

## 3. Rectified Footprint Vertices (WGS84)
```json
[
  [80.6911900, 16.4822019],
  [80.6913306, 16.4822521],
  [80.6912900, 16.4823581],
  [80.6911494, 16.4823079],
  [80.6911900, 16.4822019]
]
```
- **Calculated Footprint Area**: 200.0 m² (exact match to ground footprint)
- **Clearance to Bandar Road Carriageway**: 6.46 m
- **Clearance to Main Gate Pylon**: 4.80 m (driveway access walkway)
- **Clearance to West Parking Shed**: 4.50 m
- **Pairwise Overlap with Adjacent Features**: 0.0000 m²
