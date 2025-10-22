export interface Category {
  id: number | null;
  value: string;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: null, value: '', label: 'Todas las categorías' },
  { id: 1, value: '1', label: 'Repuestos de Motor' },
  { id: 2, value: '2', label: 'Sistema Eléctrico' },
  { id: 3, value: '3', label: 'Frenos y Suspensión' },
  { id: 4, value: '4', label: 'Accesorios y Herramientas' },
  { id: 5, value: '5', label: 'Llantas y Neumáticos' },
  { id: 6, value: '6', label: 'Lubricantes y Fluidos' },
];

/**
 * Helper function to get category by ID
 */
export function getCategoryById(
  id: number | string | null
): Category | undefined {
  if (id === null || id === '') return CATEGORIES[0];
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return CATEGORIES.find(cat => cat.id === numId);
}

/**
 * Helper function to get category by value
 */
export function getCategoryByValue(value: string): Category | undefined {
  return CATEGORIES.find(cat => cat.value === value);
}

/**
 * Helper function to get category by name (label)
 */
export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find(cat => cat.label.toLowerCase() === name.toLowerCase());
}

/**
 * Helper function to get category label
 * Supports: ID (number), value (string ID), or category name
 */
export function getCategoryLabel(value: string | number | null): string {
  if (value === null || value === '') return 'Todas las categorías';

  if (typeof value === 'number') {
    const category = getCategoryById(value);
    return category?.label || String(value);
  }

  // Try by value first (ID as string)
  let category = getCategoryByValue(value);

  // If not found, try by name (backend might send the category name)
  if (!category) {
    category = getCategoryByName(value);
  }

  return category?.label || value;
}
