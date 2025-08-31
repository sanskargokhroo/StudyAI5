'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, LoaderCircle } from 'lucide-react';

interface PodcastPlayerProps {
  text: string;
}

export function PodcastPlayer({ text }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlay = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onerror = (e) => {
        console.error('SpeechSynthesis Error', e)
        setIsPlaying(false);
        setIsPaused(false);
    }

    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);

  }, [text, isPaused]);

  const handlePause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  }, []);
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };
  
  if (!isMounted) {
      return (
          <Button variant="outline" size="icon" disabled>
              <LoaderCircle className="h-4 w-4 animate-spin" />
          </Button>
      )
  }

  return (
    <Button variant="outline" size="icon" onClick={togglePlayPause} aria-label={isPlaying ? "Pause audio" : "Play audio"}>
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  );
}
