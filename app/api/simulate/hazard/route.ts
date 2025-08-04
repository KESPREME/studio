import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Schema for request validation
const hazardSimulationSchema = z.object({
  type: z.enum(['earthquake', 'flood', 'fire', 'storm', 'other']),
  intensity: z.number().min(1).max(10),
  location: z.string().min(1, 'Location is required'),
  radius: z.number().min(1, 'Radius must be at least 1km'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
});

export async function POST(request: Request) {
  try {
    // Get the current user from the session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Parse and validate the request body
    const body = await request.json();
    const validation = hazardSimulationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { type, intensity, location, radius, duration } = validation.data;

    // In a real application, you would:
    // 1. Generate test reports based on the simulation parameters
    // 2. Add them to the database with a simulation flag
    // 3. Optionally, clean them up after the simulation duration

    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: `Simulation started: ${type} at ${location} (${radius}km radius) for ${duration} minutes`,
      simulation: {
        type,
        intensity,
        location,
        radius,
        duration,
        startedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to check simulation status (optional)
export async function GET() {
  return NextResponse.json({
    status: 'idle',
    message: 'No active simulations',
  });
}
