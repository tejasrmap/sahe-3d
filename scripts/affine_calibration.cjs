// Reference places with known real physical locations
const knownPoints = [
  // 1. SAHE Main Gate (NH65 Entrance)
  { name: 'SAHE Main Gate', ref: [492, 858], lat: 16.481751, lng: 80.691194 },
  // 2. SAHE Cricket Ground (Center of running track / ground)
  { name: 'SAHE Cricket Ground', ref: [438, 616], lat: 16.483370, lng: 80.691073 },
  // 3. CSE Complex
  { name: 'CSE, AI, ECE, EIE Departments', ref: [485, 285], lat: 16.485196, lng: 80.691326 },
  // 4. VRSEC Library
  { name: 'VRSEC Library', ref: [873, 458], lat: 16.484796, lng: 80.692981 },
  // 5. Canteen
  { name: 'VR Siddhartha Canteen', ref: [630, 148], lat: 16.485292, lng: 80.692380 }, // north canteen area
  // 6. Boys Hostel
  { name: 'SAHE Boys Hostel', ref: [1298, 245], lat: 16.485343, lng: 80.695713 }
];

console.log('Known points count:', knownPoints.length);

// Simple least-squares affine fit:
// lat = a0 + a1 * x + a2 * y
// lng = b0 + b1 * x + b2 * y

function fit(points, getTarget) {
  // Solve normal equations
  let s_1 = 0, s_x = 0, s_y = 0;
  let s_xx = 0, s_xy = 0, s_yy = 0;
  let s_t = 0, s_tx = 0, s_ty = 0;

  for (const p of points) {
    const x = p.ref[0], y = p.ref[1], t = getTarget(p);
    s_1 += 1;
    s_x += x;
    s_y += y;
    s_xx += x * x;
    s_xy += x * y;
    s_yy += y * y;
    s_t += t;
    s_tx += t * x;
    s_ty += t * y;
  }

  // Matrix [[s_1, s_x, s_y], [s_x, s_xx, s_xy], [s_y, s_xy, s_yy]] * [c0, c1, c2]^T = [s_t, s_tx, s_ty]^T
  // Invert 3x3
  const A = [
    [s_1, s_x, s_y],
    [s_x, s_xx, s_xy],
    [s_y, s_xy, s_yy]
  ];
  const b = [s_t, s_tx, s_ty];

  function det3(m) {
    return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
         - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
         + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
  }
  const D = det3(A);
  function solve(col) {
    const Ac = A.map((row, r) => row.map((val, c) => c === col ? b[r] : val));
    return det3(Ac) / D;
  }
  return [solve(0), solve(1), solve(2)];
}

const cLat = fit(knownPoints, p => p.lat);
const cLng = fit(knownPoints, p => p.lng);

console.log('Lat model:', `lat = ${cLat[0].toFixed(8)} + (${cLat[1].toExponential(4)})*x + (${cLat[2].toExponential(4)})*y`);
console.log('Lng model:', `lng = ${cLng[0].toFixed(8)} + (${cLng[1].toExponential(4)})*x + (${cLng[2].toExponential(4)})*y`);

console.log('\nResiduals for known points:');
for (const p of knownPoints) {
  const pLat = cLat[0] + cLat[1]*p.ref[0] + cLat[2]*p.ref[1];
  const pLng = cLng[0] + cLng[1]*p.ref[0] + cLng[2]*p.ref[1];
  const dLatMeters = (pLat - p.lat) * 111320;
  const dLngMeters = (pLng - p.lng) * 111320 * Math.cos(p.lat * Math.PI / 180);
  const dist = Math.hypot(dLatMeters, dLngMeters);
  console.log(`- ${p.name.padEnd(32)}: error = ${dist.toFixed(1)} m`);
}
