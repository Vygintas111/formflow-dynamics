"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import {
  Container,
  Form,
  Button,
  Card,
  Tabs,
  Tab,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "../../../navigation";

type TemplateFormData = {
  title: string;
  description: string;
  topic: string;
  access: "PUBLIC" | "RESTRICTED";
  tags: string[];
};

export default function TemplateForm() {
  const t = useTranslations("templates");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState<TemplateFormData>({
    title: "",
    description: "",
    topic: "Other",
    access: "PUBLIC",
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit the form data to the templates API
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create template");
      }

      toast.success("Template created successfully!");
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create template. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">{t("create")}</h1>

      <Card>
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "details")}
            className="mb-0 card-header-tabs"
          >
            <Tab eventKey="details" title={t("details")} />
            <Tab
              eventKey="questions"
              title={t("questions")}
              disabled={!formData.title}
            />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {activeTab === "details" && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t("settings.title")}</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.title")}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t("settings.description")}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("placeholders.description")}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("settings.topic")}</Form.Label>
                    <Form.Select
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                    >
                      <option value="Education">Education</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Survey">Survey</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("settings.access")}</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        id="public-access"
                        name="access"
                        value="PUBLIC"
                        label={t("accessOptions.public")}
                        checked={formData.access === "PUBLIC"}
                        onChange={handleInputChange}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        id="restricted-access"
                        name="access"
                        value="RESTRICTED"
                        label={t("accessOptions.restricted")}
                        checked={formData.access === "RESTRICTED"}
                        onChange={handleInputChange}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>{t("settings.tags")}</Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={formData.tags.join(", ")}
                  onChange={handleTagsChange}
                  placeholder={t("placeholders.tags")}
                />
              </Form.Group>

              <div className="d-flex justify-content-between mt-4">
                <Link href="/dashboard">
                  <Button variant="outline-secondary">
                    {tCommon("cancel")}
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !formData.title}
                >
                  {isSubmitting ? tCommon("loading") : tCommon("save")}
                </Button>
              </div>
            </Form>
          )}

          {activeTab === "questions" && (
            <div className="text-center py-5">
              <p className="text-muted">
                Please save template details first before adding questions.
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
