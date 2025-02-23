import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("app");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>{t("name")}</h1>
      <p>{t("description")}</p>
    </main>
  );
}
