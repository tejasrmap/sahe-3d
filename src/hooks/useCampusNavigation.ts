import { useState, useCallback, useMemo } from 'react';
import { CAMPUS_BUILDINGS } from '../data/buildings';
import { CAMPUS_PATH_NETWORK } from '../data/campusPaths';
import { NavigationRoute } from '../types/campus';
import { computeCampusRoute, findClosestNode, findNodeByBuildingId } from '../utils/routing';

export interface NavigationTarget {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  nodeId: string;
}

export function useCampusNavigation() {
  const [startPoint, setStartPoint] = useState<NavigationTarget | null>(null);
  const [destination, setDestination] = useState<NavigationTarget | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Available points for dropdowns
  const availableTargets = useMemo<NavigationTarget[]>(() => {
    const list: NavigationTarget[] = [];

    // Add path nodes with proper labels
    for (const node of CAMPUS_PATH_NETWORK.nodes) {
      list.push({
        id: node.id,
        name: node.name,
        latitude: node.latitude,
        longitude: node.longitude,
        nodeId: node.id,
      });
    }

    return list;
  }, []);

  // Compute route when both start and destination are set
  const route = useMemo<NavigationRoute | null>(() => {
    if (!startPoint || !destination) return null;
    return computeCampusRoute(startPoint.nodeId, destination.nodeId);
  }, [startPoint, destination]);

  const setTargetFromBuilding = useCallback(
    (buildingId: string, isDestination = true) => {
      const bldg = CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
      if (!bldg) return;

      const node = findNodeByBuildingId(buildingId) || findClosestNode(bldg.latitude, bldg.longitude);
      const target: NavigationTarget = {
        id: bldg.id,
        name: bldg.name,
        latitude: bldg.latitude,
        longitude: bldg.longitude,
        nodeId: node.id,
      };

      if (isDestination) {
        setDestination(target);
        if (!startPoint) {
          // Default start to Main Gate if none set
          const gateNode = CAMPUS_PATH_NETWORK.nodes.find((n) => n.id === 'node-gate')!;
          setStartPoint({
            id: 'node-gate',
            name: gateNode.name,
            latitude: gateNode.latitude,
            longitude: gateNode.longitude,
            nodeId: gateNode.id,
          });
        }
        setIsNavigating(true);
      } else {
        setStartPoint(target);
      }
    },
    [startPoint]
  );

  const setTargetFromCoordinates = useCallback(
    (latitude: number, longitude: number, name = 'My Location', isStart = true) => {
      const node = findClosestNode(latitude, longitude);
      const target: NavigationTarget = {
        id: `coord-${Date.now()}`,
        name,
        latitude,
        longitude,
        nodeId: node.id,
      };

      if (isStart) {
        setStartPoint(target);
      } else {
        setDestination(target);
      }
      setIsNavigating(true);
    },
    []
  );

  const reverseRoute = useCallback(() => {
    const temp = startPoint;
    setStartPoint(destination);
    setDestination(temp);
  }, [startPoint, destination]);

  const clearRoute = useCallback(() => {
    setStartPoint(null);
    setDestination(null);
    setIsNavigating(false);
  }, []);

  return {
    startPoint,
    setStartPoint,
    destination,
    setDestination,
    route,
    isNavigating,
    setIsNavigating,
    availableTargets,
    setTargetFromBuilding,
    setTargetFromCoordinates,
    reverseRoute,
    clearRoute,
  };
}
