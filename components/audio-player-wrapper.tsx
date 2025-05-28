"use client";

import React, { useState, useEffect } from 'react';
import AudioPlayer from './audio-player';
import { Skeleton } from '@/components/ui/skeleton';

interface AudioPlayerWrapperProps {
  filePath: string;
  title?: string;
}

function processContentForSpeech(content: string): string {
  // Only --- in a line
  content = content.replace(/^\s*---\s*$/gm, '');
  // Remove frontmatter metadata (first --- block)
  content = content.replace(/^---[\s\S]*?---/, '');
  content = content.replace(/!\[.*?\]\(.*?\)/g, '');        // Markdown image
  content = content.replace(/<img[^>]*>/gi, '');            // HTML img tag

  // Convert markdown links to just the text
  content = content.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Headings: replace with speech-friendly text
  content = content.replace(/^#+\s*(.*)/gm, (_, heading) => {
    return `Let us understand ${heading.trim()}.`;
  });

  // Remove remaining markdown symbols
  content = content.replace(/[#*_~]/g, '');
  content = content.replace(/^\s*[-*+]\s+/gm, '');
  content = content.replace(/^\s*\d+\.\s+/gm, '');
  content = content.replace(/^\s*>/gm, '');

  // Table syntax
  content = content.replace(/\|.*\|/g, '');
  content = content.replace(/[-:]+\|[-:|\s]+/g, '');

  // Normalize whitespace
  content = content.replace(/\n{3,}/g, '\n\n');
  content = content.replace(/\s+/g, ' ');
  content = content.replace(/\n\s*\n/g, '. ');
  content = content.replace(/([a-zA-Z0-9])\s*\n/g, '$1. ');
  content = content.replace(/\.{2,}/g, '.');
  content = content.replace(/\.\s*\./g, '.');

  // Remove `` and ``` for inline and block codes
  content = content.replace(/`{1,3}/g, '');
  content = content.replace(/<code>.*?<\/code>/g, '');
  content = content.replace(/<pre>.*?<\/pre>/g, '');
  content = content.replace(/<[^>]+>/g, ''); // Remove any remaining HTML tags
  content = content.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
  content = content.replace(/\s{2,}/g, ' '); // Remove extra spaces
  content = content.replace(/^\s+|\s+$/g, ''); // Trim leading/trailing spaces

  return content.trim();
}

export default function AudioPlayerWrapper({ filePath, title }: AudioPlayerWrapperProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/mdx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Process the content for speech synthesis
        const processedContent = processContentForSpeech(data.content || '');
        setContent(processedContent);
      } catch (err) {
        console.error('Error fetching speech content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    if (filePath) {
      fetchContent();
    }
  }, [filePath]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <span className="text-sm font-medium">
            Failed to load audio content: {error}
          </span>
        </div>
      </div>
    );
  }

  if (!content.trim()) {
    return null; // Don't render anything if there's no content
  }

  return (
    <AudioPlayer
      content={content}
      title={title}
    />
  );
}
