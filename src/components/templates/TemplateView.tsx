"use client";

import { useState, useEffect } from "react";
import { useRouter } from "../../../navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Tabs,
  Tab,
  Form,
  Table,
  Alert,
} from "react-bootstrap";
import {
  FiArrowLeft,
  FiEdit,
  FiHeart,
  FiMessageSquare,
  FiUser,
  FiEye,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "react-toastify";
import QuestionList from "./QuestionList";
import { Question } from "@/types/question";

type FormResponse = {
  id: string;
  createdAt: string;
  submitter: {
    id: string;
    name: string;
    email: string;
  };
  answers: {
    id: string;
    value: string;
    questionId: string;
    question: {
      id: string;
      title: string;
      type: string;
    };
  }[];
};

type TemplateViewProps = {
  id: string;
};

type Template = {
  id: string;
  title: string;
  description: string;
  topic: string;
  access: "PUBLIC" | "RESTRICTED";
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  questions?: Question[];
  _count: {
    likes: number;
    comments: number;
    forms: number;
  };
};

export default function TemplateView({ id }: TemplateViewProps) {
  const t = useTranslations("templates");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Fetch the template with questions from the API
        const response = await fetch(`/api/templates/${id}`);

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
  }, [id]);

  useEffect(() => {
    const fetchResponses = async () => {
      if (activeTab === "responses" && template) {
        setLoadingResponses(true);
        try {
          const response = await fetch(`/api/forms?templateId=${id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch responses");
          }

          const data = await response.json();
          setResponses(data);
        } catch (error) {
          console.error("Error fetching responses:", error);
        } finally {
          setLoadingResponses(false);
        }
      }
    };

    fetchResponses();
  }, [id, activeTab, template]);

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

  const isAuthor = session?.user?.id === template.author.id;

  return (
    <Container className="py-4 template-view">
      <div className="mb-4">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => router.push("/")}
        >
          <FiArrowLeft className="me-1" /> {tCommon("back")}
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header className="bg-transparent">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="h3 mb-1">{template.title}</h1>
              <div className="d-flex align-items-center text-muted small">
                <div className="me-3">
                  <FiUser className="me-1" /> {template.author.name}
                </div>
                <Badge bg="info" className="me-2">
                  {template.topic}
                </Badge>
                <div className="d-flex align-items-center me-2">
                  <FiHeart className="me-1" /> {template._count.likes}
                </div>
                <div className="d-flex align-items-center">
                  <FiMessageSquare className="me-1" />{" "}
                  {template._count.comments}
                </div>
              </div>
            </div>

            <div>
              {isAuthor ? (
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() =>
                    router.push({
                      pathname: "/templates/[id]/edit",
                      params: { id: template.id },
                    })
                  }
                >
                  <FiEdit className="me-1" /> {tCommon("edit")}
                </Button>
              ) : session ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    router.push({
                      pathname: "/templates/[id]/submit",
                      params: { id: template.id },
                    })
                  }
                >
                  {tCommon("submit")}
                </Button>
              ) : null}
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "details")}
            className="mb-3"
          >
            <Tab eventKey="details" title={t("details")}>
              <Row>
                <Col md={8}>
                  <div className="mb-4">
                    <h4>{t("settings.description")}</h4>
                    <p>{template.description}</p>
                  </div>
                </Col>
                <Col md={4}>
                  <Card className="mb-3">
                    <Card.Header>{t("info")}</Card.Header>
                    <Card.Body>
                      <p className="mb-2">
                        <strong>{t("settings.topic")}:</strong> {template.topic}
                      </p>
                      <p className="mb-2">
                        <strong>{t("settings.access")}:</strong>{" "}
                        {template.access === "PUBLIC"
                          ? t("accessOptions.public")
                          : t("accessOptions.restricted")}
                      </p>
                      <p className="mb-2">
                        <strong>{t("createdAt")}:</strong>{" "}
                        {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mb-0">
                        <strong>{t("responses")}:</strong>{" "}
                        {template._count.forms}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="questions" title={t("questions")}>
              {template?.questions && template.questions.length > 0 ? (
                <QuestionList
                  templateId={id}
                  initialQuestions={template.questions}
                  readonly={true}
                />
              ) : (
                <p className="text-center py-5">{t("noQuestionsYet")}</p>
              )}
            </Tab>
            <Tab eventKey="responses" title={t("responses")}>
              {loadingResponses ? (
                <LoadingSpinner />
              ) : responses.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>{t("submittedBy")}</th>
                        <th>{t("submittedAt")}</th>
                        <th>{t("table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((response) => (
                        <tr key={response.id}>
                          <td>
                            {response.submitter.name ||
                              response.submitter.email}
                          </td>
                          <td>
                            {new Date(response.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() =>
                                router.push({
                                  pathname: "/forms/[id]",
                                  params: { id: response.id },
                                })
                              }
                            >
                              <FiEye size={16} className="me-1" />
                              {tCommon("view")}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info" className="text-center py-5">
                  {t("noResponsesYet")}
                </Alert>
              )}
            </Tab>
            <Tab eventKey="analytics" title={t("analytics")}>
              <p className="text-center py-5">
                {t("analyticsWillBeAvailable")}
              </p>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="h5 mb-0">{t("comments")}</h2>
        </Card.Header>
        <Card.Body>
          <p className="text-center py-4">{t("noCommentsYet")}</p>
          {session ? (
            <div className="mt-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t("addComment")}
                className="mb-2"
              />
              <Button variant="primary" disabled>
                {tCommon("submit")}
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p>
                {t("loginToComment")}{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => router.push(`/auth/login`)}
                >
                  {tCommon("login")}
                </Button>
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
