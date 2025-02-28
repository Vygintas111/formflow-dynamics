"use client";

import { useState, useEffect } from "react";
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
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "../../../navigation";
import QuestionList from "./QuestionList";

type TemplateFormData = {
  title: string;
  description: string;
  topic: string;
  access: "PUBLIC" | "RESTRICTED";
  tags: string[];
  rawTagInput?: string;
};

type TemplateFormProps = {
  templateId?: string;
};

export default function TemplateForm({ templateId }: TemplateFormProps) {
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
    rawTagInput: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const isEditMode = !!templateId;

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/templates/${templateId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const templateData = await response.json();
      setTemplate(templateData);

      const tags = templateData.tags?.map((t: any) => t.tag.name) || [];

      setFormData({
        title: templateData.title || "",
        description: templateData.description || "",
        topic: templateData.topic || "Other",
        access: templateData.access || "PUBLIC",
        tags: tags,
        rawTagInput: tags.join(", "),
      });
    } catch (error) {
      console.error("Error fetching template:", error);
      toast.error("Failed to load template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagInput = e.target.value;
    setFormData((prev) => ({
      ...prev,
      rawTagInput: tagInput,
      tags: tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;

      if (isEditMode) {
        // Update existing template
        response = await fetch(`/api/templates/${templateId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new template
        response = await fetch("/api/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || `Failed to ${isEditMode ? "update" : "create"} template`
        );
      }

      const savedTemplate = await response.json();

      toast.success(
        `Template ${isEditMode ? "updated" : "created"} successfully!`
      );

      if (!isEditMode) {
        // If creating a new template, redirect to the edit page to add questions
        router.push(`/${locale}/templates/${savedTemplate.id}/edit`);
      } else {
        // If editing, stay on the page and refresh data
        setTemplate(savedTemplate);

        // Always switch to questions tab after save
        setActiveTab("questions");
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} template:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isEditMode ? "update" : "create"
            } template. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: string | null) => {
    if (!tab) return;

    // For new templates, save details first before allowing to switch to questions tab
    if (tab === "questions" && !templateId) {
      toast.info("Please save template details first before adding questions.");
      return;
    }

    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{tCommon("loading")}</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">{isEditMode ? t("edit") : t("create")}</h1>

      <Card>
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="mb-0 card-header-tabs template-form-tabs"
          >
            <Tab eventKey="details" title={t("details")} />
            <Tab
              eventKey="questions"
              title={t("questions")}
              disabled={!templateId}
            />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {activeTab === "details" && (
            <Form onSubmit={handleSubmit} className="template-form">
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
                  value={formData.rawTagInput || formData.tags.join(", ")}
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
            <>
              {templateId ? (
                <>
                  <QuestionList templateId={templateId} />

                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      variant="primary"
                      onClick={() => router.push(`/${locale}/dashboard`)}
                    >
                      {tCommon("save")} & {tCommon("back")}
                    </Button>
                  </div>
                </>
              ) : (
                <Alert variant="info" className="text-center py-4">
                  <p className="mb-0">{t("saveTemplateFirst")}</p>
                </Alert>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
