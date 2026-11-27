import json
import re

with open('src/data/buildings.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# match id and name
entries = re.findall(r'id:\s*["\']([^"\']+)["\'],\s*name:\s*["\']([^"\']+)["\']', text)
if not entries:
    # json format with quotes
    entries = re.findall(r'"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', text)

print(f"Total buildings in src/data/buildings.ts: {len(entries)}")
for i, n in entries:
    print(f"  {i} -> {n}")

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

print(f"\nTotal matched official structures: {len(matched)}")
for m in matched:
    print(f"  Way {m['way_id']} -> {m['official_role']} (centroid: {m['centroid']})")
