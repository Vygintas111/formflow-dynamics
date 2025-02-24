"use client";

import { useTheme } from "next-themes";
import { Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { BsSun, BsMoon } from "react-icons/bs";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("common.theme");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const iconProps = {
    size: 20,
    className: "theme-icon",
  };

  return (
    <Button
      variant="outline-light"
      className="theme-switcher-btn ms-2"
      onClick={toggleTheme}
      aria-label={t(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <BsSun {...iconProps} /> : <BsMoon {...iconProps} />}
    </Button>
  );
}
