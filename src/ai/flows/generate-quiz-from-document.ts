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

You MUST respond with ONLY a valid JSON string. Do not include any explanatory text, markdown formatting like \`\`\`json, or anything else outside of the JSON object.

The JSON object should have a single root key "quiz", which contains an object with a "questions" key. The "questions" key should be an array of question objects. Each question object must have three properties:
1. "question": A string for the question text.
2. "options": An array of exactly 4 strings representing the multiple-choice options.
3. "answer": A string that EXACTLY matches one of the provided options.

Here is an example of the required JSON format:
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

Generate the quiz now.
`,
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
