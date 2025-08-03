'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating a disaster response plan.
 *
 * - simulateDisaster - A function that creates a detailed disaster response plan.
 * - SimulateDisasterInput - The input type for the function.
 * - SimulateDisasterOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SimulateDisasterInputSchema = z.object({
  disasterType: z.string().describe('The type of disaster to simulate (e.g., "Urban Flood", "Earthquake").'),
  location: z.string().describe('The city or region where the disaster is occurring (e.g., "Chennai, Tamil Nadu").'),
});
export type SimulateDisasterInput = z.infer<typeof SimulateDisasterInputSchema>;

const SimulateDisasterOutputSchema = z.object({
  scenario: z.object({
    disasterType: z.string(),
    location: z.string(),
    description: z.string().describe('A brief, 1-2 sentence description of the simulated disaster scenario.'),
  }),
  mapData: z.object({
    center: z.object({
      lat: z.number().describe('The latitude for the center of the map view.'),
      lng: z.number().describe('The longitude for the center of the map view.'),
    }),
    zoom: z.number().describe('The appropriate zoom level for the map.'),
    impactAreas: z.array(z.object({
      name: z.string().describe('The name of the affected area or neighborhood.'),
      impact: z.enum(['High', 'Medium', 'Low', 'Potential']).describe('The impact level of the disaster on this zone.'),
      populationAffected: z.number().describe('The estimated number of people affected in this zone.'),
      geoJson: z.any().describe('A GeoJSON object representing the boundary of the impact area.'),
    })).describe('A list of the affected zones with their impact levels and geographical data.'),
  }),
  resourceAllocation: z.array(z.object({
    type: z.enum(['Personnel', 'Heavy Equipment', 'Medical Units', 'Emergency Shelters', 'Command Vehicles']),
    count: z.number().describe('The number of units of this resource to deploy.'),
  })).describe('An optimized allocation of NDRF resources needed for the response.'),
  actionPlan: z.array(z.object({
    phaseName: z.string().describe('The name of the response phase (e.g., "Phase 1: Immediate Response").'),
    duration: z.string().describe('The estimated duration of this phase (e.g., "First 6 hours").'),
    steps: z.array(z.string()).describe('A list of specific, actionable steps to be taken in this phase.'),
  })).describe('A multi-phase action plan for the NDRF team.'),
});
export type SimulateDisasterOutput = z.infer<typeof SimulateDisasterOutputSchema>;

export async function simulateDisaster(input: SimulateDisasterInput): Promise<SimulateDisasterOutput> {
  return simulateDisasterFlow(input);
}

const simulateDisasterPrompt = ai.definePrompt({
  name: 'simulateDisasterPrompt',
  input: { schema: SimulateDisasterInputSchema },
  output: { schema: SimulateDisasterOutputSchema },
  prompt: `You are an expert disaster response strategist for the Indian National Disaster Response Force (NDRF). Your task is to create a realistic, actionable simulation and response plan based on a given disaster scenario.

Analyze the following disaster and generate a comprehensive plan. Be specific, creative, and use realistic data.

**Disaster Scenario:**
- **Type:** {{disasterType}}
- **Location:** {{location}}

**Your Output Must Include:**

1.  **Scenario Description:** A brief, 1-2 sentence description of the disaster.
2.  **Map Data:**
    *   **Center:** Latitude and Longitude for the map's center.
    *   **Zoom:** An appropriate zoom level (e.g., 10-12).
    *   **Impact Areas:** An array of affected zones. For each zone:
        *   **Name:** Name of the area (e.g., a neighborhood or district).
        *   **Impact:** The level of impact, categorized as:
            *   **"High"**: Will be directly and severely affected.
            *   **"Medium"**: Can be significantly affected.
            *   **"Low"**: May be lightly affected.
            *   **"Potential"**: Not currently affected, but at risk if the situation escalates (e.g., downstream from a flood).
        *   **Population Affected:** A realistic estimate of the population in the zone.
        *   **GeoJSON:** A simple GeoJSON Polygon object representing the zone's boundary. Be creative and make the shapes irregular and realistic for the location.
3.  **Resource Allocation:** Optimized list of NDRF resources.
4.  **Action Plan:** A multi-phase action plan for the NDRF.

Generate the response plan. Ensure the geographic data (lat/lng, GeoJSON) is realistic for the specified location.
`,
});

const simulateDisasterFlow = ai.defineFlow(
  {
    name: 'simulateDisasterFlow',
    inputSchema: SimulateDisasterInputSchema,
    outputSchema: SimulateDisasterOutputSchema,
  },
  async (input) => {
    const { output } = await simulateDisasterPrompt(input);
    return output!;
  }
);
