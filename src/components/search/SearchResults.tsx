'use client';

import { ProductResponse } from '@/app/actions/HomeProductAction';
import {
  Avatar,
  Badge,
  Card,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconMapPin, IconShoppingBag } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface SearchResultsProps {
  products: ProductResponse[];
  loading?: boolean;
  onProductClick?: (productId: number) => void;
  maxResults?: number;
}

export default function SearchResults({
  products,
  loading = false,
  onProductClick,
  maxResults = 5,
}: SearchResultsProps) {
  const router = useRouter();

  const handleProductClick = (product: ProductResponse) => {
    if (onProductClick) {
      onProductClick(product.id);
    } else {
      // Default navigation to product details
      router.push(`/product/${product.id}`);
    }
  };

  const displayedProducts = products.slice(0, maxResults);

  if (loading) {
    return (
      <Paper shadow="md" p="md" style={{ maxHeight: 400, overflowY: 'auto' }}>
        <Stack gap="xs">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} padding="sm" radius="md" withBorder>
              <Group gap="md">
                <div
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#f1f3f4',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text size="xs" c="dimmed">
                    Cargando...
                  </Text>
                </div>
                <Stack gap={4} style={{ flex: 1 }}>
                  <div
                    style={{
                      height: 16,
                      backgroundColor: '#f1f3f4',
                      borderRadius: 4,
                      width: '80%',
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      backgroundColor: '#f1f3f4',
                      borderRadius: 4,
                      width: '60%',
                    }}
                  />
                </Stack>
              </Group>
            </Card>
          ))}
        </Stack>
      </Paper>
    );
  }

  if (products.length === 0) {
    return (
      <Paper shadow="md" p="md">
        <Text ta="center" c="dimmed" size="sm">
          No se encontraron productos
        </Text>
      </Paper>
    );
  }

  return (
    <Paper shadow="md" p="xs" style={{ maxHeight: 400, overflowY: 'auto' }}>
      <Stack gap="xs">
        {displayedProducts.map(product => (
          <UnstyledButton
            key={product.id}
            onClick={() => handleProductClick(product)}
            style={{ width: '100%' }}
          >
            <Card
              padding="sm"
              radius="md"
              withBorder
              style={{
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              className="search-result-card"
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    borderColor: '#1A2A80',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                },
              }}
            >
              <Group gap="md" align="flex-start">
                {/* Product Image */}
                <Image
                  src={product.imagenUrl}
                  alt={product.nombre}
                  w={60}
                  h={60}
                  radius="md"
                  fit="cover"
                  fallbackSrc="https://placehold.co/60x60?text=Producto"
                />

                {/* Product Details */}
                <Stack gap={4} style={{ flex: 1 }}>
                  <Group justify="space-between" align="flex-start">
                    <Text
                      size="sm"
                      fw={500}
                      lineClamp={1}
                      style={{ maxWidth: '70%' }}
                    >
                      {product.nombre}
                    </Text>
                    <Badge
                      size="sm"
                      variant="light"
                      color={product.stock > 0 ? 'green' : 'red'}
                    >
                      {product.stock > 0 ? 'Disponible' : 'Agotado'}
                    </Badge>
                  </Group>

                  <Text size="lg" fw={700} c="brand.9">
                    Q{' '}
                    {parseFloat(product.precio).toLocaleString('es-GT', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>

                  <Badge size="xs" variant="dot" color="blue">
                    {getCategoryLabel(product.categoria)}
                  </Badge>

                  {/* Supplier Info */}
                  <Group gap="xs" mt={2}>
                    <Avatar size="xs" color="brand.6">
                      <IconShoppingBag size={12} />
                    </Avatar>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {product.proveedor.nombreComercial}
                    </Text>
                    <Group gap={2}>
                      <IconMapPin size={10} color="gray" />
                      <Text size="xs" c="dimmed">
                        {product.proveedor.direccion.length > 20
                          ? `${product.proveedor.direccion.substring(0, 20)}...`
                          : product.proveedor.direccion}
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </Group>
            </Card>
          </UnstyledButton>
        ))}

        {products.length > maxResults && (
          <Text ta="center" size="xs" c="dimmed" pt="xs">
            Mostrando {maxResults} de {products.length} resultados
          </Text>
        )}
      </Stack>
    </Paper>
  );
}

// Helper function to get category label
function getCategoryLabel(categoria: string): string {
  const categories: Record<string, string> = {
    motor: 'Motor',
    transmision: 'Transmisión',
    suspension: 'Suspensión',
    frenos: 'Frenos',
    electrico: 'Sistema Eléctrico',
    carroceria: 'Carrocería',
    interior: 'Interior',
    neumaticos: 'Neumáticos',
    aceites: 'Aceites y Lubricantes',
    filtros: 'Filtros',
    otros: 'Otros',
  };

  return categories[categoria] || categoria;
}
