# Mantine Theme Setup for E-Commerce

This project uses **Mantine** as the UI library with a custom color palette based on your brand colors: `#1A2A80`, `#3B38A0`, `#7A85C1`, and `#B2B0E8`.

## 🎨 Color Palette

### Brand Colors (Primary)
- **brand.0**: `#f5f6fd` - Lightest backgrounds
- **brand.3**: `#B2B0E8` - Your lightest brand color
- **brand.5**: `#7A85C1` - Your medium brand color  
- **brand.7**: `#3B38A0` - Your medium-dark brand color
- **brand.9**: `#1A2A80` - Your darkest brand color (primary)

### Supporting Colors
- **secondary**: Orange/amber for contrast and CTAs
- **success**: Green for positive actions
- **warning**: Yellow/amber for alerts
- **danger**: Red for errors and destructive actions
- **neutral**: Grays for text and subtle elements

## 🌓 Dark Mode Support

The theme automatically adapts to light/dark mode with proper contrast ratios:
- Uses `defaultColorScheme="auto"` to respect system preferences
- Different color shades for light/dark modes
- Proper contrast for accessibility

## 📦 Project Structure

```
src/
├── theme/
│   ├── colors.ts           # Color definitions
│   ├── theme.ts           # Main theme configuration
│   ├── ThemeProvider.tsx  # Theme provider component
│   ├── utils.ts           # Theme utilities and helpers
│   └── index.ts           # Easy imports
├── components/
│   ├── ColorPaletteDemo.tsx    # Color showcase
│   └── ECommerceExample.tsx    # E-commerce components demo
└── app/
    ├── layout.tsx         # Root layout with theme
    └── page.tsx           # Main page
```

## 🚀 Usage Examples

### Basic Color Usage
```tsx
import { Button } from '@mantine/core';
import { getColor } from '@/theme/colors';

// Using color in components
<Button color="brand">Primary Button</Button>

// Using color in styles
const styles = {
  backgroundColor: getColor('brand', 6),
  color: getColor('neutral', 0)
};
```

### Dark Mode Toggle
```tsx
import { useMantineColorScheme } from '@mantine/core';

function DarkModeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
  return (
    <Button onClick={() => toggleColorScheme()}>
      {colorScheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </Button>
  );
}
```

### Custom Theme Hook
```tsx
import { useCustomTheme } from '@/theme/utils';

function MyComponent() {
  const theme = useCustomTheme();
  
  return (
    <div style={{ color: theme.getColor('brand', 6) }}>
      Themed content
    </div>
  );
}
```

## 🛍️ E-Commerce Specific Features

### Product Cards
- Consistent brand colors
- Sale/New badges with appropriate colors
- Price highlighting with brand colors
- Hover effects and animations

### Status Indicators
- **Success** (green): Completed orders, in stock
- **Warning** (yellow): Low stock, pending
- **Danger** (red): Out of stock, errors
- **Brand** (purple): Processing, featured items

### Call-to-Action Buttons
- Primary actions use `brand` color
- Secondary actions use `secondary` color
- Success actions (checkout) use `success` color
- Warning actions use `warning` color

## 📱 Responsive Design

The theme includes responsive breakpoints:
- **xs**: `30em` (480px)
- **sm**: `48em` (768px) 
- **md**: `64em` (1024px)
- **lg**: `74em` (1184px)
- **xl**: `90em` (1440px)

## ⚡ Performance

- Colors are pre-computed for performance
- Theme provider is optimized for SSR
- Automatic color scheme detection
- Minimal re-renders on theme changes

## 🔧 Customization

### Adding New Colors
```typescript
// In src/theme/colors.ts
export const customColors = {
  // ... existing colors
  tertiary: [
    // Add 10 shades from light to dark
  ] as MantineColorsTuple,
};
```

### Modifying Components
```typescript
// In src/theme/theme.ts
components: {
  Button: {
    defaultProps: {
      radius: 'md', // Change default radius
    },
    styles: {
      root: {
        // Add custom styles
      },
    },
  },
}
```

## 🎯 Best Practices

1. **Use semantic color names**: `brand`, `success`, `warning`, `danger`
2. **Respect dark mode**: Always test in both light and dark themes
3. **Maintain contrast**: Ensure text is readable on all backgrounds
4. **Be consistent**: Use the same color for similar actions across the app
5. **Test accessibility**: Use tools to verify contrast ratios

## 📚 Resources

- [Mantine Documentation](https://mantine.dev)
- [Color Palette Generator](https://mantine.dev/colors-generator/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
