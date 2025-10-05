'use server';

import { z } from 'zod';
import { axiosPublicClient } from '@/config';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password confirmation is required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export async function registerAction(formData: RegisterFormData) {
  try {
    // Validate the form data
    const validatedData = registerSchema.parse(formData);

    // Here you would typically:
    // 1. Check if email already exists in database
    // 2. Hash the password
    // 3. Save user to database
    // 4. Send verification email
    // 5. Create session/JWT token
    // 6. Set cookies
    // 7. Redirect user

    // For now, we'll simulate a registration process

    const response = await axiosPublicClient.post('/auth/register', {
      name: `${validatedData.firstName} ${validatedData.lastName}`,
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
