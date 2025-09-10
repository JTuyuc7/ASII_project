'use client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconHeart,
  IconLogin,
  IconLogout,
  IconPackage,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';

interface MobileDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ opened, onClose }: MobileDrawerProps) {
  const { isAuthenticated, logout, setCurrentView } = useAuth();

  const handleLoginClick = () => {
    setCurrentView('login');
    onClose();
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
    onClose();
  };

  const handleMainClick = () => {
    setCurrentView('main');
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title="Menú"
      size="sm"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#1A2A80',
        },
      }}
    >
      <Stack gap="md">
        {/* Cart Section */}
        <Box>
          <Group justify="space-between" mb="sm">
            <Text fw={600} c="brand.9">
              Carrito de Compras
            </Text>
            <Badge variant="filled" color="brand.9" size="sm">
              {/* {cartItems.length} items */}0 items
            </Badge>
          </Group>

          <Stack gap="xs">
            {/* {cartItems.map((item) => (
              <Box key={item.id} p="xs" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <Group justify="space-between" gap="xs">
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>{item.name}</Text>
                    <Text size="xs" c="dimmed">Cantidad: {item.quantity}</Text>
                  </Box>
                  <Text size="sm" fw={600} c="brand.9">{item.price}</Text>
                </Group>
              </Box>
            ))} */}

            <Text size="sm" c="dimmed">
              Tu carrito está vacío
            </Text>
          </Stack>

          <Button fullWidth mt="md" color="brand.9" variant="filled">
            Ver Carrito
          </Button>
        </Box>

        <Divider />

        {/* User Section */}
        <Box>
          <Text fw={600} c="brand.9" mb="sm">
            {isAuthenticated ? `Hola, Usuario` : 'Mi Cuenta'}
          </Text>

          <Stack gap="xs">
            {isAuthenticated ? (
              <>
                <Button
                  variant="subtle"
                  leftSection={<IconUserCircle size={18} />}
                  justify="start"
                  onClick={handleMainClick}
                >
                  Mi Cuenta
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<IconPackage size={18} />}
                  justify="start"
                >
                  Mis Pedidos
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<IconHeart size={18} />}
                  justify="start"
                >
                  Lista de Deseos
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<IconSettings size={18} />}
                  justify="start"
                >
                  Configuración
                </Button>
                <Button
                  variant="subtle"
                  leftSection={<IconLogout size={18} onClick={handleLogout} />}
                  justify="start"
                  color="red"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleLoginClick}
                  variant="filled"
                  color="brand.9"
                  leftSection={<IconLogin size={18} />}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={handleRegisterClick}
                  variant="outline"
                  color="brand.9"
                  leftSection={<IconUserCircle size={18} />}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}
