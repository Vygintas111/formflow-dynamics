"use client";

import { useState, useEffect } from "react";
import { Card, Table, Badge } from "react-bootstrap";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "../../../navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type Template = {
  id: string;
  title: string;
  topic: string;
  responses: number;
  author: {
    name: string;
  };
};

// Define the API response template type
type ApiTemplate = {
  id: string;
  title: string;
  topic: string;
  author?: {
    name: string;
  };
  _count?: {
    forms: number;
  };
};

export default function PopularTemplates() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch popular templates sorted by most responses
        // We need to add a query parameter to sort by forms count
        const response = await fetch("/api/templates?limit=5&sortBy=forms");

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();

        // Convert to the format we need for the UI
        const formattedTemplates = data.map((template: ApiTemplate) => ({
          id: template.id,
          title: template.title,
          topic: template.topic,
          responses: template._count?.forms || 0,
          author: {
            name: template.author?.name || "Anonymous",
          },
        }));

        setTemplates(formattedTemplates);
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

  const handleRowClick = (templateId: string) => {
    router.push({
      pathname: "/templates/[id]",
      params: { id: templateId },
    });
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="h5 mb-0">{t("popularTemplates")}</h2>
      </Card.Header>
      <Card.Body>
        {templates.length === 0 ? (
          <p className="text-center text-muted">{t("noTemplatesYet")}</p>
        ) : (
          <Table responsive hover className="mb-0 table">
            <thead>
              <tr>
                <th>{t("table.title")}</th>
                <th>{t("table.topic")}</th>
                <th>{t("table.responses")}</th>
                <th>{t("table.author")}</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(template.id)}
                >
                  <td>{template.title}</td>
                  <td>
                    <Badge bg="info">{template.topic}</Badge>
                  </td>
                  <td>{template.responses}</td>
                  <td>{template.author.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
