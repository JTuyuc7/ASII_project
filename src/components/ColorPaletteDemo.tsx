'use client';

import { 
  Stack, 
  Button, 
  Card, 
  Text, 
  Title, 
  Group, 
  Badge,
  Paper,
  Grid,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  Box,
  Flex
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { customColors, getColor } from '@/theme/colors';

export function ColorPaletteDemo() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const showNotification = (color: string, colorName: string) => {
    notifications.show({
      title: `${colorName} Color`,
      message: `This notification showcases the ${colorName.toLowerCase()} color from your custom palette in ${colorScheme} mode.`,
      color,
      autoClose: 4000,
    });
  };

  return (
    <Stack gap="xl" p="md">
      {/* Header with Dark Mode Toggle */}
      <Flex justify="space-between" align="center">
        <div>
          <Title order={1} mb="xs" c="brand.6">Your Custom Color Palette</Title>
          <Text c="dimmed">
            Brand colors: #1A2A80, #3B38A0, #7A85C1, #B2B0E8 integrated with Mantine
          </Text>
        </div>
        <Button
          onClick={() => toggleColorScheme()}
          variant="outline"
          size="sm"
        >
          {colorScheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </Flex>

      {/* Your Brand Colors Display */}
      <Paper p="md" withBorder>
        <Title order={2} mb="md">Your Brand Colors</Title>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder>
              <Box
                style={{
                  height: 60,
                  backgroundColor: '#1A2A80',
                  borderRadius: theme.radius.sm,
                  marginBottom: theme.spacing.xs,
                }}
              />
              <Text fw={500} size="sm">#1A2A80</Text>
              <Text size="xs" c="dimmed">Primary Dark</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder>
              <Box
                style={{
                  height: 60,
                  backgroundColor: '#3B38A0',
                  borderRadius: theme.radius.sm,
                  marginBottom: theme.spacing.xs,
                }}
              />
              <Text fw={500} size="sm">#3B38A0</Text>
              <Text size="xs" c="dimmed">Primary Medium</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder>
              <Box
                style={{
                  height: 60,
                  backgroundColor: '#7A85C1',
                  borderRadius: theme.radius.sm,
                  marginBottom: theme.spacing.xs,
                }}
              />
              <Text fw={500} size="sm">#7A85C1</Text>
              <Text size="xs" c="dimmed">Primary Light</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Card withBorder>
              <Box
                style={{
                  height: 60,
                  backgroundColor: '#B2B0E8',
                  borderRadius: theme.radius.sm,
                  marginBottom: theme.spacing.xs,
                }}
              />
              <Text fw={500} size="sm">#B2B0E8</Text>
              <Text size="xs" c="dimmed">Primary Lightest</Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Full Color Palette Display */}
      <Paper p="md" withBorder>
        <Title order={2} mb="md">Complete Color Palette</Title>
        <Grid>
          {Object.entries(customColors).filter(([name]) => name !== 'darkBrand').map(([colorName, shades]) => (
            <Grid.Col key={colorName} span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder>
                <Text fw={500} mb="xs" tt="capitalize">{colorName}</Text>
                <Group gap="xs">
                  {shades.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: getColor(colorName as keyof typeof customColors, index),
                        borderRadius: theme.radius.sm,
                        border: '1px solid',
                        borderColor: colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3],
                      }}
                      title={`${colorName}-${index}`}
                    />
                  ))}
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>

      {/* Component Examples */}
      <Paper p="md" withBorder>
        <Title order={2} mb="md">Component Examples in {colorScheme} Mode</Title>
        <Stack gap="md">
          {/* Buttons */}
          <div>
            <Text fw={500} mb="xs">Buttons</Text>
            <Group>
              <Button color="brand">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button color="success">Success</Button>
              <Button color="warning">Warning</Button>
              <Button color="danger">Danger</Button>
              <Button variant="outline" color="brand">Outline</Button>
              <Button variant="light" color="brand">Light</Button>
            </Group>
          </div>

          {/* Badges */}
          <div>
            <Text fw={500} mb="xs">Badges</Text>
            <Group>
              <Badge color="brand" variant="filled">Brand</Badge>
              <Badge color="secondary" variant="filled">Secondary</Badge>
              <Badge color="success" variant="filled">Success</Badge>
              <Badge color="warning" variant="filled">Warning</Badge>
              <Badge color="danger" variant="filled">Danger</Badge>
              <Badge color="brand" variant="outline">Outline</Badge>
              <Badge color="brand" variant="light">Light</Badge>
            </Group>
          </div>

          {/* Cards with different variants */}
          <div>
            <Text fw={500} mb="xs">Cards</Text>
            <Grid>
              <Grid.Col span={4}>
                <Card withBorder>
                  <Text fw={500} mb="xs">Default Card</Text>
                  <Text size="sm" c="dimmed">This is a default card with your theme applied.</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card withBorder shadow="md">
                  <Text fw={500} mb="xs">Elevated Card</Text>
                  <Text size="sm" c="dimmed">This card has more shadow for emphasis.</Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card withBorder style={{ backgroundColor: getColor('brand', 0) }}>
                  <Text fw={500} mb="xs" c="brand.9">Branded Card</Text>
                  <Text size="sm" c="brand.7">Using your brand colors as background.</Text>
                </Card>
              </Grid.Col>
            </Grid>
          </div>

          {/* Notifications */}
          <div>
            <Text fw={500} mb="xs">Notifications (Click to test)</Text>
            <Group>
              <Button 
                variant="light" 
                color="brand"
                onClick={() => showNotification('brand', 'Brand')}
              >
                Brand Notification
              </Button>
              <Button 
                variant="light" 
                color="success"
                onClick={() => showNotification('success', 'Success')}
              >
                Success Notification
              </Button>
              <Button 
                variant="light" 
                color="warning"
                onClick={() => showNotification('warning', 'Warning')}
              >
                Warning Notification
              </Button>
              <Button 
                variant="light" 
                color="danger"
                onClick={() => showNotification('danger', 'Error')}
              >
                Error Notification
              </Button>
            </Group>
          </div>
        </Stack>
      </Paper>

      {/* Usage Examples */}
      <Paper p="md" withBorder>
        <Title order={2} mb="md">How to Use These Colors</Title>
        <Stack gap="sm">
          <Text>
            <strong>Import colors:</strong> <Text component="span" ff="monospace" c="blue">{`import { getColor } from '@/theme/colors';`}</Text>
          </Text>
          <Text>
            <strong>Use in styles:</strong> <Text component="span" ff="monospace" c="blue">{`backgroundColor: getColor('brand', 6)`}</Text>
          </Text>
          <Text>
            <strong>Use in components:</strong> <Text component="span" ff="monospace" c="blue">{`<Button color="brand">Click me</Button>`}</Text>
          </Text>
          <Text>
            <strong>Access theme:</strong> <Text component="span" ff="monospace" c="blue">{`const theme = useMantineTheme();`}</Text>
          </Text>
          <Text>
            <strong>Toggle dark mode:</strong> <Text component="span" ff="monospace" c="blue">{`const { toggleColorScheme } = useMantineColorScheme();`}</Text>
          </Text>
        </Stack>
      </Paper>

      {/* E-commerce Context */}
      <Paper p="md" withBorder style={{ backgroundColor: getColor('brand', colorScheme === 'dark' ? 9 : 0) }}>
        <Title order={3} mb="md" c={colorScheme === 'dark' ? 'brand.2' : 'brand.8'}>Perfect for E-Commerce</Title>
        <Text c={colorScheme === 'dark' ? 'brand.3' : 'brand.7'} mb="md">
          Your purple-based color palette creates a professional, trustworthy appearance ideal for e-commerce:
        </Text>
        <Stack gap="xs">
          <Text size="sm" c={colorScheme === 'dark' ? 'brand.4' : 'brand.6'}>• Purple conveys luxury, creativity, and premium quality</Text>
          <Text size="sm" c={colorScheme === 'dark' ? 'brand.4' : 'brand.6'}>• High contrast ratios ensure accessibility in both light and dark modes</Text>
          <Text size="sm" c={colorScheme === 'dark' ? 'brand.4' : 'brand.6'}>• Complementary orange accents draw attention to CTAs</Text>
          <Text size="sm" c={colorScheme === 'dark' ? 'brand.4' : 'brand.6'}>• Neutral grays provide excellent readability for product descriptions</Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
