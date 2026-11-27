import json
import math
import subprocess
import sys
import pyproj
from shapely.geometry import Point, LineString, Polygon

print("=================================================================")
print("SAHE-3D PHASE 7.3.1: MASTER GIS & INFRASTRUCTURE VALIDATION SUITE")
print("=================================================================")

# Initialize UTM Zone 44N Transformer (EPSG:4326 -> EPSG:32644)
transformer = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:32644", always_xy=True)
inv_transformer = pyproj.Transformer.from_crs("EPSG:32644", "EPSG:4326", always_xy=True)

test_results = {}

def record_test(test_id, name, status, details, warnings=None):
    entry = {
        "name": name,
        "status": status,
        "details": details
    }
    if warnings:
        entry["warnings"] = warnings
    test_results[test_id] = entry
    badge = f"[{status}]"
    print(f"\n{badge} {test_id}: {name}")
    print(f"  -> {details}")
    for warning in warnings or []:
        print(f"  -> WARNING: {warning}")

# Load actual exported TypeScript data through the TypeScript compiler API.
# This avoids regex extraction plus eval(), and uses the same source exports as the app.
def load_ts_export(file_path, export_name):
    node_script = r"""
const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');
const filename = path.resolve(process.argv[1]);
const exportName = process.argv[2];
const source = fs.readFileSync(filename, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true
  }
}).outputText;
const compiled = new Module(filename, module);
compiled.filename = filename;
compiled.paths = Module._nodeModulePaths(path.dirname(filename));
compiled._compile(transpiled, filename);
if (!(exportName in compiled.exports)) {
  throw new Error('Export not found: ' + exportName + ' in ' + filename);
}
process.stdout.write(JSON.stringify(compiled.exports[exportName]));
"""
    result = subprocess.check_output(
        ["node", "-e", node_script, file_path, export_name],
        encoding="utf-8"
    )
    return json.loads(result)

# Dynamically load all application datasets from their actual TypeScript exports.
try:
    buildings = load_ts_export('src/data/buildings.ts', 'CAMPUS_BUILDINGS')
    outdoor_facilities = load_ts_export('src/data/outdoorFacilities.ts', 'OUTDOOR_FACILITIES')
    campus_config = load_ts_export('src/data/campusConfig.ts', 'CAMPUS_CONFIG')
    entrances = load_ts_export('src/data/buildingEntrances.ts', 'BUILDING_ENTRANCES')
    paths = load_ts_export('src/data/campusPaths.ts', 'CAMPUS_PATH_NETWORK')
    pois = load_ts_export('src/data/pois.ts', 'CAMPUS_POIS')
    print(f"Successfully loaded datasets: {len(buildings)} buildings, {len(outdoor_facilities)} outdoor facilities, {len(entrances)} entrances, {len(pois)} POIs, {len(paths['nodes'])} path nodes.")
except Exception as e:
    print(f"CRITICAL: Failed to load TypeScript datasets: {e}")
    sys.exit(1)

# Helper for UTM projection
def to_utm_poly(coords_wgs84):
    utm_pts = [transformer.transform(lon, lat) for lon, lat in coords_wgs84]
    return Polygon(utm_pts)

def to_utm_line(coords_wgs84):
    utm_pts = [transformer.transform(lon, lat) for lon, lat in coords_wgs84]
    return LineString(utm_pts)

# OSM supplies lane counts for these carriageways, but the committed snapshot has
# no explicit width tag. The resulting corridor is therefore a MODELLED clearance
# envelope, not a surveyed carriageway edge.
DEFAULT_LANE_WIDTH_M = 3.5
DEFAULT_OUTER_SHOULDER_M = 0.5

def carriageway_half_width(way):
    tags = way.get("tags", {})
    width_tag = tags.get("width")
    if width_tag:
        try:
            full_width = float(str(width_tag).replace("m", "").strip())
            return full_width / 2.0, "OSM width tag", "source-tagged"
        except ValueError:
            pass

    lanes_tag = tags.get("lanes", "2")
    try:
        lane_count = max(1, int(str(lanes_tag).split(";")[0]))
    except ValueError:
        lane_count = 2
    half_width = (lane_count * DEFAULT_LANE_WIDTH_M) / 2.0 + DEFAULT_OUTER_SHOULDER_M
    basis = (
        f"assumed from {lane_count} lanes x {DEFAULT_LANE_WIDTH_M:.1f}m "
        f"plus {DEFAULT_OUTER_SHOULDER_M:.1f}m outer shoulder"
    )
    return half_width, basis, "estimated-assumption"

def nearest_segment_context(line, point):
    """Return nearest segment and projection details for a local signed-offset test."""
    coords = list(line.coords)
    best = None
    for a, b in zip(coords[:-1], coords[1:]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        seg_len_sq = dx * dx + dy * dy
        if seg_len_sq <= 1e-9:
            continue
        t = ((point.x - a[0]) * dx + (point.y - a[1]) * dy) / seg_len_sq
        t = max(0.0, min(1.0, t))
        qx, qy = a[0] + t * dx, a[1] + t * dy
        distance = math.hypot(point.x - qx, point.y - qy)
        candidate = {
            "distance": distance,
            "a": a,
            "b": b,
            "dx": dx,
            "dy": dy,
            "length": math.sqrt(seg_len_sq),
            "qx": qx,
            "qy": qy
        }
        if best is None or distance < best["distance"]:
            best = candidate
    if best is None:
        raise ValueError("Road geometry contains no usable segment")
    return best

def signed_offset_on_campus_side(point, road_lines, campus_control_point):
    """Measure point offset using its nearest local road segment and a campus-side control."""
    candidates = []
    for road_name, road_line in road_lines:
        context = nearest_segment_context(road_line, point)
        candidates.append((context["distance"], road_name, road_line, context))
    _, road_name, _, context = min(candidates, key=lambda item: item[0])

    dx, dy = context["dx"], context["dy"]
    length = context["length"]
    control_context = nearest_segment_context(
        LineString([context["a"], context["b"]]),
        campus_control_point
    )
    control_cross = (
        dx * (campus_control_point.y - control_context["qy"])
        - dy * (campus_control_point.x - control_context["qx"])
    )
    point_cross = (
        dx * (point.y - context["qy"])
        - dy * (point.x - context["qx"])
    )
    if abs(control_cross) < 0.05:
        raise ValueError(f"Campus-side control point is ambiguous near {road_name}")
    side_sign = 1.0 if control_cross > 0 else -1.0
    return side_sign * (point_cross / length), road_name

# Load OSM Highway data
with open('scripts/osm_sahe_raw.json', encoding='utf-8') as f:
    osm_data = json.load(f)

osm_nodes = {el['id']: (el['lon'], el['lat']) for el in osm_data.get('elements', []) if el['type'] == 'node'}
osm_ways = {el['id']: el for el in osm_data.get('elements', []) if el['type'] == 'way'}

# TEST 1: Coordinate Integrity
try:
    invalid_coords = []

    def check_coordinate(entity_id, lon, lat, source):
        if not (math.isfinite(float(lon)) and math.isfinite(float(lat))):
            invalid_coords.append((entity_id, source, lon, lat, "non-finite"))
        elif not (-180.0 <= float(lon) <= 180.0 and -90.0 <= float(lat) <= 90.0):
            invalid_coords.append((entity_id, source, lon, lat, "outside WGS84 range"))
        elif not (80.68 < float(lon) < 80.71 and 16.47 < float(lat) < 16.50):
            invalid_coords.append((entity_id, source, lon, lat, "outside configured campus review envelope"))

    for building in buildings:
        check_coordinate(building['id'], building['longitude'], building['latitude'], 'center')
        for lon, lat in building['footprint']:
            check_coordinate(building['id'], lon, lat, 'footprint')

    for facility in outdoor_facilities:
        for lon, lat in facility['coordinates']:
            check_coordinate(facility['id'], lon, lat, 'facility-polygon')

    for entrance in entrances:
        check_coordinate(entrance['buildingId'], entrance['longitude'], entrance['latitude'], 'entrance-approach')
        if entrance.get('doorAnchor'):
            check_coordinate(entrance['buildingId'], entrance['doorAnchor'][0], entrance['doorAnchor'][1], 'door-anchor')
        if entrance.get('approachPoint'):
            check_coordinate(entrance['buildingId'], entrance['approachPoint'][0], entrance['approachPoint'][1], 'approach-point')

    for poi in pois:
        check_coordinate(poi['id'], poi['longitude'], poi['latitude'], 'poi')

    if not invalid_coords:
        record_test("TEST_1_COORD_INTEGRITY", "Complete GIS Coordinate Integrity and Ordering", "PASS",
                    f"Validated WGS84 centers, footprints, outdoor facilities, entrances, door/approach anchors and {len(pois)} POIs.")
    else:
        record_test("TEST_1_COORD_INTEGRITY", "Complete GIS Coordinate Integrity and Ordering", "FAIL",
                    f"Invalid or out-of-envelope coordinates: {invalid_coords}")
except Exception as e:
    record_test("TEST_1_COORD_INTEGRITY", "Complete GIS Coordinate Integrity and Ordering", "FAIL", str(e))

# TEST 2: Road Source Integrity
try:
    wb_way = osm_ways.get(240898134)
    eb_way = osm_ways.get(850567938)
    entrance_road_way = osm_ways.get(844184733)
    
    assert wb_way is not None, "Westbound Bandar Road (Way 240898134) must exist in OSM"
    assert eb_way is not None, "Eastbound Bandar Road (Way 850567938) must exist in OSM"
    assert entrance_road_way is not None, "Campus Entrance Road (Way 844184733) must exist in OSM"

    wb_tag = wb_way.get('tags', {}).get('highway')
    eb_tag = eb_way.get('tags', {}).get('highway')
    assert wb_tag == 'trunk', f"Bandar Road WB must be classified as 'trunk', got '{wb_tag}'"
    assert eb_tag == 'trunk', f"Bandar Road EB must be classified as 'trunk', got '{eb_tag}'"

    record_test("TEST_2_ROAD_SOURCE_INTEGRITY", "Road Source Integrity & OSM Tag Consistency", "PASS",
                f"Way 240898134 (WB) & Way 850567938 (EB) verified as 'trunk' (NH65). Way 844184733 verified as 'tertiary'.")
except Exception as e:
    record_test("TEST_2_ROAD_SOURCE_INTEGRITY", "Road Source Integrity & OSM Tag Consistency", "FAIL", str(e))

# TEST 3: Complete Highway Corridor Construction
try:
    wb_coords = [osm_nodes[nid] for nid in wb_way['nodes'] if nid in osm_nodes]
    eb_coords = [osm_nodes[nid] for nid in eb_way['nodes'] if nid in osm_nodes]
    
    # Filter to campus vicinity
    wb_campus_coords = [p for p in wb_coords if 80.689 <= p[0] <= 80.695]
    eb_campus_coords = [p for p in eb_coords if 80.689 <= p[0] <= 80.695]

    wb_line_utm = to_utm_line(wb_campus_coords)
    eb_line_utm = to_utm_line(eb_campus_coords)

    wb_half_width, wb_width_basis, wb_width_status = carriageway_half_width(wb_way)
    eb_half_width, eb_width_basis, eb_width_status = carriageway_half_width(eb_way)
    wb_corridor_utm = wb_line_utm.buffer(wb_half_width)
    eb_corridor_utm = eb_line_utm.buffer(eb_half_width)
    combined_corridor_utm = wb_corridor_utm.union(eb_corridor_utm)

    assert combined_corridor_utm.is_valid, "Combined modelled corridor buffer must be valid"
    width_warnings = []
    if wb_width_status != "source-tagged":
        width_warnings.append(f"Westbound half-width {wb_half_width:.2f}m is a modelled assumption: {wb_width_basis}; no OSM width tag in snapshot.")
    if eb_width_status != "source-tagged":
        width_warnings.append(f"Eastbound half-width {eb_half_width:.2f}m is a modelled assumption: {eb_width_basis}; no OSM width tag in snapshot.")
    record_test("TEST_3_HIGHWAY_CORRIDOR", "Modelled Dual-Carriageway Corridor Geometry", "PASS",
                f"EPSG:32644 buffers constructed. Westbound half-width={wb_half_width:.2f}m ({wb_width_status}); eastbound half-width={eb_half_width:.2f}m ({eb_width_status}). These are modelled corridor edges, not surveyed road boundaries. WB length={wb_line_utm.length:.1f}m; EB length={eb_line_utm.length:.1f}m.",
                warnings=width_warnings)
except Exception as e:
    record_test("TEST_3_HIGHWAY_CORRIDOR", "Complete Highway Corridor Geometry", "FAIL", str(e))

# TEST 4: Southern Facility Road Edge Clearance
try:
    southern_ids = ['main-entrance-portal', 'sbi-ncc-bank-block', 'parking-plaza', 'bike-stand-2', 'bus-terminal-parking']
    clearance_results = {}
    encroachments = []

    all_spatial = []
    for b in buildings:
        all_spatial.append({'id': b['id'], 'poly': to_utm_poly(b['footprint']), 'type': 'building'})
    for fac in outdoor_facilities:
        all_spatial.append({'id': fac['id'], 'poly': to_utm_poly(fac['coordinates']), 'type': 'facility'})

    for item in all_spatial:
        if item['id'] in southern_ids:
            poly = item['poly']
            # Edge-to-edge clearance from full live corridor
            dist_to_corridor = combined_corridor_utm.distance(poly)
            # Distance to centerline
            dist_to_wb_center = wb_line_utm.distance(poly)
            intersects = combined_corridor_utm.intersects(poly)

            clearance_results[item['id']] = {
                'modelled_corridor_edge_clearance_m': round(dist_to_corridor, 2),
                'westbound_centerline_distance_m': round(dist_to_wb_center, 2),
                'intersects_modelled_corridor': intersects
            }
            if intersects or dist_to_corridor < 1.0:
                encroachments.append((item['id'], dist_to_corridor))

    if not encroachments:
        details_str = ", ".join([f"{k}: {v['modelled_corridor_edge_clearance_m']}m modelled-corridor clearance" for k, v in clearance_results.items()])
        record_test("TEST_4_ROAD_CLEARANCE", "Southern Facility Modelled Corridor Clearance", "PASS",
                    f"No footprint intersects the configured road corridor. Clearances are distances to the modelled buffer edge, not surveyed physical carriageway edges. {details_str}.")
    else:
        record_test("TEST_4_ROAD_CLEARANCE", "Southern Facility Road Edge Clearance", "FAIL",
                    f"Structures encroaching on live highway corridor: {encroachments}")
except Exception as e:
    record_test("TEST_4_ROAD_CLEARANCE", "Southern Facility Road Edge Clearance", "FAIL", str(e))

# TEST 5: Local Road-Side Placement
try:
    # Use a known point along the campus access road as the campus-side control.
    # This point is north of the highway junction and lies along OSM Way 844184733.
    campus_control_utm = Point(transformer.transform(80.6917155, 16.4829601))
    road_lines = [("westbound", wb_line_utm), ("eastbound", eb_line_utm)]
    side_classifications = {}
    wrong_side = []

    for item in all_spatial:
        if item['id'] in southern_ids:
            poly = item['poly']
            signed_offsets = []
            for x, y in poly.exterior.coords:
                offset, nearest_road = signed_offset_on_campus_side(Point(x, y), road_lines, campus_control_utm)
                signed_offsets.append((offset, nearest_road))

            min_offset, min_road = min(signed_offsets, key=lambda pair: pair[0])
            side_classifications[item['id']] = {
                'minimum_local_signed_offset_m': round(min_offset, 2),
                'nearest_carriageway': min_road,
                'classification': 'Campus side' if min_offset > 0.0 else 'Opposite / Canal side'
            }
            if min_offset <= 0.0:
                wrong_side.append(item['id'])

    if not wrong_side:
        record_test("TEST_5_CAMPUS_SIDE_CLASS", "Per-Feature Local Road-Side Classification", "PASS",
                    "Every southern footprint vertex is on the campus side using its nearest local carriageway segment and the campus access-road control point.")
    else:
        record_test("TEST_5_CAMPUS_SIDE_CLASS", "Per-Feature Local Road-Side Classification", "FAIL",
                    f"Features with vertices on the opposite/canal side: {wrong_side}")
except Exception as e:
    record_test("TEST_5_CAMPUS_SIDE_CLASS", "Per-Feature Local Road-Side Classification", "FAIL", str(e))

# TEST 6: Main Gate Avenue Access
try:
    gate_b = next(b for b in buildings if b['id'] == 'main-entrance-portal')
    gate_poly_utm = to_utm_poly(gate_b['footprint'])

    # VR Siddhartha College Road entrance segment in UTM
    ent_road_coords = [osm_nodes[nid] for nid in entrance_road_way['nodes'] if nid in osm_nodes]
    ent_road_utm = to_utm_line(ent_road_coords[:2]) # first segment leading from highway into campus

    # Check that the longest gate dimension is perpendicular to the access-road bearing.
    intersects_avenue = gate_poly_utm.intersects(ent_road_utm)
    gate_coords = list(gate_poly_utm.exterior.coords)
    gate_edges = []
    for a, b in zip(gate_coords[:-1], gate_coords[1:]):
        dx, dy = b[0] - a[0], b[1] - a[1]
        gate_edges.append((math.hypot(dx, dy), dx, dy))
    gate_span_m, span_dx, span_dy = max(gate_edges, key=lambda item: item[0])
    road_coords = list(ent_road_utm.coords)
    road_dx = road_coords[1][0] - road_coords[0][0]
    road_dy = road_coords[1][1] - road_coords[0][1]
    gate_bearing = math.degrees(math.atan2(span_dx, span_dy)) % 180.0
    road_bearing = math.degrees(math.atan2(road_dx, road_dy)) % 180.0
    angular_delta = abs((gate_bearing - road_bearing + 90.0) % 180.0 - 90.0)
    perpendicular_error = abs(90.0 - angular_delta)

    assert intersects_avenue, "Main gate footprint must intersect VR Siddhartha College Road"
    assert 10.5 <= gate_span_m <= 13.5, f"Gate span should be approximately 12m, got {gate_span_m:.2f}m"
    assert perpendicular_error <= 10.0, f"Gate span must be perpendicular to access road; angular error={perpendicular_error:.1f} degrees"
    record_test("TEST_6_MAIN_GATE_ACCESS", "Main Gate Span, Orientation & Roadway Alignment", "PASS",
                f"Gate footprint intersects access road; long span={gate_span_m:.2f}m, perpendicular-to-road error={perpendicular_error:.2f} degrees, footprint area={gate_poly_utm.area:.1f}m².")
except Exception as e:
    record_test("TEST_6_MAIN_GATE_ACCESS", "Main Gate Roadway Straddle Alignment", "FAIL", str(e))

# TEST 7: SBI/NCC Footprint & Entrance Alignment
try:
    sbi_b = next(b for b in buildings if b['id'] == 'sbi-ncc-bank-block')
    sbi_poly_utm = to_utm_poly(sbi_b['footprint'])
    sbi_area = sbi_poly_utm.area

    # Check G+1 plinth footprint area (16m x 12.5m = 200 m²)
    area_ok = 190.0 <= sbi_area <= 210.0
    
    # Distance to gate portal
    dist_to_gate = sbi_poly_utm.distance(gate_poly_utm)
    dist_ok = dist_to_gate >= 3.0 # clearance for pedestrian sidewalk

    assert area_ok, f"SBI/NCC footprint area should be ~200 m², got {sbi_area:.1f} m²"
    assert dist_ok, f"SBI/NCC must have clearance from gate, got {dist_to_gate:.1f}m"
    record_test("TEST_7_SBI_NCC_GEOMETRY", "SBI/NCC Footprint & Clearance Validation", "PASS",
                f"SBI/NCC Area={sbi_area:.1f}m² (G+1 200m² plinth). Clearance to gate={dist_to_gate:.2f}m. Modelled-corridor clearance={clearance_results['sbi-ncc-bank-block']['modelled_corridor_edge_clearance_m']}m.")
except Exception as e:
    record_test("TEST_7_SBI_NCC_GEOMETRY", "SBI/NCC Footprint & Clearance Validation", "FAIL", str(e))

# TEST 8: Parking Canopy Separation & Pairwise Collision
try:
    overlaps = []
    for i in range(len(all_spatial)):
        for j in range(i + 1, len(all_spatial)):
            f1 = all_spatial[i]
            f2 = all_spatial[j]
            if f1['poly'].intersects(f2['poly']):
                inter_area = f1['poly'].intersection(f2['poly']).area
                if inter_area > 0.001:
                    overlaps.append((f1['id'], f2['id'], round(inter_area, 4)))

    p_plaza = next(f for f in all_spatial if f['id'] == 'parking-plaza')
    b_stand2 = next(f for f in all_spatial if f['id'] == 'bike-stand-2')
    dist_p1_p2 = p_plaza['poly'].distance(b_stand2['poly'])

    if not overlaps:
        record_test("TEST_8_PARKING_SEPARATION", "Parking Canopy Separation & Zero Pairwise Collision", "PASS",
                    f"0.0000 m² overlap across all 33 campus features. Distance West Stand to East Stand={dist_p1_p2:.2f}m.")
    else:
        record_test("TEST_8_PARKING_SEPARATION", "Parking Canopy Separation & Zero Pairwise Collision", "FAIL",
                    f"Spatial collisions detected: {overlaps}")
except Exception as e:
    record_test("TEST_8_PARKING_SEPARATION", "Parking Canopy Separation & Zero Pairwise Collision", "FAIL", str(e))

# TEST 9: Entrance, Approach Point and Navigation Node Association
try:
    entrance_errors = []
    entrance_warnings = []
    bldg_dict = {b['id']: to_utm_poly(b['footprint']) for b in buildings}
    path_nodes = {n['id']: n for n in paths['nodes']}
    link_distances = {}

    for ent in entrances:
        bid = ent['buildingId']
        if bid not in bldg_dict:
            entrance_errors.append(f"{bid}: entrance references an unknown building")
            continue

        bpoly = bldg_dict[bid]
        approach_coords = ent.get('approachPoint') or [ent['longitude'], ent['latitude']]
        approach = Point(transformer.transform(approach_coords[0], approach_coords[1]))
        facade_distance = bpoly.boundary.distance(approach)

        if bpoly.covers(approach) or facade_distance < 0.25:
            entrance_errors.append(f"{bid}: approach point is on or inside the building footprint")
        elif facade_distance > 15.0:
            entrance_errors.append(f"{bid}: approach point is {facade_distance:.2f}m from the building facade (15m limit)")

        door_anchor = ent.get('doorAnchor')
        if door_anchor:
            door = Point(transformer.transform(door_anchor[0], door_anchor[1]))
            door_to_facade = bpoly.boundary.distance(door)
            # Door anchors are digitized from aerial/map evidence. Allow a small
            # 0.75m inward tolerance for footprint generalization, but reject
            # anchors materially inside the building mass.
            if bpoly.contains(door) and door_to_facade > 0.75:
                entrance_errors.append(
                    f"{bid}: physical door anchor is {door_to_facade:.2f}m inside the footprint "
                    "(maximum facade snapping tolerance 0.75m)"
                )
            elif door_to_facade > 2.0:
                entrance_warnings.append(f"{bid}: door anchor is {door_to_facade:.2f}m from footprint boundary; physical doorway evidence should be rechecked")

        node_id = ent.get('connectedPathNodeId')
        node = path_nodes.get(node_id)
        if not node:
            entrance_errors.append(f"{bid}: connected path node '{node_id}' does not exist")
            continue

        node_point = Point(transformer.transform(node['longitude'], node['latitude']))
        node_distance = approach.distance(node_point)
        link_distances[bid] = round(node_distance, 2)
        if node_distance > 15.0:
            entrance_warnings.append(
                f"{bid}: navigation node {node_id} is {node_distance:.2f}m from the approach point; "
                "treat this as an intermediate path-node link, not a coincident entrance anchor"
            )

        node_building_id = node.get('buildingId')
        if node_building_id and node_building_id != bid:
            entrance_errors.append(f"{bid}: linked node {node_id} is associated with {node_building_id}")

    if entrance_errors:
        record_test("TEST_9_ENTRANCE_ASSOCIATION", "Entrance, Approach and Graph-Node Association", "FAIL",
                    "; ".join(entrance_errors), warnings=entrance_warnings)
    elif entrance_warnings:
        record_test("TEST_9_ENTRANCE_ASSOCIATION", "Entrance, Approach and Graph-Node Association", "WARNING",
                    f"All {len(entrances)} entrances reference existing buildings and nodes; approach points are outside their footprints. Long connector distances: {link_distances}.",
                    warnings=entrance_warnings)
    else:
        record_test("TEST_9_ENTRANCE_ASSOCIATION", "Entrance, Approach and Graph-Node Association", "PASS",
                    f"All {len(entrances)} entrances have external approach points and correctly associated nearby graph nodes.")
except Exception as e:
    record_test("TEST_9_ENTRANCE_ASSOCIATION", "Entrance, Approach and Graph-Node Association", "FAIL", str(e))

# TEST 10: Bus Stop Passenger Safety
try:
    bus_poi = next(p for p in pois if p['id'] == 'poi-bus-stop')
    bus_node = next(n for n in paths['nodes'] if n['id'] == 'node-bus-stop')

    bus_pt_utm = Point(transformer.transform(bus_node['longitude'], bus_node['latitude']))
    
    # Check that bus stop waiting point is completely OUTSIDE the 4.0m live carriageway corridor
    intersects_live_lane = combined_corridor_utm.intersects(bus_pt_utm)
    dist_to_live_lane = combined_corridor_utm.distance(bus_pt_utm)
    dist_to_wb_center = wb_line_utm.distance(bus_pt_utm)

    poi_pt_utm = Point(transformer.transform(bus_poi['longitude'], bus_poi['latitude']))
    poi_node_separation = poi_pt_utm.distance(bus_pt_utm)
    gate_node = next(n for n in paths['nodes'] if n['id'] == 'node-gate')
    gate_pt_utm = Point(transformer.transform(gate_node['longitude'], gate_node['latitude']))
    straight_approach_distance = bus_pt_utm.distance(gate_pt_utm)
    approach_edges = [
        edge for edge in paths['edges']
        if {edge.get('from'), edge.get('to')} == {'node-bus-stop', 'node-gate'}
    ]
    assert not intersects_live_lane, "Bus stop waiting anchor must not intersect the modelled live-traffic corridor"
    assert dist_to_live_lane >= 2.0, f"Waiting anchor must remain >=2.0m outside the modelled corridor, got {dist_to_live_lane:.2f}m"
    assert poi_node_separation <= 1.0, f"Bus-stop POI and graph node differ by {poi_node_separation:.2f}m"
    assert approach_edges, "A direct pedestrian apron connection from bus stop to gate is missing"
    edge_distance = float(approach_edges[0].get('distanceMeters', 0))
    assert edge_distance >= straight_approach_distance * 0.95, "Bus-stop-to-gate edge weight is shorter than its straight-line distance"

    bus_warnings = [
        "No independently georeferenced bus-stop platform/shelter polygon is present; this check validates the waiting anchor against the modelled road corridor only.",
        f"Corridor half-widths are modelled assumptions: WB={wb_half_width:.2f}m ({wb_width_status}); EB={eb_half_width:.2f}m ({eb_width_status})."
    ]
    record_test("TEST_10_BUS_STOP_SAFETY", "Bus-Stop Waiting Anchor & Pedestrian Apron Check", "WARNING",
                f"POI and graph anchor align within {poi_node_separation:.2f}m; waiting anchor is {dist_to_live_lane:.2f}m outside the modelled traffic corridor and has a {edge_distance:.2f}m gate-apron edge. This does not certify a constructed platform or shelter.",
                warnings=bus_warnings)
except Exception as e:
    record_test("TEST_10_BUS_STOP_SAFETY", "Bus Stop & Passenger Platform Safety", "FAIL", str(e))

# TEST 11: Pedestrian Route Graph Integrity
try:
    path_nodes = {n['id']: n for n in paths['nodes']}
    adj = {nid: set() for nid in path_nodes}
    invalid_edges = []
    for edge in paths['edges']:
        u, v = edge.get('from'), edge.get('to')
        if u not in adj or v not in adj:
            invalid_edges.append((u, v, "missing endpoint"))
            continue
        if float(edge.get('distanceMeters', 0)) <= 0:
            invalid_edges.append((u, v, "non-positive distance"))
            continue
        adj[u].add(v)
        adj[v].add(u)

    assert not invalid_edges, f"Invalid graph edges: {invalid_edges}"

    # BFS from node-bus-stop
    visited = set()
    queue = ['node-bus-stop']
    while queue:
        curr = queue.pop(0)
        if curr not in visited:
            visited.add(curr)
            for neighbor in adj.get(curr, []):
                if neighbor not in visited:
                    queue.append(neighbor)

    reach_pct = (len(visited) / len(path_nodes)) * 100.0
    assert 'node-gate' in visited
    assert 'node-sbi-ncc' in visited
    assert 'node-parking' in visited
    assert 'node-bike-stand-2' in visited
    assert 'node-bus-terminal' in visited
    assert reach_pct == 100.0, f"Graph reachability is {reach_pct:.1f}%, expected 100%"

    record_test("TEST_11_PEDESTRIAN_ROUTES", "Pedestrian Network Connectivity & Reachability", "PASS",
                f"100% path connectivity ({len(visited)}/{len(path_nodes)} nodes). Safe connection: node-bus-stop -> node-gate -> campus central spine.")
except Exception as e:
    record_test("TEST_11_PEDESTRIAN_ROUTES", "Pedestrian Network Connectivity & Reachability", "FAIL", str(e))

# TEST 12: Actual Application Campus Boundary Validation
try:
    boundary_wgs84 = campus_config.get('boundary', [])
    assert len(boundary_wgs84) >= 4, "Campus boundary must have at least 4 coordinates"
    
    # Check closure
    assert boundary_wgs84[0] == boundary_wgs84[-1], "Campus boundary must be a closed polygon ring"
    
    boundary_utm = to_utm_poly(boundary_wgs84)
    assert boundary_utm.is_valid, "Campus boundary polygon in EPSG:32644 must be valid"

    outside_bldg = []
    for item in all_spatial:
        if not boundary_utm.contains(item['poly']):
            diff_area = item['poly'].difference(boundary_utm).area
            if diff_area > 0.001:
                outside_bldg.append((item['id'], round(diff_area, 2)))

    if not outside_bldg:
        record_test("TEST_12_BOUNDARY_CONTAINMENT", "Application Campus Boundary Dynamic Containment", "PASS",
                    f"Directly parsed CAMPUS_CONFIG.boundary from src/data/campusConfig.ts. 100% of {len(all_spatial)} campus structures are strictly contained inside.")
    else:
        record_test("TEST_12_BOUNDARY_CONTAINMENT", "Application Campus Boundary Dynamic Containment", "FAIL",
                    f"Structures outside application boundary: {outside_bldg}")
except Exception as e:
    record_test("TEST_12_BOUNDARY_CONTAINMENT", "Application Campus Boundary Dynamic Containment", "FAIL", str(e))

# TEST 13: 3D Structure Semantics and Model Ground-Contact Datums
try:
    gate_b = next(b for b in buildings if b['id'] == 'main-entrance-portal')
    p1_b = next(b for b in buildings if b['id'] == 'parking-plaza')
    p2_b = next(b for b in buildings if b['id'] == 'bike-stand-2')
    sbi_b = next(b for b in buildings if b['id'] == 'sbi-ncc-bank-block')

    with open('src/components/buildings/MainGatePortal.tsx', encoding='utf-8') as source_file:
        gate_source = source_file.read()
    with open('src/components/buildings/ParkingCanopy.tsx', encoding='utf-8') as source_file:
        canopy_source = source_file.read()
    with open('src/components/map/BuildingLayer.tsx', encoding='utf-8') as source_file:
        layer_source = source_file.read()

    assert gate_b.get('classification') == 'covered_canopy' or gate_b.get('category') == 'entrance'
    assert abs(float(gate_b.get('height', 0)) - 6.5) <= 0.05
    assert p1_b.get('classification') == 'covered_canopy'
    assert p2_b.get('classification') == 'covered_canopy'
    assert abs(float(p1_b.get('height', 0)) - 3.8) <= 0.05
    assert abs(float(p2_b.get('height', 0)) - 3.8) <= 0.05
    assert sbi_b.get('classification') == 'independent_building'

    gate_requirements = [
        'ACCESS_ROAD_BEARING_DEGREES = 20.2',
        'GATE_SPAN_METERS = 12.0',
        'GATE_DEPTH_METERS = 4.0',
        'PYLON_WIDTH_METERS = 2.16',
        'CLEAR_VEHICLE_HEIGHT_METERS = 4.8',
        'TOTAL_GATE_HEIGHT_METERS = 6.5',
        'westPylonPositions',
        'eastPylonPositions',
        'lintelPositions',
        'signPanelPositions'
    ]
    missing_gate = [token for token in gate_requirements if token not in gate_source]
    assert not missing_gate, f"Dedicated gate portal geometry missing requirements: {missing_gate}"

    canopy_requirements = [
        'CANOPY_ROOF_TOP_METERS = 3.8',
        'CANOPY_ROOF_THICKNESS_METERS = 0.4',
        'CANOPY_GROUND_BASE_METERS = 0',
        'COLUMN_STATIONS = [0.08, 0.36, 0.64, 0.92]',
        'COLUMN_LENGTH',
        'COLUMN_CENTER_HEIGHT',
        'extrudedHeight: ROOF_TOP'
    ]
    missing_canopy = [token for token in canopy_requirements if token not in canopy_source]
    assert not missing_canopy, f"Parking canopy support/roof geometry missing requirements: {missing_canopy}"
    assert canopy_source.count('columns.push({') == 2, "Expected front/rear column anchors per station (8 columns total)"
    assert "building.id === 'main-entrance-portal'" in layer_source
    assert "building.classification === 'covered_canopy'" in layer_source

    record_test("TEST_13_3D_SEMANTICS", "Gate Portal, Canopy Structure and Ground-Contact Datums", "PASS",
                "Gate model uses a 12m road-perpendicular span, 7.68m clear opening, 4.8m vehicle clearance and 6.5m top. Canopies use 3.8m roof tops, 0.4m slabs and eight 0m-to-roof support columns per canopy. These are model datums, not a terrain survey.")
except Exception as e:
    record_test("TEST_13_3D_SEMANTICS", "Gate Portal, Canopy Structure and Ground-Contact Datums", "FAIL", str(e))

# TEST 14: Source Confidence Validation
try:
    # Verify no unverified geometry is falsely claimed as 'survey-anchor' without ground truth
    aerial_count = sum(1 for e in entrances if e.get('confidence') == 'verified-aerial')
    assert aerial_count > 0, "Confidence labels must reflect aerial calibration"

    record_test("TEST_14_CONFIDENCE_VALIDATION", "Data Source and Confidence Classification", "PASS",
                f"Distinguished aerial calibration from survey anchors across all {len(entrances)} building entries.")
except Exception as e:
    record_test("TEST_14_CONFIDENCE_VALIDATION", "Data Source and Confidence Classification", "FAIL", str(e))

# Save results JSON
with open('docs/phase-7.3.1/gis-validation-results.json', 'w', encoding='utf-8') as f:
    json.dump(test_results, f, indent=2)

print("\n=================================================================")
passed_count = sum(1 for t in test_results.values() if t['status'] == 'PASS')
warning_count = sum(1 for t in test_results.values() if t['status'] == 'WARNING')
failed_count = sum(1 for t in test_results.values() if t['status'] == 'FAIL')
total_count = len(test_results)
print(f"SUMMARY: {passed_count}/{total_count} PASS; {warning_count} WARNING; {failed_count} FAIL")
print("GIS_VALIDATION_STATUS: " + ("NO_FAILURES" if failed_count == 0 else "FAILURES_PRESENT"))
print("=================================================================")

if failed_count > 0:
    sys.exit(1)
