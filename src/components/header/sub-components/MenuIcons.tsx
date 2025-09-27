'use client';
import { useAuth } from '@/contexts/AuthContext';
import { ActionIcon, Menu } from '@mantine/core';
import {
  IconHeart,
  IconLogin,
  IconLogout,
  IconPackage,
  IconSettings,
  IconShield,
  IconUser,
  IconUserCircle,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export interface MenuItemListProps {
  // isAuthenticated: boolean;
  userName: string;
  // logout: () => void;
  // onOpenAuth: (type: 'login' | 'register') => void;
}

export default function MenuItemList({ userName }: MenuItemListProps) {
  const { setCurrentView, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        {/* <UnstyledButton> */}
        <ActionIcon variant="subtle" size="xl" color="brand.9" radius="md">
          <IconUser size={35} />
        </ActionIcon>
        {/* </UnstyledButton> */}
      </Menu.Target>

      <Menu.Dropdown>
        {isAuthenticated ? (
          <>
            <Menu.Label>Hola, {userName}</Menu.Label>
            <Menu.Item
              leftSection={<IconUserCircle size={14} />}
              onClick={() => handleNavigation('/account/profile')}
            >
              Mi Cuenta
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPackage size={14} />}
              onClick={() => handleNavigation('/account/orders')}
            >
              Mis Pedidos
            </Menu.Item>
            <Menu.Item
              leftSection={<IconHeart size={14} />}
              onClick={() => handleNavigation('/account/wishlist')}
            >
              Lista de Deseos
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSettings size={14} />}
              onClick={() => handleNavigation('/account/settings')}
            >
              Configuración
            </Menu.Item>
            {isAdmin && (
              <>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconShield size={14} />}
                  onClick={() => handleNavigation('/admin')}
                  color="orange"
                >
                  Panel de Admin
                </Menu.Item>
              </>
            )}
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={14} />}
              color="red"
              onClick={logout}
            >
              Cerrar Sesión
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item
              leftSection={<IconLogin size={14} />}
              onClick={handleLoginClick}
            >
              Iniciar Sesión
            </Menu.Item>
            <Menu.Item
              leftSection={<IconUserCircle size={14} />}
              onClick={handleRegisterClick}
            >
              Registrarse
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
