import React from 'react';
import * as Cesium from 'cesium';
import { Entity } from 'resium';
import { CAMPUS_PLAZAS, CAMPUS_LAWNS, CAMPUS_TREES, CAMPUS_STREETLIGHTS } from '../../data/landscaping';

interface LandscapingLayerProps {
  visible?: boolean;
}

// Pre-compute static landscaping geometries at module load time to eliminate runtime GC overhead
const PRECOMPUTED_PLAZAS = CAMPUS_PLAZAS.map((plaza) => {
  const flat: number[] = [];
  for (const [lon, lat] of plaza.coordinates) {
    flat.push(lon, lat);
  }
  return {
    id: plaza.id,
    name: plaza.name,
    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(flat)),
    material: Cesium.Color.fromCssColorString(plaza.color).withAlpha(0.85),
  };
});

const PRECOMPUTED_LAWNS = CAMPUS_LAWNS.map((lawn) => {
  const flat: number[] = [];
  for (const [lon, lat] of lawn.coordinates) {
    flat.push(lon, lat);
  }
  return {
    id: lawn.id,
    name: lawn.name,
    hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(flat)),
    material: Cesium.Color.fromCssColorString(lawn.color).withAlpha(0.9),
  };
});

const TRUNK_MATERIAL = Cesium.Color.fromCssColorString('#451A03');
const PRECOMPUTED_TREES = CAMPUS_TREES.map((tree) => {
  const scale = tree.scale || 5.0;
  const height = tree.heightMeters || 7.0;
  return {
    id: tree.id,
    name: tree.name,
    height,
    scale,
    trunkPosition: Cesium.Cartesian3.fromDegrees(tree.longitude, tree.latitude, height * 0.4),
    foliagePosition: Cesium.Cartesian3.fromDegrees(tree.longitude, tree.latitude, height * 0.85),
    foliageRadii: new Cesium.Cartesian3(scale * 0.5, scale * 0.5, height * 0.4),
    foliageMaterial: Cesium.Color.fromCssColorString(tree.color || '#15803D').withAlpha(0.92),
  };
});

const POLE_MATERIAL = Cesium.Color.fromCssColorString('#64748B');
const PRECOMPUTED_LIGHTS = CAMPUS_STREETLIGHTS.map((light) => {
  const height = light.heightMeters || 6.0;
  return {
    id: light.id,
    name: light.name,
    height,
    postPos: Cesium.Cartesian3.fromDegrees(light.longitude, light.latitude, height * 0.5),
    bulbPos: Cesium.Cartesian3.fromDegrees(light.longitude, light.latitude, height),
    bulbColor: Cesium.Color.fromCssColorString(light.color || '#FDE047'),
  };
});

export const LandscapingLayer: React.FC<LandscapingLayerProps> = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <>
      {/* 1. Campus Paved Gathering Plazas */}
      {PRECOMPUTED_PLAZAS.map((plaza) => (
        <Entity
          key={plaza.id}
          name={plaza.name}
          polygon={{
            hierarchy: plaza.hierarchy,
            material: plaza.material,
            classificationType: Cesium.ClassificationType.TERRAIN,
          }}
        />
      ))}

      {/* 2. Campus Lawns & Athletic Turf */}
      {PRECOMPUTED_LAWNS.map((lawn) => (
        <Entity
          key={lawn.id}
          name={lawn.name}
          polygon={{
            hierarchy: lawn.hierarchy,
            material: lawn.material,
            classificationType: Cesium.ClassificationType.TERRAIN,
          }}
        />
      ))}

      {/* 3. Avenue & Garden Trees (Spherical Foliage + Trunk) */}
      {PRECOMPUTED_TREES.map((tree) => (
        <React.Fragment key={tree.id}>
          {/* Trunk */}
          <Entity
            name={`${tree.name} (Trunk)`}
            position={tree.trunkPosition}
            cylinder={{
              length: tree.height * 0.8,
              topRadius: 0.25,
              bottomRadius: 0.4,
              material: TRUNK_MATERIAL,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 800),
            }}
          />

          {/* Tree Foliage Canopy */}
          <Entity
            name={tree.name}
            position={tree.foliagePosition}
            ellipsoid={{
              radii: tree.foliageRadii,
              material: tree.foliageMaterial,
              outline: false,
              shadows: Cesium.ShadowMode.ENABLED,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1200),
            }}
          />
        </React.Fragment>
      ))}

      {/* 4. Streetlight Luminaires */}
      {PRECOMPUTED_LIGHTS.map((light) => (
        <React.Fragment key={light.id}>
          {/* Steel Pole */}
          <Entity
            name={light.name}
            position={light.postPos}
            cylinder={{
              length: light.height,
              topRadius: 0.08,
              bottomRadius: 0.12,
              material: POLE_MATERIAL,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 600),
            }}
          />
          {/* Emissive Luminaire Head */}
          <Entity
            position={light.bulbPos}
            point={{
              pixelSize: 6,
              color: light.bulbColor,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 1,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 800),
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
};
