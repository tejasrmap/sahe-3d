import json
from shapely.geometry import Polygon

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

overlaps = []
for i in range(len(matched)):
    p1 = Polygon(matched[i]['coords'])
    for j in range(i + 1, len(matched)):
        p2 = Polygon(matched[j]['coords'])
        if p1.intersects(p2):
            inter = p1.intersection(p2)
            if inter.area > 1e-9:
                overlaps.append((matched[i]['way_id'], matched[j]['way_id'], inter.area))

print(f"Total overlapping building pairs: {len(overlaps)}")
for o in overlaps:
    print(f"  Overlap between Way {o[0]} and Way {o[1]}: area {o[2]}")
