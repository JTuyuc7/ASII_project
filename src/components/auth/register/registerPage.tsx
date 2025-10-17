'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  Alert,
  Anchor,
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
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
  const [success, setSuccess] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { login, setCurrentView, setUserSession } = useAuth();

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
    setSuccess(null);

    // Validar captcha
    if (!captchaValue) {
      setError('Por favor, completa la verificación de reCAPTCHA');
      setLoading(false);
      return;
    }

    try {
      const result = await registerAction(values);
      console.log(result, 'Result from registerAction');

      if (result.token) {
        setSuccess('¡Cuenta creada exitosamente! Iniciando sesión...');
        console.log('from register form');
        setUserSession(result.user); // Set user data in context

        // Pequeño delay para mostrar el mensaje de éxito
        setTimeout(() => {
          login(result.token); // Log the user in with the received token
        }, 1500);
      } else if (result.error) {
        // Manejar errores específicos del servidor
        if (result.error.includes('correo') || result.error.includes('email')) {
          setError(
            'Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.'
          );
        } else if (result.error.includes('contraseña')) {
          setError(
            'La contraseña debe cumplir con los requisitos de seguridad.'
          );
        } else if (result.error.includes('validación')) {
          setError(
            'Los datos ingresados no son válidos. Por favor, verifica la información.'
          );
        } else {
          setError(result.error);
        }
        // Reset captcha on error
        recaptchaRef.current?.reset();
        setCaptchaValue(null);
      }
    } catch (err) {
      setError(
        'Error inesperado al crear la cuenta. Por favor, intenta de nuevo más tarde.'
      );
      console.error('Registration error:', err);
      // Reset captcha on error
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    if (value) {
      setError(null); // Limpiar error cuando el usuario completa el captcha
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
              title="Error en el registro"
              color="red"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              icon={<IconCheck size="1rem" />}
              title="¡Registro exitoso!"
              color="green"
            >
              {success}
            </Alert>
          )}

          <TextInput
            size="lg"
            required
            label="Nombre"
            placeholder="Tu nombre"
            {...form.getInputProps('firstName')}
            disabled={loading || !!success}
          />

          <TextInput
            size="lg"
            required
            label="Apellido"
            placeholder="Tu apellido"
            {...form.getInputProps('lastName')}
            disabled={loading || !!success}
          />

          <TextInput
            size="lg"
            required
            label="Correo"
            placeholder="tu@correo.com"
            {...form.getInputProps('email')}
            disabled={loading || !!success}
          />

          <PasswordInput
            size="lg"
            required
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            description="La contraseña debe tener al menos 6 caracteres"
            {...form.getInputProps('password')}
            disabled={loading || !!success}
          />

          <PasswordInput
            size="lg"
            required
            label="Confirmar Contraseña"
            placeholder="Confirma tu contraseña"
            {...form.getInputProps('confirmPassword')}
            disabled={loading || !!success}
          />

          {/* Google reCAPTCHA */}
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={handleCaptchaChange}
              theme="light"
            />
          </Box>

          <Button
            size="lg"
            type="submit"
            loading={loading}
            fullWidth
            mt="md"
            disabled={!captchaValue || !!success}
          >
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
