
import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  Clock3,
  TrendingUp,
  Wallet,
  ClipboardCheck,
  Search,
  SlidersHorizontal,
  Zap,
  Droplet,
  Wrench,
  Wifi,
  ArrowLeftRight,
  CheckCircle2,
  Users,
  X,
  Receipt,
  ArrowUpDown
} from "lucide-react";

import "./audit.css";

const initialTransactions = [
  {
    id: "TXN-90228",
    date: "Oct 28, 2024",
    time: "16:45",
    category: "Electricity",
    description: "Electricity / LESCO Oct Bill",
    subDescription: "Utility Direct",
    payer: "Alex Rivera",
    initials: "AR",
    target: "All 6 Members",
    targetDetail: "(Equal)",
    voucher: "verified",
    amount: 480,
    credit: false,
    color: "electric"
  },
  {
    id: "TXN-90226",
    date: "Oct 26, 2024",
    time: "11:20",
    category: "Water",
    description: "WASA Tanker Refill (4000 Gal)",
    subDescription: "Emergency Supply",
    payer: "Zain Malik",
    initials: "ZM",
    target: "All 6 Members",
    targetDetail: "(Equal)",
    voucher: "verified",
    amount: 75,
    credit: false,
    color: "water"
  },
  {
    id: "TXN-90221",
    date: "Oct 24, 2024",
    time: "09:15",
    category: "Maintenance",
    description: "Geyser Thermostat Replacement",
    subDescription: "Room Repair",
    payer: "Hamza Tariq",
    initials: "HT",
    target: "Affected Ensuite",
    targetDetail: "(3 Members)",
    voucher: "verified",
    amount: 120,
    credit: false,
    color: "maintenance"
  },
  {
    id: "TXN-90219",
    date: "Oct 22, 2024",
    time: "20:05",
    category: "Settlement",
    description: "Cash Settlement via Raast",
    subDescription: "Settlement Verification",
    payer: "Daniyal Ahmed",
    initials: "DA",
    receiver: "Alex Rivera",
    target: "Direct Settlement",
    targetDetail: "",
    voucher: "settled",
    amount: 160,
    credit: true,
    color: "settlement"
  },
  {
    id: "TXN-90215",
    date: "Oct 18, 2024",
    time: "10:00",
    category: "Internet",
    description: "Nayatel 100Mbps Fiber Optic",
    subDescription: "Monthly Internet",
    payer: "Alex Rivera",
    initials: "AR",
    target: "All 6 Members",
    targetDetail: "(Equal)",
    voucher: "verified",
    amount: 55,
    credit: false,
    color: "internet"
  },
  {
    id: "TXN-90210",
    date: "Oct 15, 2024",
    time: "13:30",
    category: "Electricity",
    description: "Electricity Previous Adjustment",
    subDescription: "Utility Reconciliation",
    payer: "Ali Khan",
    initials: "AK",
    target: "All 6 Members",
    targetDetail: "(Equal)",
    voucher: "verified",
    amount: 250,
    credit: false,
    color: "electric"
  },
  {
    id: "TXN-90205",
    date: "Oct 12, 2024",
    time: "12:10",
    category: "Maintenance",
    description: "Water Motor Service",
    subDescription: "Mechanical Repair",
    payer: "Bilal Raza",
    initials: "BR",
    target: "Affected Ensuite",
    targetDetail: "(3 Members)",
    voucher: "verified",
    amount: 90,
    credit: false,
    color: "maintenance"
  }
];

const categoryOptions = [
  "All Expenses",
  "Electricity",
  "Water",
  "Maintenance",
  "Internet",
  "Settlement"
];

const roommates = [
  "All 6 Roommates",
  "Alex Rivera",
  "Zain Malik",
  "Hamza Tariq",
  "Daniyal Ahmed",
  "Ali Khan",
  "Bilal Raza"
];

function getCategoryIcon(category) {
  switch (category) {
    case "Electricity":
      return Zap;
    case "Water":
      return Droplet;
    case "Maintenance":
      return Wrench;
    case "Internet":
      return Wifi;
    default:
      return ArrowLeftRight;
  }
}

export default function ExpenseHistory() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [roommate, setRoommate] = useState("All 6 Roommates");
  const [category, setCategory] = useState("All Expenses");
  const [period, setPeriod] = useState("Current Month");
  const [dateRange, setDateRange] = useState(
    "Oct 01, 2024 to Oct 31, 2024"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);

  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((item) => {
        const query = search.toLowerCase();

        const matchesSearch =
          item.id.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.payer.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        const matchesCategory =
          category === "All Expenses" ||
          item.category === category;

        const matchesRoommate =
          roommate === "All 6 Roommates" ||
          item.payer === roommate ||
          item.receiver === roommate;

        const matchesVerified =
          !verifiedOnly || item.voucher === "verified";

        return (
          matchesSearch &&
          matchesCategory &&
          matchesRoommate &&
          matchesVerified
        );
      })
      .sort((a, b) =>
        sortNewest
          ? Number(b.id.split("-")[1]) - Number(a.id.split("-")[1])
          : Number(a.id.split("-")[1]) - Number(b.id.split("-")[1])
      );
  }, [
    transactions,
    search,
    category,
    roommate,
    verifiedOnly,
    sortNewest
  ]);

  const totalDebits = transactions
    .filter((item) => !item.credit)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalCredits = transactions
    .filter((item) => item.credit)
    .reduce((sum, item) => sum + item.amount, 0);

  const outstanding = totalDebits - totalCredits;

  const verifiedCount = transactions.filter(
    (item) => item.voucher === "verified" || item.voucher === "settled"
  ).length;

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "Time",
      "Category",
      "Description",
      "Payer",
      "Allocation Target",
      "Amount",
      "Type",
      "Voucher Status"
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.date,
      item.time,
      item.category,
      item.description,
      item.payer,
      item.target,
      item.amount,
      item.credit ? "Credit" : "Debit",
      item.voucher
    ]);

    const csvContent = [
      headers,
      ...rows
    ].map((row) =>
      row.map((value) =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(",")
    ).join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Room-402-Expense-History.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setRoommate("All 6 Roommates");
    setCategory("All Expenses");
    setVerifiedOnly(false);
  };

  const selectPeriod = (value) => {
    setPeriod(value);

    if (value === "Current Month") {
      setDateRange("Oct 01, 2024 to Oct 31, 2024");
    } else if (value === "Q3 2024") {
      setDateRange("Jul 01, 2024 to Sep 30, 2024");
    } else {
      setDateRange("Jan 01, 2024 to Dec 31, 2024");
    }
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(
      `Room 402 Expense Summary\nTotal Debits: Rs ${totalDebits.toFixed(2)}\nSettled Credits: Rs ${totalCredits.toFixed(2)}\nOutstanding: Rs ${outstanding.toFixed(2)}`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="expense-history-page">

      {/* HEADER */}

      <header className="expense-header">

        <div className="expense-heading">

          <span className="expense-breadcrumb">
            <span></span>
            ROOM 402 • EXPENSE HISTORY & AUDIT
          </span>

          <h1>Room Expense History &amp; Payment Log</h1>

          <p>
            Complete financial record of all cashflows, prorations,
            bank reimbursements, and roommate settlements.
          </p>

        </div>

        <div className="ledger-status">

          <div className="ledger-shield">
            <ShieldCheck size={19} />
          </div>

          <div>
            <strong>
              <span></span>
              Ledger Status: Up to Date
            </strong>

            <small>
              <Clock3 size={10} />
              Last Sync: Today, 15:42 PKT
            </small>
          </div>

        </div>

      </header>

      {/* FILTER AND ACTION BAR */}

      <section className="expense-control-panel">

        <div className="control-row">

          <button className="date-select">
            <CalendarDays size={13} />
            {dateRange}
            <ChevronDown size={12} />
          </button>

          <div className="period-tabs">
            {["Current Month", "Q3 2024", "Full Year 2024"].map(
              (item) => (
                <button
                  key={item}
                  className={period === item ? "active" : ""}
                  onClick={() => selectPeriod(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="control-actions">

            <button
              className="action-button csv-button"
              onClick={exportCSV}
            >
              <Download size={13} />
              Download CSV
            </button>

            <button
              className="action-button whatsapp-button"
              onClick={sendWhatsApp}
            >
              <MessageSquare size={13} />
              Send to WhatsApp
            </button>

          </div>

        </div>

        <div className="control-row second-row">

          <label className="select-wrapper">
            <Users size={13} />
            <select
              value={roommate}
              onChange={(e) => setRoommate(e.target.value)}
            >
              {roommates.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <ChevronDown size={11} />
          </label>

          <label className="select-wrapper">
            <SlidersHorizontal size={13} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <ChevronDown size={11} />
          </label>

          <button
            className="action-button audit-button"
            onClick={() => window.print()}
          >
            <FileSpreadsheet size={13} />
            Export PDF Formal Audit
          </button>

        </div>

      </section>

      {/* SUMMARY CARDS */}

      <section className="expense-summary-grid">

        <div className="summary-card">

          <div className="summary-top">
            <span>Total Debits Incurred</span>
            <div className="summary-icon debit-icon">
              <TrendingUp size={15} />
            </div>
          </div>

          <h2>Rs {totalDebits.toLocaleString("en-PK", {
            minimumFractionDigits: 2
          })}</h2>

          <span className="summary-tag red-tag">
            +14.2% vs previous billing cycle
          </span>

        </div>

        <div className="summary-card">

          <div className="summary-top">
            <span>Settled Credits (Paid)</span>
            <div className="summary-icon credit-icon">
              <Wallet size={15} />
            </div>
          </div>

          <h2>Rs {totalCredits.toLocaleString("en-PK", {
            minimumFractionDigits: 2
          })}</h2>

          <span className="summary-tag green-tag">
            76.9% liquidity clearance rate
          </span>

        </div>

        <div className="summary-card">

          <div className="summary-top">
            <span>Net Outstanding Balance</span>
            <div className="summary-icon outstanding-icon">
              <Receipt size={15} />
            </div>
          </div>

          <h2>Rs {outstanding.toLocaleString("en-PK", {
            minimumFractionDigits: 2
          })}</h2>

          <span className="summary-tag orange-tag">
            2 members pending reconciliation
          </span>

        </div>

        <div className="summary-card">

          <div className="summary-top">
            <span>Verified Ledger Records</span>
            <div className="summary-icon verified-icon">
              <CheckCircle2 size={15} />
            </div>
          </div>

          <h2>{verifiedCount} Verified</h2>

          <span className="summary-tag blue-tag">
            Zero discrepancies recorded
          </span>

        </div>

      </section>

      {/* TRANSACTION HISTORY */}

      <section className="transaction-panel">

        {/* SEARCH BAR */}

        <div className="transaction-toolbar">

          <div className="transaction-search">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search by Txn ID, voucher or person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} />
              </button>
            )}
          </div>

          <button
            className={
              showFilters
                ? "column-filter active"
                : "column-filter"
            }
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={13} />
            Column Filters
          </button>

        </div>

        {showFilters && (
          <div className="advanced-filter-panel">

            <label>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              Show verified transactions only
            </label>

            <button onClick={resetFilters}>
              Reset All Filters
            </button>

          </div>
        )}

        {/* TABLE */}

        <div className="transaction-table-wrapper">

          <table className="transaction-table">

            <thead>
              <tr>
                <th>
                  <button
                    className="table-sort"
                    onClick={() => setSortNewest(!sortNewest)}
                  >
                    TIMESTAMP &amp; ID
                    <ArrowUpDown size={10} />
                  </button>
                </th>
                <th>CATEGORY &amp; DESCRIPTION</th>
                <th>PAYER / INITIATOR</th>
                <th>ALLOCATION TARGET</th>
                <th>VOUCHER</th>
                <th className="amount-heading">AMOUNT</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.map((item) => {
                const Icon = getCategoryIcon(item.category);

                return (
                  <tr key={item.id}>

                    {/* DATE */}

                    <td className="timestamp-cell">
                      <strong>{item.date}</strong>
                      <span>{item.time}</span>
                      <small>#{item.id}</small>
                    </td>

                    {/* CATEGORY */}

                    <td className="description-cell">

                      <div className={`transaction-category-icon ${item.color}`}>
                        <Icon size={14} />
                      </div>

                      <div>
                        <strong>{item.description}</strong>
                        <span>{item.subDescription}</span>
                      </div>

                    </td>

                    {/* PAYER */}

                    <td className="payer-cell">

                      <div className="payer-avatar">
                        {item.initials}
                      </div>

                      <div className="payer-names">
                        <strong>{item.payer}</strong>

                        {item.receiver && (
                          <span>
                            <ArrowLeftRight size={10} />
                            {item.receiver}
                          </span>
                        )}
                      </div>

                    </td>

                    {/* ALLOCATION */}

                    <td className="allocation-cell">

                      <span className={
                        item.credit
                          ? "allocation-badge direct"
                          : "allocation-badge"
                      }>
                        {item.target}
                      </span>

                      {item.targetDetail && (
                        <small>{item.targetDetail}</small>
                      )}

                    </td>

                    {/* VOUCHER */}

                    <td className="voucher-cell">

                      {item.voucher === "settled" ? (
                        <CheckCircle2
                          size={14}
                          className="settled-voucher"
                        />
                      ) : (
                        <Receipt
                          size={14}
                          className="verified-voucher"
                        />
                      )}

                    </td>

                    {/* AMOUNT */}

                    <td className="amount-cell">

                      <strong className={item.credit ? "credit-amount" : ""}>
                        {item.credit ? "+" : ""}Rs {item.amount.toFixed(2)}
                      </strong>

                      <span>
                        {item.credit ? "Credit" : "Rs 0.00 ea"}
                      </span>

                    </td>

                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="empty-transactions">
                      <Search size={25} />
                      <strong>No transactions found</strong>
                      <span>Try another search or change your filters.</span>
                      <button onClick={resetFilters}>
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* TABLE FOOTER */}

        <div className="transaction-footer">

          <span>
            Showing {filteredTransactions.length} of {transactions.length} records
          </span>

          <div>
            <ShieldCheck size={13} />
            All financial records are securely logged
          </div>

        </div>

      </section>

    </div>
  );
}
