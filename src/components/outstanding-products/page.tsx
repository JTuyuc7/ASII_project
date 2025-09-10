'use client';

import ProductCard, { Product } from '@/components/products/ProductCard';
import {
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';

// Dummy product data with location information
const outstandingProducts: Product[] = [
  {
    id: 1,
    name: 'Motor V8 Ford Mustang',
    price: '$2,500',
    originalPrice: '$3,000',
    condition: 'Usado - Excelente estado',
    location: 'Ciudad de México',
    distance: '5 km',
    rating: 4.8,
    reviews: 24,
    image: '/bannerImg.jpg',
    isNew: false,
    onSale: true,
    seller: 'AutoPartes México',
    coordinates: { lat: 19.4326, lng: -99.1332 },
  },
  {
    id: 2,
    name: 'Transmisión Automática',
    price: '$1,800',
    originalPrice: '$2,200',
    condition: 'Usado - Buen estado',
    location: 'Guadalajara',
    distance: '12 km',
    rating: 4.5,
    reviews: 18,
    image: '/bannerImg.jpg',
    isNew: false,
    onSale: true,
    seller: 'Transmisiones GDL',
    coordinates: { lat: 20.6597, lng: -103.3496 },
  },
  {
    id: 3,
    name: 'Set de 4 Llantas Michelin',
    price: '$800',
    originalPrice: undefined,
    condition: 'Nuevo',
    location: 'Monterrey',
    distance: '8 km',
    rating: 5.0,
    reviews: 45,
    image: '/bannerImg.jpg',
    isNew: true,
    onSale: false,
    seller: 'Llantas del Norte',
    coordinates: { lat: 25.6866, lng: -100.3161 },
  },
  {
    id: 4,
    name: 'Kit de Frenos Brembo',
    price: '$450',
    originalPrice: undefined,
    condition: 'Nuevo',
    location: 'Puebla',
    distance: '15 km',
    rating: 4.9,
    reviews: 32,
    image: '/bannerImg.jpg',
    isNew: true,
    onSale: false,
    seller: 'Frenos Premium',
    coordinates: { lat: 19.0414, lng: -98.2063 },
  },
];

export default function OutstandingProducts() {
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
        <Button variant="outline" color="brand.9">
          Ver todos
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        {outstandingProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
