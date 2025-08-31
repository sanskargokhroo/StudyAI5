'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { Progress } from '@/components/ui/progress';


interface UploadHandlerProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export function UploadHandler({ onFileUpload, isLoading }: UploadHandlerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isLoading) {
      setProgress(0);
      let progressValue = 0;
      timer = setInterval(() => {
        progressValue += Math.random() * 10;
        if (progressValue >= 95) {
          if(timer) clearInterval(timer);
          progressValue = 95;
        }
        setProgress(progressValue);
      }, 500);
    } else {
      setProgress(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset the input value to allow uploading the same file again
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
                if (file) onFileUpload(file);
              }
            }}
            >
            {isLoading ? (
              <div className='w-full text-center'>
                  <p className="mb-2 text-muted-foreground font-semibold">Processing... {Math.round(progress)}%</p>
                  <p className="mb-4 text-sm text-muted-foreground">This may take a moment. Please wait.</p>
                  <Progress value={progress} className="w-full" />
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="mb-4 text-muted-foreground">
                  Drag & drop a PDF here or click below.
                </p>
                <Button size="lg" onClick={(e) => e.stopPropagation()}>
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
        </CardContent>
      </Card>
    </div>
  );
}
