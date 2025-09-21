'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Container, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

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
          <Button onClick={() => router.push('/auth/login')}>
            Iniciar Sesión
          </Button>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}
