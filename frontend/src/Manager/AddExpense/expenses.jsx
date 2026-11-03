
import React, { useState } from "react";
import {
  Camera,
  Upload,
  FileText,
  Trash2,
  Clock,
  Store,
  Wallet,
  CalendarDays,
  UserRound,
  ReceiptText,
  Landmark,
  ShieldCheck,
  ScanLine,
  CheckCircle2,
  Info,
  ChevronDown,
  ImagePlus,
  ArrowRight,
  CircleDollarSign
} from "lucide-react";

import "./expenses.css";

export default function CashExpense() {
  const [amount, setAmount] = useState("3500.00");
  const [title, setTitle] = useState(
    "Metro Cash & Carry - Monthly Kitchen Staples & Spices"
  );
  const [category, setCategory] = useState("Shared Groceries & Kitchen");
  const [paymentSource, setPaymentSource] = useState("Hamza Tariq (You) - Cash");
  const [receipt, setReceipt] = useState(null);
  const [date, setDate] = useState("2024-10-28T17:45");

  const total = Number(amount) || 0;
  const roommates = 6;
  const share = total / roommates;
  const reimbursement = total - share;

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setReceipt(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Expense submitted successfully!");
  };

  return (
    <div className="cash-page">

      {/* PAGE HEADER */}
      <header className="cash-header">

        <div className="cash-header-content">
          <span className="cash-eyebrow">
            <span></span>
            ROOM 402 • RESIDENT CASH EXPENSE
          </span>

          <h1>Add Cash Expense & Digital Proof</h1>

          <p>
            Record out-of-pocket grocery purchases, drinking water supplies,
            or emergency items with instant receipt scanning.
          </p>
        </div>

        <div className="cash-header-info">
          <div className="header-info-item">
            <Landmark size={17} />
            <div>
              <small>ROOM TIER</small>
              <strong>Suite 402</strong>
              <span>Ledger</span>
            </div>
          </div>

          <div className="header-info-item">
            <ScanLine size={17} />
            <div>
              <small>OCR ACCURACY</small>
              <strong>99.4%</strong>
              <span>Match</span>
            </div>
          </div>
        </div>

      </header>

      {/* MAIN CONTENT */}
      <form className="cash-layout" onSubmit={handleSubmit}>

        <div className="cash-left">

          {/* RECEIPT UPLOAD */}
          <section className="cash-panel upload-panel">

            <div className="panel-heading">
              <div className="panel-title">
                <span className="panel-icon teal">
                  <ScanLine size={17} />
                </span>

                <div>
                  <h2>1. Receipt Upload</h2>
                  <p>Upload a clear photo of your purchase receipt.</p>
                </div>
              </div>

              <span className="active-status">
                <span></span>
                Smart Scan Active
              </span>
            </div>

            <label className="upload-area">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFile}
              />

              <div className="upload-symbol">
                <ImagePlus size={24} />
              </div>

              <h3>
                {receipt ? receipt.name : "Drop your receipt here"}
              </h3>

              <p>
                {receipt
                  ? "Your receipt is ready for processing."
                  : "Upload an image or PDF of your receipt"}
              </p>

              <span className="upload-formats">
                Supported: JPG, PNG, PDF • Maximum 15 MB
              </span>

              <div className="upload-buttons">
                <span className="camera-button">
                  <Camera size={15} />
                  Upload Receipt
                </span>

                <span className="browse-button">
                  <Upload size={14} />
                  Browse Files
                </span>
              </div>
            </label>

            {receipt && (
              <div className="uploaded-file">
                <div className="file-info">
                  <span className="file-icon">
                    <FileText size={18} />
                  </span>

                  <div>
                    <strong>{receipt.name}</strong>
                    <small>
                      {(receipt.size / 1024 / 1024).toFixed(2)} MB • Uploaded
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-file"
                  onClick={() => setReceipt(null)}
                  aria-label="Remove receipt"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

          </section>

          {/* TRANSACTION FORM */}
          <section className="cash-panel transaction-panel">

            <div className="panel-title transaction-title">
              <span className="panel-icon teal">
                <ReceiptText size={17} />
              </span>

              <div>
                <h2>2. Transaction Details</h2>
                <p>Enter the purchase information below.</p>
              </div>
            </div>

            <div className="form-fields">

              <div className="form-group full-width">
                <label>EXPENSE TITLE / STORE NAME</label>

                <div className="input-wrapper">
                  <Store size={16} />

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter store or expense name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>EXPENSE CATEGORY</label>

                <div className="input-wrapper">
                  <Wallet size={16} />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Shared Groceries & Kitchen</option>
                    <option>Drinking Water Supplies</option>
                    <option>Room Maintenance</option>
                    <option>Electricity & Utilities</option>
                    <option>Emergency Expenses</option>
                    <option>Other Expenses</option>
                  </select>

                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="form-group">
                <label>
                  TOTAL AMOUNT
                  <span className="currency-label">PKR</span>
                </label>

                <div className="input-wrapper amount-wrapper">
                  <strong>Rs</strong>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>PAYMENT DATE & TIME</label>

                <div className="input-wrapper">
                  <CalendarDays size={16} />

                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>PAID BY</label>

                <div className="input-wrapper">
                  <UserRound size={16} />

                  <select
                    value={paymentSource}
                    onChange={(e) => setPaymentSource(e.target.value)}
                  >
                    <option>Hamza Tariq (You) - Cash</option>
                    <option>Hamza Tariq (You) - Bank</option>
                    <option>Room Admin - Cash</option>
                    <option>Other Roommate</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="form-note">
              <Info size={15} />
              <span>
                Make sure the amount and receipt details match before submitting.
              </span>
            </div>

          </section>

          {/* SUBMIT BUTTON */}
          <button className="submit-expense" type="submit">
            <ShieldCheck size={17} />
            Submit Expense for Approval
            <ArrowRight size={16} />
          </button>

        </div>

        {/* RIGHT SIDE */}
        <aside className="cash-right">

          {/* SETTLEMENT SUMMARY */}
          <section className="cash-panel settlement-panel">

            <div className="panel-heading">
              <div className="panel-title">
                <span className="panel-icon orange">
                  <Landmark size={17} />
                </span>

                <div>
                  <h2>Settlement Summary</h2>
                  <p>How this expense affects everyone.</p>
                </div>
              </div>

              <span className="preview-badge">Live Preview</span>
            </div>

            <div className="settlement-grid">

              <div className="settlement-box">
                <span>GROSS OUTLAY</span>
                <h3>Rs {total.toLocaleString("en-PK", {
                  minimumFractionDigits: 2
                })}</h3>
                <small>Paid out-of-pocket</small>
              </div>

              <div className="settlement-box reimbursement">
                <span>NET REIMBURSEMENT</span>
                <h3>Rs {Math.max(0, reimbursement).toLocaleString("en-PK", {
                  minimumFractionDigits: 2
                })}</h3>
                <small>Amount to be credited to you</small>
              </div>

              <div className="settlement-box final-share">
                <span>YOUR FINAL SHARE</span>
                <h3>Rs {share.toLocaleString("en-PK", {
                  minimumFractionDigits: 2
                })}</h3>
                <small>Your personal expense</small>
              </div>

              <div className="settlement-box">
                <span>ROOMMATE POOL</span>
                <h3>{roommates} People</h3>
                <small>Rs {share.toFixed(2)} each</small>
              </div>

            </div>

            <div className="allocation-heading">
              <strong>EXPENSE DISTRIBUTION</strong>
              <span>100% Allocated</span>
            </div>

            <div className="allocation-bar">
              {peers.map((_, index) => (
                <span key={index}></span>
              ))}
            </div>

            <div className="allocation-legend">
              <span><i className="legend-teal"></i> You (Rs {share.toFixed(2)})</span>
              <span><i className="legend-green"></i> Ali (Rs {share.toFixed(2)})</span>
              <span><i className="legend-blue"></i> Zain (Rs {share.toFixed(2)})</span>
              <span><i className="legend-orange"></i> Bilal (Rs {share.toFixed(2)})</span>
              <span><i className="legend-purple"></i> Daniyal (Rs {share.toFixed(2)})</span>
              <span><i className="legend-cyan"></i> Usman (Rs {share.toFixed(2)})</span>
            </div>

          </section>

          {/* RECEIPT PREVIEW */}
          <section className="cash-panel proof-panel">

            <div className="panel-heading">
              <div className="panel-title">
                <span className="panel-icon teal">
                  <FileText size={17} />
                </span>

                <div>
                  <h2>Purchase Preview</h2>
                  <p>Digital receipt details.</p>
                </div>
              </div>

              <span className="ocr-status">
                <CheckCircle2 size={12} />
                OCR Ready
              </span>
            </div>

            <div className="receipt-paper">

              <div className="receipt-top">
                <strong>METRO CASH & CARRY</strong>
                <span>Super Highway Logistics Center, Unit 09</span>
                <span>TAX REG: 9834201-9 • POS TERM #04</span>
              </div>

              <div className="receipt-id">
                TRANSACTION ID: 884920
                <span>28-OCT-2024 17:45:12</span>
              </div>

              <div className="receipt-items">
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
                  <span>Kitchen Staples & Spices</span>
                  <strong>Rs 910.00</strong>
                </div>
              </div>

              <div className="receipt-total">
                <span>TOTAL PAID</span>
                <strong>Rs {total.toFixed(2)}</strong>
              </div>

              <div className="receipt-footer">
                <CheckCircle2 size={15} />
                Receipt information extracted successfully
              </div>

            </div>

            <div className="proof-note">
              <ShieldCheck size={15} />
              <span>Receipt proof will be stored securely in your digital ledger.</span>
            </div>

          </section>

        </aside>

      </form>

    </div>
  );
}

const peers = [1, 2, 3, 4, 5, 6];
