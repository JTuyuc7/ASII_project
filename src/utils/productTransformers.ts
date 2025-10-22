// Utility functions to transform API data to component props

import { ProductResponse } from '@/app/actions/HomeProductAction';
import { Product } from '@/components/products/ProductCard';
import { UserLocation } from '@/contexts/LocationContext';

/**
 * Transforms a product from the API to the Product interface used by ProductCard
 * Optionally calculates distance if userLocation is provided
 */
export const transformProductResponse = (
  product: ProductResponse,
  userLocation?: UserLocation | null
): Product => {
  // Calculate distance if user location is available
  let distance: string | undefined = undefined;
  if (userLocation && product.proveedor.latitud && product.proveedor.longitud) {
    const distanceKm = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      product.proveedor.latitud,
      product.proveedor.longitud
    );
    distance = `${distanceKm} km`;
  }

  return {
    id: product.id,
    name: product.nombre,
    price: `Q ${parseFloat(product.precio).toLocaleString('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    precio: parseFloat(product.precio),
    originalPrice: undefined, // Backend doesn't provide original price yet
    condition: product.stock > 0 ? 'Disponible' : 'Agotado',
    location: product.proveedor.direccion,
    distance, // Calculated distance or undefined
    rating: 0, // Backend doesn't provide ratings yet, default to 0
    reviews: 0, // Backend doesn't provide reviews yet, default to 0
    image: product.imagenUrl,
    isNew: isProductNew(product.createdAt),
    onSale: false, // Backend doesn't provide sale info yet
    seller: product.proveedor.nombreComercial,
    coordinates: {
      lat: product.proveedor.latitud,
      lng: product.proveedor.longitud,
    },
  };
};

/**
 * Determines if a product is "new" (created within last 7 days)
 */
const isProductNew = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysDiff <= 7;
};

/**
 * Transforms an array of products from the API
 * Optionally calculates distances if userLocation is provided
 */
export const transformProductsResponse = (
  products: ProductResponse[],
  userLocation?: UserLocation | null
): Product[] => {
  return products
    .filter(p => p.activo)
    .map(product => transformProductResponse(product, userLocation));
};

/**
 * Calculates distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Adds distance information to products based on user location
 */
export const addDistanceToProducts = (
  products: Product[],
  userLat: number,
  userLng: number
): Product[] => {
  return products.map(product => ({
    ...product,
    distance: product.coordinates
      ? `${calculateDistance(
          userLat,
          userLng,
          product.coordinates.lat,
          product.coordinates.lng
        )} km`
      : undefined,
  }));
};

/**
 * Formats a price number to Guatemalan Quetzal format
 */
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `Q ${numericPrice.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
