'use client';
import { Order, useUserAccount } from '@/contexts/UserAccountContext';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconCheck,
  IconClock,
  IconEye,
  IconPackage,
  IconRefresh,
  IconTruck,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <IconClock size={16} />;
    case 'processing':
      return <IconPackage size={16} />;
    case 'shipped':
      return <IconTruck size={16} />;
    case 'delivered':
      return <IconCheck size={16} />;
    case 'cancelled':
      return <IconX size={16} />;
    default:
      return <IconClock size={16} />;
  }
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'processing':
      return 'blue';
    case 'shipped':
      return 'cyan';
    case 'delivered':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'Procesando';
    case 'shipped':
      return 'Enviado';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

function OrderCard({ order }: { order: Order }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={500} size="lg">
            Pedido #{order.id}
          </Text>
          <Text size="sm" c="dimmed">
            {new Date(order.date).toLocaleDateString('es-GT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </div>
        <Group>
          <Badge
            color={getStatusColor(order.status)}
            variant="light"
            leftSection={getStatusIcon(order.status)}
          >
            {getStatusText(order.status)}
          </Badge>
          <Tooltip label="Ver detalles">
            <ActionIcon
              variant="subtle"
              onClick={() => setShowDetails(!showDetails)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700} c="brand">
          Q{order.total.toFixed(2)}
        </Text>
        {order.trackingNumber && (
          <Text size="sm" c="dimmed">
            Seguimiento: {order.trackingNumber}
          </Text>
        )}
      </Group>

      {showDetails && (
        <>
          <Divider mb="md" />
          <Stack gap="sm">
            <Text fw={500}>Productos:</Text>
            {order.items.map(item => (
              <Group key={item.id} gap="md">
                <Image
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  w={50}
                  h={50}
                  radius="sm"
                />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {item.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Cantidad: {item.quantity} × Q{item.price.toFixed(2)}
                  </Text>
                </div>
                <Text size="sm" fw={500}>
                  Q{(item.price * item.quantity).toFixed(2)}
                </Text>
              </Group>
            ))}

            <Divider />

            <div>
              <Text fw={500} size="sm" mb="xs">
                Dirección de envío:
              </Text>
              <Text size="sm" c="dimmed">
                {order.shippingAddress}
              </Text>
            </div>
          </Stack>
        </>
      )}

      <Group justify="flex-end" mt="md">
        {order.status === 'delivered' && (
          <Button variant="light" size="sm">
            Reordenar
          </Button>
        )}
        {order.status === 'shipped' && (
          <Button variant="light" size="sm">
            Rastrear Pedido
          </Button>
        )}
        {order.status === 'pending' && (
          <Button variant="light" color="red" size="sm">
            Cancelar Pedido
          </Button>
        )}
      </Group>
    </Card>
  );
}

export default function OrdersPage() {
  const { orders, fetchOrders, isLoading } = useUserAccount();

  const handleRefreshOrders = () => {
    fetchOrders();
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
      <Group justify="space-between" mb="xl">
        <Title order={1}>Mis Pedidos</Title>
        <Group>
          <Button
            variant="outline"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRefreshOrders}
          >
            Actualizar
          </Button>
          <Button leftSection={<IconPackage size={16} />}>
            Realizar Nuevo Pedido
          </Button>
        </Group>
      </Group>

      {orders.length === 0 ? (
        <Paper shadow="sm" p="xl" radius="md">
          <Center>
            <Stack align="center" gap="md">
              <IconPackage size={64} stroke={1} color="gray" />
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={500} mb="xs">
                  No tienes pedidos aún
                </Text>
                <Text c="dimmed" mb="lg">
                  Cuando realices tu primer pedido, aparecerá aquí
                </Text>
                <Button>Explorar Productos</Button>
              </div>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <Stack gap="md">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Stack>
      )}

      {/* Estadísticas rápidas */}
      {orders.length > 0 && (
        <Box mt="xl">
          <Title order={3} mb="md">
            Resumen
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper shadow="sm" p="md" radius="md">
                <Text c="dimmed" size="sm">
                  Total de Pedidos
                </Text>
                <Text size="xl" fw={700}>
                  {orders.length}
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper shadow="sm" p="md" radius="md">
                <Text c="dimmed" size="sm">
                  Total Gastado
                </Text>
                <Text size="xl" fw={700} c="brand">
                  Q
                  {orders
                    .reduce((total, order) => total + order.total, 0)
                    .toFixed(2)}
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper shadow="sm" p="md" radius="md">
                <Text c="dimmed" size="sm">
                  Entregados
                </Text>
                <Text size="xl" fw={700} c="green">
                  {orders.filter(order => order.status === 'delivered').length}
                </Text>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Paper shadow="sm" p="md" radius="md">
                <Text c="dimmed" size="sm">
                  En Proceso
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {
                    orders.filter(order =>
                      ['pending', 'processing', 'shipped'].includes(
                        order.status
                      )
                    ).length
                  }
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>
      )}
    </Container>
  );
}
