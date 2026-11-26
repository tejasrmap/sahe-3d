import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { NavigationRoute as NavigationRouteType } from '../../types/campus';

interface NavigationRouteProps {
  route: NavigationRouteType | null;
}

export const NavigationRoute: React.FC<NavigationRouteProps> = ({ route }) => {
  const positions = useMemo(() => {
    if (!route || route.coordinates.length === 0) return [];
    const flat: number[] = [];
    for (const [lon, lat] of route.coordinates) {
      flat.push(lon, lat);
    }
    return Cesium.Cartesian3.fromDegreesArray(flat);
  }, [route]);

  if (!route || positions.length < 2) return null;

  const startCoord = route.coordinates[0];
  const endCoord = route.coordinates[route.coordinates.length - 1];

  return (
    <>
      {/* Route Line (Glow Material) */}
      <Entity
        name="Active Walking Route"
        polyline={{
          positions: positions,
          width: 6,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.35,
            taperPower: 1.0,
            color: Cesium.Color.fromCssColorString('#22C55E'),
          }),
          clampToGround: true,
        }}
      />

      {/* Start Point Marker */}
      <Entity
        name="Start Point"
        position={Cesium.Cartesian3.fromDegrees(startCoord[0], startCoord[1], 5)}
        point={{
          pixelSize: 14,
          color: Cesium.Color.fromCssColorString('#10B981'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 3,
          disableDepthTestDistance: 2000,
        }}
        label={{
          text: 'START',
          font: 'bold 11px Inter, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          pixelOffset: new Cesium.Cartesian2(0, -14),
          disableDepthTestDistance: 2000,
        }}
      />

      {/* Destination Point Marker */}
      <Entity
        name="Destination Point"
        position={Cesium.Cartesian3.fromDegrees(endCoord[0], endCoord[1], 5)}
        point={{
          pixelSize: 16,
          color: Cesium.Color.fromCssColorString('#F43F5E'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 3,
          disableDepthTestDistance: 2000,
        }}
        label={{
          text: 'DESTINATION',
          font: 'bold 11px Inter, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.fromCssColorString('#FDA4AF'),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          pixelOffset: new Cesium.Cartesian2(0, -16),
          disableDepthTestDistance: 2000,
        }}
      />
    </>
  );
};
