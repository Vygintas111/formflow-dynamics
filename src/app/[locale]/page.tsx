import { unstable_setRequestLocale } from "next-intl/server";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslations } from "next-intl";
import LatestTemplates from "@/components/home/LatestTemplates";
import PopularTemplates from "@/components/home/PopularTemplates";
import TagCloud from "@/components/home/TagCloud";

type Props = {
  params: { locale: string };
};

export default function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = useTranslations("app");

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="mb-3">{t("name")}</h1>
        <p className="lead">{t("description")}</p>
      </div>

      <Row className="mb-5">
        <Col>
          <LatestTemplates />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={8}>
          <PopularTemplates />
        </Col>
        <Col md={4}>
          <TagCloud />
        </Col>
      </Row>
    </Container>
  );
}
