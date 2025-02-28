// src/components/layout/LanguageSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { Dropdown } from "react-bootstrap";
import { usePathname, useRouter } from "../../../navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

type Locale = "en" | "uk" | "de";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); // Get current route params
  const t = useTranslations("common.language");

  const switchLanguage = (newLocale: Locale) => {
    // We need to determine which route pattern to use
    // based on the actual path we're on

    if (params && params.id) {
      // Template detail pages
      if (pathname.includes("/templates/") && pathname.includes("/edit")) {
        router.push(
          {
            pathname: "/templates/[id]/edit",
            params: { id: params.id as string },
          },
          { locale: newLocale }
        );
      } else if (
        pathname.includes("/templates/") &&
        pathname.includes("/submit")
      ) {
        router.push(
          {
            pathname: "/templates/[id]/submit",
            params: { id: params.id as string },
          },
          { locale: newLocale }
        );
      } else if (pathname.includes("/templates/")) {
        router.push(
          {
            pathname: "/templates/[id]",
            params: { id: params.id as string },
          },
          { locale: newLocale }
        );
      }
      // Form pages
      else if (pathname.includes("/forms/") && pathname.includes("/edit")) {
        router.push(
          {
            pathname: "/forms/[id]/edit",
            params: { id: params.id as string },
          },
          { locale: newLocale }
        );
      } else if (pathname.includes("/forms/")) {
        router.push(
          {
            pathname: "/forms/[id]",
            params: { id: params.id as string },
          },
          { locale: newLocale }
        );
      }
    }
    // Static pages
    else if (pathname === "/") {
      router.push("/", { locale: newLocale });
    } else if (pathname === "/auth/login") {
      router.push("/auth/login", { locale: newLocale });
    } else if (pathname === "/auth/register") {
      router.push("/auth/register", { locale: newLocale });
    } else if (pathname === "/dashboard") {
      router.push("/dashboard", { locale: newLocale });
    } else if (pathname === "/templates/new") {
      router.push("/templates/new", { locale: newLocale });
    } else if (pathname === "/search" || pathname.includes("/search")) {
      router.push("/search", { locale: newLocale });
    } else {
      // Default fallback - return to home
      router.push("/", { locale: newLocale });
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-light" id="language-switcher">
        {t(locale as Locale)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => switchLanguage("en")}>
          {t("en")}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => switchLanguage("uk")}>
          {t("uk")}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => switchLanguage("de")}>
          {t("de")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
