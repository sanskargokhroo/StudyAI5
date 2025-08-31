'use client';

import { useState } from 'react';
import { ActivityDashboard } from '@/components/docu-learn/activity-dashboard';
import { UploadHandler } from '@/components/docu-learn/upload-handler';
import { BrainCircuit } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { handleFileRead } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const text = await handleFileRead(formData);
      setDocumentText(text);
      toast({
        title: 'File Uploaded Successfully!',
        description: 'Your document has been processed. You can now generate notes, flashcards, or a quiz.',
      });
    } catch (error) {
      console.error("Failed to process file:", error);
      toast({
        variant: 'destructive',
        title: 'File processing failed',
        description: (error as Error).message,
      });
      setDocumentText(null);
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDocumentText(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
                <BrainCircuit className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
              StudyAI
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-[10%]">by Sanskar Gokhroo</p>
        </header>

        {documentText ? (
          <ActivityDashboard documentText={documentText} onReset={handleReset} />
        ) : (
          <UploadHandler onFileUpload={handleFileUpload} isLoading={isLoading} />
        )}

        <footer className="text-center mt-12 text-sm text-muted-foreground">
          <p>Powered by AI. Built for modern learners.</p>
        </footer>
      </main>
    </div>
  );
}
