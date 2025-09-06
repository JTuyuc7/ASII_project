'use client';

import { customColors } from '@/theme/colors';
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBolt,
  IconChevronRight,
  IconEngine,
  IconPackage,
  IconSettings,
  IconStar,
  IconTool,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

// Category configuration
const categoryConfig = {
  motor: {
    title: 'Repuestos de Motor',
    icon: IconEngine,
    color: 'brand' as const,
    description:
      'Encuentra todos los repuestos y componentes para el motor de tu vehículo. Desde filtros hasta piezas de alta performance.',
    subcategories: [
      'Filtros de aceite',
      'Bujías',
      'Correas',
      'Bombas de agua',
      'Válvulas',
      'Pistones',
    ],
    featuredProducts: [
      { name: 'Filtro de aceite Premium', price: 'Q 45.00', rating: 4.8 },
      { name: 'Bujías NGK Iridium', price: 'Q 120.00', rating: 4.9 },
      { name: 'Correa de distribución', price: 'Q 350.00', rating: 4.7 },
      { name: 'Bomba de agua universal', price: 'Q 280.00', rating: 4.6 },
    ],
  },
  transmision: {
    title: 'Sistemas de Transmisión',
    icon: IconSettings,
    color: 'secondary' as const,
    description:
      'Componentes para sistemas de transmisión manual y automática. Mantén tu transmisión funcionando perfectamente.',
    subcategories: [
      'Embragues',
      'Sincronizadores',
      'Aceites de transmisión',
      'Volantes',
      'Cojinetes',
      'Juntas',
    ],
    featuredProducts: [
      { name: 'Kit de embrague completo', price: 'Q 950.00', rating: 4.7 },
      { name: 'Aceite ATF sintético', price: 'Q 180.00', rating: 4.8 },
      { name: 'Sincronizadores 3ra velocidad', price: 'Q 420.00', rating: 4.5 },
      { name: 'Volante bimasa', price: 'Q 1,200.00', rating: 4.6 },
    ],
  },
  electrico: {
    title: 'Componentes Eléctricos',
    icon: IconBolt,
    color: 'warning' as const,
    description:
      'Sistemas eléctricos y electrónicos para tu vehículo. Desde baterías hasta sistemas de iluminación avanzados.',
    subcategories: [
      'Baterías',
      'Alternadores',
      'Luces LED',
      'Fusibles',
      'Cables',
      'Sensores',
    ],
    featuredProducts: [
      { name: 'Batería 12V 65Ah', price: 'Q 750.00', rating: 4.6 },
      { name: 'Kit luces LED H4', price: 'Q 320.00', rating: 4.9 },
      { name: 'Alternador 90A', price: 'Q 580.00', rating: 4.4 },
      { name: 'Sensor de oxígeno', price: 'Q 450.00', rating: 4.7 },
    ],
  },
  herramientas: {
    title: 'Herramientas Profesionales',
    icon: IconTool,
    color: 'success' as const,
    description:
      'Herramientas de calidad profesional para mantenimiento y reparación automotriz. Todo lo que necesitas para tu taller.',
    subcategories: [
      'Llaves',
      'Destornilladores',
      'Extractores',
      'Medidores',
      'Lubricantes',
      'Equipos diagnóstico',
    ],
    featuredProducts: [
      { name: 'Set llaves mixtas 32 piezas', price: 'Q 450.00', rating: 4.8 },
      { name: 'Scanner OBD2 profesional', price: 'Q 1,800.00', rating: 4.9 },
      { name: 'Extractor de rodamientos', price: 'Q 320.00', rating: 4.5 },
      { name: 'Aceite penetrante WD-40', price: 'Q 65.00', rating: 4.7 },
    ],
  },
};

//interface CategoryPageProps {
//  params: { slug: string };
//}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const category = useMemo(() => {
    return categoryConfig[slug as keyof typeof categoryConfig];
  }, [slug]);

  if (!category) {
    return (
      <Container size="xl" py="xl">
        <Box ta="center">
          <Title order={2} mb="md">
            Categoría no encontrada
          </Title>
          <Text size="lg" mb="xl" c="dimmed">
            La categoría que buscas no existe o ha sido movida.
          </Text>
          <Button variant="filled" onClick={() => router.push('/')}>
            Volver al inicio
          </Button>
        </Box>
      </Container>
    );
  }

  const { title, icon: Icon, color, description, featuredProducts } = category;

  const breadcrumbItems = [
    { title: 'Inicio', href: '/' },
    { title: 'Categorías', href: '#' },
    { title: title, href: `/category/${slug}` },
  ].map((item, index) => (
    <Anchor
      key={index}
      onClick={() => item.href !== '#' && router.push(item.href)}
      style={{
        color:
          item.href === '#' ? customColors.neutral[6] : customColors[color][6],
        textDecoration: 'none',
        cursor: item.href === '#' ? 'default' : 'pointer',
      }}
    >
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="xl" py="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs
        mb="xl"
        separator={<IconChevronRight size={16} stroke={1.5} />}
        styles={{
          separator: { color: customColors.neutral[5] },
        }}
      >
        {breadcrumbItems}
      </Breadcrumbs>

      {/* Header */}
      <Box mb="xl">
        <Group mb="lg">
          <ThemeIcon
            size={60}
            radius="lg"
            variant="light"
            color={color}
            styles={{
              root: {
                backgroundColor: customColors[color][0],
                border: `2px solid ${customColors[color][2]}`,
              },
            }}
          >
            <Icon size={32} stroke={1.5} />
          </ThemeIcon>

          <Box>
            <Title
              order={1}
              mb="xs"
              style={{
                color: customColors.neutral[9],
                fontSize: '2.5rem',
                fontWeight: 700,
              }}
            >
              {title}
            </Title>

            <Badge
              variant="light"
              color={color}
              size="lg"
              styles={{
                root: {
                  backgroundColor: customColors[color][0],
                  color: customColors[color][7],
                },
              }}
            >
              {featuredProducts.length} productos destacados
            </Badge>
          </Box>
        </Group>

        <Text
          size="lg"
          style={{
            color: customColors.neutral[6],
            lineHeight: 1.6,
            maxWidth: '800px',
          }}
        >
          {description}
        </Text>
      </Box>

      <Divider mb="xl" />

      {/* Content Grid */}
      <Grid gutter="xl">
        {/* Subcategories TODO: check if this is required */}
        {/* <Grid.Col span={{ base: 12, md: 4 }}>
          <Card p="xl" radius="lg" withBorder>
            <Title
              order={3}
              mb="lg"
              style={{
                color: customColors.neutral[9],
                fontWeight: 600,
              }}
            >
              Subcategorías
            </Title>

            <Stack gap="sm">
              {subcategories.map((subcategory, index) => (
                <Group
                  key={index}
                  justify="space-between"
                  p="sm"
                  style={{
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: `1px solid transparent`,
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        backgroundColor: customColors[color][0],
                        borderColor: customColors[color][2],
                      }
                    }
                  }}
                >
                  <Text
                    style={{
                      color: customColors.neutral[7],
                      fontWeight: 500,
                    }}
                  >
                    {subcategory}
                  </Text>
                  <IconChevronRight
                    size={16}
                    stroke={1.5}
                    color={customColors.neutral[5]}
                  />
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col> */}

        {/* Featured Products */}
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Box mb="lg">
            <Title
              order={3}
              mb="md"
              style={{
                color: customColors.neutral[9],
                fontWeight: 600,
              }}
            >
              Productos Destacados
            </Title>

            <Text
              size="md"
              style={{
                color: customColors.neutral[6],
              }}
            >
              Los productos más populares en esta categoría
            </Text>
          </Box>

          <Grid gutter="md">
            {featuredProducts.map((product, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                <Card
                  p="lg"
                  radius="lg"
                  withBorder
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                        borderColor: customColors[color][3],
                      },
                    },
                  }}
                >
                  <Group justify="space-between" mb="md">
                    <ThemeIcon
                      size={40}
                      radius="md"
                      variant="light"
                      color={color}
                    >
                      <IconPackage size={20} stroke={1.5} />
                    </ThemeIcon>

                    <Group gap="xs">
                      <IconStar
                        size={16}
                        fill={customColors.warning[5]}
                        color={customColors.warning[5]}
                      />
                      <Text size="sm" fw={500}>
                        {product.rating}
                      </Text>
                    </Group>
                  </Group>

                  <Title
                    order={5}
                    mb="xs"
                    style={{
                      color: customColors.neutral[9],
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </Title>

                  <Text
                    size="xl"
                    fw={700}
                    style={{
                      color: customColors[color][6],
                    }}
                  >
                    {product.price}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Box mt="xl" ta="center">
            <Button
              variant="filled"
              color={color}
              size="lg"
              radius="md"
              styles={{
                root: {
                  backgroundColor: customColors[color][6],
                  '&:hover': {
                    backgroundColor: customColors[color][7],
                    transform: 'translateY(-1px)',
                  },
                },
              }}
            >
              Ver todos los productos
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
