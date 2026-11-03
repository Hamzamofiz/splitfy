
import React, { useState } from "react";
import {
  Wallet,
  ArrowRight,
  ArrowLeftRight,
  Copy,
  Check,
  ShieldCheck,
  Landmark,
  Smartphone,
  CreditCard,
  Receipt,
  Upload,
  MessageCircle,
  CheckCircle2,
  Clock,
  CircleAlert,
  Send,
  CalendarDays,
  Banknote,
  Sparkles,
  LockKeyhole,
  TrendingUp,
  FileImage,
  ArrowUpRight,
} from "lucide-react";

import "./settelment.css";

const bankingDetails = [
  {
    type: "RAAST",
    title: "Meezan Bank Islamic",
    subtitle: "Raast ID",
    value: "03009876543",
    color: "green",
  },
  {
    type: "IBAN",
    title: "Full Bank Account IBAN",
    subtitle: "",
    value: "PK36 MEZN 0001 2345 6789 0101",
    color: "blue",
  },
  {
    type: "SADA",
    title: "SadaPay Handle (0% Fee)",
    subtitle: "",
    value: "@alexrivera402",
    color: "orange",
  },
];

const transfers = [
  { from: "Hamza Tariq", to: "Alex Rivera", amount: "Rs 42.50" },
  { from: "Zain Malik", to: "Alex Rivera", amount: "Rs 115.00" },
  { from: "Ali Khan", to: "Hamza Tariq", amount: "Rs 20.83" },
  { from: "Daniyal Ahmed", to: "Hamza Tariq", amount: "Rs 20.83" },
];

const receivables = [
  {
    name: "Ali Khan",
    room: "Bed Space C",
    detail: "Metro Grocery Run + 4-Way Even Split",
    amount: "Rs 20.83",
    due: "Pending 2 days",
  },
  {
    name: "Daniyal Ahmed",
    room: "Bed Space D",
    detail: "Metro Grocery Run + 4-Way Even Split",
    amount: "Rs 20.83",
    due: "Pending 2 days",
  },
  {
    name: "Zain Malik",
    room: "Bed Space A",
    detail: "October Utilities Share",
    amount: "Rs 0.00",
    due: "Settled",
  },
];

export default function PaymentHub() {
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [received, setReceived] = useState([]);

  const outstanding = 42.50;
  const totalReceivables = 41.66;

  const copyValue = async (value, type) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  const markReceived = (name) => {
    setReceived((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    );
  };

  const handleReceipt = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setReceipt(file);
    }
  };

  return (
    <div className="payment-hub">

      {/* HEADER */}

      <header className="payment-header">

        <div>
          <span className="payment-eyebrow">
            <span></span>
            ROOM 402 • RESIDENT PAYMENT & SETTLEMENT
          </span>

          <h1>Net Settlement & Payment Hub</h1>

          <p>
            Clear your roommate balances easily using local banking apps,
            Raast, and instant payment links.
          </p>
        </div>

        <div className="payment-header-status">

          <div>
            <span>YOUR NET STATUS</span>
            <strong className="status-negative">
              −Rs 0.84
            </strong>
            <small>(Net Owed)</small>
          </div>

          <div className="header-status-divider"></div>

          <div>
            <span>CYCLE STATUS</span>
            <strong className="status-positive">
              <CheckCircle2 size={12} />
              Closing in 3 Days
            </strong>
          </div>

        </div>

      </header>

      <div className="payment-layout">

        {/* LEFT COLUMN */}

        <main className="payment-left">

          {/* OUTSTANDING SETTLEMENT */}

          <section className="settlement-section">

            <div className="payment-section-heading">
              <div>
                <CircleAlert size={15} />
                <h2>Your Outstanding Settlements</h2>
              </div>

              <span className="action-required">
                Action Required
              </span>
            </div>

            <div className="settlement-card">

              <div className="settlement-card-top">

                <div className="transfer-person">
                  <div className="person-avatar yellow-avatar">HT</div>

                  <div>
                    <span>TRANSFER DIRECT</span>
                    <strong>You (Hamza Tariq)</strong>
                  </div>
                </div>

                <ArrowRight className="transfer-arrow" size={18} />

                <div className="transfer-person recipient">

                  <div>
                    <strong>Alex Rivera</strong>
                    <span>(Admin)</span>
                  </div>

                </div>

                <div className="settlement-amount">

                  <span>NET AMOUNT PAYABLE</span>
                  <strong>Rs 42.50</strong>
                  <small>Oct 2024 Utilities & Maintenance</small>

                </div>

              </div>

              {/* BANKING DETAILS */}

              <div className="banking-details">

                <div className="banking-heading">
                  <span>
                    <Landmark size={12} />
                    ALEX RIVERA'S VERIFIED BANKING RAILS
                  </span>

                  <strong>
                    <ShieldCheck size={11} />
                    Instant 1-Click
                  </strong>
                </div>

                {bankingDetails.map((bank) => (
                  <div className="banking-row" key={bank.type}>

                    <div className={`bank-type ${bank.color}`}>
                      {bank.type}
                    </div>

                    <div className="bank-info">
                      <span>
                        {bank.title} {bank.subtitle && `(${bank.subtitle})`}
                      </span>

                      <strong>{bank.value}</strong>
                    </div>

                    <button
                      type="button"
                      className="copy-bank-btn"
                      onClick={() => copyValue(bank.value, bank.type)}
                    >
                      {copied === bank.type ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}

                      {copied === bank.type ? "Copied" : `Copy ${bank.type === "RAAST" ? "Raast" : bank.type === "IBAN" ? "IBAN" : "SadaTag"}`}
                    </button>

                  </div>
                ))}

              </div>

              {/* ACTIONS */}

              <div className="settlement-actions">

                <button
                  type="button"
                  className={`mark-paid-btn ${paid ? "marked-paid" : ""}`}
                  onClick={() => setPaid(!paid)}
                >
                  {paid ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}

                  {paid ? "Payment Marked as Paid" : "Mark as Paid / Notify Admin"}
                </button>

                <label className="attach-receipt-btn">

                  <Upload size={14} />
                  {receipt ? "Receipt Attached" : "Attach Receipt Screenshot"}

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceipt}
                    hidden
                  />

                </label>

              </div>

              {paid && (
                <div className="payment-feedback">
                  <CheckCircle2 size={15} />
                  Payment marked as paid. Admin confirmation is pending.
                </div>
              )}

              {receipt && (
                <div className="receipt-attached">
                  <FileImage size={14} />
                  {receipt.name}
                </div>
              )}

            </div>

          </section>

          {/* RECEIVABLES */}

          <section className="receivables-section">

            <div className="payment-section-heading">

              <div>
                <Wallet size={16} />
                <h2>Money Roommates Owe You (Receivables)</h2>
              </div>

              <span className="total-receivable">
                Total: Rs {totalReceivables.toFixed(2)}
              </span>

            </div>

            <div className="receivables-list">

              {receivables.map((person) => {
                const isReceived = received.includes(person.name);
                const settled = person.due === "Settled" || isReceived;

                return (
                  <div className="receivable-card" key={person.name}>

                    <div className="receivable-avatar">
                      {person.name.split(" ").map((word) => word[0]).join("")}
                    </div>

                    <div className="receivable-info">

                      <div className="receivable-name">
                        <strong>{person.name}</strong>
                        <span>{person.room}</span>
                      </div>

                      <p>{person.detail}</p>

                      <small className={settled ? "received-text" : "pending-text"}>
                        {settled ? (
                          <CheckCircle2 size={10} />
                        ) : (
                          <Clock size={10} />
                        )}
                        {settled ? "Received / Settled" : person.due}
                      </small>

                    </div>

                    <div className="receivable-actions">

                      <strong className="receivable-amount">
                        {person.amount}
                      </strong>

                      <div>

                        {!settled && (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `Hi ${person.name}, your pending Splitfy settlement is ${person.amount}. Please clear it when convenient.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="whatsapp-nudge"
                          >
                            <MessageCircle size={11} />
                            WhatsApp Nudge
                          </a>
                        )}

                        <button
                          type="button"
                          className={`received-btn ${settled ? "already-received" : ""}`}
                          onClick={() => markReceived(person.name)}
                          disabled={settled}
                        >
                          <Check size={12} />
                          {settled ? "Received" : "Mark Received"}
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>

        </main>

        {/* RIGHT COLUMN */}

        <aside className="payment-right">

          {/* PENDING TRANSFERS */}

          <section className="payment-side-card transfer-flow-card">

            <div className="side-card-heading">

              <div>
                <ArrowLeftRight size={16} />
                <h2>Room Payment Flow & Pending Transfers</h2>
              </div>

              <span>Suite 402 Summary</span>

            </div>

            <div className="transfer-flow-list">

              {transfers.map((transfer, index) => (
                <div className="transfer-flow-row" key={index}>

                  <strong>{transfer.from}</strong>

                  <ArrowRight size={12} />

                  <strong>{transfer.to}</strong>

                  <span>{transfer.amount}</span>

                </div>
              ))}

            </div>

            <div className="flow-note">
              <CheckCircle2 size={12} />
              All pending balances auto-reconcile once receipts are confirmed.
            </div>

          </section>

          {/* SMART SETTLEMENT CARD - REPLACES QR */}

          <section className="smart-settlement-card">

            <div className="smart-card-glow"></div>

            <div className="smart-card-top">

              <div className="smart-card-icon">
                <Wallet size={19} />
              </div>

              <span>
                <ShieldCheck size={12} />
                SECURE SETTLEMENT
              </span>

            </div>

            <span className="smart-card-eyebrow">
              YOUR PAYMENT SUMMARY
            </span>

            <h2>One Simple Transfer.</h2>

            <p>
              Settle your outstanding roommate balance through your
              preferred banking app.
            </p>

            <div className="smart-amount-box">

              <div>
                <span>TOTAL AMOUNT DUE</span>
                <strong>Rs 42.50</strong>
              </div>

              <div className="amount-icon">
                <Banknote size={21} />
              </div>

            </div>

            <div className="smart-progress-heading">
              <span>Settlement progress</span>
              <strong>0% Complete</strong>
            </div>

            <div className="smart-progress">
              <span></span>
            </div>

            <div className="payment-steps">

              <div className="payment-step">
                <span className="step-number">01</span>

                <div>
                  <strong>Choose Banking Rail</strong>
                  <small>Raast, IBAN or SadaPay</small>
                </div>

                <Smartphone size={16} />
              </div>

              <div className="payment-step">
                <span className="step-number">02</span>

                <div>
                  <strong>Transfer Amount</strong>
                  <small>Send Rs 42.50 to Alex Rivera</small>
                </div>

                <Send size={16} />
              </div>

              <div className="payment-step">
                <span className="step-number">03</span>

                <div>
                  <strong>Upload Payment Proof</strong>
                  <small>Admin confirms your settlement</small>
                </div>

                <Receipt size={16} />
              </div>

            </div>

            <button
              type="button"
              className="smart-copy-btn"
              onClick={() => copyValue("SPLITFY-402-4250", "REFERENCE")}
            >
              {copied === "REFERENCE" ? (
                <Check size={15} />
              ) : (
                <Copy size={15} />
              )}

              {copied === "REFERENCE"
                ? "Reference Copied"
                : "Copy Payment Reference"}
            </button>

            <div className="smart-card-footer">
              <LockKeyhole size={11} />
              Splitfy Secure Payment Reference
            </div>

          </section>

          {/* PAYMENT INFORMATION */}

          <section className="payment-side-card payment-info-card">

            <div className="side-card-heading">
              <div>
                <Sparkles size={16} />
                <h2>Payment Information</h2>
              </div>
            </div>

            <div className="payment-info-row">
              <span>Payment Method</span>
              <strong>Local Banking Apps</strong>
            </div>

            <div className="payment-info-row">
              <span>Settlement Cycle</span>
              <strong>October 2024</strong>
            </div>

            <div className="payment-info-row">
              <span>Admin Verification</span>
              <strong className="verification-status">
                <ShieldCheck size={12} />
                Required
              </strong>
            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}
