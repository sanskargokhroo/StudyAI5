'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';


interface UploadHandlerProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE_MB = 4.5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function UploadHandler({ onFileUpload, isLoading }: UploadHandlerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            if (interval) clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 1000);
    } else {
      setProgress(100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleFileValidation = (file: File | undefined): boolean => {
    if (!file) {
        return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
            variant: 'destructive',
            title: 'File too large',
            description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.`,
        });
        return false;
    }
    return true;
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (handleFileValidation(file)) {
      onFileUpload(file!);
    }
    event.target.value = '';
  };

  const handleClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-center animate-in fade-in duration-500">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline">Start Learning Now</CardTitle>
          <CardDescription>Upload a PDF to generate quizzes, flashcards, and notes with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-center bg-background ${!isLoading ? 'cursor-pointer' : ''}`}
            onClick={handleClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!isLoading) {
                const file = e.dataTransfer.files?.[0];
                if (handleFileValidation(file)) {
                    onFileUpload(file!);
                }
              }
            }}
            >
            {isLoading ? (
              <div className="w-full max-w-xs text-center">
                <p className="mb-4 text-muted-foreground">Processing your document...</p>
                <Progress value={progress} className="w-full" />
                <p className="mt-2 text-sm text-muted-foreground">{Math.round(progress)}%</p>
            </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="mb-4 text-muted-foreground">
                  Upload Document
                </p>
                <Button size="lg" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
                    Upload PDF
                </Button>
              </>
            )}

            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-center mt-2 text-muted-foreground">Max file size: {MAX_FILE_SIZE_MB} MB</p>
        </CardContent>
      </Card>
    </div>
  );
}
