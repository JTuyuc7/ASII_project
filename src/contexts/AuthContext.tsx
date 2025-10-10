'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthView = 'main' | 'login' | 'register';

interface AuthContextType {
  isAuthenticated: boolean;
  currentView: AuthView;
  isAdmin: boolean;
  login: (token: string, userRole?: string, redirectTo?: string) => void;
  logout: () => void;
  setCurrentView: (view: AuthView) => void;
  setUserSession: (userData: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    direccion: string | null;
    role: 'USUARIO' | 'PROVEEDOR' | 'ADMINISTRADOR' | string;
  }) => void;
  loading: boolean;
  //token: string | null;
  user: {
    id: number | string;
    name: string;
    email: string;
    phone: string | null;
    direccion: string | null;
    role: 'USUARIO' | 'PROVEEDOR' | 'ADMINISTRADOR' | string; // Nuevo campo role
  };
  saveCurrentRoute: (route: string) => void;
  getLastRoute: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(true); // Por defecto true para pruebas
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AuthView>('main');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType['user'] | null>(null);

  useEffect(() => {
    console.log('checkign credentials?');
    // Check if user has valid token on mount
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData) as AuthContextType['user']);
    }
    if (token) {
      console.log(token, 'si hay token');
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
    }
    setLoading(false);
  }, []);

  const saveCurrentRoute = (route: string) => {
    if (typeof window !== 'undefined' && route && !route.includes('/auth/')) {
      // Don't save the root path '/' unless user is authenticated
      // This prevents overwriting the logout redirect target
      if (route === '/' && !isAuthenticated) {
        return;
      }
      localStorage.setItem('lastVisitedRoute', route);
    }
  };

  const getLastRoute = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastVisitedRoute');
    }
    return null;
  };

  const login = (
    token: string,
    userRole: string = 'user',
    redirectTo?: string
  ) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', userRole);
    setIsAuthenticated(true);
    setIsAdmin(userRole === 'admin');

    // If redirectTo is provided, navigate there
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    } else {
      setCurrentView('main');
    }
  };

  const logout = () => {
    console.log('logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');

    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentView('main'); // Reset to main view to show the landing page

    // Set lastVisitedRoute to '/' so next login redirects to home
    localStorage.removeItem('lastVisitedRoute');
    // Redirect to main page after logout
    if (typeof window !== 'undefined') {
      // Use router if available, otherwise use window.location
      window.location.href = '/';
    }
  };

  const setUserSession = (userData: AuthContextType['user']) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentView,
        isAdmin,
        login,
        logout,
        setCurrentView,
        loading,
        setUserSession: setUserSession,
        user: user || {
          id: '',
          name: '',
          email: '',
          phone: null,
          direccion: null,
          role: '',
        },
        saveCurrentRoute,
        getLastRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
