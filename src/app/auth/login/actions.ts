'use server';

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export async function loginAction(formData: LoginFormData) {
  try {
    // Validate the form data
    const validatedData = loginSchema.parse(formData);

    // Here you would typically:
    // 1. Check credentials against your database
    // 2. Create session/JWT token
    // 3. Set cookies
    // 4. Redirect user

    // For now, we'll simulate a login process
    console.log('Login attempt:', validatedData);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - replace with real authentication logic
    if (
      validatedData.email === 'admin@example.com' &&
      validatedData.password === 'password'
    ) {
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
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
