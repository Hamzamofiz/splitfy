
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  ReceiptText,
  Users,
  KeyRound,
  DollarSign,
  Menu,
  X,
  LogOut,
  Settings,
  Building2,
  ChevronRight,
} from "lucide-react";

import "./sidebar.css";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/roommate",
  },
  {
    label: "Utility Bills",
    icon: ReceiptText,
    path: "/bills",
  },
  {
    label: "Member Roster",
    icon: Users,
    path: "/members",
  },
  {
    label: "Payment Setup",
    icon: KeyRound,
    path: "/payment",
  },
  {
    label: "Expense Manager",
    icon: DollarSign,
    path: "/expense",
  },
];

const Sidebar = ({
  onLogout,
  onSettings,
  workspace = "Hostel Suite / Room 402",
  workspaceType = "Master Ledger Active",
  user = {
    name: "Alex Rivera",
    role: "Group Creator",
  },
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const showFullSidebar = !collapsed || mobileOpen;

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    closeMobileMenu();

    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  const handleSettings = () => {
    closeMobileMenu();

    if (onSettings) {
      onSettings();
    } else {
      navigate("/settings");
    }
  };

  const handleSidebarToggle = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      closeMobileMenu();
    } else {
      setCollapsed((previous) => !previous);
    }
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-brand">
          <div className="mobile-topbar-logo">
            <Building2 size={21} />
          </div>

          <span className="mobile-topbar-name">
            Splitfy<span className="brand-accent">.</span>
          </span>
        </div>

        <button
          className="sidebar-mobile-toggle"
          onClick={() => setMobileOpen(true)}
          type="button"
          aria-label="Open navigation menu"
        >
          <Menu size={23} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="main-sidebar"
        className={`
          app-sidebar
          ${collapsed ? "sidebar-collapsed" : ""}
          ${mobileOpen ? "sidebar-mobile-open" : ""}
        `}
        aria-label="Admin navigation"
      >
        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">
            <Building2 size={23} className="brand-icon" />

            {showFullSidebar && (
              <span>
                Splitfy<span className="brand-accent">.</span>
              </span>
            )}
          </div>

          {showFullSidebar && (
            <span className="sidebar-admin-badge">
              ADMIN
            </span>
          )}

          <button
            className="sidebar-menu-button"
            onClick={handleSidebarToggle}
            type="button"
            aria-label={
              mobileOpen ? "Close sidebar" : "Collapse sidebar"
            }
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* WORKSPACE */}
        {showFullSidebar && (
          <div className="workspace-card">
            <span className="workspace-label">
              ACTIVE WORKSPACE
            </span>

            <div className="workspace-name">
              <Building2 size={15} />
              <span>{workspace}</span>
            </div>

            <div className="workspace-status">
              <span className="status-dot" />
              <span>{workspaceType}</span>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="sidebar-navigation">
          <div className="sidebar-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/roommate"}
                  onClick={closeMobileMenu}
                  title={!showFullSidebar ? item.label : undefined}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={2} />

                  {showFullSidebar && (
                    <>
                      <span className="nav-item-label">
                        {item.label}
                      </span>

                      <ChevronRight
                        size={15}
                        className="nav-chevron"
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM SECTION */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {showFullSidebar && (
              <>
                <div className="user-details">
                  <span className="user-name">
                    {user.name}
                  </span>

                  <span className="user-role">
                    {user.role}
                  </span>
                </div>

                <button
                  className="user-settings-button"
                  onClick={handleSettings}
                  title="Settings"
                  aria-label="Settings"
                  type="button"
                >
                  <Settings size={17} />
                </button>
              </>
            )}
          </div>

          <button
            className="sidebar-logout-button"
            onClick={handleLogout}
            title="Logout"
            type="button"
          >
            <LogOut size={18} />

            {showFullSidebar && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;