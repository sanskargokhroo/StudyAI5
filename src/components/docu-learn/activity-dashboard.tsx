'use client';

import {
  Layers,
  FileText,
  HelpCircle,
  LoaderCircle,
  Home,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActivityDashboardProps {
  onGenerate: (activity: 'notes' | 'flashcards' | 'quiz') => void;
  isAnyActivityLoading: boolean;
  hasGeneratedContent: {
    notes: boolean;
    flashcards: boolean;
    quiz: boolean;
  };
  setActiveActivity: (activity: 'notes' | 'flashcards' | 'quiz' | 'home') => void;
}

export function ActivityDashboard({
  onGenerate,
  isAnyActivityLoading,
  hasGeneratedContent,
  setActiveActivity,
}: ActivityDashboardProps) {

  const handleGenerateClick = (activity: 'notes' | 'flashcards' | 'quiz') => {
    onGenerate(activity);
    setActiveActivity(activity);
  };

  const handleViewClick = (activity: 'notes' | 'flashcards' | 'quiz') => {
    setActiveActivity(activity);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
       <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
            Study Tools
          </h1>
          <p className="text-muted-foreground mt-2">Select an activity to generate from your document.</p>
        </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent" />
              <CardTitle>Create Notes</CardTitle>
            </div>
            <CardDescription>A concise summary of the key points.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Generate comprehensive notes to review the core concepts of your document.</p>
          </CardContent>
          <CardFooter>
             <Button className="w-full" onClick={() => hasGeneratedContent.notes ? handleViewClick('notes') : handleGenerateClick('notes')} disabled={isAnyActivityLoading}>
                {isAnyActivityLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {hasGeneratedContent.notes ? 'View Notes' : 'Generate Notes'}
            </Button>
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
           <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Create a set of flashcards to test your memory on key terms and definitions.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => hasGeneratedContent.flashcards ? handleViewClick('flashcards') : handleGenerateClick('flashcards')} disabled={isAnyActivityLoading}>
              {isAnyActivityLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {hasGeneratedContent.flashcards ? 'View Flashcards' : 'Create Flashcards'}
            </Button>
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
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">Generate a multiple-choice quiz to challenge your understanding of the material.</p>
          </CardContent>
          <CardFooter>
             <Button className="w-full" onClick={() => hasGeneratedContent.quiz ? handleViewClick('quiz') : handleGenerateClick('quiz')} disabled={isAnyActivityLoading}>
              {isAnyActivityLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {hasGeneratedContent.quiz ? 'Take Quiz' : 'Generate Quiz'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
