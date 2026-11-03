
import React, { useState } from "react";
import {
  FileText,
  Clock3,
  Wallet,
  FilePlus2,
  Download,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize,
  Droplet,
  Zap,
  Wrench,
  ShoppingBasket,
  ShieldCheck,
  Upload,
  Check,
  X,
  Users,
  CalendarDays
} from "lucide-react";

import "./manager.css";

const initialInvoices = [
  {
    id: 1,
    name: "LESCO_Electricity_October.pdf",
    shortName: "LESCO_Electricity_Oct...",
    vendor: "LESCO Electricity Bill",
    category: "Utilities",
    amount: 480,
    date: "Oct 18, 2024",
    reference: "8932471",
    confidence: "99.8%",
    status: "Awaiting 2 Signoffs",
    paid: false,
    approvals: "4 of 6 Confirmed",
    type: "PDF",
    color: "electric",
    due: "Due in 4 Days"
  },
  {
    id: 2,
    name: "Nayatel_100Mbps_Fiber.pdf",
    shortName: "Nayatel_100Mbps_Fiber...",
    vendor: "Nayatel Internet Bill",
    category: "Internet Broadband",
    amount: 65,
    date: "Oct 16, 2024",
    reference: "NAY-10482",
    confidence: "99.6%",
    status: "Paid & Cleared",
    paid: true,
    approvals: "6/6 Cleared",
    type: "PDF",
    color: "internet",
    due: "Paid"
  },
  {
    id: 3,
    name: "Plumber_Drain_Replacement.jpg",
    shortName: "Plumber_Drain_Replac...",
    vendor: "Plumbing Repair Invoice",
    category: "Maintenance",
    amount: 85,
    date: "Oct 11, 2024",
    reference: "PL-449",
    confidence: "98.2%",
    status: "Approved",
    paid: true,
    approvals: "5/6 Approved",
    type: "JPG",
    color: "maintenance",
    due: "Verified"
  },
  {
    id: 4,
    name: "Water_Supply_Tanker_5000L.pdf",
    shortName: "Water_Supply_Tanker_5...",
    vendor: "Water Supply Tanker",
    category: "Utilities",
    amount: 45,
    date: "Oct 09, 2024",
    reference: "WT-5021",
    confidence: "99.1%",
    status: "Approved",
    paid: true,
    approvals: "6/6 Cleared",
    type: "PDF",
    color: "water",
    due: "Verified"
  },
  {
    id: 5,
    name: "Grocery_Common_Supplies.pdf",
    shortName: "Grocery_Common_Supplies...",
    vendor: "Common Grocery Supplies",
    category: "Groceries & Water",
    amount: 125,
    date: "Oct 07, 2024",
    reference: "GR-1002",
    confidence: "97.8%",
    status: "In Dispute",
    paid: false,
    approvals: "2/6 Confirmed",
    type: "PDF",
    color: "grocery",
    due: "Review Required"
  }
];

const categories = [
  { name: "All Categories", icon: FileText },
  { name: "Utilities", icon: Zap },
  { name: "Maintenance", icon: Wrench },
  { name: "Groceries & Water", icon: ShoppingBasket }
];

function BillIcon({ color, type }) {
  const Icon =
    color === "water"
      ? Droplet
      : color === "maintenance"
      ? Wrench
      : color === "internet"
      ? FileText
      : type === "JPG"
      ? FileText
      : Zap;

  return (
    <div className={`invoice-file-icon ${color}`}>
      <Icon size={17} />
      <span>{type}</span>
    </div>
  );
}

export default function BillIngestion() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedId, setSelectedId] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortNewest, setSortNewest] = useState(true);
  const [zoom, setZoom] = useState(100);

  const selectedInvoice = invoices.find(
    (invoice) => invoice.id === selectedId
  );

  const filteredInvoices = invoices
    .filter((invoice) => {
      const categoryMatch =
        activeCategory === "All Categories" ||
        invoice.category === activeCategory;

      const searchMatch =
        invoice.name.toLowerCase().includes(search.toLowerCase()) ||
        invoice.vendor.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        activeFilter === "All" ||
        (activeFilter === "Approved" &&
          invoice.status === "Approved") ||
        (activeFilter === "Pending" &&
          invoice.status.includes("Signoffs")) ||
        (activeFilter === "Dispute" &&
          invoice.status === "In Dispute");

      return categoryMatch && searchMatch && statusMatch;
    })
    .sort((a, b) =>
      sortNewest
        ? b.id - a.id
        : a.id - b.id
    );

  const pendingCount = invoices.filter(
    (invoice) => invoice.status.includes("Signoffs")
  ).length;

  const monthlySum = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  const handleApproval = () => {
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === selectedId
          ? {
              ...invoice,
              status: "Approved",
              approvals: "6/6 Confirmed",
              paid: true
            }
          : invoice
      )
    );
  };

  const handleDispute = () => {
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === selectedId
          ? { ...invoice, status: "In Dispute" }
          : invoice
      )
    );
  };

  const handleUpload = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const newInvoices = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      shortName:
        file.name.length > 24
          ? file.name.slice(0, 21) + "..."
          : file.name,
      vendor: file.name.split(".")[0].replaceAll("_", " "),
      category: "Utilities",
      amount: 0,
      date: "New Upload",
      reference: "Pending OCR",
      confidence: "Processing",
      status: "Awaiting 2 Signoffs",
      paid: false,
      approvals: "0 of 6 Confirmed",
      type: file.name.toLowerCase().endsWith(".jpg")
        ? "JPG"
        : "PDF",
      color: "electric",
      due: "OCR Pending"
    }));

    setInvoices((previous) => [...newInvoices, ...previous]);
    setSelectedId(newInvoices[0].id);
    setActiveCategory("All Categories");
    setActiveFilter("All");
  };

  return (
    <div className="bill-ingestion-page">

      {/* HERO HEADER */}

      <section className="bill-hero">

        <div className="bill-hero-content">

          <div className="bill-breadcrumb">
            <ShieldCheck size={11} />
            Room 402 • Bill Ingestion & Approvals
          </div>

          <h1>
            PDF Utility Bill Ingestion &amp;
            <br />
            Roommate Expense Manager
          </h1>

          <p>
            Manage and review all uploaded bills, invoices, and
            roommate approvals in one place easily.
          </p>

        </div>

        <div className="hero-metrics">

          <div className="hero-metric">
            <div className="hero-metric-icon blue">
              <FileText size={17} />
            </div>

            <div>
              <span>Ingestion Queue</span>
              <strong>{invoices.length} Docs</strong>
            </div>
          </div>

          <div className="hero-metric">
            <div className="hero-metric-icon orange">
              <Clock3 size={17} />
            </div>

            <div>
              <span>Pending Signoffs</span>
              <strong>{pendingCount} Actionable</strong>
            </div>
          </div>

          <div className="hero-metric">
            <div className="hero-metric-icon green">
              <Wallet size={17} />
            </div>

            <div>
              <span>Monthly Sum</span>
              <strong>Rs {monthlySum.toFixed(2)}</strong>
            </div>
          </div>

        </div>

      </section>

      {/* FILTER TOOLBAR */}

      <section className="bill-toolbar">

        <div className="bill-toolbar-top">

          <div className="bill-category-tabs">

            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.name}
                  className={
                    activeCategory === category.name
                      ? "category-tab active"
                      : "category-tab"
                  }
                  onClick={() => setActiveCategory(category.name)}
                >
                  {index !== 0 && <Icon size={12} />}
                  {category.name}

                  {index === 0 && (
                    <span className="category-count">
                      {invoices.length}
                    </span>
                  )}
                </button>
              );
            })}

          </div>

          <div className="bill-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search vendor or invoice..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span>⌘K</span>
          </div>

          <label className="batch-upload">
            <FilePlus2 size={14} />
            + Batch Upload PDF Invoices

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleUpload}
            />
          </label>

        </div>

        <div className="bill-status-filters">

          {[
            { label: "Approved", value: "Approved", color: "green" },
            { label: "Pending Peer Verification", value: "Pending", color: "orange" },
            { label: "In Dispute", value: "Dispute", color: "blue" }
          ].map((filter) => (
            <button
              key={filter.value}
              className={
                activeFilter === filter.value
                  ? "status-filter selected"
                  : "status-filter"
              }
              onClick={() => setActiveFilter(
                activeFilter === filter.value ? "All" : filter.value
              )}
            >
              <span className={filter.color}></span>
              {filter.label}

              {filter.value === "Pending" && ` (${pendingCount})`}
              {filter.value === "Dispute" &&
                ` (${invoices.filter(i => i.status === "In Dispute").length})`}
            </button>
          ))}

        </div>

      </section>

      {/* MAIN CONTENT */}

      <main className="bill-main">

        {/* LEFT INVOICE LIST */}

        <section className="invoice-sidebar">

          <div className="invoice-sidebar-heading">

            <div>
              <h2>Ingested Invoices</h2>
              <span>{filteredInvoices.length} Active</span>
            </div>

            <button
              className="sort-button"
              onClick={() => setSortNewest(!sortNewest)}
            >
              <ArrowUpDown size={12} />
              {sortNewest ? "Sort by Date" : "Oldest First"}
            </button>

            <button
              className="filter-icon-button"
              onClick={() => {
                setActiveFilter("All");
                setActiveCategory("All Categories");
                setSearch("");
              }}
              title="Reset filters"
            >
              <SlidersHorizontal size={15} />
            </button>

          </div>

          <div className="invoice-list">

            {filteredInvoices.map((invoice) => (
              <button
                key={invoice.id}
                className={
                  selectedId === invoice.id
                    ? "invoice-card selected-invoice"
                    : "invoice-card"
                }
                onClick={() => setSelectedId(invoice.id)}
              >

                <BillIcon
                  color={invoice.color}
                  type={invoice.type}
                />

                <div className="invoice-info">

                  <div className="invoice-card-top">
                    <strong>{invoice.shortName}</strong>
                    <b>Rs {invoice.amount.toFixed(2)}</b>
                  </div>

                  <div className="invoice-card-details">
                    <span className={`invoice-category ${invoice.color}`}>
                      {invoice.category}
                    </span>

                    <span>•</span>

                    <span>{invoice.paid ? "Paid" : "Due"} {invoice.date}</span>

                    {invoice.due !== "Paid" && invoice.id === 1 && (
                      <span className="due-badge">Due in 4 Days</span>
                    )}
                  </div>

                  <div className="invoice-approval-row">
                    <span>
                      {invoice.status === "In Dispute"
                        ? "Dispute Review"
                        : "Roommate Approval"}
                    </span>

                    <strong>{invoice.approvals}</strong>
                  </div>

                  <div className="invoice-progress">
                    <span
                      style={{
                        width:
                          invoice.approvals.startsWith("6")
                            ? "100%"
                            : invoice.approvals.startsWith("5")
                            ? "83%"
                            : invoice.approvals.startsWith("4")
                            ? "67%"
                            : "33%"
                      }}
                    ></span>
                  </div>

                </div>

              </button>
            ))}

            {filteredInvoices.length === 0 && (
              <div className="no-invoices">
                <Search size={24} />
                <strong>No invoices found</strong>
                <span>Try changing your filters or search.</span>
              </div>
            )}

          </div>

        </section>

        {/* RIGHT PDF PREVIEW */}

        <section className="bill-preview-panel">

          {selectedInvoice && (
            <>

              <div className="preview-heading">

                <div className="preview-document-icon">
                  <FileText size={22} />
                </div>

                <div className="preview-title">
                  <h2>{selectedInvoice.vendor}</h2>
                  <h3>– {selectedInvoice.date}</h3>

                  <div className="preview-meta">
                    <span>
                      <ShieldCheck size={11} />
                      Ref: {selectedInvoice.reference}
                    </span>

                    <span>
                      • Uploaded by Room Admin
                    </span>
                  </div>
                </div>

                <span className={`approval-badge ${
                  selectedInvoice.status === "Approved"
                    ? "approved"
                    : selectedInvoice.status === "In Dispute"
                    ? "disputed"
                    : "pending"
                }`}>
                  {selectedInvoice.status}
                </span>

                <button
                  className="raw-pdf-button"
                  onClick={() => alert("Connect uploaded file storage to open the original document.")}
                >
                  <Download size={13} />
                  Raw PDF
                </button>

              </div>

              {/* DOCUMENT INFORMATION */}

              <div className="document-details-grid">

                <div>
                  <span>Billing Vendor</span>
                  <strong>{selectedInvoice.vendor}</strong>
                </div>

                <div>
                  <span>OCR Confidence</span>
                  <strong className="confidence-value">
                    <CheckCircle2 size={12} />
                    {selectedInvoice.confidence}
                  </strong>
                </div>

                <div>
                  <span>Reference / Bill ID</span>
                  <strong>#{selectedInvoice.reference}</strong>
                </div>

                <div>
                  <span>File Payload</span>
                  <strong>2.8 MB (Native PDF)</strong>
                </div>

              </div>

              {/* PDF VIEWER */}

              <div className="pdf-viewer">

                <div className="pdf-viewer-toolbar">

                  <div>
                    <Eye size={13} />
                    Page 1 of 1 • Optical Extraction Overlay
                  </div>

                  <div className="pdf-zoom-controls">

                    <button
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                    >
                      <ZoomOut size={13} />
                    </button>

                    <span>{zoom}%</span>

                    <button
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                    >
                      <ZoomIn size={13} />
                    </button>

                    <button
                      onClick={() => setZoom(100)}
                    >
                      <Maximize size={13} />
                    </button>

                  </div>

                </div>

                {/* DOCUMENT MOCKUP */}

                <div className="pdf-document-area">

                  <div
                    className="pdf-paper"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "top center"
                    }}
                  >

                    <div className="pdf-company-header">
                      <div className="pdf-company-brand">
                        <Zap size={15} />
                        PAKISTAN ELECTRIC POWER COMPANY
                      </div>

                      <span>OCT-2024</span>
                    </div>

                    <h3>{selectedInvoice.vendor.toUpperCase()}</h3>

                    <p>Sub-Division: G-10/4 Islamabad | Tariff: A-1a</p>
                    <p>Commercial Hostel</p>

                    <div className="pdf-ref-number">
                      Ref No: #{selectedInvoice.reference}
                    </div>

                    <div className="ocr-tags">
                      <span>OCR: UNITS</span>
                      <span>OCR: DUE</span>
                      <span>OCR: NET TOTAL</span>
                    </div>

                    <div className="pdf-data-grid">

                      <div>
                        <small>Units Consumed</small>
                        <strong>1,120 kWh</strong>
                      </div>

                      <div>
                        <small>Due Date</small>
                        <strong>18 OCT 2024</strong>
                      </div>

                      <div>
                        <small>Payable Within Due Date</small>
                        <strong>Rs {selectedInvoice.amount.toFixed(2)}</strong>
                      </div>

                    </div>

                    <div className="pdf-total">
                      <span>NET PAYABLE AMOUNT</span>
                      <strong>
                        Rs {selectedInvoice.amount.toFixed(2)}
                      </strong>
                    </div>

                    <div className="pdf-stamp">
                      DIGITALLY INGESTED • ROOM 402
                    </div>

                  </div>

                </div>

              </div>

              {/* APPROVAL ACTIONS */}

              <div className="approval-action-panel">

                <div className="approval-action-heading">
                  <div>
                    <Users size={15} />
                    <strong>Roommate Verification</strong>
                  </div>

                  <span>{selectedInvoice.approvals}</span>
                </div>

                <div className="approval-action-buttons">

                  <button
                    className="approve-invoice"
                    onClick={handleApproval}
                    disabled={selectedInvoice.status === "Approved"}
                  >
                    <Check size={14} />
                    Approve Invoice
                  </button>

                  <button
                    className="dispute-invoice"
                    onClick={handleDispute}
                  >
                    <AlertCircle size={14} />
                    Raise Dispute
                  </button>

                </div>

              </div>

            </>

          )}

        </section>

      </main>

      <footer className="bill-footer">
        <span>
          <ShieldCheck size={13} />
          Room 402 • Financial Document Management
        </span>

        <span>
          <CalendarDays size={13} />
          October 2024 Billing Cycle
        </span>
      </footer>

    </div>
  );
}
