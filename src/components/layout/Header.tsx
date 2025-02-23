"use client";

import { Container, Nav, Navbar } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { Link } from "../../../navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const t = useTranslations("app");
  const tAuth = useTranslations("auth");

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Link href="/" className="navbar-brand">
          {t("name")}
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/" className="nav-link">
              Home
            </Link>
          </Nav>
          <Nav>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Link href="/auth/login" className="nav-link">
              {tAuth("login")}
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
