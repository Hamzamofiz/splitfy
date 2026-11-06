
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Bell,
    Plus,
    ChevronDown,
    UserCircle,
    CalendarDays,
    Check,
    Wallet
} from "lucide-react";

import "./Navbar.css";

const Navbar = ({ onAddExpense }) => {

    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showCycles, setShowCycles] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState("October 2024 Cycle");

    const cycles = [
        "October 2024 Cycle",
        "November 2024 Cycle",
        "December 2024 Cycle"
    ];

    const handleAddExpense = () => {
        if (onAddExpense) {
            onAddExpense();
        } else {
            navigate("/expense");
        }
    };

    return (
        <nav className="main-navbar">

            {/* LEFT SECTION */}
            <div className="navbar-left">

                <div className="navbar-brand">
                    <div className="brand-icon">
                        <Wallet size={17} strokeWidth={2.5} />
                    </div>
                    <span>Splitly</span>
                </div>

                <div className="navbar-divider"></div>

                <div className="navbar-breadcrumbs">
                    <span>Workspace</span>
                    <span className="breadcrumb-arrow">›</span>
                    <span>Room 402</span>
                    <span className="breadcrumb-arrow">›</span>
                    <strong>Resident Portal</strong>
                </div>

            </div>

            {/* RIGHT SECTION */}
            <div className="navbar-right">

                {/* BILLING CYCLE */}
                <div className="navbar-dropdown-wrapper">

                    <button
                        className="cycle-selector"
                        onClick={() => {
                            setShowCycles(!showCycles);
                            setShowNotifications(false);
                        }}
                    >
                        <CalendarDays size={14} />
                        <span>{selectedCycle}</span>
                        <ChevronDown size={12} />
                    </button>

                    {showCycles && (
                        <div className="navbar-dropdown cycle-dropdown">

                            <h4>Select Billing Cycle</h4>

                            {cycles.map((cycle) => (
                                <button
                                    key={cycle}
                                    onClick={() => {
                                        setSelectedCycle(cycle);
                                        setShowCycles(false);
                                    }}
                                    className={
                                        selectedCycle === cycle
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    {cycle}

                                    {selectedCycle === cycle && (
                                        <Check size={14} />
                                    )}
                                </button>
                            ))}

                        </div>
                    )}

                </div>

                {/* NOTIFICATIONS */}
                <div className="navbar-dropdown-wrapper">

                    <button
                        className="notification-button"
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowCycles(false);
                        }}
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                        <span className="notification-dot"></span>
                    </button>

                    {showNotifications && (
                        <div className="navbar-dropdown notification-dropdown">

                            <h4>Notifications</h4>

                            <div className="notification-item">
                                <span className="notification-indicator"></span>

                                <div>
                                    <strong>Room Expense Update</strong>
                                    <p>A new room expense is available for review.</p>
                                    <small>Recently</small>
                                </div>
                            </div>

                            <div className="notification-item">
                                <span className="notification-indicator orange"></span>

                                <div>
                                    <strong>Payment Reminder</strong>
                                    <p>Check your pending room settlements.</p>
                                    <small>Today</small>
                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* ADD EXPENSE */}
                <button
                    type="button"
                    className="navbar-add-expense"
                    onClick={handleAddExpense}
                >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Add Expense</span>
                </button>

                {/* PROFILE */}
                <div className="navbar-profile">

                    <div className="profile-avatar">
                        <UserCircle size={19} />
                    </div>

                    <div className="profile-details">
                        <strong>Hamza Tariq</strong>
                        <span>Roommate / Bed B</span>
                    </div>

                    <ChevronDown
                        className="profile-chevron"
                        size={13}
                    />

                </div>

            </div>

        </nav>
    );
};

export default Navbar;
