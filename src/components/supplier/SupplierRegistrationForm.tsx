'use client';

import { useState } from 'react';
import {
  TextInput,
  Button,
  Stack,
  Group,
  Paper,
  Text,
  Box,
  Notification,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMapPin, IconCheck, IconX } from '@tabler/icons-react';
import LocationPickerModal from './LocationPickerModal';

interface SupplierFormData {
  telefono: string;
  direccion: string;
  nombreComercial: string;
  NIT: string;
  latitud: number;
  longitud: number;
}

interface SupplierRegistrationFormProps {
  onSubmit: (data: SupplierFormData) => void;
  isLoading?: boolean;
}

export default function SupplierRegistrationForm({
  onSubmit,
  isLoading = false,
}: SupplierRegistrationFormProps) {
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const form = useForm<SupplierFormData>({
    initialValues: {
      telefono: '',
      direccion: '',
      nombreComercial: '',
      NIT: '',
      latitud: 0,
      longitud: 0,
    },
    validate: {
      telefono: value => {
        if (!value) return 'El teléfono es requerido';
        // Guatemala phone format: +502XXXXXXXX (8 digits after +502)
        if (!/^\+502\d{8}$/.test(value)) {
          return 'Formato inválido. Use +502XXXXXXXX';
        }
        return null;
      },
      direccion: value =>
        !value || value.length < 10
          ? 'La dirección debe tener al menos 10 caracteres'
          : null,
      nombreComercial: value =>
        !value || value.length < 3
          ? 'El nombre comercial debe tener al menos 3 caracteres'
          : null,
      NIT: value => {
        if (!value) return 'El NIT es requerido';
        // Guatemala NIT format: XXXXXXX-X or XXXXXXXX-X
        if (!/^\d{7,8}-\d$/.test(value)) {
          return 'Formato inválido. Use XXXXXXX-X';
        }
        return null;
      },
      latitud: value =>
        value === 0 ? 'Por favor selecciona una ubicación en el mapa' : null,
      longitud: value =>
        value === 0 ? 'Por favor selecciona una ubicación en el mapa' : null,
    },
  });

  const handleLocationConfirm = (location: { lat: number; lng: number }) => {
    form.setFieldValue('latitud', location.lat);
    form.setFieldValue('longitud', location.lng);
    setNotification({
      type: 'success',
      message: 'Ubicación seleccionada correctamente',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (values: SupplierFormData) => {
    if (values.latitud === 0 || values.longitud === 0) {
      setNotification({
        type: 'error',
        message: 'Por favor selecciona una ubicación en el mapa',
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    onSubmit(values);
    // Reset form if needed
    form.reset();
  };

  const hasLocation = form.values.latitud !== 0 && form.values.longitud !== 0;

  return (
    <>
      {notification && (
        <Box mb="md">
          <Notification
            icon={
              notification.type === 'success' ? (
                <IconCheck size={18} />
              ) : (
                <IconX size={18} />
              )
            }
            color={notification.type === 'success' ? 'green' : 'red'}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Notification>
        </Box>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper shadow="sm" p="md">
            <Text fw={500} mb="md">
              Información del Proveedor
            </Text>
            <Stack gap="sm">
              <TextInput
                label="Nombre Comercial"
                placeholder="Ej: Comercial XYZ"
                required
                {...form.getInputProps('nombreComercial')}
              />

              <TextInput
                label="NIT"
                placeholder="Ej: 1234567-8"
                required
                description="Formato: XXXXXXX-X"
                {...form.getInputProps('NIT')}
              />

              <TextInput
                label="Teléfono"
                placeholder="Ej: +50212345678"
                required
                description="Formato: +502 seguido de 8 dígitos"
                {...form.getInputProps('telefono')}
              />

              <TextInput
                label="Dirección"
                placeholder="Ej: Ciudad de Guatemala, Zona 10"
                required
                {...form.getInputProps('direccion')}
              />
            </Stack>
          </Paper>

          <Paper shadow="sm" p="md">
            <Text fw={500} mb="md">
              Ubicación del Negocio
            </Text>
            <Stack gap="sm">
              <Group align="flex-start">
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={500} mb={4}>
                    Coordenadas GPS
                  </Text>
                  {hasLocation ? (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        Lat: {form.values.latitud.toFixed(6)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Lng: {form.values.longitud.toFixed(6)}
                      </Text>
                    </Group>
                  ) : (
                    <Text size="sm" c="red">
                      No has seleccionado una ubicación
                    </Text>
                  )}
                </Box>
                <Button
                  leftSection={<IconMapPin size={16} />}
                  onClick={() => setLocationModalOpen(true)}
                  variant={hasLocation ? 'light' : 'filled'}
                >
                  {hasLocation ? 'Cambiar Ubicación' : 'Seleccionar Ubicación'}
                </Button>
              </Group>

              {(form.errors.latitud || form.errors.longitud) && (
                <Text size="sm" c="red">
                  {form.errors.latitud || form.errors.longitud}
                </Text>
              )}

              <Text size="xs" c="dimmed">
                Selecciona la ubicación de tu negocio en el mapa. Esto ayudará a
                tus clientes a encontrarte.
              </Text>
            </Stack>
          </Paper>

          <Group justify="flex-end">
            <Button type="submit" loading={isLoading} size="md">
              Registrarse como Proveedor
            </Button>
          </Group>
        </Stack>
      </form>

      <LocationPickerModal
        opened={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onConfirm={handleLocationConfirm}
        initialLocation={
          hasLocation
            ? { lat: form.values.latitud, lng: form.values.longitud }
            : undefined
        }
      />
    </>
  );
}
