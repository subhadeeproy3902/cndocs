"use client";

import { useRef, useEffect, useMemo } from "react";
import AnimationContainer from "../ui/animation-container";

interface MetricsGridProps {
  activeMetric: number;
  onMetricSelect: (index: number) => void;
  timeRange: string;
  metrics: { label: string; key: string }[];
  metricsData: { visitors: number; pageviews: number; bounceRate: number };
}

const MetricsGrid = ({
  activeMetric,
  onMetricSelect,
  timeRange,
  metrics,
  metricsData,
}: MetricsGridProps) => {
  const borderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the passed metricsData instead of generating it
  const metricsValues = metricsData;

  useEffect(() => {
    const container = containerRef.current;
    const borderElement = borderRef.current;

    if (!container || !borderElement) return;

    const moveBorder = (target: HTMLElement) => {
      if (!target) return;
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      borderElement.style.width = `${targetRect.width}px`;
      borderElement.style.transform = `translateX(${
        targetRect.left - containerRect.left
      }px)`;
    };

    const updatePosition = () => {
      const activeItem = container.querySelector(
        `[data-index="${activeMetric}"]`
      ) as HTMLElement;
      if (activeItem) moveBorder(activeItem);
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeMetric]);

  return (
    <div
      ref={containerRef}
      className="relative w-full grid grid-cols-3 border-b border-white/15"
    >
      {metrics.map((metric, index) => {
        const value =
          metric.key === "visitors"
            ? metricsValues.visitors
            : metric.key === "pageViews"
            ? metricsValues.pageviews
            : `${metricsValues.bounceRate}%`;
        return (
          <div
            key={index}
            data-index={index}
            className="flex flex-col gap-0 items-center py-4 cursor-pointer select-none"
            onClick={() => onMetricSelect(index)}
          >
            <label className="text-sm text-white/75">{metric.label}</label>
            <AnimationContainer
              key={value}
              animationType="fade"
              className="w-fit"
            >
              <h2 className="text-2xl font-semibold text-white leading-[1.2]">
                {value}
              </h2>
            </AnimationContainer>
          </div>
        );
      })}
      <div
        ref={borderRef}
        className="absolute bottom-0 left-0 h-0.5 bg-white pointer-events-none transition-all duration-400 ease-out"
      />
    </div>
  );
};

export default MetricsGrid;
