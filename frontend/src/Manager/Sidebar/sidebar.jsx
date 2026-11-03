
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Menu,
  X,
  Home,
  PlusCircle,
  CalendarDays,
  TriangleAlert,
  Wallet,
  BookOpen,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

import "./sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Overview / Home", icon: Home },
  { id: "add-expense", label: "Add Expense", icon: PlusCircle },
  { id: "absence-calculator", label: "Absence Calculator", icon: CalendarDays },
  { id: "issue-reporter", label: "Issue Reporter", icon: TriangleAlert },
  { id: "settlement-hub", label: "Settlement Hub", icon: Wallet },
  { id: "my-ledger", label: "My Ledger", icon: BookOpen },
  { id: "audit-bills", label: "Audit & Bills", icon: ClipboardCheck },
];

const TABLET_QUERY = "(min-width: 48.0625rem) and (max-width: 64rem)";
const MOBILE_QUERY = "(max-width: 48rem)";

const getActivePage = (pathname) => {
  if (pathname === "/manager") return "dashboard";
  return pathname.replace("/", "");
};

export default function ManagerSidebar({ onNavigate, onLogout }) {
  const location = useLocation();

  const [active, setActive] = useState(
    () => getActivePage(location.pathname)
  );

  const [isOpen, setIsOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(
    () => window.matchMedia(TABLET_QUERY).matches
  );

  useEffect(() => {
    setActive(getActivePage(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);

    const handleChange = (e) => {
      if (!e.matches) setIsOpen(false);
    };

    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const handleNav = (id) => {
    setActive(id);
    setIsOpen(false);

    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <>
      <div className="sidebar-mobile-topbar">
        <button
          type="button"
          className="sidebar-mobile-topbar__toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="manager-sidebar-drawer"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>

        <div className="sidebar-mobile-topbar__brand" />
      </div>

      <div
        className={`sidebar-overlay ${
          isOpen ? "sidebar-overlay--visible" : ""
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="manager-sidebar-drawer"
        className={`sidebar ${isOpen ? "sidebar--open" : ""} ${
          isCollapsed ? "sidebar--collapsed" : ""
        }`}
        aria-label="Manager navigation"
      >
        <header className="sidebar__brand">
          <button
            type="button"
            className="sidebar__toggle"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <span className="sidebar__logo" aria-hidden="true">
            S
          </span>

          <div className="sidebar__brand-text">
            <span className="sidebar__wordmark">Splitfy</span>

            <span className="sidebar__mode">
              <span className="sidebar__mode-dot" />
              Manager Portal
            </span>
          </div>

          <button
            type="button"
            className="sidebar__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <nav className="sidebar__nav" aria-label="Manager sections">
          <span className="sidebar__eyebrow sidebar__eyebrow--nav">
            Menu
          </span>

          <ul className="sidebar__list">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;

              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`sidebar__link ${
                      isActive ? "sidebar__link--active" : ""
                    }`}
                    onClick={() => handleNav(id)}
                    aria-current={isActive ? "page" : undefined}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.5}
                      className="sidebar__icon"
                    />

                    <span className="sidebar__link-label">
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="sidebar__contact">
          <span className="sidebar__avatar">M</span>

          <div className="sidebar__contact-text">
            <span className="sidebar__eyebrow">
              Account Type
            </span>

            <span className="sidebar__contact-name">
              Hostel Manager
            </span>

            <span className="sidebar__contact-company">
              Splitfy Workspace
            </span>
          </div>

          <button
            type="button"
            className="sidebar__logout-btn"
            onClick={onLogout}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </footer>
      </aside>
    </>
  );
}
