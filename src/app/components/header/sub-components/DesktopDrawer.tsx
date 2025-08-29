'use client';

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';

export interface DesktopDrawerProps {
  cartOpened: boolean;
  closeCart: () => void;
  // cartItems: { id: string; name: string; quantity: number; price: string }[];
  // TODO: update with the correct type of things
  cartItems: any[];
}

export default function DesktopDrawer({
  cartOpened,
  closeCart,
  cartItems,
}: DesktopDrawerProps) {
  return (
    <Drawer
      opened={cartOpened}
      onClose={closeCart}
      position="right"
      title="Carrito de Compras"
      size="md"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#1A2A80',
        },
      }}
    >
      <Stack gap="md">
        {/* Cart Items */}
        <Box>
          <Group justify="space-between" mb="md">
            <Text fw={600} c="brand.9">
              {cartItems.length}{' '}
              {cartItems.length === 1 ? 'producto' : 'productos'}
            </Text>
            <Button
              // variant="subtle"
              variant="filled"
              size="xs"
              color="red"
            >
              Limpiar carrito
            </Button>
          </Group>

          {cartItems.length > 0 ? (
            <Stack gap="sm">
              {cartItems.map(item => (
                <Box
                  key={item.id}
                  p="md"
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1 }}>
                      <Text size="md" fw={600} mb="xs">
                        {item.name}
                      </Text>
                      <Group gap="sm" align="center">
                        <Text size="sm" c="dimmed">
                          Cantidad:
                        </Text>
                        <Group gap="xs">
                          <ActionIcon variant="light" size="sm" color="brand.9">
                            -
                          </ActionIcon>
                          <Text size="sm" fw={500} w={30} ta="center">
                            {item.quantity}
                          </Text>
                          <ActionIcon variant="light" size="sm" color="brand.9">
                            +
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Box>
                    <Box ta="right">
                      <Text size="lg" fw={700} c="brand.9" mb="xs">
                        {item.price}
                      </Text>
                      <Button variant="subtle" size="xs" color="red">
                        Eliminar
                      </Button>
                    </Box>
                  </Group>
                </Box>
              ))}

              {/* Cart Summary */}
              <Divider my="md" />
              <Box
                p="md"
                style={{ backgroundColor: '#f0f4ff', borderRadius: '12px' }}
              >
                <Group justify="space-between" mb="sm">
                  <Text size="md" fw={500}>
                    Subtotal:
                  </Text>
                  <Text size="md" fw={600}>
                    $100.00
                  </Text>
                </Group>
                <Group justify="space-between" mb="sm">
                  <Text size="md" fw={500}>
                    Envío:
                  </Text>
                  <Text size="md" fw={600}>
                    $10.00
                  </Text>
                </Group>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={700} c="brand.9">
                    Total:
                  </Text>
                  <Text size="lg" fw={700} c="brand.9">
                    $110.00
                  </Text>
                </Group>

                <Stack gap="sm">
                  <Button fullWidth size="md" color="brand.9" variant="filled">
                    Proceder al Pago
                  </Button>
                  <Button fullWidth size="md" variant="outline" color="brand.9">
                    Ver Carrito Completo
                  </Button>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Box ta="center" py="xl">
              <IconShoppingCart size={48} color="#ccc" />
              <Text size="lg" fw={500} c="dimmed" mt="md">
                Tu carrito está vacío
              </Text>
              <Text size="sm" c="dimmed" mb="lg">
                Agrega algunos productos para continuar
              </Text>
              <Button color="brand.9" onClick={closeCart}>
                Continuar Comprando
              </Button>
            </Box>
          )}
        </Box>
      </Stack>
    </Drawer>
  );
}
