# Bandar Road (NH65) & Campus Access Road Source and Tag Audit

## 1. Authoritative OpenStreetMap Source Investigation
- **Inspection Date**: November 27, 2026
- **Dataset**: OpenStreetMap Raw Snapshot (`osm_sahe_raw.json`) & Overpass API Verification
- **Coordinate Reference System**: EPSG:4326 (WGS84) / EPSG:32644 (UTM Zone 44N)

## 2. Highway Classification Reconciliation
In Phase 7.3 documentation, Way 240898134 was recorded as `primary`. Authoritative OSM tags verify:
- **OSM Way 240898134**:
  - `highway`: `trunk` (National Highway NH65, formerly NH9)
  - `name`: "Vijayawada - Machilipatnam Road"
  - `alt_name`: "Bandar Road"
  - `ref`: "NH65"
  - `lanes`: "2" (per carriageway; 4 lanes total divided)
  - `oneway`: "yes"
  - `surface`: "asphalt"
  - `motorroad`: "no"
- **OSM Way 850567938 / 851442640**:
  - `highway`: `trunk`
  - `name`: "Vijayawada - Machilipatnam Road"
  - `ref`: "NH65"
  - `lanes`: "2"
  - `oneway`: "yes"
  - `surface`: "asphalt"
- **OSM Way 844184733**:
  - `highway`: `tertiary`
  - `name`: "VR Siddartha Engineering College Road"
  - `source`: "digitalglobe"
  - `junction`: Connects to Way 240898134 at Node 6696694274 `(80.6913815, 16.4820800)`

## 3. Geometric Distinction: Centerline vs. Carriageway Corridor
A road centerline is an abstraction. For two 3.5m lanes with paved curbs and shoulders, each carriageway occupies a **4.0m half-width corridor** (total 8.0m paved width per carriageway). Any metric clearance check must evaluate the distance from the **carriageway corridor edge**, not merely the centerline.


## 4. Road-width evidence limitation

The committed OSM snapshot contains lanes=2, oneway=yes and highway=trunk tags for each carriageway, but no explicit width tag. The 4.0m corridor half-width used by the validation script is a **modelled assumption**: two nominal 3.5m lanes (7.0m total carriageway width) divided by two, plus a 0.5m outer-shoulder allowance. It is not a surveyed carriageway edge. Any reported clearance is therefore a distance to this modelled buffer.

The validator now checks for an OSM width tag first and falls back to the documented assumption only when no usable width tag is present.
