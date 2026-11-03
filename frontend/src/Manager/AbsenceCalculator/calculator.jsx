
import React, { useState } from "react";

import {
  CalendarDays,
  Clock,
  Building2,
  ShieldCheck,
  SlidersHorizontal,
  Scale,
  Zap,
  Utensils,
  Wifi,
  Droplets,
  Wallet,
  CheckCircle2,
  Info,
  Plane,
  Home,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  CalendarCheck,
  TrendingDown
} from "lucide-react";

import "./calculator.css";

const presets = [
  { label: "Full Month", days: 0, icon: Home },
  { label: "Weekend Trip", days: 3, icon: Plane },
  { label: "Midterm Break", days: 7, icon: GraduationCap },
  { label: "Semester Holiday", days: 15, icon: CalendarDays }
];

const categories = [
  {
    name: "Electricity Bill",
    icon: Zap,
    normal: 80,
    adjusted: true,
    color: "teal"
  },
  {
    name: "Mess Food & Groceries",
    icon: Utensils,
    normal: 110,
    adjusted: true,
    color: "orange"
  },
  {
    name: "Fiber Internet",
    icon: Wifi,
    normal: 10.83,
    adjusted: false,
    color: "blue"
  },
  {
    name: "Water & Maintenance",
    icon: Droplets,
    normal: 45,
    adjusted: false,
    color: "purple"
  }
];

const formatMoney = (value) =>
  `Rs ${value.toFixed(2)}`;

const getDays = (start, end) => {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) {
    return 0;
  }

  return Math.min(
    30,
    Math.max(0, Math.round((endDate - startDate) / 86400000))
  );
};

export default function AbsenceCalculator() {
  const [daysAway, setDaysAway] = useState(7);

  const [startDate, setStartDate] = useState("2024-10-12");
  const [returnDate, setReturnDate] = useState("2024-10-19");

  const [reason, setReason] = useState(
    "Family Wedding / Home Visit"
  );

  const [notes, setNotes] = useState(
    "Traveled to home; room locked and AC unused during these dates. Key left with floor supervisor."
  );

  const [submitted, setSubmitted] = useState(false);

  const billingDays = 31;
  const standardDue = 245.83;

  const savings = daysAway * (38.45 / 7);
  const adjustedTotal = standardDue - savings;

  const occupancy = (
    ((billingDays - daysAway) / billingDays) * 100
  ).toFixed(1);

  const handleSlider = (value) => {
    setDaysAway(Number(value));
    setReturnDate(() => {
      const date = new Date(`${startDate}T00:00:00`);
      date.setDate(date.getDate() + Number(value));

      return `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    });
  };

  const handleStartDate = (value) => {
    setStartDate(value);

    const date = new Date(`${value}T00:00:00`);
    date.setDate(date.getDate() + daysAway);

    setReturnDate(
      `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    );
  };

  const handleReturnDate = (value) => {
    setReturnDate(value);
    setDaysAway(getDays(startDate, value));
  };

  const handlePreset = (days) => {
    handleSlider(days);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getAdjustedAmount = (item) => {
    if (!item.adjusted) return item.normal;

    const ratio = daysAway / 7;

    if (item.name === "Electricity Bill") {
      return Math.max(0, item.normal - 13.65 * ratio);
    }

    if (item.name === "Mess Food & Groceries") {
      return Math.max(0, item.normal - 24.8 * ratio);
    }

    return item.normal;
  };

  return (
    <div className="absence-page">

      {/* HEADER */}

      <header className="absence-header">

        <div className="absence-header-left">

          <span className="absence-eyebrow">
            <span></span>
            ROOM 402 • RESIDENT ABSENCE & PRORATION
          </span>

          <h1>Dynamic Absence & Prorated Bill Calculator</h1>

          <p>
            Simulate and calculate fair expense reductions for days away
            from the hostel, including semester breaks, vacations and
            internship trips.
          </p>

        </div>

        <div className="absence-header-badge">
          <ShieldCheck size={17} />

          <div>
            <strong>Room 402 Ledger</strong>
            <span>Active Proration Formula</span>
          </div>
        </div>

      </header>

      {/* SUMMARY CARDS */}

      <section className="absence-stats">

        <div className="absence-stat-card">

          <div className="absence-stat-top">
            <span>BILLING CYCLE</span>
            <CalendarDays size={15} />
          </div>

          <h2>31 Days</h2>
          <p>Oct 01 – Oct 31, 2024</p>

          <div className="stat-progress">
            <span style={{ width: "100%" }}></span>
          </div>

        </div>

        <div className="absence-stat-card">

          <div className="absence-stat-top">
            <span>LOGGED ABSENCE</span>
            <span className="stat-pill yellow">Active State</span>
          </div>

          <h2 className="orange-text">{daysAway} Days Away</h2>
          <p>
            {new Date(`${startDate}T00:00:00`).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric" }
            )} – {new Date(`${returnDate}T00:00:00`).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric" }
            )}
          </p>

          <div className="stat-progress orange-progress">
            <span
              style={{
                width: `${(daysAway / billingDays) * 100}%`
              }}
            ></span>
          </div>

        </div>

        <div className="absence-stat-card">

          <div className="absence-stat-top">
            <span>EFFECTIVE OCCUPANCY</span>
            <Building2 size={15} />
          </div>

          <h2 className="teal-text">{occupancy}%</h2>
          <p>{billingDays - daysAway} / {billingDays} Active Days</p>

          <div className="stat-progress">
            <span style={{ width: `${occupancy}%` }}></span>
          </div>

        </div>

        <div className="absence-stat-card savings-card">

          <div className="absence-stat-top">
            <span>LEDGER SAVINGS</span>
            <span className="stat-pill green">
              <CheckCircle2 size={10} /> SAVED
            </span>
          </div>

          <h2 className="teal-text">
            -{formatMoney(savings)}
          </h2>

          <p>Automated deduction on Oct Bill</p>
          <small>Net Impact: -{((savings / standardDue) * 100).toFixed(1)}%</small>

        </div>

      </section>

      {/* MAIN CONTENT */}

      <form className="absence-layout" onSubmit={handleSubmit}>

        <div className="absence-left">

          {/* SLIDER */}

          <section className="absence-panel slider-panel">

            <div className="absence-panel-heading">

              <div className="absence-heading-title">
                <SlidersHorizontal size={16} />
                <h2>Absence Duration Slider</h2>
              </div>

              <span className="simulation-badge">
                Simulating: <strong>{daysAway} Days Away</strong>
              </span>

            </div>

            <div className="slider-container">

              <input
                type="range"
                min="0"
                max="30"
                value={daysAway}
                onChange={(e) => handleSlider(e.target.value)}
                className="absence-range"
                style={{
                  "--range-progress": `${(daysAway / 30) * 100}%`
                }}
              />

              <div className="slider-labels">
                <span>0 Days (Full Month)</span>
                <span>7d</span>
                <span>15d</span>
                <span>22d</span>
                <span>30 Days (Complete Leave)</span>
              </div>

            </div>

            <div className="presets-section">

              <span className="presets-label">QUICK PRESET DURATIONS</span>

              <div className="preset-buttons">

                {presets.map(({ label, days, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className={`preset-btn ${
                      daysAway === days ? "preset-active" : ""
                    }`}
                    onClick={() => handlePreset(days)}
                  >
                    <Icon size={13} />
                    {label} ({days}d)
                  </button>
                ))}

              </div>

            </div>

          </section>

          {/* DATE SELECTOR */}

          <section className="absence-panel date-panel">

            <div className="absence-heading-title date-title">
              <CalendarDays size={17} />
              <h2>Absence Date Range Selector</h2>
            </div>

            <div className="date-fields">

              <div className="date-group">
                <label>LEAVE START DATE</label>

                <div className="date-input-wrap">
                  <CalendarDays size={15} />

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="date-group">
                <label>RETURN DATE</label>

                <div className="date-input-wrap">
                  <CalendarDays size={15} />

                  <input
                    type="date"
                    min={startDate}
                    value={returnDate}
                    onChange={(e) => handleReturnDate(e.target.value)}
                    required
                  />
                </div>
              </div>

            </div>

            <div className="absence-days-info">
              <Clock size={14} />
              <span>{daysAway} days of absence selected</span>
              <CheckCircle2 size={14} />
              <span>Date range updated automatically</span>
            </div>

            <div className="reason-group">

              <label>PRIMARY ABSENCE REASON</label>

              <div className="reason-input">
                <Home size={15} />

                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option>Family Wedding / Home Visit</option>
                  <option>Semester Break</option>
                  <option>Medical Leave</option>
                  <option>Internship / Work Trip</option>
                  <option>Personal Vacation</option>
                  <option>Other</option>
                </select>

                <ChevronDown size={14} />
              </div>

            </div>

            <div className="notes-group">

              <label>RESIDENT DECLARATION & NOTES</label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain your absence and any relevant details..."
                rows="3"
              />

            </div>

            <div className="declaration-info">
              <Info size={15} />
              <span>
                Your absence details will be sent to the room administrator
                for verification.
              </span>
            </div>

          </section>

          {/* SUBMIT */}

          <button type="submit" className="absence-submit">
            <ShieldCheck size={17} />
            Submit Absence Request
            <ArrowRight size={16} />
          </button>

          {submitted && (
            <div className="absence-success">
              <CheckCircle2 size={17} />
              Your absence request has been prepared for admin approval.
            </div>
          )}

        </div>

        {/* RIGHT SIDE */}

        <aside className="absence-right">

          {/* COMPARISON */}

          <section className="absence-panel comparison-panel">

            <div className="absence-panel-heading">

              <div className="absence-heading-title">
                <Scale size={17} />
                <h2>Before vs After Comparison</h2>
              </div>

              <span className="month-badge">Oct 2024</span>

            </div>

            <div className="comparison-table">

              <div className="comparison-header">
                <span>EXPENSE CATEGORY</span>
                <span>NORMAL</span>
                <span>ADJUSTED</span>
                <span>DELTA</span>
              </div>

              {categories.map((item) => {
                const adjusted = getAdjustedAmount(item);
                const delta = item.normal - adjusted;
                const Icon = item.icon;

                return (
                  <div className="comparison-row" key={item.name}>

                    <div className="comparison-category">
                      <span className={`category-dot ${item.color}`}></span>
                      <span>{item.name}</span>
                    </div>

                    <strong>{formatMoney(item.normal)}</strong>

                    <strong>{formatMoney(adjusted)}</strong>

                    <span className={delta > 0 ? "delta-positive" : "delta-zero"}>
                      {delta > 0 ? `-${formatMoney(delta)}` : "Rs 0.00"}
                    </span>

                  </div>
                );
              })}

            </div>

            {/* TOTAL SUMMARY */}

            <div className="comparison-summary">

              <div>
                <span>Standard Base Dues (31 Days):</span>
                <strong>{formatMoney(standardDue)}</strong>
              </div>

              <div>
                <span>
                  <CheckCircle2 size={12} />
                  Proration Credit Applied:
                </span>
                <strong className="credit-amount">
                  -{formatMoney(savings)}
                </strong>
              </div>

              <div className="adjusted-total">

                <div>
                  <span>Adjusted October Total</span>
                  <small>Net Payable for Hamza Tariq</small>
                </div>

                <div>
                  <strong>{formatMoney(adjustedTotal)}</strong>
                  <small>Net Savings: {formatMoney(savings)}</small>
                </div>

              </div>

            </div>

            {/* PAYMENT BAR */}

            <div className="payment-breakdown">

              <div className="payment-labels">
                <span>Payable ({formatMoney(adjustedTotal)})</span>
                <span>Deduction ({formatMoney(savings)})</span>
              </div>

              <div className="payment-bar">
                <span
                  style={{
                    width: `${(adjustedTotal / standardDue) * 100}%`
                  }}
                ></span>
              </div>

            </div>

          </section>

          {/* PRORATION INFORMATION */}

          <section className="absence-panel proration-panel">

            <div className="absence-heading-title">
              <Wallet size={17} />
              <h2>Proration Breakdown</h2>
            </div>

            <div className="proration-item">
              <span>Daily savings estimate</span>
              <strong>Rs {(38.45 / 7).toFixed(2)}</strong>
            </div>

            <div className="proration-item">
              <span>Absence duration</span>
              <strong>{daysAway} Days</strong>
            </div>

            <div className="proration-item">
              <span>Billing period</span>
              <strong>{billingDays} Days</strong>
            </div>

            <div className="proration-item">
              <span>Estimated savings</span>
              <strong className="teal-text">
                {formatMoney(savings)}
              </strong>
            </div>

            <div className="proration-note">
              <Info size={14} />
              <span>
                Final deductions are subject to administrator verification
                and hostel billing rules.
              </span>
            </div>

          </section>

        </aside>

      </form>

    </div>
  );
}
