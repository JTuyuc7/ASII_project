'use client';

import { useCart } from '@/contexts/CartContext';
import { customColors } from '@/theme/colors';
import { ActionIcon, Indicator, Tooltip } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import React from 'react';

interface CartIconProps {
  size?: number;
  onClick?: () => void;
}

export const CartIcon: React.FC<CartIconProps> = ({
  size = 24,
  onClick
}) => {
  const { state, toggleCart } = useCart();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleCart();
    }
  };

  return (
    <Tooltip label={`Carrito (${state.itemCount} productos)`} position="bottom">
      <Indicator
        inline
        size={18}
        label={state.itemCount}
        disabled={state.itemCount === 0}
        color="brand"
        styles={{
          indicator: {
            backgroundColor: customColors.brand[6],
            color: 'white',
            border: `2px solid ${customColors.neutral[0]}`,
          },
        }}
      >
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={handleClick}
          style={{
            color: customColors.brand[6],
            '&:hover': {
              backgroundColor: customColors.brand[0],
            },
          }}
        >
          <IconShoppingCart size={size} />
        </ActionIcon>
      </Indicator>
    </Tooltip>
  );
};
