"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container, Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Link } from "../../../navigation";
import TemplatesTable from "./TemplatesTable";
import FormsTable from "./FormsTable";

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const [activeTab, setActiveTab] = useState("templates");

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="dashboard-title">{t("title")}</h1>
          <p className="dashboard-subtitle text-muted">{t("subtitle")}</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <Link href="/templates/new">
            <Button variant="primary">{t("createTemplate")}</Button>
          </Link>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k: string | null) => setActiveTab(k || "templates")}
        className="mb-4"
      >
        <Tab eventKey="templates" title={t("tabs.templates")}>
          <TemplatesTable />
        </Tab>
        <Tab eventKey="forms" title={t("tabs.forms")}>
          <FormsTable />
        </Tab>
      </Tabs>
    </Container>
  );
}
