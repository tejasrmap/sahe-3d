import json
from shapely.geometry import Polygon, Point

# Updated boundary to perfectly encapsulate the compound wall around Power Substation and SBI / Security Gate
boundary_coords = [
    [80.690850, 16.481650], # South-West entrance corner past SBI Bank
    [80.690000, 16.482600], # South-West Wall corner (Cricket Ground West)
    [80.690150, 16.484400], # West boundary along sports ground
    [80.690550, 16.485650], # West boundary along CSE block
    [80.691200, 16.486250], # North-West corner
    [80.692500, 16.486650], # North boundary road (Power substation north)
    [80.693950, 16.486650], # North boundary road (TIFAC / Civil north)
    [80.696050, 16.485850], # North-East corner (Boys Hostel East)
    [80.696150, 16.484200], # East boundary (Girls Hostel East)
    [80.694850, 16.481750], # South-East compound corner
    [80.692300, 16.481650], # South boundary approach road
    [80.691260, 16.481650], # South Gate approach east
    [80.690850, 16.481650]  # Closing back
]
campus_poly = Polygon(boundary_coords)

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

all_ok = True
for m in matched:
    poly = Polygon(m['coords'])
    inside = campus_poly.contains(poly)
    if not inside:
        all_ok = False
        print(f"Way {m['way_id']} NOT fully inside: {m['official_role']}")
        for pt in m['coords']:
            if not campus_poly.contains(Point(pt)):
                print(f"  exterior point: {pt}")
    else:
        print(f"Way {m['way_id']} OK: {m['official_role']}")

print(f"All inside? {all_ok}")
