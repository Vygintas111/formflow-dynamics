import AuthContainer from "@/components/auth/AuthContainer";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <AuthContainer isLogin={true} />;
}
