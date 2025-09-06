// Utility functions for location and distance calculations

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate point
 * @param coord2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

/**
 * Get user's current location (placeholder for now)
 * In a real app, this would use navigator.geolocation
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise(resolve => {
    // Mock user location (Mexico City center for demo)
    // In production, use navigator.geolocation.getCurrentPosition()
    setTimeout(() => {
      resolve({
        lat: 19.4326,
        lng: -99.1332,
      });
    }, 1000);
  });
}

/**
 * Calculate distance from user's location to product location
 */
export async function calculateDistanceFromUser(
  productCoords: Coordinates
): Promise<string> {
  try {
    const userLocation = await getCurrentLocation();
    const distance = calculateDistance(userLocation, productCoords);
    return formatDistance(distance);
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 'Distancia no disponible';
  }
}

/**
 * Mock location data for different cities in Mexico
 */
export const MOCK_LOCATIONS = {
  'Ciudad de México': { lat: 19.4326, lng: -99.1332 },
  Guadalajara: { lat: 20.6597, lng: -103.3496 },
  Monterrey: { lat: 25.6866, lng: -100.3161 },
  Puebla: { lat: 19.0414, lng: -98.2063 },
  Tijuana: { lat: 32.5149, lng: -117.0382 },
  Mérida: { lat: 20.9674, lng: -89.5926 },
  Cancún: { lat: 21.1619, lng: -86.8515 },
};
