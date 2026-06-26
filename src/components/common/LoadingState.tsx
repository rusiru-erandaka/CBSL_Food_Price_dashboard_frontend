import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  title?: string;
  description?: string;
  lines?: number;
}

export function LoadingState({
  className,
  title = "Loading data",
  description = "Fetching the latest analytics from the API.",
  lines = 4,
}: LoadingStateProps) {
  return (
    <div
      className={cn("rounded-[1.5rem] border border-border/80 bg-card p-6 shadow-panel", className)}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-12 w-full", index === lines - 1 && "w-4/5")}
          />
        ))}
      </div>
      <span className="sr-only">
        {title}. {description}
      </span>
    </div>
  );
}
