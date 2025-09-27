'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthView = 'main' | 'login' | 'register';

interface AuthContextType {
  isAuthenticated: boolean;
  currentView: AuthView;
  isAdmin: boolean;
  login: (token: string, userRole?: string) => void;
  logout: () => void;
  setCurrentView: (view: AuthView) => void;
  setUserSession: (userData: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  }) => void;
  loading: boolean;
  //token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(true); // Por defecto true para pruebas
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AuthView>('main');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null>(null);

  useEffect(() => {
    // Check if user has valid token on mount
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
    }
    setLoading(false);
  }, []);

  const login = (token: string, userRole: string = 'user') => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', userRole);
    setIsAuthenticated(true);
    setIsAdmin(userRole === 'admin');
    setCurrentView('main');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentView('main');
  };

  const setUserSession = (userData: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  }) => {
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
        user: user || { id: '', name: '', email: '', phone: null },
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
