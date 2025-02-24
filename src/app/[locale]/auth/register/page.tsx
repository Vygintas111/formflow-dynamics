import AuthContainer from "@/components/auth/AuthContainer";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return <AuthContainer isLogin={false} />;
}
