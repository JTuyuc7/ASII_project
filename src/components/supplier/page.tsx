'use client';

import { useState } from 'react';
import { Container, Title, Text, Stack, Alert } from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX } from '@tabler/icons-react';
import SupplierRegistrationForm from './SupplierRegistrationForm';
import { becomeSupplierAction } from '@/app/account/actions/SupplierAction';

interface SupplierFormData {
  telefono: string;
  direccion: string;
  nombreComercial: string;
  NIT: string;
  latitud: number;
  longitud: number;
}

export default function SupplierRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = async (data: SupplierFormData) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Get token from localStorage
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('authToken')
          : null;
      const response = await becomeSupplierAction(data, token);

      if (response.success) {
        setResult({
          type: 'success',
          message: response.message,
        });
      } else {
        setResult({
          type: 'error',
          message: response.error || response.message,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setResult({
        type: 'error',
        message:
          'Error al procesar la solicitud. Por favor intenta nuevamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <div>
          <Title order={2} mb="xs">
            Conviértete en Proveedor
          </Title>
          <Text c="dimmed" size="sm">
            Completa el formulario para registrarte como proveedor en nuestra
            plataforma
          </Text>
        </div>

        {result && (
          <Alert
            icon={
              result.type === 'success' ? (
                <IconCheck size={16} />
              ) : (
                <IconX size={16} />
              )
            }
            title={result.type === 'success' ? '¡Éxito!' : 'Error'}
            color={result.type === 'success' ? 'green' : 'red'}
            withCloseButton
            onClose={() => setResult(null)}
          >
            {result.message}
          </Alert>
        )}

        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Requisitos"
          color="blue"
        >
          <Text size="sm">
            Para ser proveedor necesitas contar con un negocio establecido en
            Guatemala con NIT válido. Tu solicitud será revisada por nuestro
            equipo y recibirás una respuesta en un plazo de 24-48 horas.
          </Text>
        </Alert>

        <SupplierRegistrationForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Stack>
    </Container>
  );
}
