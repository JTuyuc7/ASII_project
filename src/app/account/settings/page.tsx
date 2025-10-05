'use client';
import { AppSettings, useSettings } from '@/contexts/SettingsContext';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Notification,
  Paper,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
} from '@mantine/core';
import {
  IconBell,
  IconCheck,
  IconDevices,
  IconGlobe,
  IconPalette,
  IconSettings,
  IconShield,
  IconShoppingCartCheck,
} from '@tabler/icons-react';
import { useState } from 'react';
import SupplierRegistrationPage from '@/components/supplier/page';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    resetSettings,
    isLoading,
  } = useSettings();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleThemeChange = (theme: AppSettings['theme']) => {
    updateSettings({ theme });
    showNotification('success', 'Tema actualizado correctamente');
  };

  const handleLanguageChange = (language: AppSettings['language']) => {
    updateSettings({ language });
    showNotification('success', 'Idioma actualizado correctamente');
  };

  const handleCurrencyChange = (currency: AppSettings['currency']) => {
    updateSettings({ currency });
    showNotification('success', 'Moneda actualizada correctamente');
  };

  const handleNotificationChange = (
    key: keyof AppSettings['notifications'],
    value: boolean
  ) => {
    updateNotificationSettings({ [key]: value });
    showNotification('success', 'Configuración de notificaciones actualizada');
  };

  const handlePrivacyChange = (
    key: keyof AppSettings['privacy'],
    value: boolean
  ) => {
    updatePrivacySettings({ [key]: value });
    showNotification('success', 'Configuración de privacidad actualizada');
  };

  const handleResetSettings = async () => {
    setResetting(true);
    try {
      resetSettings();
      setResetModalOpen(false);
      showNotification(
        'success',
        'Configuraciones restablecidas a valores por defecto'
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showNotification('error', 'Error al restablecer configuraciones');
    } finally {
      setResetting(false);
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

      {/*<Group justify="space-between" mb="xl">*/}
      {/*  <Title order={1}>Configuración</Title>*/}
      {/*  <Button*/}
      {/*    variant="outline"*/}
      {/*    color="red"*/}
      {/*    leftSection={<IconTrash size={16} />}*/}
      {/*    onClick={() => setResetModalOpen(true)}*/}
      {/*  >*/}
      {/*    Restablecer*/}
      {/*  </Button>*/}
      {/*</Group>*/}

      <Tabs defaultValue="general" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notificaciones
          </Tabs.Tab>
          <Tabs.Tab value="privacy" leftSection={<IconShield size={16} />}>
            Privacidad
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
            Apariencia
          </Tabs.Tab>
          <Tabs.Tab
            value="prov"
            leftSection={<IconShoppingCartCheck size={16} />}
          >
            Convertirme en Proveedor
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pl="md">
          <Stack gap="md">
            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Configuración Regional
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Idioma"
                    description="Idioma de la interfaz"
                    value={settings.language}
                    onChange={value =>
                      handleLanguageChange(value as AppSettings['language'])
                    }
                    data={[
                      { value: 'es', label: 'Español' },
                      { value: 'en', label: 'English' },
                    ]}
                    leftSection={<IconGlobe size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Moneda"
                    description="Moneda para mostrar precios"
                    value={settings.currency}
                    onChange={value =>
                      handleCurrencyChange(value as AppSettings['currency'])
                    }
                    data={[
                      { value: 'GTQ', label: 'Quetzal (GTQ)' },
                      { value: 'USD', label: 'Dólar (USD)' },
                    ]}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Dispositivos
              </Text>
              <Group>
                <IconDevices size={20} />
                <div>
                  <Text size="sm">Sincronización entre dispositivos</Text>
                  <Text size="xs" c="dimmed">
                    Tus configuraciones se sincronizan automáticamente
                  </Text>
                </div>
                <Badge color="green" variant="light">
                  Activo
                </Badge>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="notifications" pl="md">
          <Stack gap="md">
            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Notificaciones por Email
              </Text>
              <Stack gap="sm">
                <Group justify="space-between">
                  <div>
                    <Text size="sm">Notificaciones por correo</Text>
                    <Text size="xs" c="dimmed">
                      Recibir notificaciones importantes por email
                    </Text>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onChange={event =>
                      handleNotificationChange(
                        'email',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text size="sm">Ofertas y promociones</Text>
                    <Text size="xs" c="dimmed">
                      Recibir emails sobre ofertas especiales
                    </Text>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onChange={event =>
                      handleNotificationChange(
                        'marketing',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>
              </Stack>
            </Paper>

            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Notificaciones Push
              </Text>
              <Stack gap="sm">
                <Group justify="space-between">
                  <div>
                    <Text size="sm">Notificaciones push</Text>
                    <Text size="xs" c="dimmed">
                      Recibir notificaciones en el navegador
                    </Text>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onChange={event =>
                      handleNotificationChange(
                        'push',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text size="sm">SMS</Text>
                    <Text size="xs" c="dimmed">
                      Recibir actualizaciones por SMS
                    </Text>
                  </div>
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={event =>
                      handleNotificationChange(
                        'sms',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="privacy" pl="md">
          <Stack gap="md">
            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Configuración de Privacidad
              </Text>
              <Stack gap="sm">
                <Group justify="space-between">
                  <div>
                    <Text size="sm">Perfil visible</Text>
                    <Text size="xs" c="dimmed">
                      Permitir que otros usuarios vean tu perfil
                    </Text>
                  </div>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onChange={event =>
                      handlePrivacyChange(
                        'profileVisible',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text size="sm">Estado en línea</Text>
                    <Text size="xs" c="dimmed">
                      Mostrar cuando estás conectado
                    </Text>
                  </div>
                  <Switch
                    checked={settings.privacy.showOnlineStatus}
                    onChange={event =>
                      handlePrivacyChange(
                        'showOnlineStatus',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>

                <Group justify="space-between">
                  <div>
                    <Text size="sm">Recopilación de datos</Text>
                    <Text size="xs" c="dimmed">
                      Permitir recopilación de datos para mejorar la experiencia
                    </Text>
                  </div>
                  <Switch
                    checked={settings.privacy.allowDataCollection}
                    onChange={event =>
                      handlePrivacyChange(
                        'allowDataCollection',
                        event.currentTarget.checked
                      )
                    }
                  />
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance" pl="md">
          <Stack gap="md">
            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Tema
              </Text>
              <Select
                label="Modo de tema"
                description="Elige cómo quieres que se vea la aplicación"
                value={settings.theme}
                onChange={value =>
                  handleThemeChange(value as AppSettings['theme'])
                }
                data={[
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Oscuro' },
                  { value: 'auto', label: 'Automático (según sistema)' },
                ]}
              />
            </Paper>

            <Paper shadow="sm" p="md">
              <Text fw={500} mb="md">
                Vista Previa de Tema
              </Text>
              <Group>
                <Card
                  shadow="sm"
                  p="sm"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor:
                      settings.theme === 'dark' ? '#1a1b1e' : '#ffffff',
                    color: settings.theme === 'dark' ? '#ffffff' : '#000000',
                  }}
                >
                  <Text size="sm">Ejemplo de tarjeta</Text>
                  <Text size="xs" c="dimmed">
                    Así se vería el contenido
                  </Text>
                </Card>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="prov" pl="md">
          <SupplierRegistrationPage />
        </Tabs.Panel>
      </Tabs>

      {/* Modal de confirmación para reset */}
      <Modal
        opened={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Restablecer Configuraciones"
      >
        <Text mb="md">
          ¿Estás seguro de que quieres restablecer todas las configuraciones a
          sus valores por defecto? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={() => setResetModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleResetSettings} loading={resetting}>
            Restablecer
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
