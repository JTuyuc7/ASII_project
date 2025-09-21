'use client';
import { useCart } from '@/contexts/CartContext';
import { useUserAccount, WishlistItem } from '@/contexts/UserAccountContext';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconHeart,
  IconShare,
  IconShoppingCart,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

function WishlistItemCard({ item }: { item: WishlistItem }) {
  const { removeFromWishlist } = useUserAccount();
  const { addItem } = useCart();
  const [removing, setRemoving] = useState(false);

  const handleRemoveFromWishlist = async () => {
    setRemoving(true);
    try {
      await removeFromWishlist(item.productId);
    } catch (error) {
      console.error('Error al eliminar de la lista de deseos:', error);
    } finally {
      setRemoving(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Link href={`/product/${item.productId}`}>
          <Image
            src={item.image || '/placeholder-product.jpg'}
            alt={item.name}
            h={200}
            fit="cover"
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} size="lg" lineClamp={2}>
          {item.name}
        </Text>
        <Group gap="xs">
          <Tooltip label="Compartir">
            <ActionIcon variant="subtle" color="blue">
              <IconShare size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Eliminar de favoritos">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={handleRemoveFromWishlist}
              loading={removing}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700} c="brand">
          Q{item.price.toFixed(2)}
        </Text>
        <Badge color={item.inStock ? 'green' : 'red'} variant="light">
          {item.inStock ? 'Disponible' : 'Agotado'}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        Agregado el {new Date(item.dateAdded).toLocaleDateString('es-GT')}
      </Text>

      <Group justify="space-between">
        <Button
          variant="light"
          leftSection={<IconShoppingCart size={16} />}
          onClick={handleAddToCart}
          disabled={!item.inStock}
          flex={1}
        >
          {item.inStock ? 'Agregar al Carrito' : 'No Disponible'}
        </Button>
        <Button
          component={Link}
          href={`/product/${item.productId}`}
          variant="outline"
          size="sm"
        >
          Ver
        </Button>
      </Group>
    </Card>
  );
}

export default function WishlistPage() {
  const { wishlist, clearWishlist, isLoading } = useUserAccount();
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClearWishlist = async () => {
    setClearing(true);
    try {
      await clearWishlist();
      setClearModalOpen(false);
    } catch (error) {
      console.error('Error al limpiar lista de deseos:', error);
    } finally {
      setClearing(false);
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <LoadingOverlay visible />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>Lista de Deseos</Title>
          <Text c="dimmed">
            {wishlist.length} {wishlist.length === 1 ? 'producto' : 'productos'}{' '}
            guardados
          </Text>
        </div>
        {wishlist.length > 0 && (
          <Button
            variant="outline"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => setClearModalOpen(true)}
          >
            Limpiar Lista
          </Button>
        )}
      </Group>

      {wishlist.length === 0 ? (
        <Paper shadow="sm" p="xl" radius="md">
          <Center>
            <Stack align="center" gap="md">
              <IconHeart size={64} stroke={1} color="gray" />
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={500} mb="xs">
                  Tu lista de deseos está vacía
                </Text>
                <Text c="dimmed" mb="lg">
                  Explora nuestros productos y guarda tus favoritos aquí
                </Text>
                <Button
                  component={Link}
                  href="/main"
                  leftSection={<IconShoppingCart size={16} />}
                >
                  Explorar Productos
                </Button>
              </div>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <>
          <Grid>
            {wishlist.map(item => (
              <Grid.Col key={item.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <WishlistItemCard item={item} />
              </Grid.Col>
            ))}
          </Grid>

          {/* Estadísticas */}
          <Box mt="xl">
            <Title order={3} mb="md">
              Resumen de tu Lista
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Paper shadow="sm" p="md" radius="md">
                  <Text c="dimmed" size="sm">
                    Total de Productos
                  </Text>
                  <Text size="xl" fw={700}>
                    {wishlist.length}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Paper shadow="sm" p="md" radius="md">
                  <Text c="dimmed" size="sm">
                    Valor Total
                  </Text>
                  <Text size="xl" fw={700} c="brand">
                    Q
                    {wishlist
                      .reduce((total, item) => total + item.price, 0)
                      .toFixed(2)}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Paper shadow="sm" p="md" radius="md">
                  <Text c="dimmed" size="sm">
                    Disponibles
                  </Text>
                  <Text size="xl" fw={700} c="green">
                    {wishlist.filter(item => item.inStock).length}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Paper shadow="sm" p="md" radius="md">
                  <Text c="dimmed" size="sm">
                    Agotados
                  </Text>
                  <Text size="xl" fw={700} c="red">
                    {wishlist.filter(item => !item.inStock).length}
                  </Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </Box>
        </>
      )}

      {/* Modal de confirmación para limpiar lista */}
      <Modal
        opened={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Limpiar Lista de Deseos"
      >
        <Text mb="md">
          ¿Estás seguro de que quieres eliminar todos los productos de tu lista
          de deseos? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={() => setClearModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleClearWishlist} loading={clearing}>
            Limpiar Lista
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
