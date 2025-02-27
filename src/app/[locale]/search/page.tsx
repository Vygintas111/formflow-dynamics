import { unstable_setRequestLocale } from "next-intl/server";
import SearchResults from "@/components/search/SearchResults";

type Props = {
  params: { locale: string };
  searchParams: { q?: string; tag?: string };
};

export default function SearchPage({
  params: { locale },
  searchParams,
}: Props) {
  unstable_setRequestLocale(locale);

  const query = searchParams.q || "";
  const tag = searchParams.tag || "";

  return <SearchResults query={query} tag={tag} />;
}
