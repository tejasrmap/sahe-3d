# Parking Canopy Structure & Column Layout Audit

## 1. Architectural Problem
In Phase 7.3, covered parking canopies (`parking-plaza` and `bike-stand-2`) were converted to elevated roof slabs to avoid appearing as solid multi-story concrete blocks. However, they lacked supporting columns, creating a "floating roof" appearance.

## 2. Dedicated Canopy Component (`ParkingCanopy.tsx`)
A specialized architectural component `ParkingCanopy` was constructed:
- **Elevated Roof Slab**:
  - Ground clearance: $3.4\text{ m}$
  - Roof height: $3.8\text{ m}$ (slab thickness $0.4\text{ m}$)
  - Material: Dark industrial corrugated tensile slate (`#475569` @ 0.85 alpha)
  - Footprint: West Stand $540.0\text{ m}^2$ ($36\text{ m} \times 15\text{ m}$); East Stand $646.0\text{ m}^2$ ($38\text{ m} \times 17\text{ m}$)
- **Structural Supporting Columns**:
  - 8 structural cylindrical posts per shed (4 along front perimeter, 4 along rear perimeter).
  - Height: Ground level $0.0\text{ m}$ to roof soffit $3.4\text{ m}$.
  - Post diameter: $0.44\text{ m}$ ($0.22\text{ m}$ radius).
  - Material: Painted structural galvanized steel (`#94A3B8`).
  - Spacing: Inset 8% from roof perimeter, positioned at longitudinal ratios $[0.08, 0.36, 0.64, 0.92]$ (~$10\text{ m}$ bay spans).
- **Vehicle Circulation**:
  - The ground level remains completely open and transparent, revealing the underlying pavement and parked two-wheelers.
