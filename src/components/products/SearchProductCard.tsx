'use client';

import { ProductResponse } from '@/app/actions/HomeProductAction';
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';
import { IconMapPin, IconShoppingBag } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { AddToCartButton } from '../cart/AddToCartButton';

interface SearchProductCardProps {
  product: ProductResponse;
  onAddToCart?: (productId: number) => void;
}

export default function SearchProductCard({ product }: SearchProductCardProps) {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  // Get category label
  const getCategoryLabel = (categoria: string) => {
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
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        transition: 'all 0.2s ease',
        height: '100%',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(26, 42, 128, 0.15)',
          },
        },
      }}
    >
      <Card.Section>
        <Box style={{ position: 'relative' }}>
          <Image
            src={product.imagenUrl}
            height={200}
            alt={product.nombre}
            fallbackSrc="https://placehold.co/400x200?text=Producto"
          />

          {/* Stock Badge */}
          <Box
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
            }}
          >
            <Badge color={product.stock > 0 ? 'green' : 'red'} variant="filled">
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
            </Badge>
          </Box>
        </Box>
      </Card.Section>

      <Stack gap="xs" mt="md" style={{ flex: 1 }}>
        {/* Product Name */}
        <Text fw={600} size="md" lineClamp={2} title={product.nombre}>
          {product.nombre}
        </Text>

        {/* Category */}
        <Badge size="sm" variant="dot" color="blue">
          {getCategoryLabel(product.categoria)}
        </Badge>

        {/* Description */}
        <Text size="sm" c="dimmed" lineClamp={2}>
          {product.descripcion}
        </Text>

        {/* Supplier Info */}
        <Group gap="xs" mt="sm">
          <IconShoppingBag size={16} color="#6c757d" />
          <Text size="sm" fw={500} c="brand.7">
            {product.proveedor.nombreComercial}
          </Text>
        </Group>

        {/* Location */}
        <Group gap="xs">
          <IconMapPin size={16} color="#6c757d" />
          <Text size="sm" c="dimmed" lineClamp={1}>
            {product.proveedor.direccion}
          </Text>
        </Group>

        {/* Contact Info */}
        {product.proveedor.telefono && (
          <Text size="sm" c="dimmed">
            Tel: {product.proveedor.telefono}
          </Text>
        )}

        {/* Price */}
        <Group justify="space-between" align="center" mt="md">
          <Text size="xl" fw={700} c="brand.9">
            Q{' '}
            {parseFloat(product.precio).toLocaleString('es-GT', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </Group>

        {/* Actions */}
        <Group gap="xs" mt="md">
          {product.stock > 0 ? (
            <AddToCartButton
              product={{
                id: product.id.toString(),
                name: product.nombre,
                price: parseFloat(product.precio),
                image: product.imagenUrl,
                description: product.descripcion,
                category: getCategoryLabel(product.categoria),
              }}
              size="sm"
              fullWidth
            />
          ) : (
            <Button size="sm" fullWidth disabled color="gray">
              Sin Stock
            </Button>
          )}
          <Button
            w={'100%'}
            variant="outline"
            color="brand.9"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              handleProductClick();
            }}
          >
            Ver Detalles
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
