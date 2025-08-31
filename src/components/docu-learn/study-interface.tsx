'use client';

import { useState, useEffect } from 'react';
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
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { ActivityDashboard } from './activity-dashboard';
import { LoaderCircle } from 'lucide-react';

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

  const onGenerate = async (activity: 'quiz' | 'flashcards' | 'notes') => {
    if (isAnyActivityLoading) return;
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
      setActiveActivity('home'); // Go back to home on error
    } finally {
      setLoadingActivity(null);
    }
  };
  
  const isAnyActivityLoading = loadingActivity !== null;

  const hasGeneratedContent = {
    notes: notes !== '',
    flashcards: flashcards.length > 0,
    quiz: quiz !== null,
  };

  const handleNavClick = (activity: Activity) => {
    if (activity === 'home') {
      setActiveActivity('home');
    } else if (activity === 'notes') {
      if (hasGeneratedContent.notes) {
        setActiveActivity('notes');
      } else {
        onGenerate('notes');
      }
    } else if (activity === 'flashcards') {
      if (hasGeneratedContent.flashcards) {
        setActiveActivity('flashcards');
      } else {
        onGenerate('flashcards');
      }
    } else if (activity === 'quiz') {
        if (hasGeneratedContent.quiz) {
            setActiveActivity('quiz');
        } else {
            onGenerate('quiz');
        }
    }
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
          setActiveActivity={handleNavClick}
        />;
      case 'notes':
        return notes ? <NotesDisplay notes={notes} /> : <p>Generate notes to see them here.</p>;
      case 'flashcards':
        return flashcards.length > 0 ? <FlashcardDisplay flashcards={flashcards} /> : <p>Generate flashcards to see them here.</p>;
      case 'quiz':
        return quiz ? <QuizDisplay quiz={quiz} /> : <p>Generate a quiz to see it here.</p>;
      default:
        return <ActivityDashboard 
          onGenerate={onGenerate} 
          isAnyActivityLoading={isAnyActivityLoading}
          hasGeneratedContent={hasGeneratedContent}
          setActiveActivity={handleNavClick}
        />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="offcanvas">
        <SidebarContent className="p-2">
          <SidebarNav activeActivity={activeActivity} setActiveActivity={handleNavClick} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 flex justify-between items-center border-b">
           <SidebarTrigger />
           <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={onReset} className="shrink-0">
                <RotateCcw className="mr-2 h-4 w-4" />
                Upload New
            </Button>
            <ThemeToggle />
           </div>
        </div>
        <main className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
