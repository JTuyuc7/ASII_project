'use client';
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconEdit, IconEye, IconSearch, IconTruck } from '@tabler/icons-react';

const mockOrders = [
  {
    id: '#001',
    customer: 'Juan Pérez',
    email: 'juan.perez@email.com',
    total: '$145.50',
    status: 'completed',
    paymentStatus: 'paid',
    date: '2024-09-20',
    items: 3,
  },
  {
    id: '#002',
    customer: 'María García',
    email: 'maria.garcia@email.com',
    total: '$89.99',
    status: 'pending',
    paymentStatus: 'pending',
    date: '2024-09-22',
    items: 1,
  },
  {
    id: '#003',
    customer: 'Carlos López',
    email: 'carlos.lopez@email.com',
    total: '$234.00',
    status: 'processing',
    paymentStatus: 'paid',
    date: '2024-09-21',
    items: 2,
  },
  {
    id: '#004',
    customer: 'Ana Martín',
    email: 'ana.martin@email.com',
    total: '$67.25',
    status: 'shipped',
    paymentStatus: 'paid',
    date: '2024-09-19',
    items: 1,
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
    case 'shipped':
      return 'teal';
    case 'cancelled':
      return 'red';
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
    case 'shipped':
      return 'Enviado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Pagado';
    case 'pending':
      return 'Pendiente';
    case 'failed':
      return 'Fallido';
    default:
      return 'Desconocido';
  }
};

export default function OrdersAdminPage() {
  const rows = mockOrders.map(order => (
    <Table.Tr key={order.id}>
      <Table.Td>
        <div>
          <Text fw={500}>{order.id}</Text>
          <Text size="sm" c="dimmed">
            {order.date}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <div>
          <Text fw={500}>{order.customer}</Text>
          <Text size="sm" c="dimmed">
            {order.email}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>{order.items}</Table.Td>
      <Table.Td>{order.total}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(order.status)} variant="light">
          {getStatusLabel(order.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getPaymentStatusColor(order.paymentStatus)}
          variant="light"
        >
          {getPaymentStatusLabel(order.paymentStatus)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue">
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="orange">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="green">
            <IconTruck size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="xl">
      <Title order={1}>Gestión de Pedidos</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md">
          <TextInput
            placeholder="Buscar pedidos..."
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filtrar por estado"
            data={[
              { value: 'all', label: 'Todos' },
              { value: 'pending', label: 'Pendiente' },
              { value: 'processing', label: 'Procesando' },
              { value: 'shipped', label: 'Enviado' },
              { value: 'completed', label: 'Completado' },
              { value: 'cancelled', label: 'Cancelado' },
            ]}
          />
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pedido</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th>Artículos</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Pago</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
