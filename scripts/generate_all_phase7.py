import json
import os
import math
from shapely.geometry import Polygon, Point, LineString

# Load matched official OSM ways
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

# Define Buildings Data
buildings_data = [
    {
        "id": "cse-it-complex",
        "name": "Dr. APJ Abdul Kalam Block (CSE, IT, Computing)",
        "code": "APJ-CSE",
        "category": "academic",
        "latitude": 16.4851896,
        "longitude": 80.6913927,
        "height": 26,
        "floors": 5,
        "description": "State-of-the-art five-story computing complex housing Computer Science & Engineering, Artificial Intelligence, Data Science labs, Nvidia AI Deep Learning Supercomputing clusters, and modern smart seminar halls.",
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

# Generate src/data/buildings.ts
buildings_ts_content = "import { Building } from '../types/campus';\n\nexport const CAMPUS_BUILDINGS: Building[] = " + json.dumps(buildings_data, indent=2) + ";\n"

# Backward compatibility alias for admin-central-library
buildings_ts_content += '''
// Backward compatibility helper
export function getBuildingById(id: string): Building | undefined {
  if (id === 'admin-central-library') {
    return CAMPUS_BUILDINGS.find(b => b.id === 'admin-block');
  }
  return CAMPUS_BUILDINGS.find(b => b.id === id);
}
'''

with open('src/data/buildings.ts', 'w', encoding='utf-8') as f:
    f.write(buildings_ts_content)
print(f"Generated src/data/buildings.ts with {len(buildings_data)} buildings.")

# 2. Update architectural profiles
arch_profiles_script = '''import { ArchitecturalProfile } from '../../systems/architecture/architectureProfiles';

export const ALL_ARCH_PROFILES: Record<string, ArchitecturalProfile> = {
'''
