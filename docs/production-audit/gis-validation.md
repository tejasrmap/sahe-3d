# SAHE-3D GIS Validation & Geospatial Data Audit

**Project:** SAHE-3D Digital Twin  
**Reference Coordinate Origin:** `16.484200° N, 80.692800° E` (Kanuru, Vijayawada, AP, India)  
**Campus Area:** 24.5 Acres (approx. 9.9 Hectares within perimeter boundary)  
**CRS:** WGS84 (EPSG:4326) / Cartesian3 Metric Height

---

## 1. Campus Perimeter Boundary Validation

The campus boundary polygon defined in `src/data/campusConfig.ts`:
- **Vertex Count:** 11 coordinate pairs.
- **Topology:** Closed polygon (first point `[80.690800, 16.481800]` matches terminating point `[80.690800, 16.481800]`).
- **Coordinate Order:** `[longitude, latitude]` standard GIS order for Cesium Cartesian3 / GeoJSON.
- **Winding Order:** Counter-clockwise exterior boundary.
- **Self-Intersections:** 0 self-intersections.
- **Extents:**
  - Min Longitude: `80.690300° E`
  - Max Longitude: `80.695800° E` (Width: ~580 meters)
  - Min Latitude: `16.481600° N`
  - Max Latitude: `16.486400° N` (Height: ~530 meters)

---

## 2. 12 Campus Building Records Audit

Every building record in `src/data/buildings.ts` was audited for geospatial validity and categorized into confidence levels:

| ID | Name | Coordinates | Footprint Points | Height | Confidence |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `cse-it-complex` | VR Siddhartha CSE & Computing Complex | `16.485190° N, 80.691393° E` | 13 | 26m | **Verified** |
| `admin-central-library` | Administrative Block & Central Library | `16.483980° N, 80.693420° E` | 10 | 22m | **Verified** |
| `mech-civil-block` | Mechanical & Civil Engineering Complex | `16.485650° N, 80.692480° E` | 12 | 24m | **Verified** |
| `ece-eie-block` | Electronics & Instrumentation Complex | `16.484680° N, 80.692120° E` | 8 | 20m | **Verified** |
| `mba-mca-block` | School of Management & Computer Apps | `16.483120° N, 80.694150° E` | 8 | 18m | **Source-Based** |
| `central-auditorium` | Dr. Zakir Husain Golden Jubilee Auditorium | `16.483450° N, 80.692850° E` | 8 | 16m | **Verified** |
| `student-amenities` | Student Center, Canteen & Food Court | `16.484850° N, 80.693850° E` | 8 | 12m | **Verified** |
| `indoor-sports-complex`| Siddhartha Indoor Stadium & Gymnasium | `16.482750° N, 80.691850° E` | 8 | 14m | **Source-Based** |
| `boys-hostel-1` | Krishna Boys Hostel Block A | `16.482250° N, 80.694650° E` | 8 | 28m | **Source-Based** |
| `girls-hostel-1` | Godavari Girls Hostel Block | `16.485850° N, 80.694950° E` | 8 | 28m | **Source-Based** |
| `guest-house-faculty` | University Guest House & Faculty Residences | `16.486150° N, 80.693850° E` | 8 | 16m | **Approximate** |
| `main-gate-security` | University Main Gate Arch & Security Station | `16.483210° N, 80.692220° E` | 6 | 8m | **Verified** |

---

## 3. Points of Interest (POIs) Validation

All 15 POIs in `src/data/pois.ts` fall strictly within the campus perimeter and have verified parent building linkages where applicable.
