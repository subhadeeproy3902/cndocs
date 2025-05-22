'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Quiz, { QuizQuestion } from '@/components/quiz/quiz';
import QuizResults from '@/components/quiz/quiz-results';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Function to handle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Get the slug from params
  const slug = Array.isArray(params.slug) ? params.slug : params.slug ? [params.slug as string] : [];
  console.log("Quiz page slug:", slug); // Debug log

  // Ensure the slug doesn't contain .mdx extension
  const cleanSlug = slug.map(part => part.replace(/\.mdx$/, ''));
  
  // Construct the file path for the MDX file in content/docs
  const filePath = cleanSlug.length > 0 ? cleanSlug.join('/') + '.mdx' : '';
  console.log("Quiz page filePath:", filePath); // Debug log
  console.log("Full params:", params); // Debug log

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuizData = async () => {
      console.log("Starting quiz data fetch..."); // Debug log
      try {
        setLoading(true);
        setError(null); // Reset error state

        // Check if we have a valid file path
        if (!filePath) {
          throw new Error('No document selected. Please navigate from a documentation page.');
        }

        // First, get the MDX file content
        console.log("Fetching MDX content for:", filePath); // Debug log
        const mdxResponse = await fetch('/api/mdx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        });

        if (!mdxResponse.ok) {
          const errorData = await mdxResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch document content. Please try again.');
        }

        const mdxData = await mdxResponse.json();
        console.log("MDX data received:", { 
          title: mdxData.title, 
          contentLength: mdxData.content?.length,
          error: mdxData.error,
          message: mdxData.message 
        }); // Debug log

        if (mdxData.error || mdxData.message) {
          throw new Error(mdxData.message || mdxData.error || 'Failed to fetch document content');
        }

        if (!mdxData.content) {
          throw new Error('Document content is empty. Please try a different document.');
        }

        // Then, generate the quiz using AI
        console.log("Generating quiz..."); // Debug log
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
        });

        if (!quizResponse.ok) {
          const errorData = await quizResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to generate quiz. Please try again.');
        }

        const quizData = await quizResponse.json();
        console.log("Quiz data received:", { 
          hasQuiz: !!quizData.quiz,
          questionCount: quizData.quiz?.questions?.length 
        }); // Debug log

        if (!quizData.quiz || !quizData.quiz.questions || quizData.quiz.questions.length === 0) {
          throw new Error('Failed to generate quiz questions. Please try again.');
        }

        setQuizData(quizData.quiz);
        setLoading(false);
      } catch (err) {
        console.error('Error in quiz generation:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
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

  // No retry option as per requirements

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
        />
      </div>
    );
  }

  // Quiz state
  if (quizData) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${isFullScreen ? 'bg-background' : ''}`}>
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              className="gap-2"
            >
              {isFullScreen ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z" />
                  </svg>
                  Enter Fullscreen
                </>
              )}
            </Button>
          </div>
          <Quiz
            title={quizData.title}
            description={quizData.description}
            questions={quizData.questions}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  // Fallback state (should never reach here)
  return null;
}