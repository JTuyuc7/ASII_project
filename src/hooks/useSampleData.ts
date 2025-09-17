'use client';

import { useCart } from '@/contexts/CartContext';

// Productos de ejemplo para pruebas
const sampleProducts = [
  {
    id: '1',
    name: 'Filtro de aire BMW Serie 3',
    price: 85.50,
    image: '/bannerImg.jpg', // Usando una imagen que existe en el proyecto
    description: 'Filtro de aire original para BMW Serie 3. Garantiza un rendimiento óptimo del motor.',
    category: 'Filtros',
  },
  {
    id: '2',
    name: 'Pastillas de freno Toyota Corolla',
    price: 120.00,
    image: '/bannerImg.jpg',
    description: 'Pastillas de freno cerámicas para Toyota Corolla. Mayor durabilidad y mejor frenado.',
    category: 'Frenos',
  },
  {
    id: '3',
    name: 'Aceite de motor 5W-30 Mobil 1',
    price: 75.25,
    image: '/bannerImg.jpg',
    description: 'Aceite sintético premium para motores de alto rendimiento.',
    category: 'Lubricantes',
  },
  {
    id: '4',
    name: 'Batería 12V Universal',
    price: 180.00,
    image: '/bannerImg.jpg',
    description: 'Batería de 12V con 3 años de garantía. Compatible con la mayoría de vehículos.',
    category: 'Eléctrico',
  },
  {
    id: '5',
    name: 'Amortiguadores Honda Civic',
    price: 95.75,
    image: '/bannerImg.jpg',
    description: 'Amortiguadores traseros para Honda Civic. Mejora la estabilidad y comodidad.',
    category: 'Suspensión',
  },
];

export const useSampleData = () => {
  const { addItem, state } = useCart();

  // Función para agregar productos de ejemplo al carrito (útil para demos)
  const addSampleProducts = () => {
    // Agregar algunos productos de ejemplo
    addItem(sampleProducts[0]); // Filtro de aire
    addItem(sampleProducts[1]); // Pastillas de freno
    addItem(sampleProducts[2]); // Aceite de motor
  };

  // Función para limpiar y agregar productos de ejemplo
  const loadSampleData = () => {
    addSampleProducts();
  };

  return {
    sampleProducts,
    addSampleProducts,
    loadSampleData,
    cartState: state,
  };
};
