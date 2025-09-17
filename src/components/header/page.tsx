'use client';

import {
  ActionIcon,
  Box,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconMenu2, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import AuthModal, { AuthModalType } from '../AuthModal';
import { CartDrawer } from '../cart/CartDrawer';
import { CartIcon } from '../cart/CartIcon';
// import { useAuth } from '../../../contexts/AuthContext';
import MenuItemList from './sub-components/MenuIcons';
import MobileDrawer from './sub-components/MobileDrawer';

export default function Header() {
  const [opened, { open, close }] = useDisclosure(false);
  const [cartOpened, { open: openCart, close: closeCart }] =
    useDisclosure(false);
  const [authOpened, { close: closeAuth }] = useDisclosure(false);
  const [authType] = useState<AuthModalType>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  // const { isAuthenticated, loading, logout } = useAuth();

  const userName = 'Juan Pérez'; // Replace with actual user name

  // const handleOpenAuth = (type: 'login' | 'register') => {
  //   setAuthType(type);
  //   openAuth();
  // };

  return (
    <>
      <Paper
        shadow="sm"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e9ecef',
        }}
      >
        <Container size="xl">
          <Group justify="space-between" h={84} px="md">
            {/* Logo */}
            {!isMobile ? (
              <Box>
                <Text
                  size="xl"
                  fw={700}
                  c="brand.9"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Auto Partes
                </Text>
              </Box>
            ) : null}

            {/* Search Bar */}
            <Box style={{ flex: 1, maxWidth: 450, margin: '0 2rem' }}>
              <TextInput
                placeholder="Buscar repuestos..."
                leftSection={<IconSearch size={16} />}
                radius="md"
                size="lg"
                styles={{
                  input: {
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #b1b4b7',
                    '&:focus': {
                      borderColor: '#1A2A80',
                      backgroundColor: '#fff',
                    },
                  },
                }}
              />
            </Box>

            {/* Desktop/Mobile Right Section */}
            {isMobile ? (
              // Mobile: Menu button
              <ActionIcon
                variant="subtle"
                size="xl"
                color="brand.9"
                radius="md"
                onClick={open}
              >
                <IconMenu2 size={35} />
              </ActionIcon>
            ) : (
              // Desktop: Cart and User icons
              <Group gap="sm">
                {/* Shopping Cart */}
                <CartIcon onClick={openCart} />

                {/* User Menu */}
                <MenuItemList userName={userName} />
              </Group>
            )}
          </Group>
        </Container>
      </Paper>

      {/* Mobile Drawer */}
      <MobileDrawer
        opened={opened}
        onClose={close}
        // isLoggedIn={isAuthenticated}
        // userName={userName}
        // cartItems={cartItems}
        // logout={logout}
        // onOpenAuth={handleOpenAuth}
        // userName={userName}
      />

      {/* Cart Sidebar - Now using context */}
      <CartDrawer opened={cartOpened} onClose={closeCart} />

      {/* Auth Modal */}
      <AuthModal opened={authOpened} onClose={closeAuth} type={authType} />
    </>
  );
}
