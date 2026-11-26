import React from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';

interface UserLocationProps {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
}

export const UserLocation: React.FC<UserLocationProps> = ({
  latitude,
  longitude,
  accuracy,
}) => {
  if (latitude === null || longitude === null) return null;

  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 5);

  return (
    <>
      {/* Accuracy circle if available */}
      {accuracy && accuracy > 0 && accuracy < 500 && (
        <Entity
          position={position}
          ellipse={{
            semiMajorAxis: accuracy,
            semiMinorAxis: accuracy,
            material: Cesium.Color.fromCssColorString('#38BDF8').withAlpha(0.15),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#38BDF8').withAlpha(0.6),
            outlineWidth: 1.5,
            height: 0,
          }}
        />
      )}

      {/* Pulsing Beacon / Point */}
      <Entity
        name="Your Location"
        position={position}
        point={{
          pixelSize: 14,
          color: Cesium.Color.fromCssColorString('#0284C7'),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 3,
          disableDepthTestDistance: 2500,
        }}
        label={{
          text: 'You are here',
          font: 'bold 11px Inter, sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, -14),
          disableDepthTestDistance: 2500,
        }}
      />
    </>
  );
};
