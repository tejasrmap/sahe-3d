# SAHE-3D Reference Campus Technical & Layout Analysis

## 1. Reference Architecture & Technology Stack

The reference application at `https://sahe3dbysahithi.vercel.app/` was authored by **Dr. Veeramallu Satya Sahithi** and built using a lightweight **vanilla JavaScript + Three.js (v0.128.0)** rendering engine:

| Component | Reference Project (`sahe3dbysahithi`) | Our Project (`sahe-3d`) |
| :--- | :--- | :--- |
| **Rendering Engine** | Three.js (WebGL Canvas) | CesiumJS + Resium (Geospatial 3D Globe) |
| **Geographic Base** | Flat plane with procedural green ground & roads | Real-world WGS84 Ellipsoid with High-Res Satellite Imagery |
| **Coordinate System** | Arbitrary pixel space with linear mapping `W = (p - 743) / 8` | Native EPSG:4326 (WGS84 Latitude / Longitude / Ellipsoidal Height) |
| **Building Geometry** | Procedural box extrusions (`THREE.BoxGeometry`) with canvas-painted window textures | Authoritative OpenStreetMap vector polygons (119-node complexes, multi-wing wings) |
| **Campus Boundaries** | Infinite plane with fog distance (160m - 420m) | Verified 12-vertex surveyed boundary polygon matching perimeter wall |
| **Indoor Twin** | None (exterior massing only) | Multi-floor 2D/3D interactive blueprint viewer with room-level routing |
| **Navigation** | Orbit camera waypoint transitions (`CatmullRomCurve3`) | True Dijkstra A* pedestrian routing graph with ADA accessibility |

---

## 2. Spatial Organization of the Reference Campus

The reference digital twin organizes the campus around a local coordinate space centered near the central academic circle:
- **South (`y ≈ 720 - 868`):** The campus connects to the NH65 highway with the iconic maroon entrance portal bearing the sign `"SIDDHARTHA ACADEMY OF HIGHER EDUCATION"`.
- **South-West (`x ≈ 438, y ≈ 616`):** Athletic sports ground with an elliptical cricket pitch, running track, and nearby bank branch.
- **North-West (`x ≈ 447 - 495, y ≈ 220 - 285`):** The large CSE/IT Quadrangle housing Computer Science, Artificial Intelligence, HCL TSS center, seminar halls, and the Dr. V L Dutt courtyard statue.
- **Center (`x ≈ 650 - 780, y ≈ 250 - 380`):** Core campus circulation spine featuring the Saraswathi Statue garden roundabout, Ramakrishna statue, and central administrative hub.
- **North & East (`x ≈ 790 - 1000, y ≈ 150 - 350`):** Electrical, Civil, Mechanical workshop blocks with solar-paneled roofs, and the Central Library.
- **Far East (`x ≈ 1200 - 1300, y ≈ 245 - 370`):** Student residency zone with the SAHE Boys Hostel and outdoor basketball courts.
- **North Perimeter (`y < 0`):** Neighboring sister campus of PVP Siddhartha Institute of Technology (PVPSIT).

---

## 3. Notable Reference Features & Strengths

1. **Rich Micro-Landmarks:** Identifies real cultural statues and campus focal points:
   - *Saraswathi Statue & KachhaPi* (historic roundabout garden)
   - *Dr. V L Dutt Statue* (CSE inner quadrangle)
   - *Sri Ramakrishna Statue* (main avenue)
2. **Campus Service Recognition:** Catalogs essential student services:
   - *Canara Bank Branch*
   - *Tata Power EV Charging Station*
   - *VRSEC Basketball Courts*
   - *HCL Training Services Center*
3. **Clear Naming & Departmental Attribution:** Clearly attributes department wings (EEE, Mech, Civil, S&H Blocks) to their respective access roads.
