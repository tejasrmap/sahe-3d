import json
from shapely.geometry import Point, Polygon

with open('scripts/osm_resolved_buildings.json', 'r', encoding='utf-8') as f:
    bldgs = json.load(f)

campus_poly_coords = [
    [80.691100, 16.481680],
    [80.690000, 16.482600],
    [80.690150, 16.484400],
    [80.690550, 16.485650],
    [80.691200, 16.486250],
    [80.693950, 16.486450],
    [80.696050, 16.485850],
    [80.696150, 16.484200],
    [80.694850, 16.481750],
    [80.692300, 16.481680],
    [80.691260, 16.481680],
    [80.691100, 16.481680]
]
poly = Polygon(campus_poly_coords)

inside_campus = []
for b in bldgs:
    pt = Point(b['centroid'][0], b['centroid'][1])
    if poly.contains(pt) or poly.touches(pt):
        inside_campus.append(b)

print(f"Total OSM buildings inside SAHE campus perimeter: {len(inside_campus)}")
for i, b in enumerate(inside_campus):
    name = b['name'] or 'Unnamed structure'
    print(f"[{i+1}] Way {b['id']} | Name: {name} | Centroid: ({b['centroid'][0]:.6f}, {b['centroid'][1]:.6f}) | vertices: {b['coords_count']}")

with open('scripts/campus_internal_osm_buildings.json', 'w', encoding='utf-8') as f:
    json.dump(inside_campus, f, indent=2)
print("Saved scripts/campus_internal_osm_buildings.json")
