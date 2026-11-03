
import React, { useRef, useState } from "react";
import {
  Building2,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Info,
  UserRound,
  Upload,
  Camera,
  FileImage,
  X,
  CheckCircle2,
  Circle,
  BadgeCheck,
  ScanLine,
  FileCheck2,
  Wallet,
} from "lucide-react";
import "./cash.css";

export default function ClaimCashPayment() {
  const [recipient, setRecipient] = useState("caretaker");
  const [file, setFile] = useState(null);
  const [handoverDate, setHandoverDate] = useState("2024-11-01");
  const [handoverTime, setHandoverTime] = useState("14:20");
  const [amount, setAmount] = useState("160000");

  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const recipients = [
    {
      id: "caretaker",
      name: "Chaudhry Riaz",
      role: "Building Caretaker & Keyholder • Gate 1 Desk (Custodian of Physical Lockbox)",
      tag: "ON DUTY",
      recommended: true,
    },
    {
      id: "landlord",
      name: "Malik Tariq",
      role: "Landlord / Portfolio Owner • Direct Handover",
    },
    {
      id: "office",
      name: "Building Management Office Safe",
      role: "Automated Drop • Dual Key Authentication",
      tag: "SECURE",
    },
  ];

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => setFile(null);

  const copyReceiptName = file?.name || "No document uploaded";

  return (
    <div className="cash-page">
      {/* Top Navigation */}
    

      {/* Main Content */}
      <main className="cash-main">

        {/* Page Heading */}
        <section className="cash-heading">
          <div className="cash-heading-content">
            <div className="cash-breadcrumb">
              <span>PAYMENT VERIFICATION • TENANCY APT 402</span>
              <i>•</i>
              <small>SEC-TX-8841</small>
            </div>

            <h1>Claim Physical Cash Payment</h1>

            <p>
              Logging physical handover records an immediate timestamped
              verification ticket. Caretaker and landlord are dispatched
              an immediate WhatsApp &amp; ledger prompt.
            </p>
          </div>

          <div className="cash-protocol-status">
            <div className="protocol-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <small>VERIFICATION PROTOCOL</small>
              <strong>Dual-Party Stamped</strong>
            </div>
          </div>
        </section>

        {/* Information Notice */}
        <section className="cash-info-banner">
          <div className="cash-info-icon">
            <Info size={17} />
          </div>

          <div>
            <strong>Caretaker Physical Custody Verification Protocol</strong>
            <p>
              Logging physical cash payments ensures your tenancy ledger
              remains dispute-free. The landlord and building caretaker
              will be alerted immediately to verify physical custody in
              the building lockbox. A provisional credit marker will appear
              in your ledger instantly.
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <section className="cash-content-grid">

          {/* LEFT COLUMN */}
          <div className="cash-left-column">

            {/* Allocated Unit */}
            <article className="cash-card allocated-card">
              <div className="cash-card-heading">
                <div className="cash-card-title">
                  <Building2 size={17} />
                  <h2>Allocated Tenancy Unit</h2>
                </div>

                <span className="cash-verified-badge">
                  <CheckCircle2 size={11} /> VERIFIED
                </span>
              </div>

              <div className="cash-unit-box">
                <div>
                  <strong>Sunset Heights — Apt 402</strong>
                  <p>Active 12-Month Lease • Floor 4, Tower A</p>
                </div>
                <span>Ref: LSE-PK-2024-402</span>
              </div>

              <div className="cash-amount-heading">
                <span>DISBURSED CASH AMOUNT</span>
                <small>Exact Ledger Total Due</small>
              </div>

              <div className="cash-amount-box">
                <span className="cash-currency">Rs</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-label="Cash payment amount"
                />
                <span className="cash-pkr">PKR</span>
              </div>

              <p className="cash-amount-note">
                Exact cash sum handed over for November 2024 Rent &amp;
                Utilities statement.
              </p>
            </article>

            {/* Recipient */}
            <article className="cash-card recipient-card">
              <div className="cash-card-heading">
                <div className="cash-card-title">
                  <UserRound size={17} />
                  <h2>Designated Handover Recipient</h2>
                </div>
                <span className="cash-select-label">SELECT CUSTODIAN</span>
              </div>

              <div className="cash-recipient-list">
                {recipients.map((person) => (
                  <button
                    type="button"
                    key={person.id}
                    className={`cash-recipient-option ${
                      recipient === person.id ? "selected" : ""
                    }`}
                    onClick={() => setRecipient(person.id)}
                  >
                    <span className="cash-radio">
                      {recipient === person.id ? (
                        <span />
                      ) : (
                        <Circle size={13} />
                      )}
                    </span>

                    <span className="cash-recipient-info">
                      <span className="cash-recipient-name">
                        <strong>{person.name}</strong>

                        {person.tag && (
                          <span
                            className={`cash-person-tag ${
                              person.recommended ? "recommended-tag" : ""
                            }`}
                          >
                            {person.tag}
                          </span>
                        )}

                        {person.recommended && (
                          <span className="cash-recommended">
                            Recommended
                          </span>
                        )}
                      </span>

                      <small>{person.role}</small>
                    </span>
                  </button>
                ))}
              </div>

              {/* Date & Time */}
              <div className="cash-date-time">
                <div className="cash-field">
                  <label>HANDOVER DATE</label>
                  <div className="cash-input-wrapper">
                    <CalendarDays size={15} />
                    <input
                      type="date"
                      value={handoverDate}
                      onChange={(e) => setHandoverDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="cash-field">
                  <label>HANDOVER TIME</label>
                  <div className="cash-input-wrapper">
                    <Clock3 size={15} />
                    <input
                      type="time"
                      value={handoverTime}
                      onChange={(e) => setHandoverTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="cash-recipient-footer">
                <span>Selected Custodian</span>
                <strong>
                  {recipients.find((p) => p.id === recipient)?.name}
                </strong>
              </div>
            </article>

            {/* Confirmation */}
            <article className="cash-confirmation">
              <ShieldCheck size={19} />
              <div>
                <strong>Handover Confirmation</strong>
                <p>
                  Confirm that the physical cash has been handed over
                  to the selected recipient.
                </p>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN */}
          <div className="cash-right-column">

            {/* Upload Card */}
            <article className="cash-card proof-card">
              <div className="cash-card-heading">
                <div className="cash-card-title">
                  <ScanLine size={17} />
                  <h2>Physical Proof Ingestion</h2>
                </div>

                <span className="cash-ocr-badge">OCR READY</span>
              </div>

              <div className="cash-upload-box">
                <div className="cash-upload-icon">
                  <FileImage size={22} />
                </div>

                <strong>Upload Photo or Scan Document</strong>
                <p>
                  Drop handwritten cash slip, bank withdrawal slip,
                  or signed paper envelope
                </p>

                <div className="cash-upload-actions">
                  <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                  >
                    <Upload size={14} />
                    Select File
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraRef.current.click()}
                  >
                    <Camera size={14} />
                    Camera Snap
                  </button>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>

              {/* Receipt Preview */}
              {file ? (
                <div className="cash-file-preview">
                  <div className="cash-file-heading">
                    <div>
                      <FileCheck2 size={16} />
                      <strong>{file.name}</strong>
                      <small>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      aria-label="Remove uploaded file"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Uploaded cash payment receipt"
                    />
                  )}

                  <div className="cash-file-success">
                    <CheckCircle2 size={15} />
                    Document uploaded successfully
                  </div>
                </div>
              ) : (
                <div className="cash-receipt-preview">
                  <div className="cash-file-heading">
                    <div>
                      <FileImage size={15} />
                      <strong>Caretaker_Receipt_3748.jpg</strong>
                      <small>1.8 MB</small>
                    </div>
                    <span className="cash-preview-x">
                      <X size={15} />
                    </span>
                  </div>

                  <div className="cash-paper">
                    <div className="cash-paper-top">
                      <div>
                        <strong>SUNSET HEIGHTS RESIDENCY</strong>
                        <small>Gate 1 Caretaker Cash Slip</small>
                      </div>
                      <div>
                        <strong>SLIP #3748</strong>
                        <small>Date: 01-Nov-2024</small>
                      </div>
                    </div>

                    <div className="cash-paper-details">
                      <p>
                        Property &amp; Unit:
                        <strong>Sunset Heights Apt 402</strong>
                      </p>
                      <p>
                        Received Amount:
                        <strong>Rs {Number(amount || 0).toLocaleString("en-PK")} PKR</strong>
                      </p>
                      <p>
                        Received By:
                        <strong>
                          {recipients.find((p) => p.id === recipient)?.name}
                        </strong>
                      </p>
                    </div>

                    <div className="cash-paper-footer">
                      <span>✍ Caretaker Signed &amp; Stamped</span>
                      <strong>VERIFIED 01-NOV</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Verification */}
              <div className="cash-ocr-result">
                <div className="cash-ocr-heading">
                  <CheckCircle2 size={16} />
                  <strong>OPTICAL ENGINE VERIFIED</strong>
                  <span>ACTIVE</span>
                </div>

                <p>
                  OCR detected receipt #3748. Amount verification
                  is ready for review against the tenancy ledger.
                </p>
              </div>
            </article>

            {/* Security Card */}
            <article className="cash-security-card">
              <div className="cash-security-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>Secure Verification &amp; Audit Trail</strong>
                <p>
                  Your submission will be recorded with a timestamp
                  and linked to your tenancy record.
                </p>
              </div>
            </article>

            {/* Submit */}
            <button
              type="button"
              className="cash-submit-btn"
              onClick={() => {
                if (!file) {
                  alert("Please upload your cash payment proof first.");
                  return;
                }

                alert(
                  `Cash payment claim submitted for Rs ${Number(amount).toLocaleString("en-PK")} to ${recipients.find((p) => p.id === recipient)?.name}.`
                );
              }}
            >
              <BadgeCheck size={17} />
              Submit Cash Payment Claim
            </button>

            <p className="cash-submit-note">
              <ShieldCheck size={12} />
              Protected by Splitfy Tenant Verification Protocol
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
