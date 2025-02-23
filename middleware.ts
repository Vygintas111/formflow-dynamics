import createMiddleware from "next-intl/middleware";
import { i18n } from "./i18n.config";

export default createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|assets|favicon.ico|sw.js|.*\\.).*)"],
};
