import { createLocalizedPathnamesNavigation } from "next-intl/navigation";

const pathnames = {
  // Define all your routes
  "/": "/",
  "/auth/login": {
    en: "/auth/login",
    uk: "/auth/login",
    de: "/auth/login",
  },
  "/auth/register": {
    en: "/auth/register",
    uk: "/auth/register",
    de: "/auth/register",
  },
  "/dashboard": {
    en: "/dashboard",
    uk: "/dashboard",
    de: "/dashboard",
  },
  "/templates/new": {
    en: "/templates/new",
    uk: "/templates/new",
    de: "/templates/new",
  },
  "/templates/[id]": {
    en: "/templates/[id]",
    uk: "/templates/[id]",
    de: "/templates/[id]",
  },
  "/templates/[id]/edit": {
    en: "/templates/[id]/edit",
    uk: "/templates/[id]/edit",
    de: "/templates/[id]/edit",
  },
  "/templates/[id]/submit": {
    en: "/templates/[id]/submit",
    uk: "/templates/[id]/submit",
    de: "/templates/[id]/submit",
  },
  "/forms/[id]": {
    en: "/forms/[id]",
    uk: "/forms/[id]",
    de: "/forms/[id]",
  },
  "/forms/[id]/edit": {
    en: "/forms/[id]/edit",
    uk: "/forms/[id]/edit",
    de: "/forms/[id]/edit",
  },
  "/search": {
    en: "/search",
    uk: "/search",
    de: "/search",
  },
} as const;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    pathnames,
    locales: ["en", "uk", "de"],
  });
