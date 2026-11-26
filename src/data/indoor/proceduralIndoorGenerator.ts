import { Building } from '../../types/campus';
import { IndoorBuildingData, IndoorFloor, IndoorRoom, RoomCategory } from './types';

/**
 * Procedurally generates multi-floor architectural indoor blueprints
 * for any campus building based on its footprint dimensions and category.
 */
export function generateProceduralIndoorBuilding(building: Building): IndoorBuildingData {
  const floorsCount = Math.max(1, building.floors || 3);
  const floors: IndoorFloor[] = [];

  // Approximate building dimension in meters from footprint or default
  const widthMeters = 54;
  const lengthMeters = 32;
  const floorHeightMeters = 4.0;

  for (let f = 0; f < floorsCount; f++) {
    const isGround = f === 0;
    const isTop = f === floorsCount - 1;
    const levelLabel = f === 0 ? 'G' : `${f}`;
    const floorElevation = f * floorHeightMeters;

    let floorName = `Floor ${f} — Academic & Laboratory Level`;
    if (isGround) floorName = 'Ground Floor — Reception, Laboratories & Lecture Halls';
    else if (isTop && floorsCount > 2) floorName = `Floor ${f} — Faculty Research, Conference Suites & Seminar Hall`;

    const corridors = [
      { id: `c-${building.id}-${f}-main`, startX: 4, startY: 16, endX: widthMeters - 4, endY: 16, width: 3.2 },
    ];
    if (isGround) {
      corridors.push({
        id: `c-${building.id}-${f}-entrance`,
        startX: widthMeters / 2,
        startY: lengthMeters - 2,
        endX: widthMeters / 2,
        endY: 16,
        width: 3.8,
      });
    }

    const staircases = [
      {
        id: `stair-${building.id}-w-${f}`,
        name: 'West Wing Staircase',
        position: { x: 3, y: 12 },
        dimensions: { width: 4.5, length: 7 },
        connectsFloors: Array.from({ length: floorsCount }, (_, i) => i),
        type: 'dog-leg' as const,
      },
      {
        id: `stair-${building.id}-e-${f}`,
        name: 'East Wing Staircase',
        position: { x: widthMeters - 7.5, y: 12 },
        dimensions: { width: 4.5, length: 7 },
        connectsFloors: Array.from({ length: floorsCount }, (_, i) => i),
        type: 'dog-leg' as const,
      },
    ];

    const elevators = [
      {
        id: `lift-${building.id}-${f}`,
        name: 'Central Passenger Elevator',
        position: { x: widthMeters / 2 - 4, y: 17 },
        dimensions: { width: 2.8, length: 2.8 },
        servesFloors: Array.from({ length: floorsCount }, (_, i) => i),
        capacity: 12,
      },
    ];

    // Procedural rooms layout: North row (y: 2 to 14) and South row (y: 18 to 30)
    const rooms: IndoorRoom[] = [];
    const prefix = building.code.replace('-BLK', '');

    // North Row (Labs / Large Classrooms / Offices)
    const northWidths = [16, 16, 14];
    let curX = 4;
    northWidths.forEach((w, idx) => {
      let cat: RoomCategory = 'classroom';
      let rName = `Lecture Classroom ${levelLabel}0${idx + 1}`;
      let cap = 70;

      if (building.category === 'academic') {
        if (idx === 0) {
          cat = 'laboratory';
          rName = isGround ? 'Foundational Computing & Hardware Lab' : `Specialized Research Lab ${levelLabel}A`;
          cap = 45;
        } else if (idx === 1 && (isGround || isTop)) {
          cat = isTop ? 'seminar_hall' : 'department_office';
          rName = isTop ? 'Department Academic Seminar Hall' : 'Head of Department Executive Chamber';
          cap = isTop ? 100 : 15;
        }
      } else if (building.category === 'library') {
        cat = 'library';
        rName = idx === 0 ? `General Reference Section ${levelLabel}` : `Silent Reading Stacks ${levelLabel}`;
        cap = 80;
      } else if (building.category === 'cafeteria') {
        cat = 'cafeteria';
        rName = idx === 0 ? 'Main Food Court & Buffet Hall' : 'Student Lounge & Refreshments';
        cap = 120;
      } else if (building.category === 'sports') {
        cat = 'student_lounge';
        rName = idx === 0 ? 'Indoor Badminton / Table Tennis Arena' : 'Athletic Fitness & Gym Suite';
        cap = 60;
      }

      rooms.push({
        id: `${building.id}-${f}-n${idx}`,
        name: rName,
        number: `${prefix}-${levelLabel}0${idx + 1}`,
        floor: f,
        category: cat,
        position: { x: curX, y: 2 },
        dimensions: { width: w, length: 13 },
        department: building.departments[0] || building.name,
        description: `Procedurally modeled architectural space for ${rName}.`,
        confidence: 'procedurally-estimated',
        capacity: cap,
      });

      curX += w + 1;
    });

    // South Row (Classrooms / Faculty cubicles / Restrooms)
    const southWidths = [14, 18, 14];
    let southCurX = 4;
    southWidths.forEach((w, idx) => {
      let cat: RoomCategory = idx === 1 ? 'faculty_office' : 'classroom';
      let rName = idx === 1 ? 'Faculty Consultation Cubicles' : `Smart Classroom ${levelLabel}1${idx}`;
      let cap = idx === 1 ? 16 : 65;

      if (isGround && idx === 0) {
        cat = 'reception';
        rName = 'Main Floor Reception & Inquiries';
        cap = 20;
      }

      rooms.push({
        id: `${building.id}-${f}-s${idx}`,
        name: rName,
        number: `${prefix}-${levelLabel}1${idx + 1}`,
        floor: f,
        category: cat,
        position: { x: southCurX, y: 18 },
        dimensions: { width: w, length: 12 },
        department: building.departments[0] || building.name,
        description: `Functional room providing ${rName} facilities.`,
        confidence: 'procedurally-estimated',
        capacity: cap,
      });

      southCurX += w + 1;
    });

    floors.push({
      floorNumber: f,
      name: floorName,
      levelLabel,
      elevationMeters: floorElevation,
      planWidth: widthMeters,
      planLength: lengthMeters,
      corridors,
      rooms,
      staircases,
      elevators,
      exits: isGround
        ? [
            {
              id: `exit-${building.id}-front`,
              name: 'Main Campus Portal',
              position: { x: widthMeters / 2, y: lengthMeters - 1 },
              leadsTo: 'campus-ground',
            },
          ]
        : undefined,
    });
  }

  return {
    buildingId: building.id,
    buildingName: building.name,
    buildingCode: building.code,
    totalFloors: floorsCount,
    groundElevationMeters: 0,
    confidence: 'procedurally-estimated',
    description: building.description,
    floors,
  };
}
