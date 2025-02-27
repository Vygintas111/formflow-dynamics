"use client";

import { Card, Badge, Button } from "react-bootstrap";
import { useTranslations } from "next-intl";

type TemplateCardProps = {
  template: {
    id: string;
    title: string;
    description: string;
    topic: string;
    author: {
      name: string;
    };
  };
};

export default function TemplateCard({ template }: TemplateCardProps) {
  const t = useTranslations("home");

  const handleViewClick = () => {
    window.location.href = `/templates/${template.id}`;
  };

  return (
    <Card className="h-100 template-card">
      <Card.Body>
        <Badge bg="info" className="mb-2">
          {template.topic}
        </Badge>
        <Card.Title>{template.title}</Card.Title>
        <Card.Text className="text-muted small">
          {template.description.length > 100
            ? `${template.description.substring(0, 100)}...`
            : template.description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted small d-flex justify-content-between align-items-center">
        <span>
          {t("by")} {template.author.name}
        </span>
        <Button variant="outline-primary" size="sm" onClick={handleViewClick}>
          {t("view")}
        </Button>
      </Card.Footer>
    </Card>
  );
}
