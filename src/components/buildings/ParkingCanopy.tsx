import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { Building } from '../../types/campus';

interface ParkingCanopyProps {
  building: Building;
  isSelected?: boolean;
  isHovered?: boolean;
  showLabels?: boolean;
  onClick: () => void;
}

const CANOPY_ROOF_TOP_METERS = 3.8;
const CANOPY_ROOF_THICKNESS_METERS = 0.4;
const CANOPY_GROUND_BASE_METERS = 0;
const COLUMN_STATIONS = [0.08, 0.36, 0.64, 0.92] as const;

export const ParkingCanopy: React.FC<ParkingCanopyProps> = ({
  building,
  isSelected = false,
  isHovered = false,
  showLabels = true,
  onClick,
}) => {
  // The campus inventory records the canopy roof top as a 3.8m visual model.
  // The slab is 0.4m thick; support columns run from ellipsoid ground (0m)
  // to the underside of the roof. This is a model datum, not a surveyed level.
  const ROOF_TOP = Math.min(building.height || CANOPY_ROOF_TOP_METERS, CANOPY_ROOF_TOP_METERS);
  const ROOF_BOTTOM = Math.max(CANOPY_GROUND_BASE_METERS, ROOF_TOP - CANOPY_ROOF_THICKNESS_METERS);
  const COLUMN_LENGTH = ROOF_BOTTOM - CANOPY_GROUND_BASE_METERS;
  const COLUMN_CENTER_HEIGHT = CANOPY_GROUND_BASE_METERS + COLUMN_LENGTH / 2;

  // Compute roof slab positions and structural column anchor positions
  const { roofPositions, columnEntities, centerPos } = useMemo(() => {
    const fp = building.footprint;
    const flat: number[] = [];
    for (const [lon, lat] of fp) {
      flat.push(lon, lat);
    }
    const rPos = Cesium.Cartesian3.fromDegreesArray(flat);

    // Structural columns: derive 4 pairs (8 columns) along the two long perimeter edges
    const p0 = fp[0] || [building.longitude, building.latitude];
    const p1 = fp[1] || [building.longitude, building.latitude];
    const p2 = fp[2] || [building.longitude, building.latitude];
    const p3 = fp[3] || [building.longitude, building.latitude];

    const columns: { id: string; position: Cesium.Cartesian3 }[] = [];
    COLUMN_STATIONS.forEach((t, idx) => {
      // Front edge column
      const cf_lon = p0[0] + (p1[0] - p0[0]) * t;
      const cf_lat = p0[1] + (p1[1] - p0[1]) * t;
      // Inset 6% into canopy footprint
      const cr_lon = p3[0] + (p2[0] - p3[0]) * t;
      const cr_lat = p3[1] + (p2[1] - p3[1]) * t;

      const f_lon = cf_lon + (cr_lon - cf_lon) * 0.08;
      const f_lat = cf_lat + (cr_lat - cf_lat) * 0.08;
      const r_lon = cr_lon + (cf_lon - cr_lon) * 0.08;
      const r_lat = cr_lat + (cf_lat - cr_lat) * 0.08;

      columns.push({
        id: `${building.id}-col-f-${idx}`,
        position: Cesium.Cartesian3.fromDegrees(f_lon, f_lat, COLUMN_CENTER_HEIGHT),
      });
      columns.push({
        id: `${building.id}-col-r-${idx}`,
        position: Cesium.Cartesian3.fromDegrees(r_lon, r_lat, COLUMN_CENTER_HEIGHT),
      });
    });

    const cPos = Cesium.Cartesian3.fromDegrees(
      building.longitude,
      building.latitude,
      ROOF_TOP + 3.0
    );

    return {
      roofPositions: rPos,
      columnEntities: columns,
      centerPos: cPos,
    };
  }, [building, ROOF_BOTTOM, ROOF_TOP, COLUMN_CENTER_HEIGHT]);

  // Styling
  const roofColor = useMemo(() => {
    if (isSelected) return Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.9);
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981').withAlpha(0.9);
    return Cesium.Color.fromCssColorString('#475569').withAlpha(0.85); // Industrial tensile canopy slate
  }, [isSelected, isHovered]);

  const columnColor = useMemo(() => {
    if (isSelected) return Cesium.Color.fromCssColorString('#22C55E');
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981');
    return Cesium.Color.fromCssColorString('#94A3B8'); // Galvanized steel pillars
  }, [isSelected, isHovered]);

  const outlineColor = useMemo(() => {
    if (isSelected) return Cesium.Color.WHITE;
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981');
    return Cesium.Color.fromCssColorString('#334155').withAlpha(0.8);
  }, [isSelected, isHovered]);

  return (
    <>
      {/* 1. Elevated Roof Canopy Slab (Clearance underneath for vehicles) */}
      <Entity
        name={`${building.name} - Canopy Roof`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(roofPositions),
          height: ROOF_BOTTOM,
          extrudedHeight: ROOF_TOP,
          material: roofColor,
          outline: true,
          outlineColor,
          outlineWidth: isSelected ? 3 : isHovered ? 2 : 1,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      {/* 2. Structural Support Columns (Ground 0 to Canopy Roof) */}
      {columnEntities.map((col) => (
        <Entity
          key={col.id}
          name={`${building.name} - Support Column`}
          position={col.position}
          cylinder={{
            length: COLUMN_LENGTH,
            topRadius: 0.22,
            bottomRadius: 0.22,
            material: columnColor,
            shadows: Cesium.ShadowMode.ENABLED,
          }}
          onClick={onClick}
        />
      ))}

      {/* 3. 3D Floating Building Tag */}
      {showLabels && (
        <Entity
          position={centerPos}
          label={{
            text: `${building.code}\n${building.name}`,
            font: 'bold 12px Inter, sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: isSelected ? Cesium.Color.fromCssColorString('#22C55E') : Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: 1500,
            scaleByDistance: new Cesium.NearFarScalar(100, 1.0, 1800, 0.4),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
          }}
          onClick={onClick}
        />
      )}
    </>
  );
};
