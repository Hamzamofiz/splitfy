
import { useRef, useState } from "react";
import {
  Download,
  Upload,
  Wallet,
  Users,
  Receipt,
  ShieldCheck,
  Search,
  Bell,
  CalendarDays,
  MessageCircle,
  FileText,
  Zap,
  Wifi,
  Droplets,
  Plus,
  X,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Building2,
} from "lucide-react";

import "./dashboard.css";

const initialResidents = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali.khan@campus.edu",
    bed: "402-A",
    amount: 307.58,
    status: "Paid",
    avatar: "AK",
    color: "avatar-blue",
  },
  {
    id: 2,
    name: "Hamza Tariq",
    email: "hamza.t@student.net",
    bed: "402-B",
    amount: 307.58,
    status: "Pending",
    avatar: "HT",
    color: "avatar-orange",
  },
  {
    id: 3,
    name: "Daniyal Ahmed",
    email: "daniyal.a@hostel.io",
    bed: "402-C",
    amount: 307.58,
    status: "Paid",
    avatar: "DA",
    color: "avatar-green",
  },
  {
    id: 4,
    name: "Usman Malik",
    email: "usman.m@student.net",
    bed: "402-D",
    amount: 307.58,
    status: "Paid",
    avatar: "UM",
    color: "avatar-purple",
  },
  {
    id: 5,
    name: "Ahmed Raza",
    email: "ahmed.r@campus.edu",
    bed: "402-E",
    amount: 307.58,
    status: "Paid",
    avatar: "AR",
    color: "avatar-pink",
  },
  {
    id: 6,
    name: "Bilal Ahmed",
    email: "bilal.a@student.net",
    bed: "402-F",
    amount: 307.60,
    status: "Paid",
    avatar: "BA",
    color: "avatar-teal",
  },
];

const initialBills = [
  {
    id: 1,
    title: "IESCO Electricity",
    description: "Consumer #234891002",
    amount: 480,
    due: "Due in 3 days (Nov 3)",
    status: "Pay Direct",
    icon: Zap,
    color: "bill-electric",
  },
  {
    id: 2,
    title: "High-Speed Fiber Net",
    description: "StormFiber 100Mbps",
    amount: 65,
    due: "Due in 6 days (Nov 6)",
    status: "Pay Direct",
    icon: Wifi,
    color: "bill-internet",
  },
  {
    id: 3,
    title: "Drinking Water Tanker",
    description: "AquaPure 1200L",
    amount: 45,
    due: "Due in 8 days (Nov 8)",
    status: "Schedule",
    icon: Droplets,
    color: "bill-water",
  },
];

function formatAmount(amount) {
  return Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Ledger() {
  const [residents, setResidents] = useState(initialResidents);
  const [bills, setBills] = useState(initialBills);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState("");
  const [toast, setToast] = useState("");
  const [collected, setCollected] = useState(1420);
  const [inflowAmount, setInflowAmount] = useState("");
  const [inflowNote, setInflowNote] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newBed, setNewBed] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const fileInput = useRef(null);

  const total = 1845.5;
  const pending = Math.max(total - collected, 0);
  const progress = Math.min((collected / total) * 100, 100);

  const filteredResidents = residents.filter((resident) =>
    `${resident.name} ${resident.email} ${resident.bed}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const exportLedger = () => {
    const rows = [
      ["Roommate", "Email", "Bed Unit", "October Share", "Status"],
      ...residents.map((resident) => [
        resident.name,
        resident.email,
        resident.bed,
        resident.amount,
        resident.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Splitfy-Master-Ledger.csv";
    link.click();

    URL.revokeObjectURL(url);
    showToast("Ledger exported successfully");
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      showToast(`${file.name} selected successfully`);
      event.target.value = "";
    }
  };

  const recordInflow = (event) => {
    event.preventDefault();

    const amount = Number(inflowAmount);

    if (!amount || amount <= 0) {
      showToast("Please enter a valid amount");
      return;
    }

    setCollected((previous) => previous + amount);
    setInflowAmount("");
    setInflowNote("");
    setModal("");
    showToast("Payment recorded successfully");
  };

  const inviteRoommate = (event) => {
    event.preventDefault();

    if (!newName.trim() || !newEmail.trim() || !newBed.trim()) {
      showToast("Please complete all fields");
      return;
    }

    const newResident = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      bed: newBed,
      amount: 307.58,
      status: "Pending",
      avatar: newName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "avatar-blue",
    };

    setResidents((previous) => [...previous, newResident]);
    setNewName("");
    setNewEmail("");
    setNewBed("");
    setModal("");
    showToast("Roommate added successfully");
  };

  const markAsPaid = (id) => {
    const resident = residents.find((item) => item.id === id);

    if (!resident || resident.status === "Paid") return;

    setResidents((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "Paid" } : item
      )
    );

    setCollected((previous) => previous + resident.amount);
    showToast(`${resident.name}'s payment marked as paid`);
  };

  const openReceipt = (resident) => {
    setSelectedResident(resident);
    setModal("receipt");
  };

  const scheduleBill = (bill) => {
    showToast(`${bill.title} payment scheduled`);
  };

  return (
    <div className="ledger-page">
      {/* HEADER */}
      <header className="ledger-header">
        <div className="header-main">
          <div className="billing-meta">
            <span className="billing-badge">ACTIVE BILLING CYCLE</span>
            <span className="date-range">Oct 1 — Oct 31, 2024</span>
            <span className="sync-badge">
              <span className="sync-dot"></span>
              Sync Complete
            </span>
          </div>

          <h1>Hostel Room 402 — Master Ledger</h1>
          <p>
            Track monthly room rent, utility bills, and individual
            roommate shares easily.
          </p>
        </div>

        <div className="header-actions">
          <button className="action-button export-button" onClick={exportLedger}>
            <Download size={15} />
            Export Ledger
          </button>

          <button
            className="action-button upload-button"
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={15} />
            Upload Bill
          </button>

          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            hidden
            onChange={handleUpload}
          />

          <button
            className="action-button inflow-button"
            onClick={() => setModal("inflow")}
          >
            <Wallet size={15} />
            Record Inflow
          </button>

          <button
            className="action-button invite-button"
            onClick={() => setModal("invite")}
          >
            <Users size={15} />
            Invite Roommate
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <section className="summary-grid">
        <article className="summary-card expense-card">
          <div className="card-heading">
            <span>GROUP EXPENSES (OCT)</span>
            <div className="card-icon expense-icon">
              <Receipt size={16} />
            </div>
          </div>

          <h2>Rs {formatAmount(total)}</h2>
          <span className="trend-badge">↑ +12.4%</span>

          <p className="card-description">
            vs Rs 1,642.00 last month
          </p>

          <div className="expense-breakdown">
            <div>
              <span>Utilities</span>
              <strong>Rs 980.00</strong>
            </div>
            <div>
              <span>Maint.</span>
              <strong>Rs 420.00</strong>
            </div>
            <div>
              <span>Supplies</span>
              <strong>Rs 445.50</strong>
            </div>
          </div>
        </article>

        <article className="summary-card collected-card">
          <div className="card-heading">
            <span>TOTAL COLLECTED</span>
            <div className="card-icon collected-icon">
              <Wallet size={16} />
            </div>
          </div>

          <h2>Rs {formatAmount(collected)}</h2>
          <span className="percentage-badge">
            {progress.toFixed(1)}%
          </span>

          <p className="card-description">
            {residents.filter((item) => item.status === "Paid").length} of{" "}
            {residents.length} residents cleared full share
          </p>

          <div className="progress-info">
            <span>Reconciliation target</span>
            <strong>Rs {formatAmount(total)}</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </article>

        <article className="summary-card pending-card">
          <div className="card-heading">
            <span>PENDING RECEIVABLES</span>
            <div className="card-icon pending-icon">
              <Clock size={16} />
            </div>
          </div>

          <h2>Rs {formatAmount(pending)}</h2>
          <span className="deficit-badge">
            {residents.filter((item) => item.status === "Pending").length}{" "}
            Pending
          </span>

          <p className="card-description">
            Outstanding payments awaiting collection
          </p>

          <div className="pending-footer">
            <span>
              <Bell size={13} /> Auto-nudge queued
            </span>
            <button onClick={() => showToast("Reminder feature is ready to connect")}>
              Send All
            </button>
          </div>
        </article>

        <article className="summary-card fund-card">
          <div className="card-heading">
            <span>GROUP EMERGENCY FUND</span>
            <div className="card-icon fund-icon">
              <ShieldCheck size={16} />
            </div>
          </div>

          <h2>Rs 310.00</h2>
          <span className="safe-badge">Safe Tier</span>

          <p className="card-description">
            Covers shared utility gaps without late penalty
          </p>

          <div className="fund-footer">
            <span>Reserve ratio</span>
            <div className="fund-progress">
              <span></span>
            </div>
            <strong>82%</strong>
          </div>
        </article>
      </section>

      {/* MAIN CONTENT */}
      <section className="ledger-content">
        {/* RESIDENT TABLE */}
        <div className="resident-panel">
          <div className="panel-header">
            <div>
              <h2>Resident Ledger &amp; Quota</h2>
              <div className="panel-subtitle">
                Individual utility breakdowns, settlement status, and
                automated WhatsApp payment triggers.
                <span className="active-count">{residents.length} Active</span>
              </div>
            </div>

            <div className="search-box">
              <Search size={15} />
              <input
                type="text"
                placeholder="Filter roommate..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="resident-table">
              <thead>
                <tr>
                  <th>ROOMMATE</th>
                  <th>BED UNIT</th>
                  <th>OCT SHARE</th>
                  <th>STATUS</th>
                  <th>DIRECT ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td>
                      <div className="resident-info">
                        <div className={`resident-avatar ${resident.color}`}>
                          {resident.avatar}
                        </div>
                        <div>
                          <strong>{resident.name}</strong>
                          <span>{resident.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="bed-tag">Bed</span>
                      <span className="bed-number">{resident.bed}</span>
                    </td>

                    <td>
                      <div className="share-amount">
                        <strong>Rs {formatAmount(resident.amount)}</strong>
                        <span>
                          {resident.status === "Paid"
                            ? "Cleared 100%"
                            : "Due in 2 days"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          resident.status === "Paid"
                            ? "status-paid"
                            : "status-pending"
                        }`}
                      >
                        {resident.status === "Paid" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {resident.status}
                      </span>
                    </td>

                    <td>
                      {resident.status === "Paid" ? (
                        <button
                          className="receipt-button"
                          onClick={() => openReceipt(resident)}
                        >
                          <FileText size={13} />
                          Receipt
                        </button>
                      ) : (
                        <button
                          className="whatsapp-button"
                          onClick={() => markAsPaid(resident.id)}
                        >
                          <CheckCircle2 size={13} />
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredResidents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      No roommates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {filteredResidents.length} of {residents.length} residents
            </span>
            <span>October 2024 billing cycle</span>
          </div>
        </div>

        {/* UPCOMING BILLS */}
        <aside className="bills-panel">
          <div className="bills-heading">
            <div>
              <CalendarDays size={18} />
              <h2>Upcoming Bills</h2>
            </div>
            <span>{bills.length} Active</span>
          </div>

          <div className="bill-list">
            {bills.map((bill) => {
              const BillIcon = bill.icon;

              return (
                <article className="bill-card" key={bill.id}>
                  <div className={`bill-icon ${bill.color}`}>
                    <BillIcon size={18} />
                  </div>

                  <div className="bill-details">
                    <strong>{bill.title}</strong>
                    <span>{bill.description}</span>
                    <small>
                      <CalendarDays size={12} />
                      {bill.due}
                    </small>
                  </div>

                  <div className="bill-payment">
                    <strong>Rs {bill.amount.toFixed(2)}</strong>
                    <span>{bill.status}</span>
                    <button onClick={() => scheduleBill(bill)}>
                      {bill.status === "Schedule" ? "Schedule" : "Pay Direct"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            className="view-bills-button"
            onClick={() => showToast("All upcoming bills are displayed")}
          >
            View all bills <ArrowUpRight size={14} />
          </button>
        </aside>
      </section>

      {/* MODALS */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal("")}>
          <div
            className="ledger-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModal("")}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {modal === "inflow" && (
              <>
                <div className="modal-icon">
                  <Wallet size={22} />
                </div>
                <h2>Record Payment</h2>
                <p>Add a payment received from a roommate.</p>

                <form onSubmit={recordInflow}>
                  <label>Payment Amount (Rs)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                    value={inflowAmount}
                    onChange={(event) => setInflowAmount(event.target.value)}
                    required
                  />

                  <label>Payment Note</label>
                  <input
                    type="text"
                    placeholder="e.g. October rent"
                    value={inflowNote}
                    onChange={(event) => setInflowNote(event.target.value)}
                  />

                  <button type="submit" className="modal-submit">
                    Confirm Payment
                  </button>
                </form>
              </>
            )}

            {modal === "invite" && (
              <>
                <div className="modal-icon">
                  <Users size={22} />
                </div>
                <h2>Add Roommate</h2>
                <p>Add a resident to the room ledger.</p>

                <form onSubmit={inviteRoommate}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    required
                  />

                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    required
                  />

                  <label>Bed Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 402-G"
                    value={newBed}
                    onChange={(event) => setNewBed(event.target.value)}
                    required
                  />

                  <button type="submit" className="modal-submit">
                    Add Roommate
                  </button>
                </form>
              </>
            )}

            {modal === "receipt" && selectedResident && (
              <>
                <div className="modal-icon success-modal-icon">
                  <CheckCircle2 size={22} />
                </div>
                <h2>Payment Receipt</h2>
                <p>October 2024 billing record</p>

                <div className="receipt-details">
                  <div>
                    <span>Resident</span>
                    <strong>{selectedResident.name}</strong>
                  </div>
                  <div>
                    <span>Bed Unit</span>
                    <strong>{selectedResident.bed}</strong>
                  </div>
                  <div>
                    <span>Amount Paid</span>
                    <strong>
                      Rs {formatAmount(selectedResident.amount)}
                    </strong>
                  </div>
                  <div>
                    <span>Payment Status</span>
                    <strong className="receipt-success">Verified</strong>
                  </div>
                </div>

                <button
                  className="modal-submit"
                  onClick={() => {
                    setModal("");
                    showToast("Receipt viewed successfully");
                  }}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="ledger-toast">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}
