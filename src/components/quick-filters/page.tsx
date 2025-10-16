'use client';

import { customColors } from '@/theme/colors';
import {
  Box,
  Card,
  Container,
  Grid,
  Group,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconArmchair,
  IconArrowRight,
  IconBolt,
  IconCar,
  IconCircle,
  IconDisc,
  IconDotsCircleHorizontal,
  IconDroplet,
  IconEngine,
  IconFilter,
  IconSettings,
  IconTool,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface FilterCard {
  id: string;
  title: string;
  icon: React.FC<any>;
  description: string;
  color: keyof typeof customColors;
  categoria: string;
}

const filterCards: FilterCard[] = [
  {
    id: 'motor',
    title: 'Motor',
    icon: IconEngine,
    description: 'Componentes y repuestos para motores',
    color: 'brand',
    categoria: 'motor',
  },
  {
    id: 'transmision',
    title: 'Transmisión',
    icon: IconSettings,
    description: 'Sistemas de transmisión y embrague',
    color: 'secondary',
    categoria: 'transmision',
  },
  {
    id: 'suspension',
    title: 'Suspensión',
    icon: IconTool,
    description: 'Amortiguadores y componentes de suspensión',
    color: 'warning',
    categoria: 'suspension',
  },
  {
    id: 'frenos',
    title: 'Frenos',
    icon: IconCircle,
    description: 'Pastillas, discos y sistemas de frenos',
    color: 'success',
    categoria: 'frenos',
  },
  {
    id: 'electrico',
    title: 'Sistema Eléctrico',
    icon: IconBolt,
    description: 'Componentes eléctricos y electrónicos',
    color: 'brand',
    categoria: 'electrico',
  },
  {
    id: 'carroceria',
    title: 'Carrocería',
    icon: IconCar,
    description: 'Piezas y accesorios de carrocería',
    color: 'secondary',
    categoria: 'carroceria',
  },
  {
    id: 'interior',
    title: 'Interior',
    icon: IconArmchair,
    description: 'Accesorios y componentes del interior',
    color: 'warning',
    categoria: 'interior',
  },
  {
    id: 'neumaticos',
    title: 'Neumáticos',
    icon: IconDisc,
    description: 'Neumáticos y componentes de ruedas',
    color: 'success',
    categoria: 'neumaticos',
  },
  {
    id: 'aceites',
    title: 'Aceites y Lubricantes',
    icon: IconDroplet,
    description: 'Aceites, lubricantes y fluidos',
    color: 'brand',
    categoria: 'aceites',
  },
  {
    id: 'filtros',
    title: 'Filtros',
    icon: IconFilter,
    description: 'Filtros de aire, aceite y combustible',
    color: 'secondary',
    categoria: 'filtros',
  },
  {
    id: 'otros',
    title: 'Otros',
    icon: IconDotsCircleHorizontal,
    description: 'Otros repuestos y accesorios',
    color: 'warning',
    categoria: 'otros',
  },
];

interface QuickFilterCardProps {
  card: FilterCard;
  onClick: () => void;
}

function QuickFilterCard({ card, onClick }: QuickFilterCardProps) {
  const { title, icon: Icon, description, color } = card;

  return (
    <Card
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: `1px solid ${customColors.neutral[2]}`,
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      styles={{
        root: {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px rgba(0, 0, 0, 0.12)`,
            borderColor: customColors[color][3],
            backgroundColor: customColors[color][0],
          },
          '&:active': {
            transform: 'translateY(-2px)',
          },
        },
      }}
      p="xl"
      radius="lg"
    >
      <Group justify="space-between" mb="md">
        <ThemeIcon
          size={50}
          radius="lg"
          variant="light"
          color={color}
          styles={{
            root: {
              backgroundColor: customColors[color][0],
              border: `1px solid ${customColors[color][2]}`,
            },
          }}
        >
          <Icon size={24} stroke={1.5} />
        </ThemeIcon>

        <ThemeIcon
          size={30}
          radius="xl"
          variant="subtle"
          color={color}
          styles={{
            root: {
              opacity: 0.6,
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 1,
              },
            },
          }}
        >
          <IconArrowRight size={16} stroke={2} />
        </ThemeIcon>
      </Group>

      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Title
          order={4}
          mb="xs"
          style={{
            color: customColors.neutral[9],
            fontWeight: 600,
          }}
        >
          {title}
        </Title>

        <Text
          size="sm"
          style={{
            color: customColors.neutral[6],
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {description}
        </Text>
      </Box>
    </Card>
  );
}

export default function QuickFilters() {
  const router = useRouter();

  const handleCardClick = (card: FilterCard) => {
    // Navegar a la página de búsqueda con filtro de categoría
    router.push(`/search?categoria=${card.categoria}`);
  };

  return (
    <Container size="xl" py="xl">
      <Box mb="xl">
        <Title
          order={2}
          mb="sm"
          style={{
            color: customColors.neutral[9],
            fontWeight: 700,
          }}
        >
          Categorías de Productos
        </Title>

        <Text
          size="lg"
          style={{
            color: customColors.neutral[6],
          }}
        >
          Explora nuestro catálogo de repuestos automotrices por categorías
        </Text>
      </Box>

      <Grid gutter="lg">
        {filterCards.map(card => (
          <Grid.Col
            key={card.id}
            span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }}
          >
            <QuickFilterCard
              card={card}
              onClick={() => handleCardClick(card)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
