
import React, { useMemo, useRef, useState } from "react";
import {
  FileText,
  FileUp,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Receipt,
  Zap,
  Droplets,
  Wrench,
  Wifi,
  ChevronRight,
  X,
  Check,
  Plus,
  CalendarDays,
  Building2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import "./expense.css";

const initialInvoices = [
  {
    id: 1,
    name: "LESCO_Electricity_October.pdf",
    vendor: "LESCO Electricity Bill – October",
    category: "Electricity",
    shortCategory: "Electricity",
    date: "Oct 18, 2024",
    amount: 4800,
    status: "Pending Peer Verification",
    approvals: 4,
    totalApprovals: 6,
    confidence: "99.8%",
    reference: "89432741",
    account: "04-11234-5678901-U",
    size: "2.8 MB",
    payable: "2.8 MB (Native PDF)",
    units: "1,120 kWh",
    dueDate: "19 OCT",
    color: "teal",
    initials: "LE",
    type: "PDF",
  },
  {
    id: 2,
    name: "Nayatel_100Mbps_Fiber.pdf",
    vendor: "Nayatel Broadband – October",
    category: "Utilities",
    shortCategory: "Broadband",
    date: "Oct 15, 2024",
    amount: 6500,
    status: "Approved",
    approvals: 6,
    totalApprovals: 6,
    confidence: "98.5%",
    reference: "NY-452810",
    account: "Nayatel Account 402",
    size: "1.4 MB",
    payable: "1.4 MB (Native PDF)",
    units: "100 Mbps",
    dueDate: "22 OCT",
    color: "blue",
    initials: "NY",
    type: "PDF",
  },
  {
    id: 3,
    name: "Plumber_Drain_Replacement.jpg",
    vendor: "Plumber Drain Replacement",
    category: "Maintenance",
    shortCategory: "Maintenance",
    date: "Oct 11, 2024",
    amount: 8500,
    status: "Approved",
    approvals: 5,
    totalApprovals: 6,
    confidence: "97.2%",
    reference: "PL-2024-110",
    account: "Maintenance Service",
    size: "850 KB",
    payable: "850 KB (Image)",
    units: "Drain repair",
    dueDate: "PAID",
    color: "orange",
    initials: "PL",
    type: "JPG",
  },
  {
    id: 4,
    name: "Water_Supply_Tanker_5.png",
    vendor: "Water Supply Tanker",
    category: "Utilities",
    shortCategory: "Utilities",
    date: "Oct 09, 2024",
    amount: 4500,
    status: "Approved",
    approvals: 6,
    totalApprovals: 6,
    confidence: "99.1%",
    reference: "WT-402-509",
    account: "Water Supply",
    size: "420 KB",
    payable: "420 KB (Image)",
    units: "1 Tanker",
    dueDate: "PAID",
    color: "blue",
    initials: "WS",
    type: "PNG",
  },
  {
    id: 5,
    name: "Grocery_Shared_Expenses.pdf",
    vendor: "Monthly Grocery Expenses",
    category: "Groceries & Water",
    shortCategory: "Groceries",
    date: "Oct 07, 2024",
    amount: 12500,
    status: "In Dispute",
    approvals: 2,
    totalApprovals: 6,
    confidence: "96.4%",
    reference: "GR-402-007",
    account: "Shared Grocery",
    size: "1.1 MB",
    payable: "1.1 MB (Native PDF)",
    units: "Monthly supplies",
    dueDate: "25 OCT",
    color: "orange",
    initials: "GR",
    type: "PDF",
  },
];

const categories = [
  "All Categories",
  "Utilities",
  "Maintenance",
  "Groceries & Water",
];

const formatPKR = (amount) =>
  `Rs ${Number(amount).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}.00`;

const BillIngestion = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedId, setSelectedId] = useState(1);
  const [category, setCategory] = useState("All Categories");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOpen, setSortOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [zoom, setZoom] = useState(100);
  const [showFilters, setShowFilters] = useState(false);
  const [approvals, setApprovals] = useState({});
  const fileInputRef = useRef(null);

  const selectedInvoice = invoices.find(
    (invoice) => invoice.id === selectedId
  );

  const pendingCount = invoices.filter(
    (invoice) => invoice.status === "Pending Peer Verification"
  ).length;

  const activeCount = invoices.length;

  const monthlyTotal = invoices.reduce(
    (total, invoice) => total + invoice.amount,
    0
  );

  const approvedCount = invoices.filter(
    (invoice) => invoice.status === "Approved"
  ).length;

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    if (category !== "All Categories") {
      result = result.filter((invoice) =>
        category === "Utilities"
          ? invoice.category === "Utilities" ||
            invoice.category === "Electricity"
          : invoice.category === category
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((invoice) => invoice.status === statusFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (invoice) =>
          invoice.vendor.toLowerCase().includes(query) ||
          invoice.name.toLowerCase().includes(query) ||
          invoice.category.toLowerCase().includes(query) ||
          invoice.reference.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "name") return a.vendor.localeCompare(b.vendor);
      return b.id - a.id;
    });

    return result;
  }, [invoices, category, statusFilter, search, sortBy]);

  const uploadFiles = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const allowedFiles = files.filter((file) =>
      ["application/pdf", "image/png", "image/jpeg"].includes(file.type)
    );

    if (!allowedFiles.length) {
      setNotice("Please select PDF, PNG or JPG files.");
      event.target.value = "";
      return;
    }

    const newInvoices = allowedFiles.map((file, index) => {
      const isPDF = file.type === "application/pdf";

      return {
        id: Date.now() + index,
        name: file.name,
        vendor: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
        category: "Utilities",
        shortCategory: "New Upload",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        amount: 0,
        status: "Pending Peer Verification",
        approvals: 0,
        totalApprovals: 6,
        confidence: "Processing",
        reference: "Awaiting extraction",
        account: "Awaiting extraction",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        payable: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        units: "Awaiting extraction",
        dueDate: "Pending",
        color: "teal",
        initials: file.name.slice(0, 2).toUpperCase(),
        type: isPDF ? "PDF" : file.type.split("/")[1].toUpperCase(),
        file,
        fileURL: URL.createObjectURL(file),
      };
    });

    setInvoices((prev) => [...newInvoices, ...prev]);
    setSelectedId(newInvoices[0].id);
    setCategory("All Categories");
    setStatusFilter("All");
    setSearch("");
    setNotice(`${newInvoices.length} file(s) added to the ingestion queue.`);
    event.target.value = "";
  };

  const approveInvoice = () => {
    if (!selectedInvoice) return;

    if (selectedInvoice.status === "Approved") {
      setNotice("This invoice has already been approved.");
      return;
    }

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === selectedId
          ? {
              ...invoice,
              status: "Approved",
              approvals: invoice.totalApprovals,
            }
          : invoice
      )
    );

    setNotice("Invoice approved successfully.");
  };

  const rejectInvoice = () => {
    if (!selectedInvoice) return;

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === selectedId
          ? { ...invoice, status: "In Dispute" }
          : invoice
      )
    );

    setNotice("Invoice moved to In Dispute.");
  };

  const downloadInvoice = () => {
    if (!selectedInvoice) return;

    if (selectedInvoice.fileURL) {
      const link = document.createElement("a");
      link.href = selectedInvoice.fileURL;
      link.download = selectedInvoice.name;
      link.click();
      return;
    }

    setNotice("Original file is not attached to this sample invoice.");
  };

  const deleteInvoice = () => {
    if (!selectedInvoice) return;

    const id = selectedId;

    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));

    if (selectedInvoice.fileURL) {
      URL.revokeObjectURL(selectedInvoice.fileURL);
    }

    const next = invoices.find((invoice) => invoice.id !== id);
    setSelectedId(next?.id || null);
    setNotice("Invoice removed from the list.");
  };

  const getCategoryIcon = (cat) => {
    if (cat === "Electricity") return <Zap size={14} />;
    if (cat === "Maintenance") return <Wrench size={14} />;
    if (cat === "Broadband") return <Wifi size={14} />;
    if (cat === "Utilities") return <Droplets size={14} />;
    return <Receipt size={14} />;
  };

  const getStatusClass = (status) => {
    if (status === "Approved") return "approved";
    if (status === "In Dispute") return "disputed";
    return "pending";
  };

  return (
    <main className="bill-page">

      {/* TOP BANNER */}
      <section className="bill-hero">
        <div className="bill-hero-content">
          <span className="bill-breadcrumb">
            <Receipt size={10} />
            Room 402 • Bill Ingestion & Approvals
          </span>

          <h1>
            PDF Utility Bill
            <br />
            Ingestion &
            <br />
            Roommate Expense Manager
          </h1>

          <p>
            Manage and review all uploaded bills, invoices, and roommate
            approvals in one place easily.
          </p>
        </div>

        <div className="bill-stats">
          <div className="bill-stat">
            <div className="bill-stat-icon cyan">
              <Receipt size={17} />
            </div>
            <div>
              <span>Ingestion Queue</span>
              <strong>{activeCount} Docs</strong>
            </div>
          </div>

          <div className="bill-stat">
            <div className="bill-stat-icon orange">
              <Clock3 size={17} />
            </div>
            <div>
              <span>Pending Signoffs</span>
              <strong>{pendingCount} Actionable</strong>
            </div>
          </div>

          <div className="bill-stat">
            <div className="bill-stat-icon blue">
              <Receipt size={17} />
            </div>
            <div>
              <span>Monthly Sum</span>
              <strong>{formatPKR(monthlyTotal)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bill-toolbar">
        <div className="bill-filter-left">
          <div className="category-tabs">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
                {item === "All Categories" && (
                  <span className="category-count">
                    {invoices.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="status-filters">
            <button
              className={statusFilter === "Approved" ? "selected" : ""}
              onClick={() =>
                setStatusFilter(statusFilter === "Approved" ? "All" : "Approved")
              }
            >
              <i className="status-dot green"></i>
              Approved
            </button>

            <button
              className={
                statusFilter === "Pending Peer Verification" ? "selected" : ""
              }
              onClick={() =>
                setStatusFilter(
                  statusFilter === "Pending Peer Verification"
                    ? "All"
                    : "Pending Peer Verification"
                )
              }
            >
              <i className="status-dot orange"></i>
              Pending Peer Verification ({pendingCount})
            </button>

            <button
              className={statusFilter === "In Dispute" ? "selected" : ""}
              onClick={() =>
                setStatusFilter(
                  statusFilter === "In Dispute" ? "All" : "In Dispute"
                )
              }
            >
              <i className="status-dot blue"></i>
              In Dispute ({invoices.filter(i => i.status === "In Dispute").length})
            </button>
          </div>
        </div>

        <div className="bill-toolbar-actions">
          <div className="bill-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search vendor or invoice..."
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
            className="upload-bills-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp size={14} />
            + Batch Upload PDF Invoices
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            hidden
            onChange={uploadFiles}
          />
        </div>
      </section>

      {/* MAIN WORKSPACE */}
      <section className="bill-workspace">

        {/* LEFT INVOICE LIST */}
        <div className="invoice-column">

          <div className="invoice-list-heading">
            <div>
              <h2>Ingested Invoices</h2>
              <span>{activeCount} Active</span>
            </div>

            <div className="invoice-heading-actions">
              <div className="sort-wrapper">
                <button
                  className="sort-btn"
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  <ArrowUpDown size={12} />
                  Sort by {sortBy === "date" ? "Date" : sortBy === "amount" ? "Amount" : "Name"}
                </button>

                {sortOpen && (
                  <div className="sort-menu">
                    <button onClick={() => { setSortBy("date"); setSortOpen(false); }}>
                      Date
                    </button>
                    <button onClick={() => { setSortBy("amount"); setSortOpen(false); }}>
                      Amount
                    </button>
                    <button onClick={() => { setSortBy("name"); setSortOpen(false); }}>
                      Vendor name
                    </button>
                  </div>
                )}
              </div>

              <button
                className="filter-icon-btn"
                onClick={() => setShowFilters(!showFilters)}
                title="Toggle filters"
              >
                <SlidersHorizontal size={14} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="extra-filter-panel">
              <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
              <button onClick={() => {
                setCategory("All Categories");
                setStatusFilter("All");
                setSearch("");
              }}>
                Clear all filters
              </button>
            </div>
          )}

          <div className="invoice-list">
            {filteredInvoices.length === 0 ? (
              <div className="empty-invoices">
                <FileText size={30} />
                <strong>No invoices found</strong>
                <span>Try changing your search or filters.</span>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <button
                  key={invoice.id}
                  className={`invoice-item ${
                    selectedId === invoice.id ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedId(invoice.id);
                    setZoom(100);
                  }}
                >
                  <div className={`invoice-file-icon ${invoice.color}`}>
                    <FileText size={19} />
                    <small>{invoice.type}</small>
                  </div>

                  <div className="invoice-main-info">
                    <div className="invoice-title-row">
                      <strong title={invoice.name}>{invoice.name}</strong>
                      <strong className="invoice-amount">
                        {formatPKR(invoice.amount)}
                      </strong>
                    </div>

                    <div className="invoice-meta">
                      <span>{invoice.shortCategory}</span>
                      <i>•</i>
                      <span>{invoice.date}</span>
                      <em className={getStatusClass(invoice.status)}>
                        {invoice.status === "Pending Peer Verification"
                          ? "Due in 4 Days"
                          : invoice.status === "In Dispute"
                          ? "In Dispute"
                          : "Approved"}
                      </em>
                    </div>

                    <div className="invoice-approval-row">
                      <span>Roommate Approval</span>
                      <strong>
                        {invoice.approvals} of {invoice.totalApprovals} Confirmed
                      </strong>
                    </div>

                    <div className="invoice-progress">
                      <span
                        style={{
                          width: `${(invoice.approvals / invoice.totalApprovals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT DETAIL PANEL */}
        <div className="invoice-detail-column">
          {!selectedInvoice ? (
            <div className="no-selection">
              <FileText size={38} />
              <h3>Select an invoice</h3>
              <p>Choose an invoice from the list to see its details.</p>
            </div>
          ) : (
            <>
              {/* INVOICE DETAIL HEADER */}
              <div className="detail-heading">
                <div className={`detail-vendor-icon ${selectedInvoice.color}`}>
                  {getCategoryIcon(selectedInvoice.category)}
                </div>

                <div className="detail-title">
                  <h2>{selectedInvoice.vendor}</h2>
                  <span>Ref: {selectedInvoice.account}</span>
                  <small>
                    <span className="green-dot"></span>
                    Uploaded by Alex Rivera (Today, 09:42 AM)
                  </small>
                </div>

                <span className={`detail-status ${getStatusClass(selectedInvoice.status)}`}>
                  {selectedInvoice.status === "Pending Peer Verification"
                    ? "AWAITING 2 SIGNOFFS"
                    : selectedInvoice.status === "Approved"
                    ? "FULLY APPROVED"
                    : "IN DISPUTE"}
                </span>

                <button
                  className="download-raw-btn"
                  onClick={downloadInvoice}
                >
                  <Download size={13} />
                  Raw PDF
                </button>

                <button
                  className="delete-invoice-btn"
                  onClick={deleteInvoice}
                  title="Remove invoice"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* EXTRACTION DETAILS */}
              <div className="extraction-summary">
                <div>
                  <span>Billing Vendor</span>
                  <strong>{selectedInvoice.vendor.split("–")[0]}</strong>
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
                  <strong>{selectedInvoice.payable}</strong>
                </div>
              </div>

              {/* DOCUMENT PREVIEW */}
              <div className="document-preview">
                <div className="preview-toolbar">
                  <div>
                    <Eye size={13} />
                    Page 1 of 1 • Optical Extraction Overlay
                  </div>

                  <div className="preview-tools">
                    <button
                      onClick={() => setZoom(Math.max(60, zoom - 10))}
                      title="Zoom out"
                    >
                      <ZoomOut size={13} />
                    </button>

                    <span>{zoom}%</span>

                    <button
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                      title="Zoom in"
                    >
                      <ZoomIn size={13} />
                    </button>

                    <button
                      onClick={() => setZoom(100)}
                      title="Reset zoom"
                    >
                      <Maximize size={13} />
                    </button>
                  </div>
                </div>

                <div className="document-canvas">
                  {selectedInvoice.fileURL &&
                  selectedInvoice.type === "PDF" ? (
                    <iframe
                      title="Invoice PDF preview"
                      src={`${selectedInvoice.fileURL}#toolbar=0`}
                      className="uploaded-pdf-preview"
                      style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: "top center",
                        width: `${10000 / zoom}%`,
                      }}
                    />
                  ) : selectedInvoice.fileURL ? (
                    <img
                      src={selectedInvoice.fileURL}
                      alt="Uploaded invoice"
                      className="uploaded-image-preview"
                      style={{ width: `${zoom}%` }}
                    />
                  ) : (
                    <div
                      className="sample-invoice"
                      style={{ transform: `scale(${zoom / 100})` }}
                    >
                      <div className="sample-invoice-top">
                        <div>
                          <strong>PAKISTAN ELECTRIC POWER COMPANY</strong>
                          <h3>{selectedInvoice.vendor.toUpperCase()}</h3>
                          <p>
                            Sub-Division: G-10/4 Islamabad | Tariffs: A-1a
                            Commercial Hostel
                          </p>
                        </div>

                        <span>{selectedInvoice.date.toUpperCase()}</span>
                      </div>

                      <div className="sample-invoice-reference">
                        <strong>Reference No: #{selectedInvoice.reference}</strong>
                        <span>Bill ID: {selectedInvoice.reference}</span>
                      </div>

                      <div className="sample-invoice-data">
                        <div>
                          <small>UNITS</small>
                          <strong>{selectedInvoice.units}</strong>
                          <span>Units Consumed</span>
                        </div>

                        <div>
                          <small>DUE DATE</small>
                          <strong>{selectedInvoice.dueDate}</strong>
                          <span>Payment Deadline</span>
                        </div>

                        <div>
                          <small>NET TOTAL</small>
                          <strong>{formatPKR(selectedInvoice.amount)}</strong>
                          <span>Payable Within Due Date</span>
                        </div>
                      </div>

                      <div className="sample-invoice-table">
                        <div>
                          <span>Billing Account</span>
                          <strong>{selectedInvoice.account}</strong>
                        </div>
                        <div>
                          <span>Invoice Category</span>
                          <strong>{selectedInvoice.category}</strong>
                        </div>
                        <div>
                          <span>OCR Reference</span>
                          <strong>{selectedInvoice.reference}</strong>
                        </div>
                      </div>

                      <div className="sample-invoice-total">
                        <span>TOTAL AMOUNT PAYABLE</span>
                        <strong>{formatPKR(selectedInvoice.amount)}</strong>
                      </div>

                      <p className="sample-invoice-note">
                        This is a sample document preview. Upload an actual
                        invoice to view its original contents.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* APPROVAL SECTION */}
              <div className="approval-section">
                <div className="approval-section-heading">
                  <div>
                    <h3>
                      <ShieldCheck size={15} />
                      Roommate Approval Workflow
                    </h3>
                    <p>
                      {selectedInvoice.approvals} of {selectedInvoice.totalApprovals} members confirmed
                    </p>
                  </div>

                  <span className={`approval-percentage ${
                    selectedInvoice.status === "Approved" ? "complete" : ""
                  }`}>
                    {Math.round(
                      (selectedInvoice.approvals /
                        selectedInvoice.totalApprovals) *
                        100
                    )}%
                  </span>
                </div>

                <div className="approval-progress-track">
                  <span
                    style={{
                      width: `${(selectedInvoice.approvals / selectedInvoice.totalApprovals) * 100}%`,
                    }}
                  />
                </div>

                <div className="approval-actions">
                  <button
                    className="approve-btn"
                    onClick={approveInvoice}
                    disabled={selectedInvoice.status === "Approved"}
                  >
                    <Check size={14} />
                    {selectedInvoice.status === "Approved"
                      ? "Approved"
                      : "Approve Invoice"}
                  </button>

                  <button
                    className="dispute-btn"
                    onClick={rejectInvoice}
                    disabled={selectedInvoice.status === "In Dispute"}
                  >
                    <AlertCircle size={14} />
                    Flag Dispute
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* NOTIFICATION */}
      {notice && (
        <div className="bill-notification" role="status">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </main>
  );
};

export default BillIngestion;
