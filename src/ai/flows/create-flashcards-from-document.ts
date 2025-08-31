// Implemented by Agent Gemini.
'use server';
/**
 * @fileOverview A flow to create flashcards from a document.
 *
 * - createFlashcardsFromDocument - A function that handles the flashcard creation process.
 * - CreateFlashcardsFromDocumentInput - The input type for the createFlashcardsFromDocument function.
 * - CreateFlashcardsFromDocumentOutput - The return type for the createFlashcardsFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateFlashcardsFromDocumentInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to create flashcards from.'),
});
export type CreateFlashcardsFromDocumentInput = z.infer<typeof CreateFlashcardsFromDocumentInputSchema>;

const CreateFlashcardsFromDocumentOutputSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().describe('The question or term on the front of the flashcard.'),
        back: z.string().describe('The answer or definition on the back of the flashcard.'),
      })
    )
    .describe('An array of flashcards generated from the document.'),
});
export type CreateFlashcardsFromDocumentOutput = z.infer<typeof CreateFlashcardsFromDocumentOutputSchema>;

export async function createFlashcardsFromDocument(input: CreateFlashcardsFromDocumentInput): Promise<CreateFlashcardsFromDocumentOutput> {
  return createFlashcardsFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createFlashcardsFromDocumentPrompt',
  input: {schema: CreateFlashcardsFromDocumentInputSchema},
  output: {schema: CreateFlashcardsFromDocumentOutputSchema},
  prompt: `You are an expert educator who helps students learn by creating flashcards from study material.

  Given the following document text, create a set of flashcards that cover the most important concepts.
  Each flashcard should have a question or term on the front and the corresponding answer or definition on the back.

  Document Text: {{{documentText}}}

  Ensure that the flashcards are clear, concise, and helpful for memorization.
  The output should be an array of flashcards, each with a 'front' and 'back' field.
  Here is example how data should be formated
  {
    "flashcards": [
      {
        "front": "What is the capital of France?",
        "back": "Paris"
      },
      {
        "front": "What is the chemical symbol for water?",
        "back": "H2O"
      }
    ]
  }
  `,
});

const createFlashcardsFromDocumentFlow = ai.defineFlow(
  {
    name: 'createFlashcardsFromDocumentFlow',
    inputSchema: CreateFlashcardsFromDocumentInputSchema,
    outputSchema: CreateFlashcardsFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
