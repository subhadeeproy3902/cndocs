# GeeksforGeeks Content Scraper

This script automates the process of scraping content from GeeksforGeeks articles and converting it into MDX files for your documentation site.

## Features

- Scrapes content from GeeksforGeeks articles
- Downloads images to the public folder
- Generates well-formatted MDX files in the "scraped" folder
- Preserves tables, code blocks, and other formatting
- Adds proper Tailwind CSS classes for images
- Maintains proper line breaks and spacing for better readability

## Usage

To use the script, run the following command:

```bash
bun run add-doc <url>
```

Where `<url>` is the URL of the GeeksforGeeks article you want to scrape.

For example:

```bash
bun run add-doc https://www.geeksforgeeks.org/what-is-ipv6/
```

This will:

1. Scrape the content from the article
2. Download any images to the `public/images` folder
3. Generate an MDX file in the `content/docs/scraped` folder

## Output

The generated MDX files will have:

- A title and description in the frontmatter
- Well-formatted content with proper headings and spacing
- Images with Tailwind CSS classes for centering
- Tables converted to clean Markdown format
- Lists properly formatted as Markdown lists
- Code blocks preserved with proper syntax highlighting
- Proper line breaks between sections for better readability

## How It Works

The script performs the following steps:

1. **Fetches the HTML content** from the provided GeeksforGeeks URL
2. **Extracts the main content** from the article, including:
   - Title and description
   - Introduction paragraphs
   - Section headings and content
   - Images, tables, and code blocks
3. **Downloads images** to the public/images folder
4. **Converts HTML to MDX format**, ensuring proper formatting
5. **Generates an MDX file** in the content/docs/scraped folder

## Dependencies

The script uses the following dependencies:

- axios: For fetching the HTML content
- cheerio: For parsing and manipulating the HTML
- fs-extra: For file system operations
- path: For handling file paths
- slugify: For generating file names from titles

## Customization

You can customize the script by modifying the following variables in the `add-doc-new.js` file:

- `SCRAPED_DIR`: The directory where the MDX files will be saved
- `IMAGES_DIR`: The directory where the images will be saved

You can also modify the HTML-to-MDX conversion logic in the `convertHtmlToMdx` function to customize the output format.

## Troubleshooting

If you encounter any issues with the script, try the following:

- Make sure the URL is valid and accessible
- Check if the article has a standard GeeksforGeeks layout
- Ensure you have write permissions to the output directories
- Check the console output for any error messages

## License

This script is provided as-is with no warranty. Use at your own risk.
