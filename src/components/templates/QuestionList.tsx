"use client";

import { useState, useEffect } from "react";
import { Card, ListGroup, Button, Badge, Form, Spinner } from "react-bootstrap";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import QuestionModal from "./QuestionModal";
import { Question, QuestionTypeCount } from "@/types/question";

type QuestionListProps = {
  templateId: string;
  readonly?: boolean;
  initialQuestions?: Question[];
};

export default function QuestionList({
  templateId,
  readonly = false,
  initialQuestions = [],
}: QuestionListProps) {
  const t = useTranslations("templates");
  const tCommon = useTranslations("common");

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(initialQuestions.length === 0);
  const [isReordering, setIsReordering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [typeCounts, setTypeCounts] = useState<QuestionTypeCount>({
    SINGLE_LINE: 0,
    MULTI_LINE: 0,
    INTEGER: 0,
    CHECKBOX: 0,
  });

  useEffect(() => {
    if (initialQuestions.length === 0) {
      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [templateId, initialQuestions]);

  useEffect(() => {
    // Update type counts when questions change
    const counts: QuestionTypeCount = {
      SINGLE_LINE: 0,
      MULTI_LINE: 0,
      INTEGER: 0,
      CHECKBOX: 0,
    };

    questions.forEach((question) => {
      if (question.visible) {
        counts[question.type]++;
      }
    });

    setTypeCounts(counts);
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/templates/${templateId}/questions`);

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditQuestion(null);
    setShowModal(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditQuestion(question);
    setShowModal(true);
  };

  const handleSaveQuestion = async (question: Question) => {
    try {
      if (editQuestion) {
        // Update existing question
        const response = await fetch(
          `/api/templates/${templateId}/questions/${editQuestion.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update question");
        }

        setQuestions((prev) =>
          prev.map((q) =>
            q.id === editQuestion.id ? { ...q, ...question } : q
          )
        );

        toast.success("Question updated successfully");
      } else {
        // Add new question
        const response = await fetch(`/api/templates/${templateId}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(question),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to add question");
        }

        const newQuestion = await response.json();
        setQuestions((prev) => [...prev, newQuestion]);

        toast.success("Question added successfully");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save question. Please try again."
      );
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm(t("deleteQuestionConfirm"))) {
      return;
    }

    try {
      const response = await fetch(
        `/api/templates/${templateId}/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete question");
      }

      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete question. Please try again."
      );
    }
  };

  const handleToggleVisibility = async (question: Question) => {
    try {
      const updatedQuestion = {
        ...question,
        visible: !question.visible,
      };

      const response = await fetch(
        `/api/templates/${templateId}/questions/${question.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update question visibility");
      }

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, visible: !q.visible } : q
        )
      );

      toast.success(
        updatedQuestion.visible
          ? "Question is now visible"
          : "Question is now hidden"
      );
    } catch (error) {
      console.error("Error toggling question visibility:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update question. Please try again."
      );
    }
  };

  const handleToggleShowInSummary = async (question: Question) => {
    try {
      const updatedQuestion = {
        ...question,
        showInSummary: !question.showInSummary,
      };

      const response = await fetch(
        `/api/templates/${templateId}/questions/${question.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedQuestion),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Failed to update question summary setting"
        );
      }

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, showInSummary: !q.showInSummary } : q
        )
      );

      toast.success(
        updatedQuestion.showInSummary
          ? "Question will be shown in summary"
          : "Question will be hidden from summary"
      );
    } catch (error) {
      console.error("Error toggling question summary setting:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update question. Please try again."
      );
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(startIndex, 1);
    reorderedQuestions.splice(endIndex, 0, removed);

    // Update local state first for responsive UI
    setQuestions(reorderedQuestions);

    // Update on the server
    try {
      setIsReordering(true);
      const response = await fetch(
        `/api/templates/${templateId}/questions/reorder/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedIds: reorderedQuestions.map((q) => q.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reorder questions");
      }

      toast.success("Questions reordered successfully");
    } catch (error) {
      console.error("Error reordering questions:", error);
      toast.error("Failed to reorder questions. Please try again.");
      // Revert to original order on error
      fetchQuestions();
    } finally {
      setIsReordering(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "SINGLE_LINE":
        return t("questionTypes.singleLine");
      case "MULTI_LINE":
        return t("questionTypes.multiLine");
      case "INTEGER":
        return t("questionTypes.integer");
      case "CHECKBOX":
        return t("questionTypes.checkbox");
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{tCommon("loading")}</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Card className="mb-4 question-list-container">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="h5 mb-0">{t("questions")}</h3>
            <small className="text-muted">{t("questionsLimit")}</small>
          </div>
          {!readonly && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddQuestion}
              disabled={isReordering}
            >
              <FiPlus className="me-1" /> {t("addQuestion")}
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {questions.length === 0 ? (
            <p className="text-center py-4 text-muted">
              {t("emptyQuestionsList")}
            </p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="questions"
                isDropDisabled={readonly || isReordering}
              >
                {(provided) => (
                  <ListGroup
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="questions-list"
                  >
                    {questions.map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id}
                        index={index}
                        isDragDisabled={readonly || isReordering}
                      >
                        {(provided, snapshot) => (
                          <ListGroup.Item
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? "dragging" : ""
                            } ${
                              !question.visible ? "text-muted bg-light" : ""
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: question.visible ? 1 : 0.6,
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="mb-1">
                                  {question.title}
                                  {question.required && (
                                    <span className="text-danger ms-1">*</span>
                                  )}
                                </h5>
                                <div className="mb-2">
                                  <Badge bg="info" className="me-2">
                                    {getQuestionTypeLabel(question.type)}
                                  </Badge>
                                  {question.required && (
                                    <Badge bg="danger" className="me-2">
                                      {t("required")}
                                    </Badge>
                                  )}
                                  {!question.visible && (
                                    <Badge bg="secondary" className="me-2">
                                      {t("hidden")}
                                    </Badge>
                                  )}
                                  {question.showInSummary ? (
                                    <Badge bg="success" className="me-2">
                                      {t("showInSummary")}
                                    </Badge>
                                  ) : (
                                    <Badge bg="warning" className="me-2">
                                      {t("hiddenInSummary")}
                                    </Badge>
                                  )}
                                </div>
                                {question.description && (
                                  <p className="text-muted small mb-0">
                                    {question.description}
                                  </p>
                                )}
                              </div>
                              {!readonly && (
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleShowInSummary(question)
                                    }
                                    title={
                                      question.showInSummary
                                        ? t("hideFromSummary")
                                        : t("showInSummary")
                                    }
                                  >
                                    {question.showInSummary ? "↓" : "↑"}
                                  </Button>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleVisibility(question)
                                    }
                                    title={
                                      question.visible
                                        ? t("hideQuestion")
                                        : t("showQuestion")
                                    }
                                  >
                                    {question.visible ? (
                                      <FiEyeOff />
                                    ) : (
                                      <FiEye />
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleEditQuestion(question)}
                                    title={t("editQuestion")}
                                  >
                                    <FiEdit />
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteQuestion(question.id)
                                    }
                                    title={t("deleteQuestion")}
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </ListGroup.Item>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ListGroup>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Card.Body>
        <Card.Footer>
          <div className="d-flex flex-wrap gap-2">
            <Badge bg="info">
              {t("singleLineCount")}: {typeCounts.SINGLE_LINE}/4
            </Badge>
            <Badge bg="info">
              {t("multiLineCount")}: {typeCounts.MULTI_LINE}/4
            </Badge>
            <Badge bg="info">
              {t("integerCount")}: {typeCounts.INTEGER}/4
            </Badge>
            <Badge bg="info">
              {t("checkboxCount")}: {typeCounts.CHECKBOX}/4
            </Badge>
          </div>
        </Card.Footer>
      </Card>

      {/* Question Modal */}
      <QuestionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveQuestion}
        question={editQuestion}
        typeCounts={typeCounts}
      />
    </>
  );
}
