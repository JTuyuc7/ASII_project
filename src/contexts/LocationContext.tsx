'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

interface LocationContextType {
  location: UserLocation | null;
  error: string | null;
  isLoading: boolean;
  updateLocation: (location: UserLocation) => void;
  requestLocation: () => void;
  clearError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Default fallback location (Ciudad de Guatemala)
const DEFAULT_LOCATION: UserLocation = {
  lat: 14.556043,
  lng: -90.73313,
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Request user location on mount
  useEffect(() => {
    requestUserLocation();
  }, []);

  const requestUserLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalización no soportada por el navegador.');
      setLocation(DEFAULT_LOCATION);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      position => {
        const newLocation: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        setLocation(newLocation);
        setIsLoading(false);

        // Save to localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
      },
      err => {
        console.error('Geolocation error:', err);
        setError(err.message || 'No se pudo obtener la ubicación.');

        // Try to load from localStorage
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          try {
            setLocation(JSON.parse(savedLocation));
          } catch {
            setLocation(DEFAULT_LOCATION);
          }
        } else {
          setLocation(DEFAULT_LOCATION);
        }

        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const updateLocation = (newLocation: UserLocation) => {
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };

  const clearError = () => {
    setError(null);
  };

  const value: LocationContextType = {
    location,
    error,
    isLoading,
    updateLocation,
    requestLocation: requestUserLocation,
    clearError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

/**
 * Hook to watch location changes in real-time
 */
export function useWatchLocation() {
  const { updateLocation, clearError } = useLocation();
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      return;
    }

    const id = navigator.geolocation.watchPosition(
      position => {
        const newLocation: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        updateLocation(newLocation);
        clearError();
      },
      err => {
        console.error('Watch location error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);

    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [updateLocation, clearError]);

  return watchId;
}
