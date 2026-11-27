import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { Building } from '../../types/campus';

interface MainGatePortalProps {
  building: Building;
  isSelected?: boolean;
  isHovered?: boolean;
  showLabels?: boolean;
  onClick: () => void;
}

// Bearing is derived from the local tangent of OSM Way 844184733 at the
// entrance junction. The gate span is perpendicular to this road axis.
const ACCESS_ROAD_BEARING_DEGREES = 20.2;
const GATE_SPAN_METERS = 12.0;
const GATE_DEPTH_METERS = 4.0;
const PYLON_WIDTH_METERS = 2.16;
const CLEAR_VEHICLE_HEIGHT_METERS = 4.8;
const TOTAL_GATE_HEIGHT_METERS = 6.5;

export const MainGatePortal: React.FC<MainGatePortalProps> = ({
  building,
  isSelected = false,
  isHovered = false,
  showLabels = true,
  onClick,
}) => {
  const {
    westPylonPositions,
    eastPylonPositions,
    lintelPositions,
    signPanelPositions,
    signLabelPosition,
    buildingLabelPosition,
  } = useMemo(() => {
    const fp = building.footprint;
    const p0 = (fp[0] || [building.longitude, building.latitude]) as [number, number];
    const p1 = (fp[1] || [building.longitude, building.latitude]) as [number, number];
    const p2 = (fp[2] || [building.longitude, building.latitude]) as [number, number];
    const p3 = (fp[3] || [building.longitude, building.latitude]) as [number, number];

    const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
    ];

    const westRatio = PYLON_WIDTH_METERS / GATE_SPAN_METERS;
    const eastStart = 1 - westRatio;

    const westFp: number[] = [
      ...p0,
      ...lerp(p0, p1, westRatio),
      ...lerp(p3, p2, westRatio),
      ...p3,
      ...p0,
    ];
    const eastFp: number[] = [
      ...lerp(p0, p1, eastStart),
      ...p1,
      ...p2,
      ...lerp(p3, p2, eastStart),
      ...lerp(p0, p1, eastStart),
    ];
    const lintelFp: number[] = [...p0, ...p1, ...p2, ...p3, ...p0];

    // A local ENU frame keeps the signage plane aligned with the same
    // road-relative orientation as the portal and avoids lat/lon offsets.
    const center = Cesium.Cartesian3.fromDegrees(building.longitude, building.latitude, 0);
    const enu = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    const bearing = Cesium.Math.toRadians(ACCESS_ROAD_BEARING_DEGREES);
    const roadEast = Math.sin(bearing);
    const roadNorth = Math.cos(bearing);
    const crossEast = Math.cos(bearing);
    const crossNorth = -Math.sin(bearing);

    const localPoint = (across: number, along: number, height: number): Cesium.Cartesian3 => {
      const east = crossEast * across + roadEast * along;
      const north = crossNorth * across + roadNorth * along;
      const local = new Cesium.Cartesian3(east, north, height);
      return Cesium.Matrix4.multiplyByPoint(enu, local, new Cesium.Cartesian3());
    };

    // Sign panel is mounted on the highway-facing (south) side of the lintel.
    const signPanel = [
      localPoint(-3.2, -GATE_DEPTH_METERS / 2 - 0.02, 0),
      localPoint(3.2, -GATE_DEPTH_METERS / 2 - 0.02, 0),
    ];

    return {
      westPylonPositions: Cesium.Cartesian3.fromDegreesArray(westFp),
      eastPylonPositions: Cesium.Cartesian3.fromDegreesArray(eastFp),
      lintelPositions: Cesium.Cartesian3.fromDegreesArray(lintelFp),
      signPanelPositions: signPanel,
      signLabelPosition: localPoint(0, -GATE_DEPTH_METERS / 2 - 0.05, 5.6),
      buildingLabelPosition: localPoint(0, 0, TOTAL_GATE_HEIGHT_METERS + 0.9),
    };
  }, [building.latitude, building.longitude, building.footprint]);

  const pylonColor = useMemo(() => {
    if (isSelected) return Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.98);
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981').withAlpha(0.98);
    return Cesium.Color.fromCssColorString('#E2E8F0');
  }, [isSelected, isHovered]);

  const lintelColor = useMemo(() => {
    if (isSelected) return Cesium.Color.fromCssColorString('#16A34A').withAlpha(0.98);
    if (isHovered) return Cesium.Color.fromCssColorString('#059669').withAlpha(0.98);
    return Cesium.Color.fromCssColorString('#065F46');
  }, [isSelected, isHovered]);

  const outlineColor = useMemo(() => {
    if (isSelected) return Cesium.Color.WHITE;
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981');
    return Cesium.Color.fromCssColorString('#0F172A').withAlpha(0.65);
  }, [isSelected, isHovered]);

  return (
    <>
      <Entity
        name={`${building.name} - West Support Pylon`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(westPylonPositions),
          height: 0,
          extrudedHeight: CLEAR_VEHICLE_HEIGHT_METERS,
          material: pylonColor,
          outline: true,
          outlineColor,
          outlineWidth: 2,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      <Entity
        name={`${building.name} - East Support Pylon`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(eastPylonPositions),
          height: 0,
          extrudedHeight: CLEAR_VEHICLE_HEIGHT_METERS,
          material: pylonColor,
          outline: true,
          outlineColor,
          outlineWidth: 2,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      <Entity
        name={`${building.name} - Overhead Lintel`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(lintelPositions),
          height: CLEAR_VEHICLE_HEIGHT_METERS,
          extrudedHeight: TOTAL_GATE_HEIGHT_METERS,
          material: lintelColor,
          outline: true,
          outlineColor,
          outlineWidth: 2,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      <Entity
        name={`${building.name} - Physical Sign Backing`}
        wall={{
          positions: signPanelPositions,
          minimumHeights: [5.05, 5.05],
          maximumHeights: [6.15, 6.15],
          material: Cesium.Color.fromCssColorString('#064E3B'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#A7F3D0'),
        }}
        onClick={onClick}
      />

      <Entity
        name={`${building.name} - University Signage`}
        position={signLabelPosition}
        label={{
          text: 'SIDDHARTHA ACADEMY OF HIGHER EDUCATION\nVR SIDDHARTHA CAMPUS',
          font: 'bold 10px Inter, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          disableDepthTestDistance: 500,
          scaleByDistance: new Cesium.NearFarScalar(50, 1.0, 500, 0.4),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 600),
        }}
        onClick={onClick}
      />

      {showLabels && (
        <Entity
          name={`${building.name} - Building Label`}
          position={buildingLabelPosition}
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
