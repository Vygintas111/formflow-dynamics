import { unstable_setRequestLocale } from "next-intl/server";
import TemplateView from "@/components/templates/TemplateView";

type Props = {
  params: { locale: string; id: string };
};

export default function TemplatePage({ params: { locale, id } }: Props) {
  unstable_setRequestLocale(locale);

  return <TemplateView id={id} />;
}
