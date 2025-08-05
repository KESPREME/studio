// app/api/simulate/disaster/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { simulateDisaster } from '@/src/ai/flows/simulate-disaster';

// Type definitions
type DisasterType = 'Earthquake' | 'Flood' | 'Wildfire' | 'Hurricane' | 'Tornado' | 'Tsunami';
type Urgency = 'Low' | 'Moderate' | 'High';

interface SimulatedReport {
  id: string;
  title: string;
  description: string;
  urgency: Urgency;
  latitude: number;
  longitude: number;
  timestamp: string;
  type: string;
  imageUrl?: string;
}

// Schema for request validation
const simulationSchema = z.object({
  disasterType: z.enum(['Earthquake', 'Flood', 'Wildfire', 'Hurricane', 'Tornado', 'Tsunami']),
  intensity: z.enum(['Low', 'Moderate', 'High']),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
});

// AI-powered disaster simulation function using existing Genkit flow
async function generateAIDisasterSimulation(
  disasterType: DisasterType,
  intensity: 'Low' | 'Moderate' | 'High',
  location: string,
  description?: string
): Promise<SimulatedReport[]> {
  try {
    console.log(`Using Genkit flow to simulate ${intensity} ${disasterType} in ${location}`);
    if (description && description.trim()) {
      console.log(`Additional details provided: ${description.trim()}`);
    }

    // Enhance disaster type with intensity for more accurate AI generation
    const enhancedDisasterType = `${intensity} ${disasterType}`;

    const simulationResult = await simulateDisaster({
      disasterType: enhancedDisasterType,
      location: location,
      description: description,
    });

    // Convert the Genkit simulation result to SimulatedReport format
    const reports: SimulatedReport[] = [];

    // Create reports from affected zones
    simulationResult.affectedZones.forEach((zone, index) => {
      const urgency: Urgency = zone.impactLevel >= 8 ? 'High' :
                              zone.impactLevel >= 4 ? 'Moderate' : 'Low';

      // Enhanced description that includes additional details context
      let reportDescription = `${zone.name} experiencing ${urgency.toLowerCase()} impact from ${disasterType}. Impact level: ${zone.impactLevel}/10`;

      // Add context from additional details if provided
      if (description && description.trim()) {
        reportDescription += `. Context: ${description.trim()}`;
      }

      reports.push({
        id: uuidv4(),
        title: `${disasterType} Impact - ${zone.name}`,
        description: reportDescription,
        urgency: urgency,
        latitude: zone.lat,
        longitude: zone.lon,
        timestamp: new Date().toISOString(),
        type: disasterType,
      });
    });

    // Add resource allocation as additional reports
    simulationResult.resourceAllocation.forEach((resource, index) => {
      if (resource.count > 0) {
        const centerZone = simulationResult.affectedZones[0]; // Use first zone as reference
        const offset = (index * 0.01); // Small offset for each resource report

        // Enhanced resource deployment description
        let resourceDescription = `Deploying ${resource.count} units of ${resource.type} for disaster response`;
        if (description && description.trim()) {
          resourceDescription += `. Deployment based on scenario: ${description.trim()}`;
        }

        reports.push({
          id: uuidv4(),
          title: `Resource Deployment - ${resource.type}`,
          description: resourceDescription,
          urgency: 'Moderate' as Urgency,
          latitude: centerZone ? centerZone.lat + offset : simulationResult.mapCenter.lat + offset,
          longitude: centerZone ? centerZone.lon + offset : simulationResult.mapCenter.lon + offset,
          timestamp: new Date().toISOString(),
          type: 'Resource Deployment',
        });
      }
    });

    return reports;
  } catch (error) {
    console.error('Genkit simulation error:', error);

    // Fallback to basic simulation if Genkit fails
    return generateFallbackSimulation(disasterType);
  }
}

// Fallback simulation function
function generateFallbackSimulation(disasterType: DisasterType): SimulatedReport[] {
  const baseCoordinates = [
    { lat: 40.7128, lng: -74.0060 }, // New York
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 41.8781, lng: -87.6298 }, // Chicago
  ];

  const scenarios = {
    Earthquake: [
      { title: 'Building Collapse Reported', description: 'Multi-story building partially collapsed', urgency: 'High' as Urgency },
      { title: 'Gas Leak Emergency', description: 'Gas line rupture detected', urgency: 'High' as Urgency },
      { title: 'Road Damage', description: 'Major road cracking and debris', urgency: 'Moderate' as Urgency },
    ],
    Flood: [
      { title: 'Water Rescue Needed', description: 'People trapped in flooded area', urgency: 'High' as Urgency },
      { title: 'Power Outage', description: 'Electrical infrastructure damaged', urgency: 'Moderate' as Urgency },
      { title: 'Evacuation Required', description: 'Residential area flooding rapidly', urgency: 'High' as Urgency },
    ],
    Wildfire: [
      { title: 'Structure Fire Threat', description: 'Wildfire approaching residential area', urgency: 'High' as Urgency },
      { title: 'Smoke Inhalation Cases', description: 'Multiple people affected by smoke', urgency: 'Moderate' as Urgency },
      { title: 'Road Closure', description: 'Highway blocked by fire and smoke', urgency: 'Moderate' as Urgency },
    ],
    Hurricane: [
      { title: 'Wind Damage', description: 'Trees down, power lines damaged', urgency: 'High' as Urgency },
      { title: 'Flooding Emergency', description: 'Storm surge flooding coastal areas', urgency: 'High' as Urgency },
      { title: 'Shelter Request', description: 'Emergency shelter capacity needed', urgency: 'Moderate' as Urgency },
    ],
    Tornado: [
      { title: 'Tornado Touchdown', description: 'Confirmed tornado on the ground', urgency: 'High' as Urgency },
      { title: 'Mobile Home Damage', description: 'Mobile home park severely damaged', urgency: 'High' as Urgency },
      { title: 'Debris Clearing', description: 'Roads blocked by tornado debris', urgency: 'Moderate' as Urgency },
    ],
    Tsunami: [
      { title: 'Tsunami Warning', description: 'Large waves approaching coastline', urgency: 'High' as Urgency },
      { title: 'Coastal Evacuation', description: 'Immediate evacuation of coastal areas', urgency: 'High' as Urgency },
      { title: 'Harbor Damage', description: 'Port facilities severely damaged', urgency: 'Moderate' as Urgency },
    ],
  };

  const disasterScenarios = scenarios[disasterType] || scenarios.Earthquake;

  return disasterScenarios.map((scenario, index) => {
    const baseCoord = baseCoordinates[index % baseCoordinates.length];
    const randomOffset = () => (Math.random() - 0.5) * 0.1; // Small random offset

    return {
      id: uuidv4(),
      title: scenario.title,
      description: scenario.description,
      urgency: scenario.urgency,
      latitude: baseCoord.lat + randomOffset(),
      longitude: baseCoord.lng + randomOffset(),
      timestamp: new Date().toISOString(),
      type: disasterType,
    };
  });
}

export async function POST(request: Request) {
  try {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Since this route is accessed from a page protected by withAuth,
    // we can skip authentication here and proceed directly to simulation
    console.log('Processing simulation request...');
    console.log('Request cookies:', request.headers.get('cookie'));

    // Optional: Add basic validation that this is coming from an authenticated context
    // You could add additional checks here if needed

    // Parse and validate the request body
    const body = await request.json();
    const validation = simulationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { disasterType, intensity, location, description } = validation.data;

    // Generate AI-powered disaster simulation
    console.log(`Generating AI simulation for ${intensity} ${disasterType} in ${location}...`);
    const simulatedReports = await generateAIDisasterSimulation(disasterType, intensity, location, description);

    console.log(`Generated ${simulatedReports.length} simulated reports`);

    // Return reports array directly to match frontend expectations
    return NextResponse.json(simulatedReports);

  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
