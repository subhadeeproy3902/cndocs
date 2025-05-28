"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  content: string;
  title?: string;
  className?: string;
}

export default function AudioPlayer({
  content,
  title,
  className,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Clean content for speech
  const cleanContent = (text: string): string => {
    return text
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`]*`/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[#*_~]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const estimateDuration = (text: string, speechRate: number): number => {
    const wordsPerMinute = 150 * speechRate;
    const words = text.split(/\s+/).length;
    return (words / wordsPerMinute) * 60;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!isSupported) {
      setError("Speech synthesis not supported");
      return;
    }

    if (isPlaying && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // If already playing the same thing, do nothing
      if (utterance && speechSynthesis.speaking) return;

      const cleanText = cleanContent(content);
      if (!cleanText.trim()) {
        setError("No content to read");
        return;
      }

      const newUtterance = new SpeechSynthesisUtterance(cleanText);
      newUtterance.rate = rate;
      newUtterance.pitch = 1;
      newUtterance.volume = 1;

      newUtterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setError(null);
        setDuration(estimateDuration(cleanText, rate));
      };

      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
      };

      newUtterance.onerror = (event) => {
        if (event.error !== "interrupted") {
          setError(`Speech error: ${event.error}`);
        } else {
          setError(null);
        }
        setIsPlaying(false);
        setIsPaused(false);
      };

      setUtterance(newUtterance);
      speechSynthesis.cancel(); // cancel previous only once before speaking
      speechSynthesis.speak(newUtterance);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const handleSpeedChange = (newRate: number) => {
    if (!utterance || !isPlaying) {
      setRate(newRate);
      return;
    }

    const cleanText = cleanContent(content);
    const totalChars = cleanText.length;
    const estimatedCharIndex = Math.floor(
      (currentTime / duration) * totalChars
    );
    const remainingText = cleanText.substring(estimatedCharIndex);

    const newUtterance = new SpeechSynthesisUtterance(remainingText);
    newUtterance.rate = newRate;
    newUtterance.pitch = 1;
    newUtterance.volume = 1;

    newUtterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setError(null);
      setRate(newRate);
    };

    newUtterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
    };

    newUtterance.onerror = (event) => {
      if (event.error !== "interrupted") {
        setError(`Speech error: ${event.error}`);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.cancel();
    setUtterance(newUtterance);
    speechSynthesis.speak(newUtterance);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(percentage * duration, duration));
    setCurrentTime(newTime);

    if (!utterance) return;

    // Stop current speech
    speechSynthesis.cancel();

    // Trim content based on percentage
    const cleanText = cleanContent(content);
    const totalChars = cleanText.length;
    const charIndex = Math.floor(percentage * totalChars);
    const remainingText = cleanText.substring(charIndex);

    if (!remainingText.trim()) return;

    const newUtterance = new SpeechSynthesisUtterance(remainingText);
    newUtterance.rate = rate;
    newUtterance.pitch = 1;
    newUtterance.volume = 1;

    newUtterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setError(null);
    };

    newUtterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
    };

    newUtterance.onerror = (event) => {
      if (event.error !== "interrupted") {
        setError(`Speech error: ${event.error}`);
      } else {
        setError(null);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    setUtterance(newUtterance);
    speechSynthesis.speak(newUtterance);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    setCurrentTime(Math.max(0, Math.min(newTime, duration)));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1); // smoother updates
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPaused]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={cn("rounded-lg mb-6 w-full", className)}>
      <h3 className="text-sm font-medium mt-0 mb-4">
        🔊 Listen to this page
      </h3>
      {/* Error Display */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePlayPause}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-white h-8 w-8 p-0 rounded-full flex-shrink-0"
        >
          {isPlaying && !isPaused ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        <Button
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 rounded-full flex-shrink-0"
        >
          <Square className="h-3 w-3" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs font-mono min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-2 bg-background rounded-full overflow-hidden cursor-pointer relative"
            onClick={handleProgressClick}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleProgressDrag(e);
            }}
            onMouseMove={handleProgressDrag}
          >
            <div
              className="h-full bg-primary transition-all duration-100 relative"
              style={{
                width:
                  duration > 0 ? `${(currentTime / duration) * 100}%` : "0%",
              }}
            >
              <div
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transform -translate-x-1/2",
                  "shadow-md transition-transform duration-150",
                  isDragging && "scale-150"
                )}
              />
            </div>
          </div>
          <span className="text-xs text-primary font-mono min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-background/50 hover:bg-background/70">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {speedOptions.map((speed) => (
              <DropdownMenuItem
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={cn(
                  "cursor-pointer",
                  rate === speed && "bg-green-50 dark:bg-green-900/20"
                )}
              >
                {speed}x Speed
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
