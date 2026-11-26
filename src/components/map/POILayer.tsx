import React from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { CAMPUS_POIS } from '../../data/pois';
import { POI } from '../../types/campus';

interface POILayerProps {
  visible?: boolean;
  showLabels?: boolean;
  selectedPoiId?: string | null;
  onSelectPoi: (poi: POI) => void;
}

export const POILayer: React.FC<POILayerProps> = ({
  visible = true,
  showLabels = true,
  selectedPoiId,
  onSelectPoi,
}) => {
  if (!visible) return null;

  const getPoiColor = (category: POI['category']) => {
    switch (category) {
      case 'entrance':
        return '#10B981'; // emerald
      case 'library':
      case 'academic':
        return '#3B82F6'; // blue
      case 'laboratory':
        return '#6366F1'; // indigo
      case 'food':
        return '#F59E0B'; // amber
      case 'sports':
        return '#14B8A6'; // teal
      case 'medical':
        return '#EF4444'; // red
      case 'hostel':
        return '#EC4899'; // pink
      case 'atm':
        return '#8B5CF6'; // purple
      case 'parking':
      default:
        return '#64748B'; // slate
    }
  };

  return (
    <>
      {CAMPUS_POIS.map((poi) => {
        const isSelected = selectedPoiId === poi.id;
        const color = Cesium.Color.fromCssColorString(getPoiColor(poi.category));
        const position = Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude, 6);

        return (
          <React.Fragment key={poi.id}>
            {/* POI Pin Marker */}
            <Entity
              position={position}
              point={{
                pixelSize: isSelected ? 16 : 10,
                color: isSelected ? Cesium.Color.fromCssColorString('#22C55E') : color,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: isSelected ? 3 : 2,
                disableDepthTestDistance: 1200,
                scaleByDistance: new Cesium.NearFarScalar(50, 1.2, 1600, 0.6),
              }}
              onClick={() => onSelectPoi(poi)}
            />

            {/* POI Text Label */}
            {showLabels && (
              <Entity
                position={Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude, 9)}
                label={{
                  text: poi.name,
                  font: '500 11px Inter, sans-serif',
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  fillColor: Cesium.Color.WHITE,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                  disableDepthTestDistance: 1200,
                  pixelOffset: new Cesium.Cartesian2(0, -8),
                  scaleByDistance: new Cesium.NearFarScalar(50, 1.0, 1200, 0.4),
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 800),
                }}
                onClick={() => onSelectPoi(poi)}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
