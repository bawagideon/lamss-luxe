"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  // Prevent hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative rounded-full w-10 h-10 overflow-hidden text-primary hover:bg-primary/10 transition-colors"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all scale-100 dark:scale-0 dark:rotate-90 absolute" />
      <Moon className="h-[1.2rem] w-[1.2rem] transition-all scale-0 -rotate-90 dark:scale-100 dark:rotate-0 absolute" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
