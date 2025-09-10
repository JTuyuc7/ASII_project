'use client';

import {
  Anchor,
  Box,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { customColors } from '../../theme';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <Anchor
    href={href}
    underline="never"
    c={customColors.neutral[6]}
    size="sm"
    style={{
      transition: 'color 0.2s ease',
      '&:hover': {
        color: customColors.brand[6],
      },
    }}
  >
    {children}
  </Anchor>
);

export default function Footer() {
  return (
    <Box
      component="footer"
      style={{
        backgroundColor: customColors.neutral[1],
        borderTop: `1px solid ${customColors.neutral[3]}`,
        paddingTop: rem(48),
        paddingBottom: rem(24),
      }}
    >
      <Container size="xl">
        {/* Main Footer Content */}
        <Grid gutter="xl" mb="xl">
          {/* Brand Column */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              {/* Logo/Brand */}
              <Box
                style={{
                  backgroundColor: customColors.brand[8],
                  color: 'white',
                  padding: `${rem(8)} ${rem(16)}`,
                  borderRadius: rem(6),
                  display: 'inline-block',
                  fontWeight: 700,
                  fontSize: rem(16),
                }}
              >
                AutoParts
              </Box>

              {/* Description */}
              <Text size="sm" c={customColors.neutral[6]} lh={1.5} maw={280}>
                La plataforma líder para compra y venta de autopartes en
                Guatemala.
              </Text>
            </Stack>
          </Grid.Col>

          {/* Comprar Column */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={4} size="h5" fw={600} c={customColors.neutral[8]}>
                Comprar
              </Title>
              <Stack gap="xs">
                <FooterLink href="/categoria/motor">Motor</FooterLink>
                <FooterLink href="/categoria/transmision">
                  Transmisión
                </FooterLink>
                <FooterLink href="/categoria/frenos">Frenos</FooterLink>
                <FooterLink href="/categoria/electrico">Eléctrico</FooterLink>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Vender Column */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={4} size="h5" fw={600} c={customColors.neutral[8]}>
                Vender
              </Title>
              <Stack gap="xs">
                <FooterLink href="/vender/publicar">
                  Publicar anuncio
                </FooterLink>
                <FooterLink href="/vender/consejos">
                  Consejos de venta
                </FooterLink>
                <FooterLink href="/vender/tarifas">Tarifas</FooterLink>
                <FooterLink href="/vender/soporte">Soporte</FooterLink>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Soporte Column */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Stack gap="md">
              <Title order={4} size="h5" fw={600} c={customColors.neutral[8]}>
                Soporte
              </Title>
              <Stack gap="xs">
                <FooterLink href="/ayuda">Centro de ayuda</FooterLink>
                <FooterLink href="/contacto">Contacto</FooterLink>
                <FooterLink href="/terminos">Términos</FooterLink>
                <FooterLink href="/privacidad">Privacidad</FooterLink>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Divider */}
        <Box
          style={{
            height: 1,
            backgroundColor: customColors.neutral[3],
            margin: `${rem(24)} 0`,
          }}
        />

        {/* Copyright */}
        <Group justify="center">
          <Text size="sm" c={customColors.neutral[6]} ta="center">
            © 2025 AutoParts. Todos los derechos reservados.
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
