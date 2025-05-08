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

  // Find the main article content
  const articleText = $('.text');

  // Extract the introduction paragraphs (before the first h2)
  let introContent = '';
  let currentElement = articleText.find('p').first();
  while (currentElement.length && currentElement.prop('tagName') !== 'H2') {
    introContent += `<p>${currentElement.html()}</p>\n`;
    currentElement = currentElement.next();
  }

  // Create a structured content object
  const structuredContent = {
    intro: introContent,
    sections: []
  };

  // Extract sections (h2 and content until next h2)
  articleText.find('h2').each((i, h2) => {
    const sectionTitle = $(h2).text().trim();
    let sectionContent = '';

    // Get all elements until the next h2
    let currentEl = $(h2).next();
    while (currentEl.length && currentEl.prop('tagName') !== 'H2') {
      // Clone the element to avoid modifying the original
      const clonedEl = currentEl.clone();

      // Skip unwanted elements
      if (
        currentEl.parents('.article_bottom_text').length ||
        currentEl.parents('.article_bottom_text_container').length ||
        currentEl.parents('.article_bottom_container').length ||
        currentEl.parents('.article-meta-data').length ||
        currentEl.parents('.article-buttons-container').length ||
        currentEl.parents('.three_dot_dropdown').length ||
        currentEl.parents('.article-meta-author-details').length ||
        currentEl.parents('.bottom-wrap').length ||
        currentEl.parents('.article-pgnavi').length ||
        currentEl.parents('.more-info').length ||
        currentEl.parents('.article_bottom_suggestion_wrapper').length
      ) {
        currentEl = currentEl.next();
        continue;
      }

      // Add the element to the section content
      sectionContent += $.html(clonedEl) + '\n';
      currentEl = currentEl.next();
    }

    // Add the section to the structured content
    structuredContent.sections.push({
      title: sectionTitle,
      content: sectionContent
    });
  });

  // Create a new cheerio instance for the final content
  const mainContent = cheerio.load('<div id="main-content"></div>');

  // Add the introduction
  mainContent('#main-content').append(structuredContent.intro);

  // Add each section
  structuredContent.sections.forEach(section => {
    mainContent('#main-content').append(`<h2>${section.title}</h2>\n${section.content}`);
  });

  // Process images
  const imagePromises = [];
  mainContent('img').each((i, img) => {
    const src = mainContent(img).attr('src');
    if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
      const promise = downloadImage(src).then(localPath => {
        mainContent(img).attr('src', localPath);
        mainContent(img).attr('className', 'max-w-xl mx-auto');
      });
      imagePromises.push(promise);
    }
  });

  // Wait for all images to be processed
  await Promise.all(imagePromises);

  // Get the cleaned HTML content
  let content = mainContent('#main-content').html();

  // Convert HTML to MDX format
  const mdxContent = convertHtmlToMdx(content);

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
  // First, let's clean up the HTML structure
  let cleanedHtml = html
    .replace(/<div[^>]*class="article_bottom_text"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article_bottom_text_container"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article_bottom_container"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article-meta-data"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article-buttons-container"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="three_dot_dropdown"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article-meta-author-details"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="bottom-wrap"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article-pgnavi"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="more-info"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article_bottom_suggestion_wrapper"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*id="GFG_AD_gfg_direct_728x90"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*id="AP_G4GR_6"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*id="GFG_AD_InContent_Desktop_728x280"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="d-row"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="article-title"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="last_updated_parent"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="main_wrapper"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="video-tab-content"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="hidead"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*id="video-tab-content"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  const $ = cheerio.load(cleanedHtml);

  // Replace img tags with MDX image components
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt') || 'Image';
    $(el).replaceWith(`<img className="max-w-xl mx-auto" src="${src}" alt="${alt}" />`);
  });

  // Replace tables with MDX tables
  $('table').each((i, el) => {
    const table = $(el);
    table.attr('className', 'w-full');
  });

  // Replace code blocks
  $('pre').each((i, el) => {
    const code = $(el).text();
    const language = $(el).find('code').attr('class') || '';
    const lang = language.replace('language-', '').replace('lang-', '') || 'text';
    $(el).replaceWith(`\`\`\`${lang}\n${code}\n\`\`\``);
  });

  // Fix GeeksforGeeks specific elements
  $('.wp-caption').each((i, el) => {
    const img = $(el).find('img');
    const caption = $(el).find('.wp-caption-text').text();
    const src = img.attr('src');
    const alt = caption || img.attr('alt') || 'Image';

    $(el).replaceWith(`<figure>\n<img className="max-w-xl mx-auto" src="${src}" alt="${alt}" />\n<figcaption className="text-center text-sm mt-2">${caption}</figcaption>\n</figure>`);
  });

  // Clean up list items with value attributes (common in GeeksforGeeks)
  $('li[value]').each((i, el) => {
    const value = $(el).attr('value');
    const content = $(el).html();
    $(el).replaceWith(`<li>${content}</li>`);
  });

  // Get the HTML content
  let mdx = $.html();

  // Clean up the MDX content
  mdx = mdx
    .replace(/<html><head><\/head><body>(.*)<\/body><\/html>/s, '$1') // Remove html, head, body tags
    .replace(/<hr>/g, '---') // Replace hr tags with markdown horizontal rules
    .replace(/<br>/g, '\n') // Replace br tags with newlines
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**') // Replace strong tags with markdown bold
    .replace(/<b>(.*?)<\/b>/g, '**$1**') // Replace b tags with markdown bold
    .replace(/<em>(.*?)<\/em>/g, '*$1*') // Replace em tags with markdown italic
    .replace(/<i>(.*?)<\/i>/g, '*$1*') // Replace i tags with markdown italic
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n') // Replace h1 tags with markdown h1
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, '\n\n## $1\n\n') // Replace h2 tags with markdown h2
    .replace(/<h3[^>]*>(.*?)<\/h3>/g, '\n\n### $1\n\n') // Replace h3 tags with markdown h3
    .replace(/<h4[^>]*>(.*?)<\/h4>/g, '\n\n#### $1\n\n') // Replace h4 tags with markdown h4
    .replace(/<h5[^>]*>(.*?)<\/h5>/g, '\n\n##### $1\n\n') // Replace h5 tags with markdown h5
    .replace(/<h6[^>]*>(.*?)<\/h6>/g, '\n\n###### $1\n\n') // Replace h6 tags with markdown h6
    .replace(/<blockquote>(.*?)<\/blockquote>/gs, '> $1\n\n') // Replace blockquote tags with markdown blockquote
    .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, p1) => {
      return '\n' + p1.replace(/<li[^>]*>(.*?)<\/li>/gs, '- $1\n');
    }) // Replace ul and li tags with markdown unordered list
    .replace(/<ol[^>]*>(.*?)<\/ol>/gs, (match, p1) => {
      let index = 1;
      return '\n' + p1.replace(/<li[^>]*>(.*?)<\/li>/gs, (match, p1) => {
        return `${index++}. ${p1}\n`;
      });
    }) // Replace ol and li tags with markdown ordered list
    .replace(/<p[^>]*>(.*?)<\/p>/gs, '$1\n\n') // Replace p tags with newlines
    .replace(/<span[^>]*>(.*?)<\/span>/gs, '$1') // Remove span tags
    .replace(/<div[^>]*>(.*?)<\/div>/gs, '$1\n\n') // Replace div tags with newlines
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gs, '[$2]($1)') // Replace a tags with markdown links
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/\*\*\s*\*\*/g, '') // Remove empty bold tags
    .replace(/\*\s*\*/g, '') // Remove empty italic tags
    .replace(/\[\s*\]\(\)/g, '') // Remove empty links
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/\n /g, '\n') // Remove spaces at the beginning of lines
    .replace(/## ([^\n]+)([^\n])/g, '## $1\n\n$2') // Ensure newlines after headings
    .replace(/### ([^\n]+)([^\n])/g, '### $1\n\n$2') // Ensure newlines after headings
    .replace(/#### ([^\n]+)([^\n])/g, '#### $1\n\n$2') // Ensure newlines after headings
    .replace(/##### ([^\n]+)([^\n])/g, '##### $1\n\n$2') // Ensure newlines after headings
    .replace(/###### ([^\n]+)([^\n])/g, '###### $1\n\n$2') // Ensure newlines after headings
    .replace(/\n\n\n+/g, '\n\n') // Replace multiple newlines with double newlines
    .trim();

  // Fix table formatting
  mdx = mdx.replace(/<table className="w-full">([\s\S]*?)<\/table>/g, (match, tableContent) => {
    // Create a new cheerio instance for the table
    const tableCheerio = cheerio.load(`<table>${tableContent}</table>`);
    const table = tableCheerio('table');

    // Extract headers and rows
    const headers = [];
    const rows = [];

    // Get headers
    table.find('thead tr th').each((i, el) => {
      headers.push(tableCheerio(el).text().trim());
    });

    // If no headers in thead, check first row of tbody
    if (headers.length === 0) {
      table.find('tbody tr:first-child td').each((i, el) => {
        headers.push(tableCheerio(el).text().trim());
      });
    }

    // Get rows
    table.find('tbody tr').each((i, tr) => {
      const row = [];
      tableCheerio(tr).find('td').each((j, td) => {
        row.push(tableCheerio(td).text().trim());
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

    return '\n\n' + markdownTable + '\n';
  });

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
