import React from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Users,
  KeyRound,
  ChartNoAxesCombined,
  DollarSign,
  BadgeCheck,
  Settings,
  Building2,
} from "lucide-react";

import "./sidebar.css";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/roommate" },
  { label: "Utility Bills", icon: ReceiptText, path: "/roommate/bills" },
  { label: "Expense Allocator", icon: PieChart, path: "/roommate/expense" },
  { label: "Member Roster", icon: Users, path: "/roommate/member" },
  { label: "Payment Setup", icon: KeyRound, path: "/roommate/payment" },
  { label: "Master Analytics", icon: ChartNoAxesCombined, path: "/roommate/analytics" },
  { label: "Expense Manager", icon: DollarSign, path: "/roommate/expense-manager" },
  { label: "Audit & Ledger", icon: BadgeCheck, path: "/roommate/audit" },
];

const RoommateSidebar = ({
  onNavigate,
  activeItem = "Dashboard",
  user,
}) => {
  const location = useLocation();

  const handleNavigation = (item) => {
    if (onNavigate) {
      onNavigate(item.path);
    }
  };

  return (
    <aside className="roommate-sidebar">
      <div className="roommate-sidebar-top">

        <div className="roommate-brand">
          <span className="roommate-brand-name">Splitfy Teal</span>

          <div className="roommate-admin-brand">
            <span>Splitfy</span>
            <span className="roommate-admin-badge">ADMIN</span>
          </div>
        </div>

        <div className="roommate-workspace">
          <span className="roommate-workspace-heading">
            ACTIVE WORKSPACE
          </span>

          <div className="roommate-workspace-property">
            <Building2 size={12} />
            <span>Hostel Suite / Room 402</span>
          </div>

          <div className="roommate-workspace-status">
            <span className="roommate-status-dot" />
            <span>Master Ledger Active</span>
          </div>
        </div>

        <nav className="roommate-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.replace(/\/$/, "") === item.path;

            return (
              <button
                type="button"
                key={item.label}
                className={`roommate-nav-item ${
                  isActive ? "roommate-nav-active" : ""
                }`}
                onClick={() => handleNavigation(item)}
              >
                <Icon size={14} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="roommate-profile">
        <div className="roommate-profile-avatar">
          {(user?.name || "Alex Rivera").charAt(0).toUpperCase()}
        </div>

        <div className="roommate-profile-info">
          <span className="roommate-profile-name">
            {user?.name || "Alex Rivera"}
          </span>

          <span className="roommate-profile-role">
            Group Creator
          </span>
        </div>

        <button
          type="button"
          className="roommate-settings-btn"
          aria-label="Settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </aside>
  );
};

export default RoommateSidebar;