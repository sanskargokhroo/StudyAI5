'use client';

import { useState } from 'react';
import {
  handleCreateFlashcards,
  handleGenerateNotes,
  handleGenerateQuiz,
} from '@/app/actions';
import { Flashcard, Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Layers,
  FileText,
  HelpCircle,
  LoaderCircle,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FlashcardDisplay } from './flashcard-display';
import { QuizDisplay } from './quiz-display';
import { NotesDisplay } from './notes-display';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


interface ActivityDashboardProps {
  documentText: string;
  onReset: () => void;
}

type Activity = 'quiz' | 'flashcards' | 'notes';

export function ActivityDashboard({ documentText, onReset }: ActivityDashboardProps) {
  const [loadingActivity, setLoadingActivity] = useState<Activity | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [notes, setNotes] = useState<string>('');
  const { toast } = useToast();

  const onGenerate = async (activity: Activity) => {
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
    } catch (error) {
      console.error(`Error generating ${activity}:`, error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: (error as Error).message || `Failed to generate ${activity}.`,
      });
    } finally {
      setLoadingActivity(null);
    }
  };

  const isAnyActivityLoading = loadingActivity !== null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end gap-2 items-center">
          <Button variant="outline" onClick={onReset} className="shrink-0">
            <RotateCcw className="mr-2 h-4 w-4" />
            Upload New Document
          </Button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold font-headline">Choose Your Study Tool</h2>
        <p className="text-muted-foreground">Select an activity to generate from your document.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent" />
              <CardTitle>Automated Notes</CardTitle>
            </div>
            <CardDescription>A concise summary of the key points.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {loadingActivity === 'notes' && <div className="flex justify-center items-center h-24"><LoaderCircle className="w-8 h-8 animate-spin text-primary"/></div>}
            {notes && loadingActivity !== 'notes' && <NotesDisplay notes={notes} />}
          </CardContent>
          <CardFooter>
             {!notes && <Button className="w-full" onClick={() => onGenerate('notes')} disabled={isAnyActivityLoading}>
                {loadingActivity === 'notes' ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate Notes
            </Button>}
             {notes && <Button className="w-full" onClick={() => onGenerate('notes')} disabled={isAnyActivityLoading}>
                {loadingActivity === 'notes' ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                Regenerate Notes
            </Button>}
          </CardFooter>
        </Card>

        <Card className="flex flex-col justify-between shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-accent" />
              <CardTitle>Flashcards</CardTitle>
            </div>
            <CardDescription>Interactive flashcards for active recall.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter>
            <Dialog onOpenChange={(open) => !open && loadingActivity === 'flashcards' && setLoadingActivity(null)}>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={() => { if (flashcards.length === 0) onGenerate('flashcards'); }} disabled={isAnyActivityLoading && loadingActivity !== 'flashcards'}>
                  {loadingActivity === 'flashcards' ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {flashcards.length > 0 ? 'View Flashcards' : 'Create Flashcards'}
                </Button>
              </DialogTrigger>
              {flashcards.length > 0 && !isAnyActivityLoading && (
                <DialogContent className="max-w-2xl w-full h-[80vh] flex flex-col p-6">
                  <DialogHeader>
                    <DialogTitle>Flashcards</DialogTitle>
                  </DialogHeader>
                  <FlashcardDisplay flashcards={flashcards} />
                </DialogContent>
              )}
            </Dialog>
          </CardFooter>
        </Card>

        <Card className="flex flex-col justify-between shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-accent" />
              <CardTitle>Quiz</CardTitle>
            </div>
            <CardDescription>Test your knowledge with a custom quiz.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter>
            <Dialog onOpenChange={(open) => !open && loadingActivity === 'quiz' && setLoadingActivity(null)}>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={() => { if (!quiz) onGenerate('quiz'); }} disabled={isAnyActivityLoading && loadingActivity !== 'quiz'}>
                  {loadingActivity === 'quiz' ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {quiz ? 'Take Quiz' : 'Generate Quiz'}
                </Button>
              </DialogTrigger>
              {quiz && !isAnyActivityLoading && (
                <DialogContent className="max-w-3xl w-full">
                  <DialogHeader>
                    <DialogTitle>Knowledge Check</DialogTitle>
                  </DialogHeader>
                  <QuizDisplay quiz={quiz} />
                </DialogContent>
              )}
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
