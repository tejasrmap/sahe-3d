# Phase 5 — Geographic Accuracy & Campus Truthfulness Audit

To ensure maximum academic and spatial truthfulness, every cataloged campus building and point of interest in SAHE-3D has been categorized by source fidelity.

---

## 1. Campus Buildings Confidence Taxonomy

| Building Code | Building Name | Coordinate [Lat, Lon] | Floors / Height | Source & Confidence Tier | Verification Status |
|---|---|---|---|---|---|
| `CSE-BLK` | VR Siddhartha CSE & Computing Complex | `16.48519, 80.691393` | 5 Floors / 26m | **Verified (Photo-Calibrated)** | Verified against campus architectural imagery & survey |
| `ECE-BLK` | ECE & Electrical Engineering Block | `16.48485, 80.69215` | 4 Floors / 20m | **Verified (Photo-Calibrated)** | Verified geometry & facade treatment |
| `MECH-BLK` | Mechanical & Civil Engineering Block | `16.48527, 80.69355` | 4 Floors / 20m | **Verified (Photo-Calibrated)** | Verified footprint and industrial wing structure |
| `ADM-LIB` | Administrative Block & Central Library | `16.48479, 80.69291` | 4 Floors / 22m | **Verified (Photo-Calibrated)** | Monumental entrance & library verified |
| `AUD-BLK` | Dr. K.S. Memorial Auditorium | `16.48411, 80.69247` | 3 Floors / 18m | **Verified (Photo-Calibrated)** | Verified acoustic curved-roof structure |
| `CAFE-BLK`| Campus Cafeteria & Food Court | `16.48425, 80.69329` | 2 Floors / 10m | **Verified Geometry, Estimated Facade** | Footprint verified; interior dining layout source-based |
| `SPRT-BLK`| Indoor Sports Complex & Gymnasium | `16.48333, 80.69210` | 2 Floors / 14m | **Verified Geometry, Estimated Facade** | High-bay hall geometry verified |
| `HOSTEL-B`| Siddhartha Boys Hostel Complex | `16.48555, 80.69460` | 5 Floors / 24m | **Procedural Approximation** | Approximate courtyard block; requires architectural drawings |
| `HOSTEL-G`| Siddhartha Girls Hostel Complex | `16.48390, 80.69510` | 5 Floors / 24m | **Procedural Approximation** | Approximate courtyard block; requires architectural drawings |
| `HLTH-CTR`| Student Health Center | `16.48300, 80.69280` | 1 Floor / 6m | **Verified Geometry, Estimated Facade** | Verified single-story dispensary location |
| `GATE-01` | Main Entrance Gate & Security Portal | `16.48180, 80.69120` | 1 Floor / 8m | **Verified (Photo-Calibrated)** | Monumental gate and security barriers verified |
| `PARK-01` | North & South Parking Plaza | `16.48250, 80.69180` | 1 Floor / 4m | **Verified Geometry, Estimated Facade** | Sheltered parking canopy verified |

---

## 2. Points of Interest (POIs) Fidelity Review

All 15 cataloged POIs (`poi-main-gate`, `poi-central-lib`, `poi-cse-lab`, `poi-canteen-court`, `poi-auditorium`, `poi-siemens-coe`, `poi-sports-ground`, `poi-indoor-gym`, `poi-sbi-atm`, `poi-medical-dispensary`, `poi-boys-hostel`, `poi-girls-hostel`, `poi-parking`, `poi-placement-cell`, `poi-restroom-hub`) correspond to active facilities at SAHE Kanuru.

### Items Requiring Official University Administration Sign-Off:
1. **Floor-Specific Room Numbering:** Rooms in core buildings (CSE, ECE, Library) reflect academic departmental schedules; final blueprint room number signage should be verified by campus facilities management.
2. **Hostel Interior Floor Plans:** Dormitory wings currently utilize procedural residential layouts for privacy and security.
