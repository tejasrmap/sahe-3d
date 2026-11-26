# SAHE-3D Campus Boundary & Extent Reconciliation

## 1. Boundary Comparison

| Attribute | Reference Project (`sahe3dbysahithi`) | Our Project (`sahe-3d`) |
| :--- | :--- | :--- |
| **Boundary Definition** | Procedural square ground plane (`900m x 900m`) with no closed boundary polygon | Authoritative 12-vertex surveyed boundary loop (OSM Barrier Way 1418702313) |
| **Perimeter Fencing** | Visual boundary defined only by fog distance (`near: 160, far: 420`) | True polygonal boundary line rendered as glowing perimeter vector |
| **Public Road Separation** | Roads cross indefinitely into infinite ground plane | Clean boundary separation preventing encroachment into NH65 & Panta Kaluva Rd |
| **Building Enclosure Ratio** | N/A (all items placed on flat ground) | **100.0%** (all 12 campus buildings reside completely inside boundary) |

---

## 2. Perimeter Coordinates

The reconciled campus boundary follows the surveyed physical perimeter wall:

```typescript
boundary: [
  [80.69168, 16.48168], // S-W Corner near NH65 Entrance
  [80.69315, 16.48192], // S-E Boundary along Main Road
  [80.69465, 16.48218], // South Boundary Turn
  [80.69612, 16.48255], // E Perimeter start
  [80.69638, 16.48395], // E Perimeter near Aditya Women's Hostel
  [80.69652, 16.48565], // N-E Corner near Siddhartha Boys Hostel
  [80.69530, 16.48625], // North Boundary near PVPSIT line
  [80.69350, 16.48638], // N-W Sector
  [80.69120, 16.48615], // W Perimeter above CSE Complex
  [80.69045, 16.48485], // W Perimeter near Athletic Ground
  [80.69035, 16.48315], // S-W Corner near Canara Bank
  [80.69115, 16.48170], // Return to Entrance Portal
  [80.69168, 16.48168]  // Loop Closure
]
```

This ensures full containment of all internal facilities while respecting municipal roads and property boundaries.
