import json

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

# Build a lookup by way_id
ways = {m['way_id']: m for m in matched}

print(f"Loaded {len(ways)} matched OSM ways.")
