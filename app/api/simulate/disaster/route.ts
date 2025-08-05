// app/api/simulate/disaster/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { simulateDisaster } from '@/ai/flows/simulate-disaster';

// Request schema for disaster simulation
const SimulateDisasterSchema = z.object({
  disasterType: z.enum(['earthquake', 'flood', 'wildfire', 'tornado', 'hurricane', 'landslide', 'blizzard', 'heatwave']),
  severity: z.enum(['minor', 'moderate', 'major', 'catastrophic']),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string(),
    populationDensity: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  }),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional().default('afternoon'),
  season: z.enum(['spring', 'summer', 'fall', 'winter']).optional().default('summer'),
  existingConditions: z.array(z.string()).optional().default([]),
});

// Fallback simulation for when AI is unavailable
function generateFallbackSimulation(input: any) {
  const { disasterType, severity, location, timeOfDay, season } = input;
  
  const severityMultiplier = {
    minor: 1,
    moderate: 2,
    major: 4,
    catastrophic: 8
  }[severity];

  const baseCasualties = {
    minor: { minor: 5, serious: 1, critical: 0 },
    moderate: { minor: 15, serious: 5, critical: 1 },
    major: { minor: 50, serious: 20, critical: 5 },
    catastrophic: { minor: 200, serious: 80, critical: 20 }
  }[severity];

  return {
    scenario: {
      title: `${severity.charAt(0).toUpperCase() + severity.slice(1)} ${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}`,
      description: `A ${severity} ${disasterType} has occurred in ${location.address} during ${timeOfDay} hours in ${season}.`,
      duration: severity === 'minor' ? '2-4 hours' : severity === 'moderate' ? '6-12 hours' : severity === 'major' ? '1-2 days' : '3-7 days',
      affectedRadius: `${severityMultiplier * 2} km radius`,
      estimatedCasualties: baseCasualties,
    },
    impacts: {
      infrastructure: [
        {
          type: 'Buildings',
          damage: severity === 'minor' ? 'minor' : severity === 'moderate' ? 'moderate' : 'severe',
          description: `${severity} structural damage to residential and commercial buildings`,
          recoveryTime: severity === 'minor' ? '1-2 weeks' : severity === 'moderate' ? '1-3 months' : '6-12 months',
        }
      ],
      utilities: [
        {
          service: 'Electricity',
          outageArea: `${severityMultiplier * 5}% of area`,
          estimatedRestoration: severity === 'minor' ? '6-12 hours' : severity === 'moderate' ? '1-3 days' : '1-2 weeks',
          alternativeSolutions: ['Generators', 'Emergency power stations'],
        }
      ],
      transportation: [
        {
          route: 'Main highways',
          status: severity === 'minor' ? 'restricted' : 'closed',
          alternativeRoutes: ['Secondary roads', 'Emergency access routes'],
        }
      ],
      environment: [
        {
          impact: 'Air quality degradation',
          severity: severity === 'minor' ? 'low' : severity === 'moderate' ? 'medium' : 'high',
          duration: `${severityMultiplier} days`,
        }
      ],
    },
    emergencyResponse: {
      immediateActions: [
        {
          action: 'Deploy emergency services',
          priority: 'critical' as const,
          timeframe: 'Immediate',
          resources: ['Fire department', 'Police', 'Medical teams'],
        }
      ],
      evacuationZones: [
        {
          zone: 'Primary impact area',
          radius: `${severityMultiplier} km`,
          safetyLevel: severity === 'minor' ? 'voluntary' : severity === 'moderate' ? 'recommended' : 'mandatory',
          shelterLocations: ['Community center', 'School gymnasium', 'Emergency shelters'],
        }
      ],
      resourceNeeds: [
        {
          resource: 'Emergency personnel',
          quantity: `${severityMultiplier * 10} teams`,
          urgency: 'immediate' as const,
        }
      ],
    },
    timeline: [
      {
        time: 'T+0 hours',
        event: `${disasterType} begins`,
        actions: ['Alert systems activated', 'Emergency services dispatched'],
      },
      {
        time: 'T+1 hour',
        event: 'Initial assessment',
        actions: ['Damage assessment', 'Evacuation if needed'],
      }
    ],
    recoveryPhases: [
      {
        phase: 'Immediate Response',
        duration: '0-72 hours',
        objectives: ['Life safety', 'Emergency services'],
        challenges: ['Access to affected areas', 'Communication'],
      },
      {
        phase: 'Short-term Recovery',
        duration: '3 days - 1 month',
        objectives: ['Restore utilities', 'Temporary housing'],
        challenges: ['Resource allocation', 'Coordination'],
      }
    ],
    aiGenerated: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('Disaster simulation API called');

    const body = await request.json();
    const validation = SimulateDisasterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid simulation parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const simulationInput = validation.data;

    try {
      // Use AI simulation if available
      console.log('Running AI disaster simulation...');
      const simulation = await simulateDisaster(simulationInput);
      
      return NextResponse.json({
        ...simulation,
        aiGenerated: true,
        timestamp: new Date().toISOString(),
      });

    } catch (aiError) {
      console.error('AI simulation failed, using fallback:', aiError);
      
      // Fall back to basic simulation if AI fails
      const fallbackSimulation = generateFallbackSimulation(simulationInput);
      
      return NextResponse.json({
        ...fallbackSimulation,
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    console.error('Disaster simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
