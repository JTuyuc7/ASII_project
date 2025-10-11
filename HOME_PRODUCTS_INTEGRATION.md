# 📦 Home Products - API Integration

## Overview

This document describes the integration of the home page with the backend API to fetch and display real product data.

## Files Created/Modified

### 1. **Server Actions** (`src/app/actions/HomeProductAction.ts`)

Server-side functions to interact with the products API.

#### Functions:

##### `getProductsAction()`

Fetches all active products from the API.

- **Type**: Public (no authentication required)
- **Endpoint**: `GET /products`
- **Returns**: `GetProductsResponse`

**Example Usage:**

```typescript
const result = await getProductsAction();
if (result.success && result.data) {
  // Use products data
  console.log(result.data);
}
```

##### `getProductByIdAction(productId: number)`

Fetches a single product by its ID.

- **Type**: Public
- **Endpoint**: `GET /products/:id`
- **Parameters**:
  - `productId`: The ID of the product to fetch
- **Returns**: Single product or error

**Example Usage:**

```typescript
const result = await getProductByIdAction(5);
if (result.success && result.data) {
  console.log(result.data);
}
```

##### `getProductsByCategoryAction(categoria: string)`

Fetches products filtered by category.

- **Type**: Public
- **Endpoint**: `GET /products?categoria={categoria}`
- **Parameters**:
  - `categoria`: Category name (motor, transmision, etc.)
- **Returns**: Filtered products array

**Example Usage:**

```typescript
const result = await getProductsByCategoryAction('motor');
if (result.success && result.data) {
  console.log(result.data);
}
```

---

### 2. **Product Transformers** (`src/utils/productTransformers.ts`)

Utility functions to transform API data to component-compatible formats.

#### Functions:

##### `transformProductResponse(product: ProductResponse): Product`

Transforms a single product from API format to ProductCard format.

**Transformations:**

- `nombre` → `name`
- `precio` → `price` (formatted as "Q X,XXX.XX")
- `descripcion` → Used for condition
- `stock` → Determines availability
- `imagenUrl` → `image`
- `proveedor` → `seller` + `location` + `coordinates`
- Auto-calculates `isNew` (products < 7 days old)

##### `transformProductsResponse(products: ProductResponse[]): Product[]`

Transforms an array of products and filters out inactive ones.

##### `calculateDistance(lat1, lon1, lat2, lon2): number`

Calculates distance between two coordinates using Haversine formula.

- **Returns**: Distance in kilometers (rounded to 1 decimal)

##### `addDistanceToProducts(products, userLat, userLng): Product[]`

Adds distance information to all products based on user location.

**Example:**

```typescript
const productsWithDistance = addDistanceToProducts(
  products,
  14.6349, // User latitude
  -90.5069 // User longitude
);
```

##### `formatPrice(price): string`

Formats a price number to Guatemalan Quetzal format.

- **Input**: `15000` or `"15000"`
- **Output**: `"Q 15,000.00"`

---

### 3. **Outstanding Products Component** (`src/components/outstanding-products/page.tsx`)

Updated to fetch and display real products from the API.

#### Features:

- ✅ **Loading State**: Shows spinner while fetching data
- ✅ **Error State**: Displays error message with retry button
- ✅ **Empty State**: Shows message when no products available
- ✅ **Auto-load**: Fetches products on component mount
- ✅ **Retry**: Allows user to reload products on error

#### States:

```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

#### Flow:

1. Component mounts → `useEffect` triggers `loadProducts()`
2. Show loading spinner
3. Fetch data from API via `getProductsAction()`
4. Transform data using `transformProductsResponse()`
5. Display first 8 products (for "outstanding" section)
6. If error → Show error alert with retry button

---

## API Response Format

### ProductResponse Interface:

```typescript
{
  id: number;
  nombre: string;
  precio: string;
  descripcion: string;
  stock: number;
  proveedorId: number;
  categoria: string;
  imagenUrl: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  proveedor: {
    nombreComercial: string;
    direccion: string;
    telefono: string;
    latitud: number;
    longitud: number;
  }
}
```

### Example Response:

```json
[
  {
    "id": 5,
    "nombre": "Carro 11",
    "precio": "11000",
    "descripcion": "Super carros de colores",
    "stock": 5,
    "proveedorId": 1,
    "categoria": "motor",
    "imagenUrl": "https://res.cloudinary.com/dox3pn0yg/image/upload/v1760132457/k3aede1ookhhq3hjmuhi.png",
    "activo": true,
    "createdAt": "2025-10-10T21:40:59.549Z",
    "updatedAt": "2025-10-10T21:40:59.549Z",
    "proveedor": {
      "nombreComercial": "Hola",
      "direccion": "Guatemala xD",
      "telefono": "+50221212124",
      "latitud": 14.7409922873517,
      "longitud": -90.89214949521877
    }
  }
]
```

---

## Categories Available

Based on the product form, these are the available categories:

- `motor` - Motor
- `transmision` - Transmisión
- `suspension` - Suspensión
- `frenos` - Frenos
- `electrico` - Sistema Eléctrico
- `carroceria` - Carrocería
- `interior` - Interior
- `neumaticos` - Neumáticos
- `aceites` - Aceites y Lubricantes
- `filtros` - Filtros
- `otros` - Otros

---

## Error Handling

### Types of Errors:

1. **Server Error** (response received with error status)
   - Returns: `error.response.data.message` or default message
2. **Network Error** (no response received)
   - Returns: "No se pudo conectar con el servidor"
3. **Unexpected Error** (something else went wrong)
   - Returns: "Error inesperado al obtener los productos"

### Error Display:

- Shows Alert component with error icon
- Displays error message
- Provides "Reintentar" button to retry the request

---

## Future Enhancements

### Missing from Backend (currently using defaults):

- [ ] `rating` - Product ratings (currently defaults to 0)
- [ ] `reviews` - Number of reviews (currently defaults to 0)
- [ ] `originalPrice` - For showing discounts/sales
- [ ] `onSale` - Sale flag
- [ ] Distance calculation based on user location

### Potential Improvements:

- [ ] Add pagination for large product lists
- [ ] Add filtering by category in UI
- [ ] Add sorting options (price, date, popularity)
- [ ] Implement search functionality
- [ ] Cache products data to reduce API calls
- [ ] Add product favorites/wishlist
- [ ] Implement real-time stock updates

---

## Testing

### Manual Testing Steps:

1. Open homepage (`/`)
2. Scroll to "Productos Destacados" section
3. Verify:
   - ✅ Loading spinner appears briefly
   - ✅ Products display after loading
   - ✅ Product images load from Cloudinary
   - ✅ Prices formatted correctly (Q X,XXX.XX)
   - ✅ Seller names displayed
   - ✅ Location information shown
   - ✅ "Nuevo" badge for recent products

### Error Testing:

1. Stop backend server
2. Reload page
3. Verify error message appears
4. Click "Reintentar" button
5. Start backend server
6. Verify products load after retry

### Network Tab:

Check browser Network tab for:

- `GET /api/products` request
- Response status: 200 OK
- Response contains array of products

---

## Code Examples

### Using in Another Component:

```typescript
'use client';

import { getProductsAction } from '@/app/actions/HomeProductAction';
import { transformProductsResponse } from '@/utils/productTransformers';
import { useEffect, useState } from 'react';

export default function MyProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await getProductsAction();

    if (result.success && result.data) {
      const transformed = transformProductsResponse(result.data);
      setProducts(transformed);
    }

    setLoading(false);
  };

  return (
    // Your component JSX
  );
}
```

### Filtering by Category:

```typescript
const loadMotorProducts = async () => {
  const result = await getProductsByCategoryAction('motor');

  if (result.success && result.data) {
    const transformed = transformProductsResponse(result.data);
    setProducts(transformed);
  }
};
```

---

## Notes

- All product fetching uses **public API** (no authentication required)
- Products are automatically filtered to show only `activo: true`
- Images are hosted on Cloudinary
- Prices are stored as strings in backend but formatted for display
- Component shows only first 8 products for "outstanding" section
- Full product list can be implemented on separate page

---

## Related Files

- `/src/app/actions/HomeProductAction.ts` - Server actions
- `/src/utils/productTransformers.ts` - Data transformation utilities
- `/src/components/outstanding-products/page.tsx` - Outstanding products component
- `/src/components/products/ProductCard.tsx` - Individual product card
- `/src/app/account/actions/ProductAction.ts` - Product creation action
