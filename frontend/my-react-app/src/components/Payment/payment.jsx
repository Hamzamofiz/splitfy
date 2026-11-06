import {
  Award,
  Banknote,
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Download,
  FileClock,
  FileSpreadsheet,
  FolderLock,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  ReceiptText,
  Search,
  ShieldCheck,
  WalletCards,
  ArrowLeftRight,
  QrCode,
} from "lucide-react";
import "./App.css";

const navItems = [
  { label: "Dashboard & Dues", icon: LayoutDashboard },
  { label: "Monthly Invoice", icon: ReceiptText },
  { label: "Payment Receipts Vault", icon: ShieldCheck, active: true },
  { label: "Claim Cash Payment", icon: Banknote },
  { label: "Rent Extension", icon: FileClock },
  { label: "Digital Lease Vault", icon: FolderLock },
];

const rows = [
  {
    month: "October 2024",
    date: "Cleared Oct 02, 2024",
    invoice: "#INV-2024-OCT-402",
    method: "Raast Transfer",
    detail: "Ref: RST-OCT-998124",
    amount: "160,000",
    status: "Verified",
    proof: "Meezan Direct Match",
  },
  {
    month: "September 2024",
    date: "Cleared Sep 03, 2024",
    invoice: "#INV-2024-SEP-402",
    method: "Physical Cash Handover",
    detail: "Caretaker Chaudhry signed",
    amount: "158,500",
    status: "Cash Banked",
    proof: "Safe Box #SH-04 Entry",
  },
  {
    month: "August 2024",
    date: "Cleared Aug 01, 2024",
    invoice: "#INV-2024-AUG-402",
    method: "Raast Transfer",
    detail: "Ref: RST-AUG-772106",
    amount: "155,000",
    status: "Verified",
    proof: "Meezan Direct Match",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand">
          <span>Splitfy</span>
          <span className="brand-teal">Teal</span>
        </div>
        <div className="mode-badge">MODE</div>
      </div>

      <div className="unit-label">TENANCY UNIT</div>
      <button className="unit-select">
        <span>
          <strong>Sunset Heights — Apt 402</strong>
          <small>12 Mo Lease</small>
        </span>
        <ChevronDown size={14} />
      </button>

      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon, active }) => (
          <a
            className={`nav-link ${active ? "active" : ""}`}
            href="#"
            key={label}
          >
            <Icon size={15} strokeWidth={2.2} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="landlord-card">
        <div className="landlord-icon">
          <Building2 size={16} />
        </div>
        <div>
          <small>Landlord Contact</small>
          <strong>Malik Tariq</strong>
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
          <i className="online-dot" />
          Sunset Heights — Apt 402
          <b>• ACTIVE TENANCY</b>
        </span>
        <span className="context-pill cycle-pill">
          <FileClock size={12} />
          Cycle: November 2024
        </span>
      </div>

      <div className="topbar-actions">
        <button className="claim-button">
          <span>+</span> Claim Payment
        </button>
        <button className="icon-button notification" aria-label="Notifications">
          <Bell size={16} />
          <i>2</i>
        </button>
        <div className="profile">
          <div className="avatar">HT</div>
          <div>
            <strong>Hamza Tariq</strong>
            <small>Primary Tenant</small>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ label, icon: Icon, children, className = "" }) {
  return (
    <section className={`metric-card ${className}`}>
      <div className="metric-label">
        <span>{label}</span>
        <span className="metric-icon">
          <Icon size={14} />
        </span>
      </div>
      {children}
    </section>
  );
}

function LedgerTable() {
  return (
    <section className="ledger panel">
      <div className="panel-heading">
        <div className="heading-left">
          <FileSpreadsheet size={16} className="teal-icon" />
          <h2>Reconciled Tenancy Ledger</h2>
          <span className="lease-tag">Active Lease 2024</span>
        </div>
        <span className="tracked">11 Total Cycles Tracked</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cycle &amp;<br />Month</th>
              <th>Invoice Ref</th>
              <th>Payment<br />Method &amp; Rail</th>
              <th>Amount<br />Paid (PKR)</th>
              <th>Status</th>
              <th>Proof</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month}>
                <td>
                  <strong>{row.month}</strong>
                  <small>{row.date}</small>
                </td>
                <td><a className="invoice-link" href="#">{row.invoice}</a></td>
                <td>
                  <div className="method-cell">
                    <span className="method-icon">
                      {row.method.includes("Cash")
                        ? <WalletCards size={13} />
                        : <ArrowLeftRight size={13} />}
                    </span>
                    <span>
                      <strong>{row.method}</strong>
                      <small>{row.detail}</small>
                    </span>
                  </div>
                </td>
                <td className="amount">Rs {row.amount}</td>
                <td>
                  <span className={`status ${row.status === "Verified" ? "verified" : "banked"}`}>
                    {row.status === "Verified" && <Check size={11} />}
                    {row.status}
                  </span>
                </td>
                <td>
                  <span className="proof">{row.proof}</span>
                  <span className="proof-mini">↗</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function VoucherInspector() {
  return (
    <aside className="voucher panel">
      <div className="voucher-heading">
        <div>
          <ShieldCheck size={16} className="teal-icon" />
          <h2>Voucher Vault<br />Inspector</h2>
        </div>
        <span className="live-stamp">LIVE<br />STAMPED</span>
      </div>

      <div className="voucher-details">
        <div className="detail-row">
          <span>RECEIPT SERIAL NO.</span>
          <strong>#RCT-88492-PK</strong>
        </div>
        <div className="detail-row">
          <span>ASSOCIATED<br />INVOICE</span>
          <a href="#">INV-2024-<br />OCT-402</a>
        </div>
      </div>

      <div className="settlement-box">
        <div><span>Settled Tenancy Dues</span><strong>Rs 145,000</strong></div>
        <div><span>Utility &amp; Maintenance Surcharge</span><strong>Rs 15,000</strong></div>
        <hr />
        <div className="total-row"><span>Total Reconciled</span><strong>Rs 160,000</strong></div>
        <div className="balance-note">Account Balance after Reconciliation <b>Rs 0.00 (Zero Deficit)</b></div>
      </div>

      <div className="proof-card">
        <div className="qr-placeholder"><QrCode size={42} /></div>
        <div>
          <strong>Verified Landlord<br />Settlement Proof</strong>
          <small>Official Rent Receipt Token<br />#RCT-88492-PK · Scanned via Meezan Bank Gateway confirmation.</small>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Topbar />

        <div className="page-content">
          <section className="page-heading">
            <div>
              <div className="breadcrumb">
                <strong>VAULT &amp; LEDGER<br />RECORDS</strong>
                <span>/</span>
                <span>SUNSET HEIGHTS — APT<br />402</span>
              </div>
              <h1>Payment Receipts &amp;<br className="title-break" /> Historical Rent Vault</h1>
              <p>Archived payment proofs, digital settlements,<br className="desktop-break" /> and official landlord-stamped tenancy<br className="desktop-break" /> clearances for Apt 402.</p>
            </div>

            <div className="heading-actions">
              <button className="secondary-button">
                <FileSpreadsheet size={14} />
                Download Fiscal Year Ledger (CSV)
              </button>
              <button className="primary-button">
                <Download size={14} />
                Export All Receipts Bundle (ZIP/PDF)
              </button>
            </div>
          </section>

          <section className="metrics">
            <MetricCard label="TOTAL RENT PAID (YTD)" icon={WalletCards}>
              <strong className="metric-value">Rs 1,735,500</strong>
              <div className="metric-foot">
                <span className="on-time"><Check size={11} /> 100% On-Time Record</span>
                <span className="muted">• 11/11 Cycles</span>
              </div>
            </MetricCard>

            <MetricCard label="ACTIVE SECURITY DEPOSIT" icon={LockKeyhole}>
              <strong className="metric-value">Rs 320,000</strong>
              <span className="metric-sub">Held with Malik Tariq Estates (...</span>
            </MetricCard>

            <MetricCard label="AVERAGE CLEARING TIME" icon={Gauge}>
              <strong className="metric-value">1.2 Hours</strong>
              <div className="metric-foot clearing-foot">
                <span><b>Raast Instant Match &lt; 15 mins</b><br />direct</span>
                <span className="muted">• Zero rejected<br />claims YTD</span>
              </div>
            </MetricCard>

            <MetricCard label="SETTLEMENT RATING" icon={Award}>
              <div className="rating-line">
                <strong className="metric-value">Grade A+</strong>
                <span className="stars">★★★★★</span>
              </div>
              <span className="priority">Priority Lease Extension status unlocked</span>
            </MetricCard>
          </section>

          <section className="filters panel">
            <label className="search-box">
              <Search size={14} />
              <input placeholder="Search by transaction ID, invoice reference..." />
            </label>
            <button className="filter-button">Year: <b>2024 (Current)</b><ChevronDown size={13} /></button>
            <button className="filter-button">Rails: <b>All Methods</b><ChevronDown size={13} /></button>
            <span className="filter-chip"><i /> Verified (5)</span>
            <span className="filter-chip processing">Processing (0)</span>
          </section>

          <div className="records-grid">
            <LedgerTable />
            <VoucherInspector />
          </div>

          <div className="help-note">
            <CircleHelp size={13} />
            Need help with a receipt? Contact your property manager.
          </div>
        </div>
      </main>
    </div>
  );
}