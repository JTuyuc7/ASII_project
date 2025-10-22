'use client';

import { useCart } from '@/contexts/CartContext';
import { customColors } from '@/theme/colors';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface CartDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ opened, onClose }) => {
  const router = useRouter();
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleQuantityChange = (id: string, value: number | string) => {
    const quantity = typeof value === 'string' ? parseInt(value) || 0 : value;
    updateQuantity(id, quantity);
  };

  const formatPrice = (price: number | string) => {
    // Convertir el precio a número si es string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    // Verificar si es un número válido
    if (isNaN(numPrice) || !isFinite(numPrice)) {
      return 'Q 0.00';
    }

    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(numPrice);
  };

  const handleNavigateToCart = () => {
    router.push('/cart');
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconShoppingCart size={24} color={customColors.brand[6]} />
          <Text size="lg" fw={600} c={customColors.brand[8]}>
            Carrito de Compras
          </Text>
          <Badge color="brand" variant="filled" size="sm">
            {state.itemCount} productos
          </Badge>
        </Group>
      }
      position="right"
      size="md"
      styles={{
        header: {
          backgroundColor: customColors.neutral[0],
          borderBottom: `1px solid ${customColors.neutral[2]}`,
        },
        body: {
          padding: 0,
        },
      }}
    >
      {state.items.length === 0 ? (
        <Box p="xl" ta="center">
          <IconShoppingCart size={64} color={customColors.neutral[4]} />
          <Text size="lg" mt="md" c={customColors.neutral[6]}>
            Tu carrito está vacío
          </Text>
          <Text size="sm" c={customColors.neutral[5]} mt="xs">
            Agrega algunos productos para comenzar
          </Text>
        </Box>
      ) : (
        <Stack gap={0} h="100%">
          {/* Header con acciones */}
          <Box p="md" bg={customColors.neutral[0]}>
            <Button
              variant="outline"
              color="red"
              size="sm"
              onClick={clearCart}
              leftSection={<IconTrash size={16} />}
              fullWidth
            >
              Limpiar carrito
            </Button>
          </Box>

          {/* Lista de productos */}
          <ScrollArea flex={1} p="md">
            <Stack gap="md">
              {state.items.map(item => {
                return (
                  <Box
                    key={item.id}
                    p="md"
                    bg={customColors.neutral[0]}
                    style={{
                      borderRadius: '8px',
                      border: `1px solid ${customColors.neutral[2]}`,
                    }}
                  >
                    <Flex gap="md" align="flex-start">
                      {/* Imagen del producto */}
                      <Box
                        w={80}
                        h={80}
                        bg={customColors.neutral[1]}
                        style={{
                          borderRadius: '6px',
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
                          <Flex align="center" justify="center" h="100%">
                            <IconShoppingCart
                              size={32}
                              color={customColors.neutral[4]}
                            />
                          </Flex>
                        )}
                      </Box>

                      {/* Información del producto */}
                      <Stack gap="xs" flex={1}>
                        <Group justify="space-between" align="flex-start">
                          <Box flex={1}>
                            <Text fw={600} size="sm" c={customColors.brand[8]}>
                              {item.name}
                            </Text>
                            {item.description && (
                              <Text
                                size="xs"
                                c={customColors.neutral[6]}
                                lineClamp={2}
                              >
                                {item.description}
                              </Text>
                            )}
                            {item.category && (
                              <Badge
                                size="xs"
                                variant="light"
                                color="brand"
                                mt="xs"
                              >
                                {item.category}
                              </Badge>
                            )}
                          </Box>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </Group>

                        {/* Cantidad y precio */}
                        <Group justify="space-between" align="center">
                          <NumberInput
                            value={item.quantity}
                            onChange={value =>
                              handleQuantityChange(item.id, value)
                            }
                            min={1}
                            max={99}
                            size="xs"
                            w={80}
                            styles={{
                              input: {
                                textAlign: 'center',
                              },
                            }}
                          />
                          <Box ta="right">
                            <Text size="xs" c={customColors.neutral[6]}>
                              {formatPrice(item.price)} c/u
                            </Text>
                            <Text fw={600} c={customColors.brand[6]}>
                              {formatPrice(
                                (typeof item.price === 'string'
                                  ? parseFloat(item.price)
                                  : item.price) * item.quantity
                              )}
                            </Text>
                          </Box>
                        </Group>
                      </Stack>
                    </Flex>
                  </Box>
                );
              })}
            </Stack>
          </ScrollArea>

          {/* Footer con totales y acciones */}
          <Box
            p="md"
            style={{
              borderTop: `1px solid ${customColors.neutral[2]}`,
              backgroundColor: customColors.neutral[0],
            }}
          >
            <Stack gap="md">
              {/* Resumen de totales */}
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c={customColors.neutral[6]}>
                    Subtotal:
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatPrice(state.total)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c={customColors.neutral[6]}>
                    Envío:
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatPrice(10.0)}
                  </Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text size="lg" fw={700} c={customColors.brand[8]}>
                    Total:
                  </Text>
                  <Text size="lg" fw={700} c={customColors.brand[6]}>
                    {formatPrice(state.total + 10.0)}
                  </Text>
                </Group>
              </Stack>

              {/* Botones de acción */}
              <Stack gap="sm">
                <Button
                  fullWidth
                  size="md"
                  color="brand"
                  onClick={() => {
                    router.push('/cart');
                    onClose();
                  }}
                >
                  Proceder al Pago
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  size="sm"
                  color="brand"
                  onClick={handleNavigateToCart}
                >
                  Ver Carrito Completo
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      )}
    </Drawer>
  );
};
