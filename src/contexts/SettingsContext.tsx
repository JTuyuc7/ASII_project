'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Tipos para configuraciones
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  currency: 'GTQ' | 'USD';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showOnlineStatus: boolean;
    allowDataCollection: boolean;
  };
}

// Estado inicial de configuraciones
const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'es',
  currency: 'GTQ',
  notifications: {
    email: true,
    push: true,
    sms: false,
    marketing: false,
  },
  privacy: {
    profileVisible: true,
    showOnlineStatus: true,
    allowDataCollection: false,
  },
};

// Contexto
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateNotificationSettings: (
    notifications: Partial<AppSettings['notifications']>
  ) => void;
  updatePrivacySettings: (privacy: Partial<AppSettings['privacy']>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Provider
interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuraciones del localStorage al inicializar
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar configuraciones en localStorage cuando cambien
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('app-settings', JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const updateNotificationSettings = (
    notifications: Partial<AppSettings['notifications']>
  ) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...notifications,
      },
    }));
  };

  const updatePrivacySettings = (privacy: Partial<AppSettings['privacy']>) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        ...privacy,
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('app-settings');
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateNotificationSettings,
    updatePrivacySettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook personalizado
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings debe ser usado dentro de un SettingsProvider');
  }
  return context;
}
