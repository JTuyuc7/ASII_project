'use client';

import { CartItem, useCart } from '@/contexts/CartContext';
import { customColors } from '@/theme/colors';
import { ActionIcon, Button, Group, NumberInput } from '@mantine/core';
import { IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import React from 'react';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'outline' | 'subtle';
  fullWidth?: boolean;
  showQuantityControls?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  size = 'md',
  variant = 'filled',
  fullWidth = false,
  showQuantityControls = false,
}) => {
  const { addItem, updateQuantity, removeItem, getItemQuantity, isItemInCart } = useCart();

  const currentQuantity = getItemQuantity(product.id);
  const inCart = isItemInCart(product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleIncrement = () => {
    if (inCart) {
      updateQuantity(product.id, currentQuantity + 1);
    } else {
      addItem(product);
    }
  };

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      updateQuantity(product.id, currentQuantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  const handleQuantityChange = (value: number | string) => {
    const quantity = typeof value === 'string' ? parseInt(value) || 0 : value;
    if (quantity <= 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity);
    }
  };

  if (showQuantityControls && inCart) {
    return (
      <Group gap="xs" justify="center">
        <ActionIcon
          variant="outline"
          color="brand"
          onClick={handleDecrement}
          size={size}
        >
          <IconMinus size={16} />
        </ActionIcon>

        <NumberInput
          value={currentQuantity}
          onChange={handleQuantityChange}
          min={0}
          max={99}
          size={size}
          w={70}
          hideControls
          styles={{
            input: {
              textAlign: 'center',
              backgroundColor: customColors.neutral[0],
            },
          }}
        />

        <ActionIcon
          variant="outline"
          color="brand"
          onClick={handleIncrement}
          size={size}
        >
          <IconPlus size={16} />
        </ActionIcon>
      </Group>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      variant={variant}
      color="brand"
      fullWidth={fullWidth}
      leftSection={<IconShoppingCart size={16} />}
      styles={{
        root: {
          '&:hover': {
            backgroundColor: inCart ? customColors.success[6] : undefined,
          },
        },
      }}
    >
      {inCart ? `En carrito (${currentQuantity})` : 'Agregar al carrito'}
    </Button>
  );
};
