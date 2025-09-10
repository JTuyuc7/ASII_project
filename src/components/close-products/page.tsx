'use client';

import {
  Box,
  Container,
  Grid,
  Group,
  Paper,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { IconMapPin, IconTruck, IconUser } from '@tabler/icons-react';
import { customColors } from '../../theme';

export default function CloseProducts() {
  return (
    <Container size="xl" py="xl">
      <Grid align="center" gutter="xl">
        {/* Left Column - Content */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box>
            {/* Title */}
            <Title
              order={2}
              size="h1"
              fw={700}
              c={customColors.neutral[9]}
              mb="md"
            >
              Productos cerca de ti
            </Title>

            {/* Subtitle */}
            <Text size="lg" c={customColors.neutral[6]} mb="xl" lh={1.4}>
              Encuentra repuestos en tu área y ahorra en envío
            </Text>

            {/* Features */}
            <Box>
              {/* Products count */}
              <Group mb="lg" gap="sm">
                <IconMapPin
                  size={20}
                  color={customColors.brand[6]}
                  stroke={1.5}
                />
                <Text size="md" c={customColors.neutral[7]} fw={500}>
                  123 productos a menos de 10 km
                </Text>
              </Group>

              {/* Same day delivery */}
              <Group mb="lg" gap="sm">
                <IconTruck
                  size={20}
                  color={customColors.brand[6]}
                  stroke={1.5}
                />
                <Text size="md" c={customColors.neutral[7]} fw={500}>
                  Entrega el mismo día disponible
                </Text>
              </Group>

              {/* Pickup option */}
              <Group mb="lg" gap="sm">
                <IconUser
                  size={20}
                  color={customColors.brand[6]}
                  stroke={1.5}
                />
                <Text size="md" c={customColors.neutral[7]} fw={500}>
                  Recogida en persona
                </Text>
              </Group>
            </Box>
          </Box>
        </Grid.Col>

        {/* Right Column - Map */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            shadow="sm"
            radius="lg"
            style={{
              height: rem(300),
              backgroundColor: customColors.neutral[2],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${customColors.neutral[3]}`,
            }}
          >
            <Box ta="center">
              <IconMapPin
                size={48}
                color={customColors.neutral[5]}
                stroke={1}
              />
              <Text size="lg" c={customColors.neutral[6]} mt="sm" fw={500}>
                Mapa de ubicaciones
              </Text>
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
