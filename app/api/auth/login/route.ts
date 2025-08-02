// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-server';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const { email, password } = validation.data;

    // Find the user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Don't send the password hash back to the client
    const { password: _, ...userToReturn } = user;
    
    // In a real app, you would generate a JWT here.
    // For this demo, we'll return the user object to be stored in localStorage.
    return NextResponse.json({ 
        message: 'Login successful', 
        user: {
          id: userToReturn.id,
          name: userToReturn.email.split('@')[0], // Simple name generation
          email: userToReturn.email,
          phone: userToReturn.phone,
          role: userToReturn.role
        }
    });

  } catch (error: any) {
    console.error('[LOGIN_API_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
