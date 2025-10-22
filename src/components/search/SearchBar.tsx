'use client';

import { quickSearchProductsAction } from '@/app/actions/SearchProductAction';
import { CATEGORIES } from '@/constants/categories';
import {
  Box,
  Button,
  Combobox,
  Group,
  InputBase,
  Loader,
  Popover,
  Select,
  Stack,
  Text,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconFilter, IconSearch, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import SearchResults from './SearchResults';

interface SearchBarProps {
  onSearch?: (searchTerm: string, category?: string) => void;
  placeholder?: string;
  showCategoryFilter?: boolean;
  showPreview?: boolean;
  debounceMs?: number;
  style?: React.CSSProperties;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Buscar repuestos -...',
  showCategoryFilter = true,
  showPreview = true,
  debounceMs = 400,
  style,
}: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setShowResults(false);
    },
    onDropdownOpen: () => setShowResults(true),
  });

  // Debounced search function
  const debouncedSearch = useDebouncedCallback(
    async (term: string, category: string) => {
      if (!term.trim() || term.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await quickSearchProductsAction(
          term,
          category || undefined,
          5
        );

        if (result.success && result.data) {
          setSearchResults(result.data);
          if (showPreview) {
            setShowResults(true);
            combobox.openDropdown();
          }
        } else {
          setSearchResults([]);
          if (showPreview) {
            setShowResults(true);
            combobox.openDropdown();
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    debounceMs
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (value.trim().length >= 2) {
        debouncedSearch(value, selectedCategory);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setLoading(false);
        combobox.closeDropdown();
      }
    },
    [debouncedSearch, selectedCategory]
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: string | null) => {
      const newCategory = category || '';
      setSelectedCategory(newCategory);
      if (searchTerm.trim().length >= 2) {
        debouncedSearch(searchTerm, newCategory);
      }
    },
    [debouncedSearch, searchTerm]
  );

  // Handle search submission
  const handleSearch = useCallback(
    (term: string = searchTerm, category: string = selectedCategory) => {
      if (onSearch) {
        onSearch(term, category);
      } else {
        // Default behavior: navigate to search results page
        const params = new URLSearchParams();
        if (term.trim()) params.set('q', term.trim());
        if (category) params.set('categoria', category);

        const queryString = params.toString();
        router.push(`/search${queryString ? `?${queryString}` : ''}`);
      }

      setShowResults(false);
      combobox.closeDropdown();
    },
    [searchTerm, selectedCategory, onSearch, router, combobox]
  );

  // Handle product selection from results
  const handleProductClick = useCallback(
    (productId: number) => {
      router.push(`/product/${productId}`);
      setShowResults(false);
      combobox.closeDropdown();
    },
    [router, combobox]
  );

  // Clear search
  const handleClear = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchResults([]);
    setShowResults(false);
    combobox.closeDropdown();
  }, [combobox]);

  return (
    <Box style={{ position: 'relative', ...style }}>
      <Combobox
        store={combobox}
        onOptionSubmit={value => {
          if (value === 'search-all') {
            handleSearch();
          }
        }}
        position="bottom-start"
        middlewares={{ flip: true, shift: true }}
        withinPortal={false}
      >
        <Combobox.Target>
          <Group gap="xs" wrap="nowrap">
            {/* Category Filter */}
            {showCategoryFilter && (
              <Popover opened={showFilters} onChange={setShowFilters}>
                <Popover.Target>
                  <Button
                    variant="subtle"
                    size="sm"
                    leftSection={<IconFilter size={16} />}
                    onClick={() => setShowFilters(o => !o)}
                    color={selectedCategory ? 'brand.6' : 'gray'}
                  >
                    Filtros
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>
                      Categoría
                    </Text>
                    <Select
                      placeholder="Seleccionar categoría"
                      data={CATEGORIES}
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      clearable
                      size="sm"
                    />
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            )}

            {/* Search Input */}
            <Box style={{ flex: 1 }}>
              <InputBase
                component="div"
                pointer
                rightSection={
                  <Group gap="xs" wrap="nowrap">
                    {loading && <Loader size="xs" />}
                    {searchTerm && (
                      <IconX
                        size={16}
                        style={{ cursor: 'pointer' }}
                        onClick={handleClear}
                      />
                    )}
                    <IconSearch size={16} />
                  </Group>
                }
                onClick={() => {
                  // Solo abrir dropdown si hay contenido para mostrar
                  if (searchTerm.length >= 2 || loading) {
                    combobox.openDropdown();
                  }
                }}
                styles={{
                  input: {
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #b1b4b7',
                    borderRadius: 8,
                    height: 40,
                    paddingLeft: 12,
                    paddingRight: 8,
                    display: 'flex',
                    alignItems: 'center',
                    '&:focus': {
                      borderColor: '#1A2A80',
                      backgroundColor: '#fff',
                    },
                  },
                }}
              >
                <TextInput
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={e => handleSearchChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                    if (e.key === 'Escape') {
                      setShowResults(false);
                      combobox.closeDropdown();
                    }
                  }}
                  variant="unstyled"
                  size="lg"
                  styles={{
                    input: {
                      border: 'none',
                      backgroundColor: 'transparent',
                      padding: 0,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '16px',
                      lineHeight: '1',
                    },
                  }}
                />
              </InputBase>
            </Box>
          </Group>
        </Combobox.Target>

        {/* Solo mostrar dropdown cuando hay contenido relevante */}
        {showResults &&
          showPreview &&
          (searchResults.length > 0 ||
            (searchTerm.length >= 2 && !loading) ||
            loading) && (
            <Combobox.Dropdown>
              <Combobox.Options>
                {/* Loading state */}
                {loading && (
                  <Box p="md">
                    <Group justify="center">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        Buscando productos...
                      </Text>
                    </Group>
                  </Box>
                )}

                {/* Results */}
                {!loading && searchResults.length > 0 && (
                  <>
                    <SearchResults
                      products={searchResults}
                      loading={false}
                      onProductClick={handleProductClick}
                      maxResults={5}
                    />
                    <Combobox.Option value="search-all">
                      <Group justify="center" py="sm">
                        <Button variant="light" size="sm" fullWidth>
                          Ver todos los resultados ({searchResults.length})
                        </Button>
                      </Group>
                    </Combobox.Option>
                  </>
                )}

                {/* No results */}
                {!loading &&
                  searchTerm.length >= 2 &&
                  searchResults.length === 0 && (
                    <Box p="md">
                      <Text ta="center" c="dimmed" size="sm">
                        No se encontraron productos para "{searchTerm}"
                        {selectedCategory &&
                          ` en ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
                      </Text>
                    </Box>
                  )}
              </Combobox.Options>
            </Combobox.Dropdown>
          )}
      </Combobox>
    </Box>
  );
}
