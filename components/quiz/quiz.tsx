'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
}

export default function Quiz({ title, description, questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Handle full screen mode
  useEffect(() => {
    const handleFullScreen = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreen);
    
    // Prevent navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreen);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Enter full screen mode when component mounts
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error('Failed to enter full screen mode:', error);
      }
    };
    
    enterFullScreen();
  }, []);

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // Update score if correct
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Exit full screen mode
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      
      // Complete quiz
      onComplete(score, questions.length);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Quiz Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="h-2 w-full max-w-md bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Question */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all",
                "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                isAnswered && index === selectedOption && index === currentQuestion.correctAnswer && "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500",
                isAnswered && index !== selectedOption && index === currentQuestion.correctAnswer && "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                isAnswered && index !== selectedOption && index !== currentQuestion.correctAnswer && "opacity-70",
                !isAnswered && "bg-card hover:bg-accent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isAnswered ? (
                    index === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : index === selectedOption ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                    )
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{option}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Explanation */}
        {isAnswered && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
            <div>
              <p className="font-medium mb-1">Explanation:</p>
              <p className="text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button 
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className="gap-2"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
