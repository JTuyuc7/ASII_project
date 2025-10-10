'use server';

import axios from 'axios';
import { z } from 'zod';

// Zod schema for product registration validation
const productSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre del producto debe tener al menos 3 caracteres')
    .max(100, 'El nombre del producto no puede exceder 100 caracteres'),
  precio: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .max(999999.99, 'El precio es demasiado alto')
    .refine(val => Number.isFinite(val), 'El precio debe ser un número válido'),
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo')
    .max(999999, 'El stock es demasiado alto'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  categoria: z.string().min(1, 'Debe seleccionar una categoría'),
  imagenUrl: z
    .string()
    .url('Debe proporcionar una URL válida')
    .min(1, 'La imagen es requerida'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export type ProductActionResponse = {
  success: boolean;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  data?: {
    id: string;
    nombre: string;
  };
};

export async function createProductAction(
  data: ProductFormData,
  token: string | null
): Promise<ProductActionResponse> {
  try {
    // Validate data with Zod
    const validatedData = productSchema.parse(data);

    if (!token) {
      return {
        success: false,
        message: 'No autorizado',
        error: 'Debe iniciar sesión para crear un producto',
      };
    }

    // Make API request
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      validatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log(response.data);

    return {
      success: true,
      message: 'Producto creado exitosamente',
      data: {
        id: response.data.id,
        nombre: response.data.nombre,
      },
    };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path].push(issue.message);
      });

      return {
        success: false,
        message: 'Error de validación',
        errors: fieldErrors,
      };
    }

    // Handle API errors
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Error al procesar la solicitud';
      const status = error.response?.status;

      if (status === 401) {
        return {
          success: false,
          message: 'No autorizado',
          error: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        };
      }

      if (status === 403) {
        return {
          success: false,
          message: 'Acceso denegado',
          error:
            'No tienes permisos para crear productos. Debes ser proveedor.',
        };
      }

      if (status === 400) {
        return {
          success: false,
          message: 'Datos inválidos',
          error: message,
        };
      }

      return {
        success: false,
        message: 'Error al crear producto',
        error: message,
      };
    }

    // Generic error
    return {
      success: false,
      message: 'Error inesperado',
      error: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
    };
  }
}
