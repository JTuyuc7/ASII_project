'use client';

import { getProductsAction } from '@/app/actions/HomeProductAction';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { useLocation } from '@/contexts/LocationContext';
import { transformProductsResponse } from '@/utils/productTransformers';
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function OutstandingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user location from context
  const { location: userLocation } = useLocation();

  useEffect(() => {
    loadProducts();
  }, [userLocation]); // Reload when user location changes

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getProductsAction();

      if (result.success && result.data) {
        // Transform API data to Product format with distance calculation
        const transformedProducts = transformProductsResponse(
          result.data,
          userLocation
        );
        // Show only first 8 products for "outstanding" section
        setProducts(transformedProducts.slice(0, 8));
      } else {
        setError(result.error || 'Error al cargar los productos');
      }
    } catch (err) {
      setError('Error inesperado al cargar los productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (productId: number) => {
    console.log('Added to cart:', productId);
    // Add cart logic here
  };

  const handleToggleFavorite = (productId: number) => {
    console.log('Toggle favorite:', productId);
    // Add favorite logic here
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2} c="brand.9" mb="xs">
            Productos Destacados
          </Title>
          <Text c="dimmed" size="lg">
            Los mejores productos de nuestra comunidad
          </Text>
        </div>
        {/* <Button variant="outline" color="brand.9">
          Ver todos
        </Button> */}
      </Group>

      {/* Loading State */}
      {loading && (
        <Center py={60}>
          <Stack align="center" gap="md">
            <Loader size="lg" color="brand.9" />
            <Text c="dimmed">Cargando productos...</Text>
          </Stack>
        </Center>
      )}

      {/* Error State */}
      {!loading && error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error al cargar productos"
          color="red"
          mb="xl"
        >
          <Stack gap="sm">
            <Text>{error}</Text>
            <Button variant="light" color="red" onClick={loadProducts}>
              Reintentar
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <Center py={60}>
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              No hay productos disponibles en este momento
            </Text>
            <Button variant="light" color="brand.9" onClick={loadProducts}>
              Recargar
            </Button>
          </Stack>
        </Center>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {products.map(product => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </SimpleGrid>
      )}
    </Container>
  );
}
