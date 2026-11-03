
import React, { useState } from "react";
import "./defrement.css";

export default function RentDeferment() {
  const [waEnabled, setWaEnabled] = useState(true);
  const [waived, setWaived] = useState(true);
  const [noticeText, setNoticeText] = useState(
    "Your rent deferment request for Sunset Heights Unit 302 has been approved by management."
  );
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="deferment-page">

      {/* HEADER */}
      <header className="defer-header">
        <div className="defer-heading">
          <div className="defer-breadcrumb">
            <span>● LANDLORD DEFERMENT QUEUE</span>
            <b>/</b> SUNSET HEIGHTS & ELITE
          </div>

          <h1>Rent Deferment & Extension<br className="desktop-break" /> Requests</h1>

          <p>
            Review risk-weighted tenant grace-period applications and manage
            late surcharge waivers for Pakistani rental properties.
          </p>
        </div>

        <div className="defer-header-actions">
          <div className="top-buttons">
            <button className="cap-btn">
              ◉ Standard 14-Day Cap
            </button>

            <button className="audit-btn">
              ◷ Historical Audit Log
            </button>
          </div>

          <button
            className="whatsapp-config"
            onClick={() => setWaEnabled(!waEnabled)}
          >
            ▤ {waEnabled ? "Configure WhatsApp Alerts" : "Enable WhatsApp Alerts"}
          </button>
        </div>
      </header>

      {/* STATISTICS */}
      <section className="defer-stats">

        <div className="defer-stat">
          <div className="stat-label">
            ACTIVE DELAY REQUESTS
            <span className="stat-symbol orange-symbol">⌛</span>
          </div>
          <h2>3 <small>Pending Review</small></h2>
          <p>● Unchanged from last cycle</p>
        </div>

        <div className="defer-stat">
          <div className="stat-label">
            DEFERRED CAPITAL
            <span className="stat-symbol teal-symbol">▣</span>
          </div>
          <h2>Rs 285,000</h2>
          <p>◉ 4.8% of Total Monthly Yield</p>
        </div>

        <div className="defer-stat">
          <div className="stat-label">
            HISTORICAL REPAYMENT RATE
            <span className="stat-symbol blue-symbol">♢</span>
          </div>
          <div className="repayment-value">
            <h2>92.5%</h2>
            <b>HEALTHY</b>
          </div>
          <div className="repayment-bar">
            <span />
          </div>
        </div>

        <div className="defer-stat">
          <div className="stat-label">
            AVG DELAY DURATION
            <span className="stat-symbol purple-symbol">▦</span>
          </div>
          <h2>7.2 Days</h2>
          <p>◷ Target threshold: &lt; 10 Days</p>
        </div>

      </section>

      {/* MAIN CONTENT */}
      <main className="defer-layout">

        {/* LEFT COLUMN */}
        <div className="defer-left">

          {/* TENANT REQUEST */}
          <section className="request-card">

            <div className="request-top">
              <div className="tenant-profile">
                <div className="tenant-avatar">ZM</div>

                <div>
                  <h3>
                    Zain Malik
                    <span className="urgent-label">URGENT ACTION</span>
                  </h3>
                  <p>Unit 302, Sunset Heights • Master Lease</p>
                  <p>#SH-0302-23</p>
                </div>
              </div>

              <div className="reliability">
                ◉ Reliability: Grade A
              </div>
            </div>

            {/* REQUEST DETAILS */}
            <div className="request-details">

              <div>
                <label>DUE AMOUNT</label>
                <h3>Rs 95,000</h3>
                <small>Original Due: Nov 01</small>
              </div>

              <div>
                <label>REQUESTED TARGET</label>
                <h3>Nov 12, 2024</h3>
                <small className="extension-text">+11 Days Extension</small>
              </div>

              <div>
                <label>TENANT TRACK RECORD</label>
                <h3>5 / 5 Paid</h3>
                <small>0 Prior Defaults Recorded</small>
              </div>

            </div>

            {/* JUSTIFICATION */}
            <div className="justification">
              <div className="justification-heading">
                <label>TENANT JUSTIFICATION & STATEMENT</label>
                <span>Submitted Oct 30, 2024 • 14:22</span>
              </div>

              <p>
                “Semester allowance delayed by university bursar due to
                faculty financial audit. Official bursary statement
                attached for verification. Funds guaranteed on or before
                November 12th.”
              </p>
            </div>

            {/* DOCUMENT */}
            <div className="document-row">
              <div className="document-icon">▧</div>

              <div className="document-info">
                <b>View Student Bursar Notice.pdf</b>
                <small>1.8 MB • Digitally Signed Certificate</small>
              </div>

              <button
                className="preview-btn"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Close" : "Preview"}
              </button>

              <button className="download-document">↓</button>
            </div>

            {showPreview && (
              <div className="preview-panel">
                <b>Document preview</b>
                <p>Student Bursar Notice.pdf</p>
                <small>Digitally signed certificate — sample preview.</small>
              </div>
            )}

          </section>

          {/* CONCESSION CONTROLS */}
          <section className="concession-card">

            <div className="concession-header">
              <div className="control-icon">▤</div>

              <h3>Landlord Concession & Surcharge Controls</h3>

              <span className="realtime-label">
                REAL-TIME ADJUSTMENT
              </span>
            </div>

            <div className="waiver-control">
              <div>
                <b>▣ Waive Late Surcharge</b>
                <small>
                  {waived ? "Late surcharge waiver enabled" : "Late surcharge applies"}
                </small>
              </div>

              <span>Rs 5,000 Waived</span>

              <button
                className={waived ? "toggle active-toggle" : "toggle"}
                onClick={() => setWaived(!waived)}
                aria-label="Toggle late surcharge waiver"
              >
                <span />
              </button>
            </div>

            <div className="approval-actions">
              <button className="approve-btn">
                ✓ Approve Extension
              </button>
              <button className="reject-btn">
                ✕ Reject Request
              </button>
            </div>

          </section>

        </div>

        {/* RIGHT COLUMN */}
        <aside className="dispatch-card">

          <div className="dispatch-header">
            <div className="dispatch-icon">▣</div>

            <div>
              <h3>Automated Dispatch</h3>
              <p>Splitfy Tenant Gateway Bot</p>
            </div>

            <span className={waEnabled ? "ready-status" : "offline-status"}>
              ● {waEnabled ? "Ready" : "Paused"}
            </span>
          </div>

          <p className="dispatch-description">
            Approved extensions generate a binding legal addendum and
            dispatch this localized message directly to Zain's
            registered phone number.
          </p>

          {/* MESSAGE PREVIEW */}
          <div className="message-preview">

            <div className="message-top">
              <div>
                <b>♢ Splitfy Portfolio Concierge</b>
              </div>
              <span>End-to-End Encrypted</span>
            </div>

            <div className="whatsapp-message">

              <div className="message-title">
                <b>NOTICE OF EXTENSION APPROVAL</b>
                <span>Ref: EXT-Nov-302</span>
              </div>

              <p>Dear Zain Malik,</p>

              <p>{noticeText}</p>

              <div className="payment-box">
                <div>
                  <span>New Payment Due:</span>
                  <b>Nov 12, 2024</b>
                </div>

                <div>
                  <span>Upfront Token:</span>
                  <b>Rs 28,500 (Due within 24h)</b>
                </div>

                <div>
                  <span>Balance on Nov 12:</span>
                  <b>Rs 66,500</b>
                </div>

                <div>
                  <span>Late Penalty:</span>
                  <b className="waived-text">
                    {waived ? "WAIVED (Rs 0.00)" : "Applicable"}
                  </b>
                </div>
              </div>

              <p className="payment-instruction">
                Please submit your initial Rs 28,500 token using your
                dynamic Splitfy collection link below:
              </p>

              <a href="https://pay.splitfy.io/sh-302-nov12">
                https://pay.splitfy.io/sh-302-nov12
              </a>

            </div>

            <div className="message-footer">
              <span>☎ +92 300 234-8902</span>

              <button onClick={() => setShowEditor(!showEditor)}>
                ✎ Edit Notice Text
              </button>
            </div>

            {showEditor && (
              <div className="notice-editor">
                <label>Edit dispatch notice</label>
                <textarea
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  rows={4}
                />
                <button onClick={() => setShowEditor(false)}>
                  Save Notice
                </button>
              </div>
            )}

          </div>

        </aside>

      </main>

    </div>
  );
}
