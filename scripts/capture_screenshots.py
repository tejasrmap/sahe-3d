import subprocess
import os
import time

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_dir = os.path.abspath(r"docs\phase-7\screenshots")
os.makedirs(out_dir, exist_ok=True)

targets = [
    ("campus_overview.png", "http://localhost:4173"),
]

for fname, url in targets:
    out_path = os.path.join(out_dir, fname)
    cmd = [
        chrome_path,
        "--headless=new",
        "--hide-scrollbars",
        "--disable-gpu",
        "--window-size=1920,1080",
        f"--screenshot={out_path}",
        "--virtual-time-budget=6000",
        url
    ]
    print(f"Capturing {fname}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_path):
        print(f"Captured {fname} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"Failed to capture {fname}: {res.stderr}")
