'use client';

import { CATEGORIES as CATEGORIES_DATA } from '@/constants/categories';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconFilter, IconMapPin, IconSearch, IconX } from '@tabler/icons-react';
import { useState } from 'react';

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilters) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  maxDistance: number;
  minPrice: number;
  maxPrice: number;
  condition: string;
  sortBy: string;
}

// Map categories for this component's needs
const categories = [
  { value: 'all', label: 'Todas las categorías', id: null },
  ...CATEGORIES_DATA.filter(cat => cat.id !== null),
];

const locations = [
  { value: 'all', label: 'Todas las ubicaciones' },
  { value: 'cdmx', label: 'Ciudad de México' },
  { value: 'guadalajara', label: 'Guadalajara' },
  { value: 'monterrey', label: 'Monterrey' },
  { value: 'puebla', label: 'Puebla' },
  { value: 'tijuana', label: 'Tijuana' },
  { value: 'merida', label: 'Mérida' },
  { value: 'cancun', label: 'Cancún' },
];

const conditions = [
  { value: 'all', label: 'Cualquier condición' },
  { value: 'new', label: 'Nuevo' },
  { value: 'excellent', label: 'Excelente' },
  { value: 'good', label: 'Bueno' },
  { value: 'fair', label: 'Regular' },
];

const sortOptions = [
  { value: 'relevance', label: 'Más relevante' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'distance', label: 'Distancia' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'rating', label: 'Mejor calificados' },
];

export default function SearchFilters({
  onSearch,
  isExpanded = false,
  onToggle,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    location: 'all',
    maxDistance: 50,
    minPrice: 0,
    maxPrice: 10000,
    condition: 'all',
    sortBy: 'relevance',
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Count active filters
    const count = Object.entries(newFilters).reduce((acc, [k, v]) => {
      if (k === 'query' && v) return acc + 1;
      if (k === 'category' && v !== 'all') return acc + 1;
      if (k === 'location' && v !== 'all') return acc + 1;
      if (k === 'condition' && v !== 'all') return acc + 1;
      if (k === 'sortBy' && v !== 'relevance') return acc + 1;
      if (k === 'minPrice' && Number(v) > 0) return acc + 1;
      if (k === 'maxPrice' && Number(v) < 10000) return acc + 1;
      if (k === 'maxDistance' && Number(v) < 50) return acc + 1;
      return acc;
    }, 0);

    setActiveFiltersCount(count);
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      query: '',
      category: 'all',
      location: 'all',
      maxDistance: 50,
      minPrice: 0,
      maxPrice: 10000,
      condition: 'all',
      sortBy: 'relevance',
    };
    setFilters(clearedFilters);
    setActiveFiltersCount(0);
    onSearch?.(clearedFilters);
  };

  return (
    <Card withBorder radius="md" p="lg">
      {/* Search Header */}
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <Title order={4}>Buscar Productos</Title>
          {activeFiltersCount > 0 && (
            <Badge variant="filled" color="brand.9" size="sm">
              {activeFiltersCount} filtros activos
            </Badge>
          )}
        </Group>

        <Group gap="xs">
          {activeFiltersCount > 0 && (
            <Button
              variant="subtle"
              size="xs"
              color="gray"
              onClick={handleClearFilters}
              leftSection={<IconX size={14} />}
            >
              Limpiar
            </Button>
          )}
          <ActionIcon variant="light" color="brand.9" onClick={onToggle}>
            <IconFilter size={18} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Main Search Bar */}
      <Group mb="md">
        <TextInput
          placeholder="Buscar repuestos, marcas, modelos..."
          leftSection={<IconSearch size={16} />}
          value={filters.query}
          onChange={e => handleFilterChange('query', e.target.value)}
          style={{ flex: 1 }}
          size="md"
        />
        <Button
          size="md"
          color="brand.9"
          onClick={handleSearch}
          leftSection={<IconSearch size={16} />}
        >
          Buscar
        </Button>
      </Group>

      {/* Expanded Filters */}
      {isExpanded && (
        <Stack gap="md">
          {/* Category and Location Row */}
          <Group grow>
            <Select
              label="Categoría"
              data={categories}
              value={filters.category}
              onChange={value => handleFilterChange('category', value || 'all')}
            />
            <Select
              label="Ubicación"
              data={locations}
              value={filters.location}
              onChange={value => handleFilterChange('location', value || 'all')}
              leftSection={<IconMapPin size={16} />}
            />
          </Group>

          {/* Distance and Condition Row */}
          <Group grow>
            <NumberInput
              label="Distancia máxima (km)"
              value={filters.maxDistance}
              onChange={value => handleFilterChange('maxDistance', value || 50)}
              min={1}
              max={200}
              leftSection={<IconMapPin size={16} />}
            />
            <Select
              label="Condición"
              data={conditions}
              value={filters.condition}
              onChange={value =>
                handleFilterChange('condition', value || 'all')
              }
            />
          </Group>

          {/* Price Range */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Rango de Precio
            </Text>
            <Group>
              <NumberInput
                placeholder="Precio mínimo"
                value={filters.minPrice}
                onChange={value => handleFilterChange('minPrice', value || 0)}
                min={0}
                leftSection="$"
                style={{ flex: 1 }}
              />
              <Text c="dimmed">-</Text>
              <NumberInput
                placeholder="Precio máximo"
                value={filters.maxPrice}
                onChange={value =>
                  handleFilterChange('maxPrice', value || 10000)
                }
                min={0}
                leftSection="$"
                style={{ flex: 1 }}
              />
            </Group>
          </Box>

          {/* Sort By */}
          <Select
            label="Ordenar por"
            data={sortOptions}
            value={filters.sortBy}
            onChange={value =>
              handleFilterChange('sortBy', value || 'relevance')
            }
          />

          {/* Apply Filters Button */}
          <Group justify="center" mt="md">
            <Button
              size="lg"
              color="brand.9"
              onClick={handleSearch}
              leftSection={<IconSearch size={18} />}
            >
              Aplicar Filtros
            </Button>
          </Group>
        </Stack>
      )}

      {/* Quick Info */}
      {!isExpanded && (
        <Text size="sm" c="dimmed" ta="center">
          Haz clic en el filtro para más opciones de búsqueda
        </Text>
      )}
    </Card>
  );
}
