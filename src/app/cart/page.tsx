'use client';

import { useCart } from '@/contexts/CartContext';
import { customColors } from '@/theme/colors';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCreditCard,
  IconInfoCircle,
  IconShield,
  IconShoppingCart,
  IconTrash,
  IconTruck,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  const handleQuantityChange = (id: string, value: number | string) => {
    const quantity = typeof value === 'string' ? parseInt(value) || 0 : value;
    updateQuantity(id, quantity);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  const shippingCost = 10.0;
  const tax = state.total * 0.12; // 12% IVA
  const finalTotal = state.total + shippingCost + tax;

  if (state.items.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="xl">
          <IconShoppingCart size={80} color={customColors.neutral[4]} />
          <Stack align="center" gap="md">
            <Title order={2} c={customColors.brand[8]}>
              Tu carrito está vacío
            </Title>
            <Text size="lg" c={customColors.neutral[6]} ta="center">
              Parece que no has agregado ningún producto a tu carrito aún.
            </Text>
          </Stack>
          <Button
            size="lg"
            color="brand"
            onClick={() => router.push('/main')}
            leftSection={<IconArrowLeft size={20} />}
          >
            Continuar Comprando
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={1} c={customColors.brand[8]}>
              Carrito de Compras
            </Title>
            <Text c={customColors.neutral[6]}>
              {state.itemCount}{' '}
              {state.itemCount === 1 ? 'producto' : 'productos'} en tu carrito
            </Text>
          </Stack>
          <Group gap="sm">
            <Button
              variant="outline"
              color="red"
              onClick={clearCart}
              leftSection={<IconTrash size={16} />}
            >
              Limpiar carrito
            </Button>
            <Button
              variant="outline"
              color="brand"
              onClick={() => router.push('/main')}
              leftSection={<IconArrowLeft size={16} />}
            >
              Seguir comprando
            </Button>
          </Group>
        </Group>

        <Grid>
          {/* Lista de productos */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              {state.items.map(item => (
                <Card
                  key={item.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Group align="flex-start" gap="md">
                    {/* Imagen del producto */}
                    <Box
                      w={120}
                      h={120}
                      bg={customColors.neutral[1]}
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          w="100%"
                          h="100%"
                          fit="cover"
                        />
                      ) : (
                        <Box
                          h="100%"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconShoppingCart
                            size={40}
                            color={customColors.neutral[4]}
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Información del producto */}
                    <Stack gap="sm" flex={1}>
                      <Group justify="space-between" align="flex-start">
                        <Box flex={1}>
                          <Title order={4} c={customColors.brand[8]}>
                            {item.name}
                          </Title>
                          {item.description && (
                            <Text
                              size="sm"
                              c={customColors.neutral[6]}
                              lineClamp={2}
                            >
                              {item.description}
                            </Text>
                          )}
                          {item.category && (
                            <Badge
                              variant="light"
                              color="brand"
                              size="sm"
                              mt="xs"
                            >
                              {item.category}
                            </Badge>
                          )}
                        </Box>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => removeItem(item.id)}
                          size="lg"
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Group>

                      {/* Controles de cantidad y precio */}
                      <Group justify="space-between" align="center">
                        <Group gap="sm" align="center">
                          <Text size="sm" c={customColors.neutral[6]}>
                            Cantidad:
                          </Text>
                          <NumberInput
                            value={item.quantity}
                            onChange={value =>
                              handleQuantityChange(item.id, value)
                            }
                            min={1}
                            max={99}
                            size="sm"
                            w={100}
                            styles={{
                              input: {
                                textAlign: 'center',
                              },
                            }}
                          />
                        </Group>
                        <Stack gap="xs" align="flex-end">
                          <Text size="sm" c={customColors.neutral[6]}>
                            {formatPrice(item.price)} c/u
                          </Text>
                          <Text size="lg" fw={700} c={customColors.brand[6]}>
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                        </Stack>
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Grid.Col>

          {/* Resumen del pedido */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              {/* Resumen de precios */}
              <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Stack gap="md">
                  <Title order={3} c={customColors.brand[8]}>
                    Resumen del pedido
                  </Title>

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text c={customColors.neutral[6]}>
                        Subtotal ({state.itemCount} productos):
                      </Text>
                      <Text fw={500}>{formatPrice(state.total)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text c={customColors.neutral[6]}>Envío:</Text>
                      <Text fw={500}>{formatPrice(shippingCost)}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text c={customColors.neutral[6]}>IVA (12%):</Text>
                      <Text fw={500}>{formatPrice(tax)}</Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between">
                      <Text size="lg" fw={700} c={customColors.brand[8]}>
                        Total:
                      </Text>
                      <Text size="lg" fw={700} c={customColors.brand[6]}>
                        {formatPrice(finalTotal)}
                      </Text>
                    </Group>
                  </Stack>

                  <Button
                    fullWidth
                    size="lg"
                    color="brand"
                    leftSection={<IconCreditCard size={20} />}
                    onClick={() => router.push('/checkout')}
                  >
                    Proceder al Pago
                  </Button>
                </Stack>
              </Paper>

              {/* Información adicional */}
              <Paper shadow="sm" p="md" radius="md" withBorder>
                <Stack gap="sm">
                  <Title order={4} c={customColors.brand[8]} size="h5">
                    Información de envío
                  </Title>

                  <SimpleGrid cols={1} spacing="xs">
                    <Group gap="sm">
                      <IconTruck size={16} color={customColors.secondary[5]} />
                      <Text size="sm" c={customColors.neutral[6]}>
                        Envío gratis en compras mayores a Q200
                      </Text>
                    </Group>
                    <Group gap="sm">
                      <IconShield size={16} color={customColors.success[5]} />
                      <Text size="sm" c={customColors.neutral[6]}>
                        Compra protegida
                      </Text>
                    </Group>
                  </SimpleGrid>
                </Stack>
              </Paper>

              {/* Alerta informativa */}
              <Alert
                icon={<IconInfoCircle size={16} />}
                title="¿Necesitas ayuda?"
                color="blue"
                variant="light"
              >
                <Text size="sm">
                  Si tienes preguntas sobre tu pedido, contacta nuestro servicio
                  al cliente.
                </Text>
              </Alert>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
