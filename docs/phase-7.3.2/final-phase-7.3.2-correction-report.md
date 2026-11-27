# SAHE-3D — Phase 7.3.2 Correction Report

## Scope

Phase 7.3.2 applies focused corrections to the southern entrance-zone GIS validation and 3D structures on the existing feature branch. Production main was not modified.

## Implemented

1. **Road corridor terminology and evidence**
   - The validator now checks OSM width tags first.
   - The committed OSM snapshot has lane-count tags but no usable width tags for the two Bandar Road carriageways.
   - The 4.0m half-width is explicitly documented as a modelled assumption (two 3.5m lanes per carriageway, divided by two, plus a 0.5m outer-shoulder allowance).
   - Clearance values are labelled as distances to the modelled buffer edge, not surveyed road-edge clearances.

2. **Local road-side classification**
   - The single global road tangent was replaced with a nearest-segment calculation for each footprint vertex.
   - The sign of the offset is established using a campus-side control point along OSM Way 844184733.
   - Westbound and eastbound carriageways are both candidates for the nearest local segment.

3. **Bus-stop anchor validation**
   - The POI and graph node are checked for coordinate agreement.
   - A direct bus-stop-to-gate pedestrian-apron edge is required.
   - The edge length is checked against the straight-line separation.
   - The result is deliberately a WARNING because the repository does not contain an independently georeferenced passenger-platform or shelter polygon. The check proves only that the waiting anchor is outside the modelled corridor.

4. **Entrance and graph-node relationship checks**
   - Each entrance must reference an existing building and navigation node.
   - An approach point must be outside its building footprint and within the configured facade-approach envelope.
   - Door anchors, where present, are checked against the footprint boundary.
   - Approach-to-graph-node separation is measured in EPSG:32644.
   - Links longer than 15m are reported as warnings, not described as coincident door anchors.

5. **Main gate geometry**
   - The gate footprint is now a 12m × 4m rectangle oriented perpendicular to the 20.2° campus-access-road bearing.
   - The 12m span is split into two 2.16m pylons, leaving a nominal 7.68m clear vehicle opening.
   - The gate model uses 4.8m clear vehicle height and a 6.5m lintel top.
   - A physical sign backing wall is rendered separately from its text label.
   - The footprint centre remains at the configured gate location; this orientation is source-derived from the mapped access-road bearing, not a cadastral survey.

6. **Parking canopy model datums**
   - Both canopy records now use a 3.8m roof-top model height.
   - The roof slab is 0.4m thick, with its underside at 3.4m.
   - Eight support columns are generated per canopy (four stations on each of two long edges).
   - Column bases use the scene's 0m ellipsoid datum and their centres/lengths are computed to meet the underside of the roof.
   - Column positions remain procedural perimeter estimates, not surveyed structural-column coordinates.

7. **Regression reliability**
   - TypeScript data exports are loaded through the TypeScript compiler API rather than regex extraction plus eval.
   - The production suite checks dynamic building, entrance, POI, facility and graph records.
   - The GIS validator distinguishes PASS, WARNING and FAIL; warnings no longer get misreported as full passes.
   - The Phase 4 browser suite now exits non-zero on browser console errors, test failures or launch failures.
   - The BuildingLayer hook was moved before its visibility early return so hook order remains stable across renders.

## Known data warnings to review

A current straight-line diagnostic of the entrance records indicates several linked path nodes are more than 15m from their entrance approach points. The updated validator will report these as warnings and include the measured EPSG:32644 separation when run. These are path-node-to-approach gaps; they do not by themselves prove the walkway is wrong, but the connecting walkway should be checked before claiming the node is the door location.

The bus-stop waiting anchor is outside the modelled road corridor, but the actual platform/shelter is not represented as a surveyed polygon.

The road corridor width remains an assumption until a reliable width source, road-edge survey or georeferenced aerial measurement is added.

## Verification status

The source changes have been committed to the existing feature branch. This editing session did not have the user's local workspace or a runnable checkout of the repository, and GitHub Actions returned no workflow runs for the earlier Phase 7.3.1 commit. Therefore:

- The updated Python validator has **not** been independently executed in this session.
- The updated npm production suite has **not** been independently executed in this session.
- The Vite build has **not** been independently executed in this session.
- A live browser screenshot of the corrected gate/canopies has **not** been captured in this session.
- The previously reported Vercel success belongs to an earlier commit and is not treated as verification of the new commits.

Run the updated suite locally before merging:

```bash
python scripts/validate_phase73_southern_gis.py
node test_production_suite.cjs
```

The updated validator must regenerate `docs/phase-7.3.1/gis-validation-results.json`; do not reuse the pre-7.3.2 result JSON as if it were current.

## Merge recommendation

Keep the feature branch unmerged until the updated validator, production test suite, build and browser inspection have been run against the new head. Review the warnings for long entrance-to-node links and verify the bus-stop waiting location against current imagery or on-site evidence.
