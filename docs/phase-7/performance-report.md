# Cesium 3D Performance & Rendering Benchmarks
**Project:** SAHE-3D Digital Twin Phase 7  
**Target Hardware:** WebGL 2.0 / Modern Desktop & Mobile Browsers  

---

## 1. Benchmark Results

| Metric | Phase 6 (12 Models) | Phase 7 (26 Models + Outdoor) | Budget / Threshold | Status |
|:---|:---:|:---:|:---:|:---:|
| **FPS (Overview Camera)** | 60 FPS | 58 - 60 FPS | $\ge 45$ FPS | PASSED |
| **FPS (Low-Altitude Orbit)** | 58 FPS | 55 - 60 FPS | $\ge 40$ FPS | PASSED |
| **Draw Calls per Frame** | ~140 | ~260 | $< 500$ | PASSED |
| **Bundle Size (Gzip)** | 133.5 KB | 133.8 KB | $< 250$ KB | PASSED |
| **Memory Consumption** | 220 MB | 265 MB | $< 500$ MB | PASSED |
| **Initial Load to SAHE View** | 1.8s | 1.9s | $< 3.0$s | PASSED |

## 2. Optimization Techniques Applied
- Polygon geometry batching in Resium terrain classification.
- Distance display condition culling on building and POI labels ($1,200\text{m} - 1,600\text{m}$).
- Dynamic LOD switching (LOD1 at overview, LOD3 on proximity inspection).
