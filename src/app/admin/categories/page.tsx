'use client';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';

const mockCategories = [
  {
    id: 1,
    name: 'Electrónicos',
    description: 'Dispositivos electrónicos y gadgets',
    products: 45,
    status: 'active',
    image: '/file.svg',
    parent: null,
  },
  {
    id: 2,
    name: 'Computadoras',
    description: 'Laptops, desktops y accesorios',
    products: 23,
    status: 'active',
    image: '/file.svg',
    parent: 'Electrónicos',
  },
  {
    id: 3,
    name: 'Smartphones',
    description: 'Teléfonos inteligentes y accesorios',
    products: 18,
    status: 'active',
    image: '/file.svg',
    parent: 'Electrónicos',
  },
  {
    id: 4,
    name: 'Ropa',
    description: 'Vestimenta y accesorios de moda',
    products: 67,
    status: 'active',
    image: '/file.svg',
    parent: null,
  },
  {
    id: 5,
    name: 'Deportes',
    description: 'Artículos deportivos y fitness',
    products: 12,
    status: 'inactive',
    image: '/file.svg',
    parent: null,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'gray';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activa';
    case 'inactive':
      return 'Inactiva';
    default:
      return 'Desconocida';
  }
};

export default function CategoriesAdminPage() {
  const rows = mockCategories.map(category => (
    <Table.Tr key={category.id}>
      <Table.Td>
        <Group>
          <Image
            src={category.image}
            alt={category.name}
            width={40}
            height={40}
            radius="md"
          />
          <div>
            <Text fw={500}>{category.name}</Text>
            <Text size="sm" c="dimmed">
              {category.description}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        {category.parent ? (
          <Badge variant="light" color="blue">
            {category.parent}
          </Badge>
        ) : (
          <Badge variant="light" color="gray">
            Principal
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{category.products}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(category.status)} variant="light">
          {getStatusLabel(category.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="orange">
            <IconEdit size={16} />
          </ActionIcon>
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
        <Title order={1}>Gestión de Categorías</Title>
        <Button leftSection={<IconPlus size={16} />}>Agregar Categoría</Button>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md">
          <TextInput
            placeholder="Buscar categorías..."
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Categoría</Table.Th>
              <Table.Th>Padre</Table.Th>
              <Table.Th>Productos</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
