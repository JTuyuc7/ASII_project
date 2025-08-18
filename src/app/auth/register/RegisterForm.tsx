'use client';

import {
  Alert,
  Anchor,
  Button,
  Grid,
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
import { registerAction } from './actions';

/* eslint-disable @typescript-eslint/no-unused-vars */
const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password confirmation is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      firstName: (value: string) => {
        const result = z.string().min(2).safeParse(value);
        return result.success
          ? null
          : 'First name must be at least 2 characters';
      },
      lastName: (value: string) => {
        const result = z.string().min(2).safeParse(value);
        return result.success
          ? null
          : 'Last name must be at least 2 characters';
      },
      email: (value: string) => {
        const result = z.string().email().safeParse(value);
        return result.success ? null : 'Invalid email address';
      },
      password: (value: string) => {
        const result = z.string().min(6).safeParse(value);
        return result.success ? null : 'Password must be at least 6 characters';
      },
      confirmPassword: (value: string, values: RegisterFormData) => {
        if (value !== values.password) {
          return "Passwords don't match";
        }
        const result = z.string().min(6).safeParse(value);
        return result.success ? null : 'Password confirmation is required';
      },
    },
  });

  const handleSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerAction(values);

      if (!result.success) {
        setError(result.error || 'An error occurred during registration');
      } else {
        // Handle successful registration
        console.log('Registration successful');
      }
      /* eslint-disable @typescript-eslint/no-unused-vars */
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="lg" p="xl" radius="md" w={500}>
      <Title order={2} ta="center" mb="md">
        Crear cuenta
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

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                size="lg"
                required
                label="Nombre"
                placeholder="Tu nombre"
                {...form.getInputProps('firstName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                size="lg"
                required
                label="Apellido"
                placeholder="Tu apellido"
                {...form.getInputProps('lastName')}
              />
            </Grid.Col>
          </Grid>

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

          <PasswordInput
            size="lg"
            required
            label="Confirmar contraseña"
            placeholder="Confirma tu contraseña"
            {...form.getInputProps('confirmPassword')}
          />

          <Button type="submit" loading={loading} fullWidth mt="md" size="lg">
            Crear cuenta
          </Button>

          <Text ta="center" mt="md" size="lg">
            ¿Ya tienes una cuenta?{' '}
            <Anchor component={Link} href="/auth/login" size="lg">
              Iniciar sesión
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
