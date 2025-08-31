'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, LoaderCircle } from "lucide-react";

interface UploadHandlerProps {
  onFileUpload: () => void;
  isLoading: boolean;
}

export function UploadHandler({ onFileUpload, isLoading }: UploadHandlerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-center animate-in fade-in duration-500">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Start Learning Now</CardTitle>
          <CardDescription>Upload your documents to generate quizzes, flashcards, and notes with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-center bg-background">
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="mb-4 text-muted-foreground">
              Drag & drop your file here or click below.
            </p>
            <Button onClick={onFileUpload} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">For demo purposes, this will load a sample document.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
