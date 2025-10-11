// Cart context and hooks
export { CartProvider, useCart, useCartState } from './CartContext';
export type { CartItem } from './CartContext';

// Settings context and hooks
export { SettingsProvider, useSettings } from './SettingsContext';
export type { AppSettings } from './SettingsContext';

// User Account context and hooks
export { UserAccountProvider, useUserAccount } from './UserAccountContext';
export type {
  Order,
  OrderItem,
  UserProfile,
  WishlistItem,
} from './UserAccountContext';

// Location context and hooks
export {
  LocationProvider,
  useLocation,
  useWatchLocation,
} from './LocationContext';
export type { UserLocation } from './LocationContext';

// Cart components
export { AddToCartButton } from '@/components/cart/AddToCartButton';
export { CartDrawer } from '@/components/cart/CartDrawer';
export { CartIcon } from '@/components/cart/CartIcon';

// Sample data hook
export { useSampleData } from '@/hooks/useSampleData';
