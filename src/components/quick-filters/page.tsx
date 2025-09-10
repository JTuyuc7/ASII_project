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
  IconArrowRight,
  IconBolt,
  IconEngine,
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
  href: string;
}

const filterCards: FilterCard[] = [
  {
    id: 'motor',
    title: 'Motor',
    icon: IconEngine,
    description: 'Repuestos y componentes para motores',
    color: 'brand',
    href: '/category/motor',
  },
  {
    id: 'transmision',
    title: 'Transmisión',
    icon: IconSettings,
    description: 'Sistemas de transmisión y embrague',
    color: 'secondary',
    href: '/category/transmision',
  },
  {
    id: 'electrico',
    title: 'Eléctrico',
    icon: IconBolt,
    description: 'Componentes eléctricos y electrónicos',
    color: 'warning',
    href: '/category/electrico',
  },
  {
    id: 'herramientas',
    title: 'Herramientas',
    icon: IconTool,
    description: 'Herramientas profesionales y accesorios',
    color: 'success',
    href: '/category/herramientas',
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

      <Box>
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
    router.push(card.href);
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
          Filtros rápidos
        </Title>

        <Text
          size="lg"
          style={{
            color: customColors.neutral[6],
          }}
        >
          Encuentra rápidamente lo que necesitas navegando por categorías
        </Text>
      </Box>

      <Grid gutter="lg">
        {filterCards.map(card => (
          <Grid.Col key={card.id} span={{ base: 12, xs: 6, sm: 6, md: 3 }}>
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
