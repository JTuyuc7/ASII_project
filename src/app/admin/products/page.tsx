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
import {
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';

const mockProducts = [
  {
    id: 1,
    name: 'Laptop Gaming ROG',
    category: 'Electrónicos',
    price: '$1,299.99',
    stock: 45,
    status: 'active',
    image: '/file.svg',
  },
  {
    id: 2,
    name: 'Smartphone Pro Max',
    category: 'Electrónicos',
    price: '$899.99',
    stock: 12,
    status: 'active',
    image: '/file.svg',
  },
  {
    id: 3,
    name: 'Auriculares Bluetooth',
    category: 'Accesorios',
    price: '$159.99',
    stock: 0,
    status: 'out_of_stock',
    image: '/file.svg',
  },
  {
    id: 4,
    name: 'Monitor 4K Ultra',
    category: 'Electrónicos',
    price: '$449.99',
    stock: 8,
    status: 'low_stock',
    image: '/file.svg',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green';
    case 'out_of_stock':
      return 'red';
    case 'low_stock':
      return 'orange';
    default:
      return 'gray';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'out_of_stock':
      return 'Sin Stock';
    case 'low_stock':
      return 'Stock Bajo';
    default:
      return 'Desconocido';
  }
};

export default function ProductsAdminPage() {
  const rows = mockProducts.map(product => (
    <Table.Tr key={product.id}>
      <Table.Td>
        <Group>
          <Image
            src={product.image}
            alt={product.name}
            width={50}
            height={50}
            radius="md"
          />
          <div>
            <Text fw={500}>{product.name}</Text>
            <Text size="sm" c="dimmed">
              ID: {product.id}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>{product.category}</Table.Td>
      <Table.Td>{product.price}</Table.Td>
      <Table.Td>{product.stock}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(product.status)} variant="light">
          {getStatusLabel(product.status)}
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
        <Title order={1}>Gestión de Productos</Title>
        <Button leftSection={<IconPlus size={16} />}>Agregar Producto</Button>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md">
          <TextInput
            placeholder="Buscar productos..."
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Producto</Table.Th>
              <Table.Th>Categoría</Table.Th>
              <Table.Th>Precio</Table.Th>
              <Table.Th>Stock</Table.Th>
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
