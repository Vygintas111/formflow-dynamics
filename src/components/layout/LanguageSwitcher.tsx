"use client";

import { useLocale } from "next-intl";
import { Dropdown } from "react-bootstrap";
import { usePathname, useRouter } from "../../../navigation";
import { useTranslations } from "next-intl";

type Locale = "en" | "uk" | "de";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.language");

  const switchLanguage = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-light" id="language-switcher">
        {t(locale as Locale)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => switchLanguage("en" as Locale)}>
          {t("en")}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => switchLanguage("uk" as Locale)}>
          {t("uk")}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => switchLanguage("de" as Locale)}>
          {t("de")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
