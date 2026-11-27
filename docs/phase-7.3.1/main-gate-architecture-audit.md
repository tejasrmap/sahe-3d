# Main Gate Architecture & Portal Component Reconstruction

## 1. Architectural Problem in Earlier Phases
In earlier phases, `main-entrance-portal` was rendered as a thin extruded solid polygon. In Phase 7.3, it was rendered as an elevated slab, which avoided blocking the road but appeared as a floating rectangular box without pillars or recognizable gateway architecture.

Furthermore, `architectureProfiles.ts` had contradictory dimensions (24m width, 4 columns), whereas the actual entrance avenue (`VR Siddartha Engineering College Road`) has a 12m curb-to-curb width.

## 2. Dedicated Portal Geometry (`MainGatePortal.tsx`)
A specialized component `MainGatePortal` was developed to represent the monumental university arch:
- **West Support Pylon**:
  - Footprint: Spans from 0.00 to 0.18 along the driveway span ($8.65\text{ m}^2$).
  - Height: $0.0\text{ m}$ to $4.8\text{ m}$ (ground plinth to lintel soffit).
  - Material: Architectural off-white limestone concrete (`#E2E8F0`).
- **East Support Pylon**:
  - Footprint: Spans from 0.82 to 1.00 along the driveway span ($8.65\text{ m}^2$).
  - Height: $0.0\text{ m}$ to $4.8\text{ m}$.
  - Material: Architectural off-white limestone concrete (`#E2E8F0`).
- **Unobstructed Driveway Opening**:
  - Span: $0.18$ to $0.82$ ($7.68\text{ m}$ clear vehicle driveway width).
  - Clear Height: **$4.8\text{ m}$** vertical opening allowing buses, emergency vehicles, and trucks to drive through without visual obstruction.
- **Overhead Architectural Lintel / Arch**:
  - Footprint: Spans the full $12.0\text{ m} \times 4.0\text{ m}$ footprint ($48.08\text{ m}^2$).
  - Height: $4.8\text{ m}$ to $6.5\text{ m}$ (total structure height $6.5\text{ m}$).
  - Material: University ceremonial emerald green (`#065F46`).
- **Signage Banner**:
  - Located on the south front lintel facade: "SIDDHARTHA ACADEMY OF HIGHER EDUCATION\nVR SIDDHARTHA CAMPUS".
- **Integration**: Rendered consistently in both Architectural digital twin and Geographic satellite map modes.
