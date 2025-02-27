"use client";

import { Dropdown } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { FiUser, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { Link } from "../../../navigation";

type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations("common");

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle variant="outline-light" id="user-menu">
        {user.name || user.email}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Link href="/dashboard" className="dropdown-item">
          <FiUser className="me-2" size={16} />
          Dashboard
        </Link>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleSignOut}>
          <FiLogOut className="me-2" size={16} />
          {t("signOut")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
