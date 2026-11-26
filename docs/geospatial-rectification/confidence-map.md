# Geospatial Confidence Map & Verification Classification

This document classifies every campus entity into standardized confidence tiers based on the evidence available.

---

## 1. Classification Tiers

- **TIER 1 (VERIFIED):** Accurate geographic coordinates, rooftop footprint, height, and naming confirmed against authoritative OpenStreetMap geometry and high-resolution satellite orthophotos.
- **TIER 2 (HIGH CONFIDENCE):** Position, footprint, and orientation visually confirmed against satellite imagery; minor internal facade details or room numbering may use academic baseline schedules.
- **TIER 3 (APPROXIMATE):** General location known; perimeter estimated from surrounding roads and barriers.
- **TIER 4 (UNVERIFIED):** Placed based on hearsay or unverified maps. *(None in SAHE-3D)*

---

## 2. Entity Confidence Breakdown

| Entity ID | Entity Name | Confidence Tier | Evidence & Basis |
|---|---|---|---|
| `cse-it-complex` | CSE & Computing Complex | **VERIFIED** | OSM Way 403282758 (119 nodes), Esri satellite rooftop |
| `ece-eee-block` | ECE & Electrical Sciences Block | **VERIFIED** | OSM Way 1324048133 (53 nodes), Esri satellite rooftop |
| `mech-civil-block` | Mechanical & Civil Block | **VERIFIED** | OSM Way 1324048130 (43 nodes), Siemens CoE ground workshop |
| `admin-central-library` | Central Administration & Library | **VERIFIED** | OSM Way 1324048132 (23 nodes), ceremonial portico |
| `auditorium-complex` | Dr. Zakir Husain Auditorium | **VERIFIED** | OSM Way 403282757 (11 nodes), acoustic roof profile |
| `cafeteria-complex` | Central Cafeteria & Food Court | **VERIFIED** | OSM Way 403282859 (10 nodes), dining pavilion |
| `sports-arena` | Indoor Sports Complex | **VERIFIED** | OSM Way 403282763 (5 nodes), double-height arena |
| `boys-hostel-complex` | Siddhartha Boys Residency | **HIGH CONFIDENCE**| OSM Way 1318966334, northeast campus quadrant |
| `girls-hostel-complex` | Aditya Women's Residency | **HIGH CONFIDENCE**| OSM Way 1320182457, southeast walled compound |
| `health-center` | University Health Center | **VERIFIED** | OSM Way 1320825694, medical dispensary |
| `main-entrance-portal`| Grand Entrance Gate & Security | **VERIFIED** | OSM Way 1320824131, college road access point |
| `parking-plaza` | Vehicle Parking Facility | **VERIFIED** | OSM Way 403282755 (9 nodes), sheltered parking bays |
| `CAMPUS_BOUNDARY` | SAHE Kanuru Campus Boundary | **HIGH CONFIDENCE**| Bounded by OSM Way 1418702313, roads, and compound gates |
| `CAMPUS_POIS` (15 items)| 15 Campus Points of Interest | **VERIFIED / HIGH CONFIDENCE**| Coordinates aligned directly with rectified building portals |
| `CAMPUS_PATH_NETWORK` | Pedestrian Walkway Graph | **VERIFIED** | Connected along campus thoroughfares without wall clipping |
