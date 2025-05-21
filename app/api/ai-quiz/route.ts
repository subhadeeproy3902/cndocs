import { generateObject } from 'ai';
import { z } from 'zod';
import { groq } from '@ai-sdk/groq';
import { NextRequest, NextResponse } from 'next/server';

// Define the quiz schema
const quizSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.number(),
      explanation: z.string().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const { filePath, title, content } = await request.json();

    if (!filePath || !content) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate the quiz using AI
    const { object: quiz } = await generateObject({
      model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      schemaName: 'Quiz',
      schema: quizSchema,
      prompt: `Generate a quiz based on the following content about ${title}.
      The content is: ${content}

      Create 5-10 challenging multiple-choice questions that test understanding of key concepts.
      Each question should have 4 options with only one correct answer.
      Include an explanation for each correct answer.
      Make sure the questions cover different aspects of the content and vary in difficulty.
      The quiz should be suitable for students learning about networking concepts.`,
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}