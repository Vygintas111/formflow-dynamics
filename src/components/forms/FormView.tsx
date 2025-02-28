"use client";

import { useState, useEffect } from "react";
import { useRouter } from "../../../navigation";
import { useTranslations, useLocale } from "next-intl";
import { Container, Card, Button, Alert, Table } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type FormAnswer = {
  id: string;
  value: string;
  questionId: string;
  question: {
    id: string;
    title: string;
    type: string;
    required: boolean;
  };
};

type FormResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  submitter: {
    id: string;
    name: string;
    email: string;
  };
  template: {
    id: string;
    title: string;
    authorId: string;
  };
  answers: FormAnswer[];
};

type FormViewProps = {
  id: string;
};

export default function FormView({ id }: FormViewProps) {
  const t = useTranslations("forms");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [form, setForm] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch form");
        }

        const data = await response.json();
        setForm(data);
      } catch (error) {
        console.error("Error fetching form:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-4">
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !form) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || "Form not found or you don't have permission to view it."}
        </Alert>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => router.push("/dashboard")}
        >
          {tCommon("back")}
        </Button>
      </Container>
    );
  }

  const isAuthorized =
    session?.user?.id === form.submitter.id ||
    session?.user?.id === form.template.authorId ||
    session?.user?.role === "ADMIN";

  if (!isAuthorized) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          You don't have permission to view this form.
        </Alert>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => router.push("/dashboard")}
        >
          {tCommon("back")}
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() =>
            router.push({
              pathname: "/templates/[id]",
              params: { id: form.template.id },
            })
          }
        >
          <FiArrowLeft className="me-1" /> {tCommon("back")}
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <h1 className="h3 mb-0">{form.template.title}</h1>
          <div className="text-muted small">
            {t("submittedBy")}: {form.submitter.name || form.submitter.email}
            <br />
            {t("submittedAt")}: {new Date(form.createdAt).toLocaleString()}
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive striped bordered>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>{t("question")}</th>
                <th>{t("answer")}</th>
              </tr>
            </thead>
            <tbody>
              {form.answers.map((answer) => (
                <tr key={answer.id}>
                  <td>
                    {answer.question.title}
                    {answer.question.required && (
                      <span className="text-danger">*</span>
                    )}
                  </td>
                  <td>
                    {answer.question.type === "CHECKBOX"
                      ? answer.value === "true"
                        ? "✓ Yes"
                        : "✗ No"
                      : answer.value || (
                          <em className="text-muted">No answer</em>
                        )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
