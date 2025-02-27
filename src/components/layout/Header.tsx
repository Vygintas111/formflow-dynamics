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
      expand="lg"
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
          {/* Desktop View - Keep this as is */}
          <div className="d-none d-lg-flex w-100 align-items-center">
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
                <div className="nav-link">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </div>
              ) : session ? (
                <UserMenu user={session.user} />
              ) : (
                <Link href="/auth/login" className="nav-link">
                  {tAuth("login")}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile View - Fixed */}
          <div className="d-lg-none">
            {/* First row with nav links and buttons in the same row */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* Navigation links div */}
              <div className="nav-links-container">
                <Nav className="d-flex flex-row">
                  <Link href="/" className="nav-link px-2">
                    Home
                  </Link>
                  {session && (
                    <Link href="/dashboard" className="nav-link px-2">
                      Dashboard
                    </Link>
                  )}
                </Nav>
              </div>

              {/* Buttons div */}
              <div className="d-flex align-items-center">
                <LanguageSwitcher />
                <div className="mx-2">
                  <ThemeSwitcher />
                </div>
                {status === "loading" ? (
                  <div className="nav-link">
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </div>
                ) : session ? (
                  <UserMenu user={session.user} />
                ) : (
                  <Link href="/auth/login" className="nav-link">
                    {tAuth("login")}
                  </Link>
                )}
              </div>
            </div>

            {/* Second row with search */}
            <div className="mb-2">
              <SearchBox />
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
