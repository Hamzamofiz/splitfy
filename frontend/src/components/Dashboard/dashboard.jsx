import "./dashboard.css";

function Icon({ name, size = 16 }) {
  const paths = {
    building: (
      <>
        <path d="M4 20V5l8-3v18" />
        <path d="M12 8h8v12" />
        <path d="M2 20h20" />
        <path d="M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    receipt: (
      <>
        <path d="M5 3h14v18l-3-2-4 2-4-2-3 2z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    lightning: <path d="m13 2-9 12h7l-1 8 10-13h-7z" />,
    wifi: (
      <>
        <path d="M3 9a14 14 0 0 1 18 0" />
        <path d="M6 12a9 9 0 0 1 12 0" />
        <path d="M9 15a5 5 0 0 1 6 0" />
        <path d="M12 19h.01" />
      </>
    ),
    water: (
      <path d="M12 3s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12z" />
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5M4 21h16" />
      </>
    ),
    qr: (
      <>
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
        <path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  };

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function RentItem({ icon, title, detail, amount, accent }) {
  return (
    <div className="rent-item">
      <span className={`item-icon ${accent || ""}`}>
        <Icon name={icon} size={15} />
      </span>

      <div className="item-copy">
        <div className="item-title">{title}</div>
        <div className="item-detail">{detail}</div>
      </div>

      <strong className="item-amount">{amount}</strong>
    </div>
  );
}

function App() {
  return (
    <div className="app-shell">


      <main className="dashboard">
        <section className="welcome-row">
          <div className="welcome-copy">
            <div className="property-label">
              <span>SUNSET HEIGHTS RESIDENCES</span>
              <i>•</i>
              <small>APT 402</small>
            </div>

            <h1>Welcome back, Hamza</h1>
            <div className="billing-row">
              <span>Billing Cycle: November 01 – November 30, 2024</span>
              <span className="ledger-note">Auto-generated ledger active</span>
            </div>
          </div>

          <div className="status-stack">
            <div className="status-card due-status">
              <span className="status-icon">!</span>
              <div>
                <small>PAYMENT DUE</small>
                <strong>Due in 4 Days (Nov 05)</strong>
              </div>
            </div>

            <div className="status-card lease-status">
              <span className="status-icon">
                <Icon name="check" size={14} />
              </span>
              <div>
                <small>LEASE STATUS</small>
                <strong>NADRA E-Verified</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <article className="statement-card">
            <div className="statement-heading">
              <div className="statement-title">
                <span className="heading-icon">
                  <Icon name="receipt" size={17} />
                </span>
                <strong>NOVEMBER STATEMENT</strong>
              </div>
              <span className="pending-badge">
                <span /> Payment Pending
              </span>
            </div>

            <div className="total-row">
              <strong className="total-amount">Rs 160,000</strong>
              <span className="payable-label">PKR PAYABLE</span>
            </div>

            <p className="invoice-line">
              Invoice #SH-402-2024-11 <span>•</span> Generated Oct 31, 2024{" "}
              <span>•</span> Verified by Sunset Escrow
            </p>

            <div className="rent-breakdown">
              <div className="breakdown-labels">
                <span>
                  <i className="legend-dot rent-dot" />
                  Base Rent: Rs 120,000 (75%)
                </span>
                <span>
                  <i className="legend-dot utility-dot" />
                  Utilities &amp; Sub-Meters: Rs 40,000 (25%)
                </span>
              </div>
              <div className="breakdown-bar">
                <span />
              </div>
            </div>

            <div className="rent-items">
              <RentItem
                icon="building"
                title="Base Apartment Rent"
                detail="Fixed contractual unit charge"
                amount="Rs 120,000"
                accent="teal"
              />
              <RentItem
                icon="lightning"
                title="Sub-Meter Electricity (412 kWh)"
                detail="Oct Reading: 12,410 → 12,822 kWh @ Rs 67.96"
                amount="Rs 28,000"
                accent="orange"
              />
              <RentItem
                icon="water"
                title="Water Tanker Apportionment"
                detail="Share of 3 supplementary private bowers"
                amount="Rs 6,000"
                accent="blue"
              />
              <RentItem
                icon="wifi"
                title="Dedicated Fiber Internet"
                detail="50 Mbps StormFiber Syndicate Link"
                amount="Rs 3,500"
                accent="purple"
              />
              <RentItem
                icon="receipt"
                title="Building Surcharge &amp; Common Fund"
                detail="Security, standby generator diesel pool"
                amount="Rs 2,500"
                accent="orange"
              />
            </div>

            <div className="statement-footer">
              <a href="#invoice">
                Download Itemized Sales Tax Invoice
                <br />
                (FBR Verified)
              </a>
              <span className="due-date">
                <Icon name="download" size={12} />
                <span>
                  DUE BY 05 NOV
                  <br />
                  2024
                </span>
              </span>
            </div>
          </article>

          <aside className="gateway-card">
            <div className="gateway-heading">
              <span className="gateway-bank-icon">
                <Icon name="building" size={17} />
              </span>
              <div>
                <span className="gateway-eyebrow">SETTLEMENT GATEWAY</span>
                <div className="bank-name">Meezan Bank Raast Transfer</div>
              </div>
              <span className="instant-badge">
                <Icon name="lightning" size={12} />
                Instant
              </span>
            </div>

            <p className="gateway-description">
              Send rent directly through any Pakistani banking app using Raast
              ID or direct IBAN settlement without processing charges.
            </p>

            <div className="bank-detail">
              <div>
                <span className="detail-label">ACCOUNT TITLE</span>
                <strong>Sunset Heights Escrow Ledger</strong>
              </div>
              <span className="escrow-tag">Escrow</span>
            </div>

            <div className="bank-detail">
              <div>
                <span className="detail-label">RAAST ID / DIRECT MOBILE</span>
                <strong>0300 555 0192</strong>
              </div>
              <button className="copy-button">
                <Icon name="copy" size={12} />
                Copy
              </button>
            </div>

            <div className="bank-detail iban-detail">
              <div>
                <span className="detail-label">IBAN NUMBER (MEEZAN BANK)</span>
                <strong>PK48 MEZN 0012 3456 7890 1201</strong>
              </div>
              <button className="copy-button">
                <Icon name="copy" size={12} />
                Copy
              </button>
            </div>

            <div className="gateway-actions">
              <button className="pay-button">
                <Icon name="qr" size={14} />
                Pay Rent Now &amp; Scan Raast QR
              </button>
              <button className="cash-button">
                <span className="cash-icon">▣</span>
                Claim Cash Payment to Caretaker
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;