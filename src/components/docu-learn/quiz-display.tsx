'use client';

import { useState } from 'react';
import { Quiz, QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, ChevronRight, RefreshCw, LoaderCircle, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { handleExplainAnswer } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface QuizDisplayProps {
  quiz: Quiz;
  onRestart: () => void;
}

export function QuizDisplay({ quiz, onRestart }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [explainingIndex, setExplainingIndex] = useState<number | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleExplain = async (questionIndex: number) => {
    if (explanations[questionIndex] || explainingIndex !== null) return;
    setExplainingIndex(questionIndex);
    try {
      const question = quiz.questions[questionIndex];
      const userAnswer = selectedAnswers[questionIndex];
      const result = await handleExplainAnswer(question, userAnswer);
      setExplanations((prev) => ({ ...prev, [questionIndex]: result.explanation }));
    } catch (error) {
      console.error("Error explaining answer:", error);
      setExplanations((prev) => ({ ...prev, [questionIndex]: "Sorry, I couldn't generate an explanation right now." }));
    } finally {
      setExplainingIndex(null);
    }
  };

  const score = Object.keys(selectedAnswers).reduce((acc, indexStr) => {
    const index = parseInt(indexStr, 10);
    return selectedAnswers[index] === quiz.questions[index].answer ? acc + 1 : acc;
  }, 0);

  if (isFinished) {
    const finalScore = (score / quiz.questions.length) * 100;
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <Card className="text-center p-6 flex flex-col items-center gap-4 shadow-lg mb-8">
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-lg text-muted-foreground">You scored</p>
            <div className="text-5xl font-bold text-primary">{score} / {quiz.questions.length}</div>
            <Progress value={finalScore} className="w-full my-4" />
            <Button onClick={onRestart}>
                <RefreshCw className="mr-2 h-4 w-4"/>
                Retake Quiz (New Questions)
            </Button>
        </Card>

        <h3 className="text-xl font-bold text-center mb-4">Review Your Answers</h3>
        <Accordion type="single" collapsible className="w-full">
          {quiz.questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.answer;
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                    <div className="flex items-center gap-3">
                        {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                        <span className="text-left flex-1">{q.question}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className='p-2 space-y-4'>
                        <p><strong>Your Answer: </strong><span className={cn(isCorrect ? 'text-green-600' : 'text-red-600')}>{userAnswer}</span></p>
                        {!isCorrect && <p><strong>Correct Answer: </strong><span className='text-green-600'>{q.answer}</span></p>}
                        
                        {!isCorrect && (
                             <div>
                                {explanations[index] ? (
                                    <Alert>
                                        <Lightbulb className="h-4 w-4" />
                                        <AlertTitle>Explanation</AlertTitle>
                                        <AlertDescription>
                                            {explanations[index]}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleExplain(index)} disabled={explainingIndex !== null}>
                                        {explainingIndex === index ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                                        {explainingIndex === index ? 'Generating...' : 'Explain'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <Card className="text-center p-6 flex flex-col items-center gap-4 shadow-lg">
          <h2 className="text-xl font-bold">Invalid Quiz Data</h2>
          <p className="text-muted-foreground">Could not load the quiz questions.</p>
          <Button onClick={onRestart}>
              <RefreshCw className="mr-2 h-4 w-4"/>
              Start Over
          </Button>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentQuestionIndex + 1} of {quiz.questions.length}</p>
          </div>
          <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="w-full" />
          <CardDescription className="pt-6 text-lg text-foreground font-semibold">{currentQuestion.question}</CardDescription>
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
                    showResult && isCorrect && 'border-green-600 bg-green-600/30 hover:bg-green-600/40 text-green-600 dark:text-green-500',
                    showResult && isSelected && !isCorrect && 'border-red-600 bg-red-600/30 hover:bg-red-600/40 text-red-600 dark:text-red-500',
                  )}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  <div className="flex-grow">{option}</div>
                  {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-4 shrink-0" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 ml-4 shrink-0" />}
                </Button>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end mt-4">
          <Button onClick={handleNext} disabled={!selectedAnswer}>
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
