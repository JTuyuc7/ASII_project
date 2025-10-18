'use client';

import { ProductResponse } from '@/app/actions/HomeProductAction';
import { useUserAccount } from '@/contexts/UserAccountContext';
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
import {
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddToCartButton } from '../cart/AddToCartButton';

interface SearchProductCardProps {
  product: ProductResponse;
  onAddToCart?: (productId: number) => void;
}

export default function SearchProductCard({ product }: SearchProductCardProps) {
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUserAccount();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Normalizar imagenUrl a string único (usar la primera si es array)
  const productImage = Array.isArray(product.imagenUrl)
    ? product.imagenUrl[0] || 'https://placehold.co/400x200?text=Sin+Imagen'
    : product.imagenUrl || 'https://placehold.co/400x200?text=Sin+Imagen';

  // Check if product is in wishlist
  useEffect(() => {
    setIsFavorite(isInWishlist(product.id.toString()));
  }, [isInWishlist, product.id]);

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavoriteLoading(true);

    try {
      if (isFavorite) {
        await removeFromWishlist(product.id.toString());
        setIsFavorite(false);
      } else {
        await addToWishlist(product.id.toString(), {
          productId: product.id.toString(),
          name: product.nombre,
          price: parseFloat(product.precio),
          image: productImage,
          inStock: product.stock > 0,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
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
            src={productImage}
            height={200}
            alt={product.nombre}
            fallbackSrc="https://placehold.co/400x200?text=Sin+Imagen"
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

          {/* Favorite Button */}
          <Box
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          >
            <Button
              variant="filled"
              size="xs"
              color={isFavorite ? 'red' : 'white'}
              onClick={handleToggleFavorite}
              loading={isFavoriteLoading}
              styles={{
                root: {
                  backgroundColor: isFavorite
                    ? 'rgba(239, 68, 68, 0.9)'
                    : 'rgba(255, 255, 255, 0.9)',
                  color: isFavorite ? 'white' : '#666',
                  '&:hover': {
                    backgroundColor: isFavorite
                      ? 'rgba(239, 68, 68, 1)'
                      : 'rgba(255, 255, 255, 1)',
                    color: isFavorite ? 'white' : '#e74c3c',
                  },
                },
              }}
            >
              {isFavorite ? (
                <IconHeartFilled size={16} />
              ) : (
                <IconHeart size={16} />
              )}
            </Button>
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
                image: productImage,
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
