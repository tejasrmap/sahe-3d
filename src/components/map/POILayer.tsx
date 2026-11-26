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

const getPoiHexColor = (category: POI['category']) => {
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

// Pre-compute static POI Cartesian positions and colors to eliminate GC allocations
const PRECOMPUTED_POIS = CAMPUS_POIS.map((poi) => ({
  poi,
  position: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude, 6),
  color: Cesium.Color.fromCssColorString(getPoiHexColor(poi.category)),
  labelColor: Cesium.Color.fromCssColorString('#E2E8F0'),
}));

export const POILayer: React.FC<POILayerProps> = ({
  visible = true,
  showLabels = true,
  selectedPoiId,
  onSelectPoi,
}) => {
  if (!visible) return null;

  return (
    <>
      {PRECOMPUTED_POIS.map(({ poi, position, color, labelColor }) => {
        const isSelected = selectedPoiId === poi.id;

        return (
          <React.Fragment key={poi.id}>
            {/* POI Pin Marker */}
            <Entity
              position={position}
              point={{
                pixelSize: isSelected ? 16 : 10,
                color: isSelected ? Cesium.Color.fromCssColorString('#22C55E') : color,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: isSelected ? 3 : 1.5,
                disableDepthTestDistance: 1200,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
              }}
              onClick={() => onSelectPoi(poi)}
            />

            {/* POI Floating Label */}
            {showLabels && (
              <Entity
                position={position}
                label={{
                  text: poi.name,
                  font: isSelected ? 'bold 12px Inter, sans-serif' : '11px Inter, sans-serif',
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  fillColor: isSelected ? Cesium.Color.fromCssColorString('#22C55E') : labelColor,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new Cesium.Cartesian2(0, -10),
                  disableDepthTestDistance: 1200,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1000),
                  scaleByDistance: new Cesium.NearFarScalar(50, 1.0, 1000, 0.4),
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
