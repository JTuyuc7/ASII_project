// Utility hooks and functions for the e-commerce theme

import { useMantineTheme } from '@mantine/core';
import { customColors, getColor } from './colors';

// Hook to get theme with typed custom colors
export function useCustomTheme() {
  const theme = useMantineTheme();
  return {
    ...theme,
    customColors,
    getColor,
  };
}

// Common e-commerce color combinations
export const colorSchemes = {
  primary: {
    main: getColor('brand', 6),
    light: getColor('brand', 1),
    dark: getColor('brand', 8),
    contrast: '#ffffff',
  },
  secondary: {
    main: getColor('secondary', 6),
    light: getColor('secondary', 1),
    dark: getColor('secondary', 8),
    contrast: '#ffffff',
  },
  success: {
    main: getColor('success', 6),
    light: getColor('success', 1),
    dark: getColor('success', 8),
    contrast: '#ffffff',
  },
  warning: {
    main: getColor('warning', 6),
    light: getColor('warning', 1),
    dark: getColor('warning', 8),
    contrast: '#000000',
  },
  error: {
    main: getColor('danger', 6),
    light: getColor('danger', 1),
    dark: getColor('danger', 8),
    contrast: '#ffffff',
  },
};

// Common spacing values for e-commerce layouts
export const spacing = {
  cardPadding: 'md',
  sectionGap: 'xl',
  contentPadding: 'lg',
  buttonGap: 'sm',
};

// Common shadow presets
export const shadows = {
  card: 'sm',
  elevated: 'md',
  floating: 'lg',
  modal: 'xl',
};

// Responsive breakpoint helpers
export const breakpoints = {
  mobile: '48em',
  tablet: '64em',
  desktop: '74em',
  wide: '90em',
};
