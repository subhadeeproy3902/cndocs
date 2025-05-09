#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const slugify = require('slugify');
const { execSync } = require('child_process');
const https = require('https');

// Configuration
const SCRAPED_DIR = path.join(process.cwd(), 'content', 'docs', 'scraped');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

// Ensure directories exist
fs.ensureDirSync(SCRAPED_DIR);
fs.ensureDirSync(IMAGES_DIR);

/**
 * Fetches HTML content from a URL
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} - The HTML content
 */
async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    process.exit(1);
  }
}

/**
 * Downloads an image to the public/images directory
 * @param {string} imageUrl - The URL of the image
 * @returns {Promise<string>} - The local path to the downloaded image
 */
async function downloadImage(imageUrl) {
  try {
    // Extract the filename from the URL
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname;
    const extension = path.extname(pathname);

    // Create a unique filename based on the URL
    const filename = slugify(path.basename(pathname, extension), {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    }) + extension;

    const localPath = path.join(IMAGES_DIR, filename);

    // Check if the image already exists
    if (fs.existsSync(localPath)) {
      console.log(`Image already exists: ${filename}`);
      return `/images/${filename}`;
    }

    // Download the image
    console.log(`Downloading image: ${imageUrl}`);

    // Use curl to download the image
    try {
      execSync(`curl -o ${localPath} ${imageUrl}`, { stdio: 'inherit' });
      console.log(`Image downloaded: ${filename}`);
      return `/images/${filename}`;
    } catch (error) {
      console.error(`Error downloading image with curl: ${error.message}`);

      // Fallback to Node.js https download
      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(localPath);
        https.get(imageUrl, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Image downloaded: ${filename}`);
            resolve(`/images/${filename}`);
          });
        }).on('error', (err) => {
          fs.unlink(localPath, () => {}); // Delete the file if there's an error
          reject(err);
        });
      });
    }
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error.message);
    return imageUrl; // Return the original URL if download fails
  }
}

/**
 * Extracts the main content from a GeeksforGeeks article
 * @param {string} html - The HTML content
 * @param {string} url - The URL of the article
 * @returns {Promise<Object>} - The extracted content
 */
async function extractContent(html, url) {
  const $ = cheerio.load(html);

  // Extract title
  const title = $('h1').first().text().trim();

  // Extract description
  let description = '';
  const firstParagraph = $('article p').first().text().trim();
  if (firstParagraph) {
    description = firstParagraph.substring(0, 160) + (firstParagraph.length > 160 ? '...' : '');
  }

  // Clean up the HTML by removing unwanted sections
  $('.article_bottom_text, .article_bottom_text_container, .article_bottom_container, .article-meta-data, .article-buttons-container, .three_dot_dropdown, .article-meta-author-details, .bottom-wrap, .article-pgnavi, .more-info, .article_bottom_suggestion_wrapper, script, style, iframe, .code-block-header, .gfg-pagination, .media-container, #GFG_AD_gfg_direct_728x90, #AP_G4GR_6, #GFG_AD_InContent_Desktop_728x280, .d-row, .article-title, .last_updated_parent, .main_wrapper, .video-tab-content, .hidead, #video-tab-content').remove();

  // Create a new document for the cleaned content
  const cleanDoc = cheerio.load('<div id="clean-content"></div>');

  // Find the main article content
  const articleText = $('.text');

  // Extract the introduction paragraphs (before the first h2)
  const introContent = [];
  let currentElement = articleText.children().first();

  // Process elements until we hit the first h2
  while (currentElement.length && currentElement.prop('tagName') !== 'H2') {
    // Skip unwanted elements
    if (
      currentElement.hasClass('article_bottom_text') ||
      currentElement.hasClass('article_bottom_text_container') ||
      currentElement.hasClass('article_bottom_container') ||
      currentElement.hasClass('article-meta-data') ||
      currentElement.hasClass('article-buttons-container') ||
      currentElement.hasClass('three_dot_dropdown') ||
      currentElement.hasClass('article-meta-author-details') ||
      currentElement.hasClass('bottom-wrap') ||
      currentElement.hasClass('article-pgnavi') ||
      currentElement.hasClass('more-info') ||
      currentElement.hasClass('article_bottom_suggestion_wrapper')
    ) {
      currentElement = currentElement.next();
      continue;
    }

    // Add the element to our clean content
    cleanDoc('#clean-content').append(currentElement.clone());
    cleanDoc('#clean-content').append('\n\n');

    // Move to the next element
    currentElement = currentElement.next();
  }

  // Now process all h2 sections
  while (currentElement.length) {
    // If this is an h2, add it and collect all content until the next h2
    if (currentElement.prop('tagName') === 'H2') {
      // Add the h2
      cleanDoc('#clean-content').append(currentElement.clone());
      cleanDoc('#clean-content').append('\n\n');

      // Move to the next element
      currentElement = currentElement.next();

      // Collect all elements until the next h2
      while (currentElement.length && currentElement.prop('tagName') !== 'H2') {
        // Skip unwanted elements
        if (
          currentElement.hasClass('article_bottom_text') ||
          currentElement.hasClass('article_bottom_text_container') ||
          currentElement.hasClass('article_bottom_container') ||
          currentElement.hasClass('article-meta-data') ||
          currentElement.hasClass('article-buttons-container') ||
          currentElement.hasClass('three_dot_dropdown') ||
          currentElement.hasClass('article-meta-author-details') ||
          currentElement.hasClass('bottom-wrap') ||
          currentElement.hasClass('article-pgnavi') ||
          currentElement.hasClass('more-info') ||
          currentElement.hasClass('article_bottom_suggestion_wrapper')
        ) {
          currentElement = currentElement.next();
          continue;
        }

        // Add the element to our clean content
        cleanDoc('#clean-content').append(currentElement.clone());
        cleanDoc('#clean-content').append('\n\n');

        // Move to the next element
        currentElement = currentElement.next();
      }
    } else {
      // Skip any non-h2 elements at this point (should not happen)
      currentElement = currentElement.next();
    }
  }

  // Process images in the content
  const imagePromises = [];

  cleanDoc('img').each((i, img) => {
    const src = cleanDoc(img).attr('src');
    if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
      const promise = downloadImage(src).then(localPath => {
        cleanDoc(img).attr('src', localPath);
        cleanDoc(img).attr('className', 'max-w-xl rounded-xl mx-auto');
      });
      imagePromises.push(promise);
    }
  });

  // Wait for all images to be processed
  await Promise.all(imagePromises);

  // Get the cleaned HTML content
  let cleanedHtml = cleanDoc('#clean-content').html();

  // Convert HTML to MDX format
  const mdxContent = convertHtmlToMdx(cleanedHtml);

  return {
    title,
    description,
    content: mdxContent
  };
}

/**
 * Converts HTML content to MDX format
 * @param {string} html - The HTML content
 * @returns {string} - The MDX content
 */
function convertHtmlToMdx(html) {
  // First, clean up any HTML attributes that might cause issues
  html = html
    .replace(/dir="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/value="[^"]*"/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/className="[^"]*"/g, '')
    .replace(/<p[^>]*>/g, '<p>')
    .replace(/<div[^>]*>/g, '<div>')
    .replace(/<span[^>]*>/g, '<span>')
    .replace(/<li[^>]*>/g, '<li>');

  const $ = cheerio.load(html, { decodeEntities: false });

  // Fix tables
  $('table').each((i, table) => {
    const $table = $(table);
    const headers = [];
    const rows = [];

    // Get headers
    $table.find('thead tr th').each((j, th) => {
      headers.push($(th).text().trim());
    });

    // If no headers in thead, check first row of tbody
    if (headers.length === 0) {
      $table.find('tbody tr:first-child td').each((j, td) => {
        headers.push($(td).text().trim());
      });
    }

    // Get rows
    $table.find('tbody tr').each((j, tr) => {
      const row = [];
      $(tr).find('td').each((k, td) => {
        // Extract text content only, removing HTML tags
        row.push($(td).text().trim());
      });
      if (row.length > 0) {
        rows.push(row);
      }
    });

    // Build markdown table
    let markdownTable = '';

    // Add header row
    if (headers.length > 0) {
      markdownTable += '| ' + headers.join(' | ') + ' |\n';
      markdownTable += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    }

    // Add data rows
    rows.forEach(row => {
      markdownTable += '| ' + row.join(' | ') + ' |\n';
    });

    // Replace the table with markdown
    $table.replaceWith(`\n\n${markdownTable}\n\n`);
  });

  // Fix images
  $('img').each((i, el) => {
    const $img = $(el);
    const src = $img.attr('src');
    const alt = $img.attr('alt') || 'Image';
    $img.replaceWith(`\n\n<img className="max-w-xl rounded-xl mx-auto" src="${src}" alt="${alt}" />\n\n`);
  });

  // Fix figure captions
  $('.wp-caption').each((i, el) => {
    const $figure = $(el);
    const $img = $figure.find('img');
    const $caption = $figure.find('.wp-caption-text');

    const src = $img.attr('src');
    const alt = $caption.text() || $img.attr('alt') || 'Image';
    const caption = $caption.text();

    $figure.replaceWith(`
<figure>
  <img className="max-w-xl rounded-xl mx-auto" src="${src}" alt="${alt}" />
  <figcaption className="text-center text-sm mt-2">${caption}</figcaption>
</figure>
`);
  });

  // Fix code blocks
  $('pre').each((i, el) => {
    const $pre = $(el);
    const code = $pre.text();
    const $code = $pre.find('code');
    const language = $code.attr('class') || '';
    const lang = language.replace('language-', '').replace('lang-', '') || 'text';

    $pre.replaceWith(`
\`\`\`${lang}
${code}
\`\`\`
`);
  });

  // Fix lists
  $('ul, ol').each((i, list) => {
    const $list = $(list);
    const isOrdered = $list.get(0).tagName.toLowerCase() === 'ol';
    const items = [];

    $list.find('li').each((j, item) => {
      items.push($(item).text().trim());
    });

    let markdownList = '\n\n';
    items.forEach((item, index) => {
      markdownList += isOrdered ? `${index + 1}. ${item}\n` : `- ${item}\n`;
    });
    markdownList += '\n';

    $list.replaceWith(markdownList);
  });

  // Fix individual list items that aren't in a list
  $('li').each((i, item) => {
    const $item = $(item);
    $item.replaceWith(`- ${$item.text().trim()}\n`);
  });

  // Get the HTML content
  let mdx = $.html();

  // Clean up the MDX content with more aggressive replacements
  mdx = mdx
    .replace(/<html><head><\/head><body>([\s\S]*?)<\/body><\/html>/i, '$1')
    .replace(/<hr\s*\/?>/gi, '\n\n---\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n\n')
    .replace(/<sup[^>]*>([\s\S]*?)<\/sup>/gi, '^$1^')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\*\*\s*\*\*/g, '')
    .replace(/\*\s*\*/g, '')
    .replace(/\[\s*\]\(\)/g, '')
    .trim();

  return mdx;
}

/**
 * Generates an MDX file from the extracted content
 * @param {Object} content - The extracted content
 * @param {string} url - The URL of the article
 * @returns {Promise<string>} - The path to the generated MDX file
 */
async function generateMdxFile(content, url) {
  // Generate a slug from the title
  const slug = slugify(content.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });

  // Create the MDX content
  const mdxContent = `---
title: "${content.title}"
description: "${content.description}"
---

# ${content.title}

${content.content}
`;

  // Write the MDX file
  const filePath = path.join(SCRAPED_DIR, `${slug}.mdx`);
  await fs.writeFile(filePath, mdxContent);

  return filePath;
}

/**
 * Main function
 */
async function main() {
  // Get the URL from the command line arguments
  const url = process.argv[2];

  if (!url) {
    console.error('Please provide a URL to scrape');
    process.exit(1);
  }

  console.log(`Scraping ${url}...`);

  // Fetch the HTML content
  const html = await fetchHtml(url);

  // Extract the content
  const content = await extractContent(html, url);

  // Generate the MDX file
  const filePath = await generateMdxFile(content, url);

  console.log(`MDX file generated: ${filePath}`);
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
