import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle del Producto - Auto Partes',
  description:
    'Información detallada del producto incluyendo especificaciones, ubicación y reseñas',
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
