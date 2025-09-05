'use client';

import { useState, useCallback } from 'react';
import {
  handleCreateFlashcards,
  handleGenerateNotes,
  handleGenerateQuiz,
} from '@/app/actions';
import { Flashcard, Quiz } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { FlashcardDisplay } from './flashcard-display';
import { QuizDisplay } from './quiz-display';
import { NotesDisplay } from './notes-display';
import { Button } from '../ui/button';
import { RotateCcw, ArrowLeft, BrainCircuit } from 'lucide-react';
import { ActivityDashboard } from './activity-dashboard';
import { LoaderCircle } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

interface StudyInterfaceProps {
  documentText: string;
  onReset: () => void;
}

type Activity = 'quiz' | 'flashcards' | 'notes' | 'home';

export function StudyInterface({ documentText, onReset }: StudyInterfaceProps) {
  const [loadingActivity, setLoadingActivity] = useState<Activity | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity>('home');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [notes, setNotes] = useState<string>('');
  const { toast } = useToast();

  const onGenerate = useCallback(async (activity: 'quiz' | 'flashcards' | 'notes', forceNew = false) => {
    if (loadingActivity) return;

    const hasContent = {
        notes: notes !== '',
        flashcards: flashcards.length > 0,
        quiz: quiz !== null,
    };

    if (!forceNew && hasContent[activity]) {
        setActiveActivity(activity);
        return;
    }

    setLoadingActivity(activity);
    try {
      if (activity === 'quiz') {
        const result = await handleGenerateQuiz(documentText);
        setQuiz(result);
      } else if (activity === 'flashcards') {
        const result = await handleCreateFlashcards(documentText);
        setFlashcards(result.flashcards);
      } else if (activity === 'notes') {
        const result = await handleGenerateNotes(documentText);
        setNotes(result.notes);
      }
      setActiveActivity(activity);
    } catch (error) {
      console.error(`Error generating ${activity}:`, error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: (error as Error).message || `Failed to generate ${activity}.`,
      });
      setActiveActivity('home');
    } finally {
      setLoadingActivity(null);
    }
  }, [documentText, flashcards.length, loadingActivity, notes, quiz, toast]);
  
  const isAnyActivityLoading = loadingActivity !== null;

  const hasGeneratedContent = {
    notes: notes !== '',
    flashcards: flashcards.length > 0,
    quiz: quiz !== null,
  };
  
  const handleQuizRestart = () => {
    onGenerate('quiz', true);
  };


  const renderContent = () => {
    if (isAnyActivityLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Generating {loadingActivity}...</p>
        </div>
      );
    }
    
    switch (activeActivity) {
      case 'home':
        return <ActivityDashboard 
          onGenerate={onGenerate} 
          isAnyActivityLoading={isAnyActivityLoading}
          hasGeneratedContent={hasGeneratedContent}
          setActiveActivity={onGenerate}
        />;
      case 'notes':
        return notes ? <NotesDisplay notes={notes} /> : null;
      case 'flashcards':
        return flashcards.length > 0 ? <FlashcardDisplay flashcards={flashcards} /> : null;
      case 'quiz':
        return quiz ? <QuizDisplay quiz={quiz} onRestart={handleQuizRestart} /> : null;
      default:
        return <ActivityDashboard 
          onGenerate={onGenerate} 
          isAnyActivityLoading={isAnyActivityLoading}
          hasGeneratedContent={hasGeneratedContent}
          setActiveActivity={onGenerate}
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
       <header className="p-4 flex justify-between items-center border-b">
           <div className="flex items-center gap-4">
            {activeActivity !== 'home' ? (
                <Button variant="outline" onClick={() => setActiveActivity('home')} className="shrink-0">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            ) : null }
              <div className="flex flex-col">
                  <div className="inline-flex items-center gap-2">
                      <BrainCircuit className="w-6 h-6 text-primary" />
                      <h1 className="text-xl font-bold font-headline tracking-tight text-foreground">
                          StudyAI
                      </h1>
                  </div>
                  <p className="text-xs text-foreground/80">by Sanskar Gokhroo</p>
              </div>
           </div>
           <div className="flex justify-end gap-2 items-center">
            <ThemeToggle />
            <Button variant="outline" onClick={onReset} className="shrink-0">
                <RotateCcw className="mr-2 h-4 w-4" />
                Upload New
            </Button>
           </div>
        </header>
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
    </div>
  );
}
