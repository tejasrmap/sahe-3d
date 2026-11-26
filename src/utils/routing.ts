import { CAMPUS_PATH_NETWORK } from '../data/campusPaths';
import { PathNode, NavigationRoute } from '../types/campus';
import { calculateDistanceMeters, estimateWalkingMinutes } from './distance';

interface GraphEdge {
  targetNodeId: string;
  weight: number;
  name?: string;
}

// Build adjacency list for Dijkstra
const adjacencyMap: Map<string, GraphEdge[]> = new Map();
const nodeMap: Map<string, PathNode> = new Map();

for (const node of CAMPUS_PATH_NETWORK.nodes) {
  nodeMap.set(node.id, node);
  adjacencyMap.set(node.id, []);
}

for (const edge of CAMPUS_PATH_NETWORK.edges) {
  const fromEdges = adjacencyMap.get(edge.from);
  const toEdges = adjacencyMap.get(edge.to);
  if (fromEdges) {
    fromEdges.push({ targetNodeId: edge.to, weight: edge.distanceMeters, name: edge.name });
  }
  if (toEdges) {
    toEdges.push({ targetNodeId: edge.from, weight: edge.distanceMeters, name: edge.name });
  }
}

/**
 * Find closest path node to given coordinates
 */
export function findClosestNode(latitude: number, longitude: number): PathNode {
  let closest = CAMPUS_PATH_NETWORK.nodes[0];
  let minDistance = Infinity;

  for (const node of CAMPUS_PATH_NETWORK.nodes) {
    const dist = calculateDistanceMeters(latitude, longitude, node.latitude, node.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = node;
    }
  }

  return closest;
}

/**
 * Find node associated with a building or POI
 */
export function findNodeByBuildingId(buildingId: string): PathNode | undefined {
  return CAMPUS_PATH_NETWORK.nodes.find((n) => n.buildingId === buildingId);
}

/**
 * Dijkstra's shortest path routing
 */
export function computeCampusRoute(
  startNodeId: string,
  endNodeId: string
): NavigationRoute | null {
  if (startNodeId === endNodeId) {
    const node = nodeMap.get(startNodeId);
    if (!node) return null;
    return {
      nodes: [node],
      coordinates: [[node.longitude, node.latitude]],
      distanceMeters: 0,
      estimatedMinutes: 0,
      steps: ['You are already at your destination.'],
    };
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; pathwayName?: string }>();
  const unvisited = new Set<string>();

  for (const node of CAMPUS_PATH_NETWORK.nodes) {
    distances.set(node.id, Infinity);
    unvisited.add(node.id);
  }

  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Find unvisited node with lowest distance
    let currentId: string | null = null;
    let minD = Infinity;
    for (const id of unvisited) {
      const d = distances.get(id) ?? Infinity;
      if (d < minD) {
        minD = d;
        currentId = id;
      }
    }

    if (!currentId || minD === Infinity) break;
    if (currentId === endNodeId) break;

    unvisited.delete(currentId);

    const neighbors = adjacencyMap.get(currentId) || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.targetNodeId)) continue;
      const alt = minD + edge.weight;
      if (alt < (distances.get(edge.targetNodeId) ?? Infinity)) {
        distances.set(edge.targetNodeId, alt);
        previous.set(edge.targetNodeId, { nodeId: currentId, pathwayName: edge.name });
      }
    }
  }

  // Check if destination is reachable
  const finalDistance = distances.get(endNodeId);
  if (!finalDistance || finalDistance === Infinity) {
    return null;
  }

  // Reconstruct path
  const pathNodeIds: string[] = [];
  const pathways: (string | undefined)[] = [];
  let curr: string | undefined = endNodeId;

  while (curr) {
    pathNodeIds.unshift(curr);
    const prev = previous.get(curr);
    if (prev) {
      pathways.unshift(prev.pathwayName);
      curr = prev.nodeId;
    } else {
      break;
    }
  }

  const resultNodes = pathNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
  const coords: [number, number][] = resultNodes.map((n) => [n.longitude, n.latitude]);

  // Generate directions steps
  const steps: string[] = [];
  steps.push(`Start from ${resultNodes[0].name}`);

  for (let i = 0; i < resultNodes.length - 1; i++) {
    const fromNode = resultNodes[i];
    const toNode = resultNodes[i + 1];
    const pathName = pathways[i] || 'Campus Walkway';
    const dist = calculateDistanceMeters(
      fromNode.latitude,
      fromNode.longitude,
      toNode.latitude,
      toNode.longitude
    );
    steps.push(`Follow ${pathName} toward ${toNode.name} (${dist}m)`);
  }

  steps.push(`Arrive at ${resultNodes[resultNodes.length - 1].name}`);

  return {
    nodes: resultNodes,
    coordinates: coords,
    distanceMeters: finalDistance,
    estimatedMinutes: estimateWalkingMinutes(finalDistance),
    steps,
  };
}
