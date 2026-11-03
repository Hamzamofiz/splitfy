
import React from "react";
import "./payment.css";

const cycles = [
  {
    month: "October 2024",
    date: "Cleared Oct 02, 2024",
    invoice: "#INV-2024-OCT-402",
    method: "Raast Transfer",
    reference: "Ref: RST-OCT-998124",
    amount: "160,000",
    status: "Verified",
    proof: "Meezan Direct Match",
  },
  {
    month: "September 2024",
    date: "Cleared Sep 03, 2024",
    invoice: "#INV-2024-SEP-402",
    method: "Physical Cash Handover",
    reference: "Caretaker Chaudhry Riaz signed",
    amount: "158,500",
    status: "Cash Banked",
    proof: "Safe Box SH-04 Entry",
  },
  {
    month: "August 2024",
    date: "Cleared Aug 01, 2024",
    invoice: "#INV-2024-AUG-402",
    method: "Raast Transfer",
    reference: "Ref: RST-AUG-772190",
    amount: "155,000",
    status: "Verified",
    proof: "Meezan Direct Match",
  },
];

function MetricCard({ label, value, note, icon }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className="icon">{icon}</span>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-note">{note}</div>
    </article>
  );
}

export default function PaymentDashboard() {
  return (
    <main className="dashboard">

      {/* Top Navigation */}

      {/* Page Heading */}
      <section className="page-intro">
        <div className="intro-copy">
          <div className="breadcrumbs">
            <span>VAULT &amp; LEDGER RECORDS</span>
            <i>/</i>
            SUNSET HEIGHTS — APT 402
          </div>

          <h1>
            Payment Receipts &amp;
            <br />
            Historical Rent Vault
          </h1>

          <p>
            Archived payment proofs, digital settlements,
            <br className="desktop-break" />
            and official landlord-stamped tenancy
            <br className="desktop-break" />
            clearances for Apt 402.
          </p>
        </div>

        <div className="intro-actions">
          <button className="outline-button">
            ▤ &nbsp; Download Fiscal Year Ledger (CSV)
          </button>

          <button className="export-button">
            ▣ &nbsp; Export All Receipts Bundle (ZIP/PDF)
          </button>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="metrics-grid">

        <MetricCard
          label="TOTAL RENT PAID (YTD)"
          value={<>Rs<br />1,735,500</>}
          note={
            <>
              <b>◉ 100% On-Time Record</b>
              <span>• 11/11 Cycles</span>
            </>
          }
          icon="▤"
        />

        <MetricCard
          label="ACTIVE SECURITY DEPOSIT"
          value="Rs 320,000"
          note="Held with Malik Tariq Estates (...)"
          icon="♙"
        />

        <MetricCard
          label="AVERAGE CLEARING TIME"
          value="1.2 Hours"
          note={
            <>
              <b>Raast Instant Match &lt; 15 mins direct</b>
              <span>• Zero rejected claims YTD</span>
            </>
          }
          icon="◩"
        />

        <MetricCard
          label="SETTLEMENT RATING"
          value={<>Grade<br />A+</>}
          note={
            <b>Priority Lease Extension status unlocked</b>
          }
          icon="♙"
        />

      </section>

      {/* Search and Filters */}
      <section className="filter-bar">

        <label className="search-box">
          <span>⌕</span>
          <input
            placeholder="Search by transaction ID, invoice reference..."
          />
        </label>

        <button className="filter-button">
          Year: <b>2024 (Current)</b>⌄
        </button>

        <button className="filter-button">
          Rails: <b>All Methods</b>⌄
        </button>

        <button className="filter-button verified-filter">
          ● Verified (5)
        </button>

        <button className="filter-button processing-filter">
          Processing (0)
        </button>

      </section>

      {/* Main Content */}
      <section className="content-grid">

        {/* Ledger Table */}
        <article className="ledger-card">

          <div className="card-heading">
            <div>
              <span className="heading-icon">▤</span>
              <h2>Reconciled Tenancy Ledger</h2>
              <span className="lease-tag">Active Lease 2024</span>
            </div>

            <small>11 Total Cycles Tracked</small>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>CYCLE &amp;<br />MONTH</th>
                  <th>INVOICE REF</th>
                  <th>PAYMENT<br />METHOD &amp; RAIL</th>
                  <th>AMOUNT<br />PAID (PKR)</th>
                  <th>STATUS</th>
                  <th>PROOF</th>
                </tr>
              </thead>

              <tbody>
                {cycles.map((item) => (
                  <tr key={item.month}>

                    <td>
                      <strong>{item.month}</strong>
                      <small>{item.date}</small>
                    </td>

                    <td>
                      <a href="#invoice">{item.invoice}</a>
                    </td>

                    <td>
                      <strong>{item.method}</strong>
                      <small>{item.reference}</small>
                    </td>

                    <td className="amount">
                      Rs {item.amount}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          item.status === "Verified"
                            ? "status-verified"
                            : "status-cash"
                        }`}
                      >
                        {item.status === "Verified" ? "✓ " : "● "}
                        {item.status}
                      </span>
                    </td>

                    <td className="proof">
                      {item.proof}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </article>

        {/* Voucher Inspector */}
        <aside className="inspector-card">

          <div className="inspector-heading">
            <div>
              <span className="shield">♢</span>
              <h2>
                Voucher Vault
                <br />
                Inspector
              </h2>
            </div>

            <span className="live-tag">
              LIVE
              <br />
              STAMPED
            </span>
          </div>

          <div className="receipt-info">

            <div>
              <span>RECEIPT SERIAL NO.</span>
              <strong>#RCT-88492-PK</strong>
            </div>

            <div>
              <span>ASSOCIATED INVOICE</span>
              <strong>#INV-2024-OCT-402</strong>
            </div>

          </div>

          <div className="dues">

            <div>
              <span>Settled Tenancy Dues</span>
              <b>Rs 145,000</b>
            </div>

            <div>
              <span>Utility &amp; Maintenance Surcharge</span>
              <b>Rs 15,000</b>
            </div>

            <div className="total">
              <strong>Total Reconciled</strong>
              <strong>Rs 160,000</strong>
            </div>

            <div>
              <span>Account Balance after Cycle</span>
              <b>Rs 0.00 (Zero Deficit)</b>
            </div>

          </div>

          <div className="verification">

            <div className="qr-code">
              <span>▦</span>
              <span>▥</span>
              <span>▦</span>
              <span>▥</span>
              <span>▦</span>
              <span>▥</span>
              <span>▦</span>
              <span>▥</span>
              <span>▦</span>
            </div>

            <div>
              <strong>
                Verified Landlord Settlement Proof
              </strong>

              <small>
                Official Receipt Token #RCT-88492-PK ·
                Scanned via Meezan Bank Gateway confirmation
              </small>
            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}
