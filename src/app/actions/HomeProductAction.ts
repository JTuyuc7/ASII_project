'use server';

import { axiosPublicClient } from '@/config';

// Types for the product response
export interface Proveedor {
  nombreComercial: string;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
}

export interface ProductResponse {
  id: number;
  nombre: string;
  precio: string;
  descripcion: string;
  stock: number;
  proveedorId: number;
  categoria: string;
  imagenUrl: string | string[]; // Soporta tanto string único como arreglo
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  proveedor: Proveedor;
}

export interface GetProductsResponse {
  success: boolean;
  data?: ProductResponse[];
  error?: string;
}

/**
 * Fetches all active products from the API
 * This is a public endpoint that doesn't require authentication
 */
export async function getProductsAction(): Promise<GetProductsResponse> {
  try {
    const response =
      await axiosPublicClient.get<ProductResponse[]>('/products');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Error fetching products:', error);

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.message || 'Error al obtener los productos',
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'No se pudo conectar con el servidor',
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: 'Error inesperado al obtener los productos',
      };
    }
  }
}

/**
 * Fetches a single product by ID
 */
export async function getProductByIdAction(
  productId: number
): Promise<{ success: boolean; data?: ProductResponse; error?: string }> {
  try {
    const response = await axiosPublicClient.get<ProductResponse>(
      `/products/${productId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error fetching product ${productId}:`, error);

    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener el producto',
    };
  }
}

/**
 * Fetches products by category
 */
export async function getProductsByCategoryAction(
  categoria: string
): Promise<GetProductsResponse> {
  try {
    const response = await axiosPublicClient.get<ProductResponse[]>(
      `/products?categoria=${categoria}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Error fetching products for category ${categoria}:`, error);

    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener los productos',
    };
  }
}
