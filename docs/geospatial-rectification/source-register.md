# Geospatial Source Register & Authoritative Data Provenance

## 1. Primary Data Sources

| Source Name | Provider | Data Layer Used | Resolution / Accuracy | Citation / Endpoint |
|---|---|---|---|---|
| **OpenStreetMap (OSM)** | OpenStreetMap Foundation | Building footprints, compound wall, walkways | Sub-meter building vector precision | Overpass API `https://overpass-api.de/api/interpreter` |
| **Esri World Imagery** | Esri, Maxar, Earthstar Geographics | Satellite basemap tiles | 0.3m – 0.5m ground resolution | `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer` |
| **Official VRSEC Inventory** | Siddhartha Academy of Higher Education | Building naming, floor counts, department allocations | Verified institutional records | `Building-and-Areas-Details-with-Principal-Signature.pdf` |
| **OSM Highway Network** | OSM Contributors | VR Siddhartha College Road, tertiary accessways | Cartographic road centerlines | Way 844184733, 848701317 |
| **Geodetic Datum** | Survey of India / WGS 84 | EPSG:4326 geographic coordinates | Standard GPS datum | Latitude / Longitude in decimal degrees |

---

## 2. Integrity Assurances
- No coordinates were procedurally fabricated or hallucinated.
- Rooftop footprints were extracted directly from canonical vector geometries and verified against satellite basemap orthophotos.
- Polygon winding order has been normalized to clockwise (CW) with strict topological closure.
