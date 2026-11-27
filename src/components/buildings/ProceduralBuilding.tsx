import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { EnrichedBuilding } from '../../data/buildingArchitecture';
import { getOrGenerateProceduralBuilding, BuildingLOD } from '../../systems/architecture/buildingGenerator';

interface ProceduralBuildingProps {
  building: EnrichedBuilding;
  lod?: BuildingLOD;
  isSelected?: boolean;
  isHovered?: boolean;
  showLabels?: boolean;
  onClick: () => void;
}

export const ProceduralBuilding: React.FC<ProceduralBuildingProps> = ({
  building,
  lod = 'LOD3',
  isSelected = false,
  isHovered = false,
  showLabels = true,
  onClick,
}) => {
  const model = useMemo(() => {
    return getOrGenerateProceduralBuilding(building, lod);
  }, [building, lod]);

  const isCanopy = building.classification === 'covered_canopy';
  const isEntrance = building.category === 'entrance' || building.id === 'main-entrance-portal';

  const baseHeight = isCanopy ? Math.max(0, building.height - 0.5) : isEntrance ? Math.max(0, building.height - 1.8) : 0;

  // Highlight styling
  const activeWallColor = useMemo(() => {
    if (isSelected) {
      return Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.9);
    }
    if (isHovered) {
      return model.baseColor.brighten(0.3, new Cesium.Color()).withAlpha(0.95);
    }
    if (isCanopy) {
      return Cesium.Color.fromCssColorString('#475569').withAlpha(0.85);
    }
    return model.baseColor.withAlpha(0.9);
  }, [isSelected, isHovered, isCanopy, model.baseColor]);

  const activeOutlineColor = useMemo(() => {
    if (isSelected) return Cesium.Color.WHITE;
    if (isHovered) return Cesium.Color.fromCssColorString('#10B981');
    return model.outlineColor;
  }, [isSelected, isHovered, model.outlineColor]);

  return (
    <>
      {/* 1. Base Extruded Building Shell / Elevated Canopy / Entrance Arch */}
      <Entity
        name={building.name}
        polygon={{
          hierarchy: new Cesium.PolygonHierarchy(model.basePositions),
          extrudedHeight: building.height,
          height: baseHeight,
          material: activeWallColor,
          outline: true,
          outlineColor: activeOutlineColor,
          outlineWidth: isSelected ? 4 : isHovered ? 2.5 : 1,
          shadows: Cesium.ShadowMode.ENABLED,
        }}
        onClick={onClick}
      />

      {/* 2. LOD 2 & LOD 3: Multi-tier Floor Bands (Windows & Spandrels) */}
      {lod !== 'LOD1' &&
        !isCanopy &&
        !isEntrance &&
        model.floorBands.map((band, idx) => (
          <Entity
            key={`${building.id}-band-${idx}`}
            name={`${building.name} - Floor Level ${band.floorIndex + 1}`}
            polygon={{
              hierarchy: new Cesium.PolygonHierarchy(model.basePositions),
              height: band.heightStart,
              extrudedHeight: band.heightEnd,
              material: isSelected
                ? Cesium.Color.fromCssColorString('#22C55E').withAlpha(0.9)
                : band.material,
              outline: false,
              shadows: Cesium.ShadowMode.ENABLED,
            }}
            onClick={onClick}
          />
        ))}

      {/* 3. LOD 2 & LOD 3: Roof Structures (Parapet, Penthouse, HVAC, Solar Panels) */}
      {lod !== 'LOD1' &&
        !isCanopy &&
        model.roofElements.map((roofEl) => (
          <Entity
            key={roofEl.id}
            name={`${building.name} - Roof Structure`}
            polygon={{
              hierarchy: new Cesium.PolygonHierarchy(roofEl.positions),
              height: roofEl.height,
              extrudedHeight: roofEl.extrudedHeight,
              material: isSelected
                ? Cesium.Color.fromCssColorString('#10B981')
                : roofEl.material,
              outline: true,
              outlineColor: roofEl.outlineColor,
              outlineWidth: 1,
              shadows: Cesium.ShadowMode.ENABLED,
            }}
            onClick={onClick}
          />
        ))}

      {/* 4. LOD 3: Entrance Portico & Canopies */}
      {lod === 'LOD3' && !isCanopy && !isEntrance && model.entrancePortico && (
        <Entity
          key={model.entrancePortico.id}
          name={`${building.name} - Entrance Portico`}
          polygon={{
            hierarchy: new Cesium.PolygonHierarchy(model.entrancePortico.positions),
            height: model.entrancePortico.height,
            extrudedHeight: model.entrancePortico.extrudedHeight,
            material: isSelected
              ? Cesium.Color.fromCssColorString('#22C55E')
              : model.entrancePortico.material,
            outline: true,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            shadows: Cesium.ShadowMode.ENABLED,
          }}
          onClick={onClick}
        />
      )}

      {/* 5. 3D Floating Building Tag */}
      {showLabels && (
        <Entity
          position={model.centroidCartesian}
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
