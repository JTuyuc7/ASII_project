'use client';

import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import Image from 'next/image';

const BannerShopPage = () => {
  return (
    <Container size="xl" py={40}>
      <Grid gutter={40} align="center">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={1} mb={12} fw={700} size="2.5rem">
            Encuentra los repuestos que necesitas
          </Title>
          <Text size="lg" color="dimmed" mb={32}>
            Compra y vende autopartes nuevas y usadas cerca de ti
          </Text>
          <Group>
            <Button size="lg" radius="md" color="dark">
              Explorar productos
            </Button>
            <Button size="lg" radius="md" variant="default">
              Vender repuestos
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper
            withBorder
            radius="md"
            h={320}
            bg="gray.2"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* <Text color="dimmed" size="xl">Imagen de autopartes</Text> */}
            <Image
              src="/bannerImg.jpg"
              alt="Imagen de autopartes"
              fill
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default BannerShopPage;
