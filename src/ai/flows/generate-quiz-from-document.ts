// src/ai/flows/generate-quiz-from-document.ts
'use server';
/**
 * @fileOverview Generates a quiz from a document.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to generate a quiz from.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in a suitable format (e.g., JSON).'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert in creating quizzes from provided documents. Based on the content of the document, generate a quiz with multiple-choice questions that effectively tests the user's understanding of the material.

Respond with ONLY the quiz content in a JSON string, without any additional explanatory text. The JSON should be an array of questions. Each question object must have three properties: "question" (string), "options" (an array of 4 strings), and "answer" (a string that exactly matches one of the options).

For example:
{
  "quiz": {
    "questions": [
      {
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "answer": "Paris"
      },
      {
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "answer": "4"
      }
    ]
  }
}

Document Content: {{{documentText}}}

Quiz:`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
