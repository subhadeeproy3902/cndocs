import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    console.log("MDX API received file path:", filePath);

    if (!filePath) {
      console.log("MDX API error: Missing file path");
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    try {
      // Normalize the path and remove .mdx extension if present
      const normalizedPath = path
        .normalize(filePath)
        .replace(/^(\.\.(\/|\\))+/, "")
        .replace(/\.mdx$/, "");

      // Create an array of possible file paths to try
      const possiblePaths = [
        path.join("content/docs", normalizedPath + ".mdx"),
        path.join("content/docs", normalizedPath, "index.mdx"),
        path.join("public/content/docs", normalizedPath + ".mdx"),
        path.join("public/content/docs", normalizedPath, "index.mdx")
      ];

      console.log("Trying possible paths:", possiblePaths);

      // Try to read the file from any of the possible locations
      let fileContent: string | undefined;
      let foundPath: string | undefined;

      for (const tryPath of possiblePaths) {
        try {
          fileContent = await fs.readFile(path.join(process.cwd(), tryPath), "utf8");
          foundPath = tryPath;
          console.log("Successfully read file from:", tryPath);
          break;
        } catch (err) {
          console.log("File not found at:", tryPath);
          continue;
        }
      }

      if (!fileContent) {
        console.error("File not found in any location");
        return NextResponse.json(
          {
            message: `Document not found: ${filePath}. Please check the URL and try again.
            Tried paths: ${possiblePaths.join(", ")}`,
          },
          { status: 404 }
        );
      }

      // Extract frontmatter (content between --- markers)
      const frontmatterMatch = fileContent.match(/---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";

      console.log("Extracted frontmatter:", frontmatter);

      // Extract title and description from frontmatter with improved regex
      // This handles both quoted and unquoted values
      const titleMatch = frontmatter.match(/title:\s*(?:"([^"]*)"|'([^']*)'|([^\n]*))/);
      const descriptionMatch = frontmatter.match(/description:\s*(?:"([^"]*)"|'([^']*)'|([^\n]*))/);

      console.log("Title match:", titleMatch);
      console.log("Description match:", descriptionMatch);

      // Extract the first non-empty capture group
      let title = "";
      if (titleMatch) {
        title = titleMatch[1] || titleMatch[2] || titleMatch[3] || "";
        title = title.trim();
      }

      let description = "";
      if (descriptionMatch) {
        description = descriptionMatch[1] || descriptionMatch[2] || descriptionMatch[3] || "";
        description = description.trim();
      }

      console.log("Extracted title:", title);
      console.log("Extracted description:", description);

      // Remove frontmatter from content
      const content = fileContent.replace(/---\n[\s\S]*?\n---/, "").trim();

      return NextResponse.json({
        content,
        title,
        description,
        filePath: foundPath // Return the actual path that was found
      });

    } catch (error) {
      console.error("Error reading MDX file:", error);
      return NextResponse.json(
        {
          error: "Failed to read MDX file",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in MDX API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
