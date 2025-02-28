"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Container, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "react-toastify";

type Question = {
  id: string;
  title: string;
  description: string | null;
  type: "SINGLE_LINE" | "MULTI_LINE" | "INTEGER" | "CHECKBOX";
  required: boolean;
};

type Template = {
  id: string;
  title: string;
  description: string;
  topic: string;
  questions: Question[];
  author: {
    id: string;
    name: string;
  };
};

type FormSubmissionProps = {
  templateId: string;
};

export default function FormSubmission({ templateId }: FormSubmissionProps) {
  const t = useTranslations("forms");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<
    Record<string, string | number | boolean>
  >({});

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Fetch the template from the API
        const response = await fetch(`/api/templates/${templateId}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch template");
        }

        const data = await response.json();
        setTemplate(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching template:", error);
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleInputChange = (
    questionId: string,
    value: string | number | boolean
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Check required fields
      const missingRequiredFields = template?.questions
        .filter(
          (q) =>
            q.required && (answers[q.id] === undefined || answers[q.id] === "")
        )
        .map((q) => q.title);

      if (missingRequiredFields && missingRequiredFields.length > 0) {
        toast.error(
          `Please fill in all required fields: ${missingRequiredFields.join(
            ", "
          )}`
        );
        setSubmitting(false);
        return;
      }

      // Submit the form to the API
      const formData = {
        templateId: template?.id,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          questionId,
          value: String(value),
        })),
      };

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit form");
      }

      toast.success("Form submitted successfully!");
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <LoadingSpinner />
      </Container>
    );
  }

  if (!template) {
    return (
      <Container className="py-4">
        <Card className="text-center p-5">
          <h2>Template not found</h2>
          <p className="text-muted">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => router.push("/")}>
              {tCommon("back")}
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => router.push(`/templates/${templateId}`)}
        >
          <FiArrowLeft className="me-1" /> {tCommon("back")}
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <h1 className="h3 mb-1">{template.title}</h1>
          <div className="d-flex align-items-center">
            <Badge bg="info" className="me-2">
              {template.topic}
            </Badge>
            <small className="text-muted">
              {t("by")} {template.author.name}
            </small>
          </div>
        </Card.Header>

        <Card.Body>
          <p className="mb-4">{template.description}</p>

          <Form onSubmit={handleSubmit}>
            {template.questions.map((question) => (
              <Form.Group key={question.id} className="mb-4">
                <Form.Label>
                  {question.title}
                  {question.required && <span className="text-danger">*</span>}
                </Form.Label>
                {question.description && (
                  <Form.Text className="text-muted d-block mb-2">
                    {question.description}
                  </Form.Text>
                )}

                {question.type === "SINGLE_LINE" && (
                  <Form.Control
                    type="text"
                    value={(answers[question.id] as string) || ""}
                    onChange={(e) =>
                      handleInputChange(question.id, e.target.value)
                    }
                    required={question.required}
                  />
                )}

                {question.type === "MULTI_LINE" && (
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={(answers[question.id] as string) || ""}
                    onChange={(e) =>
                      handleInputChange(question.id, e.target.value)
                    }
                    required={question.required}
                  />
                )}

                {question.type === "INTEGER" && (
                  <Form.Control
                    type="number"
                    min={1}
                    value={(answers[question.id] as number) || ""}
                    onChange={(e) =>
                      handleInputChange(
                        question.id,
                        parseInt(e.target.value, 10)
                      )
                    }
                    required={question.required}
                  />
                )}

                {question.type === "CHECKBOX" && (
                  <Form.Check
                    type="checkbox"
                    label={t("checkboxLabel")}
                    checked={(answers[question.id] as boolean) || false}
                    onChange={(e) =>
                      handleInputChange(question.id, e.target.checked)
                    }
                    required={question.required}
                  />
                )}
              </Form.Group>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => router.push(`/templates/${templateId}`)}
              >
                {tCommon("cancel")}
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? tCommon("loading") : tCommon("submit")}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
