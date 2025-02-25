"use client";

import { Container, Navbar } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { Link } from "../../../navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const t = useTranslations("app");
  const tAuth = useTranslations("auth");
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  // Close the navbar when the path changes
  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  // Toggle menu function
  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="md"
      className="navbar mx-3 mt-3 rounded-5"
      expanded={expanded}
    >
      <Container>
        <Link href="/" className="navbar-brand">
          {t("name")}
        </Link>

        {/* Burger button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Desktop View */}
          <div className="d-none d-md-flex w-100 align-items-center">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <div className="ms-auto d-flex align-items-center">
              <LanguageSwitcher />
              <div className="mx-2">
                <ThemeSwitcher />
              </div>
              <Link href="/auth/login" className="nav-link">
                {tAuth("login")}
              </Link>
            </div>
          </div>

          {/* Mobile View */}
          <div className="d-md-none mobile-nav-row">
            <div className="d-flex align-items-center justify-content-between w-100">
              <Link href="/" className="nav-link-home">
                Home
              </Link>
              <div className="d-flex align-items-center">
                <LanguageSwitcher />
                <div className="mx-2">
                  <ThemeSwitcher />
                </div>
                <Link href="/auth/login" className="nav-link-login">
                  {tAuth("login")}
                </Link>
              </div>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
