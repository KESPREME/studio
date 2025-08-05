'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating safety tips based on a hazard description.
 *
 * - generateSafetyTips - A function that creates safety tips.
 * - GenerateSafetyTipsInput - The input type for the function.
 * - GenerateSafetyTipsOutput - The return type for the function.
 */

import {ai} from '@/src/ai/genkit';
import {z} from 'genkit';

const GenerateSafetyTipsInputSchema = z.object({
  description: z.string().describe('The description of the hazard.'),
});
export type GenerateSafetyTipsInput = z.infer<typeof GenerateSafetyTipsInputSchema>;

const GenerateSafetyTipsOutputSchema = z.object({
  tips: z.string().describe('The safety tips and precautions for the hazard.'),
});
export type GenerateSafetyTipsOutput = z.infer<typeof GenerateSafetyTipsOutputSchema>;

export async function generateSafetyTips(input: GenerateSafetyTipsInput): Promise<GenerateSafetyTipsOutput> {
  return generateSafetyTipsFlow(input);
}

const generateSafetyTipsPrompt = ai.definePrompt({
  name: 'generateSafetyTipsPrompt',
  input: {schema: GenerateSafetyTipsInputSchema},
  output: {schema: GenerateSafetyTipsOutputSchema},
  prompt: `You are a safety expert for a disaster response team. Based on the following hazard description, provide a short, clear, and actionable safety tip (2-3 sentences max). Start with "Safety Tip:".

Hazard Description:
"{{description}}"
`,
});

const generateSafetyTipsFlow = ai.defineFlow(
  {
    name: 'generateSafetyTipsFlow',
    inputSchema: GenerateSafetyTipsInputSchema,
    outputSchema: GenerateSafetyTipsOutputSchema,
  },
  async input => {
    const {output} = await generateSafetyTipsPrompt(input);
    return output!;
  }
);
