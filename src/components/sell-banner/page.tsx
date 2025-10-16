'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Box, Container, Text, Title, rem } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { customColors } from '../../theme';

export default function SellBanner() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const isSupplier = user?.role === 'PROVEEDOR';

  const handleStartSelling = () => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir a login
      router.push('/');
      return;
    }

    // Redirigir a settings con el tab correspondiente
    if (isSupplier) {
      // Si es proveedor, ir al tab de agregar producto
      router.push('/account/settings?tab=sell');
    } else {
      // Si es cliente, ir al tab de convertirse en proveedor
      router.push('/account/settings?tab=prov');
    }
  };

  return (
    <Box
      style={{
        background: `linear-gradient(135deg, ${customColors.brand[9]} 0%, ${customColors.brand[8]} 50%, ${customColors.brand[7]} 100%)`,
        minHeight: rem(200),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${rem(60)} 0`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Optional: Background pattern overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <Container
        size="md"
        ta="center"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Main Title */}
        <Title
          order={1}
          size="h1"
          fw={700}
          c="white"
          mb="lg"
          style={{
            fontSize: rem(42),
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          ¿Tienes repuestos para vender?
        </Title>

        {/* Subtitle */}
        <Text
          size="xl"
          c="rgba(255,255,255,0.9)"
          mb="xl"
          maw={600}
          mx="auto"
          lh={1.4}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {isSupplier
            ? 'Agrega nuevos productos a tu catálogo'
            : 'Únete a nuestra comunidad y vende tus autopartes fácilmente'}
        </Text>

        {/* Call to Action Button */}
        <button
          onClick={handleStartSelling}
          style={{
            fontSize: rem(16),
            fontWeight: 600,
            color: customColors.brand[8],
            backgroundColor: 'white',
            border: 'none',
            borderRadius: rem(8),
            padding: `${rem(12)} ${rem(24)}`,
            cursor: 'pointer',
            transition: 'font-size 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.fontSize = rem(18);
          }}
          onMouseLeave={e => {
            e.currentTarget.style.fontSize = rem(16);
          }}
        >
          {isSupplier ? 'Agregar un producto' : 'Comenzar a vender'}
        </button>
      </Container>
    </Box>
  );
}
