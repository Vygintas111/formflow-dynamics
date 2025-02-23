import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { i18n } from "./i18n.config";

const intlMiddleware = createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to default locale
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${i18n.defaultLocale}`, request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|uk|de)/:path*"],
};
