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
  prompt: `You are an expert academic assistant, skilled at creating high-quality, structured notes from a given document.

  Please generate comprehensive notes from the following document text. The notes should be well-organized and easy to study from.

  Structure the notes in the following way:
  1.  **Identify Key Topics**: First, identify the main topics or chapters in the document.
  2.  **Extract Main Points**: For each topic, list the most important points, concepts, or arguments.
  3.  **Provide Explanations**: Briefly explain each main point, providing context and clarity.
  4.  **Highlight Important Information**: Use markdown formatting (like **bold** for key terms and *italics* for emphasis) to highlight the most critical information that a student must remember.
  5.  **Use headings and bullet points** to create a clear hierarchy.

  Document Text: {{{documentText}}}

  Your final output should be a well-structured set of notes that a student can use to effectively learn the material. Please add a progress report field at the end to show a summary of what you have generated.
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
