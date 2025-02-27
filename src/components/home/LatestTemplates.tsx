"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useTranslations } from "next-intl";
import TemplateCard from "./TemplateCard";
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

export default function LatestTemplates() {
  const t = useTranslations("home");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch latest public templates from the API
        const response = await fetch("/api/templates?limit=3");

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();
        setTemplates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <Card.Header>
        <h2 className="h5 mb-0">{t("latestTemplates")}</h2>
      </Card.Header>
      <Card.Body>
        <Row>
          {templates.length === 0 ? (
            <Col>
              <p className="text-center text-muted">{t("noTemplatesYet")}</p>
            </Col>
          ) : (
            templates.map((template) => (
              <Col key={template.id} md={4} className="mb-4">
                <TemplateCard template={template} />
              </Col>
            ))
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}
