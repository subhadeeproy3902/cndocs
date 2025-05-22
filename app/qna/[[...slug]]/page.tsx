'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileDown, Lightbulb, BookOpen, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Metadata } from 'next';
import { createMetadata, metadataImage } from '@/lib/metadata';

// Define question types
interface Question {
  id: string;
  type: 'short' | 'long';
  question: string;
  answer: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedTime?: string; // in minutes
}

// Define the QnA data structure
interface QnAData {
  title: string;
  description: string;
  questions: Question[];
  lastUpdated?: string;
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug?: string[] } }): Promise<Metadata> {
  // Get the slug from params
  const slug = Array.isArray(params.slug) ? params.slug : params.slug ? [params.slug] : [];

  // Create a title based on the slug
  const pageTitle = slug.length > 0
    ? `${slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Exam Q&A`
    : 'Exam Questions & Answers';

  const description = 'Practice with exam-style questions and detailed answers generated from our documentation content.';

  return createMetadata({
    title: pageTitle,
    description,
    openGraph: {
      url: `/qna/${slug.join('/')}`,
    },
  });
}

export default function QnAPage() {
  const params = useParams();
  const router = useRouter();
  const [qnaData, setQnaData] = useState<QnAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Get the slug from params
  const slug = Array.isArray(params.slug) ? params.slug : params.slug ? [params.slug as string] : [];

  // Ensure the slug doesn't contain .mdx extension
  const cleanSlug = slug.map(part => part.replace(/\.mdx$/, ''));

  // Construct the file path for the MDX file in content/docs
  const filePath = cleanSlug.length > 0 ? cleanSlug.join('/') + '.mdx' : '';

  // Fetch the content and generate Q&A
  useEffect(() => {
    const fetchContent = async () => {
      if (!filePath) {
        setError('No document specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Step 1: Fetch the document content
        const response = await fetch('/api/mdx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.content;

        // Make sure we have a valid title and description
        let title = data.title;
        let description = data.description;

        // Log the received data for debugging
        console.log("MDX data received:", {
          title,
          description,
          contentLength: content?.length
        });

        // Set defaults only if values are empty or undefined
        if (!title || title.trim() === '') {
          title = 'Untitled Document';
        }

        if (!description || description.trim() === '') {
          description = 'No description available';
        }

        // Step 2: Generate questions using AI
        const questionsResponse = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, title }),
        });

        if (!questionsResponse.ok) {
          throw new Error(`Failed to generate questions: ${questionsResponse.statusText}`);
        }

        const questionsData = await questionsResponse.json();
        const questions = questionsData.questions;

        // Step 3: Generate answers for each question
        const questionsWithAnswers = await Promise.all(
          questions.map(async (question: any) => {
            const answerResponse = await fetch('/api/generate-answer', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                question: question.question,
                type: question.type,
                content,
                title
              }),
            });

            if (!answerResponse.ok) {
              throw new Error(`Failed to generate answer: ${answerResponse.statusText}`);
            }

            const answerData = await answerResponse.json();
            return {
              ...question,
              answer: answerData.answer,
            };
          })
        );

        // Set the QnA data
        setQnaData({
          title,
          description,
          questions: questionsWithAnswers,
          lastUpdated: new Date().toISOString(),
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching content or generating Q&A:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchContent();
  }, [filePath]);

  // Handle PDF download
  const handleDownloadPdf = async () => {
    if (!qnaData) return;

    try {
      setDownloadingPdf(true);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add header with title
      pdf.setFillColor(240, 240, 240); // Light gray background
      pdf.rect(0, 0, 210, 25, 'F');

      pdf.setDrawColor(150, 150, 150); // Gray border
      pdf.setLineWidth(0.5);
      pdf.line(0, 25, 210, 25);

      // Add title - Use the actual document title instead of "Untitled Document"
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(50, 50, 50); // Dark gray text
      pdf.setFontSize(16);

      // Ensure we have a valid title
      const documentTitle = qnaData.title && qnaData.title !== 'Untitled Document'
        ? qnaData.title
        : 'Documentation';

      // Log the title being used
      console.log("Using PDF title:", documentTitle);

      pdf.text(documentTitle, 10, 10);

      // Add subtitle
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100); // Gray text
      pdf.setFontSize(10);
      pdf.text('Exam Questions & Answers', 10, 16);

      // Add date
      const date = new Date().toLocaleDateString();
      pdf.setFontSize(8);
      pdf.text(`Generated on: ${date}`, 150, 16);

      // Add description
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.setFontSize(10);
      pdf.text('Description:', 10, 30);

      // Ensure we have a valid description
      const documentDescription = qnaData.description && qnaData.description !== 'No description available'
        ? qnaData.description
        : 'Documentation for ' + documentTitle;

      // Log the description being used
      console.log("Using PDF description:", documentDescription);

      const splitDescription = pdf.splitTextToSize(documentDescription, 190);
      pdf.setFontSize(9);
      pdf.text(splitDescription, 10, 35);

      // Add content
      let yOffset = 35 + (splitDescription.length * 5);

      // Process each question individually for better formatting
      for (let i = 0; i < qnaData.questions.length; i++) {
        const question = qnaData.questions[i];

        // Check if we need a new page
        if (yOffset > 250) {
          pdf.addPage();
          yOffset = 20;
        }

        // Add question number and type
        const questionTypeColor = question.type === 'short' ? 220 : 230;
        pdf.setFillColor(questionTypeColor, questionTypeColor, questionTypeColor);
        pdf.rect(10, yOffset, 190, 10, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(50, 50, 50);
        pdf.setFontSize(11);
        pdf.text(`Q${i + 1}: ${question.type === 'short' ? 'Short Answer' : 'Long Answer'}`, 15, yOffset + 7);

        // Add difficulty and time if available
        let infoText = '';
        if (question.difficulty) {
          infoText += `Difficulty: ${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}`;
        }
        if (question.estimatedTime) {
          infoText += infoText ? ` | Time: ${question.estimatedTime} min` : `Time: ${question.estimatedTime} min`;
        }

        if (infoText) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          pdf.text(infoText, 120, yOffset + 7);
        }

        yOffset += 15;

        // Add question text
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);

        const splitQuestion = pdf.splitTextToSize(question.question, 180);
        pdf.text(splitQuestion, 15, yOffset);

        yOffset += (splitQuestion.length * 5) + 5;

        // Add answer heading
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(9);
        pdf.text('Answer:', 15, yOffset);

        yOffset += 5;

        // Add answer text (simplified for PDF)
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);

        // Process the answer text for PDF (preserve bullets and code blocks)
        let cleanAnswer = question.answer
          .replace(/#{1,6}\s(.+)/g, '$1') // Keep heading text but remove markers
          .replace(/\*\*(.+?)\*\*/g, '$1') // Keep bold text but remove markers
          .replace(/\*(.+?)\*/g, '$1') // Keep italic text but remove markers
          .replace(/!\[.*?\]\(.*?\)/g, '[Image]') // Replace images
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)'); // Replace links with text (text URL)

        // Process code blocks - replace with formatted text
        cleanAnswer = cleanAnswer.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, language, code) => {
          // Remove excessive blank lines in code
          const trimmedCode = code.trim()
            .replace(/\n\s*\n\s*\n/g, '\n\n')  // Replace triple blank lines with double
            .replace(/\n\s*\n/g, '\n');        // Replace double blank lines with single
          return `\n--- CODE (${language || 'text'}) ---\n${trimmedCode}\n--- END CODE ---\n`;
        });

        // Process inline code - keep the text
        cleanAnswer = cleanAnswer.replace(/`([^`]+)`/g, '$1');

        // Process bullet points - preserve them with proper indentation
        cleanAnswer = cleanAnswer.replace(/^(\s*)-\s+(.+)$/gm, '• $2');
        cleanAnswer = cleanAnswer.replace(/^(\s*)\*\s+(.+)$/gm, '• $2');

        // For numbered lists, keep the original numbers
        let listCounter = 1;
        cleanAnswer = cleanAnswer.replace(/^(\s*)\d+\.\s+(.+)$/gm, (_match, _space, text) => {
          return `${listCounter++}. ${text}`;
        });

        // Remove excessive blank lines in the entire answer
        cleanAnswer = cleanAnswer.replace(/\n\s*\n\s*\n/g, '\n\n');

        // Initialize code block tracking
        let inCodeBlock = false;

        // Split the answer into lines and process each line
        const answerLines = cleanAnswer.split('\n').filter(line => {
          // Keep all lines in code blocks, filter out empty lines elsewhere
          if (line.trim().startsWith('--- CODE')) inCodeBlock = true;
          if (line.trim() === '--- END CODE ---') {
            const keepLine = inCodeBlock; // Keep this line
            inCodeBlock = false;
            return keepLine;
          }
          return line.trim() !== '' || inCodeBlock;
        });

        let currentY = yOffset;
        inCodeBlock = false; // Reset for processing

        // Check if we need a new page
        if (answerLines.length * 4 + currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }

        // Process each line with special handling for code blocks
        for (let i = 0; i < answerLines.length; i++) {
          const line = answerLines[i];

          // Check if we're entering a code block
          if (line.trim().startsWith('--- CODE')) {
            inCodeBlock = true;

            // Add code block header with special formatting
            pdf.setFillColor(240, 240, 240);
            pdf.rect(15, currentY - 2, 180, 10, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(80, 80, 80);
            pdf.text(line, 20, currentY + 3);
            currentY += 10;
            continue;
          }

          // Check if we're exiting a code block
          if (line.trim() === '--- END CODE ---') {
            inCodeBlock = false;
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            currentY += 5;
            continue;
          }

          // Check if we need a new page
          if (currentY > 270) {
            pdf.addPage();
            currentY = 20;
          }

          // Format code block content differently
          if (inCodeBlock) {
            pdf.setFont('courier', 'normal');
            pdf.setFillColor(245, 245, 245);

            // Apply text wrapping to code blocks with fixed margins
            const wrappedCode = pdf.splitTextToSize(line, 170); // Narrower width for code

            // Create background for all lines of wrapped code
            const codeBlockHeight = wrappedCode.length * 5;
            pdf.rect(15, currentY - 2, 180, codeBlockHeight + 4, 'F');

            // Add each line of wrapped code
            for (let j = 0; j < wrappedCode.length; j++) {
              pdf.text(wrappedCode[j], 20, currentY + 2 + (j * 5));
            }

            currentY += codeBlockHeight + 4;
          } else {
            // Regular text
            pdf.setFont('helvetica', 'normal');

            // Check if this is a bullet point and format accordingly
            if (line.trim().startsWith('•')) {
              const wrappedText = pdf.splitTextToSize(line, 170);
              pdf.text(wrappedText, 20, currentY + 2);
              currentY += wrappedText.length * 4; // Reduced spacing
            } else if (/^\d+\./.test(line.trim())) {
              // Numbered list
              const wrappedText = pdf.splitTextToSize(line, 170);
              pdf.text(wrappedText, 20, currentY + 2);
              currentY += wrappedText.length * 4; // Reduced spacing
            } else {
              // Regular paragraph with reduced spacing
              const wrappedText = pdf.splitTextToSize(line, 180);
              pdf.text(wrappedText, 15, currentY + 2);
              currentY += wrappedText.length * 4; // Reduced from 5 to 4 to minimize blank space
            }
          }

          // Only add minimal gap between non-empty lines
          if (!inCodeBlock && line.trim() !== '') {
            currentY += 0.5; // Reduced gap to minimize blank space
          }
        }

        // Reset font after processing
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);

        // Update yOffset for next question
        yOffset = currentY + 10;

        // Add separator
        if (i < qnaData.questions.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.2);
          pdf.line(15, yOffset - 5, 195, yOffset - 5);
          yOffset += 5;
        }
      }

      // Add footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${pageCount} | ${documentTitle} - Exam Questions & Answers`, 10, 285);
      }

      // Save PDF with proper title
      const safeFileName = documentTitle.replace(/\s+/g, '_');
      pdf.save(`${safeFileName}_Exam_QnA.pdf`);

      setDownloadingPdf(false);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setDownloadingPdf(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container max-w-6xl w-full mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" className="mr-4" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="bg-muted/20 border rounded-lg p-4 mb-8 animate-pulse">
          <Skeleton className="h-4 w-full max-w-2xl mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>

        <div className="flex items-center gap-2 mb-8 bg-muted/30 p-2 rounded-lg">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>

        <div className="space-y-8">
          {/* Short answer question skeleton */}
          <Card className="p-6 border-l-4 border-l-primary shadow-md">
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <Skeleton className="h-6 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="h-0.5 w-full bg-muted my-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>

          {/* Long answer question skeleton */}
          <Card className="p-6 border-l-4 border-l-secondary shadow-md">
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-secondary font-bold text-sm">2</span>
                </div>
                <Skeleton className="h-6 w-72" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <div className="h-0.5 w-full bg-muted my-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>

          {/* Short answer question skeleton */}
          <Card className="p-6 border-l-4 border-l-primary shadow-md">
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <Skeleton className="h-6 w-56" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <div className="h-0.5 w-full bg-muted my-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
            <p>Generating questions and answers...</p>
            <p className="text-xs">This may take a moment as we analyze the content</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button variant="outline" size="sm" className="mr-4" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Unable to Generate Q&A</h1>
        </div>

        <Card className="p-8 border shadow-md">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Error Generating Exam Questions</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="bg-muted/20 p-4 rounded-md mb-4 border">
                <h3 className="font-medium mb-2">Possible reasons:</h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>The document content may be too short to generate meaningful questions</li>
                  <li>The AI service may be temporarily unavailable</li>
                  <li>The document format may not be compatible</li>
                  <li>There might be an issue with the network connection</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Documentation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                  </svg>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Render content
  return (
    <div className="container mx-auto max-w-6xl w-full py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-4" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {qnaData?.title} - Exam Q&A
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          {downloadingPdf ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>

      <div className="bg-muted/20 border rounded-lg p-4 mb-8">
        <p className="text-muted-foreground">{qnaData?.description}</p>
        <p className="text-sm text-muted-foreground mt-2">
          This page contains exam-style questions generated from the documentation content.
        </p>
      </div>

      <div id="qna-content" className="space-y-8">
        {qnaData?.questions.map((question, index) => (
          <Card key={question.id} className={cn(
            "p-6 transition-all duration-300 shadow-sm hover:shadow",
            question.type === 'short'
              ? "border-l-4 border-l-primary"
              : "border-l-4 border-l-secondary"
          )}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center justify-center aspect-square w-fit h-8 rounded-full font-bold text-sm",
                  question.type === 'short'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {index + 1}
                </span>
                <span>{question.question}</span>
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={question.type === 'short' ? 'default' : 'secondary'}
                  className="gap-1"
                >
                  {question.type === 'short' ? (
                    <FileText className="h-3 w-3" />
                  ) : (
                    <Lightbulb className="h-3 w-3" />
                  )}
                  {question.type === 'short' ? 'Short Answer' : 'Long Answer'}
                </Badge>

                {question.difficulty && (
                  <Badge
                    variant="outline"
                    className={
                      question.difficulty === 'easy'
                        ? "bg-green-500/20 text-green-500"
                        : question.difficulty === 'medium'
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                    }
                  >
                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="prose dark:prose-invert max-w-none xxx">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}: {node?: any, inline?: boolean, className?: string, children?: React.ReactNode} & React.HTMLAttributes<HTMLElement>) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md border"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className={cn(className, "bg-muted px-1 py-0.5 rounded")}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />,
                  h2: ({node, ...props}) => <h2 {...props} className="text-xl font-bold mt-5 mb-3" />,
                  h3: ({node, ...props}) => <h3 {...props} className="text-lg font-bold mt-4 mb-2" />,
                  p: ({node, ...props}) => <p {...props} className="my-3" />,
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-6 my-3" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-6 my-3" />,
                  li: ({node, ...props}) => <li {...props} className="my-1" />,
                  blockquote: ({node, ...props}) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground"
                    />
                  ),
                }}
              >
                {question.answer}
              </ReactMarkdown>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Generate static params for all possible QnA pages
export async function generateStaticParams() {
  return metadataImage.generateParams();
}