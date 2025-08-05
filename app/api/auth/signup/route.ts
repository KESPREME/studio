// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-server';

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  phone: z.string().min(10, { message: "A valid phone number is required." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.issues }, { status: 400 });
    }

    const { email, password, phone } = validation.data;

    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

    if (existingUser) {
        return NextResponse.json({ message: 'An account with this email already exists.'}, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        phone,
        role: 'reporter' // Default role for new signups
      })
      .select('id, email, phone, role')
      .single();

    if (insertError) {
      console.error('[SIGNUP_INSERT_ERROR]', insertError);
      return NextResponse.json({ message: 'Could not create account.' }, { status: 500 });
    }

    // Return the new user object (without password)
    return NextResponse.json({
        message: 'Account created successfully', 
        user: {
            id: newUser.id,
            name: newUser.email.split('@')[0],
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
        }
    }, { status: 201 });

  } catch (error: any) {
    console.error('[SIGNUP_API_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
