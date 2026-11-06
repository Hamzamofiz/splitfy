import { useState } from "react";
import "./sidebar.css";

const navItems = [
  { label: "Dashboard & Dues", icon: "dashboard", href: "/dashboard" },
  { label: "Monthly Invoice", icon: "invoice", href: "/monthlyinvoice" },
  { label: "Payment Receipts Vault", icon: "receipts", href: "/payment" },
  { label: "Claim Cash Payment", icon: "payment", href: "/claimcash" },
  { label: "Rent Extension", icon: "calendar", href: "/extension" },
  { label: "Digital Lease Vault", icon: "folder", href: "/leases" },
];

const iconShapes = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3.5h8l4 4V20.5H6z" />
      <path d="M14 3.5v4h4M9 12h6M9 16h6" />
    </>
  ),
  receipts: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M7 9h10M7 13h6" />
      <circle cx="17" cy="15.5" r="1.5" />
    </>
  ),
  payment: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M3.5 9.5h17M7 14.5h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h3" />
      <path d="m14 15 1.5 1.5L19 13" />
    </>
  ),
  folder: (
    <>
      <path d="M3.5 7a2 2 0 0 1 2-2h5l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
      <path d="M3.5 10h17" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5h16M6 20.5V5l6-2 6 2v15.5" />
      <path d="M9 8h1M14 8h1M9 12h1M14 12h1M10 20.5v-4h4v4" />
    </>
  ),
};

function Icon({ name, size = 20 }) {
  return (
    <svg
      className="sidebar-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconShapes[name]}
    </svg>
  );
}

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <header className="sidebar-header">
            <button
              className="sidebar-toggle"
              type="button"
              onClick={() => setCollapsed((current) => !current)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="brand">
              <span className="brand-mark">S</span>
              <span className="brand-name">Splitfy</span>
            </div>

            <span className="mode-badge">MODE</span>
          </header>

          <button
            className="tenant-card"
            type="button"
            title="Select tenancy unit"
          >
            <span className="tenant-icon">
              <Icon name="building" size={18} />
            </span>
            <span className="tenant-details">
              <span className="tenant-caption">TENANCY UNIT</span>
              <span className="tenant-name">Sunset Heights — Apt 402</span>
            </span>
            <span className="tenant-chevron" aria-hidden="true">⌄</span>
          </button>

          <nav className="sidebar-nav" aria-label="Main navigation">
            <span className="nav-section-label">WORKSPACE</span>

            {navItems.map((item, index) => (
              <a
                className={`nav-link ${index === 0 ? "active" : ""}`}
                href={item.href}
                key={item.label}
                title={item.label}
                aria-current={index === 0 ? "page" : undefined}
              >
                <Icon name={item.icon} />
                <span className="nav-link-label">{item.label}</span>
                {index === 0 && <span className="active-indicator" />}
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="contact-avatar">
            <Icon name="building" size={18} />
          </div>

          <div className="contact-details">
            <span className="contact-caption">LANDLORD CONTACT</span>
            <strong>Malik Tariq</strong>
            <span className="contact-company">Sunset Real Estate OS</span>
          </div>

          <button
            className="contact-more"
            type="button"
            aria-label="More contact options"
            title="More contact options"
          >
            ···
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}