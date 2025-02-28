"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common.theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Dont render anything until component has mounted
  if (!mounted) {
    return (
      <Button
        variant="outline-light"
        style={{
          width: "38px",
          height: "38px",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Theme"
        disabled
      >
        <span className="visually-hidden">Loading theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline-light"
      style={{
        width: "38px",
        height: "38px",
        padding: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={toggleTheme}
      aria-label={t(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
    </Button>
  );
}
