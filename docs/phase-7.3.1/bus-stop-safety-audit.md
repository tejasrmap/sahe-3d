# Bandar Road Public Bus Stop & Safe Passenger Approach Audit

## 1. Problem Identification
In Phase 7.3, `node-bus-stop` was placed at:
- Latitude: $16.482080^\circ\text{ N}$
- Longitude: $80.691380^\circ\text{ E}$

The mapped highway centerline junction (OSM Way 240898134, Node 6696694274) lies at:
- Latitude: $16.4820800^\circ\text{ N}$
- Longitude: $80.6913815^\circ\text{ E}$

This placed the pedestrian bus stop waiting point directly inside the live 80 km/h traffic lane of Bandar Road.

## 2. Safe Roadside Rectification
The bus stop passenger waiting platform has been moved onto the northern paved sidewalk apron:
- **Rectified Coordinates**:
  - Latitude: **$16.482170^\circ\text{ N}$**
  - Longitude: **$80.691294^\circ\text{ E}$**
- **Distance to Live Carriageway Edge**: **2.52 meters North** of the 4.0m live travel corridor buffer.
- **Distance to Highway Centerline**: **6.52 meters North**.
- **Pedestrian Connection**: Connected directly to `node-gate` (`16.482250, 80.691430`) via a dedicated pedestrian walkway edge across the entrance apron ($17.0\text{ meters}$ distance).
- **Pedestrian Safety**: Completely eliminates any traffic lane conflict or live highway walking hazard.


## 4. Phase 7.3.2 limitation — platform not independently mapped

The current GIS dataset contains a bus-stop POI and a pedestrian graph node, but no separately georeferenced polygon for a passenger waiting platform, shelter or boarding bay. The validator confirms that the waiting anchor is outside the **modelled** 4.0m carriageway corridor and that the POI and graph node agree. This does not certify the existence, dimensions, accessibility or physical safety of a constructed bus-stop platform. On-site or authoritative transit-facility evidence is still required for that stronger claim.
