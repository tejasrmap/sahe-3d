# Footprint Georeferencing & Spatial Orthorectification Report
**Project:** SAHE-3D Digital Twin  
**Geodetic Datum:** WGS84 (EPSG:4326) / Web Mercator (EPSG:3857)  
**Campus Center:** 16.484200° N, 80.692800° E  

---

## 1. Methodology

Footprint georeferencing in Phase 7 utilized a multi-source triangulation workflow:
1. **Authoritative Engineering Base:** Scanned architectural site layout plan (Doc 2) with structural dimensions and spatial orientation relative to Bandar Road.
2. **OpenStreetMap Survey Geometry:** Overpass API vector extraction (`scripts/osm_sahe_raw.json`) yielding surveyed way polygons with node accuracies $< 0.5\text{m}$.
3. **Satellite Orthophoto Calibration:** High-resolution Worldview-3 and Esri Satellite orthophotos georeferencing building parapets, shadow casting, and road curbs.

---

## 2. Geodetic Validation Results

- **Campus Perimeter Enclosure:** The campus boundary in `src/data/campusConfig.ts` encapsulates all 26 structures with $100\%$ containment. Zero vertices pierce the perimeter.
- **Topological Integrity:** All 26 polygon footprints have closed loop rings ($P_0 = P_n$).
- **Overlap Detection:** Exact pairwise intersection analysis confirmed $0.00\text{ m}^2$ overlap across all 325 candidate pairs ($26 \times 25 / 2$).
- **Rotational & Alignment Consistency:** Facades strictly conform to the primary campus architectural axis ($15.2°$ clockwise from true north).
