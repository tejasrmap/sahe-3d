import json

with open('scripts/osm_sahe_raw.json', 'r', encoding='utf-8') as f:
    osm = json.load(f)

nodes = {}
for el in osm.get('elements', []):
    if el.get('type') == 'node':
        nodes[el['id']] = (el.get('lon'), el.get('lat'))

for el in osm.get('elements', []):
    if el.get('id') == 1418702314:
        coords = [nodes[nid] for nid in el.get('nodes', []) if nid in nodes]
        print(f"Way 1418702314 coords count: {len(coords)}")
        print(f"Coords: {coords}")
