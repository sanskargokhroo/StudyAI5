'use server';
/**
 * @fileOverview An AI agent that generates summarized notes from a document.
 *
 * - generateNotesFromDocument - A function that handles the notes generation process.
 * - GenerateNotesFromDocumentInput - The input type for the generateNotesFromDocument function.
 * - GenerateNotesFromDocumentOutput - The return type for the generateNotesFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotesFromDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to generate notes from.'),
});
export type GenerateNotesFromDocumentInput = z.infer<
  typeof GenerateNotesFromDocumentInputSchema
>;

const GenerateNotesFromDocumentOutputSchema = z.object({
  notes: z.string().describe('The summarized notes generated from the document.'),
  progress: z.string().describe('A short summary of the notes generation.'),
});
export type GenerateNotesFromDocumentOutput = z.infer<
  typeof GenerateNotesFromDocumentOutputSchema
>;

export async function generateNotesFromDocument(
  input: GenerateNotesFromDocumentInput
): Promise<GenerateNotesFromDocumentOutput> {
  return generateNotesFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotesFromDocumentPrompt',
  input: {schema: GenerateNotesFromDocumentInputSchema},
  output: {schema: GenerateNotesFromDocumentOutputSchema},
  prompt: `You are an expert note-taker, skilled at summarizing documents into concise and informative notes.

  Please generate notes from the following document text. Focus on extracting the key information and presenting it in a clear, well-organized manner.

  Document Text: {{{documentText}}}

  Your notes should be comprehensive yet concise, enabling someone to quickly understand the main points of the document. Please add a progress report field at the end to show a summary of what you have generated.
  `,}
);

const generateNotesFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateNotesFromDocumentFlow',
    inputSchema: GenerateNotesFromDocumentInputSchema,
    outputSchema: GenerateNotesFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Generated a summary of the document and extracted key notes.',
    };
  }
);
