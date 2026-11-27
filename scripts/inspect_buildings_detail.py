with open('src/data/buildings.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'\{\s*"id":\s*"([^"]+)"', text)
for m in matches:
    bid = m.group(1)
    start = m.start()
    end = start + 600
    print(f"Building: {bid}")
    lines = text[start:end].split('\n')
    for l in lines[:15]:
        print("  " + l)
    print("-" * 50)
