'use client';

import {
  getProductByIdAction,
  ProductResponse,
} from '@/app/actions/HomeProductAction';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import MapPlaceholder from '@/components/products/MapPlaceholder';
import { getCategoryLabel } from '@/constants/categories';
import { useUserAccount } from '@/contexts/UserAccountContext';
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  Loader,
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
  IconAlertCircle,
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconHeartFilled,
  IconMapPin,
  IconMessage,
  IconPhone,
  IconShare,
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

export default function ProductDetail({ params }: ProductDetailProps) {
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUserAccount();
  const [productId, setProductId] = useState<string>('');
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  // Handle async params
  useEffect(() => {
    params.then(resolvedParams => {
      setProductId(resolvedParams.id);
    });
  }, [params]);

  // Load product data
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getProductByIdAction(Number(productId));

        if (result.success && result.data) {
          setProduct(result.data);
          // Check if product is in wishlist
          setIsFavorite(isInWishlist(productId));
        } else {
          setError(result.error || 'Error al cargar el producto');
        }
      } catch (err) {
        setError('Error inesperado al cargar el producto');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, isInWishlist]);

  // Show loading state while params are being resolved or product is loading
  if (!productId || loading) {
    return (
      <Container size="xl" py="md">
        <Center py={60}>
          <Stack align="center" gap="md">
            <Loader size="lg" color="brand.9" />
            <Text>Cargando producto...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <Container size="xl" py="md">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error al cargar el producto"
          color="red"
        >
          <Stack gap="sm">
            <Text>{error || 'No se pudo encontrar el producto'}</Text>
            <Group>
              <Button variant="light" color="red" onClick={() => router.back()}>
                Volver
              </Button>
              <Button
                variant="light"
                color="brand.9"
                onClick={() => router.push('/')}
              >
                Ir al inicio
              </Button>
            </Group>
          </Stack>
        </Alert>
      </Container>
    );
  }

  // Datos reales del backend
  const productPrice = parseFloat(product.precio);
  const categoryLabel = getCategoryLabel(
    product.categoryId || product.categoria
  );

  const productCoordinates = {
    lat: product.proveedor.latitud,
    lng: product.proveedor.longitud,
  };

  // Normalizar imagenUrl a array y validar
  const productImages = Array.isArray(product.imagenUrl)
    ? product.imagenUrl.filter(url => url && url.trim() !== '')
    : product.imagenUrl && product.imagenUrl.trim() !== ''
      ? [product.imagenUrl]
      : [];

  // Si no hay imágenes válidas, usar fallback
  const images =
    productImages.length > 0
      ? productImages
      : ['https://placehold.co/400x400?text=Sin+Imagen'];

  // Datos temporales (mock) - se actualizarán con datos reales más adelante
  const mockData = {
    rating: 4.5,
    reviews: 0,
    images: images,
    isNew: product.stock > 50,
    onSale: false,
    originalPrice: undefined as number | undefined,
    seller: {
      rating: 4.8,
      reviews: 0,
      memberSince: new Date(product.createdAt).getFullYear().toString(),
      verified: true,
    },
    shipping: {
      available: true,
      cost: 50,
      time: '3-5 días hábiles',
      pickupAvailable: true,
    },
    warranty: '30 días de garantía',
    specifications: {
      Categoría: categoryLabel,
      Stock: product.stock.toString(),
      'Fecha de publicación': new Date(product.createdAt).toLocaleDateString(
        'es-GT'
      ),
      Estado: product.activo ? 'Activo' : 'Inactivo',
    },
  };

  const breadcrumbItems = [
    { title: 'Inicio', href: '/' },
    {
      title: categoryLabel,
      href: `/search?categoria=${product.categoryId || product.categoria}`,
    },
    { title: product.nombre, href: '#' },
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

  const handleBuyNow = () => {
    console.log('Buy now:', { productId: product.id, quantity });
  };

  const handleContactSeller = () => {
    console.log('Contact seller:', product.proveedor.nombreComercial);
  };

  const handleToggleFavorite = async () => {
    if (!product) return;

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
          image: images[0],
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
            {/* Main Image with Navigation */}
            <Card withBorder radius="md" pos="relative">
              <Card.Section>
                <Image
                  src={mockData.images[selectedImage]}
                  height={400}
                  alt={`${product.nombre} - imagen ${selectedImage + 1}`}
                  fallbackSrc="https://placehold.co/400x400?text=Sin+Imagen"
                />
              </Card.Section>

              {/* Navigation Arrows - Solo mostrar si hay más de una imagen */}
              {mockData.images.length > 1 && (
                <>
                  <ActionIcon
                    size="lg"
                    variant="filled"
                    color="brand.9"
                    radius="xl"
                    style={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                    }}
                    onClick={() =>
                      setSelectedImage(prev =>
                        prev === 0 ? mockData.images.length - 1 : prev - 1
                      )
                    }
                  >
                    <IconChevronLeft size={20} />
                  </ActionIcon>

                  <ActionIcon
                    size="lg"
                    variant="filled"
                    color="brand.9"
                    radius="xl"
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                    }}
                    onClick={() =>
                      setSelectedImage(prev =>
                        prev === mockData.images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <IconChevronRight size={20} />
                  </ActionIcon>

                  {/* Image Counter */}
                  <Badge
                    size="lg"
                    variant="filled"
                    color="dark"
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      zIndex: 1,
                    }}
                  >
                    {selectedImage + 1} / {mockData.images.length}
                  </Badge>
                </>
              )}
            </Card>

            {/* Thumbnail Images - Solo mostramos si hay más de una imagen */}
            {mockData.images.length > 1 && (
              <SimpleGrid cols={4} spacing="xs">
                {mockData.images.map((image, index) => (
                  <Card
                    key={index}
                    withBorder
                    radius="sm"
                    style={{
                      cursor: 'pointer',
                      border:
                        selectedImage === index
                          ? '2px solid #1A2A80'
                          : undefined,
                      opacity: selectedImage === index ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Card.Section>
                      <Image
                        src={image}
                        height={80}
                        alt={`${product.nombre} miniatura ${index + 1}`}
                        fallbackSrc="https://placehold.co/100x80?text=Thumb"
                      />
                    </Card.Section>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Grid.Col>

        {/* Right Column - Product Info */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            {/* Product Title and Badges */}
            <div>
              <Group gap="xs" mb="xs">
                {mockData.isNew && (
                  <Badge color="success" variant="filled">
                    Stock Alto
                  </Badge>
                )}
                {mockData.onSale && (
                  <Badge color="secondary" variant="filled">
                    Oferta
                  </Badge>
                )}
                {product.stock > 0 ? (
                  <Badge color="green" variant="light">
                    Disponible
                  </Badge>
                ) : (
                  <Badge color="red" variant="filled">
                    Agotado
                  </Badge>
                )}
              </Group>

              <Title order={1} size="h2" c="brand.9" mb="xs">
                {product.nombre}
              </Title>

              <Badge size="lg" variant="dot" color="blue">
                {categoryLabel}
              </Badge>
            </div>

            {/* Rating and Reviews */}
            <Group gap="md">
              <Group gap="xs">
                <Rating value={mockData.rating} fractions={2} readOnly />
                <Text fw={500}>{mockData.rating}</Text>
              </Group>
              <Text c="dimmed">({mockData.reviews} reseñas)</Text>
            </Group>

            {/* Price */}
            <Group align="center" gap="md">
              <Text size="xl" fw={700} c="brand.9">
                Q{' '}
                {productPrice.toLocaleString('es-GT', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              {mockData.originalPrice && (
                <Text size="lg" td="line-through" c="dimmed">
                  Q{' '}
                  {mockData.originalPrice.toLocaleString('es-GT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              )}
              {mockData.onSale && mockData.originalPrice && (
                <Badge color="secondary" variant="light">
                  {Math.round(
                    ((mockData.originalPrice - productPrice) /
                      mockData.originalPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </Group>

            {/* Location */}
            <Group gap="xs">
              <IconMapPin size={18} color="#6c757d" />
              <Text c="dimmed">{product.proveedor.direccion}</Text>
            </Group>

            {/* Seller Info */}
            <Card withBorder radius="md" p="md">
              <Group justify="space-between" align="center">
                <div>
                  <Group gap="xs" mb="xs">
                    <IconUser size={18} />
                    <Text fw={600}>{product.proveedor.nombreComercial}</Text>
                    {mockData.seller.verified && (
                      <Badge color="success" size="sm" variant="light">
                        Verificado
                      </Badge>
                    )}
                  </Group>
                  <Group gap="md">
                    <Group gap="xs">
                      <IconStar size={14} fill="#ffd43b" color="#ffd43b" />
                      <Text size="sm">{mockData.seller.rating}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {mockData.seller.reviews} reseñas
                    </Text>
                    <Text size="sm" c="dimmed">
                      Miembro desde {mockData.seller.memberSince}
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
                    max={Math.min(product.stock, 10)}
                    w={100}
                    disabled={product.stock === 0}
                  />
                  <Text size="sm" c="dimmed">
                    Stock disponible: {product.stock}
                  </Text>
                </Group>

                <Group grow>
                  <AddToCartButton
                    product={{
                      id: product.id.toString(),
                      name: product.nombre,
                      price: productPrice,
                      image: mockData.images[0], // Primera imagen del arreglo
                      description: product.descripcion,
                      category: categoryLabel,
                    }}
                    size="lg"
                    fullWidth
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    color="brand.9"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    Comprar Ahora
                  </Button>
                </Group>

                <Group justify="center" gap="md">
                  <Button
                    variant={isFavorite ? 'filled' : 'subtle'}
                    color={isFavorite ? 'red' : 'gray'}
                    leftSection={
                      isFavorite ? (
                        <IconHeartFilled size={16} />
                      ) : (
                        <IconHeart size={16} />
                      )
                    }
                    onClick={handleToggleFavorite}
                    loading={isFavoriteLoading}
                  >
                    {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
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
            {mockData.shipping.available && (
              <Card withBorder radius="md" p="md">
                <Group gap="xs" mb="sm">
                  <IconTruck size={18} color="#28a745" />
                  <Text fw={600} c="success">
                    Envío disponible
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">
                  Costo de envío: Q {mockData.shipping.cost}
                </Text>
                <Text size="sm" c="dimmed" mb="xs">
                  Tiempo de entrega: {mockData.shipping.time}
                </Text>
                {mockData.shipping.pickupAvailable && (
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
                  component="a"
                  href={`tel:${product.proveedor.telefono}`}
                >
                  Llamar
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconMessage size={16} />}
                  color="brand.9"
                  component="a"
                  href={`https://wa.me/${product.proveedor.telefono.replace(/\D/g, '')}`}
                  target="_blank"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconMessage size={16} />}
                  color="secondary"
                  onClick={handleContactSeller}
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
            <Tabs.Tab value="reviews">Reseñas ({mockData.reviews})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description" mt="md">
            <Card withBorder radius="md" p="lg">
              <Title order={3} mb="md">
                Descripción del Producto
              </Title>
              <Text style={{ whiteSpace: 'pre-line' }}>
                {product.descripcion}
              </Text>

              {mockData.warranty && (
                <>
                  <Divider my="md" />
                  <Group gap="xs">
                    <Text fw={600}>Garantía:</Text>
                    <Text c="success">{mockData.warranty}</Text>
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
                {Object.entries(mockData.specifications).map(([key, value]) => (
                  <Group key={key} justify="space-between">
                    <Text fw={500}>{key}:</Text>
                    <Text>{value as string}</Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="location" mt="md">
            <MapPlaceholder
              coordinates={productCoordinates}
              location={product.proveedor.direccion}
              distance="Calculando..."
              productName={product.nombre}
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
                    {mockData.rating}
                  </Text>
                  <Rating value={mockData.rating} fractions={2} readOnly />
                  <Text size="sm" c="dimmed">
                    {mockData.reviews} reseñas
                  </Text>
                </div>
              </Group>

              {/* Sample Reviews - Temporales */}
              {mockData.reviews === 0 ? (
                <Stack align="center" gap="md" py="xl">
                  <Text size="lg" c="dimmed">
                    No hay reseñas todavía
                  </Text>
                  <Text size="sm" c="dimmed">
                    Sé el primero en dejar una reseña para este producto
                  </Text>
                </Stack>
              ) : (
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
                        'Buen producto, funciona perfectamente. La entrega fue rápida.',
                    },
                    {
                      user: 'Carlos R.',
                      rating: 5,
                      date: '5 Mar 2024',
                      comment:
                        'Recomendado 100%. El producto llegó en perfectas condiciones.',
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
              )}
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
          <Text c="dimmed">No se encontraron productos relacionados</Text>
        </Paper>
      </Box>
    </Container>
  );
}
