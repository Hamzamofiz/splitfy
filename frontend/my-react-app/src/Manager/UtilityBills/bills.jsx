
import React, { useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  CloudUpload,
  Droplet,
  FileCheck,
  FileText,
  Flame,
  Gauge,
  Info,
  Maximize2,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wifi,
  Zap,
  X,
  RefreshCw,
} from "lucide-react";

import "./bills.css";

const utilityTypes = [
  { id: "electricity", label: "Electricity (IESCO/LESCO)", icon: Zap, company: "LESCO" },
  { id: "water", label: "Water Tanker & Supply", icon: Droplet, company: "Water Supply" },
  { id: "gas", label: "Sui Gas / Cylinder", icon: Flame, company: "SNGPL" },
  { id: "internet", label: "High-Speed Fiber Internet", icon: Wifi, company: "Nayatel" },
];

const initialFields = {
  reference: "04 11234 5678901 U",
  issueDate: "Oct 04, 2024",
  dueDate: "Oct 18, 2024",
  amount: "480.00",
  company: "LESCO",
  consumerName: "LESCO DISTRIBUTION COMPANY",
  meterNumber: "04 11234 5678901 U",
};

const residents = [
  { id: 1, name: "Alex Rivera", room: "402-A", percentage: 16.67, meterUnits: 30 },
  { id: 2, name: "Hamza Tariq", room: "402-B", percentage: 16.67, meterUnits: 25 },
  { id: 3, name: "Daniel Smith", room: "402-C", percentage: 16.67, meterUnits: 20 },
  { id: 4, name: "Ahmed Khan", room: "402-D", percentage: 16.67, meterUnits: 18 },
  { id: 5, name: "Ryan Cooper", room: "402-E", percentage: 16.66, meterUnits: 15 },
  { id: 6, name: "Usman Ali", room: "402-F", percentage: 16.66, meterUnits: 12 },
];

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const MonthlyUtilityBill = () => {
  const fileInputRef = useRef(null);

  const [activeUtility, setActiveUtility] = useState("electricity");
  const [splitMethod, setSplitMethod] = useState("equal");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [showAllocation, setShowAllocation] = useState(false);
  const [fields, setFields] = useState(initialFields);
  const [uploadError, setUploadError] = useState("");

  const selectedUtility = utilityTypes.find(
    (item) => item.id === activeUtility
  );

  const totalAmount = Math.max(0, Number(fields.amount) || 0);

  // Calculate shares and distribute rounding differences
  // so the final resident amounts always equal the bill total.
  const getAllocation = () => {
    const weights = residents.map((resident) => {
      if (splitMethod === "prorated") {
        return resident.percentage;
      }

      if (splitMethod === "meter") {
        return resident.meterUnits;
      }

      return 1;
    });

    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    const totalCents = Math.round(totalAmount * 100);

    if (!totalWeight || totalCents <= 0) {
      return residents.map(() => 0);
    }

    const exactShares = weights.map(
      (weight) => (totalCents * weight) / totalWeight
    );

    const roundedShares = exactShares.map(Math.floor);

    let remainingCents =
      totalCents - roundedShares.reduce((sum, value) => sum + value, 0);

    const remainderOrder = exactShares
      .map((value, index) => ({
        index,
        remainder: value - Math.floor(value),
      }))
      .sort((a, b) => b.remainder - a.remainder);

    for (let i = 0; i < remainingCents; i++) {
      roundedShares[remainderOrder[i].index] += 1;
    }

    return roundedShares.map((value) => value / 100);
  };

  const allocations = getAllocation();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setFields((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUtilityChange = (utility) => {
    setActiveUtility(utility.id);

    setFields((previous) => ({
      ...previous,
      company: utility.company,
      consumerName: utility.company.toUpperCase() + " UTILITY SERVICES",
    }));
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setUploadError("");

    const extension = selectedFile.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];

    if (!allowedExtensions.includes(extension)) {
      setUploadError("Please select a PDF, JPG or PNG document.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setUploadError("File size must be below 25 MB.");
      return;
    }

    if (selectedFile.size === 0) {
      setUploadError("The selected file is empty.");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setOcrComplete(false);
    setShowAllocation(false);

    // Demo processing only.
    // Connect your backend OCR endpoint here for real extraction.
    window.setTimeout(() => {
      setIsProcessing(false);
      setOcrComplete(true);
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setFile(null);
    setOcrComplete(false);
    setIsProcessing(false);
    setUploadError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!file) {
      setUploadError("Please upload a bill before saving.");
      return;
    }

    if (isProcessing || !ocrComplete) {
      setUploadError("Please wait until processing is complete.");
      return;
    }

    if (!fields.reference.trim() || !fields.company.trim() || totalAmount <= 0) {
      setUploadError("Please enter valid bill details and amount.");
      return;
    }

    if (
      fields.issueDate &&
      fields.dueDate &&
      new Date(fields.dueDate) < new Date(fields.issueDate)
    ) {
      setUploadError("Due date cannot be earlier than the issue date.");
      return;
    }

    setUploadError("");
    setShowAllocation(true);
  };

  const handleExport = () => {
    const rows = [
      ["Resident", "Room", "Split Method", "Share (PKR)"],
      ...residents.map((resident, index) => [
        resident.name,
        resident.room,
        splitMethod,
        allocations[index].toFixed(2),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "splitify-utility-allocation.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const individualShare =
    allocations.reduce((sum, value) => sum + value, 0) /
    residents.length;

  return (
    <div className="utility-page">

      {/* HEADER */}
      <header className="utility-header">
        <div className="utility-heading">
          <div className="utility-breadcrumb">
            <span>LEDGER ENTRY • ROOM 402</span>
            <ArrowRight size={12} />
            <span>Hostel Room 402 Utility Intake</span>
          </div>

          <h1>Monthly Utility Bill Intake & OCR Extraction</h1>

          <p>
            Upload official utility bills and manage resident-wise
            allocations with intelligent document processing.
          </p>
        </div>

        <div className="cycle-status">
          <div className="cycle-icon">
            <FileCheck size={20} />
          </div>

          <div className="cycle-info">
            <span>CYCLE STATUS</span>
            <strong>3 of 5 Invoices Cleared</strong>
          </div>

          <div className="cycle-divider" />

          <div className="due-status">
            <span>Due in 9</span>
            <strong>Days</strong>
          </div>
        </div>
      </header>

      {/* UTILITY SELECTOR */}
      <section className="utility-selector">
        {utilityTypes.map((utility) => {
          const Icon = utility.icon;

          return (
            <button
              key={utility.id}
              type="button"
              className={`utility-tab ${
                activeUtility === utility.id ? "active" : ""
              }`}
              onClick={() => handleUtilityChange(utility)}
            >
              <Icon size={16} />
              <span>{utility.label}</span>

              {activeUtility === utility.id && (
                <span className="tab-indicator" />
              )}
            </button>
          );
        })}
      </section>

      {/* MAIN GRID */}
      <div className="utility-main-grid">

        {/* LEFT COLUMN */}
        <div className="utility-left-column">

          {/* UPLOAD PANEL */}
          <section className="utility-panel upload-panel">
            <div className="utility-panel-header">
              <h2>
                <CloudUpload size={17} />
                Invoice Intake Dropzone
              </h2>

              <span className="upload-limit">
                MAX 25MB • PDF, JPG, PNG
              </span>
            </div>

            <div
              className={`upload-dropzone ${
                isDragging ? "dragging" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsDragging(false);
                }
              }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="upload-icon">
                <CloudUpload size={25} />
              </div>

              <h3>
                Drag & drop your document or{" "}
                <span>browse files</span>
              </h3>

              <p>
                Upload a clear utility bill, invoice or scanned receipt
                for processing.
              </p>

              <div className="supported-providers">
                <span>LESCO Electric</span>
                <span>IESCO WAPDA</span>
                <span>Nayatel Fiber</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                hidden
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>

            {uploadError && (
              <div className="upload-error">
                <Info size={14} />
                {uploadError}
              </div>
            )}

            <div className="uploaded-file">
              <div className="uploaded-file-icon">
                <FileText size={19} />
              </div>

              <div className="uploaded-file-info">
                <strong>
                  {file ? file.name : "No document uploaded"}
                </strong>

                <span>
                  {file
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Select a bill to begin"}
                </span>

                <span className="scan-status">
                  {isProcessing ? (
                    <>
                      <RefreshCw size={12} className="processing-icon" />
                      Processing document...
                    </>
                  ) : ocrComplete ? (
                    <>
                      <CheckCircle2 size={12} />
                      Processing completed
                    </>
                  ) : (
                    <>
                      <Info size={12} />
                      Awaiting document
                    </>
                  )}
                </span>
              </div>

              {file && (
                <div className="file-actions">
                  <div className="ocr-confidence">
                    {isProcessing ? (
                      <>
                        <Activity size={13} />
                        Processing
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} />
                        Demo OCR Ready
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="remove-file-button"
                    title="Remove document"
                    onClick={removeFile}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* BLUEPRINT */}
          <section className="utility-panel blueprint-panel">
            <div className="utility-panel-header blueprint-header">
              <h2>
                <FileText size={17} />
                Interactive Extraction Blueprint
              </h2>

              <div className="blueprint-tools">
                <button
                  type="button"
                  title="Focus reference field"
                  onClick={() =>
                    document.getElementById("reference-field")?.focus()
                  }
                >
                  <Search size={15} />
                </button>

                <button
                  type="button"
                  title="View bill preview"
                  onClick={() =>
                    document.getElementById("bill-preview")?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }
                >
                  <Maximize2 size={15} />
                </button>

                <span>Page 1 of 1</span>
              </div>
            </div>

            <div className="bill-preview" id="bill-preview">
              <div className="bill-preview-top">
                <div>
                  <span className="bill-company-label">
                    UTILITY DISTRIBUTION SERVICES
                  </span>

                  <h3>{fields.consumerName}</h3>

                  <p>
                    Sub-Division: G-10/4 Commercial Plaza •
                    Tariff: Commercial General
                  </p>
                </div>

                <div className="bill-month">
                  OCTOBER 2024
                </div>
              </div>

              <div className="bill-reference">
                Ref: {fields.reference || "Not provided"}
              </div>

              <div className="extraction-labels">
                <span>OCR • ID</span>
                <span>OCR • ISSUED</span>
                <span>OCR • DUE</span>
              </div>

              <div className="bill-data-grid">
                <div className="bill-data-item">
                  <small>CONSUMER REF ID</small>
                  <strong>{fields.meterNumber}</strong>
                </div>

                <div className="bill-data-item">
                  <small>ISSUE DATE</small>
                  <strong>{fields.issueDate}</strong>
                </div>

                <div className="bill-data-item">
                  <small>DUE DATE</small>
                  <strong>{fields.dueDate}</strong>
                </div>
              </div>

              <div className="bill-preview-bottom">
                <span>METER UNITS TRACKED</span>
                <strong>
                  {residents.reduce(
                    (sum, resident) => sum + resident.meterUnits,
                    0
                  )}{" "}
                  Units
                </strong>
              </div>
            </div>

            <div className="blueprint-footer">
              <span>
                <ShieldCheck size={14} />
                Document structure preview
              </span>

              <span>Splitify Intake v2.4</span>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="utility-right-column">

          {/* EXTRACTED FIELDS */}
          <section className="utility-panel extraction-panel">
            <div className="extraction-heading">
              <h2>
                <SlidersHorizontal size={17} />
                Extracted Ingestion Fields
              </h2>

              <span className="live-ocr">LIVE FIELD SYNC</span>
            </div>

            {isProcessing && (
              <div className="processing-message">
                <Activity size={15} />
                Preparing document preview...
              </div>
            )}

            <div className="field-group">
              <label htmlFor="reference-field">
                BILL REFERENCE / CONSUMER ID
              </label>

              <div className="field-input-wrapper">
                <FileText size={15} />

                <input
                  id="reference-field"
                  name="reference"
                  value={fields.reference}
                  onChange={handleFieldChange}
                  placeholder="Enter consumer reference"
                />

                <CheckCircle2 size={14} className="verified-icon" />
              </div>
            </div>

            <div className="field-two-columns">
              <div className="field-group">
                <label htmlFor="issue-date">ISSUE DATE</label>

                <div className="field-input-wrapper">
                  <Calendar size={14} />

                  <input
                    id="issue-date"
                    name="issueDate"
                    value={fields.issueDate}
                    onChange={handleFieldChange}
                    placeholder="Issue date"
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="due-date">DUE DATE</label>

                <div className="field-input-wrapper">
                  <Calendar size={14} />

                  <input
                    id="due-date"
                    name="dueDate"
                    value={fields.dueDate}
                    onChange={handleFieldChange}
                    placeholder="Due date"
                  />
                </div>
              </div>
            </div>

            <div className="total-amount-box">
              <div>
                <span>TOTAL AMOUNT TO SPLIT</span>
                <small>Base Payable</small>
              </div>

              <div className="amount-input-wrapper">
                <span>Rs</span>

                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={fields.amount}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <div className="field-group company-field">
              <label htmlFor="company-name">UTILITY PROVIDER</label>

              <input
                id="company-name"
                className="normal-field"
                name="company"
                value={fields.company}
                onChange={handleFieldChange}
                placeholder="Provider name"
              />
            </div>

            <button
              className="save-extraction-button"
              type="button"
              onClick={handleSave}
              disabled={isProcessing || !file}
            >
              <Check size={16} />
              Save Extracted Bill
            </button>
          </section>

          {/* SPLIT METHOD */}
          <section className="utility-panel split-panel">
            <div className="small-panel-heading">
              <h2>
                <SlidersHorizontal size={15} />
                SPLIT METHODOLOGY SELECTION
              </h2>
            </div>

            <div className="split-options">
              <button
                type="button"
                className={`split-option ${
                  splitMethod === "equal" ? "selected" : ""
                }`}
                onClick={() => setSplitMethod("equal")}
              >
                <span className="radio-circle">
                  {splitMethod === "equal" && <span />}
                </span>

                <span className="split-option-content">
                  <strong>Equal Split</strong>
                  <small>Same amount for all 6 residents</small>
                </span>

                <Users size={16} />
              </button>

              <button
                type="button"
                className={`split-option ${
                  splitMethod === "prorated" ? "selected" : ""
                }`}
                onClick={() => setSplitMethod("prorated")}
              >
                <span className="radio-circle">
                  {splitMethod === "prorated" && <span />}
                </span>

                <span className="split-option-content">
                  <strong>Per-Day Prorated</strong>
                  <small>Based on resident occupancy shares</small>
                </span>

                <Calendar size={16} />
              </button>

              <button
                type="button"
                className={`split-option ${
                  splitMethod === "meter" ? "selected" : ""
                }`}
                onClick={() => setSplitMethod("meter")}
              >
                <span className="radio-circle">
                  {splitMethod === "meter" && <span />}
                </span>

                <span className="split-option-content">
                  <strong>Custom Sub-Meter Units</strong>
                  <small>Weighted by individual room readings</small>
                </span>

                <Gauge size={16} />
              </button>
            </div>

            {splitMethod === "meter" && (
              <div className="method-notice">
                <Info size={14} />
                Allocation uses the sample meter readings configured for
                each resident.
              </div>
            )}

            {splitMethod === "prorated" && (
              <div className="method-notice">
                <Info size={14} />
                Allocation uses each resident's configured occupancy
                percentage.
              </div>
            )}
          </section>

          {/* ALLOCATION PREVIEW */}
          <section className="utility-panel allocation-panel">
            <div className="allocation-heading">
              <h2>
                <FileCheck size={16} />
                Allocation Preview
              </h2>

              <span>6 Members Active</span>
            </div>

            <div className="allocation-total">
              <div>
                <span>Average Individual Share</span>
                <strong>Rs {formatPKR(individualShare)}</strong>
              </div>

              <div className="total-pool">
                <span>TOTAL POOL</span>
                <strong>Rs {formatPKR(totalAmount)}</strong>
              </div>
            </div>

            <div className="allocation-list">
              {residents.map((resident, index) => (
                <div className="allocation-row" key={resident.id}>
                  <div className="allocation-resident">
                    <div className="allocation-avatar">
                      {resident.name.charAt(0)}
                    </div>

                    <div>
                      <strong>{resident.name}</strong>
                      <span>
                        {resident.room}
                        {splitMethod === "meter" &&
                          ` • ${resident.meterUnits} units`}
                      </span>
                    </div>
                  </div>

                  <strong className="allocation-amount">
                    Rs {formatPKR(allocations[index])}
                  </strong>
                </div>
              ))}
            </div>

            <div className="allocation-footer">
              <span>
                <CheckCircle2 size={14} />
                Allocation calculated
              </span>

              <button type="button" onClick={handleExport}>
                <ArrowDownToLine size={14} />
                Export CSV
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showAllocation && (
        <div
          className="utility-modal-overlay"
          onClick={() => setShowAllocation(false)}
        >
          <div
            className="utility-success-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="success-icon">
              <CheckCircle2 size={30} />
            </div>

            <h2>Bill Ready for Allocation</h2>

            <p>
              Your bill details have passed frontend validation.
              Review the allocation before final confirmation.
            </p>

            <div className="success-summary">
              <span>Utility Provider</span>
              <strong>{fields.company}</strong>

              <span>Bill Reference</span>
              <strong>{fields.reference}</strong>

              <span>Total Bill Amount</span>
              <strong>Rs {formatPKR(totalAmount)}</strong>

              <span>Active Residents</span>
              <strong>6 Members</strong>
            </div>

            <button
              type="button"
              onClick={() => setShowAllocation(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyUtilityBill;
