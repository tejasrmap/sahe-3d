# Directory & Search Integrity Audit Report
**Phase:** 7.1 Data Truthfulness Audit  
**Component:** `src/hooks/useCampusSearch.ts`, `src/components/layout/Sidebar.tsx`  

---

## 1. Directory Integrity Audit

In Phase 7.1, all building, department, and facility directory listings were audited to eliminate cross-entity confusion:

1. **Central Library vs. Admin Block:**
   - Querying "Library" or "Books" resolves strictly to `central-library` (`Central Knowledge Resource & Library Complex`).
   - Querying "Admin", "Registrar", or "Vice Chancellor" resolves strictly to `admin-block` (`Dr. VR Central Administrative Block`).
2. **Canteen vs. TPO:**
   - Querying "Canteen" resolves to `cafeteria-complex` (`Central Cafeteria & Student Food Court`).
   - Querying "TPO" or "Placement" resolves to `central-library` (Training & Placement Cell on 1st Floor) and `cafeteria-complex`.
3. **Civil vs. Mechanical vs. Workshops vs. Siemens CoE:**
   - Querying "Civil" -> `civil-engineering-block`.
   - Querying "Mechanical" -> `mech-civil-block`.
   - Querying "Workshops" -> `mechanical-workshops`.
   - Querying "Siemens" or "TIFAC" -> `siemens-tifac-centre`.
4. **Science & Humanities I vs. II:**
   - "Physics", "Chemistry", "Mathematics" -> `sh-block-1`.
   - "Environmental Sciences", "Sustainability" -> `sh-block-2`.

---

## 2. Relevance Scoring Implementation
In `src/hooks/useCampusSearch.ts`, result ranking prioritizes:
- Exact title/code prefix match ($1^{\text{st}}$ rank).
- Primary building entity matches over nested departments ($2^{\text{nd}}$ rank).
- Substring and facility description matches ($3^{\text{rd}}$ rank).
