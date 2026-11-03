
import { useState } from "react";
import {
  Wallet,
  Landmark,
  AlertTriangle,
  SlidersHorizontal,
  CheckCheck,
  ArrowLeftRight,
  FileText,
  ShieldCheck,
  Clock,
  Receipt,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

import "./verification.css";

const initialClaims = [
  {
    id: 1,
    initials: "AR",
    name: "Alex Rivera / H. Tariq",
    property: "Sunset Heights • Unit 402",
    lease: "Lease-402-24 • Monthly Term",
    type: "Raast Digital Slip",
    reference: "RST-OCT-998124",
    date: "Uploaded Today • 09:42 AM",
    feed: "MEEZAN DIRECT FEED",
    match: "99.8% Match",
    bank: "IBAN: MZNB-98124 • OCT 09:43 AM",
    amount: 160000,
    category: "Rent + Utilities",
    status: "pending",
    image: "receipt",
  },
  {
    id: 2,
    initials: "BR",
    name: "Bilal Raza",
    property: "Elite Residency • Unit 201",
    lease: "Lease-ER-201-23 • Annual",
    type: "Cash Envelope Slip",
    reference: "Cash: Malik Tariq",
    date: "Yesterday • 05:15 PM",
    feed: "CASH REGISTER FEED",
    match: "Manager Logged",
    bank: "Vault Loc: Safe Drawer #02 • On-Site Office Handover",
    amount: 75000,
    category: "Maintenance Reserve",
    status: "pending",
    image: "cash",
  },
  {
    id: 3,
    initials: "SK",
    name: "Sana Khan",
    property: "Sunset Heights • Unit 108",
    lease: "Dispute Pending Action",
    type: "POS Slip",
    reference: "ATM-223-881",
    date: "Oct 23 • 11:10 PM",
    feed: "BANK API SEARCH",
    match: "0% Signal",
    bank: "No Bank Transaction Found • Scanned 72h Window",
    amount: 85000,
    category: "Rent Payment",
    status: "discrepancy",
    image: "receipt",
  },
  {
    id: 4,
    initials: "DK",
    name: "Danyal Ahmed",
    property: "Gulberg Executive • Unit 305",
    lease: "Lease-GE-305-24",
    type: "Standard Chartered",
    reference: "SCB-992018",
    date: "Oct 24 • 02:15 PM",
    feed: "INTERBANK CLEARING",
    match: "98.4% Match",
    bank: "Cleared Successfully • Oct 24, 02:16 PM",
    amount: 90000,
    category: "Full Rent Payment",
    status: "pending",
    image: "receipt",
  },
  {
    id: 5,
    initials: "ZM",
    name: "Zayn Malik",
    property: "Sunset Heights • Unit 210",
    lease: "Lease-SH-210-24",
    type: "Raast Transfer",
    reference: "RST-884120",
    date: "Oct 25 • 10:30 AM",
    feed: "BANK API FEED",
    match: "100% Match",
    bank: "Transaction Verified • Oct 25",
    amount: 65000,
    category: "Monthly Rent",
    status: "cleared",
    image: "receipt",
  },
];

const money = (amount) =>
  `Rs ${Number(amount).toLocaleString("en-PK")}`;

export default function PaymentVerification() {
  const [claims, setClaims] = useState(initialClaims);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showQueue, setShowQueue] = useState(false);

  const filteredClaims = claims.filter((claim) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && claim.status === "pending") ||
      (filter === "discrepancy" && claim.status === "discrepancy") ||
      (filter === "cleared" && claim.status === "cleared") ||
      (filter === "cash" && claim.type.toLowerCase().includes("cash")) ||
      (filter === "bank" &&
        claim.feed.toLowerCase().includes("bank"));

    const matchesSearch = [
      claim.name,
      claim.property,
      claim.type,
      claim.reference,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const updateClaim = (id, status) => {
    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === id ? { ...claim, status } : claim
      )
    );
  };

  const pendingCount = claims.filter(
    (claim) => claim.status === "pending"
  ).length;

  const discrepancyCount = claims.filter(
    (claim) => claim.status === "discrepancy"
  ).length;

  const clearedCount = claims.filter(
    (claim) => claim.status === "cleared"
  ).length;

  const actionableAmount = claims
    .filter((claim) => claim.status === "pending")
    .reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="payment-verification">

      {/* HEADER */}

      <header className="pv-header">
        <div className="pv-header-content">
          <span className="pv-eyebrow">
            <span className="pv-eyebrow-dot" />
            LANDLORD VERIFICATION & CLAIMS
          </span>

          <h1>Payment Verification & Cash Claims</h1>

          <p>
            Cross-inspect bank slips, cash receipts, and direct Raast
            transfers against incoming institutional ledger feeds.
          </p>
        </div>

        <div className="pv-header-actions">
          <button
            className="pv-filter-button"
            onClick={() => setShowQueue(!showQueue)}
          >
            <SlidersHorizontal size={14} />
            {showQueue ? "Close Queue" : "Filter Queue"}
          </button>

          <button
            className="pv-sync-button"
            onClick={() =>
              setClaims((prev) => [...prev])
            }
          >
            <CheckCheck size={14} />
            Auto-Reconcile Verified ({clearedCount})
          </button>
        </div>
      </header>

      {/* SUMMARY CARDS */}

      <section className="pv-summary">

        <article className="pv-summary-card pv-summary-orange">
          <div className="pv-summary-top">
            <div>
              <span className="pv-card-label">
                REQUIRES LANDLORD SIGNOFF
              </span>
              <h2>{pendingCount + discrepancyCount} Actionable</h2>
            </div>

            <span className="pv-summary-icon">
              <Wallet size={21} />
            </span>
          </div>

          <div className="pv-summary-bottom">
            <div>
              <strong>{money(actionableAmount)}</strong>
              <span>in claimed currency</span>
            </div>
            <span className="pv-priority">High Priority</span>
          </div>
        </article>

        <article className="pv-summary-card pv-summary-teal">
          <div className="pv-summary-top">
            <div>
              <span className="pv-card-label">
                SYNCHRONIZED TELEMETRY
              </span>
              <h2>{clearedCount + 11} Cleared</h2>
            </div>

            <span className="pv-summary-icon">
              <Landmark size={21} />
            </span>
          </div>

          <div className="pv-summary-bottom">
            <div>
              <strong>Rs 1,840,000</strong>
              <span>cleared in Cycle Oct</span>
            </div>
            <span className="pv-match">99.8% Match Rate</span>
          </div>
        </article>

        <article className="pv-summary-card pv-summary-red">
          <div className="pv-summary-top">
            <div>
              <span className="pv-card-label">
                DISCREPANCY ALARM
              </span>
              <h2>{discrepancyCount} Flagged Claim</h2>
            </div>

            <span className="pv-summary-icon">
              <AlertTriangle size={21} />
            </span>
          </div>

          <div className="pv-summary-bottom">
            <div>
              <strong>Rs 85,000</strong>
              <span>unmatched bank ref</span>
            </div>
            <span className="pv-proof">Proof Requested</span>
          </div>
        </article>

      </section>

      {/* LEDGER SECTION */}

      <section className="pv-ledger">

        <div className="pv-ledger-header">

          <div className="pv-ledger-title">
            <ArrowLeftRight size={17} />
            <h2>Dual Ledger Inquest</h2>
            <span>{pendingCount} Records Remaining</span>
          </div>

          <div className="pv-tabs">
            {[
              ["all", "All Pending"],
              ["bank", "Bank Feed Matches"],
              ["cash", "Cash Handover"],
              ["discrepancy", `Discrepancies (${discrepancyCount})`],
              ["cleared", "Cleared"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={filter === value ? "active" : ""}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

        </div>

        {showQueue && (
          <div className="pv-queue-panel">
            <div>
              <strong>Verification Queue</strong>
              <span>Review and locate incoming payment claims.</span>
            </div>

            <div className="pv-search">
              <Search size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tenant, property or reference..."
              />
            </div>
          </div>
        )}

        {!showQueue && (
          <div className="pv-search pv-search-inline">
            <Search size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenant or payment reference..."
            />
          </div>
        )}

        {/* TABLE HEADER */}

        <div className="pv-table-heading">
          <span>TENANT & PROPERTY UNIT</span>
          <span>CLAIMED PAYMENT SLIP / PROOF</span>
          <span>LIVE LANDLORD FEED MATCHING</span>
          <span>AMOUNT & ALLOCATION</span>
          <span>VERIFICATION ACTION TOGGLES</span>
        </div>

        {/* CLAIM ROWS */}

        <div className="pv-claim-list">

          {filteredClaims.map((claim) => (

            <article className="pv-claim-row" key={claim.id}>

              {/* TENANT */}

              <div className="pv-tenant">
                <div className="pv-avatar">
                  {claim.initials}
                </div>

                <div>
                  <h3>{claim.name}</h3>
                  <p>{claim.property}</p>
                  <small>{claim.lease}</small>
                </div>
              </div>

              {/* PAYMENT PROOF */}

              <div className="pv-proof-cell">

                <div className={`pv-proof-thumb ${claim.image}`}>
                  {claim.image === "cash" ? (
                    <Wallet size={25} />
                  ) : (
                    <Receipt size={25} />
                  )}
                  <span>PROOF</span>
                </div>

                <div className="pv-proof-info">
                  <strong>{claim.type}</strong>
                  <span>
                    <FileText size={11} />
                    Ref: {claim.reference}
                  </span>
                  <small>{claim.date}</small>
                </div>

              </div>

              {/* BANK FEED */}

              <div className="pv-feed-card">
                <strong>{claim.feed}</strong>

                <span
                  className={
                    claim.status === "discrepancy"
                      ? "pv-feed-danger"
                      : "pv-feed-success"
                  }
                >
                  {claim.match}
                </span>

                <small>{claim.bank}</small>
              </div>

              {/* AMOUNT */}

              <div className="pv-amount-cell">
                <strong>{money(claim.amount)}</strong>
                <span>{claim.category}</span>
                <small>
                  {claim.status === "cleared"
                    ? "Verified"
                    : claim.status === "discrepancy"
                    ? "Payment Unconfirmed"
                    : "Pending Verification"}
                </small>
              </div>

              {/* ACTIONS */}

              <div className="pv-actions">

                {claim.status === "pending" ? (
                  <>
                    <button
                      className="pv-approve"
                      onClick={() =>
                        updateClaim(claim.id, "cleared")
                      }
                    >
                      <ShieldCheck size={13} />
                      Approve & Issue Receipt
                    </button>

                    <div className="pv-secondary-actions">
                      <button
                        onClick={() =>
                          updateClaim(claim.id, "discrepancy")
                        }
                      >
                        Dispute
                      </button>

                      <button
                        onClick={() =>
                          updateClaim(claim.id, "cleared")
                        }
                      >
                        <RefreshCw size={10} />
                        Reconcile
                      </button>
                    </div>
                  </>
                ) : claim.status === "discrepancy" ? (
                  <>
                    <button
                      className="pv-dispute"
                      onClick={() =>
                        updateClaim(claim.id, "pending")
                      }
                    >
                      <AlertTriangle size={13} />
                      Request / Review Proof
                    </button>

                    <div className="pv-secondary-actions">
                      <button onClick={() => alert("Tenant contact action")}>
                        Call Tenant
                      </button>
                      <button onClick={() => alert("Audit trail opened")}>
                        Audit Trail
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pv-cleared-state">
                    <CheckCircle2 size={17} />
                    <strong>Payment Verified</strong>
                    <span>Receipt Issued</span>
                  </div>
                )}

              </div>

            </article>

          ))}

          {filteredClaims.length === 0 && (
            <div className="pv-empty">
              <Search size={25} />
              <strong>No matching payment records</strong>
              <span>Try another filter or search term.</span>
            </div>
          )}

        </div>

        {/* FOOTER */}

        <div className="pv-ledger-footer">
          <span>
            <ShieldCheck size={13} />
            Secure dual-ledger verification system
          </span>

          <span>
            Showing {filteredClaims.length} of {claims.length} records
          </span>
        </div>

      </section>

    </div>
  );
}
