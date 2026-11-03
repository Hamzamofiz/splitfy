
import React, { useState, useEffect } from "react";
import {
  Building2,
  UserRound,
  Phone,
  Camera,
  Upload,
  RefreshCw,
  FileText,
  Printer,
  Download,
  Plus,
  X,
  Zap,
  Droplets,
  Wifi,
  Wrench,
  ShieldCheck,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

import "./invoice.css";

export default function RentInvoice() {
  const [meterImage, setMeterImage] = useState(null);

  const [property, setProperty] = useState("Sunset Heights — Apt 402");
  const [tenant, setTenant] = useState("Hamza Tariq");
  const [previousReading, setPreviousReading] = useState(4081);
  const [currentReading, setCurrentReading] = useState(4921);
  const [baseRent, setBaseRent] = useState(145000);
  const [waterCharge, setWaterCharge] = useState(7500);
  const [wifiCharge, setWifiCharge] = useState(4500);
  const [maintenance, setMaintenance] = useState(6500);
  const [electricityRate, setElectricityRate] = useState(38);
  const [customCharges, setCustomCharges] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const [invoiceDate, setInvoiceDate] = useState("Oct 29, 2024");
  const [dueDate, setDueDate] = useState("Nov 05, 2024");
  const [showCustomForm, setShowCustomForm] = useState(false);

  const netUnits = Math.max(0, Number(currentReading) - Number(previousReading));
  const electricityTotal = netUnits * Number(electricityRate);

  const totalAmount =
    Number(baseRent) +
    electricityTotal +
    Number(waterCharge) +
    Number(wifiCharge) +
    Number(maintenance) +
    customCharges.reduce((sum, charge) => sum + charge.amount, 0);

  const formatMoney = (amount) =>
    `Rs ${Number(amount).toLocaleString("en-PK")}`;

  // Upload meter picture and display preview
  const handleMeterUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Image size must be less than 15MB.");
      e.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setMeterImage((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return imageUrl;
    });

    e.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (meterImage) URL.revokeObjectURL(meterImage);
    };
  }, [meterImage]);

  const addCustomCharge = (e) => {
    e.preventDefault();

    if (!customName.trim() || !customAmount || Number(customAmount) <= 0) {
      return;
    }

    setCustomCharges((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: customName.trim(),
        amount: Number(customAmount),
      },
    ]);

    setCustomName("");
    setCustomAmount("");
    setShowCustomForm(false);
  };

  const removeCustomCharge = (id) => {
    setCustomCharges((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadInvoice = () => {
    window.print();
  };

  return (
    <div className="rent-invoice-page">

      {/* TOP HEADER */}

      <header className="rent-invoice-header">

        <div className="rent-header-icon">
          <ReceiptText size={21} />
        </div>

        <div className="rent-header-title">
          <h2>Rent & Utility Invoice Engine</h2>

          <div>
            <span className="rent-mode-badge">MODE 2 COPPER</span>
            <span className="rent-ocr-badge">OCR AUTO-SYNC ACTIVE</span>
          </div>

          <p>
            Synthesizing syndicated lease SH-402 with calibrated utility
            sub-meter telemetry for Pakistani rental properties.
          </p>
        </div>

        <div className="rent-header-actions">

          <button
            className="rent-history-btn"
            type="button"
            onClick={() => alert("Invoice history will be connected to your database.")}
          >
            <RefreshCw size={13} />
            History
          </button>

          <button
            className="rent-draft-btn"
            type="button"
            onClick={() => alert("Invoice draft saved for this session.")}
          >
            <ReceiptText size={13} />
            Quick Draft
          </button>

        </div>

      </header>

      {/* MAIN CONTENT */}

      <main className="rent-invoice-layout">

        {/* LEFT SIDE */}

        <section className="rent-left-column">

          {/* PROPERTY DETAILS */}

          <div className="rent-panel">

            <div className="rent-panel-heading">
              <h3>
                <Building2 size={16} />
                Premises & Tenancy Allocation
              </h3>

              <span className="rent-unit-tag">UNIT 402 / FLOOR 4</span>
            </div>

            <div className="rent-form-labels">
              <label>ASSIGNED PROPERTY & TENANT DOSSIER</label>
              <label>CONTRACTED BASE RENT</label>
            </div>

            <div className="rent-property-row">

              <div className="rent-select-wrapper">
                <Building2 size={13} />

                <select
                  value={property}
                  onChange={(e) => setProperty(e.target.value)}
                >
                  <option>Sunset Heights — Apt 402</option>
                  <option>Sunset Heights — Apt 301</option>
                  <option>Elite Residency — Apt 205</option>
                  <option>Gulberg Executive — Suite 101</option>
                </select>
              </div>

              <div className="rent-amount-input">
                <span>Rs</span>
                <input
                  type="number"
                  value={baseRent}
                  onChange={(e) => setBaseRent(Number(e.target.value))}
                />
              </div>

            </div>

            <div className="rent-tenant-card">

              <div>
                <UserRound size={13} />
                <strong>{tenant}</strong>
                <span>(Primary Guarantor)</span>
                <span className="rent-separator">•</span>
                <Phone size={11} />
                <span>+92 300 5550192</span>
              </div>

              <div className="rent-tenant-bottom">
                <span>Active 24M Lease</span>

                <button
                  type="button"
                  onClick={() => alert("Lease document will open here.")}
                >
                  View Lease Deed ↗
                </button>
              </div>

            </div>

          </div>

          {/* METER OCR SECTION */}

          <div className="rent-panel meter-panel">

            <div className="rent-panel-heading">
              <h3>
                <ReceiptText size={17} />
                Sub-Meter Visual Audit & Telemetry OCR
              </h3>

              <span className="rent-verified">
                <ShieldCheck size={12} />
                OCR VERIFIED: {netUnits} KWH
              </span>
            </div>

            <div className="meter-audit-box">

              <div className="meter-image-box">

                {meterImage ? (
                  <img
                    src={meterImage}
                    alt="Uploaded electricity sub-meter"
                    className="meter-preview-image"
                  />
                ) : (
                  <div className="meter-image-placeholder">
                    <Camera size={29} />
                    <strong>Meter Photo</strong>
                    <span>Upload physical meter image</span>
                  </div>
                )}

                {meterImage && (
                  <span className="meter-image-label">
                    <ShieldCheck size={11} />
                    Image Uploaded
                  </span>
                )}

              </div>

              <div className="meter-readings">

                <div className="meter-digital-heading">
                  <span>DIGITAL EXTRACTION</span>
                  <strong>Match 99.4%</strong>
                </div>

                <div className="meter-reading-grid">

                  <div className="meter-reading-card">
                    <span>Prev. Reading</span>
                    <strong>{Number(previousReading).toLocaleString()} kWh</strong>
                    <small>Sept 28, 2024</small>
                  </div>

                  <div className="meter-reading-card">
                    <span>Current Reading</span>
                    <strong>{Number(currentReading).toLocaleString()} kWh</strong>
                    <small>Oct 28, 2024</small>
                  </div>

                </div>

                <div className="meter-net-card">

                  <div>
                    <span>NET DELTA UNITS</span>
                    <strong>{netUnits.toLocaleString()} kWh</strong>
                  </div>

                  <div>
                    <span>SUB-TARIFF</span>
                    <strong>Rs {electricityRate} / unit</strong>
                  </div>

                </div>

                <div className="meter-upload-actions">

                  <label className="meter-upload-btn">
                    <Camera size={14} />
                    {meterImage ? "Replace Meter Photo" : "Upload Meter Photo"}

                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleMeterUpload}
                    />
                  </label>

                  {meterImage && (
                    <button
                      type="button"
                      className="meter-remove-btn"
                      onClick={() => setMeterImage(null)}
                    >
                      <X size={13} />
                      Remove
                    </button>
                  )}

                </div>

                <p className="meter-upload-hint">
                  JPG, PNG or WEBP • Maximum 15MB
                </p>

              </div>

            </div>

            <div className="meter-rescan-row">
              <RefreshCw size={13} />
              <span>
                {meterImage
                  ? "Image ready for OCR verification."
                  : "Upload a clear meter photo for visual verification."}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (!meterImage) {
                    alert("Please upload a meter photo first.");
                  } else {
                    alert("Photo uploaded. Connect an OCR service for automatic reading extraction.");
                  }
                }}
              >
                Rescan Physical Sub-Meter
              </button>
            </div>

            <p className="meter-ocr-disclaimer">
              Note: Reading values are entered manually. Automatic OCR
              extraction requires an OCR service integration.
            </p>

          </div>

          {/* UTILITY CHARGES */}

          <div className="rent-panel">

            <div className="rent-panel-heading">
              <h3>
                <FileText size={16} />
                Utility Line Items & Apportionment
              </h3>

              <button
                className="rent-custom-btn"
                type="button"
                onClick={() => setShowCustomForm(!showCustomForm)}
              >
                <Plus size={12} />
                Add Custom Charge
              </button>
            </div>

            <div className="rent-charge-list">

              <div className="rent-charge-item">

                <div className="rent-charge-icon electricity">
                  <Zap size={16} />
                </div>

                <div className="rent-charge-description">
                  <strong>Sub-Meter Electricity (Individual Apt)</strong>
                  <span>Telemetry verified: {netUnits} kWh consumed @ Rs {electricityRate}/unit</span>
                </div>

                <strong className="rent-charge-price">
                  {formatMoney(electricityTotal)}
                </strong>

                <button
                  type="button"
                  className="rent-remove-charge"
                  onClick={() => setElectricityRate(0)}
                  aria-label="Remove electricity charge"
                >
                  <X size={13} />
                </button>

              </div>

              <div className="rent-charge-item">

                <div className="rent-charge-icon water">
                  <Droplets size={16} />
                </div>

                <div className="rent-charge-description">
                  <strong>Water Tanker Shared Syndicate Quota</strong>
                  <span>Commercial bowser delivery allocation</span>
                </div>

                <input
                  type="number"
                  className="rent-charge-edit"
                  value={waterCharge}
                  onChange={(e) => setWaterCharge(Number(e.target.value))}
                />

              </div>

              <div className="rent-charge-item">

                <div className="rent-charge-icon wifi">
                  <Wifi size={16} />
                </div>

                <div className="rent-charge-description">
                  <strong>Dedicated Optical Fiber Wi-Fi</strong>
                  <span>100 Mbps Internet connection</span>
                </div>

                <input
                  type="number"
                  className="rent-charge-edit"
                  value={wifiCharge}
                  onChange={(e) => setWifiCharge(Number(e.target.value))}
                />

              </div>

              <div className="rent-charge-item">

                <div className="rent-charge-icon maintenance">
                  <Wrench size={16} />
                </div>

                <div className="rent-charge-description">
                  <strong>Maintenance Surcharge</strong>
                  <span>Elevator and common area maintenance</span>
                </div>

                <input
                  type="number"
                  className="rent-charge-edit"
                  value={maintenance}
                  onChange={(e) => setMaintenance(Number(e.target.value))}
                />

              </div>

              {customCharges.map((charge) => (
                <div className="rent-charge-item" key={charge.id}>

                  <div className="rent-charge-icon custom">
                    <Plus size={15} />
                  </div>

                  <div className="rent-charge-description">
                    <strong>{charge.name}</strong>
                    <span>Additional custom charge</span>
                  </div>

                  <strong className="rent-charge-price">
                    {formatMoney(charge.amount)}
                  </strong>

                  <button
                    type="button"
                    className="rent-remove-charge"
                    onClick={() => removeCustomCharge(charge.id)}
                    aria-label={`Remove ${charge.name}`}
                  >
                    <X size={13} />
                  </button>

                </div>
              ))}

            </div>

            {showCustomForm && (
              <form className="rent-custom-form" onSubmit={addCustomCharge}>

                <input
                  type="text"
                  placeholder="Charge description"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Amount (Rs)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  required
                />

                <button type="submit">
                  <Plus size={13} />
                  Add
                </button>

              </form>
            )}

            <div className="rent-total-strip">
              <span>Calculated Invoice Total</span>
              <strong>{formatMoney(totalAmount)}</strong>
            </div>

          </div>

          {/* BILLING DETAILS */}

          <div className="rent-panel">

            <div className="rent-panel-heading">
              <h3>
                <CalendarDays size={16} />
                Billing Cycle & Payment Details
              </h3>
            </div>

            <div className="rent-billing-grid">

              <label>
                INVOICE DATE
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </label>

              <label>
                PAYMENT DUE DATE
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>

              <label>
                PREVIOUS METER READING
                <input
                  type="number"
                  value={previousReading}
                  onChange={(e) => setPreviousReading(Number(e.target.value))}
                />
              </label>

              <label>
                CURRENT METER READING
                <input
                  type="number"
                  value={currentReading}
                  onChange={(e) => setCurrentReading(Number(e.target.value))}
                />
              </label>

              <label>
                ELECTRICITY RATE / UNIT
                <input
                  type="number"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(Number(e.target.value))}
                />
              </label>

            </div>

          </div>

        </section>

        {/* RIGHT SIDE - INVOICE PREVIEW */}

        <aside className="rent-right-column">

          <div className="rent-preview-heading">
            <div>
              <span className="rent-preview-dot"></span>
              DOCUMENT OUTPUT CANVAS
            </div>

            <div className="rent-preview-actions">
              <span>A4 Paper 300 DPI</span>

              <button type="button" onClick={handlePrint} title="Print invoice">
                <Printer size={14} />
              </button>

              <button type="button" onClick={downloadInvoice} title="Print or save as PDF">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="rent-invoice-paper">

            <div className="rent-invoice-top-line"></div>

            {/* INVOICE BRAND */}

            <div className="rent-paper-header">

              <div className="rent-paper-brand">
                <div className="rent-paper-logo">
                  <Building2 size={19} />
                </div>

                <div>
                  <h2>Splitfy</h2>
                  <span>INSTITUTIONAL PROPERTY MANAGEMENT</span>
                </div>
              </div>

              <div className="rent-invoice-number">
                <span>OFFICIAL BILL</span>
                <h3>INV-2024-NOV-402</h3>
                <p>Issue: {invoiceDate}</p>
                <strong>Due: {dueDate}</strong>
              </div>

            </div>

            <div className="rent-paper-divider"></div>

            {/* BILL DETAILS */}

            <div className="rent-paper-details">

              <div>
                <span>BILL TO (TENANT):</span>
                <strong>{tenant} & Co-Tenants</strong>
                <p>Apartment 402, 4th Floor</p>
                <p>{property}</p>
                <p>Contact: +92 300 5550192</p>
              </div>

              <div>
                <span>LEASE REFERENCE:</span>
                <strong>SH-APT-402-2024</strong>
                <p>Cycle: Nov 01 – Nov 30, 2024</p>
                <p>Status: <b className="rent-pending-text">Unpaid / Pending</b></p>
              </div>

            </div>

            {/* INVOICE TABLE */}

            <div className="rent-paper-table">

              <div className="rent-paper-table-heading">
                <span>DESCRIPTION / PROVISION</span>
                <span>USAGE / RATE</span>
                <span>AMOUNT (PKR)</span>
              </div>

              <div className="rent-paper-table-row">
                <div>
                  <strong>Base Apartment Lease Rental</strong>
                  <small>Monthly fixed apartment occupancy</small>
                </div>

                <span>Fixed Month</span>
                <strong>{formatMoney(baseRent)}</strong>
              </div>

              <div className="rent-paper-table-row">
                <div>
                  <strong>Sub-Meter Electricity</strong>
                  <small>Reading #{netUnits} kWh</small>
                </div>

                <span>{netUnits} @ Rs {electricityRate}</span>
                <strong>{formatMoney(electricityTotal)}</strong>
              </div>

              <div className="rent-paper-table-row">
                <div>
                  <strong>Water Tanker Shared Allocation</strong>
                  <small>Commercial bowser delivery quota</small>
                </div>

                <span>1 / 6th Pool</span>
                <strong>{formatMoney(waterCharge)}</strong>
              </div>

              <div className="rent-paper-table-row">
                <div>
                  <strong>Dedicated Optical Fiber Wi-Fi</strong>
                  <small>100 Mbps Internet</small>
                </div>

                <span>1 Line</span>
                <strong>{formatMoney(wifiCharge)}</strong>
              </div>

              <div className="rent-paper-table-row">
                <div>
                  <strong>Maintenance Surcharge</strong>
                  <small>Elevator & common area maintenance</small>
                </div>

                <span>Fixed</span>
                <strong>{formatMoney(maintenance)}</strong>
              </div>

              {customCharges.map((charge) => (
                <div className="rent-paper-table-row" key={charge.id}>
                  <div>
                    <strong>{charge.name}</strong>
                    <small>Additional provision</small>
                  </div>

                  <span>Custom</span>
                  <strong>{formatMoney(charge.amount)}</strong>
                </div>
              ))}

            </div>

            {/* TOTAL */}

            <div className="rent-paper-total">

              <div>
                <span>Sub Total</span>
                <strong>{formatMoney(totalAmount)}</strong>
              </div>

              <div>
                <span>Additional Tax</span>
                <strong>Rs 0</strong>
              </div>

              <div className="rent-grand-total">
                <span>TOTAL PAYABLE</span>
                <strong>{formatMoney(totalAmount)}</strong>
              </div>

            </div>

            {/* METER IMAGE ON INVOICE */}

            <div className="rent-paper-meter-proof">

              <div className="rent-paper-proof-heading">
                <ShieldCheck size={14} />
                SUB-METER VISUAL VERIFICATION
              </div>

              {meterImage ? (
                <img
                  src={meterImage}
                  alt="Physical electricity meter proof"
                />
              ) : (
                <div className="rent-paper-no-image">
                  <Camera size={19} />
                  <span>Meter photo will appear here after upload.</span>
                </div>
              )}

              <div className="rent-paper-reading-info">
                <span>Previous: {previousReading} kWh</span>
                <span>Current: {currentReading} kWh</span>
                <strong>Units: {netUnits} kWh</strong>
              </div>

            </div>

            {/* FOOTER */}

            <div className="rent-paper-footer">
              <strong>Thank you for choosing Splitfy!</strong>
              <span>Digitally generated rental invoice • Room 402</span>
              <span>For billing queries, contact your property administrator.</span>
            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}
