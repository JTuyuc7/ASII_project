'use client';
import {
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import {
  IconCreditCard,
  IconDeviceFloppy,
  IconMail,
  IconSettings,
  IconTruck,
} from '@tabler/icons-react';

export default function SettingsAdminPage() {
  return (
    <Stack gap="xl">
      <Title order={1}>Configuración del Sistema</Title>

      <Grid>
        {/* General Settings */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconSettings size={20} />
              <Title order={3}>Configuración General</Title>
            </Group>

            <Stack gap="md">
              <TextInput
                label="Nombre de la Tienda"
                placeholder="Mi E-commerce"
                defaultValue="TechStore Pro"
              />
              <Textarea
                label="Descripción"
                placeholder="Descripción de tu tienda"
                defaultValue="La mejor tienda de tecnología online"
                minRows={3}
              />
              <TextInput
                label="URL del Sitio"
                placeholder="https://mitienda.com"
                defaultValue="https://techstore.com"
              />
              <Select
                label="Moneda"
                placeholder="Selecciona moneda"
                defaultValue="USD"
                data={[
                  { value: 'USD', label: 'Dólar (USD)' },
                  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
                  { value: 'EUR', label: 'Euro (EUR)' },
                ]}
              />
            </Stack>
          </Card>
        </Grid.Col>

        {/* Email Settings */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconMail size={20} />
              <Title order={3}>Configuración de Email</Title>
            </Group>

            <Stack gap="md">
              <TextInput
                label="Servidor SMTP"
                placeholder="smtp.gmail.com"
                defaultValue="smtp.techstore.com"
              />
              <NumberInput
                label="Puerto SMTP"
                placeholder="587"
                defaultValue={587}
              />
              <TextInput
                label="Email del Remitente"
                placeholder="admin@tienda.com"
                defaultValue="admin@techstore.com"
              />
              <Switch
                label="Activar notificaciones por email"
                description="Enviar emails de confirmación y notificaciones"
                defaultChecked
              />
            </Stack>
          </Card>
        </Grid.Col>

        {/* Payment Settings */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconCreditCard size={20} />
              <Title order={3}>Configuración de Pagos</Title>
            </Group>

            <Stack gap="md">
              <Switch
                label="PayPal"
                description="Activar pagos con PayPal"
                defaultChecked
              />
              <Switch
                label="Stripe"
                description="Activar pagos con Stripe"
                defaultChecked
              />
              <Switch
                label="Transferencia Bancaria"
                description="Permitir pagos por transferencia"
              />
              <NumberInput
                label="Impuesto (%)"
                placeholder="16"
                defaultValue={16}
                min={0}
                max={100}
              />
            </Stack>
          </Card>
        </Grid.Col>

        {/* Shipping Settings */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconTruck size={20} />
              <Title order={3}>Configuración de Envío</Title>
            </Group>

            <Stack gap="md">
              <NumberInput
                label="Costo de Envío Estándar"
                placeholder="50"
                defaultValue={50}
                leftSection="$"
              />
              <NumberInput
                label="Envío Gratuito a Partir de"
                placeholder="500"
                defaultValue={500}
                leftSection="$"
              />
              <NumberInput
                label="Tiempo de Procesamiento (días)"
                placeholder="2"
                defaultValue={2}
                min={1}
                max={30}
              />
              <Switch
                label="Envío Express"
                description="Activar opción de envío express"
                defaultChecked
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Features Settings */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Características del Sitio
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Stack gap="sm">
              <Switch
                label="Registro de Usuarios"
                description="Permitir que los usuarios se registren"
                defaultChecked
              />
              <Switch
                label="Lista de Deseos"
                description="Activar funcionalidad de lista de deseos"
                defaultChecked
              />
              <Switch
                label="Reseñas de Productos"
                description="Permitir reseñas y calificaciones"
                defaultChecked
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Stack gap="sm">
              <Switch
                label="Comparar Productos"
                description="Función para comparar productos"
              />
              <Switch
                label="Cupones de Descuento"
                description="Sistema de cupones y descuentos"
                defaultChecked
              />
              <Switch
                label="Programa de Puntos"
                description="Sistema de puntos por compras"
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <Stack gap="sm">
              <Switch
                label="Chat en Vivo"
                description="Soporte de chat en tiempo real"
              />
              <Switch
                label="Modo Mantenimiento"
                description="Activar modo mantenimiento del sitio"
              />
              <Switch
                label="Analytics"
                description="Seguimiento y análisis de usuarios"
                defaultChecked
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Save Button */}
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          size="lg"
          color="orange"
        >
          Guardar Configuración
        </Button>
      </Group>
    </Stack>
  );
}
