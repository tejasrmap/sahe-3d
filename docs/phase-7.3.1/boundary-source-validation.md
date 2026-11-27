# Campus Boundary Source & Dynamic Validation Architecture

## 1. Single Source of Truth Architecture
In earlier phases, `validate_phase73_southern_gis.py` maintained a hardcoded copy of the campus boundary. This risked false positive results if the application boundary changed in `src/data/campusConfig.ts`.

In Phase 7.3.1:
- The canonical boundary is defined strictly in `src/data/campusConfig.ts` (`CAMPUS_CONFIG.boundary`).
- The Python validation suite (`scripts/validate_phase73_southern_gis.py`) dynamically extracts `CAMPUS_CONFIG.boundary` from `src/data/campusConfig.ts` using Node.js subprocess parsing.
- The Node.js production test suite (`test_production_suite.cjs`) dynamically validates closure and coordinate validity directly from `src/data/campusConfig.ts`.
- The Cesium map component (`CampusBoundary.tsx`) renders `CAMPUS_CONFIG.boundary`.
- Zero duplication of boundary coordinates exists anywhere in the codebase.

## 2. Geometric Validity & Compound Wall Verification
- **WGS84 Coordinates**: 15 boundary vertices enclosing the full SAHE university estate.
- **Closure**: First point `[80.690000, 16.482600]` strictly matches closing point `[80.690000, 16.482600]`.
- **Winding**: Clockwise orientation.
- **Self-Intersection**: 0 self-intersections (`is_valid = True` under Shapely/GEOS).
- **Southern Curb Relationship**: The boundary tracks the compound wall setback curb along the north side of Bandar Road ($16.482100^\circ$ to $16.482600^\circ\text{ N}$), strictly north of the live 4.0m highway corridor.
- **100% Containment**: Contains all 26 campus buildings and all 7 outdoor facilities with 0.0000 m² spillover.
