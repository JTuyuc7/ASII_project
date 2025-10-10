'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Container, Text, Title } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, saveCurrentRoute } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Save current route when navigating within account pages
    if (pathname && isAuthenticated) {
      saveCurrentRoute(pathname);
    }
  }, [pathname, isAuthenticated, saveCurrentRoute]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Save the route the user tried to access
      if (pathname) {
        saveCurrentRoute(pathname);
      }
      // Redirect to main page which will show login
      router.push('/');
    }
  }, [isAuthenticated, loading, router, pathname, saveCurrentRoute]);

  // Show nothing while checking auth
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Container size="sm" py="xl">
        <Box ta="center">
          <Title order={2} mb="md">
            Acceso Requerido
          </Title>
          <Text mb="lg">
            Necesitas iniciar sesión para acceder a esta página.
          </Text>
          <Button onClick={() => router.push('/')}>Iniciar Sesión</Button>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}
