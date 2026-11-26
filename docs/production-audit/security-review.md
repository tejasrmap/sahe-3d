# SAHE-3D Security & Data Safety Review

## 1. Secrets & Credentials
- **Cesium Ion Token:** Configured via `import.meta.env.VITE_CESIUM_ION_TOKEN` in `.env.example`. No hardcoded private API keys or tokens are stored in the git repository.
- **Basemap Imagery:** Uses public Esri World Imagery ArcGIS REST endpoints and OpenStreetMap tile servers with standard attribution.

## 2. DOM Injection & XSS Prevention
- All user-facing search results, room metadata, building descriptions, and labels are rendered via React JSX text nodes, eliminating `innerHTML` vulnerabilities.
- User favorites are stored in `localStorage` under `sahe_campus_favorites` with JSON validation and `try/catch` fallbacks.

## 3. Sandboxing & External Requests
- No external unverified CDNs are loaded at runtime.
- All dependencies are audited via `npm audit`.
