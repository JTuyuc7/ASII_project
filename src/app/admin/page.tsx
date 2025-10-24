'use client';
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconEdit,
  IconPackage,
  IconShoppingCart,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';

const stats = [
  {
    title: 'Usuarios Totales',
    value: '1,234',
    icon: IconUsers,
    color: 'blue',
    trend: '+12.5%',
  },
  {
    title: 'Productos',
    value: '567',
    icon: IconPackage,
    color: 'green',
    trend: '+3.2%',
  },
  {
    title: 'Pedidos Hoy',
    value: '89',
    icon: IconShoppingCart,
    color: 'orange',
    trend: '+8.1%',
  },
  {
    title: 'Ventas del Mes',
    value: '$12,345',
    icon: IconTrendingUp,
    color: 'teal',
    trend: '+15.3%',
  },
];

const recentOrders = [
  { id: '#001', customer: 'Juan Pérez', total: '$145.50', status: 'completed' },
  { id: '#002', customer: 'María García', total: '$89.99', status: 'pending' },
  {
    id: '#003',
    customer: 'Carlos López',
    total: '$234.00',
    status: 'processing',
  },
  { id: '#004', customer: 'Ana Martín', total: '$67.25', status: 'completed' },
  {
    id: '#005',
    customer: 'Luis Rodríguez',
    total: '$156.75',
    status: 'pending',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'processing':
      return 'blue';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'Procesando';
    default:
      return 'Desconocido';
  }
};

export default function AdminDashboard() {
  return (
    <Stack gap="xl">
      <Title order={1}>Dashboard</Title>

      {/* Stats Cards */}
      <Grid>
        {stats.map(stat => (
          <Grid.Col key={stat.title} span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <stat.icon
                  size={24}
                  color={`var(--mantine-color-${stat.color}-6)`}
                />
                <Badge color={stat.color} variant="light">
                  {stat.trend}
                </Badge>
              </Group>
              <Text fw={500} size="lg" mb={5}>
                {stat.value}
              </Text>
              <Text size="sm" c="dimmed">
                {stat.title}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Recent Orders */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* <Group justify="space-between" mb="md">
          <Title order={3}>Pedidos Recientes</Title>
          <Button
            variant="subtle"
            leftSection={<IconEye size={16} />}
            size="sm"
          >
            Ver todos
          </Button>
        </Group> */}

        <Stack gap="sm">
          {recentOrders.map(order => (
            <Group
              key={order.id}
              justify="space-between"
              p="sm"
              style={{
                border: '1px solid var(--mantine-color-gray-3)',
                borderRadius: 'var(--mantine-radius-md)',
              }}
            >
              <Group>
                <div>
                  <Text fw={500}>{order.id}</Text>
                  <Text size="sm" c="dimmed">
                    {order.customer}
                  </Text>
                </div>
              </Group>

              <Group>
                <Text fw={500}>{order.total}</Text>
                <Badge color={getStatusColor(order.status)} variant="light">
                  {getStatusLabel(order.status)}
                </Badge>
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={<IconEdit size={14} />}
                >
                  Editar
                </Button>
              </Group>
            </Group>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
