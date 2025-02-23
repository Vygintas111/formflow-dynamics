"use client";

import { useLocale } from "next-intl";
import { Dropdown } from "react-bootstrap";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.language");

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-light" id="language-switcher">
        {t(locale as "en" | "uk" | "de")}
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
