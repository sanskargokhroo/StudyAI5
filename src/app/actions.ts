'use server';

import { createFlashcardsFromDocument } from '@/ai/flows/create-flashcards-from-document';
import { generateNotesFromDocument } from '@/ai/flows/generate-notes-from-document';
import { generateQuiz } from '@/ai/flows/generate-quiz-from-document';
import { explainQuizAnswer } from '@/ai/flows/explain-quiz-answer';
import { Quiz, QuizQuestion } from '@/lib/types';
import { extractTextFromPdf } from '@/ai/flows/extract-text-from-pdf';

async function getTextFromPdf(buffer: Buffer): Promise<string> {
    const pdfDataUri = `data:application/pdf;base64,${buffer.toString('base64')}`;
    const result = await extractTextFromPdf({ pdfDataUri });
    return result.extractedText;
}

export async function handleFileRead(formData: FormData): Promise<string> {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file was uploaded.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === 'application/pdf') {
        return getTextFromPdf(buffer);
    }

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
       throw new Error('DOCX files are not supported yet. Please upload a PDF file.');
    }

    if (file.type === 'text/plain') {
       throw new Error('TXT files are not supported. Please use a PDF file instead.');
    }
    
    throw new Error(`Unsupported file type: '${file.type}'. Please upload a PDF.`);
}


function parseQuizString(quizString: string): Quiz {
  try {
    const cleanString = quizString.replace(/```json\n?|(\r\n|\n|\r)/gm, '').replace(/```/g, '');
    const parsed = JSON.parse(cleanString);
    if (parsed.quiz && parsed.quiz.questions) {
       return parsed.quiz;
    }
    if (parsed.questions) {
      return { questions: parsed.questions };
    }
     return { questions: parsed };
  } catch (e) {
    console.warn('Failed to parse quiz as JSON, attempting text parsing.', e);
    const questions = [];
    const questionBlocks = quizString.trim().split(/\n\s*\n/);
    
    for (const block of questionBlocks) {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 3) continue;

      const question = lines[0].replace(/^\d+\.\s*/, '').trim();
      const options = lines.slice(1, -1).map(line => line.replace(/^[A-D]\)\s*/i, '').trim());
      const answerLine = lines[lines.length - 1];
      const match = answerLine.match(/(?:Answer|Correct Answer):?\s*([A-D])\)?\.?\s*(.*)/i);
      
      if (match) {
        const optionLetter = match[1].toUpperCase();
        const optionIndex = optionLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        if (optionIndex >= 0 && optionIndex < options.length) {
            questions.push({
                question,
                options,
                answer: options[optionIndex],
            });
        }
      }
    }
    if (questions.length === 0) {
        throw new Error("Could not parse the quiz from the generated text. Please try again.")
    }
    return { questions };
  }
}


export async function handleGenerateQuiz(documentText: string) {
  try {
    const { quiz: quizString } = await generateQuiz({ documentText });
    return parseQuizString(quizString);
  } catch (error) {
    console.error('Error generating or parsing quiz:', error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('Failed to generate a valid quiz.');
  }
}

export async function handleCreateFlashcards(documentText: string) {
  return await createFlashcardsFromDocument({ documentText });
}

export async function handleGenerateNotes(documentText: string) {
  return await generateNotesFromDocument({ documentText });
}

export async function handleExplainAnswer(question: QuizQuestion, userAnswer: string) {
  return await explainQuizAnswer({
    question: question.question,
    options: question.options,
    correctAnswer: question.answer,
    userAnswer: userAnswer,
  });
}
