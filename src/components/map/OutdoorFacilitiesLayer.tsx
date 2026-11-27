import React from 'react';
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
                text: facility.optionalOverlay ? `${facility.name} (Approx.)` : facility.name,
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
