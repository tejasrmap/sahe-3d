import urllib.request
import json
import os

try:
    with urllib.request.urlopen('http://127.0.0.1:9222/json/version', timeout=3) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        ws_url = data.get('webSocketDebuggerUrl', '')
        print('ws_url:', ws_url)
        # e.g. ws://127.0.0.1:9222/devtools/browser/uuid
        parts = ws_url.split('/')
        ws_path = '/' + '/'.join(parts[3:])
        port = parts[2].split(':')[1]
        
        file_path = os.path.expandvars(r'%LOCALAPPDATA%\Google\Chrome\User Data\DevToolsActivePort')
        with open(file_path, 'w', encoding='ascii') as f:
            f.write(f"{port}\n{ws_path}")
        print(f"Successfully wrote DevToolsActivePort:\n{port}\n{ws_path}")
except Exception as e:
    print("Could not connect to port 9222:", e)
