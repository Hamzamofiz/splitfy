
import React, { useMemo, useState } from "react";
import {
  Wallet,
  ReceiptText,
  Users,
  Printer,
  Download,
  Search,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Zap,
  ShoppingCart,
  Wrench,
  Droplets,
  FileCheck2,
  ShieldCheck,
  TrendingDown,
  Clock,
  Filter,
} from "lucide-react";

import "./bills.css";

const invoices = [
  {
    id: "#INV-90228",
    date: "Oct 28, 2024",
    merchant: "LESCO Electricity Bill (Oct 2024)",
    description: "Sub-metered peak load cycle",
    category: "Utilities",
    paidBy: "Alex Rivera",
    method: "Custom Sub-Meter + Equal",
    total: 480,
    share: 74.67,
    icon: Zap,
    status: "Verified",
  },
  {
    id: "#INV-90225",
    date: "Oct 26, 2024",
    merchant: "WASA Clean Drinking Water Tanker",
    description: "Supply refilled for floor overhead tank",
    category: "Utilities",
    paidBy: "Zain Malik",
    method: "Equal (6-way)",
    total: 75,
    share: 12.50,
    icon: Droplets,
    status: "Verified",
  },
  {
    id: "#INV-90221",
    date: "Oct 24, 2024",
    merchant: "Geyser Thermostat & Element Fix",
    description: "Replaced copper heating rod & thermostat",
    category: "Maintenance",
    paidBy: "Hamza Tariq (You)",
    method: "Ensuite Users (3)",
    total: 140,
    share: 40,
    icon: Wrench,
    status: "Verified",
  },
  {
    id: "#INV-90218",
    date: "Oct 22, 2024",
    merchant: "Metro Cash & Carry Groceries",
    description: "Monthly kitchen staples and supplies",
    category: "Groceries",
    paidBy: "Bilal Ahmed",
    method: "Equal (6-way)",
    total: 350,
    share: 58.33,
    icon: ShoppingCart,
    status: "Verified",
  },
  {
    id: "#INV-90214",
    date: "Oct 19, 2024",
    merchant: "Fiber Internet Monthly Bill",
    description: "Shared broadband subscription",
    category: "Utilities",
    paidBy: "Alex Rivera",
    method: "Equal (6-way)",
    total: 65,
    share: 10.83,
    icon: ReceiptText,
    status: "Verified",
  },
  {
    id: "#INV-90210",
    date: "Oct 15, 2024",
    merchant: "Room Cleaning & Maintenance",
    description: "Common area cleaning service",
    category: "Maintenance",
    paidBy: "Daniyal Ahmed",
    method: "Equal (6-way)",
    total: 180,
    share: 30,
    icon: Wrench,
    status: "Pending",
  },
  {
    id: "#INV-90205",
    date: "Oct 12, 2024",
    merchant: "Kitchen Grocery Supplies",
    description: "Weekly grocery restocking",
    category: "Groceries",
    paidBy: "Zain Malik",
    method: "Equal (6-way)",
    total: 280,
    share: 46.67,
    icon: ShoppingCart,
    status: "Verified",
  },
  {
    id: "#INV-90201",
    date: "Oct 08, 2024",
    merchant: "Water & Plumbing Service",
    description: "Water line maintenance",
    category: "Maintenance",
    paidBy: "Hamza Tariq (You)",
    method: "Shared Maintenance",
    total: 275.50,
    share: 45.92,
    icon: Droplets,
    status: "Verified",
  },
];

const categories = [
  { id: "all", label: "All Categories (8)" },
  { id: "Utilities", label: "Utilities (Rs 820.00)" },
  { id: "Groceries", label: "Groceries (Rs 450.00)" },
  { id: "Maintenance", label: "Maintenance" },
];

export default function Audit() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("Oct 01, 2024 — Oct 31, 2024");
  const [showAll, setShowAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesCategory =
        activeCategory === "all" ||
        invoice.category === activeCategory;

      const matchesSearch =
        `${invoice.id} ${invoice.merchant} ${invoice.paidBy} ${invoice.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || invoice.status === statusFilter;

      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [activeCategory, search, statusFilter]);

  const visibleInvoices = showAll
    ? filteredInvoices
    : filteredInvoices.slice(0, 5);

  const printSummary = () => {
    window.print();
  };

  const exportAudit = () => {
    const headers = [
      "Invoice ID",
      "Date",
      "Description",
      "Category",
      "Paid By",
      "Split Method",
      "Total Amount",
      "Your Share",
      "Status",
    ];

    const rows = filteredInvoices.map((item) => [
      item.id,
      item.date,
      item.merchant,
      item.category,
      item.paidBy,
      item.method,
      item.total,
      item.share,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Splitfy-Monthly-Audit.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="audit-page">

      {/* HEADER */}

      <header className="audit-header">

        <div className="audit-header-content">

          <span className="audit-eyebrow">
            <span></span>
            ROOM 402 • SHARED AUDIT & EXPENSES
          </span>

          <h1>Monthly Expenses & Shared Audit Summary</h1>

          <p>
            Granular itemized ledger containing every shared expense,
            receipt attachment, sub-meter deduction, and roommate
            consensus status for active billing cycle.
          </p>

        </div>

        <div className="audit-header-actions">

          <button
            type="button"
            className="audit-print-btn"
            onClick={printSummary}
          >
            <Printer size={14} />
            Print Summary
          </button>

          <button
            type="button"
            className="audit-export-btn"
            onClick={exportAudit}
          >
            <Download size={14} />
            Export Full Audit CSV
          </button>

        </div>

      </header>

      {/* SUMMARY CARDS */}

      <section className="audit-stats">

        <article className="audit-stat-card gross-card">

          <div className="audit-stat-top">
            <span>TOTAL ROOM EXPENSES (GROSS)</span>

            <div className="audit-stat-icon teal">
              <Wallet size={16} />
            </div>
          </div>

          <div className="audit-stat-value">
            Rs 1,845.50
          </div>

          <div className="audit-stat-change">
            <TrendingDown size={11} />
            -3.4%
          </div>

          <div className="audit-stat-description">
            Consolidated across all 6 verified residents
          </div>

          <div className="audit-stat-footer">
            <span>Your calculated portion:</span>
            <strong>Rs 307.58 (Net active)</strong>
          </div>

        </article>

        <article className="audit-stat-card invoice-card">

          <div className="audit-stat-top">
            <span>TOTAL INVOICES UPLOADED</span>

            <div className="audit-stat-icon orange">
              <ReceiptText size={16} />
            </div>
          </div>

          <div className="audit-stat-value invoice-value">
            8 Bills
            <span>100% Verified</span>
          </div>

          <div className="audit-stat-description">
            All verified with physical receipts & vendor serials
          </div>

          <div className="audit-stat-footer">
            <span>Source of Truth:</span>
            <strong>Verified via Roommate Consensus • Suite 402</strong>
          </div>

        </article>

        <article className="audit-stat-card consensus-card">

          <div className="audit-stat-top">
            <span>CONSENSUS RATE</span>

            <div className="audit-stat-icon blue">
              <Users size={16} />
            </div>
          </div>

          <div className="audit-stat-value consensus-value">
            94.2%
            <span>Peer Approved</span>
          </div>

          <div className="audit-stat-description">
            45 of 48 individual sign-offs registered
          </div>

          <div className="audit-stat-footer">
            <span>Pending resolution:</span>
            <strong className="pending-text">2 resident approvals</strong>
          </div>

        </article>

      </section>

      {/* FILTER BAR */}

      <section className="audit-filter-bar">

        <div className="audit-category-tabs">

          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={
                activeCategory === category.id
                  ? "audit-category active"
                  : "audit-category"
              }
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}

        </div>

        <div className="audit-filter-tools">

          <div className="audit-search-box">
            <Search size={14} />

            <input
              type="text"
              placeholder="Search by merchant, invoice #, payer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <label className="audit-date-box">
            <CalendarDays size={13} />

            <input
              type="text"
              aria-label="Billing date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />

            <ChevronDown size={12} />
          </label>

        </div>

      </section>

      {/* STATUS FILTER */}

      <div className="audit-status-bar">

        <div className="audit-status-label">
          <Filter size={13} />
          Invoice Records
        </div>

        <div className="audit-status-filters">

          {["All", "Verified", "Pending"].map((status) => (
            <button
              type="button"
              key={status}
              className={statusFilter === status ? "selected" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}

        </div>

        <span className="audit-record-count">
          {filteredInvoices.length} records found
        </span>

      </div>

      {/* INVOICE TABLE */}

      <section className="audit-table-card">

        <div className="audit-table-wrapper">

          <table className="audit-table">

            <thead>
              <tr>
                <th>INVOICE ID</th>
                <th>DATE</th>
                <th>DESCRIPTION & MERCHANT</th>
                <th>CATEGORY</th>
                <th>PAID BY</th>
                <th>SPLIT METHOD</th>
                <th>TOTAL AMOUNT</th>
                <th>YOUR SHARE</th>
              </tr>
            </thead>

            <tbody>

              {visibleInvoices.map((invoice) => {
                const Icon = invoice.icon;

                return (
                  <tr key={invoice.id}>

                    <td className="audit-invoice-id">
                      {invoice.id}
                    </td>

                    <td className="audit-date-cell">
                      {invoice.date}
                    </td>

                    <td className="audit-merchant-cell">

                      <div className="audit-merchant">

                        <div className="audit-merchant-icon">
                          <Icon size={14} />
                        </div>

                        <div>
                          <strong>{invoice.merchant}</strong>
                          <span>{invoice.description}</span>
                        </div>

                      </div>

                    </td>

                    <td>
                      <span className={`audit-category-badge ${invoice.category.toLowerCase()}`}>
                        {invoice.category}
                      </span>
                    </td>

                    <td className="audit-paid-by">
                      {invoice.paidBy}
                    </td>

                    <td className="audit-split-method">
                      {invoice.method}
                    </td>

                    <td className="audit-total-amount">
                      Rs {invoice.total.toFixed(2)}
                    </td>

                    <td className="audit-your-share">
                      Rs {invoice.share.toFixed(2)}
                    </td>

                  </tr>
                );
              })}

              {visibleInvoices.length === 0 && (
                <tr>
                  <td colSpan="8" className="audit-empty">
                    <ReceiptText size={25} />
                    <strong>No invoices found</strong>
                    <span>Try changing your filters or search keyword.</span>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {filteredInvoices.length > 5 && (
          <button
            type="button"
            className="audit-view-more"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All Invoices"}
            <ChevronDown
              size={14}
              className={showAll ? "audit-chevron-up" : ""}
            />
          </button>
        )}

      </section>

      {/* AUDIT FOOTER */}

      <section className="audit-footer">

        <div className="audit-footer-icon">
          <ShieldCheck size={18} />
        </div>

        <div>
          <strong>Transparent Roommate Accounting</strong>
          <span>
            Every shared expense is recorded with its payer, split method,
            invoice reference and individual resident share.
          </span>
        </div>

        <div className="audit-footer-status">
          <CheckCircle2 size={13} />
          Audit Records Available
        </div>

      </section>

    </div>
  );
}
