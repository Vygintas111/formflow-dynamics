"use client";

import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useTranslations, useLocale } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.success("Successfully logged in!", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{t("login")}</h2>
      <Form.Group className="form-group">
        <Form.Label>{t("email")}</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Form.Group className="form-group">
        <Form.Label>{t("password")}</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : t("login")}
      </Button>
    </Form>
  );
}
