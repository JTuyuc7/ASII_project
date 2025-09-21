'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// Tipos para el usuario y su información
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    language: 'es' | 'en';
  };
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  dateAdded: string;
  inStock: boolean;
}

// Contexto
interface UserAccountContextType {
  profile: UserProfile | null;
  orders: Order[];
  wishlist: WishlistItem[];
  isLoading: boolean;

  // Funciones para el perfil
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateAddress: (address: UserProfile['address']) => Promise<void>;
  updatePreferences: (
    preferences: Partial<UserProfile['preferences']>
  ) => Promise<void>;

  // Funciones para pedidos
  fetchOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;

  // Funciones para lista de deseos
  addToWishlist: (
    productId: string,
    productData: Omit<WishlistItem, 'id' | 'dateAdded'>
  ) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
}

const UserAccountContext = createContext<UserAccountContextType | undefined>(
  undefined
);

// Provider
interface UserAccountProviderProps {
  children: ReactNode;
}

export function UserAccountProvider({ children }: UserAccountProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario al inicializar
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Cargar perfil del localStorage (en el futuro sería una API)
      const savedProfile = localStorage.getItem('user-profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      // Cargar pedidos del localStorage
      const savedOrders = localStorage.getItem('user-orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      // Cargar lista de deseos del localStorage
      const savedWishlist = localStorage.getItem('user-wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!profile) return;

      try {
        const updatedProfile = { ...profile, ...updates };
        setProfile(updatedProfile);
        localStorage.setItem('user-profile', JSON.stringify(updatedProfile));

        // Aquí iría la llamada a la API para actualizar en el servidor
        // await api.updateProfile(updatedProfile);
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        throw error;
      }
    },
    [profile]
  );

  const updateAddress = useCallback(
    async (address: UserProfile['address']) => {
      if (!profile) return;

      try {
        const updatedProfile = { ...profile, address };
        setProfile(updatedProfile);
        localStorage.setItem('user-profile', JSON.stringify(updatedProfile));
      } catch (error) {
        console.error('Error al actualizar dirección:', error);
        throw error;
      }
    },
    [profile]
  );

  const updatePreferences = useCallback(
    async (preferences: Partial<UserProfile['preferences']>) => {
      if (!profile) return;

      try {
        const updatedProfile = {
          ...profile,
          preferences: { ...profile.preferences, ...preferences },
        };
        setProfile(updatedProfile);
        localStorage.setItem('user-profile', JSON.stringify(updatedProfile));
      } catch (error) {
        console.error('Error al actualizar preferencias:', error);
        throw error;
      }
    },
    [profile]
  );

  const fetchOrders = useCallback(async () => {
    try {
      // Aquí iría la llamada a la API para obtener pedidos actualizados
      // const ordersData = await api.getUserOrders();
      // setOrders(ordersData);

      // Por ahora usamos datos de ejemplo
      const mockOrders: Order[] = [
        {
          id: '1',
          date: '2024-01-15',
          status: 'delivered',
          total: 299.99,
          currency: 'GTQ',
          items: [
            {
              id: '1',
              productId: 'prod-1',
              name: 'Producto de Ejemplo',
              price: 299.99,
              quantity: 1,
              image: '/placeholder-product.jpg',
            },
          ],
          shippingAddress: 'Calle Principal 123, Ciudad, Guatemala',
          trackingNumber: 'GT123456789',
        },
      ];

      setOrders(mockOrders);
      localStorage.setItem('user-orders', JSON.stringify(mockOrders));
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  }, []);

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find(order => order.id === orderId);
    },
    [orders]
  );

  const addToWishlist = useCallback(
    async (
      productId: string,
      productData: Omit<WishlistItem, 'id' | 'dateAdded'>
    ) => {
      try {
        const newItem: WishlistItem = {
          ...productData,
          id: Date.now().toString(),
          dateAdded: new Date().toISOString(),
        };

        const updatedWishlist = [...wishlist, newItem];
        setWishlist(updatedWishlist);
        localStorage.setItem('user-wishlist', JSON.stringify(updatedWishlist));

        // Aquí iría la llamada a la API
        // await api.addToWishlist(productId);
      } catch (error) {
        console.error('Error al agregar a lista de deseos:', error);
        throw error;
      }
    },
    [wishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      try {
        const updatedWishlist = wishlist.filter(
          item => item.productId !== productId
        );
        setWishlist(updatedWishlist);
        localStorage.setItem('user-wishlist', JSON.stringify(updatedWishlist));

        // Aquí iría la llamada a la API
        // await api.removeFromWishlist(productId);
      } catch (error) {
        console.error('Error al eliminar de lista de deseos:', error);
        throw error;
      }
    },
    [wishlist]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some(item => item.productId === productId);
    },
    [wishlist]
  );

  const clearWishlist = useCallback(async () => {
    try {
      setWishlist([]);
      localStorage.removeItem('user-wishlist');

      // Aquí iría la llamada a la API
      // await api.clearWishlist();
    } catch (error) {
      console.error('Error al limpiar lista de deseos:', error);
      throw error;
    }
  }, []);

  const value: UserAccountContextType = {
    profile,
    orders,
    wishlist,
    isLoading,
    updateProfile,
    updateAddress,
    updatePreferences,
    fetchOrders,
    getOrderById,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <UserAccountContext.Provider value={value}>
      {children}
    </UserAccountContext.Provider>
  );
}

// Hook personalizado
export function useUserAccount() {
  const context = useContext(UserAccountContext);
  if (context === undefined) {
    throw new Error(
      'useUserAccount debe ser usado dentro de un UserAccountProvider'
    );
  }
  return context;
}
