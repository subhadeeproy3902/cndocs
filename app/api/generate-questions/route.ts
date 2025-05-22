import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { groq } from '@ai-sdk/groq';

// Define the question schema
const questionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['short', 'long']),
      question: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
    })
  )
});

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Generate questions using AI SDK
    const { object } = await generateObject({
      model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      schemaName: 'ExamQuestions',
      schema: questionSchema,
      prompt: `You are an expert academic teacher specializing in creating examination questions.

TASK:
Generate a diverse set of questions based on the provided content about "${title}". Create a mix of short-answer and long-answer questions that test different levels of understanding also making sure that the questions have a huge probability of being asked in an exam.

CONTENT:
${content.substring(0, 8000)}  # Limit content to avoid token limits

INSTRUCTIONS:
1. Generate any number of questions based on the content length following the distribution:
   - short-answer questions (factual, definition-based, or concept explanation)
   - long-answer questions (analysis, evaluation, or application of concepts)
2. For each question, include:
   - A unique ID (can be a simple string like "q1", "q2", etc.)
   - Question text
   - Question type ("short" or "long")
   - Difficulty level ("easy", "medium", or "hard")

IMPORTANT:
- Focus on the most important concepts in the content
- Ensure questions are clear and unambiguous
- Do not include the answers in this response
- Vary the difficulty levels
- Make sure questions test different cognitive levels (recall, understanding, application, analysis)
- Ensure the questions are directly answerable from the provided content`,
    });

    return NextResponse.json({ questions: object.questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
