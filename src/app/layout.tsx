import Header from '@/components/header/page';
import RouteTracker from '@/components/RouteTracker';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { UserAccountProvider } from '@/contexts/UserAccountContext';
import { ColorSchemeScript, ThemeProvider } from '@/theme/ThemeProvider';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Auto Partes - GT',
  description:
    'Tu tienda en línea de autopartes confiable y conveniente. Encuentra una amplia selección de piezas y accesorios para tu vehículo, con envío rápido y seguro. ¡Compra ahora y mantén tu auto en óptimas condiciones!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${montserrat.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              <UserAccountProvider>
                <CartProvider>
                  <RouteTracker />
                  <Header />
                  <main>{children}</main>
                </CartProvider>
              </UserAccountProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
