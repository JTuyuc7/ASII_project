'use client';

import { 
  Card, 
  Image, 
  Text, 
  Badge, 
  Button, 
  Group, 
  Stack,
  Grid,
  Paper,
  Title,
  ActionIcon,
  NumberInput,
  useMantineTheme
} from '@mantine/core';
import { getColor } from '@/theme/colors';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
}

function ProductCard({ title, price, originalPrice, image, badge, badgeColor = 'brand', rating }: ProductCardProps) {
  const theme = useMantineTheme();
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              height: 200,
              backgroundColor: getColor('neutral', 1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getColor('neutral', 6),
              fontSize: '14px',
            }}
          >
            Product Image
          </div>
          {badge && (
            <Badge
              color={badgeColor}
              variant="filled"
              style={{ position: 'absolute', top: 10, left: 10 }}
            >
              {badge}
            </Badge>
          )}
        </div>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} lineClamp={2}>
          {title}
        </Text>
        {rating && (
          <Badge color="warning" variant="light" size="sm">
            ⭐ {rating}
          </Badge>
        )}
      </Group>

      <Group justify="space-between" align="flex-end">
        <div>
          <Text size="xl" fw={700} c="brand.6">
            ${price}
          </Text>
          {originalPrice && (
            <Text size="sm" td="line-through" c="dimmed">
              ${originalPrice}
            </Text>
          )}
        </div>
        <Button color="brand" size="sm">
          Add to Cart
        </Button>
      </Group>
    </Card>
  );
}

function ShoppingCart() {
  const theme = useMantineTheme();
  
  return (
    <Paper p="lg" withBorder>
      <Title order={3} mb="md" c="brand.6">Shopping Cart</Title>
      <Stack gap="sm">
        <Group justify="space-between" p="sm" style={{ borderRadius: theme.radius.sm, backgroundColor: getColor('brand', 0) }}>
          <div>
            <Text fw={500} size="sm">Wireless Headphones</Text>
            <Text size="xs" c="dimmed">Premium Quality</Text>
          </div>
          <Group gap="xs">
            <NumberInput 
              size="xs" 
              w={60} 
              defaultValue={1} 
              min={1}
              styles={{ input: { textAlign: 'center' } }}
            />
            <Text fw={500} c="brand.7">$89.99</Text>
          </Group>
        </Group>
        
        <Group justify="space-between" align="flex-end" mt="md">
          <div>
            <Text size="sm">Subtotal: $89.99</Text>
            <Text size="sm">Shipping: Free</Text>
            <Text fw={700} size="lg" c="brand.6">Total: $89.99</Text>
          </div>
          <Button color="success" size="md">
            Checkout
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

export function ECommerceExample() {
  const mockProducts = [
    {
      title: "Wireless Bluetooth Headphones",
      price: 89.99,
      originalPrice: 129.99,
      image: "",
      badge: "Sale",
      badgeColor: "danger",
      rating: 4.5
    },
    {
      title: "Smart Fitness Watch",
      price: 199.99,
      image: "",
      badge: "New",
      badgeColor: "success",
      rating: 4.8
    },
    {
      title: "Portable Phone Charger",
      price: 29.99,
      originalPrice: 39.99,
      image: "",
      badge: "Popular",
      badgeColor: "warning",
      rating: 4.3
    },
  ];

  return (
    <Stack gap="xl" p="md">
      <div>
        <Title order={1} mb="xs" c="brand.6">E-Commerce Components</Title>
        <Text c="dimmed">
          Examples of how your color palette works in real e-commerce scenarios
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="lg" withBorder>
            <Title order={2} mb="md">Featured Products</Title>
            <Grid>
              {mockProducts.map((product, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
                  <ProductCard {...product} />
                </Grid.Col>
              ))}
            </Grid>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <ShoppingCart />
        </Grid.Col>
      </Grid>

      {/* Action Buttons */}
      <Paper p="lg" withBorder>
        <Title order={3} mb="md" c="brand.6">Call-to-Action Buttons</Title>
        <Group>
          <Button color="brand" size="lg">
            Shop Now
          </Button>
          <Button color="secondary" size="lg">
            View Catalog
          </Button>
          <Button variant="outline" color="success" size="lg">
            Special Offers
          </Button>
          <Button variant="light" color="warning" size="lg">
            Track Order
          </Button>
        </Group>
      </Paper>

      {/* Status Indicators */}
      <Paper p="lg" withBorder>
        <Title order={3} mb="md" c="brand.6">Order Status</Title>
        <Stack gap="md">
          <Group justify="space-between" p="sm" style={{ backgroundColor: getColor('success', 0), borderRadius: 8 }}>
            <Text c="success.7">Order #12345 - Delivered</Text>
            <Badge color="success" variant="filled">Complete</Badge>
          </Group>
          <Group justify="space-between" p="sm" style={{ backgroundColor: getColor('warning', 0), borderRadius: 8 }}>
            <Text c="warning.7">Order #12346 - In Transit</Text>
            <Badge color="warning" variant="filled">Shipping</Badge>
          </Group>
          <Group justify="space-between" p="sm" style={{ backgroundColor: getColor('brand', 0), borderRadius: 8 }}>
            <Text c="brand.7">Order #12347 - Processing</Text>
            <Badge color="brand" variant="filled">Pending</Badge>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
