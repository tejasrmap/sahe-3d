import React, { useMemo } from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { CAMPUS_PLAZAS, CAMPUS_LAWNS, CAMPUS_TREES, CAMPUS_STREETLIGHTS } from '../../data/landscaping';

interface LandscapingLayerProps {
  visible?: boolean;
}

export const LandscapingLayer: React.FC<LandscapingLayerProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <>
      {/* 1. Campus Paved Gathering Plazas */}
      {CAMPUS_PLAZAS.map((plaza) => {
        const flat: number[] = [];
        for (const [lon, lat] of plaza.coordinates) {
          flat.push(lon, lat);
        }
        return (
          <Entity
            key={plaza.id}
            name={plaza.name}
            polygon={{
              hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(flat)),
              material: Cesium.Color.fromCssColorString(plaza.color).withAlpha(0.25),
              classificationType: Cesium.ClassificationType.TERRAIN,
            }}
          />
        );
      })}

      {/* 2. Campus Lawns & Athletic Turf */}
      {CAMPUS_LAWNS.map((lawn) => {
        const flat: number[] = [];
        for (const [lon, lat] of lawn.coordinates) {
          flat.push(lon, lat);
        }
        // Use gentle transparent overlay so real satellite texture and running track markings remain sharp
        const isTurf = lawn.category === 'athletic-turf';
        const alpha = isTurf ? 0.15 : 0.22;
        return (
          <Entity
            key={lawn.id}
            name={lawn.name}
            polygon={{
              hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(flat)),
              material: Cesium.Color.fromCssColorString(lawn.color).withAlpha(alpha),
              classificationType: Cesium.ClassificationType.TERRAIN,
            }}
          />
        );
      })}

      {/* 3. Avenue & Garden Trees (Spherical Foliage + Trunk) */}
      {CAMPUS_TREES.map((tree) => {
        const scale = tree.scale || 5.0;
        const height = tree.heightMeters || 7.0;
        const trunkPosition = Cesium.Cartesian3.fromDegrees(tree.longitude, tree.latitude, height * 0.4);
        const foliagePosition = Cesium.Cartesian3.fromDegrees(tree.longitude, tree.latitude, height * 0.85);

        return (
          <React.Fragment key={tree.id}>
            {/* Trunk */}
            <Entity
              name={`${tree.name} (Trunk)`}
              position={trunkPosition}
              cylinder={{
                length: height * 0.8,
                topRadius: 0.25,
                bottomRadius: 0.4,
                material: Cesium.Color.fromCssColorString('#451A03'), // dark wood trunk
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 800),
              }}
            />

            {/* Tree Foliage Canopy */}
            <Entity
              name={tree.name}
              position={foliagePosition}
              ellipsoid={{
                radii: new Cesium.Cartesian3(scale * 0.5, scale * 0.5, height * 0.4),
                material: Cesium.Color.fromCssColorString(tree.color || '#15803D').withAlpha(0.92),
                outline: false,
                shadows: Cesium.ShadowMode.ENABLED,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1200),
              }}
            />
          </React.Fragment>
        );
      })}

      {/* 4. Streetlight Luminaires */}
      {CAMPUS_STREETLIGHTS.map((light) => {
        const height = light.heightMeters || 6.0;
        const postPos = Cesium.Cartesian3.fromDegrees(light.longitude, light.latitude, height * 0.5);
        const bulbPos = Cesium.Cartesian3.fromDegrees(light.longitude, light.latitude, height);

        return (
          <React.Fragment key={light.id}>
            {/* Steel Pole */}
            <Entity
              name={light.name}
              position={postPos}
              cylinder={{
                length: height,
                topRadius: 0.08,
                bottomRadius: 0.12,
                material: Cesium.Color.fromCssColorString('#64748B'),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 600),
              }}
            />
            {/* Emissive Luminaire Head */}
            <Entity
              position={bulbPos}
              point={{
                pixelSize: 6,
                color: Cesium.Color.fromCssColorString(light.color || '#FDE047'),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 1,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 800),
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
