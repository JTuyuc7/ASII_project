'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Container, Group, NavLink, Paper, Stack, Title } from '@mantine/core';
import {
  IconChartBar,
  IconDashboard,
  IconPackage,
  IconSettings,
  IconShoppingCart,
  IconTags,
  IconUsers,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: IconDashboard },
  { label: 'Productos', href: '/admin/products', icon: IconPackage },
  { label: 'Usuarios', href: '/admin/users', icon: IconUsers },
  { label: 'Pedidos', href: '/admin/orders', icon: IconShoppingCart },
  { label: 'Categorías', href: '/admin/categories', icon: IconTags },
  { label: 'Analytics', href: '/admin/analytics', icon: IconChartBar },
  { label: 'Configuración', href: '/admin/settings', icon: IconSettings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, loading, saveCurrentRoute } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Save current route when navigating within admin pages
    if (pathname && isAuthenticated && isAdmin) {
      saveCurrentRoute(pathname);
    }
  }, [pathname, isAuthenticated, isAdmin, saveCurrentRoute]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      // Save the route the user tried to access
      if (pathname && isAuthenticated) {
        saveCurrentRoute(pathname);
      }
      // Redirect to main page (/) which will show login or home depending on auth
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, loading, router, pathname, saveCurrentRoute]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return <div>Acceso denegado</div>;
  }

  return (
    <Container fluid style={{ padding: 0 }}>
      <Group
        align="stretch"
        gap={0}
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        {/* Sidebar */}
        <Paper
          style={{
            width: 280,
            borderRadius: 0,
            borderRight: '1px solid var(--mantine-color-gray-3)',
          }}
          p="md"
        >
          <Stack gap="xs">
            <Title order={3} c="blue" mb="md">
              Panel de Admin
            </Title>
            {adminNavItems.map(item => (
              <NavLink
                key={item.href}
                // Eliminar href para evitar navegación HTML nativa
                label={item.label}
                leftSection={<item.icon size={20} />}
                active={pathname === item.href}
                variant="filled"
                color="blue"
                onClick={e => {
                  e.preventDefault();
                  router.push(item.href);
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Paper>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <Paper style={{ minHeight: '100%', borderRadius: 0 }} p="xl">
            {children}
          </Paper>
        </div>
      </Group>
    </Container>
  );
}
