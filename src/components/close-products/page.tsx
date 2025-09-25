'use client';

import { Box, Container, Grid, Group, Text, Title } from '@mantine/core';
import { IconMapPin, IconTruck, IconUser } from '@tabler/icons-react';
import { customColors } from '../../theme';
import MapClient from '../maps';
export const dynamic = 'force-dynamic';

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
                  30 productos a menos de 10 km
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
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box
            style={{
              backgroundColor: 'gray',
            }}
          >
            <MapClient />
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
