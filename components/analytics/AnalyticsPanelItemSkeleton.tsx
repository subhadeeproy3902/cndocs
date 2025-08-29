import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsPanelItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex justify-between items-center h-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-8" />
        </div>
      ))}
    </div>
  );
};

export default AnalyticsPanelItemSkeleton;
