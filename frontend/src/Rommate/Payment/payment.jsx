
import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Landmark,
  Copy,
  Smartphone,
  Wallet,
  CreditCard,
  QrCode,
  Link,
  Share2,
  Printer,
  Download,
  SlidersHorizontal,
  MessageSquare,
  ExternalLink,
  Globe,
  Zap,
  Settings,
  Check,
  Building2,
  Receipt,
  Banknote
} from "lucide-react";

import "./payment.css";

export default function PaymentSetup() {
  const [smsSync, setSmsSync] = useState(true);
  const [bankTitle, setBankTitle] = useState("Alex Rivera (Room 402)");
  const [iban, setIban] = useState("PK36 MEZN 0001 2345 678...");
  const [mobileNumber, setMobileNumber] = useState("+92 300 9876543");
  const [publicTag, setPublicTag] = useState("@alexrivera402");
  const [paymentLink, setPaymentLink] = useState(
    "https://splitfy.app/pay/room-402"
  );
  const [copied, setCopied] = useState("");

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("Copy unavailable");
    }
  };

  const saveCredentials = () => {
    alert("Payment credentials are ready to be saved.");
  };

  const openPaymentApp = () => {
    window.open("https://sadapay.pk/", "_blank");
  };

  const downloadNotice = () => {
    window.print();
  };

  return (
    <div className="payment-page">

      {/* HEADER */}

      <header className="payment-header">

        <div className="payment-heading">
          <div className="payment-breadcrumb">
            <span>●</span>
            ROOM 402 • PAYMENT SETUP & ACCOUNTS
          </div>

          <h1>Payment Setup & Settlement Keys</h1>

          <p>
            Configure your verified bank accounts, digital mobile wallets,
            and instant QR codes for frictionless roommate settlements
            and ledger balancing.
          </p>
        </div>

        <div className="payment-header-actions">

          <div className="settlement-status">
            <div className="status-dot"></div>
            <div>
              <span>SETTLEMENT ENGINE</span>
              <strong>Instant Active</strong>
            </div>
          </div>

          <button
            className="save-credentials-btn"
            onClick={saveCredentials}
          >
            <CreditCard size={14} />
            Save Credentials
          </button>

        </div>
      </header>

      {/* TOP PAYMENT CARDS */}

      <section className="payment-top-grid">

        {/* BANK ACCOUNT */}

        <div className="payment-card bank-card">

          <div className="account-card-header">
            <div className="account-badges">
              <span className="primary-badge">
                <ShieldCheck size={11} />
                Primary Group Account (Active)
              </span>

              <span className="verified-badge">
                <CheckCircle2 size={11} />
                Verified
              </span>
            </div>
          </div>

          <div className="provider-heading">
            <div>
              <h3>Meezan Bank</h3>
              <p>Islamic Corporate Syndicate</p>
            </div>

            <div className="provider-icon bank-provider">
              <Landmark size={17} />
            </div>
          </div>

          <div className="payment-detail">
            <label>ACCOUNT TITLE</label>
            <strong>{bankTitle}</strong>
          </div>

          <div className="payment-detail copy-detail">
            <div>
              <label>IBAN / RAAS DIRECT</label>
              <strong>{iban}</strong>
            </div>

            <button
              onClick={() => copyText(iban, "IBAN")}
              title="Copy IBAN"
            >
              {copied === "IBAN" ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>

          <div className="bank-bottom">

            <div className="qr-preview">
              <QrCode size={31} />
            </div>

            <div className="qr-description">
              <strong>Raast Direct QR</strong>
              <span>0% Surcharge</span>
              <span>Interbank</span>
            </div>

            <button
              className="expand-qr"
              onClick={() => alert("QR preview integration pending.")}
            >
              Expand <ExternalLink size={11} />
            </button>

          </div>

        </div>

        {/* MOBILE WALLET */}

        <div className="payment-card wallet-card">

          <div className="wallet-header">
            <span className="wallet-badge">
              <span></span>
              Mobile Wallet Active
            </span>

            <label className="sms-toggle">
              <input
                type="checkbox"
                checked={smsSync}
                onChange={(e) => setSmsSync(e.target.checked)}
              />

              <span className="toggle-track"></span>
              <span>Sync SMS</span>
            </label>
          </div>

          <div className="provider-heading">
            <div>
              <h3>JazzCash & Easypaisa</h3>
              <p>Instant Micro-Settlement</p>
            </div>

            <div className="provider-icon mobile-provider">
              <Wallet size={17} />
            </div>
          </div>

          <div className="payment-detail">
            <label>REGISTERED HOLDER</label>
            <strong>{bankTitle.split(" (")[0]}</strong>
          </div>

          <div className="payment-detail copy-detail">
            <div>
              <label>MOBILE IDENTIFIER</label>
              <strong>{mobileNumber}</strong>
            </div>

            <button
              onClick={() => copyText(mobileNumber, "Mobile")}
              title="Copy number"
            >
              {copied === "Mobile" ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>

          <div className="wallet-capacity">
            <div>
              <span>MONTHLY TIER CAPACITY</span>
              <strong>PKR 325,000 / 500,000 (65%)</strong>
            </div>

            <div className="capacity-track">
              <span></span>
            </div>
          </div>

          <div className="sms-status">
            <MessageSquare size={11} />
            {smsSync
              ? "Automated SMS webhook active & parsed"
              : "SMS synchronization paused"}
          </div>

        </div>

        {/* SADAPAY CARD */}

        <div className="payment-card sadapay-card">

          <div className="sada-top">
            <div>
              <span>SadaBiz Commercial</span>
              <h3>SadaPay & NayaPay</h3>
              <p>Zero-Fee Virtual Checkout</p>
            </div>

            <div className="sada-icon">
              <CreditCard size={18} />
            </div>
          </div>

          <div className="public-tag-box">
            <label>PUBLIC SADATAG</label>

            <div>
              <strong>{publicTag}</strong>

              <button
                onClick={() => copyText(publicTag, "Tag")}
                title="Copy public tag"
              >
                {copied === "Tag" ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          </div>

          <div className="sada-actions">
            <button
              className="open-sada-btn"
              onClick={openPaymentApp}
            >
              <ExternalLink size={12} />
              Open SadaPay App
            </button>

            <button
              className="sada-settings"
              onClick={() => alert("SadaPay settings")}
              title="Settings"
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>

        </div>

      </section>

      {/* LOWER PAYMENT CARDS */}

      <section className="payment-bottom-grid">

        {/* PAYMENT LINK */}

        <div className="payment-card payment-link-card">

          <div className="lower-card-heading">
            <div className="lower-heading-icon link-icon">
              <Link size={16} />
            </div>

            <div>
              <h3>1-Click Roommate Payment Link</h3>
              <p>
                Self-serve browser portal for room occupants to clear
                balance without Splitfy login.
              </p>
            </div>

            <span className="dynamic-badge">Dynamic URL</span>
          </div>

          <div className="share-link-box">

            <label>SHAREABLE DIRECT PORTAL ADDRESS</label>

            <div className="share-link-controls">
              <div className="link-input">
                <Globe size={13} />

                <input
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                />
              </div>

              <button
                className="copy-public-btn"
                onClick={() => copyText(paymentLink, "Public Link")}
              >
                {copied === "Public Link" ? (
                  <Check size={13} />
                ) : (
                  <Share2 size={13} />
                )}

                {copied === "Public Link" ? "Copied" : "Copy Public Link"}
              </button>
            </div>

          </div>

          <div className="payment-features">

            <div>
              <CreditCard size={13} />
              Debit / Credit Cards
            </div>

            <div>
              <Landmark size={13} />
              Dynamic IBAN & Raast
            </div>

            <div>
              <Receipt size={13} />
              Auto-Receipt Issuance
            </div>

          </div>

          <div className="link-footer">
            <span>
              Visitor analytics: <strong>14 sessions</strong> recorded this cycle.
            </span>

            <button onClick={() => alert("Custom domain settings")}>
              Configure Custom Domain <span>→</span>
            </button>
          </div>

        </div>

        {/* NOTICE BOARD */}

        <div className="payment-card notice-board-card">

          <div className="lower-card-heading">

            <div className="lower-heading-icon notice-icon">
              <Printer size={16} />
            </div>

            <div>
              <h3>Room Notice Board QR</h3>
              <p>
                High-DPI printable PDF for physical door pinboard
              </p>
            </div>

          </div>

          <div className="notice-preview">

            <div className="notice-logo">
              <span>SPLITFY</span>
              <small>ROOM 402</small>

              <div className="notice-qr">
                <QrCode size={39} />
              </div>

              <span>SCAN TO PAY</span>
            </div>

            <div className="notice-description">
              <h3>Standard A4 Sheet</h3>

              <p>
                Includes official room logo, bank details,
                and individual payment guides.
              </p>

              <div className="print-tags">
                <span>300 DPI Vector</span>
                <span>PDF Format</span>
              </div>
            </div>

          </div>

          <button
            className="download-notice-btn"
            onClick={downloadNotice}
          >
            <Download size={14} />
            Download Printable Room Notice Board QR (A4 PDF)
          </button>

        </div>

      </section>

      {/* STATUS FOOTER */}

      <div className="payment-footer">
        <span>
          <ShieldCheck size={13} />
          Secure payment configuration
        </span>

        <span>
          <Zap size={12} />
          Instant settlement engine
        </span>

        <span>
          <CheckCircle2 size={13} />
          Room 402 Account Setup
        </span>
      </div>

    </div>
  );
}
