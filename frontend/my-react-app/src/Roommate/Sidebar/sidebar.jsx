import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Receipt,
  Calculator,
  MessageSquareWarning,
  HandCoins,
  Menu,
  X,
  LogOut,
  Settings,
  Building2,
  ChevronRight,
} from "lucide-react";

import "./sidebar.css";

// ROOMMATE NAVIGATION ITEMS
const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/roommate",
  },
  {
    label: "Add Expense",
    icon: Receipt,
    path: "/expense",
  },
  {
    label: "Absence Calculator",
    icon: Calculator,
    path: "/calculator",
  },
  {
    label: "Issue Reporter",
    icon: MessageSquareWarning,
    path: "/issue-reporter",
  },
  {
    label: "Settlement Hub",
    icon: HandCoins,
    path: "/settlement",
  },
];

const Sidebar = ({
  onLogout,
  onSettings,
  workspace = "Hostel Suite / Room 402",
  workspaceType = "Master Ledger Active",
  user = {
    name: "Alex Rivera",
    role: "Group Member",
  },
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar visibility
  const showFullSidebar = !collapsed || mobileOpen;

  // Close mobile sidebar
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // Escape key and body scroll lock
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

  // Close sidebar after navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    closeMobileMenu();

    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
  };

  // Settings
  const handleSettings = () => {
    closeMobileMenu();

    if (onSettings) {
      onSettings();
    } else {
      navigate("/settings");
    }
  };

  // Sidebar toggle
  const handleSidebarToggle = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      closeMobileMenu();
    } else {
      setCollapsed((previous) => !previous);
    }
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {!mobileOpen && (
        <button
          className="sidebar-mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          type="button"
        >
          <Menu size={23} />
        </button>
      )}

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* MAIN SIDEBAR */}
      <aside
        id="main-sidebar"
        className={`
          app-sidebar
          ${collapsed ? "sidebar-collapsed" : ""}
          ${mobileOpen ? "sidebar-mobile-open" : ""}
        `}
        aria-label="Roommate navigation"
      >

        {/* BRAND SECTION */}
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
              ROOMMATE
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
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* WORKSPACE CARD */}
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
                    `sidebar-nav-item ${
                      isActive ? "active" : ""
                    }`
                  }
                >

                  <Icon
                    size={19}
                    strokeWidth={2}
                  />

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

          {/* USER PROFILE */}
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

          {/* LOGOUT */}
          <button
            className="sidebar-logout-button"
            onClick={handleLogout}
            title="Logout"
            type="button"
          >
            <LogOut size={18} />

            {showFullSidebar && (
              <span>Logout</span>
            )}
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;