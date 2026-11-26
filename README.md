# SAHE Campus Explorer | 3D Digital Twin

**"Explore. Discover. Navigate."**

An interactive, production-quality 3D digital twin and geospatial navigation web application for **SAHE University (Siddhartha Academy of Higher Education / Sree Aditya Higher Education)**, located in **Kanuru, Vijayawada, Andhra Pradesh, India**.

Built with **React**, **Vite**, **TypeScript**, **CesiumJS**, **Resium**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **True Geographic Campus Mapping**
   - Precise verified campus coordinates at **16.4842° N, 80.6928° E** (Chalasani Nagar, Kanuru, Vijayawada).
   - Real campus boundary perimeter wall extracted from OpenStreetMap GIS data.
   - High-resolution Esri World Imagery satellite view with fallback to OpenStreetMap.

2. **3D Extruded Buildings & Architecture**
   - Extruded 3D geometry derived directly from OpenStreetMap building footprints (including the 119-node CSE complex, ECE block, Mechanical & Civil block, and Administrative/Library complex).
   - Realistic heights and multi-floor level representations.
   - Dynamic hover highlights, outlines, and floating 3D labels.
   - Full support for future GLB/glTF 3D architectural models.

3. **Interactive Points of Interest (POIs)**
   - Configurable category markers for Academic, Administration, Libraries, High-Performance Labs, Hostels, Food & Cafeterias, Sports Arenas, Parking, Medical, and 24/7 Security Gates.
   - Interactive selection with camera fly-to animations.

4. **Universal Campus Search (Ctrl + K / Cmd + K)**
   - Instant search across building names, codes, departments, facilities, and POIs.
   - Keyboard navigation (arrows + Enter + Escape).
   - Recent searches saved in browser storage.
   - Quick navigation shortcuts.

5. **Campus Pedestrian Navigation & Routing**
   - Graph-based Dijkstra shortest-path navigation running over real campus pedestrian walkways and internal roads.
   - Distance calculation and estimated walking travel time.
   - Turn-by-turn walking directions.
   - Reverse route and clear route support.
   - Glowing walking path polyline.

6. **Contextual Building Information Panel**
   - Slide-in panel on desktop; mobile-responsive bottom sheet.
   - Building photo, code, floor count, height, and active status.
   - Department listings, laboratories, operating hours, and contact details.
   - Direct "Navigate to this Building", "Bookmark", and "Share Location" actions.

7. **Map Controls & User Geolocation**
   - Zoom in / Zoom out, 3D compass reset to SAHE campus.
   - Layer toggles: Satellite Imagery, 3D Buildings, POIs, Labels, and Campus Boundary.
   - Browser geolocation with accuracy circle and distance-to-campus detection.
   - Fullscreen mode.

8. **Design & UX**
   - Futuristic dark glassmorphism (`#080B12` base, blur panels, neon-emerald accents).
   - Responsive layout tested across desktop, tablet, and mobile (390x844).

---

## 🏗️ Project Architecture & File Structure

```
SAHE-DT/
├── .env.example                     # Environment template
├── index.html                       # HTML entry point with Inter fonts
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Theme colors, glass shadows, neon glow
├── vite.config.ts                   # Vite + Cesium asset bundler plugin
├── src/
│   ├── main.tsx                     # Application entry point
│   ├── App.tsx                      # Main application orchestrator
│   ├── index.css                    # Tailwind CSS & Cesium dark theme rules
│   ├── types/
│   │   └── campus.ts                # TypeScript interfaces (Building, POI, Route, Config)
│   ├── data/
│   │   ├── campusConfig.ts          # Verified campus coordinates, center & boundary
│   │   ├── buildings.ts             # 12 campus buildings with real footprints & metadata
│   │   ├── pois.ts                  # Points of interest across 13 categories
│   │   └── campusPaths.ts           # Interconnected campus walkway graph & nodes
│   ├── hooks/
│   │   ├── useCampusSearch.ts       # Instant search, keyboard navigation & history
│   │   ├── useCampusNavigation.ts   # Route computation & waypoint management
│   │   └── useUserLocation.ts       # Geolocation, proximity to campus & error handling
│   ├── utils/
│   │   ├── distance.ts              # Haversine distance & walking time formulas
│   │   ├── geo.ts                   # Cesium Cartesian3 / Cartographic conversions
│   │   └── routing.ts               # Dijkstra shortest path algorithm
│   └── components/
│       ├── layout/
│       │   ├── TopBar.tsx           # Floating glass bar with branding & search
│       │   ├── Sidebar.tsx          # Collapsible directory (Explore, Route, Saved, Info)
│       │   └── MobileNavigation.tsx # Bottom navigation bar for mobile devices
│       ├── search/
│       │   ├── CampusSearch.tsx     # Universal search input & modal trigger
│       │   └── SearchResults.tsx    # Categorized results & recent searches
│       ├── buildings/
│       │   └── BuildingDetailsPanel.tsx # Contextual slide-in details drawer
│       ├── navigation/
│       │   ├── NavigationPanel.tsx  # Waypoint selectors & reverse buttons
│       │   └── RouteSummary.tsx     # Distance, time & step-by-step directions
│       ├── map/
│       │   ├── CampusMap.tsx        # Resium / CesiumJS 3D scene engine
│       │   ├── CampusBoundary.tsx   # Perimeter wall & glowing boundary line
│       │   ├── BuildingLayer.tsx    # 3D extruded building geometry & labels
│       │   ├── POILayer.tsx         # Interactive POI marker layer
│       │   ├── NavigationRoute.tsx  # Glowing walking path overlay
│       │   ├── UserLocation.tsx     # User position beacon & accuracy ring
│       │   └── MapControls.tsx      # Floating zoom, reset, layer toggles
│       └── ui/
│           ├── GlassPanel.tsx       # Glassmorphism container
│           ├── IconButton.tsx       # Accessible tool button with active states
│           ├── Tooltip.tsx          # Floating hover tooltips
│           └── LoadingScreen.tsx    # Animated digital twin startup screen
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+ or pnpm / yarn

### Installation
```bash
git clone <repository-url>
cd SAHE-DT
npm install --legacy-peer-deps
```

### Environment Configuration
Copy the template file to `.env`:
```bash
cp .env.example .env
```
*(Optional: add your Cesium Ion access token to `VITE_CESIUM_ION_TOKEN`. If left blank, the application will automatically stream high-resolution Esri World Satellite Imagery and OpenStreetMap with no API key required).*

### Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Creates an optimized, production-ready build in `dist/` with all Cesium assets automatically compiled.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub / GitLab.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the following build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
4. In Environment Variables, optionally add:
   - `VITE_CESIUM_ION_TOKEN`: `<your-cesium-ion-token>`
5. Click **Deploy**.

---

## 📋 Features Completed vs Future Campus Expansions

### Implemented & Verified
- [x] Verified geographic campus location (16.4842° N, 80.6928° E)
- [x] 3D CesiumJS globe with smooth camera orbit, tilt, pan, and zoom
- [x] High-resolution satellite imagery + street map toggle
- [x] Real OSM building footprints extruded into 3D structures with realistic heights
- [x] 12 major campus blocks (CSE, ECE, Mech/Civil, Admin, Library, Auditorium, Hostels, Sports, Canteen, Medical, Gates)
- [x] 15 interactive Points of Interest across academic, social, athletic, and healthcare categories
- [x] Graph-based pedestrian walking route navigation with turn-by-turn directions and travel time estimation
- [x] Universal fuzzy search with Ctrl+K shortcut, history, and auto-focus
- [x] Slide-in building details drawer with departments, facilities, hours, and navigation integration
- [x] Responsive glassmorphic UI for desktop, tablet, and mobile
- [x] User geolocation with campus proximity checks
- [x] Zero-warning production build

### Optional Future Expansions
- [ ] Import detailed photogrammetric Blender GLB 3D architectural models for individual building interiors.
- [ ] Live campus IoT sensors (smart parking slot occupancy, classroom vacancy).
- [ ] Realtime event timetable integration with university ERP.
