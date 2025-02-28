"use client";

import { useState, useEffect } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "../../../navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Link } from "../../../navigation";
import { toast } from "react-toastify";

type Template = {
  id: string;
  title: string;
  topic: string;
  access: string;
  createdAt: string;
  _count: {
    forms: number;
  };
};

export default function TemplatesTable() {
  const { data: session } = useSession();
  const t = useTranslations("dashboard");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch user's templates from the API
        const response = await fetch(
          `/api/templates?author=${session?.user?.id}`
        );

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

    if (session?.user?.id) {
      fetchTemplates();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleViewTemplate = (id: string) => {
    router.push({
      pathname: "/templates/[id]",
      params: { id },
    });
  };

  const handleEditTemplate = (id: string) => {
    router.push({
      pathname: "/templates/[id]/edit",
      params: { id },
    });
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete template");
        }

        // Remove the deleted template from the list
        setTemplates(templates.filter((template) => template.id !== id));
        toast.success("Template deleted successfully");
      } catch (error) {
        console.error("Error deleting template:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete template. Please try again."
        );
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (templates.length === 0) {
    return (
      <Card className="p-4 text-center">
        <h4>{t("noTemplates")}</h4>
        <p className="text-muted">{t("createYourFirst")}</p>
        <div className="d-flex justify-content-center">
          <Link href="/templates/new">
            <Button variant="primary">{t("createTemplate")}</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table responsive hover className="mb-0 table">
        <thead>
          <tr>
            <th>{t("table.title")}</th>
            <th>{t("table.topic")}</th>
            <th>{t("table.responses")}</th>
            <th>{t("table.createdAt")}</th>
            <th>{t("table.access")}</th>
            <th className="text-end">{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.title}</td>
              <td>{template.topic}</td>
              <td>{template._count.forms}</td>
              <td>{new Date(template.createdAt).toLocaleDateString()}</td>
              <td>
                <Badge
                  bg={template.access === "PUBLIC" ? "success" : "warning"}
                >
                  {template.access === "PUBLIC" ? t("public") : t("restricted")}
                </Badge>
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1 action-btn"
                  onClick={() => handleViewTemplate(template.id)}
                >
                  <FiEye size={16} />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-1 action-btn"
                  onClick={() => handleEditTemplate(template.id)}
                >
                  <FiEdit size={16} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="action-btn"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <FiTrash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
