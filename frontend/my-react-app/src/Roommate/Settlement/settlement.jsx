
import React, { useState } from "react";
import {
  ArrowRightLeft, CircleAlert, Landmark, ShieldCheck,
  Copy, Check, Wallet, CreditCard, Smartphone,
  MessageCircle, CheckCircle, Camera, Upload, X,
  Clock, Hourglass, QrCode, ExternalLink, Image,
  Receipt, Users, ArrowRight, RefreshCw
} from "lucide-react";

import "./settlement.css";

const initialRoommates = [
  {
    id: 1,
    name: "Ali Khan",
    room: "Bed Space C",
    description: "Metro Grocery Run + 4-Way Even Split",
    amount: 20.83,
    days: "Pending 2 days",
    initials: "AK",
    status: "pending"
  },
  {
    id: 2,
    name: "Daniyal Ahmed",
    room: "Bed Space D",
    description: "Metro Grocery Run + 4-Way Even Split",
    amount: 20.83,
    days: "Pending 2 days",
    initials: "DA",
    status: "pending"
  }
];

function NetSettlement() {
  const [roommates, setRoommates] = useState(initialRoommates);
  const [qrImage, setQrImage] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");

  const [transactions] = useState([
    { from: "Hamza Tariq", to: "Alex Rivera", amount: 42.50 },
    { from: "Zain Malik", to: "Alex Rivera", amount: 115.00 },
    { from: "Ali Khan", to: "Hamza Tariq", amount: 20.83 },
    { from: "Daniyal Ahmed", to: "Hamza Tariq", amount: 20.83 }
  ]);

  const totalReceivable = roommates
    .filter(person => person.status === "pending")
    .reduce((sum, person) => sum + person.amount, 0);

  const copyValue = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setNotice("Unable to copy. Please copy the details manually.");
    }
  };

  const markReceived = (id) => {
    setRoommates(prev =>
      prev.map(person =>
        person.id === id
          ? { ...person, status: "received" }
          : person
      )
    );
  };

  const uploadQR = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image file for your QR code.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("QR image must be smaller than 5MB.");
      return;
    }

    setQrImage(URL.createObjectURL(file));
    setNotice("QR code image uploaded successfully.");
    e.target.value = "";
  };

  const uploadReceipt = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please upload a receipt image.");
      return;
    }

    setReceipt(file);
    setNotice("Receipt attached successfully.");
    e.target.value = "";
  };

  const removeQR = () => {
    if (qrImage) URL.revokeObjectURL(qrImage);
    setQrImage(null);
  };

  const sendNudge = (name) => {
    const message = encodeURIComponent(
      `Hello ${name}, this is a friendly reminder about your pending Room 402 settlement of Rs ${roommates.find(p => p.name === name)?.amount.toFixed(2)}. Please clear it when convenient.`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handlePaid = () => {
    if (!receipt) {
      setNotice("Please attach your payment receipt first.");
      return;
    }

    setPaid(true);
    setNotice("Payment submitted for admin verification.");
  };

  return (
    <main className="settlement-page">

      {/* HEADER */}

      <header className="settlement-header">
        <div>
          <span className="settlement-breadcrumb">
            <span /> ROOM 402 • RESIDENT PAYMENT & SETTLEMENT
          </span>

          <h1>Net Settlement & Payment Hub</h1>

          <p>
            Clear your roommate balances easily using local banking apps,
            Raast, and instant payment links.
          </p>
        </div>

        <div className="settlement-status-box">
          <div>
            <small>YOUR NET STATUS</small>
            <strong className="negative-balance">−Rs 0.84</strong>
            <span>(Net Owed)</span>
          </div>

          <div className="status-divider" />

          <div>
            <small>CYCLE STATUS</small>
            <strong className="cycle-status">
              <Hourglass size={12} />
              Closing in 3 Days
            </strong>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}

      <div className="settlement-grid">

        {/* LEFT SIDE */}

        <section className="settlement-left">

          {/* OUTSTANDING SETTLEMENT */}

          <section className="settlement-section">

            <div className="settlement-section-heading">
              <h2>
                <CircleAlert size={15} />
                Your Outstanding Settlements
              </h2>

              <span className="action-required">Action Required</span>
            </div>

            <div className="settlement-payment-card">

              <div className="settlement-payment-top">

                <div className="transfer-person">
                  <div className="transfer-avatar">HT</div>

                  <div>
                    <small>TRANSFER DIRECT</small>
                    <strong>You (Hamza Tariq)</strong>
                  </div>

                  <ArrowRight size={15} />

                  <div>
                    <strong>Alex Rivera</strong>
                    <small>(Admin)</small>
                  </div>
                </div>

                <div className="payable-amount">
                  <small>NET AMOUNT PAYABLE</small>
                  <strong>Rs 42.50</strong>
                  <span>Oct 2024 Utilities & Maintenance</span>
                </div>

              </div>

              {/* BANKING DETAILS */}

              <div className="banking-rails">

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

                <div className="banking-item">
                  <div className="banking-icon raast-icon">RAAST</div>

                  <div className="banking-info">
                    <small>Meezan Bank Islamic (Raast ID)</small>
                    <strong>03009876543</strong>
                  </div>

                  <button
                    onClick={() => copyValue("Raast", "03009876543")}
                    type="button"
                  >
                    {copied === "Raast" ? <Check size={12} /> : <Copy size={12} />}
                    {copied === "Raast" ? "Copied" : "Copy Raast"}
                  </button>
                </div>

                <div className="banking-item">
                  <div className="banking-icon iban-icon">IBAN</div>

                  <div className="banking-info">
                    <small>Full Bank Account IBAN</small>
                    <strong>PK36 MEZN 0001 2345 6789 0101</strong>
                  </div>

                  <button
                    onClick={() => copyValue("IBAN", "PK36MEZN0001234567890101")}
                    type="button"
                  >
                    {copied === "IBAN" ? <Check size={12} /> : <Copy size={12} />}
                    {copied === "IBAN" ? "Copied" : "Copy IBAN"}
                  </button>
                </div>

                <div className="banking-item">
                  <div className="banking-icon sada-icon">SADA</div>

                  <div className="banking-info">
                    <small>SadaPay Handle (0% Fee)</small>
                    <strong>@alexrivera402</strong>
                  </div>

                  <button
                    onClick={() => copyValue("SadaTag", "@alexrivera402")}
                    type="button"
                  >
                    {copied === "SadaTag" ? <Check size={12} /> : <Copy size={12} />}
                    {copied === "SadaTag" ? "Copied" : "Copy SadaTag"}
                  </button>
                </div>

              </div>

              {/* PAYMENT ACTIONS */}

              <div className="settlement-actions">

                <button
                  className="settlement-paid-btn"
                  type="button"
                  onClick={handlePaid}
                >
                  <CheckCircle size={14} />
                  Mark as Paid / Notify Admin
                </button>

                <label className="settlement-receipt-btn">
                  <Camera size={14} />
                  {receipt ? "Receipt Attached" : "Attach Receipt Screenshot"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadReceipt}
                  />
                </label>

              </div>

              {receipt && (
                <div className="receipt-attached">
                  <Receipt size={14} />
                  <span>{receipt.name}</span>

                  <button
                    type="button"
                    onClick={() => setReceipt(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {notice && (
                <div className="settlement-notice">
                  <Info size={13} />
                  {notice}
                  <button
                    type="button"
                    onClick={() => setNotice("")}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {paid && (
                <div className="payment-pending">
                  <Clock size={14} />
                  Payment submitted. Waiting for admin verification.
                </div>
              )}

            </div>
          </section>

          {/* ROOMMATES RECEIVABLES */}

          <section className="settlement-section">

            <div className="settlement-section-heading">
              <h2>
                <Users size={15} />
                Money Roommates Owe You (Receivables)
              </h2>

              <span className="receivable-total">
                Total: Rs {totalReceivable.toFixed(2)}
              </span>
            </div>

            <div className="roommate-list">

              {roommates.map(person => (
                <div className="roommate-card" key={person.id}>

                  <div className="roommate-avatar">
                    {person.initials}
                  </div>

                  <div className="roommate-info">
                    <strong>{person.name}</strong>

                    <span className="roommate-room">
                      {person.room}
                    </span>

                    <small>{person.description}</small>

                    <span className="roommate-pending">
                      <Clock size={10} />
                      {person.status === "received"
                        ? "Payment Received"
                        : person.days}
                    </span>
                  </div>

                  <div className="roommate-payment">
                    <strong>Rs {person.amount.toFixed(2)}</strong>

                    <div className="roommate-buttons">

                      {person.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            className="nudge-btn"
                            onClick={() => sendNudge(person.name)}
                          >
                            <MessageCircle size={11} />
                            WhatsApp Nudge
                          </button>

                          <button
                            type="button"
                            className="received-btn"
                            onClick={() => markReceived(person.id)}
                          >
                            <Check size={11} />
                            Mark Received
                          </button>
                        </>
                      ) : (
                        <span className="received-label">
                          <CheckCircle size={12} />
                          Received
                        </span>
                      )}

                    </div>
                  </div>

                </div>
              ))}

            </div>
          </section>

        </section>

        {/* RIGHT SIDE */}

        <aside className="settlement-right">

          {/* PAYMENT FLOW */}

          <section className="settlement-card">

            <div className="settlement-panel-heading">
              <h2>
                <ArrowRightLeft size={16} />
                Room Payment Flow & Pending Transfers
              </h2>

              <span>Suite 402 Summary</span>
            </div>

            <div className="payment-flow-list">

              {transactions.map((item, index) => (
                <div className="payment-flow-item" key={index}>
                  <div>
                    <strong>{item.from}</strong>
                    <ArrowRight size={11} />
                    <strong className="flow-receiver">{item.to}</strong>
                  </div>

                  <strong className="flow-amount">
                    Rs {item.amount.toFixed(2)}
                  </strong>
                </div>
              ))}

            </div>

            <div className="flow-footer">
              <CheckSquareIcon />
              <span>
                All pending balances auto-reconcile once receipts are confirmed.
              </span>
            </div>

          </section>

          {/* QR CODE CARD */}

          <section className="settlement-qr-card">

            <div className="qr-card-heading">
              <span>
                <QrCode size={14} />
                ADMIN INSTANT RAAST / SADAPAY QR
              </span>
            </div>

            <h2>Fast Settlement Clearance</h2>

            <p>
              Scan with any Pakistani Banking App (Meezan, HBL,
              Nayapay, SadaPay) to clear Rs 42.50 to Alex Rivera.
            </p>

            {/* QR IMAGE UPLOAD AREA */}

            <div className="qr-image-container">

              {qrImage ? (
                <div className="qr-uploaded-image">
                  <img src={qrImage} alt="Uploaded payment QR code" />

                  <button
                    type="button"
                    className="qr-remove-btn"
                    onClick={removeQR}
                    title="Remove QR image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="qr-placeholder">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadQR}
                  />

                  <div className="qr-placeholder-icon">
                    <Upload size={24} />
                  </div>

                  <strong>Add Your QR Code Image</strong>

                  <small>Click to upload your payment QR</small>

                  <span>
                    <Image size={12} />
                    JPG, PNG, WEBP
                  </span>
                </label>
              )}

            </div>

            <div className="qr-payment-amount">
              Rs 42.50 <span>• Raast Auto-Detect</span>
            </div>

            <button
              type="button"
              className="sada-open-btn"
              onClick={() => setNotice("Add your verified SadaPay payment deep link here.")}
            >
              <ExternalLink size={13} />
              Open in SadaPay App
            </button>

            <div className="qr-footer">
              Deep-links instantly on iOS and Android
            </div>

          </section>

          {/* PAYMENT SECURITY */}

          <section className="settlement-security">
            <ShieldCheck size={16} />

            <div>
              <strong>Secure Payment Verification</strong>
              <p>
                Always verify the recipient name and account details
                before confirming a transfer.
              </p>
            </div>
          </section>

        </aside>

      </div>

    </main>
  );
}

function CheckSquareIcon() {
  return <CheckCircle size={12} />;
}

export default NetSettlement;
