'use client';

import {
  Alert,
  Code,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function TestCaptchaPage() {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    console.log('Captcha value:', value);
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack gap="md">
          <Title order={2}>Prueba de reCAPTCHA</Title>

          <div>
            <Text fw={600} mb="xs">
              Estado de la Configuración:
            </Text>

            {siteKey ? (
              <Alert icon={<IconCheck size="1rem" />} color="green" mb="sm">
                ✅ Site Key encontrada
              </Alert>
            ) : (
              <Alert icon={<IconX size="1rem" />} color="red" mb="sm">
                ❌ Site Key NO encontrada
              </Alert>
            )}

            <Text size="sm" c="dimmed">
              Site Key:
            </Text>
            <Code block mb="md">
              {siteKey || 'NO DEFINIDA - Revisa tu .env.local'}
            </Code>
          </div>

          <div>
            <Text fw={600} mb="xs">
              Componente reCAPTCHA:
            </Text>
            {siteKey ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                  border: '2px dashed #ddd',
                  borderRadius: '8px',
                }}
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  onChange={handleCaptchaChange}
                  theme="light"
                />
              </div>
            ) : (
              <Alert icon={<IconX size="1rem" />} color="red">
                No se puede cargar reCAPTCHA sin una Site Key válida
              </Alert>
            )}
          </div>

          {captchaValue && (
            <Alert icon={<IconCheck size="1rem" />} color="green">
              ✅ Captcha completado exitosamente!
              <Code block mt="xs">
                {captchaValue}
              </Code>
            </Alert>
          )}

          <div>
            <Text fw={600} mb="xs">
              Instrucciones:
            </Text>
            <Stack gap="xs">
              <Text size="sm">
                1. Verifica que la Site Key esté definida arriba
              </Text>
              <Text size="sm">
                2. Si no aparece, revisa tu archivo .env.local
              </Text>
              <Text size="sm">
                3. Asegúrate de reiniciar el servidor después de cambiar
                .env.local
              </Text>
              <Text size="sm">
                4. Verifica que en Google reCAPTCHA hayas agregado:{' '}
                <Code>localhost</Code>
              </Text>
              <Text size="sm">
                5. Si el captcha no se muestra, abre la consola del navegador
                (F12) para ver errores
              </Text>
            </Stack>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}
