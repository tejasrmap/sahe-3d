# SAHE-3D Indoor Digital Twin Quality & Validation Audit

## 1. Truthfulness & Ground-Truth Standard

The Phase 4 indoor digital twin provides comprehensive multi-floor coverage across campus facilities:
- **Dedicated High-Fidelity Blocks:** CSE & Computing Complex, ECE & EIE Block, Mechanical & Civil Block, and Administration / Central Library.
- **100% Procedural Fallback Engine:** Procedural floor and room generator covering all remaining campus buildings.

### Ground-Truth Disclaimers
Because civil architectural CAD drawings are proprietary institutional documents, all indoor blueprints in SAHE-3D are classified with standardized fidelity badges:
- `● Verified Blueprint`: High spatial correlation with institutional lab directories and departmental maps.
- `○ Source-Based Layout`: Departmental structure based on published academic schedules and physical room counts.
- `○ Procedural Architectural Layout`: Synthesized algorithmic layout for exploration demonstration.

## 2. Multi-Floor Navigation & Transfer Waypoints

The indoor pathfinding engine in `IndoorMapCanvas.tsx`:
- Detects whether the target room is on the current floor or an upper/lower floor.
- If target is on current floor: draws a direct route line from entrance to the room door.
- If target is on another floor: draws a path to the nearest vertical transit hub (Staircase / Elevator) with a vertical transfer indicator.
