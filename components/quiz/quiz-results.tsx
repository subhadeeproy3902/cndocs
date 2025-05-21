'use client';

import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, Trophy, Award, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  title: string;
  onRetry?: () => void;
}

export default function QuizResults({ score, totalQuestions, title, onRetry }: QuizResultsProps) {
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

  // Get result emoji based on score
  const getResultEmoji = () => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 75) return "🌟";
    if (percentage >= 60) return "👍";
    if (percentage >= 40) return "🤔";
    if (percentage >= 20) return "📚";
    return "😴";
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <Card className="p-8 text-center shadow-lg border-2 border-border/50 overflow-hidden">
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
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-inner">
            <div className="text-4xl">{getResultEmoji()}</div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Quiz Results
          </h1>
          <p className="text-muted-foreground">
            You&apos;ve completed the quiz on <span className="font-medium">{title}</span>
          </p>
        </div>

        {/* Score Display */}
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="text-5xl font-bold">{percentage}%</div>
              <div className={cn("text-sm font-medium mt-1", getResultColor())}>
                {score} of {totalQuestions} correct
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
                className={cn("stroke-current transition-all duration-1000 ease-out", getResultColor())}
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

          <div className="max-w-md mx-auto">
            <p className={cn("text-2xl font-bold mb-4", getResultColor())}>
              {getResultMessage()}
            </p>
            <p className="text-muted-foreground mb-6">
              {getPersonalizedFeedback()}
            </p>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mb-8">
          <div className="flex justify-center gap-6">
            {percentage >= 90 ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-2 shadow-md">
                  <Award className="h-8 w-8 text-green-500" />
                </div>
                <span className="text-sm font-medium">Master</span>
              </div>
            ) : percentage >= 75 ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2 shadow-md">
                  <Trophy className="h-8 w-8 text-blue-500" />
                </div>
                <span className="text-sm font-medium">Expert</span>
              </div>
            ) : percentage >= 60 ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mb-2 shadow-md">
                  <BookOpen className="h-8 w-8 text-yellow-500" />
                </div>
                <span className="text-sm font-medium">Scholar</span>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 shadow-md">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Keep Learning</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleExit}
            size="lg"
            className="gap-2 min-w-40 shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documentation
          </Button>
        </div>
      </Card>
    </div>
  );
}
