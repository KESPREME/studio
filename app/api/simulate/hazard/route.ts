// app/api/simulate/hazard/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

// Schema for request validation
const hazardSimulationSchema = z.object({
  type: z.enum(['earthquake', 'flood', 'fire', 'storm', 'other']),
  intensity: z.number().min(1).max(10),
  location: z.string().min(1, 'Location is required'),
  radius: z.number().min(1, 'Radius must be at least 1km'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Generate realistic hazard reports based on simulation parameters
function generateHazardReports(params: any) {
  const { type, intensity, location, radius, latitude, longitude } = params;
  
  const baseReports = {
    earthquake: [
      'Building structural damage reported',
      'Road cracks and debris blocking traffic',
      'Gas leak detected near residential area',
      'Power lines down in commercial district',
      'Water main break causing flooding'
    ],
    flood: [
      'Rising water levels in residential area',
      'Road closures due to flooding',
      'Vehicles stranded in flood water',
      'Basement flooding in apartment complex',
      'Bridge access compromised by high water'
    ],
    fire: [
      'Structure fire spreading rapidly',
      'Smoke inhalation cases reported',
      'Evacuation needed for nearby buildings',
      'Power lines threatened by fire',
      'Air quality hazardous due to smoke'
    ],
    storm: [
      'High winds causing tree damage',
      'Power outages across the area',
      'Flying debris creating hazards',
      'Roof damage to multiple buildings',
      'Flash flooding from heavy rain'
    ],
    other: [
      'Hazardous material spill detected',
      'Infrastructure damage reported',
      'Public safety concern in area',
      'Emergency services needed',
      'Evacuation may be required'
    ]
  };

  const reports = baseReports[type as keyof typeof baseReports] || baseReports.other;
  const numReports = Math.min(Math.max(Math.floor(intensity / 2), 1), reports.length);
  
  return reports.slice(0, numReports).map((description, index) => {
    // Generate coordinates within the specified radius
    const offsetLat = (Math.random() - 0.5) * (radius / 111); // Rough km to degree conversion
    const offsetLng = (Math.random() - 0.5) * (radius / 111);
    
    return {
      id: uuidv4(),
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} Simulation: ${description}`,
      urgency: intensity >= 7 ? 'High' : intensity >= 4 ? 'Moderate' : 'Low',
      latitude: latitude ? latitude + offsetLat : 40.7128 + offsetLat,
      longitude: longitude ? longitude + offsetLng : -74.0060 + offsetLng,
      status: 'New',
      reportedBy: 'Simulation System',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: null,
      contactInfo: 'simulation@alertfront.com'
    };
  });
}

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validation = hazardSimulationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { type, intensity, location, radius, duration, latitude, longitude } = validation.data;

    // Generate simulated hazard reports
    const simulatedReports = generateHazardReports({
      type,
      intensity,
      location,
      radius,
      latitude,
      longitude
    });

    // Insert simulated reports into the database
    const { data: insertedReports, error } = await supabaseAdmin
      .from('reports')
      .insert(simulatedReports)
      .select();

    if (error) {
      console.error('Error inserting simulated reports:', error);
      return NextResponse.json(
        { error: 'Failed to create simulation reports' },
        { status: 500 }
      );
    }

    // Schedule cleanup after simulation duration (in a real app, you'd use a job queue)
    // For now, we'll just return the simulation info
    
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
        reportsGenerated: simulatedReports.length,
        reportIds: insertedReports?.map(r => r.id) || []
      },
      reports: insertedReports || []
    });

  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a GET endpoint to check simulation status
export async function GET() {
  try {
    // Get recent simulation reports (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: simulationReports, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('reportedBy', 'Simulation System')
      .gte('createdAt', yesterday.toISOString())
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      status: simulationReports && simulationReports.length > 0 ? 'active' : 'idle',
      activeSimulations: simulationReports?.length || 0,
      recentReports: simulationReports || []
    });

  } catch (error) {
    console.error('Error fetching simulation status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch simulation status' },
      { status: 500 }
    );
  }
}
