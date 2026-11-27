import json
import math

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

print(f"Total matched ways: {len(matched)}")
for m in matched:
    print(m['way_id'], m['official_role'])
