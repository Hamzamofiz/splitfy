
import React, { useState } from "react";
import {
  ShieldCheck, CalendarDays, Download, Send,
  FileSpreadsheet, Users, ChevronDown, Search,
  SlidersHorizontal, TrendingUp, Wallet,
  CreditCard, BadgeCheck, Zap, Droplets,
  Wrench, ArrowLeftRight, Wifi, Receipt
} from "lucide-react";
import "./dashboard.css";

const transactions = [
  {
    date: "Oct 28, 2024",
    time: "16:45",
    id: "#TXN-90228",
    category: "Electricity / LESCO Oct Bill",
    description: "Utility Direct",
    icon: Zap,
    color: "orange",
    payer: "Alex Rivera",
    initials: "AR",
    target: "All 6 Members (Equal)",
    amount: "Rs 480.00",
    share: "Rs 80.00 ea"
  },
  {
    date: "Oct 26, 2024",
    time: "11:20",
    id: "#TXN-90225",
    category: "WASA Tanker Refill (4000 Gal)",
    description: "Emergency Supply",
    icon: Droplets,
    color: "blue",
    payer: "Zain Malik",
    initials: "ZM",
    target: "All 6 Members (Equal)",
    amount: "Rs 75.00",
    share: "Rs 12.50 ea"
  },
  {
    date: "Oct 24, 2024",
    time: "09:15",
    id: "#TXN-90221",
    category: "Geyser Thermostat Replacement",
    description: "Room Repair",
    icon: Wrench,
    color: "orange",
    payer: "Hamza Tariq",
    initials: "HT",
    target: "Affected Ensuite (3 Members)",
    amount: "Rs 120.00",
    share: "Rs 40.00 ea"
  },
  {
    date: "Oct 22, 2024",
    time: "20:05",
    id: "#TXN-90219",
    category: "Cash Settlement via Raast",
    description: "Settlement Verification",
    icon: ArrowLeftRight,
    color: "blue",
    payer: "Daniyal Ahmed → Alex Rivera",
    initials: "DA",
    target: "Direct Settlement",
    amount: "+Rs 160.00",
    share: "Credit",
    credit: true
  },
  {
    date: "Oct 18, 2024",
    time: "10:00",
    id: "#TXN-90215",
    category: "Nayatel 100Mbps Fiber Optic",
    description: "Monthly Internet",
    icon: Wifi,
    color: "blue",
    payer: "Alex Rivera",
    initials: "AR",
    target: "All 6 Members (Equal)",
    amount: "Rs 55.00",
    share: "Rs 9.16 ea"
  }
];

function SummaryCard({ title, value, note, icon: Icon, color }) {
  return (
    <div className="summary-card">
      <div className="summary-top">
        <span>{title}</span>
        <div className={`summary-icon ${color}`}>
          <Icon size={17} />
        </div>
      </div>
      <h2>{value}</h2>
      <span className={`summary-note ${color}`}>{note}</span>
    </div>
  );
}

export default function ExpenseHistory() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Current Month");
  const [category, setCategory] = useState("All Expenses");

  const filteredTransactions = transactions.filter((item) =>
    `${item.category} ${item.payer} ${item.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ).filter((item) =>
    category === "All Expenses" ||
    (category === "Credits" ? item.credit : !item.credit)
  );

  const downloadCSV = () => {
    const headers = ["Date", "Transaction ID", "Category", "Payer", "Target", "Amount"];
    const rows = filteredTransactions.map((item) => [
      item.date,
      item.id,
      item.category,
      item.payer,
      item.target,
      item.amount
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    link.download = "expense-history.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="expense-dashboard">

      <header className="expense-header">
        <div className="header-title">
          <span className="eyebrow">
            <span className="live-dot"></span>
            ROOM 402 · EXPENSE HISTORY & AUDIT
          </span>
          <h1>Room Expense History & Payment Log</h1>
          <p>
            Complete financial record of all cashflows, prorations,
            bank reimbursements, and roommate settlements.
          </p>
        </div>

        <div className="ledger-status">
          <div className="status-shield">
            <ShieldCheck size={22} />
          </div>
          <div>
            <strong>Ledger Status: Up to Date</strong>
            <span><span className="green-dot"></span> Last Sync: Today, 15:42 PKT</span>
          </div>
        </div>
      </header>

      <section className="filter-panel">
        <div className="filter-main">
          <button className="filter-btn">
            <CalendarDays size={15} />
            Oct 01, 2024 to Oct 31, 2024
            <ChevronDown size={13} />
          </button>

          {["Current Month", "Q3 2024", "Full Year 2024"].map(item => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`period-btn ${period === item ? "active" : ""}`}
            >
              {item}
            </button>
          ))}

          <button className="action-btn download" onClick={downloadCSV}>
            <FileSpreadsheet size={15} /> Download CSV
          </button>

          <button className="action-btn whatsapp">
            <Send size={14} /> Send to WhatsApp
          </button>
        </div>

        <div className="filter-bottom">
          <button className="filter-btn">
            <Users size={15} /> All 6 Roommates <ChevronDown size={13} />
          </button>

          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Expenses</option>
            <option>Credits</option>
            <option>Debits</option>
          </select>

          <button className="action-btn audit">
            <Receipt size={15} /> Export PDF Formal Audit
          </button>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard
          title="Total Debits Incurred"
          value="Rs 1,845.50"
          note="↑ 14.2% vs previous billing cycle"
          icon={TrendingUp}
          color="red"
        />
        <SummaryCard
          title="Settled Credits (Paid)"
          value="Rs 1,420.00"
          note="76.9% liquidity clearance rate"
          icon={Wallet}
          color="teal"
        />
        <SummaryCard
          title="Net Outstanding Balance"
          value="Rs 425.50"
          note="2 members pending reconciliation"
          icon={CreditCard}
          color="orange"
        />
        <SummaryCard
          title="Verified Ledger Records"
          value="28 Verified"
          note="Zero discrepancies recorded"
          icon={BadgeCheck}
          color="blue"
        />
      </section>

      <section className="transaction-section">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by Txn ID, voucher or person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="column-filter">
            <SlidersHorizontal size={15} />
            Column Filters
          </button>
        </div>

        <div className="table-scroll">
          <table className="expense-table">
            <thead>
              <tr>
                <th>TIMESTAMP & ID</th>
                <th>CATEGORY & DESCRIPTION</th>
                <th>PAYER / INITIATOR</th>
                <th>ALLOCATION TARGET</th>
                <th>VOUCHER</th>
                <th className="amount-heading">AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => {
                const Icon = item.icon;
                return (
                  <tr key={item.id}>
                    <td className="timestamp">
                      <strong>{item.date} • {item.time}</strong>
                      <span>{item.id}</span>
                    </td>

                    <td>
                      <div className="category-cell">
                        <div className={`category-icon ${item.color}`}>
                          <Icon size={17} />
                        </div>
                        <div>
                          <strong>{item.category}</strong>
                          <span>{item.description}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="payer-cell">
                        <span className="avatar">{item.initials}</span>
                        <strong>{item.payer}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="target-label">{item.target}</span>
                    </td>

                    <td className="voucher-cell">
                      <button title="View voucher">
                        <Receipt size={17} />
                      </button>
                    </td>

                    <td className={`amount-cell ${item.credit ? "credit" : ""}`}>
                      <strong>{item.amount}</strong>
                      <span>{item.share}</span>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Showing {filteredTransactions.length} of {transactions.length} records</span>
          <span><ShieldCheck size={14} /> Secure & Verified Ledger</span>
        </div>
      </section>
    </div>
  );
}
