# SAHE-3D Geospatial Baseline Audit & Inventory

**Audit Date:** 2026-11-26  
**Datum:** WGS 84 (EPSG:4326)  
**Campus Location:** Kanuru, Vijayawada, Andhra Pradesh, India (16.4842° N, 80.6928° E)  
**Authoritative References:**  
1. OpenStreetMap (OSM) Canonical Building Footprint Vectors via Overpass API  
2. Esri World Imagery (ArcGIS Rest Services MapServer high-resolution satellite tiles)  
3. VR Siddhartha Engineering College (SAHE) Official Building and Areas Inventory (`Building-and-Areas-Details-with-Principal-Signature.pdf`)  
4. Official Campus Master Boundary and Compound Walls (`Way 1418702313`)

---

## 1. Initial State Inventory (Pre-Rectification)

| ID | Name | Initial Center | Initial Footprint Points | Initial Discrepancy Identified |
|---|---|---|---|---|
| `cse-it-complex` | VR Siddhartha CSE & Computing Complex | `16.485190, 80.691393` | 119 | Center 7.2m offset from true centroid of Way 403282758 |
| `ece-eee-block` | Electronics & Electrical Sciences Block | `16.485267, 80.692469` | 53 | Center 9.9m offset from true centroid of Way 1324048133 |
| `mech-civil-block` | Mechanical & Civil Engineering Block | `16.485271, 80.693554` | 43 | Center 8.9m offset from true centroid of Way 1324048130 |
| `admin-central-library` | Central Administration & Dr. VR Library | `16.484799, 80.692914` | 23 | Center 7.2m offset from true centroid of Way 1324048132 |
| `auditorium-complex` | Dr. Zakir Husain Central Auditorium | `16.484113, 80.692476` | 11 | Center 5.2m offset from true centroid of Way 403282757 |
| `cafeteria-complex` | Central Cafeteria & Student Food Court | `16.484258, 80.693294` | 10 | Center 10.1m offset from true centroid of Way 403282859 |
| `sports-arena` | Indoor Sports Complex & Gymnasium | `16.483332, 80.692106` | 5 | Center 5.0m offset from true centroid of Way 403282763 |
| `boys-hostel-complex` | Siddhartha Boys Residency & Hostel | `16.485550, 80.694600` | 5 | **55.3m placement error!** Footprint was a generic 5-point box |
| `girls-hostel-complex` | Aditya Women's Residency & Hostel | `16.483900, 80.695100` | 5 | **15.3m placement error!** Footprint was a generic 5-point box |
| `health-center` | University Health & Medical Center | `16.483000, 80.692800` | 5 | **47.2m placement error!** Real dispensary is at Way 1320825694 |
| `main-entrance-portal` | SAHE University Grand Entrance Arch & Security | `16.481800, 80.691200` | 5 | Oversized 48m box; actual gate portal is Way 1320824131 |
| `parking-plaza` | Multi-Zone Vehicle Parking Facility | `16.482500, 80.691800` | 5 | Generic box; actual parking polygon is 9-vertex Way 403282755 |
