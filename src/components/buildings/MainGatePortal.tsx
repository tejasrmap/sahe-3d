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

export const MainGatePortal: React.FC<MainGatePortalProps> = ({
  building,
  isSelected = false,
  isHovered = false,
  showLabels = true,
  onClick,
}) => {
  // Derive portal geometry parts from footprint:
  // p0: SW, p1: SE, p2: NE, p3: NW
  const { westPylonPositions, eastPylonPositions, lintelPositions, centerPos, signagePos } = useMemo(() => {
    const fp = building.footprint;
    const p0 = fp[0] || [80.6913738, 16.4821742];
    const p1 = fp[1] || [80.6914792, 16.4822118];
    const p2 = fp[2] || [80.6914662, 16.4822458];
    const p3 = fp[3] || [80.6913608, 16.4822082];

    const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
    ];

    // West Pylon (span 0.00 to 0.18 across driveway)
    const wpFp: number[] = [
      ...p0,
      ...lerp(p0, p1, 0.18),
      ...lerp(p3, p2, 0.18),
      ...p3,
      ...p0,
    ];

    // East Pylon (span 0.82 to 1.00 across driveway)
    const epFp: number[] = [
      ...lerp(p0, p1, 0.82),
      ...p1,
      ...p2,
      ...lerp(p3, p2, 0.82),
      ...lerp(p0, p1, 0.82),
    ];

    // Overhead Lintel (spans full 100% width across both pylons)
    const lintelFp: number[] = [
      ...p0,
      ...p1,
      ...p2,
      ...p3,
      ...p0,
    ];

    const wPos = Cesium.Cartesian3.fromDegreesArray(wpFp);
    const ePos = Cesium.Cartesian3.fromDegreesArray(epFp);
    const lPos = Cesium.Cartesian3.fromDegreesArray(lintelFp);

    const cPos = Cesium.Cartesian3.fromDegrees(
      building.longitude,
      building.latitude,
      building.height + 3.5
    );

    const sPos = Cesium.Cartesian3.fromDegrees(
      building.longitude,
      building.latitude - 0.000015,
      5.6
    );

    return {
      westPylonPositions: wPos,
      eastPylonPositions: ePos,
      lintelPositions: lPos,
      centerPos: cPos,
      signagePos: sPos,
    };
  }, [building]);

  // Color styling
  const pylonColor = useMemo(() => {
    if (isSelected) return Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.95);
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981').withAlpha(0.95);
    return Cesium.Color.fromCssColorString('#E2E8F0'); // Architectural limestone white
  }, [isSelected, isHovered]);

  const lintelColor = useMemo(() => {
    if (isSelected) return Cesium.Color.fromCssColorString('#16A34A').withAlpha(0.95);
    if (isHovered) return Cesium.Color.fromCssColorString('#059669').withAlpha(0.95);
    return Cesium.Color.fromCssColorString('#065F46'); // University ceremonial emerald green
  }, [isSelected, isHovered]);

  const outlineColor = useMemo(() => {
    if (isSelected) return Cesium.Color.WHITE;
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981');
    return Cesium.Color.fromCssColorString('#0F172A').withAlpha(0.6);
  }, [isSelected, isHovered]);

  const CLEAR_HEIGHT = 4.8; // Open vehicle passage clearance
  const TOTAL_HEIGHT = building.height || 6.5;

  return (
    <>
      {/* 1. West Support Pylon (Ground 0 to 4.8m) */}
      <Entity
        name={`${building.name} - West Pylon`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(westPylonPositions),
          height: 0,
          extrudedHeight: CLEAR_HEIGHT,
          material: pylonColor,
          outline: true,
          outlineColor,
          outlineWidth: 2,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      {/* 2. East Support Pylon (Ground 0 to 4.8m) */}
      <Entity
        name={`${building.name} - East Pylon`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(eastPylonPositions),
          height: 0,
          extrudedHeight: CLEAR_HEIGHT,
          material: pylonColor,
          outline: true,
          outlineColor,
          outlineWidth: 2,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      {/* 3. Overhead Architectural Lintel / Arch (4.8m to 6.5m) */}
      <Entity
        name={`${building.name} - Arch Lintel`}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(lintelPositions),
          height: CLEAR_HEIGHT,
          extrudedHeight: TOTAL_HEIGHT,
          material: lintelColor,
          outline: true,
          outlineColor,
          outlineWidth: 2,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      {/* 4. University Signage Banner on Front Facade */}
      <Entity
        position={signagePos}
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

      {/* 5. 3D Floating Building Tag */}
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
