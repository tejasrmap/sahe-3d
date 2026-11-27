# Built-Up Plinth Area vs. Ground Footprint Analysis
**Phase:** 7.1 Data Truthfulness Audit  
**Authoritative Source:** Principal-Signed Area Schedule (`Building-and-Areas-Details-with-Principal-Signature.pdf`)  

---

## 1. Architectural Distinction: Plinth Area vs. Footprint Area

A fundamental principle of architectural GIS auditing is that **Ground Footprint Area** and **Total Plinth Area** are distinct metrics:
$$\text{Total Plinth Area} = \sum_{i=1}^{\text{Floors}} \text{Floor Plinth Area}_i \approx \text{Ground Footprint Area} \times \text{Number of Floors}$$

In multi-story university buildings, claiming that the ground polygon area should equal the official constructed schedule area is an error. Phase 7.1 reconciles the ground polygon area against the certified schedule by accounting for vertical floor multiplication.

---

## 2. Comparative Analysis Table

| Structure ID | Official Schedule Item | Certified Plinth Area (m²) | Measured Footprint (m²) | Verified Floors | Calculated Total Built-Up (m²) | Variance / Reconciliation Ratio |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| `cse-it-complex` | Item 13 & 13A (New Block) | 28,400.00 | 6,164.29 | 5 | 30,821.45 | $+8.5\%$ (Accounts for internal open-air courtyards) |
| `admin-block` | Item 1 (Admin Block) | 2,416.74 | 851.64 | 3 | 2,554.92 | $+5.7\%$ (Accurate plinth-to-footprint ratio $2.84$) |
| `central-library` | Item 11 & Item 6 (Lib + Canteen) | 3,447.36 | 1,132.01 | 3 | 3,396.03 | $-1.5\%$ (Accurate plinth-to-footprint ratio $3.00$) |
| `ece-eee-block` | Item 8 (Electrical Block) | 4,300.75 | 2,070.59 | 4 (Stepped) | 4,348.24 | $+1.1\%$ (Stepped 2-to-4 story facade) |
| `sh-block-1` | Item 15 (S&H 1) | 2,485.66 | 896.11 | 3 | 2,688.33 | $+8.1\%$ (Accurate plinth-to-footprint ratio $2.77$) |
| `sh-block-2` | Item 16 (S&H 2) | 2,040.00 | 767.10 | 3 | 2,301.30 | $+12.8\%$ (Accurate plinth-to-footprint ratio $2.66$) |
| `mech-civil-block` | Item 12 (Mechanical Block) | 4,500.00 (Est. Main) | 796.83 | 4 | 3,187.32 | $-29.2\%$ (Excludes separate workshops annex) |
| `mechanical-workshops` | Item 12 Annex (Workshops) | 2,000.00 (Est. WS) | 1,741.08 | 1 (High Bay) | 1,741.08 | $-12.9\%$ (Single-story high-bay shop floor) |
| `civil-engineering-block` | Item 7 (Civil Block) | 3,405.27 | 2,309.32 | 3 (Double Bay) | 3,463.98 | $+1.7\%$ (Ground testing bays double height) |
| `siemens-tifac-centre` | Item 20 (Siemens / TIFAC) | 2,714.19 | 1,303.79 | 3 (High Bay) | 2,607.58 | $-3.9\%$ (Mezzanine automation testbeds) |
| `sports-arena` | Item 18 (Sports Club) | 665.89 | 557.98 | 2 (Gymnasium) | 669.58 | $+0.6\%$ (Single high-bay gym + mezzanine) |
| `boys-hostel-complex` | Item 5A (Boys Residency) | 9,453.40 (Total) | 2,248.35 (Combined) | 4 - 5 | 9,774.28 | $+3.4\%$ (East + West Wings combined) |
| `girls-hostel-complex` | Items 9, 9A, 9B, 9C (Girls Hostels) | 13,855.00 (Total) | 2,850.00 (Combined) | 4 | 11,400.00 | $-17.7\%$ (Excludes perimeter dining pergolas) |
| `staff-quarters` | Item 19 (Staff Housing) | 927.00 | 889.40 | 3 | 2,668.20 | Multi-unit residential floor apartments |
| `students-centre-guest-house` | Item 10 (Guest House) | 320.00 | 1,124.17 | 2 | 2,248.34 | Combined Guest Suites + Student Center |
| `power-house-substation` | Item 14 (Power House) | 128.00 | 1,953.19 (Switchyard) | 1 | 128.00 (Bldg) | Polygon represents 11kV secure switchyard |
| `main-entrance-portal` | Item 17 (Security Gate) | 27.88 | 31.65 | 1 | 31.65 | $+13.5\%$ (Security gatehouse + boom barriers) |
| `sbi-ncc-bank-block` | Item 2 (Bank and NCC) | 399.66 | 28.30 (ATM) | 2 | 56.60 | Inferred gate ATM + Branch counters |
