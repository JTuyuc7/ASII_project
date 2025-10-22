'use client';

import { Box, Button, Group, Modal, Text } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';

let mapboxgl: typeof import('mapbox-gl') | null = null;
const loadMapbox = async () => {
  if (!mapboxgl) {
    const mod = await import('mapbox-gl');
    // @ts-expect-error (no typings)
    mapboxgl = mod.default;
  }
  return mapboxgl!;
};

type LatLng = { lat: number; lng: number };

interface LocationPickerModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (location: LatLng) => void;
  initialLocation?: LatLng;
}

export default function LocationPickerModal({
  opened,
  onClose,
  onConfirm,
  initialLocation,
}: LocationPickerModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import('mapbox-gl').Map | null>(null);
  const markerRef = useRef<import('mapbox-gl').Marker | null>(null);

  // Fallback: Ciudad de Guatemala
  const fallback: LatLng = { lat: 14.556043, lng: -90.73313 };

  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    initialLocation || null
  );
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);

  // Get user's current location
  useEffect(() => {
    if (!opened) return;

    // Increment map key to force recreation
    setMapKey(prev => prev + 1);

    if (!('geolocation' in navigator)) {
      setError('Geolocalización no soportada por el navegador.');
      setUserLocation(fallback);
      if (!selectedLocation) {
        setSelectedLocation(fallback);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        if (!selectedLocation) {
          setSelectedLocation(loc);
        }
      },
      err => {
        setError(err.message || 'No se pudo obtener la ubicación.');
        setUserLocation(fallback);
        if (!selectedLocation) {
          setSelectedLocation(fallback);
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  // Initialize map
  useEffect(() => {
    if (!opened || !selectedLocation || !containerRef.current) return;

    const init = async () => {
      if (!containerRef.current) return;

      const mb = await loadMapbox();
      // @ts-expect-error (no typings)
      mb.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

      const map = new mb.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [selectedLocation.lng, selectedLocation.lat],
        zoom: 14,
        pitch: 0,
        bearing: 0,
      });
      mapRef.current = map;

      // Add controls
      map.addControl(new mb.NavigationControl(), 'top-right');
      map.addControl(new mb.FullscreenControl(), 'top-right');

      // Create draggable marker
      const el = document.createElement('div');
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.cursor = 'pointer';
      el.innerHTML = '📍';
      el.style.fontSize = '30px';

      const marker = new mb.Marker({ element: el, draggable: true })
        .setLngLat([selectedLocation.lng, selectedLocation.lat])
        .addTo(map);

      markerRef.current = marker;

      // Update location when marker is dragged
      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
      });

      // Click on map to move marker
      map.on('click', e => {
        marker.setLngLat(e.lngLat);
        setSelectedLocation({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      });
    };

    init();

    // Cleanup when component unmounts or mapKey changes
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapKey, selectedLocation]);

  // Cleanup map when modal closes
  useEffect(() => {
    if (!opened) {
      // Destroy map when modal closes
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, [opened]);

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      onClose();
    }
  };

  const handleUseCurrentLocation = useCallback(() => {
    if (userLocation) {
      setSelectedLocation(userLocation);
      if (mapRef.current && markerRef.current) {
        mapRef.current.flyTo({
          center: [userLocation.lng, userLocation.lat],
          zoom: 14,
        });
        markerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      }
    }
  }, [userLocation]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Selecciona tu ubicación"
      size="lg"
      padding="md"
    >
      <Box mb="md">
        <Text size="sm" c="dimmed" mb="xs">
          Arrastra el marcador 📍 o haz clic en el mapa para seleccionar tu
          ubicación
        </Text>
        {error && (
          <Text size="xs" c="red" mb="xs">
            {error}
          </Text>
        )}
        {selectedLocation && (
          <Text size="xs" c="dimmed">
            Ubicación: {selectedLocation.lat.toFixed(6)},{' '}
            {selectedLocation.lng.toFixed(6)}
          </Text>
        )}
      </Box>

      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        {!selectedLocation ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontSize: 18,
              color: '#666',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            Obteniendo tu ubicación…
          </div>
        ) : (
          <div
            ref={containerRef}
            className="mapboxgl-map-styles-supplier"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          />
        )}
      </div>

      <Group justify="space-between" mt="md">
        <Button
          variant="light"
          leftSection={<IconMapPin size={16} />}
          onClick={handleUseCurrentLocation}
          disabled={!userLocation}
        >
          Ver mi ubicación actual
        </Button>
        <Group>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedLocation}>
            Confirmar Ubicación
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
