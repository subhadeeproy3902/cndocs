import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    console.log("MDX API received file path:", filePath);

    if (!filePath) {
      console.log("MDX API error: Missing file path");
      return NextResponse.json(
        { error: 'Missing file path' },
        { status: 400 }
      );
    }

    // Normalize the path and check for directory traversal
    const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\))+/, '');
    const fullPath = path.join(process.cwd(), 'content/docs', normalizedPath);
    console.log("MDX API full path:", fullPath);
    
    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.log("MDX API error: File not found at path:", fullPath);
      return NextResponse.json(
        { message: `Document not found: ${filePath}. Please check the URL and try again.` },
        { status: 404 }
      );
    }

    // Read the file content
    const fileContent = await fs.promises.readFile(fullPath, 'utf8');

    // Extract frontmatter (content between --- markers)
    const frontmatterMatch = fileContent.match(/---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';

    // Extract title and description from frontmatter
    const titleMatch = frontmatter.match(/title:\s*"([^"]*)"/);
    const descriptionMatch = frontmatter.match(/description:\s*"([^"]*)"/);

    const title = titleMatch ? titleMatch[1] : '';
    const description = descriptionMatch ? descriptionMatch[1] : '';

    // Remove frontmatter from content
    const content = fileContent.replace(/---\n[\s\S]*?\n---/, '').trim();

    return NextResponse.json({
      content,
      title,
      description,
      filePath
    });
  } catch (error) {
    console.error('Error reading MDX file:', error);
    return NextResponse.json(
      { error: 'Failed to read MDX file' },
      { status: 500 }
    );
  }
}
