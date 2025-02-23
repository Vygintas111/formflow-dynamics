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
} as const;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    pathnames,
    locales: ["en", "uk", "de"],
  });
