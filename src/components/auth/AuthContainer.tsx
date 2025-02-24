"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthContainerProps {
  isLogin?: boolean;
}

export default function AuthContainer({
  isLogin: initialIsLogin = true,
}: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const t = useTranslations("auth");

  useEffect(() => {
    setIsLogin(initialIsLogin);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [initialIsLogin]);

  return (
    <div className="auth-page">
      <div className={`auth-container ${!isLogin ? "active" : ""}`}>
        <div className="form-container sign-in">
          <LoginForm />
        </div>
        <div className="form-container sign-up">
          <RegisterForm />
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>{t("welcome")}</h1>
              <p>{t("loginDesc")}</p>
              <button className="hidden" onClick={() => setIsLogin(true)}>
                {t("login")}
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>{t("hello")}</h1>
              <p>{t("registerDesc")}</p>
              <button className="hidden" onClick={() => setIsLogin(false)}>
                {t("register")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
