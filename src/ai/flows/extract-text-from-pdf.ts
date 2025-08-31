'use server';
/**
 * @fileOverview Extracts text from a PDF file using OCR.
 *
 * - extractTextFromPdf - A function that handles the text extraction process.
 * - ExtractTextFromPdfInput - The input type for the extractTextFromPdf function.
 * - ExtractTextFromPdfOutput - The return type for the extractTextFromPdf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromPdfInput = z.infer<
  typeof ExtractTextFromPdfInputSchema
>;

const ExtractTextFromPdfOutputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the PDF.'),
});
export type ExtractTextFromPdfOutput = z.infer<
  typeof ExtractTextFromPdfOutputSchema
>;

export async function extractTextFromPdf(
  input: ExtractTextFromPdfInput
): Promise<ExtractTextFromPdfOutput> {
  return extractTextFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTextFromPdfPrompt',
  input: {schema: ExtractTextFromPdfInputSchema},
  output: {schema: ExtractTextFromPdfOutputSchema},
  prompt: `You are an expert at extracting text from documents.
Please extract all the text from the following PDF file.
PDF: {{media url=pdfDataUri}}`,
  model: 'googleai/gemini-1.5-flash-latest'
});

const extractTextFromPdfFlow = ai.defineFlow(
  {
    name: 'extractTextFromPdfFlow',
    inputSchema: ExtractTextFromPdfInputSchema,
    outputSchema: ExtractTextFromPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
