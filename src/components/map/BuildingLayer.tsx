import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import { getAllEnrichedBuildings } from '../../data/buildingArchitecture';
import { Building } from '../../types/campus';
import { ProceduralBuilding } from '../buildings/ProceduralBuilding';
import { BuildingLOD } from '../../systems/architecture/buildingGenerator';

export type MapRenderMode = 'geographic' | 'architectural';

interface BuildingLayerProps {
  visible?: boolean;
  showLabels?: boolean;
  renderMode?: MapRenderMode;
  currentLOD?: BuildingLOD;
  selectedBuildingId?: string | null;
  hoveredBuildingId?: string | null;
  onSelectBuilding: (building: Building) => void;
  onHoverBuilding: (buildingId: string | null) => void;
}

export const BuildingLayer: React.FC<BuildingLayerProps> = ({
  visible = true,
  showLabels = true,
  renderMode = 'architectural',
  currentLOD = 'LOD3',
  selectedBuildingId,
  hoveredBuildingId,
  onSelectBuilding,
  onHoverBuilding,
}) => {
  if (!visible) return null;

  const enrichedBuildings = useMemo(() => {
    return getAllEnrichedBuildings();
  }, []);

  // ARCHITECTURAL DIGITAL TWIN MODE
  if (renderMode === 'architectural') {
    return (
      <>
        {enrichedBuildings.map((building) => {
          const isSelected = selectedBuildingId === building.id;
          const isHovered = hoveredBuildingId === building.id;

          return (
            <ProceduralBuilding
              key={building.id}
              building={building}
              lod={currentLOD}
              isSelected={isSelected}
              isHovered={isHovered}
              showLabels={showLabels}
              onClick={() => onSelectBuilding(building)}
            />
          );
        })}
      </>
    );
  }

  // GEOGRAPHIC SATELLITE MODE (Classic extruded geometry)
  return (
    <>
      {CAMPUS_BUILDINGS.map((building) => {
        const isSelected = selectedBuildingId === building.id;
        const isHovered = hoveredBuildingId === building.id;

        const flatFootprint: number[] = [];
        for (const [lon, lat] of building.footprint) {
          flatFootprint.push(lon, lat);
        }
        const positions = Cesium.Cartesian3.fromDegreesArray(flatFootprint);

        const baseColor = Cesium.Color.fromCssColorString(building.color || '#3B82F6');
        let fillColor: Cesium.Color;
        let outlineColor: Cesium.Color;

        if (isSelected) {
          fillColor = Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.85);
          outlineColor = Cesium.Color.WHITE;
        } else if (isHovered) {
          fillColor = baseColor.brighten(0.3, new Cesium.Color()).withAlpha(0.8);
          outlineColor = Cesium.Color.fromCssColorString('#10B981');
        } else {
          fillColor = baseColor.withAlpha(0.7);
          outlineColor = Cesium.Color.WHITE.withAlpha(0.4);
        }

        const centerPos = Cesium.Cartesian3.fromDegrees(
          building.longitude,
          building.latitude,
          building.height + 4
        );

        return (
          <React.Fragment key={building.id}>
            <Entity
              name={building.name}
              polygon={{
                hierarchy: new Cesium.PolygonHierarchy(positions),
                extrudedHeight: building.height,
                height: 0,
                material: fillColor,
                outline: true,
                outlineColor: outlineColor,
                outlineWidth: isSelected ? 4 : isHovered ? 3 : 1,
                shadows: Cesium.ShadowMode.ENABLED,
              }}
              onClick={() => onSelectBuilding(building)}
            />

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
                onClick={() => onSelectBuilding(building)}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
