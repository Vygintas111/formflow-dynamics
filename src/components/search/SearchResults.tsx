"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Badge,
} from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import TemplateCard from "../home/TemplateCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type Template = {
  id: string;
  title: string;
  description: string;
  topic: string;
  author: {
    name: string;
  };
};

type SearchResultsProps = {
  query: string;
  tag: string;
};

export default function SearchResults({ query, tag }: SearchResultsProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let url = "/api/templates?";

        if (query) {
          url += `query=${encodeURIComponent(query)}`;
        }

        if (tag) {
          url += `${query ? "&" : ""}tag=${encodeURIComponent(tag)}`;
        }

        // Fetch search results from the API
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        setTemplates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, tag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">{t("title")}</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={t("placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search templates"
              />
              <Button variant="primary" type="submit">
                <FiSearch className="me-1" /> {t("button")}
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {tag && (
        <div className="mb-4">
          <h2 className="h5">
            {t("resultsForTag")} <Badge bg="info">{tag}</Badge>
          </h2>
        </div>
      )}

      {query && (
        <div className="mb-4">
          <h2 className="h5">
            {t("resultsForQuery")} "{query}"
          </h2>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {templates.length === 0 ? (
            <Card className="text-center p-5">
              <h3>{t("noResults")}</h3>
              <p className="text-muted">{t("tryDifferent")}</p>
            </Card>
          ) : (
            <Row>
              {templates.map((template) => (
                <Col key={template.id} md={4} className="mb-4">
                  <TemplateCard template={template} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
