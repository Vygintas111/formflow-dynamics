"use client";

import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FiSearch } from "react-icons/fi";

export default function SearchBox() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Form onSubmit={handleSearch} className="d-flex w-100">
      <InputGroup>
        <Form.Control
          type="search"
          placeholder={t("search")}
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <Button variant="outline-light" type="submit" size="sm">
          <FiSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}
