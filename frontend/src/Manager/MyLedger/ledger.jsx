
import React, { useMemo, useState } from "react";
import {
  Wallet,
  ShoppingCart,
  PieChart,
  BadgeCheck,
  TrendingUp,
  Search,
  CalendarDays,
  ChevronDown,
  ReceiptText,
  Droplets,
  Wrench,
  Zap,
  Utensils,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Filter,
  Download,
  CircleDollarSign,
} from "lucide-react";

import "./Ledger.css";

const transactions = [
  {
    id: 1,
    date: "Oct 28, 2024",
    time: "07:42 PM",
    title: "Metro Kitchen Groceries & Detergent",
    category: "Shared House Supplies",
    detail: "Equal 6-way split",
    type: "received",
    typeLabel: "Paid by You",
    amount: 125,
    share: 104.17,
    icon: ShoppingCart,
    color: "orange",
  },
  {
    id: 2,
    date: "Oct 26, 2024",
    time: "11:15 AM",
    title: "WASA Water Supply Tanker (4000 Gal)",
    category: "Utilities • Paid by Room Leader Ali",
    detail: "Water Allocation",
    type: "debit",
    typeLabel: "Debit",
    amount: 75,
    share: -12.50,
    icon: Droplets,
    color: "blue",
  },
  {
    id: 3,
    date: "Oct 24, 2024",
    time: "03:30 PM",
    title: "Geyser Thermostat Replacement",
    category: "Maintenance • Ensuite Bed A & B",
    detail: "Maintenance Cost",
    type: "debit",
    typeLabel: "Ensuite Only",
    amount: 140,
    share: -70,
    icon: Wrench,
    color: "orange",
  },
  {
    id: 4,
    date: "Oct 22, 2024",
    time: "06:20 PM",
    title: "Electricity & Power Bill",
    category: "Shared Utilities",
    detail: "October electricity allocation",
    type: "debit",
    typeLabel: "Utility Split",
    amount: 180,
    share: -38.45,
    icon: Zap,
    color: "green",
  },
  {
    id: 5,
    date: "Oct 19, 2024",
    time: "02:10 PM",
    title: "Kitchen Grocery Contribution",
    category: "Shared Groceries",
    detail: "Payment received from Ali Khan",
    type: "received",
    typeLabel: "Received",
    amount: 85,
    share: 85,
    icon: Utensils,
    color: "green",
  },
  {
    id: 6,
    date: "Oct 15, 2024",
    time: "10:45 AM",
    title: "Fiber Internet Monthly Bill",
    category: "Internet & Connectivity",
    detail: "Monthly shared allocation",
    type: "debit",
    typeLabel: "Debit",
    amount: 65,
    share: -10.83,
    icon: CreditCard,
    color: "blue",
  },
  {
    id: 7,
    date: "Oct 12, 2024",
    time: "04:30 PM",
    title: "Room Maintenance Contribution",
    category: "Maintenance",
    detail: "Monthly maintenance payment",
    type: "received",
    typeLabel: "Received",
    amount: 45,
    share: 45,
    icon: Wrench,
    color: "orange",
  },
  {
    id: 8,
    date: "Oct 08, 2024",
    time: "01:15 PM",
    title: "Water & Maintenance Charges",
    category: "Shared Utilities",
    detail: "Room 402 allocation",
    type: "debit",
    typeLabel: "Debit",
    amount: 55,
    share: -9.17,
    icon: Droplets,
    color: "blue",
  },
];

const categories = [
  {
    name: "Groceries & Kitchen Supplies",
    percentage: 34,
    amount: 82.50,
    color: "#ff9637",
  },
  {
    name: "Electricity & Power (Prorated)",
    percentage: 31,
    amount: 74.67,
    color: "#008f83",
  },
  {
    name: "Maintenance & Geyser Repair",
    percentage: 16,
    amount: 40,
    color: "#58627f",
  },
  {
    name: "Water & Internet",
    percentage: 19,
    amount: 48.66,
    color: "#e7b04f",
  },
];

const filters = [
  { id: "all", label: "All My Transactions (18)" },
  { id: "debit", label: "Money I Paid" },
  { id: "received", label: "Money I Received" },
  { id: "utility", label: "Utility Allocations" },
];

export default function Ledger() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("October 2024");
  const [showAll, setShowAll] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesFilter =
        activeFilter === "all" ||
        item.type === activeFilter ||
        (activeFilter === "utility" &&
          item.category.toLowerCase().includes("utilit"));

      const matchesSearch =
        `${item.title} ${item.category} ${item.date}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const visibleTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 6);

  const handleDownload = () => {
    const rows = [
      ["Date", "Description", "Category", "Type", "Total Bill", "Your Share"],
      ...filteredTransactions.map((item) => [
        item.date,
        item.title,
        item.category,
        item.typeLabel,
        item.amount,
        item.share,
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
    link.download = "Splitfy-Personal-Ledger.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="ledger-page">

      {/* HEADER */}

      <header className="ledger-header">

        <div className="ledger-heading">

          <span className="ledger-eyebrow">
            <span></span>
            ROOM 402 • RESIDENT PERSONAL LEDGER
          </span>

          <h1>My Ledger & Financial Standing</h1>

          <p>
            Comprehensive personal ledger view showing your historical
            credits, debits, monthly expense trends, and shared group
            cashflows from Room 402.
          </p>

        </div>

      </header>

      {/* SUMMARY CARDS */}

      <section className="ledger-stats">

        <article className="ledger-stat-card">

          <div className="stat-top">
            <span>NET BALANCE STANDING</span>
            <div className="stat-icon teal">
              <Wallet size={15} />
            </div>
          </div>

          <h2 className="stat-positive">+Rs 42.50</h2>

          <div className="stat-bottom">
            <TrendingUp size={12} />
            <span>Net Creditor • You are owed more than you owe</span>
          </div>

        </article>

        <article className="ledger-stat-card">

          <div className="stat-top">
            <span>OUT-OF-POCKET SPENT</span>
            <div className="stat-icon orange">
              <ShoppingCart size={15} />
            </div>
          </div>

          <h2>Rs 125.00</h2>

          <div className="stat-bottom neutral">
            <span>Metro Groceries & Supplies • Full room credit</span>
          </div>

        </article>

        <article className="ledger-stat-card">

          <div className="stat-top">
            <span>ALLOCATED MONTHLY DUES</span>
            <div className="stat-icon blue">
              <PieChart size={15} />
            </div>
          </div>

          <h2>Rs 245.83</h2>

          <div className="stat-note">
            <CheckCircle2 size={11} />
            After 7-day absence credit applied (-Rs 38.45)
          </div>

        </article>

        <article className="ledger-stat-card">

          <div className="stat-top">
            <span>SETTLEMENT RELIABILITY</span>
            <div className="stat-icon orange">
              <BadgeCheck size={15} />
            </div>
          </div>

          <h2 className="reliability-number">6 Months</h2>

          <div className="stat-bottom reliability-text">
            <span>★</span>
            Perfect Resident Standing Level 1
          </div>

          <div className="reliability-badge">100%</div>

        </article>

      </section>

      {/* FILTER TOOLBAR */}

      <section className="ledger-toolbar">

        <div className="ledger-tabs">

          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={
                activeFilter === filter.id
                  ? "ledger-tab active"
                  : "ledger-tab"
              }
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}

        </div>

        <div className="ledger-tools">

          <div className="ledger-search">
            <Search size={14} />

            <input
              type="text"
              placeholder="Search expense, roommate, receipt"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="ledger-month">
            <CalendarDays size={13} />

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Select month"
            >
              <option>October 2024</option>
              <option>September 2024</option>
              <option>August 2024</option>
              <option>July 2024</option>
            </select>

            <ChevronDown size={12} />

          </div>

          <button
            type="button"
            className="ledger-export"
            onClick={handleDownload}
            title="Download CSV"
          >
            <Download size={14} />
          </button>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <div className="ledger-content">

        {/* LEDGER ENTRIES */}

        <section className="ledger-entries-card">

          <div className="ledger-card-heading">

            <div>
              <ReceiptText size={15} />
              <h2>Ledger Entries</h2>
              <span className="live-reconciled">
                Live Reconciled
              </span>
            </div>

            <small>
              Showing {visibleTransactions.length} of 18 records
            </small>

          </div>

          <div className="ledger-table-wrapper">

            <table className="ledger-table">

              <thead>
                <tr>
                  <th>DATE & TIME</th>
                  <th>DESCRIPTION & CATEGORY</th>
                  <th>TYPE</th>
                  <th>TOTAL BILL</th>
                  <th>YOUR SHARE</th>
                </tr>
              </thead>

              <tbody>

                {visibleTransactions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <tr key={item.id}>

                      <td className="ledger-date">
                        <strong>{item.date}</strong>
                        <span>{item.time}</span>
                      </td>

                      <td className="ledger-description">

                        <div className="ledger-description-inner">

                          <div className={`transaction-icon ${item.color}`}>
                            <Icon size={14} />
                          </div>

                          <div>
                            <strong>{item.title}</strong>
                            <span>{item.category}</span>
                            <small>• {item.detail}</small>
                          </div>

                        </div>

                      </td>

                      <td>
                        <span className={`transaction-type ${item.type}`}>
                          {item.type === "received" ? (
                            <ArrowDownLeft size={11} />
                          ) : (
                            <ArrowUpRight size={11} />
                          )}
                          {item.typeLabel}
                        </span>
                      </td>

                      <td className="ledger-total">
                        <strong>Rs {item.amount.toFixed(2)}</strong>
                      </td>

                      <td className="ledger-share">
                        <strong className={item.share > 0 ? "share-positive" : "share-negative"}>
                          {item.share > 0 ? "+" : "-"}Rs {Math.abs(item.share).toFixed(2)}
                        </strong>

                        <span>
                          {item.share > 0 ? "Owed to you" : "Your share"}
                        </span>
                      </td>

                    </tr>
                  );
                })}

                {visibleTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="ledger-empty">
                      <Filter size={22} />
                      <strong>No matching transactions found</strong>
                      <span>Try another search or transaction filter.</span>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {filteredTransactions.length > 6 && (
            <button
              type="button"
              className="ledger-view-more"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "View All Transactions"}
              <ChevronDown
                size={14}
                className={showAll ? "rotate-chevron" : ""}
              />
            </button>
          )}

          <div className="ledger-table-footer">
            <span>
              <ShieldCheck size={12} />
              Transaction records are reconciled with Room 402 ledger.
            </span>

            <button type="button" onClick={handleDownload}>
              <Download size={12} />
              Export Ledger
            </button>
          </div>

        </section>

        {/* RIGHT COLUMN */}

        <aside className="ledger-sidebar">

          {/* EXPENSE DISTRIBUTION */}

          <section className="distribution-card">

            <div className="distribution-heading">

              <div>
                <h2>{month} Distribution</h2>
                <p>Breakdown of your Rs 245.83 dues</p>
              </div>

              <div className="distribution-icon">
                <PieChart size={15} />
              </div>

            </div>

            {/* DONUT CHART */}

            <div className="donut-container">

              <div className="ledger-donut">

                <div className="donut-center">
                  <strong>Rs 245.83</strong>
                  <span>TOTAL SHARE</span>
                </div>

              </div>

            </div>

            {/* LEGEND */}

            <div className="distribution-legend">

              {categories.map((category) => (
                <div className="legend-item" key={category.name}>

                  <span
                    className="legend-dot"
                    style={{ background: category.color }}
                  />

                  <div className="legend-details">
                    <div>
                      <strong>{category.name}</strong>

                      <span>
                        {category.percentage}% (Rs {category.amount.toFixed(2)})
                      </span>
                    </div>

                    <div className="legend-progress">
                      <span
                        style={{
                          width: `${category.percentage}%`,
                          background: category.color,
                        }}
                      />
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* MONTHLY OVERVIEW */}

          <section className="monthly-overview-card">

            <div className="distribution-heading">
              <div>
                <h2>Monthly Overview</h2>
                <p>Your financial activity at a glance</p>
              </div>

              <TrendingUp size={17} className="overview-icon" />
            </div>

            <div className="overview-metric">
              <div>
                <span>Total Monthly Dues</span>
                <strong>Rs 245.83</strong>
              </div>

              <div className="overview-metric-icon blue">
                <ReceiptText size={15} />
              </div>
            </div>

            <div className="overview-metric">
              <div>
                <span>Money Received</span>
                <strong className="overview-green">Rs 85.00</strong>
              </div>

              <div className="overview-metric-icon green">
                <ArrowDownLeft size={15} />
              </div>
            </div>

            <div className="overview-metric">
              <div>
                <span>Outstanding Balance</span>
                <strong className="overview-orange">Rs 42.50</strong>
              </div>

              <div className="overview-metric-icon orange">
                <Clock size={15} />
              </div>
            </div>

            <div className="ledger-standing">

              <div className="standing-icon">
                <BadgeCheck size={17} />
              </div>

              <div>
                <strong>Good Financial Standing</strong>
                <span>Resident record is up to date.</span>
              </div>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}
