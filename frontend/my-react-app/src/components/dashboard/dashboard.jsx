
import { useState } from "react";
import {
  BadgeDollarSign,
  Bell,
  Building2,
  CalendarDays,
  Check,
  Copy,
  Droplets,
  FileDown,
  Landmark,
  ReceiptText,
  ShieldCheck,
  WalletCards,
  Wifi,
  Zap,
  QrCode,
} from "lucide-react";

import "./dashboard.css";

const invoiceItems = [
  {
    icon: Building2,
    title: "Base Apartment Rent",
    description: "Fixed contractual unit charge",
    amount: "Rs 120,000",
    color: "teal",
  },
  {
    icon: Zap,
    title: "Sub-Meter Electricity (412 kWh)",
    description: "Oct Reading: 12,410 → 12,822 kWh @ Rs 67.96",
    amount: "Rs 28,000",
    color: "amber",
  },
  {
    icon: Droplets,
    title: "Water Tanker Apportionment",
    description: "Share of 3 supplementary private bowsers",
    amount: "Rs 6,000",
    color: "blue",
  },
  {
    icon: Wifi,
    title: "Dedicated Fiber Internet",
    description: "50 Mbps StormFiber Syndicate Link",
    amount: "Rs 3,500",
    color: "blue",
  },
  {
    icon: ReceiptText,
    title: "Building Surcharge & Common Fund",
    description: "Security, standby generator diesel pool",
    amount: "Rs 2,500",
    color: "amber",
  },
];

function Dashboard({ onNavigate }) {
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");

  const copyToClipboard = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      setNotice("Copy is not available in this browser.");
      window.setTimeout(() => setNotice(""), 2500);
    }
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  return (
    <div className="dashboard-view">

      {/* Top Header */}
      <header className="topbar">

        <div className="topbar-tags">
          <span className="top-tag property-tag">
            <span className="tag-dot" />
            Sunset Heights — Apt 402
            <i />
            <strong>ACTIVE TENANCY</strong>
          </span>

          <span className="top-tag cycle-tag">
            <CalendarDays size={13} />
            Cycle: November 2024
          </span>
        </div>

        <div className="topbar-actions">

          <button
            className="claim-button"
            onClick={() => onNavigate?.("claim")}
          >
            <span>+</span> Claim Payment
          </button>

          <button
            className="notification-button"
            aria-label="Notifications"
            onClick={() => showNotice("You're all caught up.")}
          >
            <Bell size={18} />
            <span className="notification-count">2</span>
          </button>

          <div className="user-profile">
            <div className="avatar">H</div>

            <div className="user-copy">
              <strong>Hamza Tariq</strong>
              <span>Primary Tenant</span>
            </div>
          </div>

        </div>
      </header>

      {/* Dashboard Content */}
      <div className="page-content">

        {/* Welcome Section */}
        <section className="welcome-section">

          <div className="eyebrow">
            <span className="property-chip">
              SUNSET HEIGHTS RESIDENCES
            </span>

            <span className="eyebrow-divider">•</span>

            <span>APT 402</span>
          </div>

          <div className="welcome-heading-row">
            <div>
              <h1>Welcome back, Hamza</h1>

              <p>
                Billing Cycle: November 01 – November
                <br className="mobile-break" /> 30, 2024
              </p>
            </div>

            <span className="ledger-status">
              Auto-generated ledger
              <br />
              active
            </span>
          </div>

        </section>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">

          {/* Invoice Section */}
          <section className="invoice-card">

            <div className="invoice-header">

              <div className="invoice-title">
                <span className="invoice-title-icon">
                  <ReceiptText size={16} />
                </span>

                <strong>NOVEMBER STATEMENT</strong>
              </div>

              <span className="payment-pending">
                <span />
                Payment Pending
              </span>

            </div>

            <div className="total-row">
              <strong>Rs 160,000</strong>
              <span>PKR PAYABLE</span>
            </div>

            <p className="invoice-meta">
              Invoice #SH-402-2024-11
              <span>•</span>
              Generated Oct 31, 2024
              <span>•</span>
              Verified by Sunset Escrow
            </p>

            {/* Rent Breakdown */}
            <div className="breakdown-card">

              <div className="breakdown-labels">

                <div>
                  <span className="legend-dot rent-dot" />

                  <span>
                    Base Rent: Rs 120,000
                    <br />
                    <strong>(75%)</strong>
                  </span>
                </div>

                <div>
                  <span className="legend-dot utilities-dot" />

                  <span>
                    Utilities &amp; Sub-Meters: Rs
                    <br />
                    <strong>40,000 (25%)</strong>
                  </span>
                </div>

              </div>

              <div className="progress-track">
                <span className="progress-rent" />
                <span className="progress-utilities" />
              </div>

            </div>

            {/* Invoice Items */}
            <div className="line-items">

              {invoiceItems.map(
                ({ icon: Icon, title, description, amount, color }) => (
                  <div className="line-item" key={title}>

                    <Icon
                      className={`line-icon ${color}`}
                      size={16}
                    />

                    <div className="line-copy">
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </div>

                    <strong className="line-amount">
                      {amount}
                    </strong>

                  </div>
                )
              )}

            </div>

            {/* Invoice Footer */}
            <div className="invoice-footer">

              <button
                className="tax-link"
                onClick={() =>
                  showNotice("Your tax invoice is being prepared.")
                }
              >
                <span>Download Itemized Sales Tax Invoice</span>
                <strong>(FBR Verified)</strong>
                <FileDown size={14} />
              </button>

              <div className="due-date">
                <span>↓</span>

                <div>
                  DUE BY 05 NOV
                  <br />
                  2024
                </div>
              </div>

            </div>

          </section>

          {/* Right Column */}
          <aside className="right-column">

            {/* Status Cards */}
            <div className="status-stack">

              <div className="status-card due-card">
                <Bell size={16} />

                <div>
                  <span>PAYMENT DUE</span>
                  <strong>Due in 4 Days (Nov 05)</strong>
                </div>
              </div>

              <div className="status-card lease-card">
                <ShieldCheck size={17} />

                <div>
                  <span>LEASE STATUS</span>
                  <strong>NADRA E-Verified</strong>
                </div>
              </div>

            </div>

            {/* Settlement Gateway */}
            <section className="gateway-card">

              <div className="gateway-heading">
                <span>SETTLEMENT GATEWAY</span>
              </div>

              <div className="bank-name-row">
                <Landmark size={18} />

                <strong>
                  Meezan Bank Raast
                  <br />
                  Transfer
                </strong>

                <span className="instant-pill">
                  <Zap size={12} />
                  Instant
                </span>
              </div>

              <p className="gateway-description">
                Send rent directly through any Pakistani banking app
                using Raast ID or direct IBAN settlement without
                processing charges.
              </p>

              {/* Account Details */}
              <div className="bank-detail account-detail">

                <div>
                  <span>ACCOUNT TITLE</span>
                  <strong>Sunset Heights Escrow Ledger</strong>
                </div>

                <span className="escrow-pill">Escrow</span>

              </div>

              {/* Raast ID */}
              <div className="bank-detail">

                <div>
                  <span>RAAST ID / DIRECT MOBILE</span>
                  <strong>0300 555 0192</strong>
                </div>

                <button
                  className="copy-button"
                  onClick={() =>
                    copyToClipboard("03005550192", "mobile")
                  }
                >
                  {copied === "mobile" ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}

                  {copied === "mobile" ? "Copied" : "Copy"}
                </button>

              </div>

              {/* IBAN */}
              <div className="bank-detail iban-detail">

                <div>
                  <span>IBAN NUMBER (MEEZAN BANK)</span>
                  <strong>PK48 MEZN 0012 3456 7890 1201</strong>
                </div>

                <button
                  className="copy-button"
                  onClick={() =>
                    copyToClipboard(
                      "PK48MEZN0012345678901201",
                      "iban"
                    )
                  }
                >
                  {copied === "iban" ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}

                  {copied === "iban" ? "Copied" : "Copy"}
                </button>

              </div>

              {/* Payment Actions */}
              <div className="gateway-actions">

                <button
                  className="pay-button"
                  onClick={() =>
                    showNotice("Opening Raast payment options…")
                  }
                >
                  <QrCode size={15} />
                  Pay Rent Now &amp; Scan Raast QR
                </button>

                <button
                  className="cash-button"
                  onClick={() => onNavigate?.("claim")}
                >
                  <WalletCards size={15} />
                  Claim Cash Payment to Caretaker
                </button>

              </div>

            </section>

          </aside>

        </div>
      </div>

      {/* Notification Toast */}
      {notice && (
        <div className="toast">
          {notice}
        </div>
      )}

    </div>
  );
}

export default Dashboard;
