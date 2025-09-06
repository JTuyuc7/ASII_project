'use client';

import { Coordinates } from '@/utils/location';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconMapPin,
  IconNavigation,
  IconRoute,
  IconZoom,
} from '@tabler/icons-react';

interface MapPlaceholderProps {
  coordinates: Coordinates;
  location: string;
  distance?: string;
  productName: string;
}

export default function MapPlaceholder({
  coordinates,
  location,
  distance,
  //productName,
}: MapPlaceholderProps) {
  const handleGetDirections = () => {
    console.log('Get directions to:', coordinates);
    // In a real app, this would open maps app or show directions
  };

  const handleViewFullMap = () => {
    console.log('View full map');
    // Open a full-screen map view
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" mb="md">
        <Title order={3}>Ubicación del Producto</Title>
        <Badge variant="light" color="brand.9">
          Ubicación Aproximada
        </Badge>
      </Group>

      {/* Map Placeholder */}
      <Paper
        h={300}
        bg="gradient-to-br from-blue-50 to-purple-50"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          borderRadius: '12px',
          border: '2px dashed #1A2A80',
          position: 'relative',
          backgroundImage: 'linear-gradient(135deg, #f5f6fd 0%, #e8eaf9 100%)',
        }}
      >
        <Stack align="center" gap="md">
          <IconMapPin size={64} color="#1A2A80" />
          <Text size="xl" fw={600} c="brand.9">
            Mapa Interactivo
          </Text>
          <Text size="sm" c="dimmed" ta="center" maw={250}>
            Ubicación aproximada del producto para proteger la privacidad del
            vendedor
          </Text>
          <Group gap="sm">
            <Badge variant="filled" color="brand.9" size="lg">
              📍 {location}
            </Badge>
            {distance && (
              <Badge variant="outline" color="secondary" size="lg">
                📏 {distance}
              </Badge>
            )}
          </Group>

          {/* Mock coordinates display */}
          <Text size="xs" c="dimmed" ta="center">
            Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
          </Text>
        </Stack>

        {/* Mock zoom controls */}
        <Box
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <Stack gap="xs">
            <Button size="xs" variant="filled" color="white" c="gray.7">
              <IconZoom size={14} />
            </Button>
            <Button size="xs" variant="filled" color="white" c="gray.7">
              +
            </Button>
            <Button size="xs" variant="filled" color="white" c="gray.7">
              -
            </Button>
          </Stack>
        </Box>
      </Paper>

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

        {distance && (
          <Group gap="xs">
            <IconRoute size={18} color="#28a745" />
            <div>
              <Text fw={500}>Distancia</Text>
              <Text size="sm" c="dimmed">
                {distance} de tu ubicación
              </Text>
            </div>
          </Group>
        )}
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
        <Button
          variant="outline"
          color="brand.9"
          leftSection={<IconMapPin size={16} />}
          onClick={handleViewFullMap}
        >
          Ver Mapa Completo
        </Button>
      </Group>

      {/* Distance calculation info */}
      <Box mt="md" p="md" bg="gray.0" style={{ borderRadius: '8px' }}>
        <Text size="sm" c="dimmed" ta="center">
          <strong>Nota:</strong> La ubicación mostrada es aproximada para
          proteger la privacidad. La distancia se calcula desde tu ubicación
          actual al área general donde se encuentra el producto.
        </Text>
      </Box>
    </Card>
  );
}
