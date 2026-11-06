
import React, { useState } from "react";
import {
  Wallet,
  CircleDollarSign,
  CalendarClock,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Receipt,
  ScanLine,
  CalendarDays,
  MessageSquare,
  FileWarning,
  Zap,
  Utensils,
  Wrench,
  Wifi,
  Droplet,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Users,
  X,
  Upload,
  Send,
  Bell,
  ArrowRight,
  Check,
  CreditCard,
  TrendingUp,
  ClipboardList,
  Camera,
  CircleHelp
} from "lucide-react";

import "./dashboard.css";

const initialActivities = [
  {
    id: 1,
    initials: "AR",
    name: "Alex Rivera (Admin)",
    time: "1h ago • Monthly Utility Share",
    type: "pending",
    amount: "Rs 74.67",
    subtitle: "Your share",
    title: "Uploaded LESCO Electricity Bill",
    detail: "Total: Rs 480.00 • Your ensuite share: Rs 74.67",
    icon: Receipt,
    action: "View PDF Bill",
    avatar: "orange"
  },
  {
    id: 2,
    initials: "HT",
    name: "You Paid",
    time: "Yesterday • Kitchen Common Pool",
    type: "settled",
    amount: "Rs 125.00",
    subtitle: "4/5 Settled",
    title: "Metro Cash & Carry • Bulk Kitchen Groceries & Spices",
    detail: "Acknowledged by Alex, Zayn, Bilal, & Daniyal. Ali is pending.",
    icon: Utensils,
    avatar: "teal"
  },
  {
    id: 3,
    initials: "ZM",
    name: "Zain Malik",
    time: "2 days ago • Water Supply",
    type: "settled",
    amount: "Rs 45.00",
    subtitle: "Fully settled",
    title: "Emergency Water Tanker Refill",
    detail: "Shared equally across the active residents.",
    icon: Droplet,
    avatar: "blue"
  },
  {
    id: 4,
    initials: "AK",
    name: "Ali Khan",
    time: "3 days ago • Maintenance",
    type: "pending",
    amount: "Rs 40.00",
    subtitle: "Your share",
    title: "Geyser Thermostat Replacement",
    detail: "Awaiting roommate verification.",
    icon: Wrench,
    avatar: "green"
  }
];

const initialBalances = [
  {
    id: 1,
    initials: "AR",
    name: "Alex Rivera",
    description: "You owe Rs 42.50",
    amount: 42.5,
    type: "owe",
    avatar: "orange"
  },
  {
    id: 2,
    initials: "AK",
    name: "Ali Khan",
    description: "Owes you Rs 20.83",
    amount: 20.83,
    type: "owed",
    avatar: "teal"
  },
  {
    id: 3,
    initials: "DA",
    name: "Daniyal Ahmed",
    description: "Owes you Rs 20.83",
    amount: 20.83,
    type: "owed",
    avatar: "blue"
  },
  {
    id: 4,
    initials: "ZM",
    name: "Zayn Malik",
    description: "All settled (Rs 0.00)",
    amount: 0,
    type: "balanced",
    avatar: "purple"
  }
];

function Avatar({ initials, color }) {
  return (
    <div className={`room-avatar ${color}`}>
      {initials}
    </div>
  );
}

function OverviewModal({ type, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    description: "",
    category: "Utilities"
  });

  if (!type) return null;

  const titles = {
    expense: "Add Cash Expense",
    issue: "Report Room Issue",
    absence: "Log Absence",
    payment: "Settle Your Dues",
    dispute: "Dispute Expense",
    reminder: "Send Payment Reminder"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(type, form);
    onClose();
  };

  return (
    <div className="overview-modal-overlay" onClick={onClose}>
      <div
        className="overview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overview-modal-header">
          <div>
            <span className="modal-eyebrow">ROOM 402 • RESIDENT PORTAL</span>
            <h2>{titles[type]}</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {type === "payment" ? (
            <>
              <div className="payment-modal-summary">
                <span>Outstanding peer balance</span>
                <strong>Rs 42.50</strong>
                <small>Payable to Alex Rivera</small>
              </div>

              <label>
                Payment method
                <select defaultValue="Raast">
                  <option>Raast</option>
                  <option>SadaPay</option>
                  <option>NayaPay</option>
                  <option>Bank Transfer</option>
                </select>
              </label>

              <label>
                Transaction reference
                <input
                  placeholder="Enter payment reference"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
            </>
          ) : (
            <>
              <label>
                {type === "absence" ? "Absence date" : "Title"}
                <input
                  required
                  type={type === "absence" ? "date" : "text"}
                  placeholder="Enter details"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </label>

              {type === "expense" && (
                <>
                  <label>
                    Expense category
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option>Utilities</option>
                      <option>Groceries</option>
                      <option>Maintenance</option>
                      <option>Internet</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label>
                    Amount (PKR)
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="e.g. 500"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                    />
                  </label>
                </>
              )}

              <label>
                Additional details
                <textarea
                  rows="3"
                  placeholder="Write a short description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="modal-submit">
              <Check size={14} />
              {type === "payment" ? "Confirm Payment" : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function RoommateOverview() {
  const [activities, setActivities] = useState(initialActivities);
  const [balances, setBalances] = useState(initialBalances);

  const [activeTab, setActiveTab] = useState("All Activity");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  const [receiptFile, setReceiptFile] = useState(null);

  const [absenceDays, setAbsenceDays] = useState(0);

  const [monthShare] = useState(287.50);

  const filteredActivities = activities.filter((item) => {
    if (activeTab === "Pending") return item.type === "pending";
    if (activeTab === "Settled") return item.type === "settled";
    return true;
  });

  const oweAmount = balances
    .filter((item) => item.type === "owe")
    .reduce((sum, item) => sum + item.amount, 0);

  const owedAmount = balances
    .filter((item) => item.type === "owed")
    .reduce((sum, item) => sum + item.amount, 0);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const handleModalSubmit = (type, form) => {
    if (type === "expense") {
      const newActivity = {
        id: Date.now(),
        initials: "ME",
        name: "You Added",
        time: "Just now • " + form.category,
        type: "pending",
        amount: `Rs ${Number(form.amount).toFixed(2)}`,
        subtitle: "Awaiting approval",
        title: form.title,
        detail: form.description || "New room expense submitted.",
        icon: Receipt,
        avatar: "purple"
      };

      setActivities((prev) => [newActivity, ...prev]);
      showNotice("Cash expense added successfully.");
    } else if (type === "payment") {
      setBalances((prev) =>
        prev.map((item) =>
          item.type === "owe"
            ? {
                ...item,
                amount: 0,
                type: "balanced",
                description: "Payment submitted"
              }
            : item
        )
      );

      showNotice("Payment submitted for verification.");
    } else if (type === "dispute") {
      showNotice("Your dispute has been submitted.");
    } else if (type === "reminder") {
      showNotice("Payment reminder prepared.");
    } else if (type === "issue") {
      showNotice("Room issue reported successfully.");
    } else if (type === "absence") {
      setAbsenceDays((prev) => prev + 1);
      showNotice("Absence request submitted.");
    }
  };

  const approveActivity = (id) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, type: "settled", subtitle: "Approved" }
          : item
      )
    );

    showNotice("Expense approved successfully.");
  };

  const disputeActivity = (id) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, type: "disputed", subtitle: "Under review" }
          : item
      )
    );

    showNotice("Expense marked for review.");
  };

  const handleQuickAction = (type) => {
    if (type === "scan") {
      document.getElementById("room-receipt-upload")?.click();
    } else {
      setModal(type);
    }
  };

  const handleReceipt = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setReceiptFile(file.name);
      showNotice(`Receipt selected: ${file.name}`);
    }
  };

  const handlePeerAction = (person) => {
    if (person.type === "owe" && person.amount > 0) {
      setModal("payment");
    } else if (person.type === "owed") {
      showNotice(`Payment reminder prepared for ${person.name}.`);
    } else {
      showNotice("This balance is already settled.");
    }
  };

  const quickActions = [
    {
      icon: Wallet,
      title: "Settle My Dues",
      description: "Raast / SadaPay / NayaPay",
      color: "teal",
      action: "payment"
    },
    {
      icon: ScanLine,
      title: "Scan Receipt",
      description: "Smart OCR receipt split",
      color: "orange",
      action: "scan"
    },
    {
      icon: CalendarDays,
      title: "Log Absence",
      description: "Prorate kitchen & AC days",
      color: "blue",
      action: "absence"
    },
    {
      icon: FileWarning,
      title: "Report Issue",
      description: "AC, geyser or plumbing...",
      color: "red",
      action: "issue"
    }
  ];

  return (
    <div className="room-overview-page">

      {/* HEADER */}

      <header className="room-overview-header">

        <div className="overview-title-area">

          <span className="overview-breadcrumb">
            <span></span>
            ROOM 402 • RESIDENT PORTAL
          </span>

          <h1>Roommate Overview &amp; Balances</h1>

          <p>
            Real-time peer debt balancing, personal ledger standing,
            and roommate activity stream.
          </p>

        </div>

        <div className="overview-header-actions">

          <button
            className="report-room-button"
            onClick={() => setModal("issue")}
          >
            <AlertTriangle size={14} />
            <span>Report Room<br />Issue</span>
          </button>

          <button
            className="add-expense-button"
            onClick={() => setModal("expense")}
          >
            <Plus size={16} />
            <span>+ Add Cash<br />Expense</span>
          </button>

        </div>

      </header>

      {/* TOP FINANCIAL CARDS */}

      <section className="overview-summary-grid">

        {/* NET BALANCE */}

        <div className="overview-card net-balance-card">

          <div className="overview-card-heading">
            <div className="overview-icon teal">
              <Wallet size={15} />
            </div>

            <div>
              <h3>Net Peer Balance</h3>
            </div>

            <span className="net-creditor-badge">
              Net Creditor (+Rs {owedAmount.toFixed(2)})
            </span>
          </div>

          <div className="balance-split">

            <div className="balance-column owe-column">
              <span>YOU OWE</span>
              <strong>Rs {oweAmount.toFixed(2)}</strong>
              <small>To Alex Rivera<br />(Oct 28 LESCO split, 1 unsettled liability)</small>
            </div>

            <div className="balance-column owed-column">
              <span>YOU ARE OWED</span>
              <strong>Rs {owedAmount.toFixed(2)}</strong>
              <small>From Ali Khan &amp; Daniyal (Groceries payback)</small>
            </div>

          </div>

          <div className="balance-card-footer">
            <span>
              <CheckCircle2 size={12} />
              Balance Standing: Settled &amp; Clear
            </span>
            <span>Active Sync</span>
          </div>

          <div className="mini-progress">
            <span></span>
          </div>

        </div>

        {/* MONTHLY SHARE */}

        <div className="overview-card monthly-share-card">

          <div className="overview-card-heading">
            <div className="overview-icon blue">
              <CircleDollarSign size={16} />
            </div>

            <h3>My October Share</h3>

            <span className="billed-date">Billed to Date</span>
          </div>

          <div className="monthly-total">
            Rs {monthShare.toFixed(2)}
            <small>/ 31 Days Cycle</small>
          </div>

          <div className="share-breakdown">

            <div>
              <span className="share-dot green-dot"></span>
              <span>Shared Mess / Dining</span>
              <strong>Rs 132.83</strong>
            </div>

            <div>
              <span className="share-dot orange-dot"></span>
              <span>Prorated Electric (Ensuite AC)</span>
              <strong>Rs 74.67</strong>
            </div>

            <div>
              <span className="share-dot purple-dot"></span>
              <span>Geyser Thermostat Repair</span>
              <strong>Rs 40.00</strong>
            </div>

            <div>
              <span className="share-dot blue-dot"></span>
              <span>Fixed Fiber Wi-Fi &amp; RO Water</span>
              <strong>Rs 40.00</strong>
            </div>

          </div>

          <div className="share-footer">
            <span>Split rule: Custom ensuite weight</span>
            <button onClick={() => showNotice("Opening your personal ledger...")}>
              Ledger <ArrowUpRight size={12} />
            </button>
          </div>

        </div>

        {/* BILL DEADLINE */}

        <div className="overview-card deadline-card">

          <div className="overview-card-heading">
            <div className="overview-icon orange">
              <CalendarClock size={16} />
            </div>

            <h3>Next Bill Deadline</h3>

            <span className="days-badge">
              <Clock3 size={10} />
              3 Days Left
            </span>
          </div>

          <h2>Nov 03, 2024</h2>

          <p>
            LESCO Electricity bill clearance scheduled by Room Admin.
          </p>

          <div className="deadline-status">
            <span>Status: Pending Transfer</span>
            <strong>Rs 42.50 remaining</strong>
          </div>

          <button
            className="raast-button"
            onClick={() => setModal("payment")}
          >
            <Zap size={13} />
            Clear Dues via Raast
          </button>

        </div>

      </section>

      {/* QUICK ACTIONS */}

      <section className="quick-actions-grid">

        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.action}
              className="quick-action-card"
              onClick={() => handleQuickAction(item.action)}
            >
              <div className={`quick-action-icon ${item.color}`}>
                <Icon size={17} />
              </div>

              <div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>

            </button>
          );
        })}

        <input
          id="room-receipt-upload"
          type="file"
          accept="image/*,.pdf"
          hidden
          onChange={handleReceipt}
        />

      </section>

      {receiptFile && (
        <div className="receipt-selected">
          <Receipt size={13} />
          Selected receipt: {receiptFile}
          <button onClick={() => setReceiptFile(null)}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}

      <section className="overview-main-grid">

        {/* ACTIVITY PANEL */}

        <div className="activity-panel">

          <div className="panel-heading">

            <div>
              <h2>Room Activity &amp; Approvals</h2>
              <p>Live audit log for Room 402 co-residents</p>
            </div>

            <div className="activity-tabs">

              {["All Activity", "Pending", "Settled"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Pending" && (
                    <span className="pending-tab-dot"></span>
                  )}
                </button>
              ))}

            </div>

          </div>

          <div className="activity-list">

            {filteredActivities.length > 0 ? (
              filteredActivities.map((item) => {
                const Icon = item.icon;

                return (
                  <article className="activity-item" key={item.id}>

                    <div className="activity-top-row">

                      <Avatar
                        initials={item.initials}
                        color={item.avatar}
                      />

                      <div className="activity-person-info">
                        <div className="activity-name-line">
                          <strong>{item.name}</strong>

                          {item.type === "pending" && (
                            <span className="approval-pending">
                              Pending Your Approval
                            </span>
                          )}

                          {item.type === "settled" && (
                            <span className="approval-settled">
                              <CheckCircle2 size={9} />
                              Settled
                            </span>
                          )}

                          {item.type === "disputed" && (
                            <span className="approval-disputed">
                              Under Review
                            </span>
                          )}
                        </div>

                        <span>{item.time}</span>
                      </div>

                      <div className="activity-amount">
                        <strong>{item.amount}</strong>
                        <span>{item.subtitle}</span>
                      </div>

                    </div>

                    <div className="activity-description">

                      <div className="activity-description-icon">
                        <Icon size={13} />
                      </div>

                      <div className="activity-description-text">
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>

                      {item.action && (
                        <button
                          className="view-pdf-button"
                          onClick={() => showNotice("Opening receipt preview...")}
                        >
                          {item.action}
                          <ArrowUpRight size={10} />
                        </button>
                      )}

                    </div>

                    {item.type === "pending" && (
                      <div className="activity-actions">

                        <button
                          className="approve-button"
                          onClick={() => approveActivity(item.id)}
                        >
                          <Check size={12} />
                          Approve ({item.amount})
                        </button>

                        <button
                          className="dispute-button"
                          onClick={() => disputeActivity(item.id)}
                        >
                          Dispute Split
                        </button>

                      </div>
                    )}

                  </article>
                );
              })
            ) : (
              <div className="activity-empty">
                <ClipboardList size={25} />
                <strong>No activity found</strong>
                <span>There are no {activeTab.toLowerCase()} records.</span>
              </div>
            )}

          </div>

          <button
            className="view-all-activity"
            onClick={() => setActiveTab("All Activity")}
          >
            View All Room Activity
            <ChevronRight size={13} />
          </button>

        </div>

        {/* PEER BALANCE PANEL */}

        <div className="peer-balance-column">

          <div className="peer-balance-panel">

            <div className="panel-heading peer-heading">

              <div>
                <h2>Direct Peer Balances</h2>
                <p>Individual Roommate Net Matrix</p>
              </div>

              <button
                onClick={() => showNotice("Opening full peer balance ledger...")}
              >
                Full Hub <ChevronRight size={12} />
              </button>

            </div>

            <div className="peer-list">

              {balances.map((person) => (
                <div className="peer-item" key={person.id}>

                  <Avatar
                    initials={person.initials}
                    color={person.avatar}
                  />

                  <div className="peer-person-info">
                    <strong>{person.name}</strong>

                    <span className={`peer-description ${person.type}`}>
                      {person.type === "owe" && "You owe "}
                      {person.type === "owed" && "Owes you "}
                      {person.type === "balanced" && ""}
                      {person.type === "balanced"
                        ? person.description
                        : `Rs ${person.amount.toFixed(2)}`}
                    </span>
                  </div>

                  <button
                    className={`peer-action ${person.type}`}
                    onClick={() => handlePeerAction(person)}
                  >
                    {person.type === "owe" && "Pay Raast"}

                    {person.type === "owed" && (
                      <>
                        <MessageSquare size={10} />
                        WhatsApp Ping
                      </>
                    )}

                    {person.type === "balanced" && (
                      <>
                        <Check size={10} />
                        Balanced
                      </>
                    )}

                  </button>

                </div>
              ))}

            </div>

          </div>

          {/* PAYMENT INSIGHTS */}

          <div className="payment-insights-panel">

            <div className="panel-heading">
              <div>
                <h2>Payment Insights</h2>
                <p>Your monthly settlement overview</p>
              </div>

              <div className="overview-icon teal">
                <TrendingUp size={15} />
              </div>
            </div>

            <div className="insight-row">
              <span>Monthly Share</span>
              <strong>Rs 287.50</strong>
            </div>

            <div className="insight-row">
              <span>Amount Owed to You</span>
              <strong className="positive-value">
                Rs {owedAmount.toFixed(2)}
              </strong>
            </div>

            <div className="insight-row">
              <span>Pending Liabilities</span>
              <strong className="negative-value">
                Rs {oweAmount.toFixed(2)}
              </strong>
            </div>

            <div className="insight-footer">
              <ShieldCheck size={12} />
              Ledger synchronized with Room 402
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="overview-footer">
        <span>
          <ShieldCheck size={13} />
          Secure Resident Portal • Room 402
        </span>

        <span>
          <Clock3 size={12} />
          Last updated just now
        </span>
      </footer>

      {/* NOTIFICATION */}

      {notice && (
        <div className="overview-toast">
          <CheckCircle2 size={16} />
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* MODAL */}

      <OverviewModal
        type={modal}
        onClose={() => setModal(null)}
        onSubmit={handleModalSubmit}
      />

    </div>
  );
}
