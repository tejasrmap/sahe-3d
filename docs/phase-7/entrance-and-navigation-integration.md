# Building Entrances & Navigation Graph Integration Report
**Project:** SAHE-3D Digital Twin Phase 7  
**Files:** `src/data/buildingEntrances.ts`, `src/data/campusPaths.ts`  

---

## 1. Exterior Entrance Anchors

Every building entrance in `src/data/buildingEntrances.ts` has been verified with strict topological constraints:
- **Zero Wall Penetration:** All 26 door coordinates are placed outside the building footprint polygon ($1.5\text{m} - 2.8\text{m}$ offset from facade).
- **Concourse Alignment:** Each entrance is aligned with paved pedestrian walkways and points directly toward the nearest navigation network node.
- **Orientation:** Facade orientations (North, South, East, West) accurately reflect the architectural entry points.

## 2. Navigation Graph Topological Validation

- **Total Path Nodes:** 38 nodes covering all campus sectors.
- **Total Path Edges:** 38 bidirectional edges with realistic pedestrian distance metrics ($12.5\text{m} - 165.0\text{m}$).
- **Graph Reachability:** BFS traversal from `node-gate` confirmed that $100\%$ of path nodes and all 26 building entrances are fully reachable with 0 disconnected subgraphs.
- **Obstacle Avoidance:** Path edges follow designated paved campus avenues, preventing diagonal clipping through building walls or sports pitches.
