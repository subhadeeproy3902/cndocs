import fs from 'fs';
import path from 'path';

/**
 * Reads the content of an MDX file
 * @param filePath - The path to the MDX file relative to the content/docs directory
 * @returns An object containing the file content, title, and description
 */
export async function readMdxFile(filePath: string) {
  try {
    // Ensure the path is relative to the content/docs directory
    const fullPath = path.join(process.cwd(), 'content/docs', filePath);
    
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
    
    return {
      content,
      title,
      description,
      filePath
    };
  } catch (error) {
    console.error(`Error reading MDX file: ${filePath}`, error);
    throw new Error(`Failed to read MDX file: ${filePath}`);
  }
}
