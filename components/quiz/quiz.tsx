'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, Send } from 'lucide-react';

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

// User answer type
interface UserAnswer {
  questionIndex: number;
  question: string;
  answer: number | boolean | string | null;
  correctAnswer: number | boolean | string;
  isCorrect: boolean;
  explanation?: string;
}

// Union type for all question types
export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion

export interface QuizProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number, answers?: UserAnswer[]) => void;
}

export default function Quiz({ title, description, questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedTrueFalse, setSelectedTrueFalse] = useState<boolean | null>(null);
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  // Track fullscreen state for UI updates
  const [, setIsFullScreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(5);
  const [showCheatingMessage, setShowCheatingMessage] = useState(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;

  // State to track if a question has been answered
  const [isAnswered, setIsAnswered] = useState(false);

  // Handle full screen mode with enhanced security
  useEffect(() => {
    const handleFullScreen = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
        // Show warning if quiz is not completed
        if (!userAnswers.length || userAnswers.length < totalQuestions) {
          setShowExitWarning(true);
          setWarningCountdown(5);

          // Start countdown timer
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }

          countdownIntervalRef.current = setInterval(() => {
            setWarningCountdown(prev => {
              if (prev <= 1) {
                // Time's up - show cheating message
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                }
                setShowCheatingMessage(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    };

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && (!userAnswers.length || userAnswers.length < totalQuestions)) {
        setShowExitWarning(true);
        setWarningCountdown(5);

        // Start countdown timer
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }

        countdownIntervalRef.current = setInterval(() => {
          setWarningCountdown(prev => {
            if (prev <= 1) {
              // Time's up - show cheating message
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
              }
              setShowCheatingMessage(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreen);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Prevent navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Standard way to show a confirmation dialog when leaving the page
      const message = 'You are in the middle of a quiz. Are you sure you want to leave?';
      // For modern browsers
      e.preventDefault();
      // For older browsers
      // @ts-ignore - returnValue is deprecated but still needed for some browsers
      e.returnValue = message;
      return message;
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);

      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [currentQuestionIndex, totalQuestions, userAnswers.length]);

  // Enter full screen mode when component mounts
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        // Check if fullscreen is already active
        if (!document.fullscreenElement) {
          // Check if the browser supports fullscreen
          if (document.documentElement.requestFullscreen) {
            // Request fullscreen with a user gesture handler
            const handleUserGesture = () => {
              document.documentElement.requestFullscreen().catch(err => {
                console.error('Failed to enter full screen mode:', err);
              });
              // Remove the event listener after use
              document.removeEventListener('click', handleUserGesture);
            };

            // Add a one-time click event listener
            document.addEventListener('click', handleUserGesture, { once: true });

            // Simulate a click to trigger the fullscreen (this is a workaround)
            setTimeout(() => {
              // Only try direct request if we haven't entered fullscreen yet
              if (!document.fullscreenElement) {
                try {
                  document.documentElement.requestFullscreen();
                } catch (err) {
                  console.error('Direct fullscreen request failed:', err);
                  // Keep the click handler active if direct request fails
                }
              }
            }, 500);
          }
        }
      } catch (error) {
        console.error('Failed to setup full screen mode:', error);
      }
    };

    enterFullScreen();
  }, []);

  // Handle multiple choice selection
  const handleMultipleChoiceSelect = (optionIndex: number) => {
    // Allow changing answers anytime
    setSelectedOption(optionIndex);

    // Store answer without showing result
    const mcQuestion = currentQuestion as MultipleChoiceQuestion;
    const isCorrect = optionIndex === mcQuestion.correctAnswer;
    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      question: mcQuestion.question,
      answer: optionIndex,
      correctAnswer: mcQuestion.correctAnswer,
      isCorrect,
      explanation: mcQuestion.explanation
    };

    // Update user answers
    setUserAnswers(prev => {
      // Replace if already answered
      const existingIndex = prev.findIndex(a => a.questionIndex === currentQuestionIndex);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      // Add new answer
      return [...prev, newAnswer];
    });

    // Mark as answered for navigation purposes
    setIsAnswered(true);
  };

  // Handle true/false selection
  const handleTrueFalseSelect = (value: boolean) => {
    // Allow changing answers anytime
    setSelectedTrueFalse(value);

    // Store answer without showing result
    const tfQuestion = currentQuestion as TrueFalseQuestion;
    const isCorrect = value === tfQuestion.correctAnswer;
    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      question: tfQuestion.question,
      answer: value,
      correctAnswer: tfQuestion.correctAnswer,
      isCorrect,
      explanation: tfQuestion.explanation
    };

    // Update user answers
    setUserAnswers(prev => {
      // Replace if already answered
      const existingIndex = prev.findIndex(a => a.questionIndex === currentQuestionIndex);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      // Add new answer
      return [...prev, newAnswer];
    });

    // Mark as answered for navigation purposes
    setIsAnswered(true);
  };

  // Handle fill in the blank submission
  const handleFillBlankSubmit = () => {
    if (!fillBlankAnswer.trim()) return;

    // Store answer without showing result
    const fbQuestion = currentQuestion as FillBlankQuestion;
    const isCorrect = fillBlankAnswer.trim().toLowerCase() === fbQuestion.correctAnswer.toLowerCase();

    const newAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      question: fbQuestion.question,
      answer: fillBlankAnswer.trim(),
      correctAnswer: fbQuestion.correctAnswer,
      isCorrect,
      explanation: fbQuestion.explanation
    };

    // Update user answers
    setUserAnswers(prev => {
      // Replace if already answered
      const existingIndex = prev.findIndex(a => a.questionIndex === currentQuestionIndex);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      // Add new answer
      return [...prev, newAnswer];
    });

    // Mark as answered for navigation purposes
    setIsAnswered(true);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Don't complete quiz yet, just stay on the last question
      // User will need to click the submit button
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Reset state for next question
      setSelectedOption(null);
      setSelectedTrueFalse(null);
      setFillBlankAnswer('');
      setIsAnswered(false);
    }
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    // Calculate final score
    const finalScore = userAnswers.filter(answer => answer.isCorrect).length;

    // Exit full screen mode
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    // Complete quiz with answers for detailed feedback
    onComplete(finalScore, questions.length, userAnswers);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {/* Exit Warning Modal with Countdown */}
      {showExitWarning && !showCheatingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in">
            <h2 className="text-xl font-bold text-red-500 mb-4">Warning!</h2>
            <p className="mb-2">
              You are in the middle of a quiz. Exiting full screen mode or switching tabs is not allowed.
            </p>
            <div className="mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Return to the quiz within:</p>
              <div className="text-4xl font-bold text-red-500">{warningCountdown}</div>
              <p className="text-sm text-muted-foreground mt-1">seconds</p>
            </div>
            <Button
              onClick={() => {
                setShowExitWarning(false);
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                }
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

      {/* Cheating Warning */}
      {showCheatingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in border-red-500 border-2">
            <h2 className="text-2xl font-bold text-red-500 mb-4">No Cheating!</h2>
            <p className="mb-6">
              You have been detected attempting to exit the quiz or switch tabs.
              This is considered cheating and your quiz session has been terminated.
            </p>
            <Button
              onClick={() => {
                // Exit fullscreen
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
                // Go back to documentation
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              }}
              className="w-full"
              variant="destructive"
            >
              Back to Documentation
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
          </span>
        </div>

        {/* Multiple Choice Question */}
        {currentQuestion.type === 'multiple-choice' && (
          <div className="space-y-3">
            {(currentQuestion as MultipleChoiceQuestion).options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMultipleChoiceSelect(index)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all",
                  "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  index === selectedOption && "bg-primary/10 border-primary/50",
                  index !== selectedOption && "bg-card hover:bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {index === selectedOption ? (
                      <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
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
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all",
                  "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                  value === selectedTrueFalse && "bg-primary/10 border-primary/50",
                  value !== selectedTrueFalse && "bg-card hover:bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {value === selectedTrueFalse ? (
                      <div className="h-5 w-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
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
                placeholder="Type your answer here..."
                className={cn(
                  "w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "bg-card pr-20" // Always add padding for the button
                )}
              />
              <Button
                onClick={handleFillBlankSubmit}
                disabled={!fillBlankAnswer.trim()}
                className="absolute right-1 top-1 h-8"
                size="sm"
              >
                Submit
              </Button>
            </div>

            {/* Show current answer if provided */}
            {userAnswers.find(a => a.questionIndex === currentQuestionIndex) && (
              <div className="p-3 rounded-lg bg-primary/5">
                <p className="font-medium">
                  Your answer: <span className="font-bold">
                    {userAnswers.find(a => a.questionIndex === currentQuestionIndex)?.answer as string}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Navigation and Submit */}
      <div className="flex justify-between mt-6">
        <div>
          {/* Progress indicator */}
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        <div className="flex gap-3">
          {isLastQuestion && userAnswers.length === totalQuestions ? (
            <Button
              onClick={handleSubmitQuiz}
              className="gap-2 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Submit Quiz
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="gap-2"
              size="lg"
            >
              Next Question
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
