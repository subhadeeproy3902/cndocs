"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  BookOpen,
  PenSquare,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocActionsProps {
  title: string;
  path?: string; // Made optional since we're not using it currently
}

export default function DocActions({ title }: DocActionsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Create a more descriptive share text
  const shareText = `Check out this awesome documentation on "${title}" from CNDocs - The Ultimate Networking Documentation`;

  // WhatsApp share URL with better formatting
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText}\n\n${currentUrl}`
  )}`;

  // Twitter share URL with better formatting
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${shareText}`
  )}&url=${encodeURIComponent(
    currentUrl
  )}&hashtags=networking,documentation,cndocs`;

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy link. Please try again.");
    }
  };

  const getPath = () => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const docPathMatch = currentPath.match(/^\/docs\/(.+)$/);

      if (docPathMatch && docPathMatch[1]) {
        // Remove .mdx extension if present
        const slug = docPathMatch[1].replace(/\.mdx$/, "");

        // Store the current path in sessionStorage to ensure consistency
        try {
          sessionStorage.setItem("lastQuizPath", slug);
        } catch (e) {
          console.error("Failed to store path in sessionStorage:", e);
        }

        return `/quiz/${slug}`;
      } else {
        console.error("Invalid document path:", currentPath);
        return "";
      }
    }
    return "";
  };

  return (
    <>
      <div className="mt-8 pt-4 border-t border-border">
        {/* Quiz Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex gap-3">
            <div className="flex-shrink-0 p-2 w-fit h-fit rounded-full bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mt-0 mb-2">Test Your Knowledge</h3>
              <p className="text-sm text-muted-foreground mb-1">
                Take a quiz to reinforce what you&apos;ve learned
              </p>
            </div>
          </div>
          <Button
            className="cursor-pointer text-white"
            onClick={() => {
              const path = getPath();
              if (path) {
                // Force a hard navigation to ensure fresh state
                window.location.href = path;
              }
            }}
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Take a Test
          </Button>
        </div>

        {/* Quiz Button */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <div className="flex gap-3">
            <div className="flex-shrink-0 p-2 w-fit h-fit rounded-full bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium mt-0 mb-2">Exam Preparation</h3>
              <p className="text-sm text-muted-foreground mb-1">
                Access short and long answer questions for written exams
              </p>
            </div>
          </div>
          <Button
            className="cursor-pointer text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              const path = getPath();
              if (path) {
                // Get the path without the /quiz prefix
                const qnaPath = path.replace("/quiz", "/qna");
                // Force a hard navigation to ensure fresh state
                window.location.href = qnaPath;
              }
            }}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Exam Q&A
          </Button>
        </div>
      </div>

      {/* Share Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="text-sm text-muted-foreground font-medium">
          Share this page
        </div>
        <div className="flex flex-wrap gap-2">
          {/* WhatsApp Share */}
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center no-underline justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "bg-green-500 text-white hover:bg-green-600"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
            </svg>
            WhatsApp
          </a>

          {/* Twitter/X Share */}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center no-underline justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "bg-black text-white hover:bg-gray-800"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5549 21H20.7996L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
            </svg>
            Twitter/X
          </a>

          {/* Copy Link */}
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>
    </>
  );
}
