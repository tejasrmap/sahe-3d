# Directory Hierarchy & Search Relevance Audit Report
**Phase:** 7.2 Final Reconciliation & Merge Readiness  

---

## 1. Search Query Relevance Scoring

In `src/hooks/useCampusSearch.ts`, a weighted relevance engine has been implemented to resolve search ambiguities:
- **Title Prefix Match:** +100 points (e.g. typing "Admin" scores "Dr. VR Central Administrative Block" highest).
- **Building Entity:** +40 points over nested internal sub-departments.
- **Code Prefix Match:** +50 points.
- **Facility / Department Substring:** Base relevance score.

### Verification Matrix:
1. **Query "Admin":**
   - Result #1: **Dr. VR Central Administrative Block** (`admin-block`) — Score: 140.
   - Result #2: Business Administration (MBA) in Kalam block — Score: 20.
2. **Query "Library":**
   - Result #1: **Central Knowledge Resource & Library Complex** (`central-library`) — Score: 140.
3. **Query "Mechanical":**
   - Result #1: **Mechanical Engineering Block (Main)** (`mech-civil-block`) — Score: 140.
   - Result #2: **Mechanical Engineering Industrial Workshops** (`mechanical-workshops`) — Score: 120.

---

## 2. Navigation Portal Separation

To eliminate shared portal bottlenecks and path crossing:
- `node-library` (Central Knowledge Library South Entrance): Dedicated portal for `central-library`.
- `node-admin` (Dr. VR Administration South Ceremonial Portico): Dedicated portal for `admin-block`.
- `node-canteen` (Central Dining Pavilion): Dedicated portal for `cafeteria-complex`.
