
import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import "./payment.css";

const PaymentSetup = () => {
  const [bank, setBank] = useState({
    bankName: "Meezan Bank",
    accountTitle: "Alex Rivera (Room 402)",
    iban: "PK36 MEZN 0001 2345 6789 01",
  });

  const [wallet, setWallet] = useState({
    provider: "JazzCash & Easypaisa",
    holder: "Alex Rivera",
    mobile: "+92 300 9876543",
    monthlyTier: "325,000",
    capacity: "500,000",
  });

  const [smsSync, setSmsSync] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [portalURL, setPortalURL] = useState(
    "https://splitfy.app/pay/room-402"
  );
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");

  const qrRef = useRef(null);

  const qrValue = portalURL || "https://splitfy.app/pay/room-402";

  const copyText = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setNotice("Unable to copy. Please copy the text manually.");
    }
  };

  const updateBank = (field, value) => {
    setBank((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateWallet = (field, value) => {
    setWallet((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const saveCredentials = () => {
    if (
      !bank.accountTitle.trim() ||
      !bank.iban.trim() ||
      !wallet.holder.trim() ||
      !wallet.mobile.trim()
    ) {
      setNotice("Please complete all required account details.");
      return;
    }

    setSaved(true);
    setNotice("Credentials validated successfully for this session.");
  };

  const downloadNoticePDF = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) {
      setNotice("QR code is not ready. Please try again.");
      return;
    }

    const pdf = new jsPDF();
    const qrImage = canvas.toDataURL("image/png");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("ROOM 402 - PAYMENT NOTICE", 105, 25, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text("Official Room Payment Portal", 105, 35, {
      align: "center",
    });

    pdf.addImage(qrImage, "PNG", 75, 50, 60, 60);

    pdf.setFontSize(12);
    pdf.text("Scan the QR code to access the payment portal.", 105, 125, {
      align: "center",
    });

    pdf.text(`Bank: ${bank.bankName}`, 25, 150);
    pdf.text(`Account: ${bank.accountTitle}`, 25, 160);
    pdf.text(`IBAN: ${bank.iban}`, 25, 170);
    pdf.text(`Wallet: ${wallet.provider}`, 25, 185);
    pdf.text(`Mobile: ${wallet.mobile}`, 25, 195);

    pdf.setFontSize(9);
    pdf.text(portalURL, 25, 215);

    pdf.save("Room-402-Payment-Notice.pdf");
    setNotice("Payment notice PDF downloaded successfully.");
  };

  const openSadaPay = () => {
    window.open("https://sadapay.pk/", "_blank", "noopener,noreferrer");
  };

  return (
    <main className="payment-page">

      {/* HEADER */}
      <header className="payment-header">
        <div className="payment-heading">
          <div className="payment-breadcrumb">
            <span>● ROOM 402 • PAYMENT SETUP & ACCOUNTS</span>
          </div>

          <h1>Payment Setup & Settlement Keys</h1>

          <p>
            Configure your verified bank accounts, digital mobile wallets,
            and instant QR codes for frictionless roommate settlements
            and ledger balancing.
          </p>
        </div>

        <div className="payment-header-actions">
          <div className="engine-status">
            <span className="engine-dot"></span>
            <div>
              <small>SETTLEMENT ENGINE</small>
              <strong>Instant Active</strong>
            </div>
          </div>

          <button
            className={`save-credentials ${saved ? "saved" : ""}`}
            onClick={saveCredentials}
          >
            <span>▣</span>
            {saved ? "Saved" : "Save Credentials"}
          </button>
        </div>
      </header>

      {/* ACCOUNT CARDS */}
      <section className="payment-top-grid">

        {/* BANK ACCOUNT */}
        <article className="payment-card bank-card">
          <div className="card-top-line">
            <span className="primary-badge">◉ Primary Group Account (Active)</span>
            <span className="verified-badge">✓ Verified</span>
          </div>

          <div className="account-heading">
            <div>
              <h3>{bank.bankName}</h3>
              <p>Islamic Corporate Syndicate</p>
            </div>
            <div className="bank-icon">▤</div>
          </div>

          <div className="field-box">
            <label>ACCOUNT TITLE</label>
            <input
              value={bank.accountTitle}
              onChange={(e) => updateBank("accountTitle", e.target.value)}
            />
          </div>

          <div className="field-box">
            <label>IBAN / RAAST DIRECT</label>
            <div className="field-copy">
              <input
                value={bank.iban}
                onChange={(e) => updateBank("iban", e.target.value)}
              />
              <button
                onClick={() => copyText(bank.iban, "iban")}
                title="Copy IBAN"
              >
                {copied === "iban" ? "✓" : "▢"}
              </button>
            </div>
          </div>

          <div className="bank-qr-row">
            <div className="small-qr">
              <QRCodeCanvas value={qrValue} size={48} />
            </div>
            <div className="qr-description">
              <strong>Raast Direct QR</strong>
              <span>0% Surcharge</span>
              <span>Interbank</span>
            </div>
            <button className="expand-qr" onClick={() => setShowQR(true)}>
              Expand ↗
            </button>
          </div>
        </article>

        {/* MOBILE WALLET */}
        <article className="payment-card wallet-card">
          <div className="wallet-top-line">
            <span className="wallet-badge">● Mobile Wallet Node</span>

            <label className="switch-control">
              <input
                type="checkbox"
                checked={smsSync}
                onChange={(e) => setSmsSync(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>

            <span className="sync-label">
              Sync SMS
              <small>{smsSync ? "Active" : "Off"}</small>
            </span>
          </div>

          <div className="account-heading">
            <div>
              <h3>{wallet.provider}</h3>
              <p>Instant Micro-Settlement</p>
            </div>
            <div className="wallet-icon">◉</div>
          </div>

          <div className="field-box">
            <label>REGISTERED HOLDER</label>
            <input
              value={wallet.holder}
              onChange={(e) => updateWallet("holder", e.target.value)}
            />
          </div>

          <div className="field-box">
            <label>MOBILE IDENTIFIER</label>
            <div className="field-copy">
              <input
                value={wallet.mobile}
                onChange={(e) => updateWallet("mobile", e.target.value)}
              />
              <button
                onClick={() => copyText(wallet.mobile, "mobile")}
                title="Copy mobile number"
              >
                {copied === "mobile" ? "✓" : "▢"}
              </button>
            </div>
          </div>

          <div className="wallet-capacity">
            <div className="capacity-heading">
              <span>MONTHLY TIER CAPACITY</span>
              <strong>
                PKR {wallet.monthlyTier} / {wallet.capacity}
              </strong>
            </div>

            <div className="capacity-track">
              <span style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    (Number(wallet.monthlyTier.replace(/,/g, "")) /
                      Math.max(1, Number(wallet.capacity.replace(/,/g, ""))) ) * 100
                  )
                )}%`
              }}></span>
            </div>

            <small>▱ Automated SMS webhook {smsSync ? "active" : "disabled"} & parsed</small>
          </div>
        </article>

        {/* SADAPAY */}
        <article className="sadapay-card">
          <div className="sada-top">
            <small>SadaBiz Commercial</small>
            <h3>SadaPay & NayaPay</h3>
            <p>Zero-Fee Virtual Checkout</p>
          </div>

          <div className="sada-detail">
            <div>
              <span>PUBLIC SADAG TAG</span>
              <strong>@alexrivera402</strong>
            </div>
            <button
              onClick={() => copyText("@alexrivera402", "sada")}
            >
              {copied === "sada" ? "✓" : "▢"}
            </button>
          </div>

          <div className="sada-bottom">
            <button className="sada-open" onClick={openSadaPay}>
              ↗ Open SadaPay App
            </button>
            <span className="sada-settings">☷</span>
          </div>
        </article>
      </section>

      {/* BOTTOM GRID */}
      <section className="payment-bottom-grid">

        {/* PAYMENT LINK */}
        <article className="payment-card portal-card">
          <div className="bottom-card-heading">
            <div className="heading-icon link-icon">↪</div>
            <div>
              <h3>1-Click Roommate Payment Link</h3>
              <p>Self-serve browser portal for room occupants to clear balance without Splitfy login.</p>
            </div>
            <span className="dynamic-badge">Dynamic URL</span>
          </div>

          <div className="portal-input-area">
            <label>SHAREABLE DIRECT PORTAL ADDRESS</label>

            <div className="portal-input-row">
              <span>◎</span>
              <input
                value={portalURL}
                onChange={(e) => setPortalURL(e.target.value)}
              />
              <button
                onClick={() => copyText(portalURL, "portal")}
                disabled={!portalURL.trim()}
              >
                {copied === "portal" ? "✓ Copied" : "↗ Copy Public Link"}
              </button>
            </div>
          </div>

          <div className="portal-features">
            <span>▤ Debit / Credit Cards</span>
            <span>♧ Dynamic IBAN & Raast</span>
            <span>▣ Auto-Receipt Issuance</span>
          </div>

          <div className="portal-footer">
            <span>Visitor analytics: <strong>14 sessions</strong> recorded this cycle.</span>
            <button onClick={() => setNotice("Custom domain configuration is ready for integration.")}>
              Configure Custom Domain →
            </button>
          </div>
        </article>

        {/* NOTICE BOARD */}
        <article className="payment-card notice-card">
          <div className="bottom-card-heading">
            <div className="heading-icon notice-icon">▣</div>
            <div>
              <h3>Room Notice Board QR</h3>
              <p>High-DPI printable PDF for physical door pinboard</p>
            </div>
          </div>

          <div className="notice-preview">
            <div className="notice-paper">
              <small>ROOM 402</small>
              <div className="notice-qr">
                <QRCodeCanvas value={qrValue} size={66} />
              </div>
              <small>SCAN TO PAY</small>
            </div>

            <div className="notice-info">
              <h3>Standard A4 Sheet</h3>
              <p>Includes official room logo, bank details, and individual payment guides.</p>
              <div>
                <span>300 DPI Vector</span>
                <span>PDF Format</span>
              </div>
            </div>
          </div>

          <button className="download-notice" onClick={downloadNoticePDF}>
            ⇩ Download Printable Room Notice Board QR (A4 PDF)
          </button>
        </article>
      </section>

      {/* NOTIFICATIONS */}
      {notice && (
        <div className="payment-toast" role="status">
          <span>✓</span>
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      {/* QR MODAL */}
      {showQR && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div
            className="qr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-qr"
              onClick={() => setShowQR(false)}
            >
              ×
            </button>

            <span className="modal-tag">ROOM 402 PAYMENT</span>
            <h2>Scan to Pay</h2>
            <p>Use your banking app to scan this payment portal QR code.</p>

            <div className="large-qr" ref={qrRef}>
              <QRCodeCanvas value={qrValue} size={210} />
            </div>

            <strong>{bank.bankName}</strong>
            <small>{bank.accountTitle}</small>

            <button
              className="modal-copy"
              onClick={() => copyText(qrValue, "modal")}
            >
              {copied === "modal" ? "✓ Link Copied" : "Copy Payment Link"}
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default PaymentSetup;
