import { useState, useCallback } from 'react';
import { calculateDistanceMeters } from '../utils/distance';
import { CAMPUS_CONFIG } from '../data/campusConfig';

export interface UserLocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  isWithinCampus: boolean;
  distanceToCampusMeters: number | null;
}

export function useUserLocation() {
  const [state, setState] = useState<UserLocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
    isWithinCampus: false,
    distanceToCampusMeters: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const dist = calculateDistanceMeters(
          latitude,
          longitude,
          CAMPUS_CONFIG.latitude,
          CAMPUS_CONFIG.longitude
        );

        const isWithin = dist <= 1200; // within 1.2km of campus center

        setState({
          latitude,
          longitude,
          accuracy,
          loading: false,
          error: null,
          isWithinCampus: isWithin,
          distanceToCampusMeters: dist,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: msg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    ...state,
    requestLocation,
  };
}
