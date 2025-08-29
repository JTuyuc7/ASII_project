'use client';
import { Modal } from '@mantine/core';
import { useState } from 'react';

export type AuthModalType = 'login' | 'register' | null;

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
  type: AuthModalType;
}

export default function AuthModal({ opened, onClose, type }: AuthModalProps) {
  const [currentType] = useState<AuthModalType>(type);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        },
        content: {
          borderRadius: '12px',
        },
      }}
    >
      <div
      // style={{ width: '100%', maxWidth: '400px' }}
      >
        {currentType === 'login' ? (
          // <LoginForm onSwitchToRegister={switchToRegister} onClose={onClose} />
          <></>
        ) : (
          <></>
          // <RegisterForm onSwitchToLogin={switchToLogin} onClose={onClose} />
        )}
      </div>
    </Modal>
  );
}
