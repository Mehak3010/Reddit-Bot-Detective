import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldDark = stored ? stored === "dark" : prefersDark;
      setIsDark(shouldDark);
      document.documentElement.classList.toggle("dark", shouldDark);
    } catch (_) {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (_) {
      // ignore
    }
  };

  return (
    <Button
      onClick={toggle}
      variant="outline"
      className="h-8 w-8 p-0 flex items-center justify-center"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
};

export default ThemeToggle;