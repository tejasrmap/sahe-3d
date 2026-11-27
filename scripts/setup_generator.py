import json

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

ways = {m['way_id']: m for m in matched}

# Let's write the generator script
code = '''import json
from shapely.geometry import Polygon

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)
ways = {m['way_id']: m for m in matched}

# Ensure all coordinates are [lon, lat] and closed loops
for wid, w in ways.items():
    coords = w['coords']
    if coords[0] != coords[-1]:
        coords.append(coords[0])
    w['coords'] = coords

print("Coordinates validated and closed.")
'''

with open('scripts/build_data_assets.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Created build_data_assets.py")
