import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { CAMPUS_CONFIG } from '../../data/campusConfig';

interface CampusBoundaryProps {
  visible?: boolean;
}

export const CampusBoundary: React.FC<CampusBoundaryProps> = ({ visible = true }) => {
  const boundaryPositions = useMemo(() => {
    const flat: number[] = [];
    for (const [lon, lat] of CAMPUS_CONFIG.boundary) {
      flat.push(lon, lat);
    }
    return Cesium.Cartesian3.fromDegreesArray(flat);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Campus perimeter glowing boundary line */}
      <Entity
        name="SAHE Campus Boundary"
        polyline={{
          positions: boundaryPositions,
          width: 4,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.25,
            taperPower: 1.0,
            color: Cesium.Color.fromCssColorString('#22C55E'),
          }),
          clampToGround: true,
        }}
      />

      {/* Subtle translucent perimeter polygon highlight */}
      <Entity
        name="SAHE Campus Zone"
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(boundaryPositions),
          material: Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.04),
          classificationType: Cesium.ClassificationType.TERRAIN,
        }}
      />
    </>
  );
};
