// src/components/templates/QuestionModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { Question, NewQuestion, QuestionTypeCount } from "@/types/question";

type QuestionModalProps = {
  show: boolean;
  onHide: () => void;
  onSave: (question: Question) => void;
  question: Question | null;
  typeCounts: QuestionTypeCount;
};

export default function QuestionModal({
  show,
  onHide,
  onSave,
  question,
  typeCounts,
}: QuestionModalProps) {
  const t = useTranslations("templates");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState<NewQuestion>({
    title: "",
    description: "",
    type: "SINGLE_LINE",
    required: false,
    showInSummary: true,
    visible: true,
  });

  // Reset form when modal opens or question changes
  useEffect(() => {
    if (question) {
      setFormData({
        ...question,
        description: question.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "SINGLE_LINE",
        required: false,
        showInSummary: true,
        visible: true,
      });
    }
  }, [question, show]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert NewQuestion to Question - adding required properties with defaults
    const completeQuestion = {
      ...formData,
      description: formData.description || null,
      id: formData.id || "", // Empty string will be replaced by server
      order: formData.order || 0, // Zero order will be replaced by server
    } as Question;

    onSave(completeQuestion);
  };

  // Check if type is at its limit (4 questions)
  const isTypeAtLimit = (type: string) => {
    if (question && question.type === type) {
      // If editing the same type, it doesn't count towards the limit
      return false;
    }

    return typeCounts[type as keyof QuestionTypeCount] >= 4;
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {question ? t("editQuestion") : t("addQuestion")}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>{t("settings.title")}</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t("placeholders.questionTitle")}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("settings.description")}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder={t("placeholders.questionDescription")}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("settings.type")}</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={!!question} // Cannot change type after creation
            >
              <option
                value="SINGLE_LINE"
                disabled={isTypeAtLimit("SINGLE_LINE")}
              >
                {t("questionTypes.singleLine")}
                {isTypeAtLimit("SINGLE_LINE") && ` (${t("limit")})`}
              </option>
              <option value="MULTI_LINE" disabled={isTypeAtLimit("MULTI_LINE")}>
                {t("questionTypes.multiLine")}
                {isTypeAtLimit("MULTI_LINE") && ` (${t("limit")})`}
              </option>
              <option value="INTEGER" disabled={isTypeAtLimit("INTEGER")}>
                {t("questionTypes.integer")}
                {isTypeAtLimit("INTEGER") && ` (${t("limit")})`}
              </option>
              <option value="CHECKBOX" disabled={isTypeAtLimit("CHECKBOX")}>
                {t("questionTypes.checkbox")}
                {isTypeAtLimit("CHECKBOX") && ` (${t("limit")})`}
              </option>
            </Form.Select>
            <Form.Text className="text-muted">
              {t("typeChangeWarning")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="required-checkbox"
              name="required"
              label={t("settings.required")}
              checked={formData.required}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="show-in-summary-checkbox"
              name="showInSummary"
              label={t("settings.showInSummary")}
              checked={formData.showInSummary}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="visible-checkbox"
              name="visible"
              label={t("settings.visible")}
              checked={formData.visible}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {tCommon("cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {tCommon("save")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
