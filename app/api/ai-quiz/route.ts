import { generateObject } from 'ai';
import { z } from 'zod';
import { groq } from '@ai-sdk/groq';
import { NextRequest, NextResponse } from 'next/server';

// Define the quiz schema with different question types
const quizSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(
    z.discriminatedUnion('type', [
      // Multiple choice questions
      z.object({
        type: z.literal('multiple-choice'),
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.number(),
        explanation: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
      }),
      // True/False questions
      z.object({
        type: z.literal('true-false'),
        question: z.string(),
        correctAnswer: z.boolean(),
        explanation: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
      }),
      // Fill in the blank questions
      z.object({
        type: z.literal('fill-blank'),
        question: z.string(),
        correctAnswer: z.string(),
        explanation: z.string(),
        difficulty: z.enum(['easy', 'medium', 'hard']),
      }),
    ])
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
      prompt: `Generate a comprehensive quiz based on the following content about ${title}.
      The content is: ${content}

      Create any number of questions (but equal to or more than 5) depending strictly on the content with the following distribution:
      - multiple-choice questions (type: 'multiple-choice')
      - true/false questions (type: 'true-false')
      - fill-in-the-blank questions (type: 'fill-blank')

      Guidelines for each question type:

      1. Multiple-choice questions:
         - Each question should have 4 options with only one correct answer
         - The correctAnswer should be the index (0-3) of the correct option
         - Include a detailed explanation for each correct answer
         - Assign a difficulty level (easy, medium, or hard)

      2. True/False questions:
         - Create statements that are either true or false
         - The correctAnswer should be a boolean (true or false)
         - Include a detailed explanation for why the statement is true or false
         - Assign a difficulty level (easy, medium, or hard)

      3. Fill-in-the-blank questions:
         - Create sentences with a blank to be filled in
         - The correctAnswer should be the exact word or phrase that fills the blank
         - Include a detailed explanation for the correct answer
         - Assign a difficulty level (easy, medium, or hard)

      Make sure the questions:
      - Strictly cover only the given aspects of the content
      - Vary in difficulty (include easy, medium, and hard questions)
      - Test both factual recall and conceptual understanding
      - Are clear, concise, and unambiguous
      - Are suitable for students learning about networking concepts`,
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