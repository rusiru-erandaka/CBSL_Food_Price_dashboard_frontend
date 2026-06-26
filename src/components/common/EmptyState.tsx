import { Database } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No data available",
  message = "Try a different food, market, or price type to populate this view.",
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Database className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
    </Card>
  );
}
