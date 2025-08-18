'use client';

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
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { loginAction } from './actions';

/* eslint-disable @typescript-eslint/no-unused-vars */
const loginSchema = z.object({
  email: z.string().email('Direccion de correo electronico invalida'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      if (!result.success) {
        setError(result.error || 'An error occurred during login');
      } else {
        // Handle successful login - redirect or update UI
        console.log('Login successful');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.log(err, 'Error details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="lg" p="xl" radius="md" w={500}>
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
            <Anchor component={Link} href="/auth/register" size="lg">
              Crea una
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
