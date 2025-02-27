"use client";

import { Container, Navbar, Nav } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { Link } from "../../../navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";
import SearchBox from "./SearchBox";

export default function Header() {
  const t = useTranslations("app");
  const tAuth = useTranslations("auth");
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

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
            <Nav className="me-auto">
              <Link href="/" className="nav-link">
                Home
              </Link>
              {session && (
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
            </Nav>
            <div className="me-3">
              <SearchBox />
            </div>
            <div className="d-flex align-items-center">
              <LanguageSwitcher />
              <div className="mx-2">
                <ThemeSwitcher />
              </div>
              {status === "loading" ? (
                <div className="nav-link">Loading...</div>
              ) : session ? (
                <UserMenu user={session.user} />
              ) : (
                <Link href="/auth/login" className="nav-link">
                  {tAuth("login")}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="d-md-none mobile-nav-row">
            <Nav className="mb-2">
              <Link href="/" className="nav-link">
                Home
              </Link>
              {session && (
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              )}
            </Nav>
            <div className="mb-3 w-100">
              <SearchBox />
            </div>
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center">
                <LanguageSwitcher />
                <div className="mx-2">
                  <ThemeSwitcher />
                </div>
                {status === "loading" ? (
                  <div className="nav-link">Loading...</div>
                ) : session ? (
                  <UserMenu user={session.user} />
                ) : (
                  <Link href="/auth/login" className="nav-link">
                    {tAuth("login")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
