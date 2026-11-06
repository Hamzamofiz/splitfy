
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
  Building2,
  ChevronRight,
} from "lucide-react";

import "./sidebar.css";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
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
    path: "/expenses",
  },
];

const Sidebar = ({ onLogout }) => {
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
            {showFullSidebar && (
              <span>
                Splitfy<span className="brand-accent">.</span>
              </span>
            )}
          </div>

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

        {/* NAVIGATION */}
        <nav className="sidebar-navigation">
          <div className="sidebar-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
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