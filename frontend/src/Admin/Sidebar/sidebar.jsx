
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  ShieldCheck,
  FolderLock,
  Clock,
  Wallet,
  Banknote,
  Wrench,
  Building2,
  LogOut,
  ChevronRight,
} from "lucide-react";

import "./sidebar.css";

const NAV_ITEMS = [
  {
    id: "analytics",
    label: "Analytics",
    path: "/landlord",
    icon: LayoutDashboard,
  },
  {
    id: "invoice-generator",
    label: "Invoice Generator",
    path: "/landlord/invoice-generator",
    icon: FilePlus,
  },
  {
    id: "payment-verification",
    label: "Payment Verification",
    path: "/landlord/payment-verification",
    icon: ShieldCheck,
  },
  {
    id: "tenant-vault",
    label: "Tenant Vault & Leases",
    path: "/landlord/tenant-vault",
    icon: FolderLock,
  },
  {
    id: "deferment-requests",
    label: "Deferment Requests",
    path: "/landlord/deferment-requests",
    icon: Clock,
  },
  {
    id: "quick-collection",
    label: "Quick Collection Hub",
    path: "/landlord/quick-collection",
    icon: Wallet,
  },
  {
    id: "cash-verification",
    label: "Cash Verification",
    path: "/landlord/cash-verification",
    icon: Banknote,
  },
  {
    id: "maintenance",
    label: "Maintenance & Vacancy",
    path: "/landlord/maintenance",
    icon: Wrench,
  },
];

export default function AdminSidebar({ onLogout }) {
  return (
    <aside className="admin-sidebar">

      {/* BRAND */}
      <div className="admin-sidebar-brand">
        <div className="admin-brand-icon">
          <Building2 size={22} />
        </div>

        <div className="admin-brand-text">
          <h2>Splitify</h2>
          <span>PROPERTY MANAGEMENT</span>
        </div>
      </div>

      {/* PORTAL LABEL */}
      <div className="admin-portal-label">
        <span className="admin-status-dot"></span>
        LANDLORD PORTAL
      </div>

      {/* NAVIGATION */}
      <nav className="admin-sidebar-nav">

        <p className="admin-nav-heading">WORKSPACE</p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/landlord"}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />

              <span>{item.label}</span>

              <ChevronRight
                size={15}
                className="admin-nav-arrow"
              />
            </NavLink>
          );
        })}

      </nav>

      {/* BOTTOM */}
      <div className="admin-sidebar-bottom">

        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">A</div>

          <div className="admin-user-info">
            <strong>Administrator</strong>
            <span>Landlord Account</span>
          </div>
        </div>

        <button
          className="admin-logout-button"
          onClick={onLogout}
          type="button"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
}
