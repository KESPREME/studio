'use server';

/**
 * @fileOverview This file defines a Genkit flow for simulating a disaster response plan.
 *
 * - simulateDisaster - A function that creates a detailed disaster response plan.
 * - SimulateDisasterInput - The input type for the function.
 * - SimulateDisasterOutput - The return type for the function.
 */

import { ai } from '@/src/ai/genkit';
import { z } from 'genkit';

const SimulateDisasterInputSchema = z.object({
  disasterType: z.string().describe('The type of disaster to simulate (e.g., "Urban Flood", "Earthquake").'),
  location: z.string().describe('The city or region where the disaster is occurring (e.g., "Chennai, Tamil Nadu").'),
  description: z.string().optional().describe('Additional details about the disaster scenario that should be analyzed and incorporated into the simulation.'),
});
export type SimulateDisasterInput = z.infer<typeof SimulateDisasterInputSchema>;

const SimulateDisasterOutputSchema = z.object({
  scenario: z.object({
    disasterType: z.string(),
    location: z.string(),
    description: z.string().describe('A brief, 1-2 sentence description of the simulated disaster scenario. If additional details were provided, incorporate them into this description to show how they influenced the simulation.'),
  }),
  mapCenter: z.object({
    lat: z.number().describe('The latitude for the center of the map view.'),
    lon: z.number().describe('The longitude for the center of the map view.'),
  }),
  affectedZones: z.array(z.object({
    name: z.string().describe('The name of the affected area or neighborhood.'),
    lat: z.number().describe('The latitude of the center of the zone.'),
    lon: z.number().describe('The longitude of the center of the zone.'),
    impactLevel: z.number().min(1).max(10).describe('A rating from 1 (low) to 10 (catastrophic) of the disaster\'s impact on this zone. 8-10 is heavy-hit, 4-7 is normal-hit, 1-3 is low-hit.'),
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
{{#if description}}
- **Additional Details:** {{description}}

**Important:** Carefully analyze the additional details provided above. These details should significantly influence:
1. The severity and impact levels of affected zones
2. The specific types and quantities of resources needed
3. The action plan phases and steps
4. The scenario description and affected areas
5. The overall response strategy

Incorporate these details into every aspect of your simulation to create a more accurate and contextual disaster response plan.
{{/if}}

Generate the response plan. Provide realistic latitude and longitude for the map center and the affected zones within the specified location. The impact level should realistically reflect the disaster type{{#if description}} and the additional details provided{{/if}}.
`,
});

const simulateDisasterFlow = ai.defineFlow(
  {
    name: 'simulateDisasterFlow',
    inputSchema: SimulateDisasterInputSchema,
    outputSchema: SimulateDisasterOutputSchema,
  },
  async (input) => {
    console.log('Genkit flow input:', JSON.stringify(input, null, 2));
    const { output } = await simulateDisasterPrompt(input);
    console.log('Genkit flow output scenario description:', output?.scenario?.description);
    return output!;
  }
);
