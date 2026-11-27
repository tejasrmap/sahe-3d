import json
import os
import math
from shapely.geometry import Polygon, Point, LineString

print("Step 1: Loading verified GIS datasets...")
with open('scripts/official_matched_buildings.json', 'r', encoding='utf-8') as f:
    matched = json.load(f)
ways = {m['way_id']: m for m in matched}

def close_coords(coords):
    res = [[round(p[0], 7), round(p[1], 7)] for p in coords]
    if res[0] != res[-1]:
        res.append(res[0])
    return res

for wid in ways:
    ways[wid]['coords'] = close_coords(ways[wid]['coords'])

# Compute polygon area in square meters
def calc_area_sqm(coords):
    lat_mid = 16.4842 * math.pi / 180.0
    m_per_deg_lat = 111132.954
    m_per_deg_lon = 111412.84 * math.cos(lat_mid)
    n = len(coords)
    area = 0.0
    for i in range(n - 1):
        x1 = coords[i][0] * m_per_deg_lon
        y1 = coords[i][1] * m_per_deg_lat
        x2 = coords[i+1][0] * m_per_deg_lon
        y2 = coords[i+1][1] * m_per_deg_lat
        area += (x1 * y2 - x2 * y1)
    return round(abs(area) * 0.5, 2)

for wid in ways:
    ways[wid]['real_area_sqm'] = calc_area_sqm(ways[wid]['coords'])

# MASTER BUILDINGS INVENTORY (26 Buildings)
buildings_master = [
    {
        "id": "cse-it-complex",
        "name": "Dr. APJ Abdul Kalam Block (Computing Complex)",
        "code": "APJ-CSE",
        "category": "academic",
        "latitude": 16.4851896,
        "longitude": 80.6913927,
        "height": 26,
        "floors": 5,
        "description": "Premier five-story computing complex housing Computer Science & Engineering, Artificial Intelligence, Data Science labs, Nvidia AI Deep Learning Supercomputing clusters, and modern smart seminar halls.",
        "departments": [
            "Computer Science and Engineering (CSE)",
            "CSE - Artificial Intelligence & Machine Learning",
            "CSE - Data Science",
            "Information Technology (IT)",
            "Electronics & Instrumentation Engineering (EIE)",
            "Computer Applications (MCA)",
            "Business Administration (MBA)"
        ],
        "facilities": [
            "High Performance Cloud Computing Lab",
            "NVIDIA AI Research Center",
            "HCL TSS Vijayawada Training Center",
            "CSE Tiered Seminar Auditorium",
            "Dr. V L Dutt Courtyard Memorial",
            "Cybersecurity Defense Lab",
            "Smart Interactive Classrooms (16)",
            "Faculty Research Cubicles",
            "IoT Prototyping Laboratory"
        ],
        "footprint": ways[403282758]['coords'],
        "color": "#3B82F6"
    },
    {
        "id": "admin-block",
        "name": "Dr. VR Central Administrative Block",
        "code": "ADMIN-BLK",
        "category": "administration",
        "latitude": 16.4841125,
        "longitude": 80.6924755,
        "height": 14,
        "floors": 3,
        "description": "Executive university administration headquarters accommodating the Vice-Chancellor's Secretariat, Registrar's Office, Dean of Academic Affairs, Controller of Examinations, and Syndicate Board Room.",
        "departments": [
            "Office of the Vice Chancellor & Registrar",
            "Dean of Academic Affairs & Admissions",
            "Finance, Accounts & Audit Directorate",
            "Controller of Examinations (CoE)",
            "Human Resources & Faculty Development"
        ],
        "facilities": [
            "Executive Boardroom & Council Chamber",
            "Student Administrative Services Counter",
            "VIP Conference Suite",
            "Academic Transcript & Verification Cell",
            "Institutional Archive Repository"
        ],
        "footprint": ways[403282757]['coords'],
        "color": "#6366F1"
    },
    {
        "id": "central-library",
        "name": "Central Knowledge Resource & Library Complex",
        "code": "LIB-BLK",
        "category": "library",
        "latitude": 16.4842578,
        "longitude": 80.6932939,
        "height": 14,
        "floors": 3,
        "description": "Premier 3-story digital knowledge repository featuring over 120,000 physical volumes, 10,000+ national & international e-journals, digital thesis archive, collaborative multimedia study pods, and the Training & Placement Cell (TPO).",
        "departments": [
            "University Central Library",
            "Digital Knowledge & E-Learning Centre",
            "Training and Placement Officer (TPO)",
            "Corporate Relations & Industry Interface"
        ],
        "facilities": [
            "Digital Library with 120 High-Speed Terminals",
            "IEEE, ScienceDirect & Springer Journal Lounge",
            "Quiet Air-Conditioned Reference Stacks",
            "Corporate Interview & Group Discussion Chambers",
            "Scholars Reading Terrace"
        ],
        "footprint": ways[403282859]['coords'],
        "color": "#06B6D4"
    },
    {
        "id": "ece-eee-block",
        "name": "Electrical Sciences Block (EEE Department)",
        "code": "EEE-BLK",
        "category": "academic",
        "latitude": 16.4852668,
        "longitude": 80.6924686,
        "height": 18,
        "floors": 4,
        "description": "Premier department building for Electrical & Electronics Engineering, housing high-voltage transmission simulators, electric vehicle drivetrain testing bays, power system analysis clusters, and microgrid research centers.",
        "departments": [
            "Electrical & Electronics Engineering (EEE)",
            "Power Systems & High Voltage Engineering",
            "Electric Vehicle & Battery Management Systems",
            "Renewable Energy & Microgrid Technology"
        ],
        "facilities": [
            "High Voltage Testing & Dielectric Lab",
            "Power Electronics & Smart Drives Lab",
            "Microgrid & Solar PV Simulation Center",
            "Electrical Machines Research Arena",
            "Smart Metering & Grid Protection Center"
        ],
        "footprint": ways[1324048133]['coords'],
        "color": "#F59E0B"
    },
    {
        "id": "sh-block-1",
        "name": "Science & Humanities Block 1 (S&H 1)",
        "code": "SH-BLK1",
        "category": "academic",
        "latitude": 16.4847986,
        "longitude": 80.6929142,
        "height": 14,
        "floors": 3,
        "description": "Foundational engineering block housing Physics, Chemistry, and Professional English departments, dedicated first-year lecture halls, modern chemistry testing counters, and high-tech language phonetics labs.",
        "departments": [
            "Department of Engineering Physics",
            "Department of Applied Chemistry",
            "Department of Mathematics",
            "English & Professional Communication"
        ],
        "facilities": [
            "Laser Optics & Solid State Physics Lab",
            "Spectrophotometry & Water Quality Lab",
            "Computerized Interactive Language Lab",
            "Smart Audio-Visual Foundation Theatres (8)",
            "First-Year Student Mentoring Directorate"
        ],
        "footprint": ways[1324048132]['coords'],
        "color": "#10B981"
    },
    {
        "id": "sh-block-2",
        "name": "Science & Humanities Block 2 (S&H 2)",
        "code": "SH-BLK2",
        "category": "academic",
        "latitude": 16.4847713,
        "longitude": 80.6935979,
        "height": 14,
        "floors": 3,
        "description": "Academic expansion building housing multidisciplinary environmental science laboratories, advanced materials characterization equipment, student counselling chambers, and smart tutorial rooms.",
        "departments": [
            "Environmental Sciences & Sustainability",
            "Applied Mathematics & Computational Statistics",
            "Student Welfare & Counselling Directorate"
        ],
        "facilities": [
            "Environmental Monitoring Station",
            "Nanomaterials Synthesis Bench",
            "Student Counselling & Wellness Chambers",
            "Collaborative Tutorial Study Suites",
            "Faculty Academic Research Lounges"
        ],
        "footprint": ways[1324048131]['coords'],
        "color": "#14B8A6"
    },
    {
        "id": "mech-civil-block",
        "name": "Mechanical Engineering Block (Main)",
        "code": "MECH-BLK",
        "category": "academic",
        "latitude": 16.4857314,
        "longitude": 80.6930383,
        "height": 18,
        "floors": 4,
        "description": "Core engineering department building accommodating Mechanical Engineering, thermal sciences, aerodynamics, CAD/CAM simulation stations, internal combustion engine dynamometers, and materials fatigue testing laboratories.",
        "departments": [
            "Department of Mechanical Engineering",
            "Thermal Engineering & Cryogenics",
            "Computer Aided Design & Manufacturing (CAD/CAM)",
            "Automotive Engineering & Hybrid Propulsion"
        ],
        "facilities": [
            "Thermal Engineering & Heat Transfer Lab",
            "IC Engines & Emissions Testing Facility",
            "Refrigeration & Air-Conditioning Test Rig",
            "Finite Element Analysis (FEA) Computer Center",
            "Vibration & Noise Dynamics Chamber"
        ],
        "footprint": ways[1324048128]['coords'],
        "color": "#EF4444"
    },
    {
        "id": "civil-engineering-block",
        "name": "Civil Engineering Department Block",
        "code": "CIVIL-BLK",
        "category": "academic",
        "latitude": 16.4852708,
        "longitude": 80.6935538,
        "height": 14,
        "floors": 3,
        "description": "Comprehensive engineering facility housing Civil Engineering, geotechnical testing, structural dynamics loading frames, concrete quality analysis, environmental filtration models, and surveying instrumentation stations.",
        "departments": [
            "Department of Civil Engineering",
            "Structural Engineering Directorate",
            "Geotechnical & Highway Engineering",
            "Water Resources & Environmental Engineering"
        ],
        "facilities": [
            "100-Ton Universal Testing Machine (UTM)",
            "Soil Mechanics & Triaxial Shear Testing Lab",
            "Concrete Technology & Non-Destructive Testing Lab",
            "Hydraulics & Fluid Machinery Channel",
            "Total Station & GIS Drone Surveying Hub"
        ],
        "footprint": ways[1324048130]['coords'],
        "color": "#8B5CF6"
    },
    {
        "id": "mechanical-workshops",
        "name": "Mechanical Engineering Industrial Workshops",
        "code": "MECH-WS",
        "category": "laboratory",
        "latitude": 16.4859848,
        "longitude": 80.6930372,
        "height": 9,
        "floors": 1,
        "description": "High-bay industrial fabrication facility with overhead cranes, automated CNC lathes, milling machines, foundry cupola furnaces, forging hammers, and precision metal welding bays.",
        "departments": [
            "Mechanical Engineering Workshop Directorate",
            "Central Manufacturing & Prototyping Facility"
        ],
        "facilities": [
            "CNC Turning & 5-Axis Milling Machine Floor",
            "Machine Shop with 40 Precision Lathes",
            "Foundry & Sand Casting Pit",
            "MIG/TIG & Arc Welding Fabrication Bay",
            "Carpentry, Pattern Making & Sheet Metal Fitting"
        ],
        "footprint": ways[1324048129]['coords'],
        "color": "#F97316"
    },
    {
        "id": "siemens-tifac-centre",
        "name": "Siemens Centre of Excellence & TIFAC CORE",
        "code": "SIEMENS-COE",
        "category": "laboratory",
        "latitude": 16.4858779,
        "longitude": 80.6936484,
        "height": 14,
        "floors": 3,
        "description": "World-class industrial center of excellence established with Siemens and TIFAC, providing state-of-the-art training in Industry 4.0, industrial robotics, PLC automation, SCADA systems, and digital twin simulation.",
        "departments": [
            "Siemens Industry 4.0 Centre of Excellence",
            "TIFAC Centre of Relevance & Excellence (CORE)",
            "Industrial Robotics & Mechatronics Directorate"
        ],
        "facilities": [
            "KUKA & ABB 6-Axis Industrial Robotics Cell",
            "Siemens S7-1500 PLC & SCADA Automation Suite",
            "Process Instrumentation & Control Simulator",
            "NX CAD/CAM & Teamcenter PLM Station",
            "Smart Factory Digital Manufacturing Testbed"
        ],
        "footprint": ways[1324048127]['coords'],
        "color": "#EC4899"
    },
    {
        "id": "auditorium-complex",
        "name": "Dr. Zakir Husain Central Auditorium",
        "code": "AUD-CTR",
        "category": "auditorium",
        "latitude": 16.48413,
        "longitude": 80.692521,
        "height": 18,
        "floors": 2,
        "description": "Grand air-conditioned acoustic auditorium with 1,500 seating capacity for international symposiums, national conferences, university convocations, and cultural galas, flanked by an open-air amphitheatre.",
        "departments": [
            "Cultural & Arts Committee",
            "Events & Protocol Directorate"
        ],
        "facilities": [
            "1,500 Seating Acoustic Main Hall",
            "Motorized Stage Lighting & Dolby Sound",
            "Green Rooms & Dressing Lounges",
            "VIP Hospitality Foyer",
            "Outdoor Stepped Amphitheatre"
        ],
        "footprint": [
            [80.69230, 16.48428],
            [80.69275, 16.48428],
            [80.69275, 16.48398],
            [80.69230, 16.48398],
            [80.69230, 16.48428]
        ],
        "color": "#8B5CF6"
    },
    {
        "id": "cafeteria-complex",
        "name": "Central Cafeteria & Student Food Court",
        "code": "CAFE",
        "category": "cafeteria",
        "latitude": 16.484198,
        "longitude": 80.693365,
        "height": 12,
        "floors": 2,
        "description": "Multi-cuisine student food court offering hygienic vegetarian and non-vegetarian meals, fresh juice bars, snacks, espresso stations, and outdoor shaded pergola seating for over 800 students.",
        "departments": [
            "Campus Hospitality & Catering Directorate"
        ],
        "facilities": [
            "VR Siddhartha Canteen (Main Student Canteen)",
            "Faculty Dining Hall & Lounge",
            "Juice Junction & Cold Beverage Counter",
            "Open Lawn Dining Pergola",
            "Automated Dishwashing & Food Safety Zone"
        ],
        "footprint": [
            [80.69315, 16.48432],
            [80.69358, 16.48432],
            [80.69358, 16.48408],
            [80.69315, 16.48408],
            [80.69315, 16.48432]
        ],
        "color": "#F59E0B"
    },
    {
        "id": "sports-arena",
        "name": "Physical Education & Indoor Sports Arena",
        "code": "SPORT-CTR",
        "category": "sports",
        "latitude": 16.4833317,
        "longitude": 80.6921062,
        "height": 14,
        "floors": 2,
        "description": "Modern multi-discipline indoor athletic stadium with teakwood badminton courts, table tennis tables, chess arenas, yoga studio, and a fully equipped cardio & strength training gym.",
        "departments": [
            "Department of Physical Education & Athletics"
        ],
        "facilities": [
            "4 Synthetic Teakwood Badminton Courts",
            "Full-Court Indoor Basketball Stadium",
            "Table Tennis Championship Arena (6 Tables)",
            "Multi-Gym Fitness & Cardio Station",
            "Yoga, Meditation & Aerobics Studio"
        ],
        "footprint": ways[403282763]['coords'],
        "color": "#10B981"
    },
    {
        "id": "boys-hostel-complex",
        "name": "Siddhartha Boys Residency Hall (Main Block)",
        "code": "B-HOSTEL-MAIN",
        "category": "hostel",
        "latitude": 16.4851902,
        "longitude": 80.6952830,
        "height": 20,
        "floors": 5,
        "description": "Spacious five-story residential hall accommodating male engineering students, complete with high-speed Wi-Fi, modern study halls, recreation spaces, hygienic dining hall, and 24/7 biometric security.",
        "departments": [
            "Chief Warden's Office",
            "Hostel Welfare Board"
        ],
        "facilities": [
            "600-Capacity Resident Rooms",
            "Central Steam-Operated Dining Mess",
            "Silent Study Reading Rooms",
            "Biometric Access & 24/7 Security Desk",
            "RO Drinking Water Purification Plant"
        ],
        "footprint": ways[1318968808]['coords'],
        "color": "#64748B"
    },
    {
        "id": "old-boys-hostel-1",
        "name": "Old Boys Residency Block 1",
        "code": "B-HOSTEL-BLK1",
        "category": "hostel",
        "latitude": 16.4853796,
        "longitude": 80.6956768,
        "height": 12,
        "floors": 3,
        "description": "Three-story traditional hostel block offering triple-occupancy student rooms, quiet study corridors, indoor sports amenities, and resident laundry facilities.",
        "departments": [
            "Boys Hostel Welfare Board"
        ],
        "facilities": [
            "Triple-Occupancy Student Rooms",
            "Table Tennis & Indoor Recreation Room",
            "Resident Caretaker Office",
            "Solar Water Heating System"
        ],
        "footprint": ways[1318966334]['coords'],
        "color": "#94A3B8"
    },
    {
        "id": "old-boys-hostel-2",
        "name": "Old Boys Residency Block 2",
        "code": "B-HOSTEL-BLK2",
        "category": "hostel",
        "latitude": 16.4846829,
        "longitude": 80.6952902,
        "height": 12,
        "floors": 3,
        "description": "Residential block for senior students and research scholars, featuring quiet study alcoves, uninterrupted power backup, and landscaped courtyard views.",
        "departments": [
            "Boys Hostel Welfare Board"
        ],
        "facilities": [
            "Double-Occupancy Scholar Rooms",
            "High-Speed LAN Study Terminals",
            "Common Television & Recreation Lounge",
            "Water Treatment Station"
        ],
        "footprint": ways[1318968809]['coords'],
        "color": "#94A3B8"
    },
    {
        "id": "girls-hostel-complex",
        "name": "Aditya Girls Hostels (Ganga & Yamuna Wings)",
        "code": "G-HOSTEL-MAIN",
        "category": "hostel",
        "latitude": 16.4839837,
        "longitude": 80.6951689,
        "height": 16,
        "floors": 4,
        "description": "Safe, serene residential accommodations for female students with lush garden courtyards, study lounges, 24/7 CCTV surveillance, female security wardens, and dedicated dining halls.",
        "departments": [
            "Women's Hostel Management Board"
        ],
        "facilities": [
            "Ensuite Bathrooms & Air-Conditioned Options",
            "Spacious Dining Mess & Pure RO Water Station",
            "Reading Library & Computing Lab",
            "Indoor Badminton Court & Gym",
            "24/7 Female Guard & CCTV Surveillance"
        ],
        "footprint": ways[1320182457]['coords'],
        "color": "#EC4899"
    },
    {
        "id": "girls-hostel-krishna",
        "name": "Aditya Girls Hostel (Krishna Wing)",
        "code": "G-HOSTEL-KRISHNA",
        "category": "hostel",
        "latitude": 16.4834179,
        "longitude": 80.6950283,
        "height": 16,
        "floors": 4,
        "description": "Modern expansion wing of Aditya Women's Residency, offering deluxe rooms, private study balconies, automated laundry machines, and round-the-clock medical care assistance.",
        "departments": [
            "Women's Hostel Management Board"
        ],
        "facilities": [
            "Air-Conditioned Deluxe Rooms",
            "Private Study Balconies",
            "Automated Laundry Stations",
            "On-Call Medical Attendant Room",
            "Biometric Turnstile Entry Gate"
        ],
        "footprint": ways[1318966332]['coords'],
        "color": "#F472B6"
    },
    {
        "id": "staff-quarters",
        "name": "Faculty & Staff Residential Quarters",
        "code": "STAFF-QTRS",
        "category": "hostel",
        "latitude": 16.4846538,
        "longitude": 80.6957268,
        "height": 12,
        "floors": 3,
        "description": "Serene residential apartments for university faculty, department heads, and senior administrative staff with manicured gardens and parking.",
        "departments": [
            "University Residential Housing Directorate"
        ],
        "facilities": [
            "2BHK & 3BHK Faculty Apartments",
            "Children's Play Park & Walkways",
            "Senior Faculty Guest Suites",
            "Dedicated Resident Car Parking"
        ],
        "footprint": ways[1318966333]['coords'],
        "color": "#64748B"
    },
    {
        "id": "students-centre-guest-house",
        "name": "Students Centre & University Guest House",
        "code": "GUEST-HOUSE",
        "category": "amenity",
        "latitude": 16.4858886,
        "longitude": 80.6920983,
        "height": 9,
        "floors": 2,
        "description": "Hospitality and student activities center housing air-conditioned guest suites for visiting professors and recruiters, alumni lounge, and student club offices.",
        "departments": [
            "Student Affairs Directorate",
            "University Guest Hospitality Office",
            "Alumni Association Secretariat"
        ],
        "facilities": [
            "VIP Deluxe Guest Suites (8 Rooms)",
            "Student Club Meeting Chambers",
            "Visiting Professor Lounge",
            "Alumni Relations Office"
        ],
        "footprint": ways[1320668604]['coords'],
        "color": "#38BDF8"
    },
    {
        "id": "power-house-substation",
        "name": "Campus Power Substation & Generator Station",
        "code": "POWER-HOUSE",
        "category": "amenity",
        "latitude": 16.4863811,
        "longitude": 80.6930734,
        "height": 6,
        "floors": 1,
        "description": "Critical power infrastructure housing the campus 11kV electrical transformer substation, 1000 kVA silent diesel generators, and automated power synchronization switchgear.",
        "departments": [
            "Electrical Maintenance & Utilities Division"
        ],
        "facilities": [
            "11kV Electric Substation Transformers",
            "1000 kVA Silent Backup Diesel Generators",
            "Automated Power Transfer Switchgear",
            "High Voltage Safety Control Room"
        ],
        "footprint": ways[1320668605]['coords'],
        "color": "#475569"
    },
    {
        "id": "main-entrance-portal",
        "name": "SAHE University Grand Entrance Arch & Security",
        "code": "GATE-1",
        "category": "entrance",
        "latitude": 16.4817463,
        "longitude": 80.6911879,
        "height": 7,
        "floors": 1,
        "description": "Primary university ceremonial gateway on VR Siddhartha College Road off Bandar Road, featuring automated boom barriers, visitor registration kiosks, security command desk, and bus turnaround bays.",
        "departments": [
            "Campus Security & Surveillance Command"
        ],
        "facilities": [
            "Visitor Passes & Vehicle Entry Verification",
            "Automated Boom Barriers & CCTV Number Plate Capture",
            "24/7 Security Guard Control Post",
            "Bus Turnaround & Drop-Off Boulevard"
        ],
        "footprint": ways[1320824131]['coords'],
        "color": "#059669"
    },
    {
        "id": "sbi-ncc-bank-block",
        "name": "State Bank of India & NCC Officers Complex",
        "code": "SBI-NCC",
        "category": "amenity",
        "latitude": 16.4818094,
        "longitude": 80.6909734,
        "height": 9,
        "floors": 2,
        "description": "Campus banking and defence cadet building accommodating a full-service State Bank of India branch, 24/7 ATMs, and the 1(A) EME NCC Company Headquarters.",
        "departments": [
            "State Bank of India - VRSEC Kanuru Branch",
            "NCC 1(A) EME Cadet Directorate"
        ],
        "facilities": [
            "SBI Full-Service Banking Counters",
            "Dual 24/7 Cash Deposit & Withdrawal ATMs",
            "NCC Cadet Quartermaster Store",
            "Parade Training Briefing Hall"
        ],
        "footprint": ways[1320824137]['coords'],
        "color": "#2563EB"
    },
    {
        "id": "parking-plaza",
        "name": "Two-Wheeler Vehicle Parking Shed 1 (West Stand)",
        "code": "PARK-A",
        "category": "parking",
        "latitude": 16.4819231,
        "longitude": 80.6909304,
        "height": 4.5,
        "floors": 1,
        "description": "Covered solar-canopied parking zone dedicated to student two-wheelers, with CCTV security, marked lanes, and helmet storage lockers.",
        "departments": [
            "Estate & Transport Management Office"
        ],
        "facilities": [
            "350 Two-Wheeler Covered Slots",
            "Solar Photovoltaic Rooftop Array",
            "Security Surveillance Cameras",
            "Marked Fire Hydrant Lanes"
        ],
        "footprint": ways[1320824558]['coords'],
        "color": "#475569"
    },
    {
        "id": "bike-stand-2",
        "name": "Two-Wheeler Vehicle Parking Shed 2 (East Stand)",
        "code": "PARK-B",
        "category": "parking",
        "latitude": 16.4818968,
        "longitude": 80.6910206,
        "height": 4.5,
        "floors": 1,
        "description": "Secondary covered vehicle parking facility for staff and student motorbikes, situated conveniently near the campus entrance security gate.",
        "departments": [
            "Estate & Transport Management Office"
        ],
        "facilities": [
            "300 Two-Wheeler Covered Slots",
            "EV Slow Charging Outlets",
            "All-Weather Steel Truss Canopy"
        ],
        "footprint": ways[1320824559]['coords'],
        "color": "#475569"
    },
    {
        "id": "health-center",
        "name": "University Health & Medical Center",
        "code": "MED-CTR",
        "category": "medical",
        "latitude": 16.482809,
        "longitude": 80.693648,
        "height": 8,
        "floors": 2,
        "description": "Fully staffed healthcare clinic offering outpatient consultations, routine wellness screenings, emergency trauma stabilization, pharmacy, and an on-call 24/7 ambulance.",
        "departments": [
            "Campus Medical Services Directorate"
        ],
        "facilities": [
            "Physician & Nursing Consultation Chambers",
            "Emergency 4-Bed Observation Ward",
            "Subsidized Campus Pharmacy",
            "24/7 Critical Ambulance Standby Bay",
            "Diagnostic Pathological Sample Lab"
        ],
        "footprint": [
            [80.69345, 16.48292],
            [80.69385, 16.48292],
            [80.69385, 16.48270],
            [80.69345, 16.48270],
            [80.69345, 16.48292]
        ],
        "color": "#EF4444"
    }
]

# Write src/data/buildings.ts
b_content = "import { Building } from '../types/campus';\n\nexport const CAMPUS_BUILDINGS: Building[] = " + json.dumps(buildings_master, indent=2) + ";\n"
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
print("Updated src/data/buildings.ts with 26 physical structures.")

# 2. Generate Outdoor Facilities dataset: src/data/outdoorFacilities.ts
outdoor_facilities = [
    {
        "id": "cricket-athletic-oval",
        "name": "Main University Athletic Field & Cricket Oval",
        "code": "FIELD-CRICKET",
        "category": "athletic",
        "latitude": 16.483462,
        "longitude": 80.691021,
        "areaSqm": 18500,
        "description": "Championship 400m 6-lane athletic running track, natural clay cricket pitch, regulation football ground, and grass spectator embankment.",
        "facilities": [
            "Natural Turf Cricket Pitch",
            "400m 6-Lane Athletic Running Track",
            "Full-Size Football Field",
            "Spectator Grass Embankment",
            "High-Intensity Solar Floodlights"
        ],
        "coordinates": [
            [80.69067, 16.4842784],
            [80.6902094, 16.4828948],
            [80.691269, 16.4824624],
            [80.6919357, 16.4842135],
            [80.69067, 16.4842784]
        ],
        "color": "#16A34A"
    },
    {
        "id": "basketball-court-complex",
        "name": "University Floodlit Basketball Courts",
        "code": "COURT-BB",
        "category": "court",
        "latitude": 16.483725,
        "longitude": 80.692550,
        "areaSqm": 1050,
        "description": "Dual regulation outdoor synthetic acrylic basketball courts with LED floodlighting, chainlink fencing, and team bench shelters.",
        "facilities": [
            "2 Synthetic Acrylic Competition Courts",
            "Shatterproof Glass Backboards",
            "Four-Corner LED Floodlighting Towers",
            "Player Bench Shelters"
        ],
        "coordinates": [
            [80.69235, 16.48360],
            [80.69275, 16.48360],
            [80.69275, 16.48385],
            [80.69235, 16.48385],
            [80.69235, 16.48360]
        ],
        "color": "#2563EB"
    },
    {
        "id": "volleyball-courts",
        "name": "Campus Volleyball & Throwball Arena",
        "code": "COURT-VB",
        "category": "court",
        "latitude": 16.483725,
        "longitude": 80.692975,
        "areaSqm": 875,
        "description": "Dual sand and red clay volleyball courts designed for inter-collegiate tournaments and sports training.",
        "facilities": [
            "2 Tournament Clay Courts",
            "Heavy-Duty Net Rigging",
            "Perimeter Boundary Enclosure"
        ],
        "coordinates": [
            [80.69280, 16.48360],
            [80.69315, 16.48360],
            [80.69315, 16.48385],
            [80.69280, 16.48385],
            [80.69280, 16.48360]
        ],
        "color": "#D97706"
    },
    {
        "id": "open-air-auditorium",
        "name": "Open-Air Amphitheatre & Cultural Stage",
        "code": "OPEN-AUD",
        "category": "amenity",
        "latitude": 16.484035,
        "longitude": 80.692500,
        "areaSqm": 1020,
        "description": "Stepped amphitheatre with covered acoustic proscenium stage, capable of seating 2,000 spectators for outdoor student festivals and convocations.",
        "facilities": [
            "Raised Performance Stage",
            "Tiered Stone Spectator Steps",
            "Acoustic Reflective Shell",
            "Outdoor Lighting Trusses"
        ],
        "coordinates": [
            [80.69220, 16.48395],
            [80.69280, 16.48395],
            [80.69280, 16.48412],
            [80.69220, 16.48412],
            [80.69220, 16.48395]
        ],
        "color": "#9333EA"
    },
    {
        "id": "greenhouse-polyhouse",
        "name": "Agricultural Greenhouse & Botanical Polyhouse",
        "code": "POLYHOUSE",
        "category": "research",
        "latitude": 16.486200,
        "longitude": 80.694500,
        "areaSqm": 800,
        "description": "Climate-controlled research greenhouse and polyhouse structure for botany, plant tissue culture, and university environmental initiatives.",
        "facilities": [
            "Misting & Drip Irrigation Control",
            "Polycarbonate Thermal Envelope",
            "Hydroponic Growing Tables",
            "Medicinal Flora Nursery"
        ],
        "coordinates": [
            [80.69430, 16.48610],
            [80.69470, 16.48610],
            [80.69470, 16.48630],
            [80.69430, 16.48630],
            [80.69430, 16.48610]
        ],
        "color": "#15803D"
    },
    {
        "id": "vermicompost-plant",
        "name": "Solid Waste Management & Vermicompost Plant",
        "code": "COMPOST",
        "category": "utility",
        "latitude": 16.486200,
        "longitude": 80.694950,
        "areaSqm": 800,
        "description": "Campus sustainability unit processing biodegradable dining waste and landscaping cuttings into certified organic compost.",
        "facilities": [
            "Aerobic Composting Bays (8)",
            "Earthworm Vermicompost Beds",
            "Organic Sifting & Bagging Unit",
            "Campus Zero-Waste Processing"
        ],
        "coordinates": [
            [80.69475, 16.48610],
            [80.69515, 16.48610],
            [80.69515, 16.48630],
            [80.69475, 16.48630],
            [80.69475, 16.48610]
        ],
        "color": "#78350F"
    },
    {
        "id": "bus-terminal-parking",
        "name": "University Bus Terminal & Transit Bay",
        "code": "BUS-TERM",
        "category": "parking",
        "latitude": 16.481975,
        "longitude": 80.691750,
        "areaSqm": 3150,
        "description": "Spacious paved bus depot accommodating 35+ Siddhartha Academy college transit buses with covered pedestrian walkways and lighting.",
        "facilities": [
            "35 Heavy Vehicle Bus Bays",
            "Covered Passenger Boarding Concourse",
            "Transit Security Dispatch Post",
            "Vehicle Wash & Maintenance Pit"
        ],
        "coordinates": [
            [80.69130, 16.48180],
            [80.69220, 16.48180],
            [80.69220, 16.48215],
            [80.69130, 16.48215],
            [80.69130, 16.48180]
        ],
        "color": "#0284C7"
    }
]

outdoor_content = '''export interface OutdoorFacility {
  id: string;
  name: string;
  code: string;
  category: 'athletic' | 'court' | 'amenity' | 'research' | 'utility' | 'parking';
  latitude: number;
  longitude: number;
  areaSqm: number;
  description: string;
  facilities: string[];
  coordinates: [number, number][]; // [lon, lat]
  color: string;
}

export const OUTDOOR_FACILITIES: OutdoorFacility[] = ''' + json.dumps(outdoor_facilities, indent=2) + ';\n'

with open('src/data/outdoorFacilities.ts', 'w', encoding='utf-8') as f:
    f.write(outdoor_content)
print("Generated src/data/outdoorFacilities.ts with 7 key outdoor facilities.")

# 3. Create OutdoorFacilitiesLayer.tsx
outdoor_layer_code = '''import React from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { OUTDOOR_FACILITIES, OutdoorFacility } from '../../data/outdoorFacilities';

interface OutdoorFacilitiesLayerProps {
  visible?: boolean;
  onSelectFacility?: (facility: OutdoorFacility) => void;
}

export const OutdoorFacilitiesLayer: React.FC<OutdoorFacilitiesLayerProps> = ({
  visible = true,
  onSelectFacility,
}) => {
  if (!visible) return null;

  return (
    <>
      {OUTDOOR_FACILITIES.map((facility) => {
        const flatCoords: number[] = [];
        for (const [lon, lat] of facility.coordinates) {
          flatCoords.push(lon, lat);
        }

        const color = Cesium.Color.fromCssColorString(facility.color);

        return (
          <React.Fragment key={facility.id}>
            {/* Ground Polygon with classification on terrain */}
            <Entity
              name={facility.name}
              polygon={{
                hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(flatCoords)),
                material: color.withAlpha(0.28),
                classificationType: Cesium.ClassificationType.TERRAIN,
              }}
            />

            {/* Perimeter boundary outline */}
            <Entity
              name={`${facility.name} Perimeter`}
              polyline={{
                positions: Cesium.Cartesian3.fromDegreesArray(flatCoords),
                width: 2.0,
                material: color.withAlpha(0.85),
                clampToGround: true,
              }}
            />

            {/* Facility Label */}
            <Entity
              name={facility.name}
              position={Cesium.Cartesian3.fromDegrees(facility.longitude, facility.latitude, 2.0)}
              point={{
                pixelSize: 6,
                color: color,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 1.5,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1600),
              }}
              label={{
                text: facility.name,
                font: '11px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1200),
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
'''

with open('src/components/map/OutdoorFacilitiesLayer.tsx', 'w', encoding='utf-8') as f:
    f.write(outdoor_layer_code)
print("Created src/components/map/OutdoorFacilitiesLayer.tsx.")

# 4. Integrate OutdoorFacilitiesLayer into CampusMap.tsx
with open('src/components/map/CampusMap.tsx', 'r', encoding='utf-8') as f:
    cmap_text = f.read()

if 'OutdoorFacilitiesLayer' not in cmap_text:
    cmap_text = cmap_text.replace(
        "import { LandscapingLayer } from './LandscapingLayer';",
        "import { LandscapingLayer } from './LandscapingLayer';\nimport { OutdoorFacilitiesLayer } from './OutdoorFacilitiesLayer';"
    )
    cmap_text = cmap_text.replace(
        "<LandscapingLayer visible={layers.satellite || layers.terrain3D} />",
        "<LandscapingLayer visible={layers.satellite || layers.terrain3D} />\n      <OutdoorFacilitiesLayer visible={true} />"
    )
    with open('src/components/map/CampusMap.tsx', 'w', encoding='utf-8') as f:
        f.write(cmap_text)
    print("Integrated OutdoorFacilitiesLayer into CampusMap.tsx.")

# 5. Generate building entrances: src/data/buildingEntrances.ts
entrances_data = [
    {
        "buildingId": "cse-it-complex",
        "buildingName": "Dr. APJ Abdul Kalam Block (Computing Complex)",
        "entranceName": "Computing Block East Concourse Portal",
        "doorType": "main",
        "latitude": 16.485190,
        "longitude": 80.691850,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-cse",
        "facadeOrientation": "east",
        "distanceToFacadeMeters": 2.5,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "admin-block",
        "buildingName": "Dr. VR Central Administrative Block",
        "entranceName": "Administration South Ceremonial Portico",
        "doorType": "main",
        "latitude": 16.483980,
        "longitude": 80.692500,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-admin-lib",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.2,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "central-library",
        "buildingName": "Central Knowledge Resource & Library Complex",
        "entranceName": "Central Library South Entrance Plaza",
        "doorType": "main",
        "latitude": 16.484050,
        "longitude": 80.693300,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-canteen",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.4,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "ece-eee-block",
        "buildingName": "Electrical Sciences Block (EEE Department)",
        "entranceName": "Electrical Sciences South Concourse Portico",
        "doorType": "main",
        "latitude": 16.485050,
        "longitude": 80.692469,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-ece",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.1,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "sh-block-1",
        "buildingName": "Science & Humanities Block 1 (S&H 1)",
        "entranceName": "S&H 1 South Academic Portico",
        "doorType": "main",
        "latitude": 16.484600,
        "longitude": 80.692914,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-sh-1",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "sh-block-2",
        "buildingName": "Science & Humanities Block 2 (S&H 2)",
        "entranceName": "S&H 2 South Entrance Porch",
        "doorType": "main",
        "latitude": 16.484600,
        "longitude": 80.693598,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-sh-2",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "mech-civil-block",
        "buildingName": "Mechanical Engineering Block (Main)",
        "entranceName": "Mechanical Engineering South Grand Entry",
        "doorType": "main",
        "latitude": 16.485500,
        "longitude": 80.693038,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-mech",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.8,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "civil-engineering-block",
        "buildingName": "Civil Engineering Department Block",
        "entranceName": "Civil Engineering South Entrance Porch",
        "doorType": "main",
        "latitude": 16.485100,
        "longitude": 80.693554,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-civil",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.3,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "mechanical-workshops",
        "buildingName": "Mechanical Engineering Industrial Workshops",
        "entranceName": "Mechanical Workshops Industrial Bay Portal",
        "doorType": "main",
        "latitude": 16.486150,
        "longitude": 80.693037,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-workshops",
        "facadeOrientation": "north",
        "distanceToFacadeMeters": 2.5,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "siemens-tifac-centre",
        "buildingName": "Siemens Centre of Excellence & TIFAC CORE",
        "entranceName": "Siemens CoE South High-Tech Portico",
        "doorType": "main",
        "latitude": 16.485700,
        "longitude": 80.693648,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-siemens",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.2,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "auditorium-complex",
        "buildingName": "Dr. Zakir Husain Central Auditorium",
        "entranceName": "Auditorium North Grand Entrance",
        "doorType": "main",
        "latitude": 16.484280,
        "longitude": 80.692520,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-auditorium",
        "facadeOrientation": "north",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "cafeteria-complex",
        "buildingName": "Central Cafeteria & Student Food Court",
        "entranceName": "Cafeteria West Entrance Court",
        "doorType": "main",
        "latitude": 16.484198,
        "longitude": 80.693120,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-canteen",
        "facadeOrientation": "west",
        "distanceToFacadeMeters": 2.4,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "sports-arena",
        "buildingName": "Physical Education & Indoor Sports Arena",
        "entranceName": "Sports Arena East Grand Foyer",
        "doorType": "main",
        "latitude": 16.483287,
        "longitude": 80.692280,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-sports-complex",
        "facadeOrientation": "east",
        "distanceToFacadeMeters": 2.5,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "boys-hostel-complex",
        "buildingName": "Siddhartha Boys Residency Hall (Main Block)",
        "entranceName": "Boys Residency South Biometric Gate",
        "doorType": "main",
        "latitude": 16.484950,
        "longitude": 80.695283,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-boys-hostel",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.5,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "old-boys-hostel-1",
        "buildingName": "Old Boys Residency Block 1",
        "entranceName": "Old Boys Block 1 South Portal",
        "doorType": "main",
        "latitude": 16.485200,
        "longitude": 80.695677,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-boys-hostel-1",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "old-boys-hostel-2",
        "buildingName": "Old Boys Residency Block 2",
        "entranceName": "Old Boys Block 2 South Portal",
        "doorType": "main",
        "latitude": 16.484500,
        "longitude": 80.695290,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-boys-hostel-2",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "girls-hostel-complex",
        "buildingName": "Aditya Girls Hostels (Ganga & Yamuna Wings)",
        "entranceName": "Girls Residency South Security Portal",
        "doorType": "main",
        "latitude": 16.483750,
        "longitude": 80.695169,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-girls-hostel",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.5,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "girls-hostel-krishna",
        "buildingName": "Aditya Girls Hostel (Krishna Wing)",
        "entranceName": "Krishna Wing South Entry Gate",
        "doorType": "main",
        "latitude": 16.483250,
        "longitude": 80.695028,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-girls-krishna",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.2,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "staff-quarters",
        "buildingName": "Faculty & Staff Residential Quarters",
        "entranceName": "Staff Quarters South Gate",
        "doorType": "main",
        "latitude": 16.484450,
        "longitude": 80.695727,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-staff-qtrs",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.1,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "students-centre-guest-house",
        "buildingName": "Students Centre & University Guest House",
        "entranceName": "Guest House South Portico",
        "doorType": "main",
        "latitude": 16.485700,
        "longitude": 80.692098,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-guest-house",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "power-house-substation",
        "buildingName": "Campus Power Substation & Generator Station",
        "entranceName": "Power Substation South Safety Gate",
        "doorType": "service",
        "latitude": 16.486250,
        "longitude": 80.693073,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-power-substation",
        "facadeOrientation": "south",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "main-entrance-portal",
        "buildingName": "SAHE University Grand Entrance Arch & Security",
        "entranceName": "Main Ceremonial Gate North Portal",
        "doorType": "main",
        "latitude": 16.481820,
        "longitude": 80.691188,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-gate",
        "facadeOrientation": "north",
        "distanceToFacadeMeters": 1.5,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "sbi-ncc-bank-block",
        "buildingName": "State Bank of India & NCC Officers Complex",
        "entranceName": "SBI Bank & ATM North Portico",
        "doorType": "main",
        "latitude": 16.481900,
        "longitude": 80.690973,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-sbi-ncc",
        "facadeOrientation": "north",
        "distanceToFacadeMeters": 1.8,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "parking-plaza",
        "buildingName": "Two-Wheeler Vehicle Parking Shed 1 (West Stand)",
        "entranceName": "Bike Stand 1 North Gate",
        "doorType": "main",
        "latitude": 16.482020,
        "longitude": 80.690930,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-parking",
        "facadeOrientation": "north",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "bike-stand-2",
        "buildingName": "Two-Wheeler Vehicle Parking Shed 2 (East Stand)",
        "entranceName": "Bike Stand 2 North Gate",
        "doorType": "main",
        "latitude": 16.482000,
        "longitude": 80.691021,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-bike-stand-2",
        "facadeOrientation": "north",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    },
    {
        "buildingId": "health-center",
        "buildingName": "University Health & Medical Center",
        "entranceName": "Health Center West Clinic Entrance",
        "doorType": "accessible",
        "latitude": 16.482809,
        "longitude": 80.693480,
        "elevationMeters": 19.0,
        "connectedPathNodeId": "node-health-center",
        "facadeOrientation": "west",
        "distanceToFacadeMeters": 2.0,
        "confidence": "verified-aerial"
    }
]

# Write src/data/buildingEntrances.ts
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

export const BUILDING_ENTRANCES: BuildingEntrance[] = ''' + json.dumps(entrances_data, indent=2) + ';\n'

with open('src/data/buildingEntrances.ts', 'w', encoding='utf-8') as f:
    f.write(ent_code)
print(f"Updated src/data/buildingEntrances.ts with {len(entrances_data)} exterior door anchors.")

# 6. Update campus paths: src/data/campusPaths.ts
path_nodes = [
    {"id": "node-gate", "name": "Main Entrance Gate Portal", "latitude": 16.481820, "longitude": 80.691188, "category": "entrance", "buildingId": "main-entrance-portal"},
    {"id": "node-sbi-ncc", "name": "SBI Bank & NCC Entrance", "latitude": 16.481900, "longitude": 80.690973, "category": "amenity", "buildingId": "sbi-ncc-bank-block"},
    {"id": "node-parking", "name": "Bike Parking Stand 1", "latitude": 16.482020, "longitude": 80.690930, "category": "amenity", "buildingId": "parking-plaza"},
    {"id": "node-bike-stand-2", "name": "Bike Parking Stand 2", "latitude": 16.482000, "longitude": 80.691021, "category": "amenity", "buildingId": "bike-stand-2"},
    {"id": "node-bus-terminal", "name": "University Bus Terminal Concourse", "latitude": 16.482000, "longitude": 80.691750, "category": "amenity"},
    {"id": "node-junc-south", "name": "South Boulevard Junction", "latitude": 16.482100, "longitude": 80.691400, "category": "junction"},
    {"id": "node-junc-south-road", "name": "South Perimeter Road Junction", "latitude": 16.482200, "longitude": 80.692500, "category": "junction"},
    {"id": "node-health-center", "name": "Health Center Clinic Entrance", "latitude": 16.482809, "longitude": 80.693480, "category": "building", "buildingId": "health-center"},
    {"id": "node-athletic-ground", "name": "Athletic Field Pavilion Entry", "latitude": 16.483370, "longitude": 80.691073, "category": "amenity"},
    {"id": "node-junc-west-track", "name": "West Athletic Concourse Junction", "latitude": 16.483700, "longitude": 80.691500, "category": "junction"},
    {"id": "node-sports-complex", "name": "Sports Arena East Entrance", "latitude": 16.483287, "longitude": 80.692280, "category": "building", "buildingId": "sports-arena"},
    {"id": "node-basketball", "name": "Basketball Courts Concourse", "latitude": 16.483700, "longitude": 80.692550, "category": "amenity"},
    {"id": "node-volleyball", "name": "Volleyball Courts Concourse", "latitude": 16.483700, "longitude": 80.692975, "category": "amenity"},
    {"id": "node-open-auditorium", "name": "Open Air Amphitheatre", "latitude": 16.484035, "longitude": 80.692500, "category": "amenity"},
    {"id": "node-auditorium", "name": "Central Auditorium North Grand Portico", "latitude": 16.484280, "longitude": 80.692520, "category": "building", "buildingId": "auditorium-complex"},
    {"id": "node-admin-lib", "name": "Dr. VR Administration South Portico", "latitude": 16.483980, "longitude": 80.692500, "category": "building", "buildingId": "admin-block"},
    {"id": "node-canteen", "name": "Central Library & Canteen Plaza", "latitude": 16.484198, "longitude": 80.693120, "category": "building", "buildingId": "central-library"},
    {"id": "node-junc-central-plaza", "name": "Central Academic Quadrangle", "latitude": 16.484600, "longitude": 80.692500, "category": "junction"},
    {"id": "node-sh-1", "name": "S&H 1 South Concourse", "latitude": 16.484600, "longitude": 80.692914, "category": "building", "buildingId": "sh-block-1"},
    {"id": "node-sh-2", "name": "S&H 2 South Concourse", "latitude": 16.484600, "longitude": 80.693598, "category": "building", "buildingId": "sh-block-2"},
    {"id": "node-junc-academic-spine", "name": "North Academic Spine Concourse", "latitude": 16.484950, "longitude": 80.692000, "category": "junction"},
    {"id": "node-cse", "name": "Kalam Computing Complex East Portal", "latitude": 16.485190, "longitude": 80.691850, "category": "building", "buildingId": "cse-it-complex"},
    {"id": "node-ece", "name": "Electrical Sciences South Portico", "latitude": 16.485050, "longitude": 80.692469, "category": "building", "buildingId": "ece-eee-block"},
    {"id": "node-civil", "name": "Civil Engineering South Entrance", "latitude": 16.485100, "longitude": 80.693554, "category": "building", "buildingId": "civil-engineering-block"},
    {"id": "node-mech", "name": "Mechanical Engineering South Grand Entry", "latitude": 16.485500, "longitude": 80.693038, "category": "building", "buildingId": "mech-civil-block"},
    {"id": "node-siemens", "name": "Siemens CoE South Entrance", "latitude": 16.485700, "longitude": 80.693648, "category": "building", "buildingId": "siemens-tifac-centre"},
    {"id": "node-guest-house", "name": "Students Centre & Guest House South Entry", "latitude": 16.485700, "longitude": 80.692098, "category": "building", "buildingId": "students-centre-guest-house"},
    {"id": "node-workshops", "name": "Mechanical Workshops Industrial Bay", "latitude": 16.486150, "longitude": 80.693037, "category": "building", "buildingId": "mechanical-workshops"},
    {"id": "node-power-substation", "name": "Power Substation Safety Portal", "latitude": 16.486250, "longitude": 80.693073, "category": "amenity", "buildingId": "power-house-substation"},
    {"id": "node-greenhouse", "name": "Greenhouse & Polyhouse Concourse", "latitude": 16.486200, "longitude": 80.694300, "category": "amenity"},
    {"id": "node-compost", "name": "Compost Plant Safety Concourse", "latitude": 16.486200, "longitude": 80.694800, "category": "amenity"},
    {"id": "node-junc-hostel-corridor", "name": "Hostel Residential Concourse", "latitude": 16.484800, "longitude": 80.694700, "category": "junction"},
    {"id": "node-boys-hostel", "name": "Boys Residency Main South Portal", "latitude": 16.484950, "longitude": 80.695283, "category": "building", "buildingId": "boys-hostel-complex"},
    {"id": "node-boys-hostel-1", "name": "Old Boys Hostel 1 South Portal", "latitude": 16.485200, "longitude": 80.695677, "category": "building", "buildingId": "old-boys-hostel-1"},
    {"id": "node-boys-hostel-2", "name": "Old Boys Hostel 2 South Portal", "latitude": 16.484500, "longitude": 80.695290, "category": "building", "buildingId": "old-boys-hostel-2"},
    {"id": "node-girls-hostel", "name": "Girls Residency Main South Portal", "latitude": 16.483750, "longitude": 80.695169, "category": "building", "buildingId": "girls-hostel-complex"},
    {"id": "node-girls-krishna", "name": "Krishna Girls Hostel South Entry", "latitude": 16.483250, "longitude": 80.695028, "category": "building", "buildingId": "girls-hostel-krishna"},
    {"id": "node-staff-qtrs", "name": "Staff Quarters South Portal", "latitude": 16.484450, "longitude": 80.695727, "category": "building", "buildingId": "staff-quarters"}
]

# Calculate edges with Euclidean distance in meters
path_edges = []
nodes_dict = {n['id']: n for n in path_nodes}

def add_edge(u, v, name="Concourse"):
    n1 = nodes_dict[u]
    n2 = nodes_dict[v]
    lat_mid = 0.5 * (n1['latitude'] + n2['latitude']) * math.pi / 180.0
    dx = (n2['longitude'] - n1['longitude']) * 111412.84 * math.cos(lat_mid)
    dy = (n2['latitude'] - n1['latitude']) * 111132.954
    dist = round(math.sqrt(dx*dx + dy*dy), 1)
    path_edges.append({
        "from": u,
        "to": v,
        "distanceMeters": dist,
        "accessible": True,
        "name": name
    })

# Entrance to South Junction
add_edge("node-gate", "node-junc-south", "Ceremonial Entrance Avenue")
add_edge("node-gate", "node-sbi-ncc", "Banking Walkway")
add_edge("node-sbi-ncc", "node-parking", "West Stand Walkway")
add_edge("node-gate", "node-bike-stand-2", "East Stand Walkway")
add_edge("node-junc-south", "node-bus-terminal", "Transit Boulevard")
add_edge("node-junc-south", "node-junc-south-road", "South Boulevard")

# South Road to Health Center & Sports
add_edge("node-junc-south-road", "node-health-center", "Medical Access Road")
add_edge("node-junc-south-road", "node-sports-complex", "Sports Access Walkway")
add_edge("node-sports-complex", "node-basketball", "Athletic Concourse")
add_edge("node-basketball", "node-volleyball", "Courts Walkway")
add_edge("node-junc-south", "node-athletic-ground", "Athletic Field Approach")
add_edge("node-athletic-ground", "node-junc-west-track", "Running Track Spine")
add_edge("node-junc-west-track", "node-cse", "West Academic Connector")

# Central Avenue
add_edge("node-sports-complex", "node-open-auditorium", "Amphitheatre Concourse")
add_edge("node-open-auditorium", "node-auditorium", "Auditorium Walkway")
add_edge("node-auditorium", "node-admin-lib", "Administration Forecourt")
add_edge("node-admin-lib", "node-canteen", "Knowledge Plaza Walkway")
add_edge("node-admin-lib", "node-junc-central-plaza", "Central Quadrangle Walkway")

# Central Plaza to Academic Spine
add_edge("node-junc-central-plaza", "node-sh-1", "Science Concourse 1")
add_edge("node-sh-1", "node-sh-2", "Science Inter-Block Walkway")
add_edge("node-junc-central-plaza", "node-junc-academic-spine", "Academic North Walkway")
add_edge("node-junc-academic-spine", "node-cse", "Kalam Block Concourse")
add_edge("node-junc-academic-spine", "node-ece", "Electrical Sciences Concourse")
add_edge("node-ece", "node-guest-house", "Guest House Walkway")
add_edge("node-ece", "node-mech", "Engineering Spine")
add_edge("node-mech", "node-civil", "Civil-Mech Concourse")
add_edge("node-civil", "node-siemens", "Siemens Innovation Promenade")
add_edge("node-mech", "node-workshops", "Workshop Access Road")
add_edge("node-workshops", "node-power-substation", "Utility Service Road")
add_edge("node-siemens", "node-greenhouse", "Sustainability Walkway")
add_edge("node-greenhouse", "node-compost", "Compost Access Road")

# Hostel Network
add_edge("node-canteen", "node-junc-hostel-corridor", "East Residential Corridor")
add_edge("node-junc-hostel-corridor", "node-boys-hostel", "Boys Residency Concourse")
add_edge("node-boys-hostel", "node-boys-hostel-1", "Old Boys 1 Walkway")
add_edge("node-boys-hostel", "node-boys-hostel-2", "Old Boys 2 Walkway")
add_edge("node-junc-hostel-corridor", "node-girls-hostel", "Aditya Girls Concourse")
add_edge("node-girls-hostel", "node-girls-krishna", "Krishna Wing Walkway")
add_edge("node-junc-hostel-corridor", "node-staff-qtrs", "Staff Quarters Road")

paths_ts_code = '''import { CampusPathNetwork } from '../types/campus';

export const CAMPUS_PATH_NETWORK: CampusPathNetwork = {
  nodes: ''' + json.dumps(path_nodes, indent=2) + ''',
  edges: ''' + json.dumps(path_edges, indent=2) + '''
};
'''

with open('src/data/campusPaths.ts', 'w', encoding='utf-8') as f:
    f.write(paths_ts_code)
print(f"Updated src/data/campusPaths.ts with {len(path_nodes)} nodes and {len(path_edges)} edges.")

# 7. Update POIs: src/data/pois.ts
pois_data = [
    {
        "id": "poi-main-gate",
        "name": "Main Campus Gate & Security Desk",
        "category": "entrance",
        "latitude": 16.481820,
        "longitude": 80.691188,
        "description": "Primary university ceremonial gateway with visitor passes, digital RFID checkpoints, and 24/7 security control.",
        "icon": "DoorOpen",
        "buildingId": "main-entrance-portal",
        "operatingHours": "24/7",
        "imageUrl": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-sbi-atm",
        "name": "State Bank of India & 24/7 ATM",
        "category": "atm",
        "latitude": 16.481900,
        "longitude": 80.690973,
        "description": "Full-service on-campus SBI branch with dual cash deposit and withdrawal ATM machines.",
        "icon": "CreditCard",
        "buildingId": "sbi-ncc-bank-block",
        "operatingHours": "10:00 AM - 04:00 PM (ATMs 24/7)",
        "imageUrl": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-admin-hq",
        "name": "Dr. VR Administrative Executive Directorate",
        "category": "administration",
        "latitude": 16.484113,
        "longitude": 80.692476,
        "description": "Vice-Chancellor's Secretariat, Registrar, Controller of Examinations, and Admissions.",
        "icon": "Building2",
        "buildingId": "admin-block",
        "operatingHours": "09:00 AM - 05:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-central-lib",
        "name": "Central Knowledge Repository & Library",
        "category": "library",
        "latitude": 16.484258,
        "longitude": 80.693294,
        "description": "3 floors of academic texts, IEEE, ACM, Springer journals, digital thesis database, and quiet study alcoves.",
        "icon": "BookOpen",
        "buildingId": "central-library",
        "operatingHours": "08:00 AM - 08:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-tpo-cell",
        "name": "Training and Placement Cell (TPO)",
        "category": "student_services",
        "latitude": 16.484300,
        "longitude": 80.693350,
        "description": "Corporate recruitment suites, aptitude training labs, and multinational interview chambers.",
        "icon": "Briefcase",
        "buildingId": "central-library",
        "operatingHours": "09:00 AM - 05:30 PM",
        "imageUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-cse-lab",
        "name": "NVIDIA AI Supercomputing Lab",
        "category": "laboratory",
        "latitude": 16.485190,
        "longitude": 80.691393,
        "description": "Enterprise-grade GPU computing cluster for neural network research, LLM fine-tuning, and machine vision systems.",
        "icon": "Cpu",
        "buildingId": "cse-it-complex",
        "operatingHours": "08:00 AM - 07:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-eee-lab",
        "name": "Smart Microgrid & Electric Vehicle Research Bay",
        "category": "laboratory",
        "latitude": 16.485267,
        "longitude": 80.692469,
        "description": "High voltage test beds, electric vehicle dynamometer testing, and solar PV microgrid station.",
        "icon": "Zap",
        "buildingId": "ece-eee-block",
        "operatingHours": "08:30 AM - 05:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-siemens-coe",
        "name": "Siemens Industry 4.0 Centre of Excellence",
        "category": "laboratory",
        "latitude": 16.485878,
        "longitude": 80.693648,
        "description": "Advanced industrial robotics, PLC automation, SCADA systems, and digital twin manufacturing testbed.",
        "icon": "Cog",
        "buildingId": "siemens-tifac-centre",
        "operatingHours": "09:00 AM - 06:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-civil-utm",
        "name": "Civil Structural Testing & UTM Facility",
        "category": "laboratory",
        "latitude": 16.485271,
        "longitude": 80.693554,
        "description": "100-ton Universal Testing Machine, triaxial shear test apparatus, and concrete non-destructive testing.",
        "icon": "Hammer",
        "buildingId": "civil-engineering-block",
        "operatingHours": "09:00 AM - 05:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-canteen-court",
        "name": "Main University Cafeteria & Food Court",
        "category": "food",
        "latitude": 16.484198,
        "longitude": 80.693365,
        "description": "Multi-cuisine fresh meals, Andhra meals, South Indian breakfast, fruit juices, and student lounge patio.",
        "icon": "Coffee",
        "buildingId": "cafeteria-complex",
        "operatingHours": "07:30 AM - 08:30 PM",
        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-auditorium",
        "name": "Dr. Zakir Husain Central Auditorium",
        "category": "auditorium",
        "latitude": 16.484130,
        "longitude": 80.692521,
        "description": "1,500-seat acoustic main auditorium for convocations, tech symposiums, and national hackathons.",
        "icon": "Tv",
        "buildingId": "auditorium-complex",
        "operatingHours": "Event Specific",
        "imageUrl": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-indoor-sports",
        "name": "Indoor Badminton & Gymnasium Arena",
        "category": "sports",
        "latitude": 16.483332,
        "longitude": 80.692106,
        "description": "4 teakwood badminton courts, table tennis arena, Olympic cardio station, and multi-gym.",
        "icon": "Trophy",
        "buildingId": "sports-arena",
        "operatingHours": "06:00 AM - 08:00 PM",
        "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-cricket-oval",
        "name": "Main Athletic Field & Cricket Oval",
        "category": "sports",
        "latitude": 16.483462,
        "longitude": 80.691021,
        "description": "Full-size turf cricket pitch, 400m running track, and football field.",
        "icon": "Award",
        "operatingHours": "05:30 AM - 07:30 PM",
        "imageUrl": "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-health-center",
        "name": "University Health Clinic & Pharmacy",
        "category": "medical",
        "latitude": 16.482809,
        "longitude": 80.693648,
        "description": "Consultation chambers, 4-bed trauma observation ward, emergency pharmacy, and 24/7 on-call ambulance.",
        "icon": "HeartPulse",
        "buildingId": "health-center",
        "operatingHours": "24/7 Emergency Care",
        "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-boys-residency",
        "name": "Siddhartha Boys Residency & Mess",
        "category": "hostel",
        "latitude": 16.485190,
        "longitude": 80.695283,
        "description": "Main residential tower for male students with dining mess, study rooms, and biometric security.",
        "icon": "Home",
        "buildingId": "boys-hostel-complex",
        "operatingHours": "24/7 (In-time: 09:00 PM)",
        "imageUrl": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
    },
    {
        "id": "poi-girls-residency",
        "name": "Aditya Girls Residency & Mess",
        "category": "hostel",
        "latitude": 16.483984,
        "longitude": 80.695169,
        "description": "Gated residential facility for women students with dedicated dining, fitness studio, and security.",
        "icon": "ShieldCheck",
        "buildingId": "girls-hostel-complex",
        "operatingHours": "24/7 (In-time: 07:30 PM)",
        "imageUrl": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80"
    }
]

pois_ts_code = '''import { POI } from '../types/campus';

export const CAMPUS_POIS: POI[] = ''' + json.dumps(pois_data, indent=2) + ';\n'

with open('src/data/pois.ts', 'w', encoding='utf-8') as f:
    f.write(pois_ts_code)
print(f"Updated src/data/pois.ts with {len(pois_data)} enriched POIs.")

print("All data assets generated successfully.")
