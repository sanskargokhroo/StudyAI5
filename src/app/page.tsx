'use client';

import { useState } from 'react';
import { ActivityDashboard } from '@/components/docu-learn/activity-dashboard';
import { UploadHandler } from '@/components/docu-learn/upload-handler';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';


const sampleDocumentText = `The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority (99.86%) of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter. The four inner terrestrial planets—Mercury, Venus, Earth, and Mars—are composed primarily of rock and metal. The four outer giant planets are substantially more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium; the two outermost planets, Uranus and Neptune, are ice giants, being composed mostly of substances with relatively high melting points compared with hydrogen and helium, such as water, ammonia, and methane. All eight planets have nearly circular orbits that lie within a nearly flat disc called the ecliptic.`;

export default function Home() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = () => {
    setIsLoading(true);
    // Simulate OCR and processing
    setTimeout(() => {
      setDocumentText(sampleDocumentText);
      setIsLoading(false);
    }, 2000);
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
                <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
              StudyAI
            </h1>
          </div>
          <p className="text-sm text-muted-foreground -mt-1 ml-[10%]">by Sanskar Gokhroo</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            Upload your documents and unlock a world of interactive learning. Generate quizzes, flashcards, notes, and more with the power of AI.
          </p>
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
