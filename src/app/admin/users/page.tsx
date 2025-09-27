'use client';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconBan,
  IconCheck,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';

const mockUsers = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-15',
    orders: 12,
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@email.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-12-08',
    orders: 0,
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    role: 'customer',
    status: 'banned',
    joinDate: '2024-02-20',
    orders: 5,
  },
  {
    id: 4,
    name: 'Ana Martín',
    email: 'ana.martin@email.com',
    role: 'customer',
    status: 'inactive',
    joinDate: '2024-03-10',
    orders: 3,
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'red';
    case 'customer':
      return 'blue';
    default:
      return 'gray';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'customer':
      return 'Cliente';
    default:
      return 'Desconocido';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'yellow';
    case 'banned':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'inactive':
      return 'Inactivo';
    case 'banned':
      return 'Bloqueado';
    default:
      return 'Desconocido';
  }
};

export default function UsersAdminPage() {
  const rows = mockUsers.map(user => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group>
          <Avatar color="blue" radius="xl">
            {user.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </Avatar>
          <div>
            <Text fw={500}>{user.name}</Text>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={getRoleColor(user.role)} variant="light">
          {getRoleLabel(user.role)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(user.status)} variant="light">
          {getStatusLabel(user.status)}
        </Badge>
      </Table.Td>
      <Table.Td>{user.joinDate}</Table.Td>
      <Table.Td>{user.orders}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="orange">
            <IconEdit size={16} />
          </ActionIcon>
          {user.status === 'active' ? (
            <ActionIcon variant="subtle" color="red">
              <IconBan size={16} />
            </ActionIcon>
          ) : (
            <ActionIcon variant="subtle" color="green">
              <IconCheck size={16} />
            </ActionIcon>
          )}
          <ActionIcon variant="subtle" color="red">
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Title order={1}>Gestión de Usuarios</Title>
        <Button leftSection={<IconPlus size={16} />}>Agregar Usuario</Button>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md">
          <TextInput
            placeholder="Buscar usuarios..."
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Fecha de Registro</Table.Th>
              <Table.Th>Pedidos</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
