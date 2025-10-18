'use server';

import { axiosPublicClient } from '@/config';
import { ProductResponse } from './HomeProductAction';

export interface SearchProductsParams {
  categoria?: string;
  busqueda?: string;
  q?: string;
}

export interface SearchProductsResponse {
  success: boolean;
  data?: ProductResponse[];
  error?: string;
  total?: number;
}

/**
 * Searches products based on category, search term, or general query
 * Endpoint: https://backend-umg.onrender.com/api/products?categoria=carroceria&busqueda=carro&q=carro
 */
export async function searchProductsAction(
  params: SearchProductsParams
): Promise<SearchProductsResponse> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    if (params.categoria) {
      queryParams.append('categoria', params.categoria);
    }

    if (params.busqueda) {
      queryParams.append('busqueda', params.busqueda);
    }

    if (params.q) {
      queryParams.append('q', params.q);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    const response = await axiosPublicClient.get<ProductResponse[]>(url);

    return {
      success: true,
      data: response.data,
      total: response.data.length,
    };
  } catch (error: any) {
    console.error('Error searching products:', error);

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.message || 'Error al buscar productos',
        data: [],
        total: 0,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        success: false,
        error: 'No se pudo conectar con el servidor',
        data: [],
        total: 0,
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: 'Error inesperado al buscar productos',
        data: [],
        total: 0,
      };
    }
  }
}

/**
 * Quick search for autocomplete/preview results (limited results)
 */
export async function quickSearchProductsAction(
  searchTerm: string,
  categoria?: string,
  limit: number = 5
): Promise<SearchProductsResponse> {
  try {
    const params: SearchProductsParams = {};

    if (categoria) {
      params.categoria = categoria;
    }

    // Use both busqueda and q for better coverage
    params.busqueda = searchTerm;
    params.q = searchTerm;

    const result = await searchProductsAction(params);

    // Limit results for quick search/preview
    if (result.success && result.data) {
      return {
        ...result,
        data: result.data.slice(0, limit),
        total: result.data.length, // Keep original total
      };
    }

    return result;
  } catch (error: any) {
    console.error('Error in quick search:', error);
    return {
      success: false,
      error: 'Error en búsqueda rápida',
      data: [],
      total: 0,
    };
  }
}
