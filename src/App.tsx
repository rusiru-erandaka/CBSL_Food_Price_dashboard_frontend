import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_60%)]" />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
