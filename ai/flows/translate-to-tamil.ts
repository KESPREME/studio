'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating English text to Tamil.
 *
 * - translateToTamil - A function that translates English text to Tamil.
 * - TranslateToTamilInput - The input type for the translateToTamil function.
 * - TranslateToTamilOutput - The return type for the translateToTamil function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateToTamilInputSchema = z.object({
  text: z.string().describe('The English text to translate to Tamil.'),
});
export type TranslateToTamilInput = z.infer<typeof TranslateToTamilInputSchema>;

const TranslateToTamilOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in Tamil.'),
});
export type TranslateToTamilOutput = z.infer<typeof TranslateToTamilOutputSchema>;

export async function translateToTamil(input: TranslateToTamilInput): Promise<TranslateToTamilOutput> {
  return translateToTamilFlow(input);
}

const translateToTamilPrompt = ai.definePrompt({
  name: 'translateToTamilPrompt',
  input: {schema: TranslateToTamilInputSchema},
  output: {schema: TranslateToTamilOutputSchema},
  prompt: `Translate the following English text to Tamil:\n\n{{text}}`,
});

const translateToTamilFlow = ai.defineFlow(
  {
    name: 'translateToTamilFlow',
    inputSchema: TranslateToTamilInputSchema,
    outputSchema: TranslateToTamilOutputSchema,
  },
  async input => {
    const {output} = await translateToTamilPrompt(input);
    return output!;
  }
);
