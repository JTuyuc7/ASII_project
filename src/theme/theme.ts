import { createTheme } from '@mantine/core';
import { customColors } from './colors';

export const theme = createTheme({
  // Color scheme
  colors: customColors,
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 4 }, // Different shades for light/dark mode

  // White and black overrides for better contrast in dark mode
  white: '#ffffff',
  black: '#1a1b1e',

  // Typography
  fontFamily:
    'Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'var(--font-geist-mono), Monaco, Courier, monospace',
  headings: {
    fontFamily:
      'Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2' },
      h2: { fontSize: '2rem', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', lineHeight: '1.4' },
      h5: { fontSize: '1.125rem', lineHeight: '1.5' },
      h6: { fontSize: '1rem', lineHeight: '1.5' },
    },
  },

  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  // Border radius
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Component specific overrides
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 0.15s ease',
          '&[data-variant="filled"]:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
        withBorder: true,
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'xs',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        shadow: 'lg',
      },
    },
    Notification: {
      defaultProps: {
        radius: 'md',
      },
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },

  // Other theme properties
  other: {
    // E-commerce specific values
    headerHeight: '4rem',
    footerHeight: '12rem',
    sidebarWidth: '16rem',
    contentMaxWidth: '75rem',

    // Animation durations
    transitionSpeed: '0.15s',
    transitionSpeedSlow: '0.3s',

    // Z-index values
    zIndex: {
      dropdown: 1000,
      sticky: 1010,
      fixed: 1020,
      modalBackdrop: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
    },
  },
});
