import AuthContainer from "@/components/auth/AuthContainer";

// Force dynamic rendering for auth pages
export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return <AuthContainer isLogin={false} />;
}
