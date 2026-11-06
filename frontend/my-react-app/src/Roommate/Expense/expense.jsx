
import React, { useRef, useState, useMemo } from "react";
import {
  Camera, Upload, FileText, Trash2, CheckCircle,
  ShieldCheck, Zap, Landmark, CalendarDays,
  Store, Wallet, ChevronDown, Eye, X,
  Receipt, CircleDollarSign, Users, Clock,
  Image as ImageIcon, RefreshCw
} from "lucide-react";
import "./expense.css";

const members = [
  { name: "You", amount: 0, color: "#008779" },
  { name: "Ali", amount: 0, color: "#f59b43" },
  { name: "Daniyal", amount: 0, color: "#008779" },
  { name: "Zain", amount: 0, color: "#405d9b" },
  { name: "Bilal", amount: 0, color: "#f59b43" },
  { name: "Usman", amount: 0, color: "#55c9bb" }
];

function AddCashExpense() {
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "Metro Cash & Carry - Monthly Kitchen Staples & Spices",
    category: "Shared Groceries & Kitchen",
    amount: "3500",
    date: "2024-10-28T17:45",
    payer: "Hamza Tariq (You) - Cash"
  });

  const amount = Math.max(0, Number(form.amount) || 0);
  const share = amount / members.length;

  const allocation = useMemo(
    () => members.map(member => ({
      ...member,
      amount: share
    })),
    [share]
  );

  const formatPKR = value =>
    "Rs " + Number(value).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf"
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setMessage("Please upload a JPG, PNG or PDF file.");
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setMessage("File size must be below 15MB.");
      return;
    }

    setFile(selectedFile);
    setMessage("");

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview("");
    }
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a receipt before submitting.");
      return;
    }

    if (!form.title.trim() || amount <= 0) {
      setMessage("Please enter a valid expense title and amount.");
      return;
    }

    const expense = {
      ...form,
      amount,
      fileName: file.name,
      allocations: allocation
    };

    console.log("New Cash Expense:", expense);
    setMessage("Expense details validated successfully!");
  };

  return (
    <main className="cash-expense-page">

      {/* HEADER */}

      <header className="cash-expense-header">
        <div className="cash-header-content">
          <span className="cash-breadcrumb">
            <span />
            ROOM 402 • RESIDENT CASH EXPENSE
          </span>

          <h1>Add Cash Expense & Digital Proof</h1>

          <p>
            Record out-of-pocket grocery purchases, drinking water supplies,
            or emergency items with instant camera/receipt OCR scan.
          </p>
        </div>

        <div className="cash-header-status">
          <div className="cash-status-item">
            <span className="cash-status-icon">
              <ShieldCheck size={17} />
            </span>
            <div>
              <small>ROOM TIER</small>
              <strong>Suite 402</strong>
              <span>Ledger</span>
            </div>
          </div>

          <span className="cash-status-divider" />

          <div className="cash-status-item accuracy-item">
            <Zap size={15} />
            <div>
              <small>OCR ACCURACY</small>
              <strong>99.4%</strong>
              <span>Match</span>
            </div>
          </div>
        </div>
      </header>

      <div className="cash-expense-grid">

        {/* LEFT COLUMN */}

        <section className="cash-left-column">

          {/* UPLOAD PANEL */}

          <div className="cash-panel upload-panel">
            <div className="cash-panel-heading">
              <div className="cash-heading-title">
                <Receipt size={16} />
                <h2>1. Photo Proof & Ingestion</h2>
              </div>

              <span className="cash-active-badge">
                <span /> Smart Receipt Auto-Scan Active
              </span>
            </div>

            <div
              className={`cash-dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="cash-upload-success">
                  {preview ? (
                    <img src={preview} alt="Uploaded receipt" />
                  ) : (
                    <FileText size={36} />
                  )}

                  <h3>{file.name}</h3>
                  <p>
                    {(file.size / 1024 / 1024).toFixed(2)} MB •
                    Receipt uploaded
                  </p>

                  <button
                    className="cash-browse-button"
                    onClick={removeFile}
                    type="button"
                  >
                    <Trash2 size={13} /> Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="cash-upload-main-icon">
                    <Camera size={22} />
                    <span className="cash-camera-plus">+</span>
                  </div>

                  <h3>Drag and drop receipt slip here</h3>
                  <p>
                    Supported formats: JPEG, PNG, PDF
                    (Max file size: 15MB)
                  </p>

                  <div className="cash-upload-buttons">
                    <button
                      type="button"
                      className="cash-camera-button"
                      onClick={() => cameraRef.current?.click()}
                    >
                      <Camera size={14} />
                      Take Photo / Scan Receipt
                    </button>

                    <button
                      type="button"
                      className="cash-browse-button"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload size={13} />
                      Browse Files
                    </button>
                  </div>
                </>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {file && (
              <div className="cash-file-information">
                <span className="cash-file-icon">
                  <FileText size={17} />
                </span>

                <div className="cash-file-details">
                  <strong>{file.name}</strong>
                  <span>
                    <CheckCircle size={10} />
                    Receipt uploaded • Bounding boxes calibrated
                  </span>
                </div>

                {preview && (
                  <button
                    className="cash-file-action"
                    onClick={() => setShowPreview(true)}
                    type="button"
                    title="Preview receipt"
                  >
                    <Eye size={15} />
                  </button>
                )}

                <button
                  className="cash-delete-button"
                  onClick={removeFile}
                  type="button"
                  title="Delete receipt"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* METADATA FORM */}

          <form className="cash-panel metadata-panel" onSubmit={handleSubmit}>
            <div className="cash-panel-heading">
              <div className="cash-heading-title">
                <Receipt size={15} />
                <h2>2. Transaction Metadata</h2>
              </div>
            </div>

            <div className="cash-form-field full-width">
              <label>EXPENSE TITLE / STORE VENDOR</label>
              <div className="cash-input-wrapper">
                <Store size={13} />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  placeholder="Enter expense title"
                  required
                />
              </div>
            </div>

            <div className="cash-form-row">
              <div className="cash-form-field">
                <label>EXPENSE CLASSIFICATION CATEGORY</label>
                <div className="cash-input-wrapper">
                  <Wallet size={13} />
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateForm}
                  >
                    <option>Shared Groceries & Kitchen</option>
                    <option>Drinking Water Supplies</option>
                    <option>Emergency Purchases</option>
                    <option>Cleaning Supplies</option>
                    <option>Maintenance</option>
                    <option>Other Expenses</option>
                  </select>
                  <ChevronDown size={13} className="cash-select-arrow" />
                </div>
              </div>

              <div className="cash-form-field">
                <label>
                  TOTAL AMOUNT
                  <span className="cash-currency-badge">PKR</span>
                </label>

                <div className="cash-input-wrapper amount-input">
                  <span className="cash-rupee-symbol">Rs</span>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    value={form.amount}
                    onChange={updateForm}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="cash-form-row">
              <div className="cash-form-field">
                <label>RECEIPT TIMESTAMP</label>
                <div className="cash-input-wrapper">
                  <CalendarDays size={13} />
                  <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={updateForm}
                  />
                </div>
              </div>

              <div className="cash-form-field">
                <label>PAYMENT SOURCE & DISBURSER</label>
                <div className="cash-input-wrapper">
                  <Wallet size={13} />
                  <select
                    name="payer"
                    value={form.payer}
                    onChange={updateForm}
                  >
                    <option>Hamza Tariq (You) - Cash</option>
                    <option>Ali Khan - Cash</option>
                    <option>Daniyal Ahmed - Cash</option>
                    <option>Zain Malik - Cash</option>
                    <option>Bilal Raza - Cash</option>
                    <option>Usman - Cash</option>
                  </select>
                  <ChevronDown size={13} className="cash-select-arrow" />
                </div>
              </div>
            </div>

            {message && (
              <div className="cash-message">
                <CheckCircle size={13} />
                {message}
                <button
                  type="button"
                  onClick={() => setMessage("")}
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <button type="submit" className="cash-submit-button">
              <CheckCircle size={15} />
              Validate Cash Expense
              <Zap size={13} />
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN */}

        <aside className="cash-right-column">

          {/* SETTLEMENT IMPACT */}

          <section className="cash-panel impact-panel">
            <div className="cash-panel-heading">
              <div className="cash-heading-title">
                <Landmark size={16} />
                <h2>Ledger Settlement Impact</h2>
              </div>

              <span className="cash-live-badge">Live Preview</span>
            </div>

            <div className="cash-impact-grid">
              <div className="cash-impact-card gross-card">
                <span>GROSS OUTLAY</span>
                <strong>{formatPKR(amount)}</strong>
                <small>Paid out-of-pocket</small>
              </div>

              <div className="cash-impact-card reimbursement-card">
                <span>NET REIMBURSEMENT</span>
                <strong>+{formatPKR(amount - share)}</strong>
                <small>To be credited to you</small>
              </div>

              <div className="cash-impact-card final-share-card">
                <span>YOUR FINAL SHARE</span>
                <strong>{formatPKR(share)}</strong>
                <small>Bed Space B real cost</small>
              </div>

              <div className="cash-impact-card debited-card">
                <span>ROOMMATE POOL</span>
                <strong>5 Debited</strong>
                <small>{formatPKR(share)} each</small>
              </div>
            </div>

            <div className="cash-allocation-section">
              <div className="cash-allocation-heading">
                <span>ALLOCATION DISTRIBUTION (6 SHARES)</span>
                <strong>100% Balanced</strong>
              </div>

              <div className="cash-allocation-bar">
                {allocation.map((member, index) => (
                  <span
                    key={member.name}
                    style={{
                      width: `${100 / 6}%`,
                      background: member.color
                    }}
                    title={member.name}
                  />
                ))}
              </div>

              <div className="cash-allocation-legend">
                {allocation.map(member => (
                  <div key={member.name}>
                    <span style={{ background: member.color }} />
                    {member.name} ({formatPKR(member.amount)})
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROOF OF PURCHASE */}

          <section className="cash-panel proof-panel">
            <div className="cash-panel-heading">
              <div className="cash-heading-title">
                <FileText size={16} />
                <h2>Proof of Purchase Preview</h2>
              </div>

              <span className="cash-proof-status">
                <span /> OCR Calibrated
              </span>
            </div>

            <div className="cash-proof-document">
              <div className="cash-receipt-top">
                <div className="cash-receipt-brand">
                  <strong>{file ? file.name : "METRO CASH & CARRY"}</strong>
                  <small>Super Highway Logistics Center, Unit 09</small>
                  <small>TAX REG: 8943201-9 • POS TERM #04</small>
                </div>
                <span className="cash-receipt-logo">
                  <Store size={17} />
                </span>
              </div>

              <div className="cash-receipt-meta">
                <span>TRANS ID: 884920</span>
                <span>
                  {form.date.replace("T", " ")}
                </span>
              </div>

              <div className="cash-receipt-items">
                <div>
                  <span>Cooking Oil 5L Pure Can</span>
                  <strong>Rs 1,190.00</strong>
                </div>
                <div>
                  <span>Super Basmati Rice 10kg Bag</span>
                  <strong>Rs 950.00</strong>
                </div>
                <div>
                  <span>Organic Red Lentils (Daal) 3kg</span>
                  <strong>Rs 450.00</strong>
                </div>
                <div>
                  <span>Multi-Surface Detergent Powder</span>
                  <strong>Rs 420.00</strong>
                </div>
                <div>
                  <span>Additional Kitchen Supplies</span>
                  <strong>Rs 490.00</strong>
                </div>
              </div>

              <div className="cash-receipt-total">
                <span>GRAND TOTAL</span>
                <strong>{formatPKR(amount)}</strong>
              </div>

              <div className="cash-receipt-footer">
                <ShieldCheck size={12} />
                Digital Receipt • Room 402 Ledger
              </div>
            </div>

            <div className="cash-proof-footer">
              <span>
                <CheckCircle size={11} />
                Receipt verification preview
              </span>
              <button
                type="button"
                onClick={() => {
                  if (preview) setShowPreview(true);
                  else setMessage("Upload a receipt to preview it.");
                }}
              >
                <Eye size={12} /> View Proof
              </button>
            </div>
          </section>

          {/* SECURITY */}

          <section className="cash-security-note">
            <ShieldCheck size={17} />
            <div>
              <strong>Secure Digital Expense Record</strong>
              <span>
                Your transaction details are prepared for Room 402
                ledger verification and roommate settlement.
              </span>
            </div>
          </section>

        </aside>
      </div>

      {/* IMAGE PREVIEW MODAL */}

      {showPreview && preview && (
        <div
          className="cash-preview-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="cash-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cash-preview-header">
              <div>
                <h3>Receipt Preview</h3>
                <span>{file?.name}</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <img src={preview} alt="Full receipt preview" />
          </div>
        </div>
      )}
    </main>
  );
}

export default AddCashExpense;
