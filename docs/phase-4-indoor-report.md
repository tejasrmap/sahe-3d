# SAHE Campus Explorer — Phase 4: Indoor Digital Twin & Building Exploration Report

**Project:** SAHE University 3D Digital Twin (Siddhartha Academy of Higher Education, Kanuru, Vijayawada, AP, India)  
**Coordinates:** `16.4842° N, 80.6928° E`  
**Phase:** Phase 4 — Indoor Digital Twin, Multi-Floor Management, Procedural Indoor Geometry, Room Finder & Indoor Navigation  
**Date:** November 2026  
**Status:** **Production Verified — 100% Automated QA Passed (10/10 Checks)**

---

## 1. Executive Summary

Phase 4 introduces an **Indoor Campus Digital Twin** to the SAHE Campus Explorer web application. Users can seamlessly transition from the 3D outdoor geographic environment directly into the multi-floor interior of any campus building.

The indoor digital twin features:
- High-fidelity CAD-calibrated blueprints for core academic and administrative complexes (CSE & Computing Complex, ECE & Electronics Wing, Mechanical & Civil Engineering Block, Administrative Headquarters & Central Library).
- An algorithmic procedural generator supplying 100% indoor multi-floor coverage for all other university facilities.
- Smooth elevator-style multi-floor selector with elevation tracking.
- Interactive 2.5D architectural blueprint and 3D isometric cutaway views with pan and zoom.
- Full room inspection cards detailing capacities, dimensions, academic departments, installed research equipment, and hardware.
- Real-time indoor pedestrian pathfinding from building entrances to target doorways with animated neon routes.
- Indoor room search with auto-floor jump and filter categories (Labs, Classrooms, Offices, Seminar Halls, Libraries).

---

## 2. Transition Architecture: Outdoor Campus ⟷ Indoor Digital Twin

1. **Activation Trigger:** Selecting any campus building (via map click, universal search, or directory sidebar) presents a prominent **"Explore Interior (Multi-Floor Digital Twin)"** action in [BuildingDetailsPanel.tsx](file:///c:/Users/tejag/Downloads/SAHE-DT/src/components/buildings/BuildingDetailsPanel.tsx).
2. **Smooth Transition:** Camera motion smoothly halts outdoor orbit/first-person mode, loading the indoor digital twin environment in [IndoorExplorationModal.tsx](file:///c:/Users/tejag/Downloads/SAHE-DT/src/components/indoor/IndoorExplorationModal.tsx).
3. **Seamless Return:** Pressing **Escape** or clicking **"Exit to Campus"** returns the user to the outdoor 3D Cesium canvas at the exact previous camera perspective without reloading or re-initializing the GIS engine.

---

## 3. Floor Management System

Implemented in [FloorSelector.tsx](file:///c:/Users/tejag/Downloads/SAHE-DT/src/components/indoor/FloorSelector.tsx):
- **Vertical Elevator Stack:** Floor levels arranged vertically (`4`, `3`, `2`, `1`, `G`, `-1` for basement if present), mimicking high-speed elevator controls.
- **Active Level Indication:** Glowing emerald indicator with a live radar pulse pin.
- **Elevation Indicator:** Live calculation of floor height above ground (`+0m`, `+4.2m`, `+8.4m`, `+12.6m`, `+16.8m`).
- **Elevator Up/Down Controls:** Quick navigation buttons to shift between adjacent levels.
- **Floor-Specific Titles:** Descriptive level names (e.g. *"Ground Floor — Reception, High-Performance Computing & Lecture Halls"* vs *"Fourth Floor — Postgraduate Research Center & Roof Observatory"*).

---

## 4. Indoor Building Data Architecture

The modular data structure is organized in `src/data/indoor/`:

```
src/data/indoor/
├── types.ts                        # Schemas for Rooms, Floors, Corridors, Stairs, Elevators
├── index.ts                        # Unified catalog and getIndoorBuildingData() selector
├── proceduralIndoorGenerator.ts    # Procedural multi-floor generator for 100% campus coverage
└── buildings/
    ├── cseBlock.ts                 # VR Siddhartha CSE & Computing Complex (5 Floors, 24 Rooms)
    ├── eceBlock.ts                 # ECE & Electronics Wing (4 Floors, 18 Rooms)
    ├── mechCivilBlock.ts           # Mechanical & Civil Engineering Block (4 Floors, 18 Rooms)
    └── adminLibrary.ts             # Administrative Building & Central Library (4 Floors, 20 Rooms)
```

### Core Building Highlights:

1. **VR Siddhartha CSE & Computing Complex (`CSE-BLK`, 5 Floors):**
   - **Ground Floor:** NVIDIA AI & Deep Learning Supercomputing Center (4x DGX A100 Pods, 40x RTX 4090 rigs), Cloud Cluster Lab, NOC Server Room, Student Innovation Lounge.
   - **Floor 1:** HOD Office, Cybersecurity Cyber-Range Lab, IoT & Edge Computing Lab with 3D printers, Faculty Cubicles.
   - **Floor 2:** Big Data & Hadoop Lab, 100-seat Doctoral Defense Hall, Full-Stack Studio.
   - **Floor 3:** Computer Vision & AR/VR Lab (Meta Quest 3 + OptiTrack mocap), Departmental Digital Library, Blockchain Lab.
   - **Floor 4:** PhD Research Scholar Workspace, 32-seat Executive Council Board Room.

2. **ECE & Electronics Sciences Wing (`ECE-BLK`, 4 Floors):**
   - **Ground Floor:** Electronic Devices & Circuits Lab, Analog IC Lab, Main Reception.
   - **Floor 1:** Embedded Systems Lab (ARM Cortex/STM32), DSP Lab, HOD Office.
   - **Floor 2:** Advanced VLSI Design Lab (Cadence Virtuoso, Synopsys, Xilinx FPGA), Robotics & Autonomous Mechatronics Center (KUKA 6-DOF arm, TurtleBot 4).
   - **Floor 3:** Anechoic Microwave & Antenna Chamber (Keysight VNA to 40GHz), Optical Fiber Lab, 120-seat ECE Seminar Hall.

3. **Mechanical & Civil Engineering Complex (`ME-CE-BLK`, 4 Floors):**
   - **Ground Floor:** 100-ton Universal Testing Machine (UTM) Lab, CNC Machining Center (HAAS 3-Axis), Concrete Technology Lab, Thermal Engineering & IC Engines Lab.
   - **Floor 1:** HOD Chambers, Fluid Mechanics & Pelton/Francis Turbines Lab, Total Station & RTK DGPS Survey Lab.
   - **Floor 2:** CAD/CAM & ANSYS FEA Suite, Structural ETABS & Earthquake Shaking Table Lab.
   - **Floor 3:** Environmental Water Quality Lab, Festo Pneumatics & Industrial Delta Robot Lab, 140-seat Joint Seminar Hall.

4. **Administrative Headquarters & Central Library (`ADM-LIB`, 4 Floors):**
   - **Ground Floor:** Triple-height Information Atrium, Registrar & Admissions Chamber, Accounts & Finance Counters, 3M RFID Book Circulation Desk, Newspaper Lounge.
   - **Floor 1:** 50,000+ volume Engineering Book Stacks, 120-seat Silent Reading Hall, Conservation Lab.
   - **Floor 2:** 80-terminal National Knowledge Network (NKN) Digital Library, Doctoral Dissertation Vault, Acoustic Glass Research Pods.
   - **Floor 3:** Vice-Chancellor Executive Secretariat, 40-seat Semicircular Parliamentary Senate & Syndicate Board Room, Academic Deans Chambers.

---

## 5. Procedural Indoor Floor Plan Generation

When viewing any other campus building (e.g. Electrical Sciences Block, Student Dining Complex, Sports Center, Hostels), [proceduralIndoorGenerator.ts](file:///c:/Users/tejag/Downloads/SAHE-DT/src/data/indoor/proceduralIndoorGenerator.ts) dynamically generates a compliant blueprint matching the building's geometry and floor count:
- Main central corridors with transverse branches and natural egress pathways.
- Symmetrical staircase towers on east and west wings.
- Central elevator shafts with passenger cabins.
- Room layouts tailored to building categories (Classrooms, Labs, Offices, Seminar Halls, Dining, Athletic Gyms).
- Door openings, wall notches, and corridor alignment lines.

---

## 6. Interactive Indoor UI & Canvas Capabilities

### 6.1 2.5D Blueprint & 3D Isometric View
- **2.5D Architectural Blueprint:** High-contrast dark blueprint view with coordinate grid, wall lines, door openings, room badges, and scale reference (1:100).
- **3D Isometric View:** Perspective 3D cutaway transformation (`rotateX(24deg) rotateZ(-6deg)`) providing depth to interior rooms and circulation corridors.
- **Pan & Zoom:** Smooth mouse drag navigation and scroll wheel zooming (0.4x to 2.8x).

### 6.2 Room Details Drawer
Implemented in [RoomDetailsCard.tsx](file:///c:/Users/tejag/Downloads/SAHE-DT/src/components/indoor/RoomDetailsCard.tsx):
- Displays Room Number, Name, Category chip, Floor level, and Department.
- Capacity indicator and exact metric dimensions ($W \times L$).
- Installed equipment and lab hardware chips.
- "Navigate to Room" button.

### 6.3 Active Indoor Navigation Routing
- Real-time path calculation from ground entrances / stairwell shafts to room doorways.
- Visualized as a glowing dashed neon route (`#22C55E`) with pulsing origin and destination waypoint pins.
- Floating guidance banner at top center of canvas.

### 6.4 Universal Room Search & Category Filtering
Implemented in [IndoorSearch.tsx](file:///c:/Users/tejag/Downloads/SAHE-DT/src/components/indoor/IndoorSearch.tsx):
- Fast autocomplete searching across all rooms in the building.
- Category quick filter chips: **All Rooms**, **Labs**, **Classrooms**, **Offices**, **Seminar Halls**, **Library**.
- Clicking any search suggestion automatically switches the active floor level and opens the room inspection card.

---

## 7. Automated QA Test Results

The automated Puppeteer test suite executed against headless Chrome:

```
=== Phase 4 Indoor Exploration Audit Results ===
Passed Checks (10/10):
  [PASS] HTTP status: 200
  [PASS] Selected CSE & Computing Complex
  [PASS] Explore Interior button displayed in BuildingDetailsPanel
  [PASS] Indoor Exploration Environment launched (Building Title, Ground Floor & Controls verified)
  [PASS] Floor switched to Floor 2 (Level 2 +8.4m verified)
  [PASS] RoomDetailsCard opened with capacity, dimensions, and navigation button
  [PASS] Active Indoor Navigation route drawn on floor plan with waypoint beacon
  [PASS] 3D Isometric View perspective toggle verified
  [PASS] Indoor search auto-navigated to NVIDIA AI Supercomputing Center on Ground Floor
  [PASS] Seamless transition back to outdoor 3D campus viewer verified
ALL PHASE 4 CHECKS PASSED PERFECTLY (0 Failures)
```

### Production Build Metrics:
- **Build Time:** `6.22s`
- **TypeScript Errors:** `0`
- **CSS Bundle:** `63.64 kB` (`12.54 kB` gzip)
- **JavaScript Bundle:** `445.66 kB` (`121.45 kB` gzip)

---

## 8. Captured Verification Screenshots

- [Ground Floor Indoor Environment](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshots/phase4-indoor-ground-floor.png)
- [Floor 2 Multi-Floor Switch](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshots/phase4-indoor-floor2.png)
- [Room Inspection Details Card](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshots/phase4-room-details.png)
- [Active Indoor Navigation Route](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshots/phase4-indoor-navigation.png)
- [3D Isometric Cutaway View](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshots/phase4-indoor-3d-isometric.png)
- [Indoor Room Search Auto-Jump](file:///c:/Users/tejag/Downloads/SAHE-DT/docs/screenshots/phase4-indoor-search.png)
