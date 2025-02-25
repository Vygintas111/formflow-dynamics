"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isReversing, setIsReversing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const signInRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("auth");

  // Initialize state and handle overflow
  useEffect(() => {
    setIsLogin(initialIsLogin);
    document.body.style.overflow = "hidden";

    // Check if we're in mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 550);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("resize", checkMobile);
    };
  }, [initialIsLogin]);

  const handleLoginClick = () => {
    if (!isLogin) {
      if (!isMobile) {
        setIsReversing(true);
        // Remove the reversing class after animation completes
        setTimeout(() => {
          setIsReversing(false);
        }, 600);
      }
      setIsLogin(true);
    }
  };

  const handleRegisterClick = () => {
    if (isLogin) {
      setIsLogin(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Desktop & Mobile Container */}
      <div className={`auth-container ${!isLogin ? "active" : ""}`}>
        {/* Sign In Form */}
        <div
          ref={signInRef}
          className={`form-container sign-in ${
            isReversing ? "reversing" : ""
          } ${isMobile && isLogin ? "mobile-active" : ""}`}
        >
          <LoginForm />
        </div>

        {/* Sign Up Form */}
        <div
          className={`form-container sign-up ${
            isMobile && !isLogin ? "mobile-active" : ""
          }`}
        >
          <RegisterForm />
        </div>

        {/* Desktop Toggle Container (hidden on mobile) */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>{t("welcome")}</h1>
              <p>{t("loginDesc")}</p>
              <button className="hidden" onClick={handleLoginClick}>
                {t("login")}
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>{t("hello")}</h1>
              <p>{t("registerDesc")}</p>
              <button className="hidden" onClick={handleRegisterClick}>
                {t("register")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Panel (shown only on mobile) - MOVED OUTSIDE CONTAINER */}
      {isMobile && (
        <div className="mobile-toggle">
          {isLogin ? (
            <>
              <h3>{t("hello")}</h3>
              <p>{t("registerDesc")}</p>
              <button onClick={handleRegisterClick}>{t("register")}</button>
            </>
          ) : (
            <>
              <h3>{t("welcome")}</h3>
              <p>{t("loginDesc")}</p>
              <button onClick={handleLoginClick}>{t("login")}</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
