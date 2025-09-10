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
import { registerAction } from '../../../app/auth/register/actions';

type registerSchema = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// const registerSchema = z.object({
//   firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
//   lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
//   email: z.string().email('Direccion de correo electronico invalida'),
//   password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
//   confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Las contraseñas no coinciden",
//   path: ["confirmPassword"],
// });

// type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, setCurrentView } = useAuth();

  const form = useForm<registerSchema>({
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
          : 'El nombre debe tener al menos 2 caracteres';
      },
      lastName: (value: string) => {
        const result = z.string().min(2).safeParse(value);
        return result.success
          ? null
          : 'El apellido debe tener al menos 2 caracteres';
      },
      email: (value: string) => {
        const result = z.string().email().safeParse(value);
        return result.success ? null : 'Direccion de correo invalida';
      },
      password: (value: string) => {
        const result = z.string().min(6).safeParse(value);
        return result.success
          ? null
          : 'La contraseña debe tener al menos 6 caracteres';
      },
      confirmPassword: (value: string, values) => {
        return value !== values.password
          ? 'Las contraseñas no coinciden'
          : null;
      },
    },
  });

  const handleSubmit = async (values: registerSchema) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerAction(values);

      if (result.success && result.token) {
        login(result.token);
      } else {
        setError(result.error || 'Error al crear la cuenta');
      }
    } catch (err) {
      setError('Error inesperado al crear la cuenta');
      console.log(err, 'Error details');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setCurrentView('login');
    }
  };

  return (
    <Paper shadow="lg" p="xl" radius="md" w={500}>
      <Title order={2} ta="center" mb="md">
        Crear Cuenta
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
            label="Nombre"
            placeholder="Tu nombre"
            {...form.getInputProps('firstName')}
          />

          <TextInput
            size="lg"
            required
            label="Apellido"
            placeholder="Tu apellido"
            {...form.getInputProps('lastName')}
          />

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
            label="Confirmar Contraseña"
            placeholder="Confirma tu contraseña"
            {...form.getInputProps('confirmPassword')}
          />

          <Button size="lg" type="submit" loading={loading} fullWidth mt="md">
            Crear cuenta
          </Button>

          <Text ta="center" mt="md" size="lg">
            ¿Ya tienes una cuenta?{' '}
            <Anchor
              component="button"
              type="button"
              onClick={handleSwitchToLogin}
              size="lg"
            >
              Iniciar sesión
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
