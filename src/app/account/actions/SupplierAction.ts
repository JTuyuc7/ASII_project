'use server';

import { z } from 'zod';
import axios from 'axios';

// Zod schema for supplier registration validation
const supplierSchema = z.object({
  nombreComercial: z
    .string()
    .min(3, 'El nombre comercial debe tener al menos 3 caracteres')
    .max(100, 'El nombre comercial no puede exceder 100 caracteres'),
  NIT: z
    .string()
    .regex(/^\d{7,8}-\d$/, 'Formato de NIT inválido. Use XXXXXXX-X'),
  direccion: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  telefono: z
    .string()
    .regex(/^\+502\d{8}$/, 'Formato de teléfono inválido. Use +502XXXXXXXX'),
  latitud: z
    .number()
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida')
    .refine(val => val !== 0, 'Debe seleccionar una ubicación válida'),
  longitud: z
    .number()
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida')
    .refine(val => val !== 0, 'Debe seleccionar una ubicación válida'),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

export type SupplierActionResponse = {
  success: boolean;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function becomeSupplierAction(
  data: SupplierFormData,
  token: string | null
): Promise<SupplierActionResponse> {
  try {
    // Validate data with Zod
    const validatedData = supplierSchema.parse(data);

    if (!token) {
      return {
        success: false,
        message: 'No autorizado',
        error: 'Debe iniciar sesión para registrarse como proveedor',
      };
    }

    // Make API request
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/providers/me/become`,
      validatedData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return {
      success: true,
      message:
        'Solicitud de proveedor enviada exitosamente. Recibirás una respuesta en 24-48 horas.',
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

      if (status === 409) {
        return {
          success: false,
          message: 'Ya eres proveedor',
          error:
            'Ya tienes una solicitud de proveedor pendiente o ya eres proveedor.',
        };
      }

      return {
        success: false,
        message: 'Error al registrar proveedor',
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
