import { config } from 'dotenv';
config();

import '@/ai/flows/create-flashcards-from-document.ts';
import '@/ai/flows/generate-quiz-from-document.ts';
import '@/ai/flows/generate-notes-from-document.ts';