
import React from "react";
import {
  AlertTriangle,
  Plus,
  Wallet,
  ReceiptText,
  CalendarDays,
  FileText,
  ShoppingCart,
  CheckCircle2,
  Clock3,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  ScanLine,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  UserRound,
  Zap,
  CalendarCheck,
  Eye,
  CircleDollarSign
} from "lucide-react";

import "./overview.css";

const peers = [
  {
    initials: "AR",
    name: "Alex Rivera",
    amount: "Rs 42.50",
    status: "You Owe Rs 42.50",
    type: "owe",
    action: "Pay Raast",
    color: "orange"
  },
  {
    initials: "AK",
    name: "Ali Khan",
    amount: "Owes you Rs 20.83",
    status: "Owes you",
    type: "owed",
    action: "WhatsApp Ping",
    color: "teal"
  },
  {
    initials: "DA",
    name: "Daniyal Ahmed",
    amount: "Owes you Rs 29.17",
    status: "Owes you",
    type: "owed",
    action: "Remind",
    color: "blue"
  },
  {
    initials: "ZM",
    name: "Zayn Malik",
    amount: "All settled (Rs 0.00)",
    status: "Balanced",
    type: "balanced",
    action: "Balanced",
    color: "purple"
  }
];

const activities = [
  {
    initials: "AR",
    name: "Alex Rivera (Admin)",
    tag: "Pending Your Approval",
    time: "1h ago • Monthly Utility Share",
    amount: "Rs 74.67",
    description: "Your share",
    bill: "Uploaded LESCO Electricity Bill",
    details: "Total: Rs 480.00 • Your ensuite share: Rs 74.67",
    icon: ReceiptText,
    type: "pending"
  },
  {
    initials: "HT",
    name: "You Paid",
    tag: "Partially Settled (4/5)",
    time: "Yesterday • Kitchen Common Pool",
    amount: "Rs 125.00",
    description: "Rs 20.83 / person",
    bill: "Metro Cash & Carry • Bulk Kitchen Groceries & Spices",
    details: "Acknowledged by Alex, Zayn, Bilal, & Daniyal. Ali is pending.",
    icon: ShoppingCart,
    type: "settled"
  }
];

const quickActions = [
  {
    icon: Wallet,
    title: "Settle My Dues",
    subtitle: "Raast / SadaPay / NayaPay",
    color: "teal"
  },
  {
    icon: ScanLine,
    title: "Scan Receipt",
    subtitle: "Smart OCR receipt split",
    color: "orange"
  },
  {
    icon: CalendarCheck,
    title: "Log Absence",
    subtitle: "Prorate kitchen & AC dues",
    color: "blue"
  },
  {
    icon: AlertTriangle,
    title: "Report Issue",
    subtitle: "AC, geyser or plumbing...",
    color: "red"
  }
];

export default function Dashboard({
  onAction
}) {
  const handleAction = (action) => {
    if (onAction) onAction(action);
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <div className="dashboard-location">
            <span className="location-dot"></span>
            ROOM 402 <span>•</span> RESIDENT PORTAL
          </div>

          <h1>Roommate Overview & Balances</h1>

          <p>
            Real-time peer debt balancing, personal ledger standing,
            and roommate activity stream.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="report-header-btn"
            onClick={() => handleAction("report")}
          >
            <AlertTriangle size={16} />
            <span>Report Room Issue</span>
          </button>

          <button
            className="cash-header-btn"
            onClick={() => handleAction("cash")}
          >
            <Plus size={17} />
            <span>+ Add Cash Expense</span>
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="summary-grid">

        {/* NET BALANCE */}
        <article className="summary-card balance-card">
          <div className="card-heading">
            <div className="card-title">
              <span className="summary-icon teal">
                <Wallet size={17} />
              </span>
              <h3>Net Peer Balance</h3>
            </div>

            <span className="credit-badge">
              Net Creditor (+Rs 42.50)
            </span>
          </div>

          <div className="balance-columns">
            <div className="balance-box owe-box">
              <span>YOU OWE</span>
              <h2>Rs 42.50</h2>
              <p>To Alex Rivera</p>
              <small>(Oct 28 LESCO split, 1 unsettled liability)</small>
            </div>

            <div className="balance-box owed-box">
              <span>YOU ARE OWED</span>
              <h2>Rs 85.00</h2>
              <p>From Ali Khan & Daniyal</p>
              <small>(Groceries payback)</small>
            </div>
          </div>

          <div className="balance-footer">
            <span>
              <CheckCircle2 size={13} />
              Balance Standing: Settled & Clear
            </span>
            <span>Active Sync</span>
          </div>

          <div className="balance-progress">
            <div></div>
          </div>
        </article>

        {/* MONTHLY SHARE */}
        <article className="summary-card monthly-card">
          <div className="card-heading">
            <div className="card-title">
              <span className="summary-icon blue">
                <CircleDollarSign size={17} />
              </span>
              <h3>My October Share</h3>
            </div>

            <span className="bill-label">Billed to Date</span>
          </div>

          <div className="monthly-total">
            <h2>Rs 287.50</h2>
            <span>/ 31 Days Cycle</span>
          </div>

          <div className="expense-list">
            <div>
              <span className="expense-dot green"></span>
              <span>Shared Mess / Dining</span>
              <strong>Rs 132.83</strong>
            </div>

            <div>
              <span className="expense-dot orange"></span>
              <span>Prorated Electric (Ensuite AC)</span>
              <strong>Rs 74.67</strong>
            </div>

            <div>
              <span className="expense-dot purple"></span>
              <span>Geyser Thermostat Repair</span>
              <strong>Rs 40.00</strong>
            </div>

            <div>
              <span className="expense-dot blue"></span>
              <span>Fixed Fiber Wi-Fi & RO Water</span>
              <strong>Rs 40.00</strong>
            </div>
          </div>

          <div className="monthly-footer">
            <span>Split rule: Custom ensuite weight</span>

            <button onClick={() => handleAction("ledger")}>
              Ledger <ArrowRight size={13} />
            </button>
          </div>
        </article>

        {/* NEXT BILL */}
        <article className="summary-card deadline-card">
          <div className="card-heading">
            <div className="card-title">
              <span className="summary-icon orange">
                <CalendarDays size={17} />
              </span>
              <h3>Next Bill Deadline</h3>
            </div>

            <span className="deadline-badge">
              <Clock3 size={12} /> 3 Days Left
            </span>
          </div>

          <h2 className="deadline-date">Nov 03, 2024</h2>

          <p className="deadline-description">
            LESCO Electricity bill clearance scheduled by Room Admin.
          </p>

          <div className="deadline-status">
            <span>●</span>
            Status: Pending Transfer
            <strong>Rs 42.50 remaining</strong>
          </div>

          <button
            className="raast-button"
            onClick={() => handleAction("raast")}
          >
            <Zap size={14} fill="currentColor" />
            Clear Dues via Raast
          </button>
        </article>

      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions">
        {quickActions.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              className="quick-action"
              key={index}
              onClick={() => handleAction(item.title)}
            >
              <span className={`quick-icon ${item.color}`}>
                <Icon size={19} />
              </span>

              <span className="quick-content">
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </span>
            </button>
          );
        })}
      </section>

      {/* LOWER CONTENT */}
      <section className="dashboard-bottom">

        {/* ACTIVITY */}
        <div className="activity-section">

          <div className="section-header">
            <div>
              <h2>Room Activity & Approvals</h2>
              <p>Live audit log for Room 402 co-residents</p>
            </div>

            <div className="activity-filters">
              <button className="filter-active">All Activity</button>
              <button>Pending <span></span></button>
              <button>Settled</button>
            </div>
          </div>

          <div className="activity-list">
            {activities.map((item, index) => {
              const Icon = item.icon;

              return (
                <article className="activity-card" key={index}>

                  <div className="activity-top">
                    <span className={`activity-avatar ${item.type}`}>
                      {item.initials}
                    </span>

                    <div className="activity-person">
                      <div className="activity-name-row">
                        <strong>{item.name}</strong>
                        <span className={`activity-tag ${item.type}`}>
                          {item.tag}
                        </span>
                      </div>

                      <small>{item.time}</small>
                    </div>

                    <div className="activity-amount">
                      <strong>{item.amount}</strong>
                      <small>{item.description}</small>
                    </div>
                  </div>

                  <div className="activity-bill">
                    <Icon size={15} />
                    <span>{item.bill}</span>
                    <span className="activity-detail">
                      • {item.details}
                    </span>

                    {item.type === "pending" && (
                      <button
                        className="view-bill"
                        onClick={() => handleAction("view-bill")}
                      >
                        <Eye size={13} />
                        View PDF Bill
                      </button>
                    )}
                  </div>

                  {item.type === "pending" && (
                    <div className="activity-buttons">
                      <button
                        className="approve-button"
                        onClick={() => handleAction("approve")}
                      >
                        <CheckCircle2 size={13} />
                        Approve (Rs 74.67)
                      </button>

                      <button
                        className="dispute-button"
                        onClick={() => handleAction("dispute")}
                      >
                        Dispute Split
                      </button>
                    </div>
                  )}

                </article>
              );
            })}
          </div>
        </div>

        {/* PEER BALANCES */}
        <div className="peer-section">

          <div className="section-header">
            <div>
              <h2>Direct Peer Balances</h2>
              <p>Individual Roommate Net Matrix</p>
            </div>

            <button
              className="full-hub"
              onClick={() => handleAction("settlement")}
            >
              Full Hub <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="peer-list">
            {peers.map((peer, index) => (
              <div className="peer-card" key={index}>

                <span className={`peer-avatar ${peer.color}`}>
                  {peer.initials}
                </span>

                <div className="peer-details">
                  <strong>{peer.name}</strong>

                  <small className={peer.type}>
                    {peer.amount}
                  </small>
                </div>

                <button
                  className={`peer-action ${peer.type}`}
                  onClick={() => handleAction(peer.action)}
                >
                  {peer.type === "owed" && peer.name === "Ali Khan" && (
                    <MessageSquare size={12} />
                  )}
                  {peer.action}
                </button>

              </div>
            ))}
          </div>

        </div>

      </section>

    </div>
  );
}