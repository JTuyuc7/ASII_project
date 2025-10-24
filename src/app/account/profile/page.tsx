'use client';
import { useUserAccount } from '@/contexts/UserAccountContext';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Notification,
  Paper,
  Select,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCheck,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';

export default function ProfilePage() {
  const {
    profile,
    updateProfile,
    updateAddress,
    updatePreferences,
    isLoading,
  } = useUserAccount();
  // const { settings } = useSettings();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const profileForm = useForm({
    initialValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    },
  });

  const addressForm = useForm({
    initialValues: {
      street: profile?.address?.street || '',
      city: profile?.address?.city || '',
      state: profile?.address?.state || '',
      zipCode: profile?.address?.zipCode || '',
      country: profile?.address?.country || 'Guatemala',
    },
  });

  const preferencesForm = useForm({
    initialValues: {
      newsletter: profile?.preferences?.newsletter || false,
      promotions: profile?.preferences?.promotions || false,
      language: profile?.preferences?.language || 'es',
    },
  });

  const handleProfileSubmit = async (values: typeof profileForm.values) => {
    try {
      await updateProfile(values);
      setNotification({
        type: 'success',
        message: 'Perfil actualizado correctamente',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.log(error);
      setNotification({
        type: 'error',
        message: 'Error al actualizar el perfil',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddressSubmit = async (values: typeof addressForm.values) => {
    try {
      await updateAddress(values);
      setNotification({
        type: 'success',
        message: 'Dirección actualizada correctamente',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.log(error);
      setNotification({
        type: 'error',
        message: 'Error al actualizar la dirección',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handlePreferencesSubmit = async (
    values: typeof preferencesForm.values
  ) => {
    try {
      await updatePreferences(values);
      setNotification({
        type: 'success',
        message: 'Preferencias actualizadas correctamente.',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.log(error);
      setNotification({
        type: 'error',
        message: 'Error al actualizar las preferencias',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <LoadingOverlay visible />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      {notification && (
        <Box mb="md">
          <Notification
            icon={
              notification.type === 'success' ? (
                <IconCheck size={18} />
              ) : undefined
            }
            color={notification.type === 'success' ? 'green' : 'red'}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Notification>
        </Box>
      )}

      <Title order={1} mb="xl">
        Mi Cuenta
      </Title>

      <Grid>
        {/* Información del Perfil */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md">
            <Group mb="md">
              <Avatar size={60} radius="xl">
                <IconUser size={30} />
              </Avatar>
              <div>
                <Text fw={500}>Información Personal</Text>
                <Text size="sm" c="dimmed">
                  Actualiza tu información básica
                </Text>
              </div>
            </Group>

            <form onSubmit={profileForm.onSubmit(handleProfileSubmit)}>
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Nombre"
                    placeholder="Tu nombre"
                    {...profileForm.getInputProps('firstName')}
                    leftSection={<IconUser size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Apellido"
                    placeholder="Tu apellido"
                    {...profileForm.getInputProps('lastName')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                    {...profileForm.getInputProps('email')}
                    leftSection={<IconMail size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Teléfono"
                    placeholder="+502 1234-5678"
                    {...profileForm.getInputProps('phone')}
                    leftSection={<IconPhone size={16} />}
                  />
                </Grid.Col>
              </Grid>

              <Button type="submit" mt="md" fullWidth>
                Actualizar Perfil
              </Button>
            </form>
          </Paper>
        </Grid.Col>

        {/* Dirección */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="md">
            <Group mb="md">
              <IconMapPin size={24} />
              <div>
                <Text fw={500}>Dirección</Text>
                <Text size="sm" c="dimmed">
                  Tu dirección de envío principal
                </Text>
              </div>
            </Group>

            <form onSubmit={addressForm.onSubmit(handleAddressSubmit)}>
              <Grid>
                <Grid.Col span={12}>
                  <Textarea
                    label="Dirección"
                    placeholder="Calle, número, colonia"
                    {...addressForm.getInputProps('street')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Ciudad"
                    placeholder="Guatemala"
                    {...addressForm.getInputProps('city')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Departamento"
                    placeholder="Guatemala"
                    {...addressForm.getInputProps('state')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Código Postal"
                    placeholder="01001"
                    {...addressForm.getInputProps('zipCode')}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="País"
                    data={[{ value: 'Guatemala', label: 'Guatemala' }]}
                    {...addressForm.getInputProps('country')}
                  />
                </Grid.Col>
              </Grid>

              <Button type="submit" mt="md" fullWidth>
                Actualizar Dirección
              </Button>
            </form>
          </Paper>
        </Grid.Col>

        {/* Preferencias */}
        <Grid.Col span={12}>
          <Paper shadow="sm" p="md">
            <Text fw={500} mb="md">
              Preferencias de Comunicación
            </Text>

            <form onSubmit={preferencesForm.onSubmit(handlePreferencesSubmit)}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Switch
                    label="Newsletter"
                    description="Recibir noticias y actualizaciones"
                    {...preferencesForm.getInputProps('newsletter', {
                      type: 'checkbox',
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Switch
                    label="Promociones"
                    description="Recibir ofertas especiales"
                    {...preferencesForm.getInputProps('promotions', {
                      type: 'checkbox',
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Idioma Preferido"
                    data={[
                      { value: 'es', label: 'Español' },
                      { value: 'en', label: 'English' },
                    ]}
                    {...preferencesForm.getInputProps('language')}
                  />
                </Grid.Col>
              </Grid>

              <Button type="submit" mt="md">
                Guardar Preferencias
              </Button>
            </form>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
