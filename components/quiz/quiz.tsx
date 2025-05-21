'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Base question interface
interface BaseQuestion {
  question: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Multiple choice question
interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

// True/False question
interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

// Fill in the blank question
interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  correctAnswer: string;
}

// Matching question
interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: { term: string; definition: string }[];
}

// Union type for all question types
export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion;

export interface QuizProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
}

export default function Quiz({ title, description, questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');
  const [matchingPairs, setMatchingPairs] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;

  // Handle full screen mode
  useEffect(() => {
    const handleFullScreen = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
        // Show warning if quiz is not completed and user exits full screen
        if (currentQuestionIndex < totalQuestions - 1) {
          setShowExitWarning(true);
          // Try to re-enter full screen after a short delay
          setTimeout(() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.error('Failed to re-enter full screen mode:', err);
              });
            }
          }, 1000);
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreen);

    // Prevent navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You are in the middle of a quiz. Are you sure you want to leave?';
      return e.returnValue;
    };

    // Prevent keyboard shortcuts that might exit full screen
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F11, Escape, Alt+Tab, etc.
      if (e.key === 'F11' || e.key === 'Escape' || (e.altKey && e.key === 'Tab')) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreen);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [currentQuestionIndex, totalQuestions]);

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

  // Check if answer is correct based on question type
  const isAnswerCorrect = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return selectedOption === currentQuestion.correctAnswer;
      case 'true-false':
        return selectedTrueFalse === currentQuestion.correctAnswer;
      case 'fill-blank':
        // Case-insensitive comparison for fill-in-the-blank
        return fillBlankAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
      case 'matching':
        // Check if all pairs are matched correctly
        return currentQuestion.pairs.every((_, index) => matchingPairs[index] === index);
      default:
        return false;
    }
  };

  // Handle multiple choice selection
  const handleMultipleChoiceSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    // Update score if correct
    if (optionIndex === (currentQuestion as MultipleChoiceQuestion).correctAnswer) {
      setScore(score + 1);
    }
  };

  // Handle true/false selection
  const handleTrueFalseSelect = (value: boolean) => {
    if (isAnswered) return;

    setSelectedTrueFalse(value);
    setIsAnswered(true);

    // Update score if correct
    if (value === (currentQuestion as TrueFalseQuestion).correctAnswer) {
      setScore(score + 1);
    }
  };

  // Handle fill in the blank submission
  const handleFillBlankSubmit = () => {
    if (isAnswered || !fillBlankAnswer.trim()) return;

    setIsAnswered(true);

    // Update score if correct (case-insensitive)
    if (fillBlankAnswer.trim().toLowerCase() === (currentQuestion as FillBlankQuestion).correctAnswer.toLowerCase()) {
      setScore(score + 1);
    }
  };

  // Handle matching pair selection
  const handleMatchingPairSelect = (termIndex: number, definitionIndex: number) => {
    if (isAnswered) return;

    // Update the matching pairs
    setMatchingPairs({
      ...matchingPairs,
      [termIndex]: definitionIndex,
    });

    // Check if all pairs have been matched
    const updatedPairs = { ...matchingPairs, [termIndex]: definitionIndex };
    const allPairsMatched = (currentQuestion as MatchingQuestion).pairs.every((_, index) =>
      updatedPairs[index] !== undefined
    );

    if (allPairsMatched) {
      setIsAnswered(true);

      // Update score if all pairs are matched correctly
      const allCorrect = (currentQuestion as MatchingQuestion).pairs.every((_, index) =>
        updatedPairs[index] === index
      );

      if (allCorrect) {
        setScore(score + 1);
      }
    }
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

      // Reset state for next question
      setSelectedOption(null);
      setSelectedTrueFalse(null);
      setFillBlankAnswer('');
      setMatchingPairs({});
      setIsAnswered(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in">
            <h2 className="text-xl font-bold text-red-500 mb-4">Warning!</h2>
            <p className="mb-6">
              You are in the middle of a quiz. Exiting full screen mode is not allowed.
              Please continue with the quiz in full screen mode.
            </p>
            <Button
              onClick={() => {
                setShowExitWarning(false);
                document.documentElement.requestFullscreen().catch(err => {
                  console.error('Failed to re-enter full screen mode:', err);
                });
              }}
              className="w-full"
            >
              Return to Quiz
            </Button>
          </Card>
        </div>
      )}

      {/* Quiz Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">{description}</p>

        {/* Difficulty Badge */}
        <div className="flex justify-center mb-4">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            currentQuestion.difficulty === 'easy' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            currentQuestion.difficulty === 'medium' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            currentQuestion.difficulty === 'hard' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)} Difficulty
          </span>
        </div>

        {/* Progress Bar */}
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
      <Card className="p-6 mb-6 shadow-lg border-2 border-border/50">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {currentQuestionIndex + 1}
          </span>
          {currentQuestion.question}
        </h2>

        {/* Question Type Badge */}
        <div className="mb-4">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-primary/10 text-primary"
          )}>
            {currentQuestion.type === 'multiple-choice' && 'Multiple Choice'}
            {currentQuestion.type === 'true-false' && 'True or False'}
            {currentQuestion.type === 'fill-blank' && 'Fill in the Blank'}
            {currentQuestion.type === 'matching' && 'Matching'}
          </span>
        </div>

        {/* Multiple Choice Question */}
        {currentQuestion.type === 'multiple-choice' && (
          <div className="space-y-3">
            {(currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMultipleChoiceSelect(index)}
                disabled={isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all",
                  "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  isAnswered && index === selectedOption && index === (currentQuestion as MultipleChoiceQuestion).correctAnswer &&
                    "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                  isAnswered && index === selectedOption && index !== (currentQuestion as MultipleChoiceQuestion).correctAnswer &&
                    "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500",
                  isAnswered && index !== selectedOption && index === (currentQuestion as MultipleChoiceQuestion).correctAnswer &&
                    "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                  isAnswered && index !== selectedOption && index !== (currentQuestion as MultipleChoiceQuestion).correctAnswer &&
                    "opacity-70",
                  !isAnswered && "bg-card hover:bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isAnswered ? (
                      index === (currentQuestion as MultipleChoiceQuestion).correctAnswer ? (
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
        )}

        {/* True/False Question */}
        {currentQuestion.type === 'true-false' && (
          <div className="space-y-3">
            {[true, false].map((value, index) => (
              <button
                key={index}
                onClick={() => handleTrueFalseSelect(value)}
                disabled={isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all",
                  "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  isAnswered && value === selectedTrueFalse && value === (currentQuestion as TrueFalseQuestion).correctAnswer &&
                    "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                  isAnswered && value === selectedTrueFalse && value !== (currentQuestion as TrueFalseQuestion).correctAnswer &&
                    "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500",
                  isAnswered && value !== selectedTrueFalse && value === (currentQuestion as TrueFalseQuestion).correctAnswer &&
                    "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                  isAnswered && value !== selectedTrueFalse && value !== (currentQuestion as TrueFalseQuestion).correctAnswer &&
                    "opacity-70",
                  !isAnswered && "bg-card hover:bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isAnswered ? (
                      value === (currentQuestion as TrueFalseQuestion).correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : value === selectedTrueFalse ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{value ? 'True' : 'False'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Fill in the Blank Question */}
        {currentQuestion.type === 'fill-blank' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={fillBlankAnswer}
                onChange={(e) => setFillBlankAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Type your answer here..."
                className={cn(
                  "w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20",
                  isAnswered && fillBlankAnswer.trim().toLowerCase() === (currentQuestion as FillBlankQuestion).correctAnswer.toLowerCase() &&
                    "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500",
                  isAnswered && fillBlankAnswer.trim().toLowerCase() !== (currentQuestion as FillBlankQuestion).correctAnswer.toLowerCase() &&
                    "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-500",
                  !isAnswered && "bg-card"
                )}
              />
              {!isAnswered && (
                <Button
                  onClick={handleFillBlankSubmit}
                  disabled={!fillBlankAnswer.trim()}
                  className="absolute right-1 top-1 h-8"
                  size="sm"
                >
                  Submit
                </Button>
              )}
            </div>

            {isAnswered && (
              <div className={cn(
                "p-3 rounded-lg",
                fillBlankAnswer.trim().toLowerCase() === (currentQuestion as FillBlankQuestion).correctAnswer.toLowerCase() ?
                  "bg-green-50 dark:bg-green-900/20" :
                  "bg-red-50 dark:bg-red-900/20"
              )}>
                <p className="font-medium">
                  {fillBlankAnswer.trim().toLowerCase() === (currentQuestion as FillBlankQuestion).correctAnswer.toLowerCase() ?
                    'Correct!' :
                    'Incorrect!'}
                </p>
                <p className="text-sm mt-1">
                  The correct answer is: <span className="font-bold">{(currentQuestion as FillBlankQuestion).correctAnswer}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Matching Question */}
        {currentQuestion.type === 'matching' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Terms Column */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Terms</h3>
                {(currentQuestion as MatchingQuestion).pairs.map((pair, termIndex) => (
                  <div
                    key={termIndex}
                    className={cn(
                      "p-3 rounded-lg border bg-card",
                      isAnswered && matchingPairs[termIndex] === termIndex && "border-green-500 bg-green-50 dark:bg-green-900/20",
                      isAnswered && matchingPairs[termIndex] !== undefined && matchingPairs[termIndex] !== termIndex && "border-red-500 bg-red-50 dark:bg-red-900/20"
                    )}
                  >
                    <p className="font-medium">{pair.term}</p>
                  </div>
                ))}
              </div>

              {/* Definitions Column */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Definitions</h3>
                {(currentQuestion as MatchingQuestion).pairs.map((pair, definitionIndex) => (
                  <button
                    key={definitionIndex}
                    onClick={() => {
                      // Find the term that's currently being matched
                      const selectedTermIndex = Object.keys(matchingPairs).find(
                        key => matchingPairs[parseInt(key)] === definitionIndex
                      );

                      // If this definition is already matched, unselect it
                      if (selectedTermIndex !== undefined) {
                        const newPairs = { ...matchingPairs };
                        delete newPairs[parseInt(selectedTermIndex)];
                        setMatchingPairs(newPairs);
                      }

                      // Find the first unmatched term
                      const unmatchedTermIndex = (currentQuestion as MatchingQuestion).pairs.findIndex(
                        (_, index) => matchingPairs[index] === undefined
                      );

                      if (unmatchedTermIndex !== -1 && !isAnswered) {
                        handleMatchingPairSelect(unmatchedTermIndex, definitionIndex);
                      }
                    }}
                    disabled={isAnswered}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all",
                      "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                      !isAnswered && "bg-card hover:bg-accent",
                      isAnswered && Object.values(matchingPairs).includes(definitionIndex) &&
                        Object.entries(matchingPairs).some(([termIdx, defIdx]) =>
                          parseInt(termIdx) === defIdx && defIdx === definitionIndex
                        ) && "bg-green-50 border-green-500 dark:bg-green-900/20",
                      isAnswered && Object.values(matchingPairs).includes(definitionIndex) &&
                        !Object.entries(matchingPairs).some(([termIdx, defIdx]) =>
                          parseInt(termIdx) === defIdx && defIdx === definitionIndex
                        ) && "bg-red-50 border-red-500 dark:bg-red-900/20"
                    )}
                  >
                    <p className="font-medium">{pair.definition}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Matching Lines */}
            {Object.entries(matchingPairs).map(([termIndex, definitionIndex]) => (
              <div key={termIndex} className="hidden md:block">
                {/* This would be a visual line connecting matched pairs */}
                {/* For simplicity, we're not implementing the actual visual lines */}
              </div>
            ))}
          </div>
        )}

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
          size="lg"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
