"use client";

import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push(`/${locale}/auth/login`);
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="h-100 d-flex flex-column justify-content-center">
      <h2 className="text-center mb-4">{t("register")}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t("name")}</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t("email")}</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>{t("password")}</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="light" type="submit" className="w-100">
          {t("register")}
        </Button>
      </Form>
    </div>
  );
}
