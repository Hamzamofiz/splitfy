
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Bell,
  Plus,
  UserRound,
  CalendarDays,
  Layers3,
  LayoutDashboard,
  Users,
  Receipt,
  Settings,
  LogOut,
  X,
  Check,
  Wallet,
  ArrowRight,
} from "lucide-react";

import "./Navbar.css";

const Navbar = ({
  onAddExpense = () => {},
  onNavigate = () => {},
  onLogout = () => {},
  notifications: initialNotifications = [
    {
      id: 1,
      title: "Welcome to Splitify",
      message: "Your group ledger is ready.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "Workspace updated",
      message: "Your workspace information is up to date.",
      time: "Earlier",
      read: false,
    },
  ],
  currentMonth = "2024-10",
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const toggleMenu = (menu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const navigate = (page) => {
    setActiveMenu(null);
    onNavigate(page);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    setActiveMenu(null);
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();

    if (
      !expense.title.trim() ||
      !expense.amount ||
      Number(expense.amount) <= 0 ||
      !expense.date
    ) {
      return;
    }

    const newExpense = {
      ...expense,
      amount: Number(expense.amount),
      id: Date.now(),
      currency: "PKR",
    };

    onAddExpense(newExpense);

    setExpense({
      title: "",
      amount: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });

    setShowExpenseModal(false);
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const handleLogout = () => {
    setActiveMenu(null);
    onLogout();
  };

  const formatMonth = (month) => {
    return new Date(`${month}-01T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  const months = Array.from({ length: 24 }, (_, index) => {
    const date = new Date(2024, index, 1);

    return {
      value: `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  });

  return (
    <>
      <header className="top-navbar">

        {/* BRAND */}
        <button
          className="navbar-brand"
          onClick={() => navigate("dashboard")}
        >
          <span className="brand-mark">
            <Layers3 size={17} />
          </span>

          <span>Splitify Teal Ribbon</span>
        </button>

        {/* BREADCRUMBS */}
        <nav className="navbar-breadcrumbs">

          <div className="nav-dropdown-wrapper">
            <button
              className="breadcrumb-btn"
              onClick={() => toggleMenu("workspace")}
            >
              Workspace
              <ChevronDown size={12} />
            </button>

            {activeMenu === "workspace" && (
              <div className="nav-dropdown workspace-dropdown">
                <p className="dropdown-heading">WORKSPACE</p>

                <button onClick={() => navigate("dashboard")}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                <button onClick={() => navigate("rooms")}>
                  <Users size={16} />
                  All Rooms
                </button>

                <button onClick={() => navigate("expenses")}>
                  <Receipt size={16} />
                  Expenses
                </button>

                <button onClick={() => navigate("settings")}>
                  <Settings size={16} />
                  Settings
                </button>
              </div>
            )}
          </div>

          <ChevronRight className="breadcrumb-arrow" size={13} />

          <button
            className="breadcrumb-btn room-breadcrumb"
            onClick={() => navigate("room")}
          >
            Room 402
          </button>

          <ChevronRight className="breadcrumb-arrow" size={13} />

          <button
            className="breadcrumb-btn active-link"
            onClick={() => navigate("ledger")}
          >
            Master Ledger
          </button>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="navbar-actions">

          {/* MONTH SELECTOR */}
          <div className="nav-dropdown-wrapper">
            <button
              className="date-selector"
              onClick={() => toggleMenu("calendar")}
            >
              <CalendarDays size={15} />
              <span>{formatMonth(selectedMonth)}</span>
              <ChevronDown size={13} />
            </button>

            {activeMenu === "calendar" && (
              <div className="nav-dropdown calendar-dropdown">
                <p className="dropdown-heading">SELECT MONTH</p>

                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="month-select"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <button
                  className="dropdown-confirm"
                  onClick={() => setActiveMenu(null)}
                >
                  Apply Month
                </button>
              </div>
            )}
          </div>

          {/* ROLE */}
          <div className="nav-dropdown-wrapper">
            <button
              className="role-badge"
              onClick={() => toggleMenu("role")}
            >
              <span className="role-dot"></span>
              Group Creator & Admin
              <ChevronDown size={12} />
            </button>

            {activeMenu === "role" && (
              <div className="nav-dropdown role-dropdown">
                <p className="dropdown-heading">YOUR ACCESS</p>

                <div className="role-info">
                  <div className="role-icon">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <strong>Group Creator</strong>
                    <span>Administrator access</span>
                  </div>
                </div>

                <div className="permission-item">
                  <Check size={14} />
                  Manage expenses
                </div>

                <div className="permission-item">
                  <Check size={14} />
                  Manage group members
                </div>

                <div className="permission-item">
                  <Check size={14} />
                  View master ledger
                </div>
              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="nav-dropdown-wrapper">
            <button
              className="notification-btn"
              onClick={() => toggleMenu("notifications")}
              aria-label="Notifications"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="notification-dot">
                  {unreadCount}
                </span>
              )}
            </button>

            {activeMenu === "notifications" && (
              <div className="nav-dropdown notification-dropdown">

                <div className="notification-header">
                  <div>
                    <strong>Notifications</strong>
                    <span>{unreadCount} unread messages</span>
                  </div>

                  <button
                    className="mark-read-btn"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        className={`notification-item ${
                          item.read ? "read" : "unread"
                        }`}
                        key={item.id}
                      >
                        <span className="notification-icon">
                          <Bell size={15} />
                        </span>

                        <div className="notification-content">
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                          <span>{item.time}</span>
                        </div>

                        {!item.read && (
                          <span className="unread-indicator"></span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-notifications">
                      <Bell size={25} />
                      <strong>All caught up!</strong>
                      <span>No notifications available.</span>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* NEW EXPENSE */}
          <button
            className="expense-btn"
            onClick={() => {
              setActiveMenu(null);
              setShowExpenseModal(true);
            }}
          >
            <Plus size={17} strokeWidth={2.5} />
            <span>New Expense</span>
          </button>

          {/* PROFILE */}
          <div className="nav-dropdown-wrapper">
            <button
              className="profile-btn"
              onClick={() => toggleMenu("profile")}
              aria-label="Profile menu"
            >
              <UserRound size={18} />
            </button>

            {activeMenu === "profile" && (
              <div className="nav-dropdown profile-dropdown">

                <div className="profile-info">
                  <div className="profile-avatar">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <strong>Group Admin</strong>
                    <span>Administrator</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button onClick={() => navigate("profile")}>
                  <UserRound size={16} />
                  My Profile
                </button>

                <button onClick={() => navigate("settings")}>
                  <Settings size={16} />
                  Account Settings
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}
          </div>

        </div>
      </header>

      {/* EXPENSE MODAL */}
      {showExpenseModal && (
        <div
          className="expense-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowExpenseModal(false);
            }
          }}
        >
          <div className="expense-modal">

            <div className="modal-header">
              <div className="modal-heading-icon">
                <Wallet size={21} />
              </div>

              <div>
                <h2>Add New Expense</h2>
                <p>Record a new group expense.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowExpenseModal(false)}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="expense-form"
              onSubmit={handleExpenseSubmit}
            >
              <div className="form-group">
                <label>Expense Title *</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Monthly groceries"
                  value={expense.title}
                  onChange={handleExpenseChange}
                  required
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Amount (PKR) *</label>

                  <div className="amount-input">
                    <span>Rs.</span>

                    <input
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      value={expense.amount}
                      onChange={handleExpenseChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Category *</label>

                  <select
                    name="category"
                    value={expense.category}
                    onChange={handleExpenseChange}
                  >
                    <option>Food</option>
                    <option>Rent</option>
                    <option>Utilities</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Entertainment</option>
                    <option>Other</option>
                  </select>
                </div>

              </div>

              <div className="form-group">
                <label>Expense Date *</label>

                <input
                  type="date"
                  name="date"
                  value={expense.date}
                  onChange={handleExpenseChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Add additional details..."
                  value={expense.description}
                  onChange={handleExpenseChange}
                  rows={3}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowExpenseModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-expense-btn"
                >
                  Save Expense
                  <ArrowRight size={16} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
