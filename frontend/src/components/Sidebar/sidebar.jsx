import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  Banknote,
  CalendarClock,
  FolderLock,
  ChevronsUpDown,
  Building2,
} from "lucide-react";

import "./sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard & Dues", icon: LayoutDashboard },
  { id: "invoice", label: "Monthly Invoice", icon: ReceiptText },
  { id: "payment", label: "Payment Receipts Vault", icon: ShieldCheck },
  { id: "cash", label: "Claim Cash Payment", icon: Banknote },
  { id: "extension", label: "Rent Extension", icon: CalendarClock },
  { id: "lease", label: "Digital Lease Vault", icon: FolderLock },
];

const TABLET_QUERY = "(min-width: 48.0625rem) and (max-width: 64rem)";
const MOBILE_QUERY = "(max-width: 48rem)";

export default function Sidebar({
  unit = { name: "Sunset Heights — Apt 402", lease: "12 Mo Lease" },
  landlord = { name: "Malik Tariq", company: "Sunset Real Estate OS" },
  mode = "Tenant",
  onNavigate,
  onSwitchUnit,
}) {
  const location = useLocation();

  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(
    () => window.matchMedia(TABLET_QUERY).matches
  );

  // Sync active navigation with current URL
  useEffect(() => {
    const currentPage =
      location.pathname.replace("/", "") || "dashboard";

    setActive(currentPage);
  }, [location.pathname]);

  // Drawer: Escape key and page scroll lock
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

  // Close drawer when leaving mobile screen
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

  const initials = landlord.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="sidebar-mobile-topbar">
        <button
          type="button"
          className="sidebar-mobile-topbar__toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="sidebar-drawer"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>

        <div className="sidebar-mobile-topbar__brand">
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${
          isOpen ? "sidebar-overlay--visible" : ""
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar-drawer"
        className={`sidebar ${isOpen ? "sidebar--open" : ""} ${
          isCollapsed ? "sidebar--collapsed" : ""
        }`}
        aria-label="Main navigation"
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
              {mode} Portal
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

        {/* Tenancy Unit */}
        <button
          type="button"
          className="sidebar__unit"
          onClick={onSwitchUnit}
          aria-label="Switch tenancy unit"
          title={isCollapsed ? unit.name : undefined}
        >
          <Building2
            size={18}
            strokeWidth={1.5}
            className="sidebar__unit-icon"
          />

          <span className="sidebar__unit-top">
            <span className="sidebar__eyebrow">Tenancy Unit</span>
            <span className="sidebar__unit-lease">
              {unit.lease}
            </span>
          </span>

          <span className="sidebar__unit-main">
            <span className="sidebar__unit-name">
              {unit.name}
            </span>

            <ChevronsUpDown size={15} strokeWidth={1.5} />
          </span>
        </button>

        {/* Navigation */}
        <nav className="sidebar__nav" aria-label="Sections">
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

        {/* Landlord Contact */}
        <footer
          className="sidebar__contact"
          title={
            isCollapsed
              ? `${landlord.name} — ${landlord.company}`
              : undefined
          }
        >
          <span className="sidebar__avatar" aria-hidden="true">
            {initials}
          </span>

          <div className="sidebar__contact-text">
            <span className="sidebar__eyebrow">
              Landlord Contact
            </span>

            <span className="sidebar__contact-name">
              {landlord.name}
            </span>

            <span className="sidebar__contact-company">
              {landlord.company}
            </span>
          </div>
        </footer>
      </aside>
    </>
  );
}