'use server';

import { z } from 'zod';
import { axiosPublicClient } from '@/config';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export async function loginAction(formData: LoginFormData) {
  try {
    // Validate the form data
    const validatedData = loginSchema.parse(formData);

    const response = await axiosPublicClient.post('/auth/login', {
      email: validatedData.email,
      password: validatedData.password,
    });

    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Validation failed',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
