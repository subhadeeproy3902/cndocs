'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    return "Keep practicing! Review the material and try again!";
  };
  
  // Determine result color based on score
  const getResultColor = () => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-500";
    if (percentage >= 40) return "text-orange-500";
    return "text-red-500";
  };
  
  // Handle exit quiz
  const handleExit = () => {
    router.back();
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <Card className="p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
          <p className="text-muted-foreground">
            You've completed the quiz on {title}
          </p>
        </div>
        
        {/* Score Display */}
        <div className="mb-8">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold">{percentage}%</div>
            </div>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={cn("stroke-current", getResultColor())}
                strokeWidth="10"
                strokeDasharray={`${percentage * 2.51} 251.2`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          
          <p className="text-xl font-medium mb-2">
            You scored {score} out of {totalQuestions}
          </p>
          <p className={cn("text-lg font-medium", getResultColor())}>
            {getResultMessage()}
          </p>
        </div>
        
        {/* Achievement Badges */}
        {percentage >= 60 && (
          <div className="mb-8">
            <div className="flex justify-center gap-4">
              {percentage >= 90 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-2">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">Master</span>
                </div>
              )}
              {percentage >= 75 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Expert</span>
                </div>
              )}
              {percentage >= 60 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-yellow-500" />
                  </div>
                  <span className="text-sm font-medium">Scholar</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retry Quiz
            </Button>
          )}
          <Button onClick={handleExit}>
            Exit Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
}
