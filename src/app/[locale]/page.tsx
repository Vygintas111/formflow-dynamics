import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("app");

  return (
    <div className="container">
      <h1 className="text-center mb-4">{t("name")}</h1>
      <p className="text-center">{t("description")}</p>
    </div>
  );
}
