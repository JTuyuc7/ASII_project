'use client';

import MapPlaceholder from '@/components/products/MapPlaceholder';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  Paper,
  Rating,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconHeart,
  IconMapPin,
  IconMessage,
  IconPhone,
  IconShare,
  IconShoppingCart,
  IconStar,
  IconTruck,
  IconUser,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductDetailProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock product data - in real app this would come from an API
const getProductById = (id: string) => {
  const products = [
    {
      id: 1,
      name: 'Motor V8 Ford Mustang',
      price: 2500,
      originalPrice: 3000,
      condition: 'Usado - Excelente estado',
      location: 'Ciudad de México',
      distance: '5 km',
      rating: 4.8,
      reviews: 24,
      images: [
        '/bannerImg.jpg',
        '/bannerImg.jpg',
        '/bannerImg.jpg',
        '/bannerImg.jpg',
      ],
      isNew: false,
      onSale: true,
      seller: {
        name: 'AutoPartes México',
        rating: 4.9,
        reviews: 156,
        memberSince: '2020',
        verified: true,
      },
      coordinates: { lat: 19.4326, lng: -99.1332 },
      description: `Motor V8 de Ford Mustang en excelente estado. Ha sido completamente revisado y está listo para instalación. 
      
Características:
• Cilindros: 8
• Desplazamiento: 5.0L
• Potencia: 420 HP
• Millaje: 85,000 km
• Última revisión: Marzo 2024

El motor ha sido probado y funciona perfectamente. Incluye todos los accesorios originales. Ideal para restauración o reemplazo.`,
      specifications: {
        Marca: 'Ford',
        Modelo: 'Mustang',
        Año: '2015-2019',
        Tipo: 'V8 Coyote',
        Desplazamiento: '5.0L',
        Potencia: '420 HP',
        Millaje: '85,000 km',
        Estado: 'Excelente',
      },
      shipping: {
        available: true,
        cost: 150,
        time: '3-5 días hábiles',
        pickupAvailable: true,
      },
      warranty: '30 días de garantía',
      category: 'Motores',
    },
    // Add more products as needed
  ];

  return products.find(p => p.id.toString() === id) || products[0];
};

export default function ProductDetail({ params }: ProductDetailProps) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Handle async params
  useEffect(() => {
    params.then(resolvedParams => {
      setProductId(resolvedParams.id);
    });
  }, [params]);

  const product = getProductById(productId);

  // Show loading state while params are being resolved
  if (!productId) {
    return (
      <Container size="xl" py="md">
        <Text>Cargando...</Text>
      </Container>
    );
  }

  const breadcrumbItems = [
    { title: 'Inicio', href: '/' },
    {
      title: product.category,
      href: `/category/${product.category.toLowerCase()}`,
    },
    { title: product.name, href: '#' },
  ].map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      c={index === 2 ? 'brand.9' : 'dimmed'}
      fw={index === 2 ? 600 : 400}
    >
      {item.title}
    </Anchor>
  ));

  const handleAddToCart = () => {
    console.log('Added to cart:', { productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: product.id, quantity });
  };

  const handleContactSeller = () => {
    console.log('Contact seller:', product.seller.name);
  };

  return (
    <Container size="xl" py="md">
      {/* Back Button */}
      <Group mb="md">
        <ActionIcon variant="subtle" size="lg" onClick={() => router.back()}>
          <IconArrowLeft size={20} />
        </ActionIcon>

        {/* Breadcrumbs */}
        <Breadcrumbs separator=">">{breadcrumbItems}</Breadcrumbs>
      </Group>

      <Grid gutter="xl">
        {/* Left Column - Images */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            {/* Main Image */}
            <Card withBorder radius="md">
              <Card.Section>
                <Image
                  src={product.images[selectedImage]}
                  height={400}
                  alt={product.name}
                  fallbackSrc="https://placehold.co/400x400?text=Product+Image"
                />
              </Card.Section>
            </Card>

            {/* Thumbnail Images */}
            <SimpleGrid cols={4} spacing="xs">
              {product.images.map((image, index) => (
                <Card
                  key={index}
                  withBorder
                  radius="sm"
                  style={{
                    cursor: 'pointer',
                    border:
                      selectedImage === index ? '2px solid #1A2A80' : undefined,
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <Card.Section>
                    <Image
                      src={image}
                      height={80}
                      alt={`${product.name} ${index + 1}`}
                      fallbackSrc="https://placehold.co/100x80?text=Thumb"
                    />
                  </Card.Section>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Grid.Col>

        {/* Right Column - Product Info */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            {/* Product Title and Badges */}
            <div>
              <Group gap="xs" mb="xs">
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
              </Group>

              <Title order={1} size="h2" c="brand.9" mb="xs">
                {product.name}
              </Title>

              <Text c="dimmed" size="lg" mb="sm">
                {product.condition}
              </Text>
            </div>

            {/* Rating and Reviews */}
            <Group gap="md">
              <Group gap="xs">
                <Rating value={product.rating} fractions={2} readOnly />
                <Text fw={500}>{product.rating}</Text>
              </Group>
              <Text c="dimmed">({product.reviews} reseñas)</Text>
            </Group>

            {/* Price */}
            <Group align="center" gap="md">
              <Text size="xl" fw={700} c="brand.9">
                ${product.price.toLocaleString()}
              </Text>
              {product.originalPrice && (
                <Text size="lg" td="line-through" c="dimmed">
                  ${product.originalPrice.toLocaleString()}
                </Text>
              )}
              {product.onSale && (
                <Badge color="secondary" variant="light">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </Group>

            {/* Location */}
            <Group gap="xs">
              <IconMapPin size={18} color="#6c757d" />
              <Text c="dimmed">
                {product.location} • {product.distance} de tu ubicación
              </Text>
            </Group>

            {/* Seller Info */}
            <Card withBorder radius="md" p="md">
              <Group justify="space-between" align="center">
                <div>
                  <Group gap="xs" mb="xs">
                    <IconUser size={18} />
                    <Text fw={600}>{product.seller.name}</Text>
                    {product.seller.verified && (
                      <Badge color="success" size="sm" variant="light">
                        Verificado
                      </Badge>
                    )}
                  </Group>
                  <Group gap="md">
                    <Group gap="xs">
                      <IconStar size={14} fill="#ffd43b" color="#ffd43b" />
                      <Text size="sm">{product.seller.rating}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {product.seller.reviews} reseñas
                    </Text>
                    <Text size="sm" c="dimmed">
                      Miembro desde {product.seller.memberSince}
                    </Text>
                  </Group>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftSection={<IconMessage size={16} />}
                  onClick={handleContactSeller}
                >
                  Contactar
                </Button>
              </Group>
            </Card>

            {/* Quantity and Actions */}
            <Card withBorder radius="md" p="md">
              <Stack gap="md">
                <Group align="center">
                  <Text fw={500}>Cantidad:</Text>
                  <NumberInput
                    value={quantity}
                    onChange={value => setQuantity(Number(value) || 1)}
                    min={1}
                    max={10}
                    w={100}
                  />
                </Group>

                <Group grow>
                  <Button
                    size="lg"
                    color="brand.9"
                    leftSection={<IconShoppingCart size={18} />}
                    onClick={handleAddToCart}
                  >
                    Agregar al Carrito
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="brand.9"
                    onClick={handleBuyNow}
                  >
                    Comprar Ahora
                  </Button>
                </Group>

                <Group justify="center" gap="md">
                  <Button
                    variant="subtle"
                    leftSection={<IconHeart size={16} />}
                  >
                    Agregar a Favoritos
                  </Button>
                  <Button
                    variant="subtle"
                    leftSection={<IconShare size={16} />}
                  >
                    Compartir
                  </Button>
                </Group>
              </Stack>
            </Card>

            {/* Shipping Info */}
            {product.shipping.available && (
              <Card withBorder radius="md" p="md">
                <Group gap="xs" mb="sm">
                  <IconTruck size={18} color="#28a745" />
                  <Text fw={600} c="success">
                    Envío disponible
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">
                  Costo de envío: ${product.shipping.cost}
                </Text>
                <Text size="sm" c="dimmed" mb="xs">
                  Tiempo de entrega: {product.shipping.time}
                </Text>
                {product.shipping.pickupAvailable && (
                  <Text size="sm" c="dimmed">
                    También disponible para recoger en persona
                  </Text>
                )}
              </Card>
            )}

            {/* Contact Options */}
            <Card withBorder radius="md" p="md">
              <Text fw={600} mb="sm">
                Opciones de Contacto
              </Text>
              <Group gap="sm">
                <Button
                  variant="light"
                  leftSection={<IconPhone size={16} />}
                  color="success"
                >
                  Llamar
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconMessage size={16} />}
                  color="brand.9"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconMessage size={16} />}
                  color="secondary"
                >
                  Mensaje
                </Button>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Product Details Tabs */}
      <Box mt="xl">
        <Tabs
          value={activeTab}
          onChange={value => setActiveTab(value || 'description')}
        >
          <Tabs.List>
            <Tabs.Tab value="description">Descripción</Tabs.Tab>
            <Tabs.Tab value="specifications">Especificaciones</Tabs.Tab>
            <Tabs.Tab value="location">Ubicación</Tabs.Tab>
            <Tabs.Tab value="reviews">Reseñas ({product.reviews})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description" mt="md">
            <Card withBorder radius="md" p="lg">
              <Title order={3} mb="md">
                Descripción del Producto
              </Title>
              <Text style={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </Text>

              {product.warranty && (
                <>
                  <Divider my="md" />
                  <Group gap="xs">
                    <Text fw={600}>Garantía:</Text>
                    <Text c="success">{product.warranty}</Text>
                  </Group>
                </>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="specifications" mt="md">
            <Card withBorder radius="md" p="lg">
              <Title order={3} mb="md">
                Especificaciones Técnicas
              </Title>
              <Stack gap="sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Group key={key} justify="space-between">
                    <Text fw={500}>{key}:</Text>
                    <Text>{value}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="location" mt="md">
            <MapPlaceholder
              coordinates={product.coordinates}
              location={product.location}
              distance={product.distance}
              productName={product.name}
            />
          </Tabs.Panel>

          <Tabs.Panel value="reviews" mt="md">
            <Card withBorder radius="md" p="lg">
              <Group justify="space-between" mb="md">
                <Title order={3}>Reseñas y Calificaciones</Title>
                <Button variant="outline" size="sm">
                  Escribir Reseña
                </Button>
              </Group>

              {/* Reviews Summary */}
              <Group mb="xl" align="center">
                <div style={{ textAlign: 'center' }}>
                  <Text size="3rem" fw={700} c="brand.9">
                    {product.rating}
                  </Text>
                  <Rating value={product.rating} fractions={2} readOnly />
                  <Text size="sm" c="dimmed">
                    {product.reviews} reseñas
                  </Text>
                </div>
              </Group>

              {/* Sample Reviews */}
              <Stack gap="md">
                {[
                  {
                    user: 'Juan P.',
                    rating: 5,
                    date: '15 Mar 2024',
                    comment:
                      'Excelente producto, tal como se describe. El vendedor muy profesional.',
                  },
                  {
                    user: 'María G.',
                    rating: 4,
                    date: '10 Mar 2024',
                    comment:
                      'Buen motor, funciona perfectamente. La entrega fue rápida.',
                  },
                  {
                    user: 'Carlos R.',
                    rating: 5,
                    date: '5 Mar 2024',
                    comment:
                      'Recomendado 100%. El motor llegó en perfectas condiciones.',
                  },
                ].map((review, index) => (
                  <Paper key={index} withBorder p="md" radius="md">
                    <Group justify="space-between" mb="xs">
                      <Group gap="sm">
                        <Text fw={500}>{review.user}</Text>
                        <Rating value={review.rating} size="sm" readOnly />
                      </Group>
                      <Text size="sm" c="dimmed">
                        {review.date}
                      </Text>
                    </Group>
                    <Text size="sm">{review.comment}</Text>
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Box>

      {/* Related Products Placeholder */}
      <Box mt="xl">
        <Title order={2} mb="md">
          Productos Relacionados
        </Title>
        <Paper
          h={200}
          bg="gray.1"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '2px dashed #dee2e6',
          }}
        >
          <Text c="dimmed">Productos relacionados se mostrarán aquí</Text>
        </Paper>
      </Box>
    </Container>
  );
}
