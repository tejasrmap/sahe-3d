import json
from shapely.geometry import Polygon

with open('scripts/campus_internal_osm_buildings.json', 'r', encoding='utf-8') as f:
    bldgs = json.load(f)

print(f"Loaded {len(bldgs)} campus internal buildings")

# Key ways of interest identified:
key_ways = {
    403282758: "Building 9 / 13: Dr. APJ Abdul Kalam Block (CSE, IT, EIE, ECE, MCA, MBA)",
    1324048133: "Building 8: Electrical Sciences Block (EEE Department)",
    1324048132: "Building 3 / 15: Science & Humanities Block 1 (S&H 1)",
    1324048131: "Building 4 / 16: Science & Humanities Block 2 (S&H 2)",
    1324048130: "Building 5 / 7: Civil Engineering Department",
    1324048128: "Building 7 / 12: Mechanical Engineering Block (Main)",
    1324048129: "Building 7 / 12 annex: Mechanical Engineering Workshops",
    1324048127: "Building 6 / 20: Siemens Centre of Excellence & TIFAC CORE",
    403282757: "Building 1: Administrative Block (Dr. VR Central Admin)",
    403282859: "Building 2 / 11: Central Library & Building 6: Canteen / TPO",
    403282763: "Building 18 / 15: Physical Education & Indoor Sports Arena",
    1320668604: "Building 10: Students Centre, Industrial Relations & Guest House",
    1320668605: "Building 14: Generator Room & Power House Substation",
    1318968808: "Building 5A / 17: Siddhartha Boys Residency Hall (Main Block)",
    1318966334: "Building 17 annex: Old Boys Hostel Block 1",
    1318968809: "Building 17 annex: Old Boys Hostel Block 2",
    1320182457: "Building 9 / 16: Aditya Girls Hostels (Ganga & Yamuna Wings)",
    1318966332: "Building 9B / 16: Girls Hostel Krishna Wing",
    1318966333: "Building 19: Faculty & Staff Residential Quarters",
    1320824131: "Building 17: Main Ceremonial Security Entrance Portal",
    1320824137: "Building 2 / 14: State Bank of India & NCC Office Block",
    1320824558: "Building 3 / 19: Two-Wheeler Stand 1 (West Parking Shed)",
    1320824559: "Building 4 / 20: Two-Wheeler Stand 2 (East Parking Shed)"
}

matched = []
for b in bldgs:
    wid = b['id']
    if wid in key_ways:
        poly = Polygon(b['coords'])
        matched.append({
            'way_id': wid,
            'official_role': key_ways[wid],
            'centroid': b['centroid'],
            'vertices_count': b['coords_count'],
            'coords': b['coords'],
            'approx_area_sqm': round(poly.area * 111320 * 111320 * 0.96, 1) # approx metric conversion
        })

print(f"\n--- MATCHED {len(matched)} OFFICIAL CAMPUS STRUCTURES ---")
for m in matched:
    print(f"Way {m['way_id']} | {m['official_role']} | Centroid: ({m['centroid'][0]:.6f}, {m['centroid'][1]:.6f}) | Vertices: {m['vertices_count']}")

with open('scripts/official_matched_buildings.json', 'w', encoding='utf-8') as f:
    json.dump(matched, f, indent=2)
print("Saved scripts/official_matched_buildings.json")
