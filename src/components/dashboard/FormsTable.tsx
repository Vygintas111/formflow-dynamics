"use client";

import { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { FiEye, FiEdit } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type Form = {
  id: string;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    title: string;
  };
};

export default function FormsTable() {
  const { data: session } = useSession();
  const t = useTranslations("dashboard");
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // Only fetch forms if the user is logged in
        if (!session?.user?.id) {
          setLoading(false);
          return;
        }

        // Fetch forms from the API
        const response = await fetch("/api/forms");

        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }

        const data = await response.json();
        setForms(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching forms:", error);
        setLoading(false);
      }
    };

    fetchForms();
  }, [session]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (forms.length === 0) {
    return (
      <Card className="p-4 text-center">
        <h4>{t("noForms")}</h4>
        <p className="text-muted">{t("browseForms")}</p>
      </Card>
    );
  }

  return (
    <Card>
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th>{t("table.templateTitle")}</th>
            <th>{t("table.submittedAt")}</th>
            <th>{t("table.lastUpdated")}</th>
            <th className="text-end">{t("table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <td>{form.template.title}</td>
              <td>{new Date(form.createdAt).toLocaleDateString()}</td>
              <td>{new Date(form.updatedAt).toLocaleDateString()}</td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => (window.location.href = `/forms/${form.id}`)}
                >
                  <FiEye size={16} />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/forms/${form.id}/edit`)
                  }
                >
                  <FiEdit size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
