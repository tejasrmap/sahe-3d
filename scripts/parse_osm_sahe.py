import json

with open('scripts/osm_sahe_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Total OSM elements:', len(data['elements']))

node_map = {}
for el in data['elements']:
    if el['type'] == 'node':
        node_map[el['id']] = (el['lon'], el['lat'])

buildings = []
for el in data['elements']:
    tags = el.get('tags', {})
    if 'building' in tags:
        # resolve coordinates
        coords = [node_map[nid] for nid in el.get('nodes', []) if nid in node_map]
        if coords:
            lons = [c[0] for c in coords]
            lats = [c[1] for c in coords]
            centroid = (sum(lons)/len(lons), sum(lats)/len(lats))
            buildings.append({
                'id': el['id'],
                'name': tags.get('name'),
                'tags': tags,
                'centroid': centroid,
                'coords_count': len(coords),
                'coords': coords
            })

print(f"Total buildings in raw OSM: {len(buildings)}")
for i, b in enumerate(buildings):
    name = b['name'] or 'Unnamed building'
    print(f"[{i+1}] Way {b['id']} | Name: {name} | Centroid: lon={b['centroid'][0]:.6f}, lat={b['centroid'][1]:.6f} | Tags: {b['tags']}")

with open('scripts/osm_resolved_buildings.json', 'w', encoding='utf-8') as f:
    json.dump(buildings, f, indent=2)
print("Saved scripts/osm_resolved_buildings.json")
