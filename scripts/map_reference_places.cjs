const PL = [
  ['CSE, AI, ECE, EIE Departments, VRSEC', 'academic', 485, 285, 8, 'VR Siddhartha Engineering College'],
  ['S&H Block I', 'academic', 792, 342, 6.5, 'Solar-roofed block on VRSEC EEE Block Rd'],
  ['Civil Block', 'academic', 922, 250, 8, 'Large block on VRSEC Civil Block Rd'],
  ['HCL TSS Vijayawada', 'academic', 447, 222, 6.5, ''],
  ['VRSEC Library', 'academic', 873, 458, 7, 'Library on VRSEC Library Rd'],
  ['YV Rao Siddhartha College of Education', 'academic', 623, 613, 5, 'Open plot beside Entrance Rd'],
  ['SAHE Main Gate', 'landmark', 492, 858, 6.5, 'Maroon entrance arch on the NH65 highway'],
  ['PVP Siddhartha Institute of Technology', 'academic', 920, -200, 9, 'Campus to the north'],
  ['VR Siddhartha Canteen', 'food', 630, 148, 5, ''],
  ['SAHE Boys Hostel', 'hostels', 1298, 245, 10.5, ''],
  ['ELVY Stays Hostel for Men', 'hostels', 1475, 666, 5, 'Private hostel nearby'],
  ['VRSEC Basketball Court', 'sports', 1215, 368, 4, ''],
  ['SAHE Cricket Ground', 'sports', 438, 616, 4, 'Running track and ground'],
  ['Canara Bank', 'services', 383, 708, 5, 'Bank branch near the cricket ground'],
  ['Ramakrishna Statue', 'landmark', 662, 383, 5, 'On the main road by the campus gate'],
  ['Mech Block', 'academic', 792, 157, 7, 'Solar-roofed block on VRSEC Mech Block Rd'],
  ['S&H Block II', 'academic', 915, 345, 6.5, ''],
  ['CSE Seminar Hall', 'academic', 448, 244, 7.5, ''],
  ['V L Dutt Statue', 'landmark', 494, 250, 4, 'Courtyard statue, listed as temporarily closed'],
  ['Saraswathi Statue & KachhaPi', 'landmark', 778, 249, 4, 'Garden circle on Saraswathi Statue Rd'],
  ['Pranayuv Technologies', 'services', 685, 243, 6, ''],
  ['Siddhartha Deemed to be University', 'academic', 680, 326, 6, ''],
  ['SMT Velagapudi Durgamba Siddhartha College', 'academic', 588, 756, 7.5, ''],
  ['Pragathi Boys Hostel', 'hostels', 978, 468, 8, 'Private hostel near Tummala Venkata Subbarao St'],
  ['Tata Power Charging Station', 'services', 790, 900, 4, '']
];

const cLat = [16.48612812, 4.7311e-7, -4.9867e-6];
const cLng = [80.68915776, 5.0682e-6, -6.3113e-7];

console.log('Index | Name | Category | Est Lat, Lng | Notes');
PL.forEach((p, i) => {
  const x = p[2], y = p[3];
  const lat = (cLat[0] + cLat[1]*x + cLat[2]*y).toFixed(6);
  const lng = (cLng[0] + cLng[1]*x + cLng[2]*y).toFixed(6);
  console.log(`${String(i).padStart(2)} | ${p[0].padEnd(42)} | ${p[1].padEnd(10)} | ${lat}, ${lng} | ${p[5] || ''}`);
});
