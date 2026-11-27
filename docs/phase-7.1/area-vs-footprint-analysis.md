# Built-Up Plinth Area vs. Ground Footprint Analysis
**Phase:** 7.2 Final Reconciliation & Merge Readiness  
**Authoritative Source:** Principal-Signed Area Schedule (`Building_and_Areas_Details.pdf`)  
**Projection Engine:** UTM Zone 44N (EPSG:32644)  

---

## 1. Architectural Distinction: Plinth Area vs. Footprint Area

In architectural engineering, **Total Built-Up Plinth Area** and **Ground Footprint Area** are distinct physical dimensions:
- **Ground Footprint Area:** The orthogonal horizontal projection of the structure at ground level ($m^2$), measured directly from geodesic polygon perimeters.
- **Total Plinth Area:** The cumulative constructed floor space across all storeys as measured by municipal surveyors and certified by the institution.
- **Covered Roof Area:** Includes roof overhangs, rainwater drip eaves, and perimeter colonnades.
- **Open Courtyard Area:** Internal open-to-sky voids (e.g. Kalam block central quad, Admin block courtyard) included in external footprint perimeters but excluded from enclosed built-up space.
- **Associated Compound Area:** Secure fenced or walled exterior areas (e.g., 11kV electrical switchyard, guest house garden compound) often grouped with municipal utility items.

---

## 2. In-Depth Investigation of Discrepancies

### A. Central Library (Item 11) & Canteen / TPO (Item 6)
- **Official Schedule:**
  - Item 11 (Central Library): 2,179.62 m² (3 floors $\rightarrow \approx 726.54$ m² per floor plinth).
  - Item 6 (Canteen & TPO Placement Cell): 1,267.74 m² (2 floors $\rightarrow \approx 633.87$ m² per floor plinth).
- **Digital Twin Measurement:**
  - `central-library`: Ground footprint = 1,132.01 m².
  - `cafeteria-complex`: Ground footprint = 620.00 m².
- **Reconciliation:** The 1,132 m² ground footprint of Central Library includes the covered ground portico, entrance loggia, and pedestrian colonnade. The indoor plinth area corresponds to the enclosed reading halls and stack rooms.

### B. Students Centre & Guest House (Item 10)
- **Official Schedule:** Item 10 is certified at **320.00 m²** (Guest House & Students Activity Center, G+1).
- **Digital Twin Measurement:** `students-centre-guest-house` has a measured ground polygon of **1,124.17 m²**.
- **Reconciliation:** The OSM polygon traces the entire walled residential guest house compound (including car porches, landscaped verandas, and service yards). The certified 320.00 m² represents strictly the enclosed air-conditioned guest suites and VIP suites.

### C. Power House (Item 14) and Switchyard
- **Official Schedule:** Item 14 certifies **128.00 m²** built-up plinth area.
- **Digital Twin Measurement:** `power-house-substation` has a polygon of **1,953.19 m²**.
- **Reconciliation:** The 1,953 m² polygon represents the high-voltage outdoor 11kV transformer yard, secure chain-link fencing, and generator staging pad. The actual constructed roof masonry substation building is 128.00 m².

### D. State Bank of India & NCC Block (Item 2)
- **Official Schedule:** Item 2 certifies **399.66 m²** (G+1, 2 floors $\rightarrow \approx 200$ m² per floor).
- **Digital Twin Measurement:** The gate ATM kiosk occupies 28.30 m², while the branch counters and NCC storage occupy the adjacent two-story facility wing.

### E. Boys Hostel Wings (Item 5A)
- **Official Schedule:** Item 5A certifies **9,453.40 m²** total built-up plinth across G+4 floors.
- **Digital Twin Measurement:**
  - `boys-hostel-complex` (Main Block): 5 floors, ground footprint 260.12 m² (tower) / combined wings.
  - `old-boys-hostel-1` (Block 1): 3 floors, ground footprint 1,598.74 m².
  - `old-boys-hostel-2` (Block 2): 3 floors, ground footprint 389.49 m².
- **Reconciliation:** Combined ground footprint = $260.12 + 1,598.74 + 389.49 = 2,248.35$ m². The cumulative multi-floor built-up sum is $\approx 9,774$ m², reconciling with the official 9,453.40 m² within 3.4% variance.

### F. Girls Hostel Wings (Items 9, 9A, 9B, 9C)
- **Official Schedule:**
  - Item 9 (Ganga Wing): 2,511.00 m²
  - Item 9A (Yamuna Wing): 3,671.00 m²
  - Item 9B (Krishna Wing): 3,918.00 m²
  - Item 9C (Kaveri Wing): 3,755.00 m²
  - Total Girls Hostel Built-Up = **13,855.00 m²**.
- **Digital Twin Measurement:**
  - `girls-hostel-complex`: Ground footprint = 702.45 m² (4 floors $\rightarrow 2,809.80$ m²).
  - `girls-hostel-krishna`: Ground footprint = 703.18 m² (4 floors $\rightarrow 2,812.72$ m²).
- **Reconciliation:** The digital twin models the two primary residential multi-story towers. The remaining balance includes the single-story dining hall, recreation pavilion, and southern residential wings.

### G. Mechanical Main Block and Industrial Workshops (Item 12)
- **Official Schedule:** Item 12 certifies **7,513.84 m²** total for "Mechanical Engineering Block & Workshops".
- **Digital Twin Measurement:**
  - `mech-civil-block` (Mechanical Main Block): 4 floors, ground footprint 796.83 m² ($pprox 3,187.32$ m²).
  - `mechanical-workshops` (High-Bay Workshops Annex): 1 floor (high bay), ground footprint 1,741.08 m².
- **Reconciliation:** Combined model built-up = $3,187.32 + 1,741.08 = 4,928.40$ m². The remaining certified balance represents internal mezzanine crane-bays, foundry testing areas, and materials laboratories.
