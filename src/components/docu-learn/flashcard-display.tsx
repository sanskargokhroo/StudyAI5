'use client';
import { useState, useCallback } from 'react';
import { Flashcard } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import './flashcard.css';

interface FlashcardDisplayProps {
  flashcards: Flashcard[];
}

export function FlashcardDisplay({ flashcards }: FlashcardDisplayProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const handleFlip = useCallback((index: number) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  if (!flashcards || flashcards.length === 0) {
    return <p className="text-center text-muted-foreground">No flashcards available.</p>;
  }

  return (
    <div className='w-full h-full flex flex-col p-4 sm:p-6 md:p-8 justify-center items-center'>
      <h1 className="text-3xl font-bold mb-6 text-center">Flashcards</h1>
      <Carousel className="w-full max-w-xl flex-grow flex flex-col justify-center">
        <CarouselContent>
          {flashcards.map((card, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="flashcard-container" onClick={() => handleFlip(index)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip(index)}>
                  <div className={cn("flashcard", { 'is-flipped': flipped[index] })}>
                    <div className="flashcard-face flashcard-front">
                      <Card className="h-full shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center p-6 h-full text-center">
                          <p className="text-lg md:text-xl font-semibold">{card.front}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flashcard-face flashcard-back">
                      <Card className="h-full shadow-lg">
                         <CardContent className="flex flex-col items-center justify-center p-6 h-full text-center">
                           <p className="text-md md:text-lg">{card.back}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-50px]" />
        <CarouselNext className="right-[-50px]" />
      </Carousel>
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Click a card to flip it. Use arrows to navigate. ({flashcards.length} cards)
      </div>
    </div>
  );
}
