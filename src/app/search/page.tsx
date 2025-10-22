'use client';

import { ProductResponse } from '@/app/actions/HomeProductAction';
import { searchProductsAction } from '@/app/actions/SearchProductAction';
import SearchProductCard from '@/components/products/SearchProductCard';
import { CATEGORIES } from '@/constants/categories';
import {
  Badge,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get URL parameters
  const searchQuery = searchParams.get('q') || '';
  const searchCategory = searchParams.get('categoria') || '';

  // Perform search when URL parameters change
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery && !searchCategory) {
        setProducts([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        const result = await searchProductsAction({
          q: searchQuery || undefined,
          busqueda: searchQuery || undefined,
          categoria: searchCategory || undefined,
        });

        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          setProducts([]);
          console.error('Search error:', result.error);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, searchCategory]);

  // // Handle new search from SearchBar
  // const handleSearch = (searchTerm: string, category?: string) => {
  //   const params = new URLSearchParams();
  //   if (searchTerm.trim()) params.set('q', searchTerm.trim());
  //   if (category) params.set('categoria', category);

  //   const queryString = params.toString();
  //   router.push(`/search${queryString ? `?${queryString}` : ''}`);
  // };

  // Get category label
  const getCategoryLabel = (categoria: string) => {
    return CATEGORIES.find(c => c.value === categoria)?.label || categoria;
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* <Box>
          <Group gap="md" mb="lg">
            <IconSearch size={28} color="#1A2A80" />
            <Title order={1} c="brand.9">
              Búsqueda de Productos
            </Title>
          </Group>

          
          <Box mb="xl">
            <SearchBar
              onSearch={handleSearch}
              showCategoryFilter={true}
              showPreview={false}
              debounceMs={300}
            />
          </Box>
        </Box> */}

        {/* Search Summary */}
        {hasSearched && (
          <Paper p="md" radius="md" bg="gray.0">
            <Group gap="md" wrap="wrap">
              <Text size="sm" c="dimmed">
                Resultados para:
              </Text>

              {searchQuery && (
                <Badge variant="light" size="md">
                  "{searchQuery}"
                </Badge>
              )}

              {searchCategory && (
                <Badge variant="light" color="blue" size="md">
                  {getCategoryLabel(searchCategory)}
                </Badge>
              )}

              <Text size="sm" c="dimmed">
                • {products.length} producto{products.length !== 1 ? 's' : ''}{' '}
                encontrado{products.length !== 1 ? 's' : ''}
              </Text>
            </Group>
          </Paper>
        )}

        {/* Loading State */}
        {loading && (
          <Paper p="xl" radius="md">
            <Group justify="center">
              <Loader size="lg" />
              <Text>Buscando productos...</Text>
            </Group>
          </Paper>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            {products.length > 0 ? (
              <Grid>
                {products.map(product => (
                  <Grid.Col
                    key={product.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <SearchProductCard product={product} />
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Paper p="xl" radius="md" ta="center">
                <Stack gap="md" align="center">
                  <Text size="lg" fw={500}>
                    No se encontraron productos
                  </Text>
                  <Text c="dimmed">
                    Intenta con otros términos de búsqueda o selecciona una
                    categoría diferente
                  </Text>
                </Stack>
              </Paper>
            )}
          </>
        )}

        {/* Initial State */}
        {!hasSearched && !loading && (
          <Paper p="xl" radius="md" ta="center">
            <Stack gap="md" align="center">
              <IconSearch size={48} color="gray" />
              <Text size="lg" fw={500} c="dimmed">
                Busca repuestos automotrices
              </Text>
              <Text c="dimmed">
                Utiliza la barra de búsqueda para encontrar los productos que
                necesitas
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container size="xl" py="xl">
          <Group justify="center">
            <Loader size="lg" />
            <Text>Cargando búsqueda...</Text>
          </Group>
        </Container>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
