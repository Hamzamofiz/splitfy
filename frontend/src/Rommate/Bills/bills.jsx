
import React, { useState, useRef } from "react";
import {
  Zap, Droplets, Flame, Wifi, CloudUpload,
  FilePlus2, FileText, CalendarDays, CalendarClock,
  ShieldCheck, SlidersHorizontal, Receipt,
  Search, Maximize2, ChevronDown, Users,
  Calculator, Gauge, CircleDollarSign,
  CheckCircle2, X, Upload, ScanLine
} from "lucide-react";

import "./bills.css";

const utilityTypes = [
  { name: "Electricity (IESCO/LESCO)", icon: Zap },
  { name: "Water Tanker & Supply", icon: Droplets },
  { name: "Sui Gas / Cylinder", icon: Flame },
  { name: "High-Speed Fiber Internet", icon: Wifi }
];

const splitMethods = [
  {
    id: "equal",
    title: "Equal Split (100% Shared)",
    description: "Even division across all 6 verified residents",
    icon: Users
  },
  {
    id: "prorated",
    title: "Per-Day Prorated",
    description: "Factored by active move-in / days present",
    icon: CalendarDays
  },
  {
    id: "meter",
    title: "Custom Sub-Meter Units",
    description: "Weighted by individual room meter dials",
    icon: Gauge
  }
];

export default function UtilityIntake() {
  const fileRef = useRef(null);

  const [activeUtility, setActiveUtility] = useState(utilityTypes[0].name);
  const [splitMethod, setSplitMethod] = useState("equal");
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("480.00");
  const [consumerId, setConsumerId] = useState("04 11234 5678901 U");
  const [issueDate, setIssueDate] = useState("2024-10-04");
  const [dueDate, setDueDate] = useState("2024-10-18");

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const members = [
    { name: "Alex Rivera", share: 80 },
    { name: "Zain Malik", share: 80 },
    { name: "Hamza Tariq", share: 80 },
    { name: "Daniyal Ahmed", share: 80 },
    { name: "Sarah Khan", share: 80 },
    { name: "Ali Hassan", share: 80 }
  ];

  const total = Number(amount) || 0;
  const individualShare = total / members.length;

  return (
    <div className="utility-page">

      {/* Header */}

      <header className="utility-header">
        <div className="utility-heading">
          <div className="utility-breadcrumb">
            <span>LEDGER ENTRY · ROOM 402</span>
            <i>•</i>
            <span>▣ Hostel Room 402 Utility Intake</span>
          </div>

          <h1>Monthly Utility Bill Intake & OCR Extraction</h1>

          <p>
            Upload official utility bills or PDF invoices. Splitfy
            auto-extracts consumer numbers, units, and billing
            amounts for easy room splitting.
          </p>
        </div>

        <div className="cycle-card">
          <div className="cycle-icon">
            <Receipt size={19} />
          </div>
          <div className="cycle-info">
            <span>CYCLE STATUS</span>
            <strong>3 of 5 Invoices Cleared</strong>
          </div>
          <div className="cycle-due">
            <span>Due in 9</span>
            <strong>Days</strong>
          </div>
        </div>
      </header>

      {/* Utility Navigation */}

      <nav className="utility-tabs">
        {utilityTypes.map((utility) => {
          const Icon = utility.icon;

          return (
            <button
              key={utility.name}
              onClick={() => setActiveUtility(utility.name)}
              className={`utility-tab ${
                activeUtility === utility.name ? "selected" : ""
              }`}
            >
              <Icon size={16} />
              {utility.name}
              {activeUtility === utility.name && (
                <span className="tab-dot"></span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="utility-layout">

        {/* LEFT COLUMN */}

        <div className="utility-left">

          {/* Upload Card */}

          <section className="utility-card upload-card">
            <div className="section-heading">
              <h3>
                <CloudUpload size={17} />
                Invoice Intake Dropzone
              </h3>
              <span className="file-limit">MAX 25MB · PDF, JPG, PNG</span>
            </div>

            <div
              className="dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") fileRef.current.click();
              }}
            >
              <div className="upload-circle">
                <FilePlus2 size={25} />
              </div>

              <h4>
                Drag & drop document or
                <span> browse file system</span>
              </h4>

              <p>
                Directly parse municipal utility slips,
                high-resolution scans, or raw photo receipts
                from billing meters.
              </p>

              <div className="supported-tags">
                <span>LESCO Electric</span>
                <span>IESCO WAPDA</span>
                <span>Nayatel Fiber</span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>

            {file && (
              <div className="uploaded-file">
                <div className="file-icon">
                  <FileText size={20} />
                </div>

                <div className="file-details">
                  <strong>{file.name}</strong>
                  <span>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                    <i>•</i> Uploaded successfully
                  </span>
                </div>

                <button
                  className="remove-file"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {!file && (
              <div className="uploaded-file sample-file">
                <div className="file-icon">
                  <FileText size={20} />
                </div>

                <div className="file-details">
                  <strong>Oct_2024_Electricity_Bill.pdf</strong>
                  <span>3.4 MB <i>•</i> Scanned via Optical Neural Engine</span>
                </div>

                <div className="ocr-confidence">
                  <CheckCircle2 size={14} />
                  <div>
                    <strong>OCR Confidence: 99.4%</strong>
                    <span>Dual-Pass Verified</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Invoice Blueprint */}

          <section className="utility-card blueprint-card">
            <div className="section-heading">
              <h3>
                <Receipt size={17} />
                Interactive Extraction Blueprint
              </h3>

              <div className="blueprint-actions">
                <button title="Search"><Search size={15} /></button>
                <button title="Expand"><Maximize2 size={15} /></button>
                <span>Page 1 of 1</span>
              </div>
            </div>

            <div className="invoice-preview">
              <div className="invoice-top">
                <div>
                  <span className="invoice-small">
                    ELECTRICITY DISTRIBUTION SYNDICATE
                  </span>
                  <h3>LESCO DISTRIBUTION COMPANY</h3>
                  <p>Sub-Division: G-10/4 Commercial Plaza</p>
                  <p>Commercial General</p>
                </div>

                <div className="invoice-month">
                  <strong>OCTOBER 2024</strong>
                  <span>Ref: 04-11234-5678901-U</span>
                </div>
              </div>

              <div className="ocr-labels">
                <span>OCR · ID</span>
                <span>OCR · ISSUED</span>
                <span>OCR · DUE</span>
              </div>

              <div className="invoice-fields">
                <div>
                  <span>CONSUMER REF ID</span>
                  <strong>04 11234 5678901 U</strong>
                </div>

                <div>
                  <span>BILLING ISSUE DATE</span>
                  <strong>04 Oct 2024</strong>
                </div>

                <div>
                  <span>DUE DATE</span>
                  <strong>18 Oct 2024</strong>
                </div>
              </div>

              <div className="meter-section">
                <div className="meter-heading">
                  <strong>METER UNITS TRACKED</strong>
                  <span>OCR VERIFIED</span>
                </div>

                <div className="meter-visual">
                  <div className="meter-bar">
                    <span></span>
                  </div>
                  <strong>240 kWh</strong>
                </div>
              </div>

              <div className="invoice-total">
                <span>TOTAL BILL AMOUNT</span>
                <strong>Rs {total.toFixed(2)}</strong>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}

        <div className="utility-right">

          {/* Extracted Fields */}

          <section className="utility-card extracted-card">
            <div className="section-heading">
              <h3>
                <SlidersHorizontal size={17} />
                Extracted Ingestion Fields
              </h3>

              <span className="ocr-live">
                <span></span> Live OCR Sync
              </span>
            </div>

            <div className="field-group">
              <label>BILL REFERENCE / CONSUMER ID</label>
              <div className="field-input">
                <Receipt size={14} />
                <input
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                />
                <CheckCircle2 size={15} className="verified-icon" />
              </div>
            </div>

            <div className="date-fields">
              <div className="field-group">
                <label>ISSUE DATE</label>
                <div className="field-input">
                  <CalendarDays size={14} />
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>DUE DATE</label>
                <div className="field-input">
                  <CalendarClock size={14} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="amount-field">
              <div>
                <label>TOTAL AMOUNT TO SPLIT</label>
                <span>Base Payable</span>
              </div>

              <div className="amount-input">
                <span>Rs</span>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Split Method */}

          <section className="utility-card split-card">
            <div className="section-heading">
              <h3>SPLIT METHODOLOGY SELECTION</h3>
            </div>

            <div className="split-options">
              {splitMethods.map((method) => {
                const Icon = method.icon;

                return (
                  <button
                    key={method.id}
                    className={`split-option ${
                      splitMethod === method.id ? "chosen" : ""
                    }`}
                    onClick={() => setSplitMethod(method.id)}
                  >
                    <span className="split-radio">
                      {splitMethod === method.id && (
                        <span></span>
                      )}
                    </span>

                    <div className="split-description">
                      <strong>{method.title}</strong>
                      <span>{method.description}</span>
                    </div>

                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Allocation Preview */}

          <section className="utility-card allocation-card">
            <div className="section-heading">
              <h3>
                <Calculator size={17} />
                Allocation Preview
              </h3>
              <span className="member-count">6 Members Active</span>
            </div>

            <div className="allocation-total">
              <div>
                <span>Standard Individual Share</span>
                <strong>
                  Rs {individualShare.toFixed(2)}
                </strong>
              </div>

              <div>
                <span>TOTAL POOL</span>
                <strong>Rs {total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="allocation-progress">
              <span></span>
            </div>

            <div className="member-list">
              {members.map((member, index) => (
                <div className="member-row" key={member.name}>
                  <div className="member-avatar">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  <span>{member.name}</span>

                  <strong>
                    Rs {individualShare.toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <button className="confirm-allocation">
              <ShieldCheck size={16} />
              Confirm & Save Allocation
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
