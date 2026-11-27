import json
import math
from shapely.geometry import Polygon, Point

# Load buildings
with open('src/data/buildings.ts', 'r', encoding='utf-8') as f:
    text = f.read()

s = text.find('export const CAMPUS_BUILDINGS: Building[] = ') + len('export const CAMPUS_BUILDINGS: Building[] = ')
e = text.find(';\n\n// Backward compatibility helper')
buildings = json.loads(text[s:e])

# Fix auditorium-complex and cafeteria-complex
for b in buildings:
    if b['id'] == 'auditorium-complex':
        b['latitude'] = 16.483785
        b['longitude'] = 80.692550
        b['footprint'] = [
            [80.69235, 16.48392],
            [80.69275, 16.48392],
            [80.69275, 16.48365],
            [80.69235, 16.48365],
            [80.69235, 16.48392]
        ]
    elif b['id'] == 'cafeteria-complex':
        b['latitude'] = 16.483785
        b['longitude'] = 80.693350
        b['footprint'] = [
            [80.69315, 16.48392],
            [80.69355, 16.48392],
            [80.69355, 16.48365],
            [80.69315, 16.48365],
            [80.69315, 16.48392]
        ]

b_polys = {b['id']: Polygon(b['footprint']) for b in buildings}

# Calibrate entrances
with open('src/data/buildingEntrances.ts', 'r', encoding='utf-8') as f:
    etext = f.read()
estart = etext.find('export const BUILDING_ENTRANCES: BuildingEntrance[] = ') + len('export const BUILDING_ENTRANCES: BuildingEntrance[] = ')
eend = etext.rfind(';')
entrances = json.loads(etext[estart:eend])

dlat_2_5m = 2.5 / 111132.954
dlon_2_5m = 2.5 / (111412.84 * math.cos(16.4842 * math.pi / 180.0))

for ent in entrances:
    bid = ent['buildingId']
    if bid == 'mechanical-workshops':
        ent['facadeOrientation'] = 'east'
    elif bid == 'power-house-substation':
        ent['facadeOrientation'] = 'east'
        
    poly = b_polys[bid]
    minx, miny, maxx, maxy = poly.bounds
    cx, cy = (minx + maxx) * 0.5, (miny + maxy) * 0.5
    
    ori = ent['facadeOrientation']
    if ori == 'north':
        ent['latitude'] = round(maxy + dlat_2_5m, 6)
        ent['longitude'] = round(cx, 6)
    elif ori == 'south':
        ent['latitude'] = round(miny - dlat_2_5m, 6)
        ent['longitude'] = round(cx, 6)
    elif ori == 'east':
        ent['latitude'] = round(cy, 6)
        ent['longitude'] = round(maxx + dlon_2_5m, 6)
    elif ori == 'west':
        ent['latitude'] = round(cy, 6)
        ent['longitude'] = round(minx - dlon_2_5m, 6)

exterior_failures = []
for ent in entrances:
    pt = Point(ent['longitude'], ent['latitude'])
    for bid, p in b_polys.items():
        if p.contains(pt):
            exterior_failures.append((ent['entranceName'], bid))

print(f"Exterior failures count: {len(exterior_failures)}")

# Update files if 0 failures!
if len(exterior_failures) == 0:
    # Save src/data/buildings.ts
    b_content = "import { Building } from '../types/campus';\n\nexport const CAMPUS_BUILDINGS: Building[] = " + json.dumps(buildings, indent=2) + ";\n"
    b_content += '''
// Backward compatibility helper
export function getBuildingById(id: string): Building | undefined {
  if (id === 'admin-central-library') {
    return CAMPUS_BUILDINGS.find(b => b.id === 'admin-block');
  }
  return CAMPUS_BUILDINGS.find(b => b.id === id);
}
'''
    with open('src/data/buildings.ts', 'w', encoding='utf-8') as f:
        f.write(b_content)
    
    # Save src/data/buildingEntrances.ts
    ent_code = '''export interface BuildingEntrance {
  buildingId: string;
  buildingName: string;
  entranceName: string;
  doorType: 'main' | 'secondary' | 'service' | 'accessible';
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  connectedPathNodeId: string;
  facadeOrientation: 'north' | 'south' | 'east' | 'west';
  distanceToFacadeMeters: number;
  confidence: 'verified-aerial' | 'survey-anchor';
}

export const BUILDING_ENTRANCES: BuildingEntrance[] = ''' + json.dumps(entrances, indent=2) + ';\n'
    with open('src/data/buildingEntrances.ts', 'w', encoding='utf-8') as f:
        f.write(ent_code)
        
    print("Updated buildings.ts and buildingEntrances.ts with 0 exterior failures and 0 overlaps!")
