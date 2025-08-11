'use client';

import { 
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  useMantineTheme,
  useMantineColorScheme
} from '@mantine/core';

export function ThemeTest() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Container size="md" py="xl">
      <Paper p="xl" withBorder>
        <Stack gap="md">
          <div>
            <Title order={2} c="brand.6">Theme Test Component</Title>
            <Text c="dimmed">
              Testing that Mantine theme works without CSS conflicts
            </Text>
          </div>

          <Group>
            <Text>Current color scheme: <strong>{colorScheme}</strong></Text>
            <Button onClick={toggleColorScheme} size="sm" variant="light">
              Toggle {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
          </Group>

          <div>
            <Text fw={500} mb="xs">Font Variables (from Next.js fonts):</Text>
            <Text size="sm" ff="var(--font-geist-sans)">
              Geist Sans: The quick brown fox jumps over the lazy dog
            </Text>
            <Text size="sm" ff="var(--font-geist-mono)">
              Geist Mono: The quick brown fox jumps over the lazy dog
            </Text>
          </div>

          <div>
            <Text fw={500} mb="xs">Theme Colors:</Text>
            <Group>
              <div 
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.brand[6],
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.gray[4]}`
                }}
                title="Brand Color"
              />
              <div 
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.secondary[6],
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.gray[4]}`
                }}
                title="Secondary Color"
              />
              <div 
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.success[6],
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.gray[4]}`
                }}
                title="Success Color"
              />
            </Group>
          </div>

          <div>
            <Text fw={500} mb="xs">Component Styling:</Text>
            <Group>
              <Button color="brand">Brand Button</Button>
              <Button color="secondary">Secondary Button</Button>
              <Button variant="outline" color="success">Outline Success</Button>
            </Group>
          </div>

          <Paper p="md" bg="brand.0" style={{ border: `1px solid ${theme.colors.brand[3]}` }}>
            <Text c="brand.8" fw={500}>
              ✅ Mantine theme is working correctly!
            </Text>
            <Text c="brand.6" size="sm">
              Colors, fonts, and components are properly themed without CSS conflicts.
            </Text>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
}
