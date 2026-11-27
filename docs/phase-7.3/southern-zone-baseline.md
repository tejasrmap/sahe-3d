# Phase 7.3 Southern Zone Baseline Report
# Defect Identification, Ground Truth Road Geometry & Root Cause Analysis

## 1. Executive Summary
During validation of the Phase 7/7.1 expanded digital twin, inspection of the production application and satellite imagery revealed that multiple campus facilities at the southern perimeter—specifically `main-entrance-portal`, `sbi-ncc-bank-block`, `parking-plaza` (West Bike Stand), and `bike-stand-2` (East Bike Stand)—were erroneously positioned on the southern side of the major public highway **Vijayawada - Machilipatnam Road (Bandar Road / NH65)**.

The buildings were rendered inside the residential canal bank strip abutting Bandar Canal, approximately 30 to 45 meters south of their physical university locations.

## 2. Root Cause Analysis
In earlier data synthesis stages, automated OSM building footprint extraction matched residential and commercial structures south of Bandar Road:
- OSM Way 1320824131 (residential structure at lat 16.481806) -> misattributed to `main-entrance-portal`.
- OSM Way 1320824137 (commercial strip at lat 16.481853) -> misattributed to `sbi-ncc-bank-block`.
- OSM Way 1320824558 (residential block at lat 16.481969) -> misattributed to `parking-plaza`.
- OSM Way 1320824559 (residential block at lat 16.481942) -> misattributed to `bike-stand-2`.

Because Bandar Road is a divided 4-lane national highway (NH65) whose westbound northern carriageway runs between Latitudes **16.482080 and 16.482134**, assigning coordinates with latitudes < 16.48205 placed campus facilities across the highway onto the canal bank.

## 3. Ground Truth Highway Geometry
The highway corridor was identified via verified OpenStreetMap ways:
- **Westbound Carriageway (North)**: OSM Way 240898134
  - Node 2482313398: `(80.6912115, 16.4821343)`
  - Node 2482313401: `(80.6913815, 16.4820800)` [Campus Entrance T-Junction]
  - Node 2482313404: `(80.6918339, 16.4819337)`
- **Eastbound Carriageway (South)**: OSM Ways 850567938 & 851442640 (Lat 16.4819322 - 16.4820223)
- **Canal Bridge**: OSM Ways 374385976 & 374385977 (Crosses Bandar Canal into Kanuru)
- **Campus Entrance Avenue**: OSM Way 844184733 (`VR Siddartha Engineering College Road`)
  - Branches north-northeast (azimuth 20.20°) from `(80.6913815, 16.4820800)` directly into the campus gate.

## 4. Rectification Requirements
1. Every university structure must reside strictly NORTH of the Bandar Road north curb (Lat > 16.48215).
2. The entrance gate must straddle the 12-meter access avenue (`VR Siddartha Engineering College Road`) with an open vehicle portal.
3. The SBI/NCC block must occupy its surveyed compound west of the entrance road.
4. Two-wheeler parking structures must be rendered as elevated covered canopies with ground clearance, not solid opaque concrete cubes.
5. Campus boundary polygon must track the highway setback curb instead of cutting into the canal.
