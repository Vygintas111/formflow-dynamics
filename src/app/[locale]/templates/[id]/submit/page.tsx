import { unstable_setRequestLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import FormSubmission from "@/components/forms/FormSubmission";

type Props = {
  params: { locale: string; id: string };
};

export default async function SubmitFormPage({
  params: { locale, id },
}: Props) {
  unstable_setRequestLocale(locale);

  // Verify user is authenticated
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(
      `/${locale}/auth/login?callbackUrl=/${locale}/templates/${id}/submit`
    );
  }

  return <FormSubmission templateId={id} />;
}
