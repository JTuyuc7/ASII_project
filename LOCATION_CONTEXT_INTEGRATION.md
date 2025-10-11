# 📍 Location Context Integration

## Overview

This document describes the implementation of a global location context that provides user location throughout the application and automatically calculates distances to products.

---

## Files Created/Modified

### 1. **LocationContext** (`src/contexts/LocationContext.tsx`) ✨ NEW

Global context that manages user location across the entire application.

#### Features:

- ✅ Automatic location detection on app load
- ✅ Fallback to Ciudad de Guatemala if permission denied
- ✅ localStorage persistence for location data
- ✅ Error handling with user-friendly messages
- ✅ Loading states
- ✅ Manual location refresh
- ✅ Real-time location tracking (optional)

#### Exports:

##### `LocationProvider`

Wrap your app to provide location context to all components.

##### `useLocation()` Hook

Access location data from any component.

**Returns:**

```typescript
{
  location: UserLocation | null;  // Current user location
  error: string | null;            // Error message if any
  isLoading: boolean;              // Loading state
  updateLocation: (loc) => void;   // Manually update location
  requestLocation: () => void;     // Re-request location permission
  clearError: () => void;          // Clear error state
}
```

##### `useWatchLocation()` Hook

Enable real-time location tracking (watches for location changes).

**Usage:**

```typescript
// In a component
const watchId = useWatchLocation();
// Location will automatically update as user moves
```

#### UserLocation Interface:

```typescript
interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number; // Accuracy in meters
  timestamp?: number; // Timestamp of location
}
```

---

### 2. **Product Transformers Updated** (`src/utils/productTransformers.ts`)

Updated to automatically calculate distances when user location is available.

#### Changes:

##### `transformProductResponse(product, userLocation?)`

Now accepts optional `userLocation` parameter.

- If `userLocation` is provided → calculates distance
- If not provided → distance is `undefined`

**Before:**

```typescript
const transformed = transformProductResponse(product);
// distance: undefined
```

**After:**

```typescript
const transformed = transformProductResponse(product, userLocation);
// distance: "5.2 km" (calculated automatically)
```

##### `transformProductsResponse(products, userLocation?)`

Transforms array of products with automatic distance calculation.

**Example:**

```typescript
const { location } = useLocation();
const products = transformProductsResponse(apiProducts, location);
// All products now have calculated distances!
```

---

### 3. **Map Component Updated** (`src/components/maps/index.tsx`)

Simplified to use location from context instead of managing its own state.

#### Changes:

- ❌ Removed local location state management
- ✅ Now uses `useLocation()` hook
- ✅ Shares same location data across app
- ✅ No duplicate geolocation requests

**Before:**

```typescript
const [center, setCenter] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  navigator.geolocation.getCurrentPosition(/* ... */);
}, []);
```

**After:**

```typescript
const { location: center, error, isLoading } = useLocation();
// That's it! Location managed globally
```

---

### 4. **Outstanding Products Updated** (`src/components/outstanding-products/page.tsx`)

Now automatically shows distances to all products.

#### Changes:

- ✅ Imports `useLocation()` hook
- ✅ Passes `userLocation` to transformer
- ✅ Recalculates distances when location changes

**Implementation:**

```typescript
const { location: userLocation } = useLocation();

const transformedProducts = transformProductsResponse(
  result.data,
  userLocation // ← Automatic distance calculation
);
```

---

### 5. **Root Layout Updated** (`src/app/layout.tsx`)

Added `LocationProvider` to provider hierarchy.

**Provider Order:**

```
ThemeProvider
  └─ SettingsProvider
      └─ LocationProvider ← NEW
          └─ AuthProvider
              └─ UserAccountProvider
                  └─ CartProvider
```

---

## How It Works

### 1. **App Initialization Flow:**

```
1. App starts
        ↓
2. LocationProvider mounts
        ↓
3. Requests user location permission
        ↓
4a. Permission granted              4b. Permission denied
    ↓                                    ↓
    Gets coordinates                     Uses fallback
    lat: 14.xxx, lng: -90.xxx           (Ciudad de Guatemala)
        ↓                                    ↓
5. Saves to localStorage                 Saves to localStorage
        ↓                                    ↓
6. Location available globally via useLocation()
        ↓
7. Components use location for distance calculations
```

### 2. **Distance Calculation Flow:**

```
User Location               Product Location
(From Context)              (From API)
lat: 14.6349                lat: 14.7409
lng: -90.5069               lng: -90.8921
    ↓                           ↓
    └───────────┬───────────────┘
                ↓
    calculateDistance()
    (Haversine formula)
                ↓
        Distance: 5.2 km
                ↓
    Displayed on ProductCard
```

### 3. **Automatic Updates:**

When user location changes:

```
1. LocationContext updates location
        ↓
2. useLocation() hook notifies components
        ↓
3. Outstanding Products component re-runs
        ↓
4. transformProductsResponse() recalculates distances
        ↓
5. UI updates with new distances
```

---

## Usage Examples

### Example 1: Get User Location in Any Component

```typescript
'use client';

import { useLocation } from '@/contexts/LocationContext';

export default function MyComponent() {
  const { location, error, isLoading } = useLocation();

  if (isLoading) return <div>Obteniendo ubicación...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      Tu ubicación: {location?.lat}, {location?.lng}
    </div>
  );
}
```

### Example 2: Transform Products with Distances

```typescript
'use client';

import { useLocation } from '@/contexts/LocationContext';
import { transformProductsResponse } from '@/utils/productTransformers';

export default function ProductList() {
  const { location } = useLocation();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const result = await getProductsAction();

    if (result.success && result.data) {
      // Automatically calculates distances
      const withDistances = transformProductsResponse(
        result.data,
        location  // ← Pass user location
      );
      setProducts(withDistances);
    }
  };

  // Products now have 'distance' property!
  return (
    <div>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - {p.distance} {/* e.g., "5.2 km" */}
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Manual Location Refresh

```typescript
'use client';

import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@mantine/core';

export default function LocationControls() {
  const { location, requestLocation, error } = useLocation();

  return (
    <div>
      <p>Ubicación actual: {location?.lat}, {location?.lng}</p>
      {error && <p>Error: {error}</p>}
      <Button onClick={requestLocation}>
        Actualizar Ubicación
      </Button>
    </div>
  );
}
```

### Example 4: Watch Location in Real-time

```typescript
'use client';

import { useLocation, useWatchLocation } from '@/contexts/LocationContext';

export default function LiveTracking() {
  const { location } = useLocation();

  // Starts watching location (updates automatically as user moves)
  useWatchLocation();

  return (
    <div>
      Ubicación en tiempo real:
      <br />
      Lat: {location?.lat}
      <br />
      Lng: {location?.lng}
      <br />
      Precisión: {location?.accuracy} metros
    </div>
  );
}
```

---

## Benefits

### ✅ **Single Source of Truth**

- One location request for entire app
- No duplicate geolocation calls
- Consistent location data everywhere

### ✅ **Automatic Distance Calculation**

- Products automatically show distances
- No manual calculation needed
- Updates when location changes

### ✅ **Persistent Location**

- Saved to localStorage
- Survives page reloads
- Reduces permission prompts

### ✅ **Error Handling**

- Graceful fallback to Guatemala City
- User-friendly error messages
- Retry functionality

### ✅ **Performance**

- Reuses same location across components
- Efficient recalculation only when needed
- Minimal API calls

---

## Configuration

### Default Fallback Location

Edit `LocationContext.tsx`:

```typescript
const DEFAULT_LOCATION: UserLocation = {
  lat: 14.556043, // ← Change these
  lng: -90.73313, // ← coordinates
};
```

### Geolocation Options

Edit `LocationContext.tsx`:

```typescript
{
  enableHighAccuracy: true,    // Use GPS (more accurate but slower)
  timeout: 8000,               // Wait max 8 seconds
  maximumAge: 300000,          // Cache location for 5 minutes
}
```

### Distance Calculation Precision

Edit `productTransformers.ts`:

```typescript
return Math.round(distance * 10) / 10; // 1 decimal place
// Change to:
return Math.round(distance); // No decimals
// Or:
return Math.round(distance * 100) / 100; // 2 decimal places
```

---

## Testing

### Test Location Permission

1. Open app in browser
2. Browser asks for location permission
3. Click "Allow"
4. Check console: Should see location coordinates
5. Open any product list → should see distances

### Test Permission Denied

1. Deny location permission
2. Should see error message
3. Should fall back to Guatemala City
4. Products should still load (without distances)

### Test localStorage Persistence

1. Allow location
2. Reload page
3. Location should load from localStorage
4. No permission prompt on reload

### Test Manual Refresh

1. Go to map component
2. Click geolocation control
3. Location should update
4. Products should recalculate distances

### Test Distance Calculation

```typescript
// In browser console
import { calculateDistance } from '@/utils/productTransformers';

// Guatemala City to Antigua
calculateDistance(14.6349, -90.5069, 14.5586, -90.7341);
// Should return: ~32.5 km
```

---

## Troubleshooting

### ❌ "Geolocalización no soportada"

**Cause:** Browser doesn't support geolocation  
**Solution:** Use modern browser (Chrome, Firefox, Safari, Edge)

### ❌ "No se pudo obtener la ubicación"

**Cause:** Permission denied or location services disabled  
**Solution:**

1. Enable location services in system settings
2. Allow location in browser settings
3. App will use fallback location

### ❌ Distance shows "undefined"

**Cause:** User location not yet loaded  
**Solution:** Wait for `isLoading` to be false before showing distances

### ❌ Distances not updating

**Cause:** Component not watching location changes  
**Solution:** Add `location` to useEffect dependencies:

```typescript
useEffect(() => {
  loadProducts();
}, [location]); // ← Add this
```

---

## Performance Considerations

### Geolocation Request Timing

- ⚡ Requested once on app load
- 💾 Cached in localStorage
- 🔄 Reused across all components
- ⏱️ Max timeout: 8 seconds

### Distance Calculation

- ⚡ Very fast (pure math, no API calls)
- 🔄 Only recalculates when location changes
- 📊 Haversine formula (accurate for Earth)

### Memory Usage

- 💾 Minimal: Only stores { lat, lng, accuracy, timestamp }
- 🧹 Cleans up properly on unmount

---

## Future Enhancements

### Potential Features:

- [ ] Address lookup (reverse geocoding)
- [ ] Save multiple favorite locations
- [ ] Location history
- [ ] Geofencing alerts
- [ ] Sort products by distance
- [ ] Filter products by radius (e.g., "within 10km")
- [ ] Show products on map
- [ ] Route/directions to product location

---

## Related Files

- `/src/contexts/LocationContext.tsx` - Location context
- `/src/contexts/index.ts` - Context exports
- `/src/utils/productTransformers.ts` - Distance calculation
- `/src/components/maps/index.tsx` - Map component
- `/src/components/outstanding-products/page.tsx` - Products with distances
- `/src/app/layout.tsx` - Provider setup

---

## Summary

The LocationContext provides a robust, performant solution for managing user location throughout the application. It automatically calculates distances to products, persists location data, handles errors gracefully, and provides a simple API for any component to access location information.

**Key Achievements:**

- ✅ Single geolocation request for entire app
- ✅ Automatic distance calculation on products
- ✅ localStorage persistence
- ✅ Error handling with fallback
- ✅ Simple, clean API
- ✅ Type-safe with TypeScript
- ✅ Performant and efficient

🎉 **Location tracking is now fully integrated!**
