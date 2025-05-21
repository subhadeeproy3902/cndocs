'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { readMdxFile } from '@/lib/mdx-utils';
import Quiz from '@/components/quiz/quiz';
import QuizResults from '@/components/quiz/quiz-results';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  // Get the slug from params
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug as string];
  const filePath = slug.join('/') + '.mdx';
  
  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        
        // First, get the MDX file content
        const mdxData = await fetch('/api/mdx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        }).then(res => {
          if (!res.ok) throw new Error('Failed to fetch MDX content');
          return res.json();
        });
        
        // Then, generate the quiz using AI
        const quizResponse = await fetch('/api/ai-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filePath,
            title: mdxData.title,
            content: mdxData.content,
          }),
        }).then(res => {
          if (!res.ok) throw new Error('Failed to generate quiz');
          return res.json();
        });
        
        setQuizData(quizResponse.quiz);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [filePath]);
  
  // Handle quiz completion
  const handleQuizComplete = (finalScore: number, questions: number) => {
    setScore(finalScore);
    setTotalQuestions(questions);
    setQuizCompleted(true);
  };
  
  // Handle retry quiz
  const handleRetryQuiz = () => {
    setQuizCompleted(false);
  };
  
  // Handle back to docs
  const handleBackToDocs = () => {
    router.back();
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <h1 className="text-2xl font-bold mb-2">Generating Quiz</h1>
          <p className="text-muted-foreground">
            Our AI is creating challenging questions based on the content...
          </p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Error</h1>
          <p className="mb-6">{error}</p>
          <Button onClick={handleBackToDocs} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Documentation
          </Button>
        </div>
      </div>
    );
  }
  
  // Quiz completed state
  if (quizCompleted && quizData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <QuizResults
          score={score}
          totalQuestions={totalQuestions}
          title={quizData.title}
          onRetry={handleRetryQuiz}
        />
      </div>
    );
  }
  
  // Quiz state
  if (quizData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Quiz
          title={quizData.title}
          description={quizData.description}
          questions={quizData.questions}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }
  
  // Fallback state (should never reach here)
  return null;
}
