import json

with open('scripts/osm_sahe_raw.json', 'r', encoding='utf-8') as f:
    osm = json.load(f)

print(f"Total elements in osm_sahe_raw: {len(osm.get('elements', []))}")
sports = []
for el in osm.get('elements', []):
    tags = el.get('tags', {})
    if any(k in tags for k in ['leisure', 'sport', 'pitch', 'amenity', 'landuse']):
        sports.append((el.get('id'), tags, el.get('type')))

print(f"Found {len(sports)} leisure/sport/amenity items:")
for sid, tg, typ in sports[:25]:
    print(f"  {typ} {sid}: {tg}")
