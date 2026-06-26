import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends PropsWithChildren {
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("container py-8 md:py-10", className)}>{children}</div>;
}
