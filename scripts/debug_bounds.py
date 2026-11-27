import json
from shapely.geometry import Polygon, Point, box

# Load buildings
with open('scripts/build_phase7_master.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect admin-block and auditorium-complex bounds
with open('src/data/buildings.ts', 'r', encoding='utf-8') as f:
    t = f.read()

s = t.find('export const CAMPUS_BUILDINGS: Building[] = ') + len('export const CAMPUS_BUILDINGS: Building[] = ')
e = t.find(';\n\n// Backward compatibility helper')
buildings = json.loads(t[s:e])

b_dict = {b['id']: Polygon(b['footprint']) for b in buildings}

# Admin bounds
print("admin-block bounds:", b_dict['admin-block'].bounds)
print("auditorium-complex bounds:", b_dict['auditorium-complex'].bounds)
print("central-library bounds:", b_dict['central-library'].bounds)
print("cafeteria-complex bounds:", b_dict['cafeteria-complex'].bounds)
