import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Unable to load this section",
  message = "The platform could not retrieve the requested analytics. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {onRetry ? (
        <CardContent>
          <Button variant="outline" onClick={onRetry}>
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
