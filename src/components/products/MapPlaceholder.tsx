'use client';

import { Coordinates } from '@/utils/location';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Text,
  Title,
} from '@mantine/core';
import {
  IconExternalLink,
  IconMapPin,
  IconNavigation,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

// Import dinámico de Mapbox (evita problemas de SSR)
let mapboxgl: typeof import('mapbox-gl') | null = null;
const loadMapbox = async () => {
  if (!mapboxgl) {
    const mod = await import('mapbox-gl');
    // @ts-expect-error (no typings)
    mapboxgl = mod.default;
  }
  return mapboxgl!;
};

interface MapPlaceholderProps {
  coordinates: Coordinates;
  location: string;
  distance?: string;
  productName: string;
}

export default function MapPlaceholder({
  coordinates,
  location,
  productName,
}: MapPlaceholderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import('mapbox-gl').Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar el mapa de Mapbox
  useEffect(() => {
    const init = async () => {
      if (!coordinates || !containerRef.current || mapRef.current) return;

      try {
        const mb = await loadMapbox();
        // @ts-expect-error (no typings)
        mb.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        const map = new mb.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [coordinates.lng, coordinates.lat],
          zoom: 14,
          pitch: 0,
          bearing: 0,
        });
        mapRef.current = map;

        // Controles
        map.addControl(new mb.NavigationControl(), 'top-right');
        map.addControl(new mb.FullscreenControl(), 'top-right');
        map.addControl(new mb.ScaleControl({ unit: 'metric' }), 'bottom-left');

        // Marcador del producto
        const el = document.createElement('div');
        el.style.width = '30px';
        el.style.height = '30px';
        el.innerHTML = '📍';
        el.style.fontSize = '30px';
        el.style.cursor = 'pointer';

        new mb.Marker({ element: el })
          .setLngLat([coordinates.lng, coordinates.lat])
          .setPopup(
            new mb.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <strong>${productName}</strong><br/>
                <small>${location}</small>
              </div>`
            )
          )
          .addTo(map);

        setIsLoading(false);

        // Limpieza
        map.on('remove', () => {
          mapRef.current = null;
        });
      } catch (err) {
        console.error('Error loading map:', err);
        setError('No se pudo cargar el mapa');
        setIsLoading(false);
      }
    };

    init();

    // Cleanup al desmontar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates, location, productName]);

  // URL para Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  const handleGetDirections = () => {
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" mb="md">
        <Title order={3}>Ubicación del Producto</Title>
        <Badge variant="light" color="brand.9">
          Ubicación del Proveedor
        </Badge>
      </Group>

      {/* Mapa Real con Mapbox */}
      <Box
        h={400}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '1rem',
          position: 'relative',
        }}
      >
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              border: '2px dashed #dee2e6',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <IconMapPin size={48} color="#6c757d" />
              <Text c="dimmed" mt="sm">
                {error}
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Lat: {coordinates.lat.toFixed(6)}, Lng:{' '}
                {coordinates.lng.toFixed(6)}
              </Text>
            </div>
          </div>
        )}
        {isLoading && !error && (
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
            Cargando mapa…
          </div>
        )}
        {!error && (
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '100%',
              display: isLoading ? 'none' : 'block',
            }}
          />
        )}
      </Box>

      {/* Location Details */}
      <Group gap="md" mb="md">
        <Group gap="xs">
          <IconMapPin size={18} color="#1A2A80" />
          <div>
            <Text fw={500}>Ubicación</Text>
            <Text size="sm" c="dimmed">
              {location}
            </Text>
          </div>
        </Group>

        {/* {distance && (
          <Group gap="xs">
            <IconRoute size={18} color="#28a745" />
            <div>
              <Text fw={500}>Distancia</Text>
              <Text size="sm" c="dimmed">
                {distance}
              </Text>
            </div>
          </Group>
        )} */}
      </Group>

      {/* Action Buttons */}
      <Group gap="sm">
        <Button
          variant="filled"
          color="brand.9"
          leftSection={<IconNavigation size={16} />}
          onClick={handleGetDirections}
        >
          Obtener Direcciones
        </Button>
        <Anchor
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Button
            variant="outline"
            color="brand.9"
            leftSection={<IconExternalLink size={16} />}
          >
            Abrir en Google Maps
          </Button>
        </Anchor>
      </Group>

      {/* Coordinates info */}
      <Box mt="md" p="md" bg="gray.0" style={{ borderRadius: '8px' }}>
        <Text size="sm" c="dimmed" ta="center">
          <strong>Coordenadas:</strong> Lat: {coordinates.lat.toFixed(6)}, Lng:{' '}
          {coordinates.lng.toFixed(6)}
        </Text>
      </Box>
    </Card>
  );
}
