import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link, NavLink } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Dashboard", href: "/" },
  {
    label: "GitHub",
    href: "https://github.com/rusiru-erandaka/CBSL_Food_Price_dashboard_frontend",
    external: true,
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <span className="font-mono text-sm font-semibold">LK</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                Sri Lankan Food Price Analytics
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Public market intelligence dashboard
              </p>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigationItems.map((item) =>
            item.external ? (
              <Button key={item.label} variant="ghost" asChild>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </Button>
            ) : (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  cn(buttonVariants({ variant: "ghost" }), isActive && "text-primary")
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
          <ThemeToggle className="rounded-full" />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="rounded-full" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-background md:hidden">
          <div className="container flex flex-col gap-2 py-4">
            {navigationItems.map((item) =>
              item.external ? (
                <Button key={item.label} variant="ghost" asChild className="justify-start">
                  <a href={item.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </Button>
              ) : (
                <Button key={item.label} variant="ghost" asChild className="justify-start">
                  <Link to={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </Button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
