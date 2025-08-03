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
  affectedZones: z.array(z.object({
    name: z.string().describe('The name of the affected area or neighborhood.'),
    lat: z.number().describe('The latitude of the center of the zone.'),
    lon: z.number().describe('The longitude of the center of the zone.'),
    impactLevel: z.number().min(1).max(10).describe('A rating from 1 (low) to 10 (catastrophic) of the disaster\'s impact on this zone.'),
  })).describe('A list of the most critically affected zones.'),
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

Analyze the following disaster and generate a comprehensive plan. Be specific and use realistic resource numbers and action items.

**Disaster Scenario:**
- **Type:** {{disasterType}}
- **Location:** {{location}}

Generate the response plan. Provide realistic latitude and longitude for the affected zones within the specified location.
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
