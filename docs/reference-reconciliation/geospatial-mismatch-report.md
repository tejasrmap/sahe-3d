# SAHE-3D Geospatial Mismatch & Discrepancy Analysis

## 1. Mismatch Classification Framework

In accordance with Phase 4 guidelines, each spatial discrepancy between the reference project (`sahe3dbysahithi`) and our project (`sahe-3d`) is classified into:

- **Class A:** Reference and our project agree.
- **Class B:** Our project was inaccurate and required correction.
- **Class C:** Reference project is inaccurate (simplified abstraction, non-georeferenced box, or pixel distortion).
- **Class D:** Both were inaccurate and required authoritative reconciliation.
- **Class E:** Cannot determine without ground survey.

---

## 2. Structure-by-Structure Evaluation

### 1. CSE, AI, ECE, EIE Complex (`cse-it-complex`)
- **Reference Representation:** Single extruded rectangle `[w: 13.5, dp: 17.5]` positioned at `[485, 285]`.
- **Our Representation:** Authoritative 119-node architectural polygon derived from OSM Way 403282758.
- **Classification:** **Class C (Reference is simplified).**
- **Analysis:** The physical building on satellite imagery is an intricate multi-wing quadrangle with inner open courtyards. The reference project reduced this to a simple flat-roof box. Our 119-node footprint is preserved as the authoritative ground truth.

### 2. Boys Hostel Complex (`boys-hostel-complex`)
- **Reference Representation:** Extruded box at `[1298, 245]`. In local space, this is placed far east with height 10.5.
- **Our Representation:** Anchored to OSM Way 1318966334 at `16.485343° N, 80.695713° E`.
- **Classification:** **Class A (Substantial Agreement).**
- **Analysis:** When projected via affine calibration, the reference point maps to `16.485520° N, 80.695582° E`, just 24.2 meters from our rectified OSM footprint. Both projects place the boys hostel in the north-east student residency zone.

### 3. Main Entrance Portal (`main-entrance-portal`)
- **Reference Representation:** Detailed 3D procedural entrance gate group at `[492, 868]` with text `"SIDDHARTHA ACADEMY OF HIGHER EDUCATION"`.
- **Our Representation:** Aligned to OSM Way 1320824131 at `16.481751° N, 80.691194° E`.
- **Classification:** **Class A (Direct Agreement).**
- **Analysis:** Both identify the primary university gateway on the southern boundary connecting to the Vijayawada-Machilipatnam Highway (NH65). The reference adds valuable visual confirmation of the official university signage text.

### 4. Cultural Monuments & Statues
- **Reference Representation:** Specific point coordinates for:
  - *Saraswathi Statue & KachhaPi* at `[778, 249]` (`16.485255° N, 80.692944° E`)
  - *Dr. V L Dutt Statue* at `[494, 250]` (`16.485115° N, 80.691504° E`)
  - *Sri Ramakrishna Statue* at `[662, 383]` (`16.484531° N, 80.692271° E`)
- **Our Previous State:** Missing individual POI markers for these specific statues.
- **Classification:** **Class B (Our project was missing verified landmarks).**
- **Action Taken:** Added dedicated POI markers and historical descriptions for all three monuments.

### 5. Campus Banking & EV Charging Services
- **Reference Representation:** Canara Bank at `[383, 708]`; Tata Power EV Charging at `[790, 900]`.
- **Our Previous State:** Only cataloged generic SBI ATM.
- **Classification:** **Class B (Our project had incomplete service records).**
- **Action Taken:** Added Canara Bank Campus Branch and Tata Power EV Charging Station to our verified POIs.
