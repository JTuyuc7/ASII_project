# 🎯 Guía del Sistema de Lista de Deseos (Wishlist)

## 📋 Descripción General

El sistema de wishlist permite a los usuarios guardar sus productos favoritos para acceder a ellos fácilmente más tarde. Utiliza el contexto `UserAccountContext` para gestionar el estado de forma centralizada.

## 🏗️ Arquitectura

### Contexto: `UserAccountContext`

**Ubicación:** `src/contexts/UserAccountContext.tsx`

El contexto proporciona las siguientes funciones:

```typescript
// Agregar producto a favoritos
addToWishlist(productId: string, productData: Omit<WishlistItem, 'id' | 'dateAdded'>): Promise<void>

// Eliminar producto de favoritos
removeFromWishlist(productId: string): Promise<void>

// Verificar si un producto está en favoritos
isInWishlist(productId: string): boolean

// Limpiar toda la lista
clearWishlist(): Promise<void>

// Lista de favoritos
wishlist: WishlistItem[]
```

### Tipo `WishlistItem`

```typescript
interface WishlistItem {
  id: string; // ID único del item en wishlist
  productId: string; // ID del producto
  name: string; // Nombre del producto
  price: number; // Precio del producto
  image?: string; // URL de la imagen
  dateAdded: string; // Fecha de agregado (ISO string)
  inStock: boolean; // Si está disponible
}
```

## 🎨 Componentes con Wishlist

### 1. ProductCard

**Ubicación:** `src/components/products/ProductCard.tsx`

- ✅ Botón de favoritos en la esquina superior derecha
- ✅ Icono cambia entre `IconHeart` (vacío) y `IconHeartFilled` (lleno)
- ✅ Color rojo cuando está en favoritos
- ✅ Estado de carga mientras se procesa

### 2. SearchProductCard

**Ubicación:** `src/components/products/SearchProductCard.tsx`

- ✅ Botón de favoritos en la esquina superior derecha
- ✅ Icono cambia según el estado
- ✅ Color rojo cuando está en favoritos
- ✅ Estado de carga mientras se procesa

### 3. Página de Detalle del Producto

**Ubicación:** `src/app/product/[id]/page.tsx`

- ✅ Botón "Agregar a Favoritos" / "En Favoritos"
- ✅ Cambia color y texto según el estado
- ✅ Icono cambia según el estado

### 4. Página de Wishlist

**Ubicación:** `src/app/account/wishlist/page.tsx`

- ✅ Muestra todos los productos favoritos
- ✅ Estadísticas (total, valor, disponibles, agotados)
- ✅ Botón para agregar al carrito
- ✅ Botón para ver detalles
- ✅ Botón para eliminar de favoritos
- ✅ Botón para limpiar toda la lista

## 🔧 Uso del Hook

### Importar el hook

```typescript
import { useUserAccount } from '@/contexts/UserAccountContext';
```

### Ejemplo de uso en un componente

```typescript
'use client';

import { useUserAccount } from '@/contexts/UserAccountContext';
import { useState, useEffect } from 'react';

export default function MyComponent({ product }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUserAccount();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si está en favoritos al montar
  useEffect(() => {
    setIsFavorite(isInWishlist(product.id.toString()));
  }, [isInWishlist, product.id]);

  const handleToggleFavorite = async () => {
    setLoading(true);

    try {
      if (isFavorite) {
        await removeFromWishlist(product.id.toString());
        setIsFavorite(false);
      } else {
        await addToWishlist(product.id.toString(), {
          productId: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          inStock: product.stock > 0,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleToggleFavorite} disabled={loading}>
      {isFavorite ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos'}
    </button>
  );
}
```

## 💾 Persistencia de Datos

### Almacenamiento Local

Los datos se guardan en `localStorage` con la clave `user-wishlist`:

```javascript
// Guardar
localStorage.setItem('user-wishlist', JSON.stringify(wishlist));

// Recuperar
const savedWishlist = localStorage.getItem('user-wishlist');
if (savedWishlist) {
  setWishlist(JSON.parse(savedWishlist));
}
```

### Migración a API

Para conectar con un backend real, modifica las funciones en `UserAccountContext.tsx`:

```typescript
const addToWishlist = async (productId: string, productData: ...) => {
  try {
    // Llamada a la API
    const response = await axios.post('/api/wishlist', {
      productId,
      ...productData
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Actualizar estado local
    const newItem: WishlistItem = {
      ...productData,
      id: response.data.id,
      dateAdded: response.data.dateAdded,
    };

    setWishlist(prev => [...prev, newItem]);
  } catch (error) {
    console.error('Error al agregar a wishlist:', error);
    throw error;
  }
};
```

## 🎯 Características Implementadas

### ✅ Funcionalidades Core

- [x] Agregar productos a favoritos
- [x] Eliminar productos de favoritos
- [x] Verificar si un producto está en favoritos
- [x] Limpiar toda la lista
- [x] Persistencia en localStorage
- [x] Estados de carga (loading)
- [x] Iconos visuales (corazón lleno/vacío)
- [x] Integración con ProductCard
- [x] Integración con SearchProductCard
- [x] Integración con página de detalle
- [x] Página dedicada de wishlist

### 🎨 UI/UX

- [x] Botones con estados visuales claros
- [x] Cambio de color (rojo cuando está en favoritos)
- [x] Iconos que cambian según el estado
- [x] Loading states
- [x] Responsive design
- [x] Estadísticas en la página de wishlist

### 📊 Estadísticas en Wishlist

- Total de productos
- Valor total de la lista
- Productos disponibles
- Productos agotados

## 🚀 Próximas Mejoras

### Funcionalidades Futuras

- [ ] Notificaciones cuando un producto agotado vuelve a tener stock
- [ ] Notificaciones de cambios de precio
- [ ] Compartir lista de deseos
- [ ] Listas de deseos múltiples (ej: "Reparación del motor", "Mejoras estéticas")
- [ ] Sincronización con backend real
- [ ] Animaciones al agregar/eliminar
- [ ] Toast notifications

### Integraciones

- [ ] Enviar lista de deseos por email
- [ ] Exportar lista como PDF
- [ ] Compartir en redes sociales
- [ ] Crear orden directamente desde wishlist

## 📝 Notas Importantes

1. **Autenticación:** Actualmente no requiere autenticación, pero está preparado para integrar con un backend que sí la requiera.

2. **IDs de Productos:** Se usan como strings para flexibilidad con diferentes sistemas de backend.

3. **Imágenes:** El sistema soporta tanto un string único como un arreglo de strings para las imágenes.

4. **Stock:** Se guarda el estado de stock al momento de agregar a favoritos, pero debería verificarse al acceder a la página de wishlist.

## 🐛 Troubleshooting

### El estado de favoritos no persiste al recargar

- Verifica que el `UserAccountProvider` esté en el layout principal
- Comprueba la consola del navegador para errores de localStorage

### Los botones no responden

- Verifica que el componente esté dentro del `UserAccountProvider`
- Revisa la consola para errores de importación del hook

### Las imágenes no se muestran

- Verifica que la URL de la imagen sea válida
- Comprueba el fallback image está configurado correctamente

## 📚 Recursos Adicionales

- [Mantine Components](https://mantine.dev/)
- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Última actualización:** 18 de Octubre, 2025
