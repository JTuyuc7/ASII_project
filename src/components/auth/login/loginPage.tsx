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
  const [success, setSuccess] = useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
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
    setSuccess(null);

    // Validar captcha
    if (!captchaValue) {
      setError('Por favor, completa la verificación de reCAPTCHA');
      setLoading(false);
      return;
    }

    try {
      const result = await loginAction(values);

      if (result.token) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        setUserSession(result.user); // Set user data in context

        // Get the last visited route and redirect there after login
        const lastRoute = getLastRoute();
        const redirectTo =
          lastRoute && !lastRoute.includes('/auth/') ? lastRoute : '/main';

        // Pequeño delay para mostrar el mensaje de éxito
        setTimeout(() => {
          login(result.token, 'user', redirectTo); // Log the user in with the received token
        }, 1000);
      } else if (result.error) {
        // Manejar errores específicos del servidor
        if (result.error.includes('credenciales')) {
          setError(
            'Correo o contraseña incorrectos. Por favor, verifica tus datos.'
          );
        } else if (result.error.includes('usuario no encontrado')) {
          setError('No existe una cuenta con este correo electrónico.');
        } else if (result.error.includes('contraseña')) {
          setError(
            'La contraseña es incorrecta. Por favor, inténtalo de nuevo.'
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
        'Error inesperado al iniciar sesión. Por favor, intenta de nuevo más tarde.'
      );
      console.error('Login error:', err);
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
              title="Error de autenticación"
              color="red"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              icon={<IconCheck size="1rem" />}
              title="¡Éxito!"
              color="green"
            >
              {success}
            </Alert>
          )}

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
            placeholder="Tu contraseña"
            {...form.getInputProps('password')}
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
