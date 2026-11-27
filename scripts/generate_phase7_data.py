import json

with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)

print(f"Loaded {len(matched)} matched buildings.")
