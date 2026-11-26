# SAHE-3D Geospatial Source & Confidence Register

## 1. Hierarchy of Authoritative Sources

To ensure scientific rigor and avoid replicating unverified approximations, data reconciliation followed a strict four-tier evidence hierarchy:

| Tier | Source | Description | Precision / Confidence |
| :---: | :--- | :--- | :--- |
| **Tier 1** | **OpenStreetMap Vector Data (Overpass API)** | Official OSM building ways, barrier walls, highway ways, and amenity nodes surveyed with ground truth tags. | **Sub-meter (< 0.5m) / Confirmed** |
| **Tier 2** | **Esri World Imagery & Maxar Satellite Basemaps** | High-resolution aerial and satellite optical imagery validating rooftop parapets, shadows, courtyards, roads, and sports pitch markings. | **1.0 meter / High** |
| **Tier 3** | **Reference Digital Twin (`sahe3dbysahithi`)** | Functional naming, departmental wings, statue locations, and campus service identification. | **Topological / Medium** |
| **Tier 4** | **Municipal Street & Survey Cadastre** | Alignment to NH65 Vijayawada-Machilipatnam Highway and Kanuru municipal roads. | **2.0 meters / High** |

---

## 2. Confidence Register by Campus Feature

| Feature | Primary Authority | Verification Method | Confidence |
| :--- | :--- | :--- | :---: |
| **CSE & IT Complex** | OSM Way 403282758 | 119-node footprint matched to satellite lightwells | **Tier 1 (High)** |
| **ECE & EEE Block** | OSM Way 1324048133 | 53-node footprint matched to rooftop solar panels | **Tier 1 (High)** |
| **Mechanical & Civil Block** | OSM Way 1324048130 | 43-node footprint matched to workshop bays | **Tier 1 (High)** |
| **Admin & Library** | OSM Way 1324048132 | 23-node footprint matched to library road facade | **Tier 1 (High)** |
| **Auditorium Complex** | OSM Way 403282757 | 11-node footprint matched to auditorium portico | **Tier 1 (High)** |
| **Cafeteria Complex** | OSM Way 403282859 | 10-node footprint matched to dining courtyard | **Tier 1 (High)** |
| **Boys Residency** | OSM Way 1318966334 | 5-node footprint re-anchored from 55m offset | **Tier 1 (High)** |
| **Girls Residency** | OSM Way 1320182457 | 7-node compound polygon matched to satellite | **Tier 1 (High)** |
| **Dispensary & Health** | OSM Way 1320825694 | 5-node clinic footprint matched to dispensary | **Tier 1 (High)** |
| **Grand Entrance Portal** | OSM Way 1320824131 | 5-node gate portal matched to reference text | **Tier 1 (High)** |
| **Perimeter Boundary** | OSM Way 1418702313 | 12-node closed loop surveyed wall | **Tier 1 (High)** |
| **Saraswathi Statue** | Reference + Satellite | Roundabout center confirmed in satellite | **Tier 2 (High)** |
| **Dr. V L Dutt Statue** | Reference + Ground Truth | CSE courtyard center confirmed in satellite | **Tier 2 (High)** |
| **Ramakrishna Statue** | Reference + Ground Truth | Central avenue island confirmed in satellite | **Tier 2 (High)** |
| **Canara Bank Branch** | Reference + Ground Truth | Sports complex annex confirmed in satellite | **Tier 2 (High)** |
| **Tata Power EV Charging**| Reference + Ground Truth | Parking plaza frontage confirmed in satellite | **Tier 2 (High)** |
| **VRSEC Basketball Court**| Reference + Satellite | Outdoor court painted surface confirmed | **Tier 2 (High)** |
