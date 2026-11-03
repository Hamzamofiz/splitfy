
import {
  Calendar,
  Plus,
  Bell,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";

import "./navbar.css";

const Navbar = ({
  property = "Sunset Heights — Apt 402",
  status = "Active Tenancy",
  cycle = "November 2024",
  notifications = 2,
  user = {
    name: "Hamza Tariq",
    role: "Primary Tenant",
  },
  onClaimPayment,
  onNotifications,
  onLogout,
}) => {
  return (
    <header className="navbar">
      <div className="navbar__left">
        <div className="navbar__chip navbar__chip--property">
          <span className="navbar__dot" />
          <span className="navbar__property">{property}</span>
          <span className="navbar__separator" />
          <span className="navbar__status">{status}</span>
        </div>

        <button
          className="navbar__chip navbar__chip--cycle"
          type="button"
        >
          <Calendar size={12} />

          <span className="navbar__cycle-text">
            <span className="navbar__cycle-label">Cycle: </span>
            {cycle}
          </span>

          <ChevronDown size={12} />
        </button>
      </div>

      <div className="navbar__right">
        <button
          className="navbar__cta"
          type="button"
          onClick={onClaimPayment}
        >
          <Plus size={12} strokeWidth={2.5} />
          <span>Claim Payment</span>
        </button>

        <button
          className="navbar__bell"
          type="button"
          onClick={onNotifications}
          aria-label={`Notifications, ${notifications} unread`}
        >
          <Bell size={16} />

          {notifications > 0 && (
            <span className="navbar__badge">
              {notifications}
            </span>
          )}
        </button>

        <div className="navbar__user">
          <div className="navbar__avatar">
            <User size={14} />
          </div>

          <div className="navbar__info">
            <span className="navbar__name">
              {user.name}
            </span>

            <span className="navbar__role">
              {user.role}
            </span>
          </div>
        </div>

        <button
          className="navbar__logout"
          type="button"
          onClick={onLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
