import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="pb-8 pt-4">
      <div className="container">
        <Separator className="mb-6" />
        <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Sri Lankan Food Price Analytics Platform</p>
          <p>Built for public market trend exploration, forecasting, and comparison.</p>
        </div>
      </div>
    </footer>
  );
}
