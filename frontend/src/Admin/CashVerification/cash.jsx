
import React, { useState } from "react";
import "./cash.css";

const queueItems = [
  {
    id: 1,
    apartment: "Apt 402",
    title: "3BHK Executive Penthouse",
    tenant: "Hamza Tariq",
    amount: "160,000",
    property: "Sunset Heights",
    status: "Urgent Review",
  },
  {
    id: 2,
    apartment: "Apt 102",
    title: "Studio East",
    tenant: "Bilal Farooq",
    amount: "85,000",
    property: "Sunset Heights",
    status: "Pending Review",
  },
  {
    id: 3,
    apartment: "Apt 304",
    title: "2BHK Executive",
    tenant: "Sarah Jenkins",
    amount: "110,000",
    property: "Elite Residency",
    status: "Pending Review",
  },
];

export default function CashReconciliation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verified, setVerified] = useState(true);
  const [showVoucher, setShowVoucher] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [notification, setNotification] = useState("");

  const current = queueItems[currentIndex];

  const notify = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % queueItems.length);
  };

  const previousItem = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + queueItems.length) % queueItems.length
    );
  };

  return (
    <div className="cash-dashboard">

      {/* HEADER */}
      <header className="cash-header">

        <div className="cash-title-area">
          <div className="cash-breadcrumb">
            <span>● LANDLORD CASH RECONCILIATION</span>
            <b>/</b> SUNSET HEIGHTS MASTER VAULT
          </div>

          <h1>Instant Cash Claim Reconciliation Queue</h1>

          <p>
            Daily cash hand-off verification queue for property caretakers
            and landlords across Pakistani rental portfolios.
          </p>
        </div>

        <div className="daily-reconciled">
          <div className="daily-icon">▣</div>
          <div>
            <label>DAILY CASH RECONCILED</label>
            <h2>Rs 485,000</h2>
            <small>◉ banked today (Sunset Heights)</small>
          </div>
        </div>

      </header>

      {/* QUEUE NAVIGATION */}
      <section className="queue-navigation">

        <div className="queue-priority">
          <b>● Queue Priority: {currentIndex + 1} of 3 Pending</b>
          <span>•</span>
          <small>Apt 402 awaiting ledger clearance</small>
        </div>

        <div className="queue-controls">
          <span>Swipe / Shortcut Keys [1-3]</span>

          <button onClick={previousItem}>‹</button>
          <b>{currentIndex + 1} / 3</b>
          <button onClick={nextItem}>›</button>
        </div>

      </section>

      {/* MAIN LAYOUT */}
      <main className="cash-layout">

        {/* LEFT MAIN COLUMN */}
        <div className="cash-left">

          {/* CLAIM CARD */}
          <section className="claim-card">

            <div className="claim-header">

              <div className="claim-property-icon">▦</div>

              <div className="claim-heading">
                <h2>{current.apartment} – {current.title}</h2>
                <p>{current.property} • F-11/1 Islamabad</p>
              </div>

              <span className="urgent-review">
                {current.status}
              </span>

              <div className="claimed-amount">
                <label>CLAIMED AMOUNT</label>
                <h2>Rs {current.amount}</h2>
                <small>Nov Rent + Sub-meter Electric</small>
              </div>

            </div>

            {/* TENANT AND VAULT */}
            <div className="claim-details-grid">

              <div className="detail-box tenant-detail">
                <div className="detail-icon">HT</div>
                <div>
                  <h3>{current.tenant} <span>Reliability 98.4%</span></h3>
                  <p>Primary Syndicate Leaseholder (14 C...)</p>
                  <small>♧ +92 300 859 4412</small>
                </div>
              </div>

              <div className="detail-box vault-detail">
                <div className="detail-icon lock-icon">▣</div>
                <div>
                  <h3>Vault Box</h3>
                  <b>#SH-04</b>
                  <p>Verified by Custodian Chaudhry Riaz</p>
                  <small>Logged: Box Sealed & Cash Counted</small>
                </div>
                <span className="physical-safe">In Physical Safe</span>
              </div>

            </div>

            {/* CUSTODY VERIFICATION */}
            <div className="custody-box">
              <b>♢ Caretaker Custody Verified</b>
              <p>
                Building Caretaker Chaudhry Riaz logged physical custody
                of cash in the Sunset Heights building master lockbox.
              </p>
            </div>

            {/* VOUCHER SECTION */}
            <div className="voucher-heading">
              <b>▣ Physical Signed Voucher & Caretaker Signature</b>
              <span>● STAMP VALID</span>
            </div>

            <div className="voucher-card">

              <div className="voucher-paper">
                <div className="voucher-brand">
                  <b>SUNSET HEIGHTS RESIDENCY</b>
                  <span>REC-3748</span>
                </div>

                <hr />

                <p>Tenant: Hamza Tariq (Apt 402)</p>
                <p>Sum of: PKR 160,000/-</p>
                <p>In Words: One Hundred Sixty Thousand Only</p>
                <p>Rent Period: November 2024 Cycle</p>
                <p>Mode: Cash in Person (Lockbox #SH-04)</p>

                <div className="signature">
                  <small>CUSTODIAN SEAL</small>
                  <b>Chaudhry Riaz</b>
                  <span>PAID CASH</span>
                </div>
              </div>

              <div className="voucher-verification">
                <b>Voucher Verification Record</b>

                <p>
                  <strong>Physical Voucher Logged:</strong> Nov 02, 2024 at
                  14:25 PKT
                </p>

                <p>
                  <strong>Serial Identifier:</strong> REC-3748
                </p>

                <p>
                  <strong>Verified by Custodian:</strong> Chaudhry Riaz
                  (Keyholder Sunset Heights)
                </p>

                <button onClick={() => setShowVoucher(!showVoucher)}>
                  ◎ {showVoucher ? "Close Inspection" : "Inspect Full Resolution"}
                </button>

                <button
                  onClick={() => notify("Sample voucher PDF export requested.")}
                >
                  ↓ Export Slip PDF
                </button>

              </div>

            </div>

            {showVoucher && (
              <div className="voucher-inspection">
                <h4>Voucher Inspection — REC-3748</h4>
                <p>Tenant: {current.tenant}</p>
                <p>Amount: Rs {current.amount}</p>
                <p>Vault: #SH-04</p>
                <p>Custodian: Chaudhry Riaz</p>
                <p>Verification: {verified ? "Verified" : "Pending"}</p>
              </div>
            )}

            {/* SPLIT ALLOCATION */}
            <div className="allocation-header">
              <b>Sub-Ledger Target Allocations (Automated Splitfy Split)</b>
              <span>100% Balanced • Rs 160,000 Total</span>
            </div>

            <div className="allocation-progress">
              <span />
            </div>

            <div className="allocation-row">
              <div>
                <b>● Suite 402-A (Bed 1 & 2 Base Rent)</b>
                <small>Owner Net Rental Revenue Pool</small>
              </div>

              <div>
                <b>Rs 135,000</b>
                <small>Matched to Lease Agreement</small>
              </div>
            </div>

            <div className="allocation-row">
              <div>
                <b>● Utility & Sub-meter Recovery</b>
                <small>Electricity and building charges</small>
              </div>

              <div>
                <b>Rs 25,000</b>
                <small>Utility Recovery Ledger</small>
              </div>
            </div>

            {/* FINAL VERIFICATION */}
            <div className="final-verification">
              <label>
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                I confirm physical voucher and cash custody details.
              </label>

              <button
                disabled={!verified}
                onClick={() => notify("Claim marked as verified (demo).")}
              >
                ✓ Confirm Reconciliation
              </button>
            </div>

          </section>

        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="cash-right">

          {/* LOCKBOX */}
          <section className="sidebar-card">

            <h3>🖉 Building Lockbox Ledger</h3>

            <div className="capacity-heading">
              <span>Lockbox Safe Capacity</span>
              <b>Rs 325,000 / Rs 500,000 Limit</b>
            </div>

            <div className="capacity-bar">
              <span />
            </div>

            <div className="ledger-stats">

              <div>
                <label>VERIFIED IN SAFE</label>
                <b>Rs 245,000</b>
              </div>

              <div>
                <label>UNRECONCILED</label>
                <b className="unreconciled">Rs 80,000</b>
              </div>

            </div>

            <div className="custodian-profile">
              <div className="custodian-avatar">CR</div>

              <div>
                <b>Chaudhry Riaz</b>
                <small>Lockbox Custodian • Keyholder</small>
              </div>

              <button onClick={() => notify("Custodian contact selected.")}>
                ☎
              </button>
            </div>

            <div className="last-audit">
              <span>Last Physical Audit</span>
              <b>Today at 13:45 PKT</b>
            </div>

          </section>

          {/* NEXT QUEUE */}
          <section className="sidebar-card next-queue">

            <div className="sidebar-heading">
              <h3>▣ Next In Queue (2)</h3>

              <button onClick={() => setShowAll(!showAll)}>
                {showAll ? "Hide" : "View All"}
              </button>
            </div>

            {queueItems.slice(1, showAll ? 3 : 3).map((item) => (
              <div className="next-queue-item" key={item.id}>

                <div className="next-item-top">
                  <span>{item.apartment}</span>
                  <b>{item.title}</b>
                  <strong>Rs {item.amount}</strong>
                </div>

                <div className="next-item-details">
                  <span>Tenant: {item.tenant}</span>
                  <small>▣ Signed Receipt</small>
                </div>

                <div className="next-item-bottom">
                  <span>{item.property} Safe #SH-01</span>
                  <small>42 mins ago</small>
                </div>

                <button
                  className="open-queue"
                  onClick={() => setCurrentIndex(item.id - 1)}
                >
                  Review Claim →
                </button>

              </div>
            ))}

          </section>

          {/* SAFEGUARD */}
          <section className="sidebar-card safeguard-card">

            <h3>♢ Automatic Splitfy Safeguard</h3>

            <p>
              Once verified, the caretaker's physical custody liability
              transfers to the owner's liquid ledger. A digital receipt
              with verified watermark is instantly broadcasted to all
              syndicate co-owners and roommates.
            </p>

            <div>
              ♙ 256-bit Immutable Audit Chain
            </div>

          </section>

        </aside>

      </main>

      {notification && (
        <div className="cash-toast">
          ✓ {notification}
        </div>
      )}

    </div>
  );
}
