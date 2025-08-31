'use server';
/**
 * @fileOverview An AI agent that explains why a quiz answer is incorrect.
 *
 * - explainQuizAnswer - A function that handles the explanation process.
 * - ExplainQuizAnswerInput - The input type for the explainQuizAnswer function.
 * - ExplainQuizAnswerOutput - The return type for the explainQuizAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainQuizAnswerInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible options for the question.'),
  userAnswer: z.string().describe("The user's selected answer."),
  correctAnswer: z.string().describe('The correct answer for the question.'),
});
export type ExplainQuizAnswerInput = z.infer<typeof ExplainQuizAnswerInputSchema>;

const ExplainQuizAnswerOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear and concise explanation of why the user answer is incorrect and the correct answer is correct.'),
});
export type ExplainQuizAnswerOutput = z.infer<typeof ExplainQuizAnswerOutputSchema>;

export async function explainQuizAnswer(input: ExplainQuizAnswerInput): Promise<ExplainQuizAnswerOutput> {
  return explainQuizAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainQuizAnswerPrompt',
  input: {schema: ExplainQuizAnswerInputSchema},
  output: {schema: ExplainQuizAnswerOutputSchema},
  prompt: `You are an expert educator providing feedback on a quiz. The user has answered a question incorrectly. Your task is to provide a clear and concise explanation.

  The user was asked the following question:
  "{{{question}}}"

  The options were:
  {{#each options}}
  - {{{this}}}
  {{/each}}

  The user answered: "{{{userAnswer}}}"
  The correct answer is: "{{{correctAnswer}}}"

  Please explain why the user's answer is incorrect and why the correct answer is right. Keep the explanation easy to understand and focused on the core concept.
  `,
});

const explainQuizAnswerFlow = ai.defineFlow(
  {
    name: 'explainQuizAnswerFlow',
    inputSchema: ExplainQuizAnswerInputSchema,
    outputSchema: ExplainQuizAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);