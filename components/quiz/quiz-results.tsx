'use client';

import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, Trophy, Award, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuizAnswer {
  questionIndex: number;
  question: string;
  answer: string | boolean | number | null;
  correctAnswer: string | boolean | number;
  isCorrect: boolean;
  explanation?: string;
  options?: string[]; // For multiple choice questions
}

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  title: string;
  answers?: QuizAnswer[]; // Optional detailed answers for feedback
}

export default function QuizResults({ score, totalQuestions, title, answers = [] }: QuizResultsProps) {
  const router = useRouter();
  const percentage = Math.round((score / totalQuestions) * 100);

  // Determine result message based on score
  const getResultMessage = () => {
    if (percentage >= 90) return "Excellent! You've mastered this topic!";
    if (percentage >= 75) return "Great job! You have a solid understanding!";
    if (percentage >= 60) return "Good work! You're on the right track!";
    if (percentage >= 40) return "Not bad! Keep studying to improve!";
    if (percentage >= 20) return "You need more practice. Review the material and try again!";
    return "You didn't even study, did you? Time to hit the books!";
  };

  // Determine result color based on score
  const getResultColor = () => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-500";
    if (percentage >= 40) return "text-orange-500";
    if (percentage >= 20) return "text-red-500";
    return "text-red-600";
  };

  // Get personalized feedback based on score
  const getPersonalizedFeedback = () => {
    if (percentage >= 90) {
      return "You're really well prepared! Your understanding of the material is exceptional. You could probably teach this topic to others!";
    }
    if (percentage >= 75) {
      return "You've clearly put in the effort to understand this topic. Just a bit more study and you'll have complete mastery!";
    }
    if (percentage >= 60) {
      return "You have a good foundation, but there are still some concepts that need clarification. Focus on the areas where you made mistakes.";
    }
    if (percentage >= 40) {
      return "You're familiar with the basics, but need to deepen your understanding. Consider revisiting the material and taking notes.";
    }
    if (percentage >= 20) {
      return "You're struggling with this topic. Try breaking it down into smaller parts and focus on understanding the fundamentals first.";
    }
    return "It seems like you haven't spent much time studying this topic yet. Start with the basics and work your way up gradually.";
  };

  // Handle exit quiz
  const handleExit = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <Card className="p-6 shadow-lg border-2 border-border/50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-grid-primary/30 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>

        {/* Confetti Effect for High Scores */}
        {percentage >= 75 && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-10 left-0 w-20 h-20 bg-green-500/20 rounded-full blur-xl" />
            <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl" />
          </div>
        )}

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Quiz Results
          </h1>
          <p className="text-muted-foreground">
            You&apos;ve completed the quiz on <span className="font-medium">{title}</span>
          </p>
        </div>

        {/* Score and Feedback - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Side - Quiz Results */}
          <div className="flex flex-col items-center justify-start bg-gradient-to-b from-muted/5 to-muted/20 rounded-lg p-6 h-full shadow-lg border border-muted/20">
            <div className="relative w-56 h-56 mx-auto mb-6">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-6xl font-bold animate-in fade-in-50 zoom-in-50 duration-1000">{percentage}%</div>
                <div className={cn("text-base font-medium mt-2", getResultColor())}>
                  <span className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    {score} of {totalQuestions} correct
                  </span>
                </div>
              </div>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-muted/20 stroke-current"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="44"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={cn("stroke-current transition-all duration-1500 ease-out", getResultColor())}
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 2.77} 277`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="44"
                  cx="50"
                  cy="50"
                />
              </svg>
            </div>

            {/* Achievement Badge */}
            <div className="flex justify-center mb-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-500">
              {percentage >= 90 ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 flex items-center justify-center mb-3 shadow-lg border border-green-200 dark:border-green-800/30">
                    <Award className="h-10 w-10 text-green-500" />
                  </div>
                  <span className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700 dark:from-green-400 dark:to-green-600">Master</span>
                </div>
              ) : percentage >= 75 ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center mb-3 shadow-lg border border-blue-200 dark:border-blue-800/30">
                    <Trophy className="h-10 w-10 text-blue-500" />
                  </div>
                  <span className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600">Expert</span>
                </div>
              ) : percentage >= 60 ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20 flex items-center justify-center mb-3 shadow-lg border border-yellow-200 dark:border-yellow-800/30">
                    <BookOpen className="h-10 w-10 text-yellow-500" />
                  </div>
                  <span className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-yellow-400 dark:to-yellow-600">Scholar</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center mb-3 shadow-lg border border-muted/30">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <span className="text-base font-medium text-muted-foreground">Keep Learning</span>
                </div>
              )}
            </div>

            {/* Result Message */}
            <div className="text-center mt-2 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-700">
              <p className={cn("text-xl font-bold mb-3", getResultColor())}>
                {getResultMessage()}
              </p>
              <p className="text-muted-foreground">
                {getPersonalizedFeedback()}
              </p>
            </div>

            {/* Back Button */}
            <Button
              onClick={handleExit}
              size="lg"
              className="gap-2 mt-8 shadow-md animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-1000"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Documentation
            </Button>
          </div>

          {/* Right Side - Detailed Feedback */}
          <div className="bg-gradient-to-b from-muted/5 to-muted/10 rounded-lg p-6 h-full shadow-lg border border-muted/20 animate-in fade-in-50 duration-700 delay-300">
            <h2 className="text-2xl font-bold mb-6 text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Question Feedback
            </h2>

            {answers.length > 0 ? (
              <div className="max-h-[600px] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-5 rounded-lg border shadow-md transition-all duration-300 hover:shadow-lg",
                      answer.isCorrect
                        ? "bg-gradient-to-br from-green-50 to-green-50/50 border-green-200 dark:from-green-900/10 dark:to-green-900/5 dark:border-green-900/30"
                        : "bg-gradient-to-br from-red-50 to-red-50/50 border-red-200 dark:from-red-900/10 dark:to-red-900/5 dark:border-red-900/30"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-medium text-base">Question {answer.questionIndex + 1}</p>
                      <span className={cn(
                        "px-3 py-1 text-xs rounded-full font-medium shadow-sm",
                        answer.isCorrect
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-400"
                          : "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-400"
                      )}>
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <p className="mb-4 text-base font-medium">{answer.question}</p>
                    <div className="flex flex-col space-y-3 bg-white/50 dark:bg-black/10 p-3 rounded-md border border-muted/30">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <p className="text-sm font-medium min-w-24">Your answer:</p>
                        <span className={cn(
                          "px-3 py-1 rounded-md font-medium text-sm",
                          answer.isCorrect
                            ? "bg-green-100/70 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100/70 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        )}>
                          {typeof answer.answer === 'boolean'
                            ? answer.answer ? 'True' : 'False'
                            : typeof answer.answer === 'number'
                              ? (answer.question.includes('multiple-choice') && Array.isArray(answer.options)
                                  ? answer.options[answer.answer]
                                  : answer.answer.toString())
                              : answer.answer
                                ? answer.answer.toString()
                                : 'No answer provided'}
                        </span>
                      </div>

                      {!answer.isCorrect && (
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <p className="text-sm font-medium min-w-24">Correct answer:</p>
                          <span className="px-3 py-1 rounded-md font-medium text-sm bg-green-100/70 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {typeof answer.correctAnswer === 'boolean'
                              ? answer.correctAnswer ? 'True' : 'False'
                              : typeof answer.correctAnswer === 'number'
                                ? (answer.question.includes('multiple-choice') && Array.isArray(answer.options)
                                    ? answer.options[answer.correctAnswer]
                                    : answer.correctAnswer.toString())
                                : answer.correctAnswer
                                  ? answer.correctAnswer.toString()
                                  : 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>

                    {answer.explanation && (
                      <div className="mt-4 p-3 bg-muted/30 rounded-md border border-muted/30">
                        <p className="text-sm font-medium mb-1">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{answer.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground bg-muted/10 rounded-lg border border-muted/20">
                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No detailed feedback available</p>
                <p className="text-sm text-center max-w-xs">Complete the quiz to see detailed feedback for each question</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
