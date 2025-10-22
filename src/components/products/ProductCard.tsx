'use client';

import { useUserAccount } from '@/contexts/UserAccountContext';
import { calculateDistanceFromUser, Coordinates } from '@/utils/location';
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
  IconStar,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddToCartButton } from '../cart/AddToCartButton';

export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  condition: string;
  location: string;
  distance?: string;
  rating: number;
  reviews: number;
  image: string | string[]; // Soporta tanto string único como arreglo
  isNew: boolean;
  onSale: boolean;
  seller: string;
  coordinates: Coordinates;
  precio: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onToggleFavorite?: (productId: number) => void;
}

export default function ProductCard({
  product,
  onToggleFavorite,
}: ProductCardProps) {
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUserAccount();
  const [calculatedDistance, setCalculatedDistance] = useState<string>(
    product.distance || ''
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    setIsFavorite(isInWishlist(product.id.toString()));
  }, [isInWishlist, product.id]);

  useEffect(() => {
    const updateDistance = async () => {
      if (!product.distance) {
        setIsCalculating(true);
        try {
          const distance = await calculateDistanceFromUser(product.coordinates);
          setCalculatedDistance(distance);
        } catch (error) {
          console.error('Error calculating distance:', error);
          setCalculatedDistance('Distancia no disponible');
        } finally {
          setIsCalculating(false);
        }
      }
    };

    updateDistance();
  }, [product.coordinates, product.distance]);

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
          name: product.name,
          price: product.precio,
          image: productImage,
          inStock: true,
        });
        setIsFavorite(true);
      }

      // Call the optional callback if provided
      onToggleFavorite?.(product.id);
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Normalizar imagen a string único (usar la primera si es array)
  const productImage = Array.isArray(product.image)
    ? product.image[0] || 'https://placehold.co/400x200?text=Sin+Imagen'
    : product.image || 'https://placehold.co/400x200?text=Sin+Imagen';

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        // cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '100%',
      }}
      // onClick={handleProductClick}
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
            alt={product.name}
            fallbackSrc="https://placehold.co/400x200?text=Sin+Imagen"
          />

          {/* Badges */}
          <Box
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              gap: 8,
            }}
          >
            {product.isNew && (
              <Badge color="success" variant="filled">
                Nuevo
              </Badge>
            )}
            {product.onSale && (
              <Badge color="secondary" variant="filled">
                Oferta
              </Badge>
            )}
          </Box>

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
        <Text fw={600} size="md" lineClamp={2}>
          {product.name}
        </Text>

        {/* Condition */}
        <Text size="sm" c="dimmed">
          {product.condition}
        </Text>

        {/* Rating */}
        <Group gap="xs">
          <Group gap={2}>
            <IconStar size={16} fill="#ffd43b" color="#ffd43b" />
            <Text size="sm" fw={500}>
              {product.rating}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            ({product.reviews} reseñas)
          </Text>
        </Group>

        {/* Location */}
        <Group gap="xs">
          <IconMapPin size={16} color="#6c757d" />
          <Text size="sm" c="dimmed">
            {product.location} •{' '}
            {isCalculating
              ? 'Calculando...'
              : calculatedDistance ||
                product.distance ||
                'Distancia no disponible'}
          </Text>
        </Group>

        {/* Seller */}
        <Text size="sm" c="brand.7" fw={500}>
          {product.seller}
        </Text>

        {/* Price */}
        <Group justify="space-between" align="center">
          <div>
            <Group gap="xs" align="center">
              <Text size="xl" fw={700} c="brand.9">
                {product.precio.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text size="sm" td="line-through" c="dimmed">
                  {product.originalPrice}
                </Text>
              )}
            </Group>
          </div>
        </Group>

        {/* Actions */}
        <Group gap="xs" mt="md">
          <AddToCartButton
            product={{
              id: product.id.toString(),
              name: product.name,
              price: product.precio,
              image: productImage,
              description: `${product.condition} - ${product.seller}`,
              category: 'Auto Partes',
            }}
            size="sm"
            fullWidth
          />
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
