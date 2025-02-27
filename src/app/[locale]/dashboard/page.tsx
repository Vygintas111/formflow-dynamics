import { unstable_setRequestLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";

type Props = {
  params: { locale: string };
};

export default async function DashboardPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  // Verify user is authenticated
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  return <DashboardContent />;
}
