import { NextResponse } from 'next/server';
import type { Report, Urgency } from '@/lib/types';

interface SimulationSettings {
  disasterType: 'Earthquake' | 'Flood' | 'Wildfire';
  intensity: 'Low' | 'Moderate' | 'High';
}

const disasterReportTemplates = {
  Earthquake: [
    { description: 'Building collapse reported at downtown.', urgency: 'High' },
    { description: 'Major road damage on the main highway.', urgency: 'High' },
    { description: 'Gas leak reported in residential area.', urgency: 'High' },
    { description: 'Power outage in the northern district.', urgency: 'Moderate' },
    { description: 'Cracks appeared in several buildings.', urgency: 'Low' },
  ],
  Flood: [
    { description: 'River has overflowed its banks, severe flooding.', urgency: 'High' },
    { description: 'Residential area completely submerged.', urgency: 'High' },
    { description: 'Bridge collapse due to strong currents.', urgency: 'High' },
    { description: 'Water levels rising rapidly in the city center.', urgency: 'Moderate' },
    { description: 'Minor flooding in low-lying areas.', urgency: 'Low' },
  ],
  Wildfire: [
    { description: 'Large forest fire spreading towards the city.', urgency: 'High' },
    { description: 'Homes on the outskirts are threatened by fire.', urgency: 'High' },
    { description: 'Thick smoke causing breathing difficulties.', urgency: 'High' },
    { description: 'Fire has jumped the containment line.', urgency: 'Moderate' },
    { description: 'Small brush fire reported near the hills.', urgency: 'Low' },
  ],
};

const intensityReportCount = {
  Low: 5,
  Moderate: 15,
  High: 30,
};

// A hardcoded bounding box for generating random locations (e.g., around a specific city)
// This should be replaced with user input from the map in the future.
const boundingBox = {
  latMin: 33.0,
  latMax: 35.0,
  lngMin: -118.0,
  lngMax: -116.0,
};

export async function POST(request: Request) {
  try {
    const { disasterType, intensity } = (await request.json()) as SimulationSettings;

    if (!disasterType || !intensity) {
      return NextResponse.json({ message: 'Missing disasterType or intensity' }, { status: 400 });
    }

    const templates = disasterReportTemplates[disasterType];
    const reportCount = intensityReportCount[intensity];

    const generatedReports: Partial<Report>[] = [];

    for (let i = 0; i < reportCount; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const report: Partial<Report> = {
        id: `sim-${Date.now()}-${i}`,
        description: `[SIMULATED] ${template.description}`,
        urgency: template.urgency as Urgency,
        status: 'New',
        latitude: Math.random() * (boundingBox.latMax - boundingBox.latMin) + boundingBox.latMin,
        longitude: Math.random() * (boundingBox.lngMax - boundingBox.lngMin) + boundingBox.lngMin,
        reportedBy: 'simulator',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      generatedReports.push(report);
    }

    return NextResponse.json(generatedReports, { status: 200 });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during the simulation.' }, { status: 500 });
  }
}