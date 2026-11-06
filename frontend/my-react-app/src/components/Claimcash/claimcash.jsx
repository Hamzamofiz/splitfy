import {
  Bell,
  Building2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  Grid2X2,
  Info,
  Landmark,
  MapPin,
  Receipt,
  Settings,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";

import "./App.css";

const navigation = [
  { icon: Grid2X2, label: "Dashboard & Dues" },
  { icon: Receipt, label: "Monthly Invoice" },
  { icon: Settings, label: "Payment Receipts Vault" },
  { icon: CreditCard, label: "Claim Cash Payment", active: true },
  { icon: FileCheck2, label: "Rent Extension" },
  { icon: FileText, label: "Digital Lease Vault" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand">
          Splitfy <span>Teal</span>
        </div>
        <div className="splitfy-mark">
          Splitfy
          <span>MODE</span>
        </div>
      </div>

      <div className="unit-selector">
        <div className="unit-label">TENANCY UNIT</div>
        <div className="unit-value">
          <span>Sunset Heights — Apt 402</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <nav className="nav-list">
        {navigation.map(({ icon: Icon, label, active }) => (
          <a className={`nav-item ${active ? "active" : ""}`} href="#" key={label}>
            <Icon size={15} strokeWidth={2.4} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="landlord-card">
        <div className="landlord-icon">
          <Building2 size={17} />
        </div>
        <div>
          <strong>Landlord Contact</strong>
          <span>Malik Tariq</span>
          <span>Sunset Real Estate OS</span>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-context">
        <span className="context-pill">
          <i className="dot" />
          Sunset Heights — Apt 402
          <b>•</b>
          <span className="teal-text">ACTIVE TENANCY</span>
        </span>
        <span className="context-pill cycle-pill">
          <CalendarDays size={13} />
          Cycle: November 2024
        </span>
      </div>

      <div className="topbar-actions">
        <button className="claim-button">
          <span>＋</span> Claim Payment
        </button>
        <button className="icon-button notification" aria-label="Notifications">
          <Bell size={17} />
          <span className="notification-count">2</span>
        </button>
        <div className="profile">
          <div className="profile-avatar">
            <UserRound size={16} />
          </div>
          <div>
            <strong>Hamza Tariq</strong>
            <span>Primary Tenant</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function VerificationBanner() {
  return (
    <div className="verification-banner">
      <div className="info-icon">
        <Info size={15} />
      </div>
      <div>
        <strong>Caretaker Physical Custody Verification Protocol</strong>
        <p>
          Logging physical cash payments ensures your tenancy ledger remains
          dispute-free. The landlord and building caretaker will be alerted
          immediately to verify physical custody in the building lockbox. A
          provisional credit marker will appear in your ledger instantly.
        </p>
      </div>
    </div>
  );
}

function UnitCard() {
  return (
    <section className="card unit-card">
      <div className="card-heading">
        <h2>
          <Building2 size={15} />
          Allocated Tenancy Unit
        </h2>
        <span className="status-pill">
          <CheckCircle2 size={11} /> VERIFIED
        </span>
      </div>

      <div className="unit-summary">
        <div>
          <strong>Sunset Heights — Apt 402</strong>
          <span>Active 12-Month Lease • Floor 4, Tower A</span>
        </div>
        <strong className="reference">Ref: LSE-PK-2024-402</strong>
      </div>

      <div className="amount-labels">
        <span>DISBURSED CASH AMOUNT</span>
        <span>Exact Ledger Total Due</span>
      </div>

      <div className="amount-box">
        <span className="currency-chip">Rs</span>
        <strong>160,000</strong>
        <span className="currency-code">PKR</span>
      </div>

      <p className="helper-text">
        Exact cash sum handed over for November 2024 Rent &amp; Utilities statement.
      </p>
    </section>
  );
}

function RecipientCard() {
  return (
    <section className="card recipient-card">
      <div className="card-heading">
        <h2>
          <UserRound size={15} />
          Designated Handover Recipient
        </h2>
        <span className="muted-label">SELECT CUSTODIAN</span>
      </div>

      <label className="recipient-option selected">
        <input type="radio" name="recipient" defaultChecked />
        <span className="radio-mark" />
        <span className="recipient-copy">
          <span className="recipient-title">
            <strong>Chaudhry Riaz</strong>
            <em className="duty-tag">● ON DUTY</em>
            <em className="recommended-tag">Recommended</em>
          </span>
          <small>
            Building Caretaker &amp; Keyholder • Gate 1 Desk (Custodian of
            Physical Lockbox)
          </small>
        </span>
      </label>

      <label className="recipient-option">
        <input type="radio" name="recipient" />
        <span className="radio-mark" />
        <span className="recipient-copy">
          <span className="recipient-title">
            <strong>Malik Tariq</strong>
            <span className="role-label">Owner</span>
          </span>
          <small>Landlord / Portfolio Owner • Direct Handover</small>
        </span>
      </label>

      <label className="recipient-option">
        <input type="radio" name="recipient" />
        <span className="radio-mark" />
        <span className="recipient-copy">
          <span className="recipient-title">
            <strong>Building Management Office Safe</strong>
            <span className="role-label">Automated Drop</span>
          </span>
          <small>Drop Slot SH-04 (Dual Key Escalation)</small>
        </span>
      </label>

      <div className="date-time-row">
        <label>
          <span>HANDOVER DATE</span>
          <div className="input-like">
            <CalendarDays size={14} />
            November 01, 2024
          </div>
        </label>
        <label>
          <span>HANDOVER TIME</span>
          <div className="input-like">
            <span className="clock-icon">◷</span>
            14:20 PKT
          </div>
        </label>
      </div>
    </section>
  );
}

function UploadCard() {
  return (
    <section className="card proof-card">
      <div className="card-heading">
        <h2>
          <ClipboardList size={15} />
          Physical Proof Ingestion
        </h2>
        <span className="ready-pill">OCR READY</span>
      </div>

      <div className="upload-box">
        <div className="upload-icon">
          <Receipt size={19} />
        </div>
        <strong>Upload Photo or Scan Document</strong>
        <p>
          Drop handwritten cash slip, bank withdrawal slip,
          <br />
          or signed paper envelope
        </p>
        <div className="upload-actions">
          <button>
            <Upload size={13} />
            Select File
          </button>
          <button>
            <Camera size={13} />
            Camera Snap
          </button>
        </div>
      </div>

      <div className="file-card">
        <div className="file-heading">
          <span>
            <FileText size={14} />
            <strong>Caretaker_Receipt_3748.jpg</strong>
            <small>1.8 MB</small>
          </span>
          <button aria-label="Remove file">
            <X size={14} />
          </button>
        </div>

        <div className="receipt-preview">
          <div className="receipt-top">
            <strong>
              SUNSET HEIGHTS
              <br />
              RESIDENCY
              <small>Gate 1 Caretaker Cash Slip</small>
            </strong>
            <span>
              <b>SLIP #3748</b>
              <small>Date: 01-Nov-2024</small>
            </span>
          </div>

          <div className="receipt-details">
            <div>
              Property &amp; Unit: <strong>Sunset Heights Apt 402</strong>
            </div>
            <div>
              Received Amount: <strong className="green-text">Rs 160,000 PKR</strong>
            </div>
            <div>
              Received By: <strong>Chaudhry Riaz (Caretaker)</strong>
            </div>
          </div>

          <div className="receipt-signoff">
            <span>✎ &nbsp;Caretaker Signed &amp; Stamped</span>
            <b>VERIFIED 01-NOV</b>
          </div>
        </div>

        <div className="ocr-result">
          <CheckCircle2 size={14} />
          <div>
            <strong>OPTICAL ENGINE VERIFIED</strong>
            <p>
              OCR detected Receipt #3748. Amount <b>Rs 160,000</b> perfectly
              matched the input value.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="page-content">
          <div className="eyebrow">
            <span className="eyebrow-active">● PAYMENT VERIFICATION • TENANCY APT 402</span>
            <span className="eyebrow-divider">•</span>
            <span>SEC-TX-8841</span>
          </div>

          <div className="page-title-row">
            <div>
              <h1>Claim Physical Cash Payment</h1>
              <p className="page-description">
                Logging physical handovers records an immediate timestamped
                verification ticket. Caretaker and landlord are dispatched an
                immediate WhatsApp &amp; ledger prompt.
              </p>
            </div>

            <div className="protocol-badge">
              <div>
                <ShieldCheck size={17} />
              </div>
              <span>
                VERIFICATION
                <strong>PROTOCOL</strong>
                <b>Dual-Party Stamped</b>
              </span>
            </div>
          </div>

          <VerificationBanner />

          <div className="content-grid">
            <div className="left-column">
              <UnitCard />
              <RecipientCard />
            </div>
            <div className="right-column">
              <UploadCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;