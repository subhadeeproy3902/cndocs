import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function POST(request: NextRequest) {
  try {
    const { question, type, content, title } = await request.json();

    if (!question || !type || !content) {
      return NextResponse.json(
        { error: 'Question, type, and content are required' },
        { status: 400 }
      );
    }

    // Prepare the instructions based on question type
    const typeInstructions = type === 'short'
      ? `Create a concise, focused answer that:
- Should not start with an heading
- Is brief and to the point
- Should not contain headings STRICTLY
- Directly addresses the question
- Includes relevant examples if appropriate
- Avoids unnecessary elaboration
- Do not include any code snippets unnecessarily unless the question asks for it or answering the question requires it`
      : `Create a comprehensive, in-depth answer that:
- Should not start with an heading
- Is approximately 5-8 paragraphs and highly detailed
- Thoroughly explores the topic
- Provides detailed explanations of concepts
- Includes multiple examples or applications
- Discusses implications or connections to other topics
- Analyzes different perspectives if relevant
- Can contain sub headings (###)
- Do not include any code snippets unnecessarily unless the question asks for it or answering the question requires it
- Uses proper structure with introduction, body, and conclusion`;

    // Generate answer using AI SDK
    const { text: answer } = await generateText({
      model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      prompt: `You are an expert educational content creator specializing in creating examination answers.

TASK:
Generate a comprehensive answer to the provided question based on the content.

CONTENT TITLE: ${title}

QUESTION: ${question}

QUESTION TYPE: ${type} (short or long)

CONTENT:
${content.substring(0, 8000)}  # Limit content to avoid token limits

INSTRUCTIONS:
${typeInstructions}

FORMAT:
- Use proper markdown formatting only for bold, italics, and inline code not for headings, paragraphs, lists, etc.
- Code snippets if relevant should be in C language (properly formatted in markdown)
- Structure the answer with appropriate headings and paragraphs
- Include bullet points or numbered lists where appropriate
- Not too many paragraph splits

IMPORTANT:
- Ensure technical accuracy
- Avoid unnecessary jargon
- Make the answer educational and informative`,
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error generating answer:', error);
    return NextResponse.json(
      { error: 'Failed to generate answer' },
      { status: 500 }
    );
  }
}
