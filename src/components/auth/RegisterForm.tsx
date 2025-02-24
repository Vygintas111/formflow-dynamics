"use client";

import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [name, setName] = useState("");
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success("Registration successful! Please log in.", {
        position: "top-right",
        autoClose: 3000,
      });
      router.push(`/${locale}/auth/login`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{t("register")}</h2>
      <Form.Group className="form-group">
        <Form.Label>{t("name")}</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>
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
      <Button variant="light" type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : t("register")}
      </Button>
    </Form>
  );
}
