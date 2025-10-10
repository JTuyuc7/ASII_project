'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  Alert,
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { z } from 'zod';
import { loginAction } from '../../../app/auth/login/actions';

type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginPage({ onSwitchToRegister }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, setCurrentView, setUserSession, getLastRoute } = useAuth();

  const form = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => {
        const result = z.string().email().safeParse(value);
        return result.success ? null : 'Invalid email address';
      },
      password: (value: string) => {
        const result = z.string().min(6).safeParse(value);
        return result.success ? null : 'Password must be at least 6 characters';
      },
    },
  });

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginAction(values);

      if (result.token) {
        setUserSession(result.user); // Set user data in context

        // Get the last visited route and redirect there after login
        const lastRoute = getLastRoute();
        const redirectTo =
          lastRoute && !lastRoute.includes('/auth/') ? lastRoute : '/main';

        login(result.token, 'user', redirectTo); // Log the user in with the received token
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
      console.log(err, 'Error details');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      setCurrentView('register');
    }
  };

  return (
    <Paper shadow="xl" p="xl" radius="md" w={500}>
      <Title order={2} ta="center" mb="md">
        Bienvenido!
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Error"
              color="red"
            >
              {error}
            </Alert>
          )}

          <TextInput
            size="lg"
            required
            label="Correo"
            placeholder="tu@correo.com"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            size="lg"
            required
            label="Contraseña"
            placeholder="Tu contraseña"
            {...form.getInputProps('password')}
          />

          <Button size="lg" type="submit" loading={loading} fullWidth mt="md">
            Iniciar sesión
          </Button>

          <Text ta="center" mt="md" size="lg">
            ¿No tienes una cuenta?{' '}
            <Anchor
              component="button"
              type="button"
              onClick={handleSwitchToRegister}
              size="lg"
            >
              Crea una
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
