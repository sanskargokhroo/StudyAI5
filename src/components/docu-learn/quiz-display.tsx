'use client';

import { useState } from 'react';
import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuizDisplayProps {
  quiz: Quiz;
}

export function QuizDisplay({ quiz }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  }

  const score = Object.keys(selectedAnswers).reduce((acc, indexStr) => {
    const index = parseInt(indexStr, 10);
    return selectedAnswers[index] === quiz.questions[index].answer ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    const finalScore = (score / quiz.questions.length) * 100;
    return (
        <div className="text-center p-6 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg text-muted-foreground">You scored</p>
            <div className="text-5xl font-bold text-primary">{score} / {quiz.questions.length}</div>
            <Progress value={finalScore} className="w-full my-4" />
            <Button onClick={handleRestart}>
                <RefreshCw className="mr-2 h-4 w-4"/>
                Retake Quiz
            </Button>
        </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="text-center p-6 flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">Invalid Quiz Data</h2>
        <p className="text-muted-foreground">Could not load the quiz questions.</p>
        <Button onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4"/>
            Start Over
        </Button>
      </div>
    )
  }
  
  return (
    <div className="p-2">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
            <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="w-1/3" />
          </div>
          <CardDescription className="pt-4 text-lg text-foreground">{currentQuestion.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = currentQuestion.answer === option;
              const showResult = !!selectedAnswer;

              return (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className={cn(
                    'justify-start h-auto py-3 text-left whitespace-normal',
                    showResult && isCorrect && 'border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-700',
                    showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-700',
                  )}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  <div className="flex-grow">{option}</div>
                  {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 ml-4 shrink-0" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-4 shrink-0" />}
                </Button>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext} disabled={!selectedAnswer}>
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
