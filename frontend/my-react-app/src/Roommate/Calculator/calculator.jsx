
import React, { useState, useMemo } from "react";
import {
  CalendarDays, ShieldCheck, Zap, Wallet, Scale,
  SlidersHorizontal, Building2, Clock, CheckCircle,
  Home, Plane, GraduationCap, ChevronDown, Info
} from "lucide-react";
import "./calculator.css";

const expenseData = [
  { name: "Electricity Bill", amount: 80, adjustable: 0.75 },
  { name: "Mess Food & Groceries", amount: 110, adjustable: 1 },
  { name: "Fiber Internet", amount: 10.83, adjustable: 0 },
  { name: "Water & Maintenance", amount: 45, adjustable: 0 }
];

const presets = [
  { label: "Full Month (0d)", days: 0, icon: Building2 },
  { label: "Weekend Trip (3d)", days: 3, icon: Home },
  { label: "Midterm Break (7d)", days: 7, icon: GraduationCap },
  { label: "Semester Holiday (15d)", days: 15, icon: Plane }
];

const formatPKR = value =>
  "Rs " + value.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function DynamicAbsence() {
  const [daysAway, setDaysAway] = useState(7);

  const [startDate, setStartDate] = useState("2024-10-12");
  const [endDate, setEndDate] = useState("2024-10-19");

  const [reason, setReason] = useState("Family Wedding / Home Visit");
  const [notes, setNotes] = useState(
    "Traveled to home; room locked and AC unused during these dates. Key left with floor supervisor."
  );

  const [billingDays] = useState(31);
  const [showNotice, setShowNotice] = useState(false);

  const calculation = useMemo(() => {
    const away = Math.min(Math.max(daysAway, 0), billingDays);
    const activeDays = billingDays - away;
    const occupancy = (activeDays / billingDays) * 100;

    const categories = expenseData.map(item => {
      const normal = item.amount;
      const deduction =
        normal * item.adjustable * (away / billingDays);

      return {
        ...item,
        normal,
        deduction,
        adjusted: normal - deduction
      };
    });

    const standardTotal = categories.reduce(
      (sum, item) => sum + item.normal, 0
    );

    const totalDeduction = categories.reduce(
      (sum, item) => sum + item.deduction, 0
    );

    const adjustedTotal = standardTotal - totalDeduction;

    return {
      away,
      activeDays,
      occupancy,
      categories,
      standardTotal,
      totalDeduction,
      adjustedTotal,
      savingPercentage: standardTotal
        ? (totalDeduction / standardTotal) * 100
        : 0
    };
  }, [daysAway, billingDays]);

  const handlePreset = (days) => {
    setDaysAway(days);
    setShowNotice(false);
  };

  const handleStartDate = (value) => {
    setStartDate(value);

    if (value && endDate) {
      const difference = Math.round(
        (new Date(endDate) - new Date(value)) / 86400000
      );

      setDaysAway(Math.min(31, Math.max(0, difference)));
    }
  };

  const handleEndDate = (value) => {
    setEndDate(value);

    if (value && startDate) {
      const difference = Math.round(
        (new Date(value) - new Date(startDate)) / 86400000
      );

      setDaysAway(Math.min(31, Math.max(0, difference)));
    }
  };

  const percentage = calculation.away / billingDays * 100;

  return (
    <main className="absence-page">

      {/* HEADER */}

      <header className="absence-header">
        <div>
          <span className="absence-breadcrumb">
            <span />
            ROOM 402 • RESIDENT ABSENCE & PRORATION
          </span>

          <h1>Dynamic Absence & Prorated Bill Calculator</h1>

          <p>
            Simulate and calculate your fair expense reductions for
            days away from the hostel (semester breaks, vacations,
            internship trips).
          </p>
        </div>

        <div className="absence-ledger-status">
          <ShieldCheck size={15} />
          <span>Room 402 Ledger • Active Proration</span>
        </div>
      </header>

      {/* SUMMARY CARDS */}

      <section className="absence-stats">

        <div className="absence-stat-card">
          <div className="absence-stat-top">
            <span>BILLING CYCLE</span>
            <CalendarDays size={14} />
          </div>
          <strong>{billingDays} Days</strong>
          <small>Oct 01 – Oct 31, 2024</small>
          <div className="absence-stat-progress">
            <span style={{ width: "100%" }} />
          </div>
        </div>

        <div className="absence-stat-card">
          <div className="absence-stat-top">
            <span>LOGGED ABSENCE</span>
            <span className="absence-orange-badge">Active State</span>
          </div>
          <strong className="absence-orange">
            {calculation.away} Days Away
          </strong>
          <small>
            {startDate ? new Date(startDate + "T12:00:00").toLocaleDateString("en-GB", {
              day: "2-digit", month: "short"
            }) : "--"} – {endDate ? new Date(endDate + "T12:00:00").toLocaleDateString("en-GB", {
              day: "2-digit", month: "short", year: "numeric"
            }) : "--"}
          </small>
          <div className="absence-stat-progress orange-progress">
            <span style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="absence-stat-card">
          <div className="absence-stat-top">
            <span>EFFECTIVE OCCUPANCY</span>
            <Building2 size={14} />
          </div>
          <strong className="absence-green">
            {calculation.occupancy.toFixed(1)}%
          </strong>
          <small>
            {calculation.activeDays} / {billingDays} Active Days
          </small>
          <div className="absence-stat-progress">
            <span style={{ width: `${calculation.occupancy}%` }} />
          </div>
        </div>

        <div className="absence-stat-card savings-stat">
          <div className="absence-stat-top">
            <span>LEDGER SAVINGS</span>
            <span className="absence-saved-badge">
              <CheckCircle size={10} /> SAVED
            </span>
          </div>
          <strong className="absence-green">
            -{formatPKR(calculation.totalDeduction)}
          </strong>
          <small>Automated deduction on Oct Bill</small>
          <div className="absence-saving-bottom">
            <span>
              Net Impact: -{calculation.savingPercentage.toFixed(1)}%
            </span>
            <Wallet size={12} />
          </div>
        </div>

      </section>

      {/* MAIN CONTENT */}

      <div className="absence-main-grid">

        <section className="absence-left">

          {/* SLIDER */}

          <div className="absence-panel">
            <div className="absence-panel-heading">
              <h2>
                <SlidersHorizontal size={15} />
                Absence Duration Slider
              </h2>
              <span className="absence-simulation">
                Simulating: <strong>{calculation.away} Days Away</strong>
              </span>
            </div>

            <div className="absence-slider-wrap">
              <input
                type="range"
                min="0"
                max="30"
                value={daysAway}
                onChange={e => handlePreset(Number(e.target.value))}
                style={{
                  "--slider-progress": `${daysAway / 30 * 100}%`
                }}
              />

              <div className="absence-slider-labels">
                <span>0 Days (Full Month)</span>
                <span>7d</span>
                <span>15d</span>
                <span>22d</span>
                <span>30 Days (Complete Leave)</span>
              </div>
            </div>

            <div className="absence-quick-label">
              QUICK PRESET DURATIONS:
            </div>

            <div className="absence-presets">
              {presets.map((preset, index) => {
                const Icon = preset.icon;

                return (
                  <button
                    type="button"
                    key={preset.label}
                    className={
                      daysAway === preset.days
                        ? "absence-preset active"
                        : "absence-preset"
                    }
                    onClick={() => handlePreset(preset.days)}
                  >
                    <Icon size={12} />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DATE SELECTOR */}

          <div className="absence-panel absence-date-panel">
            <div className="absence-panel-heading">
              <h2>
                <CalendarDays size={15} />
                Absence Date Range Selector
              </h2>

              <span className="absence-room-badge">
                Room 402 - Bed B
              </span>
            </div>

            <div className="absence-date-grid">
              <div className="absence-field">
                <label>LEAVE START DATE</label>
                <div className="absence-input">
                  <CalendarDays size={13} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => handleStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="absence-field">
                <label>RETURN DATE</label>
                <div className="absence-input">
                  <CalendarDays size={13} />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={e => handleEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="absence-field full-field">
              <label>PRIMARY ABSENCE REASON</label>
              <div className="absence-input">
                <Building2 size={14} />
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                >
                  <option>Family Wedding / Home Visit</option>
                  <option>Semester Break</option>
                  <option>Medical Leave</option>
                  <option>Internship / Work Trip</option>
                  <option>Personal Vacation</option>
                  <option>Other</option>
                </select>
                <ChevronDown size={13} />
              </div>
            </div>

            <div className="absence-field full-field">
              <label>RESIDENT DECLARATION & NOTES</label>
              <textarea
                rows="3"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Enter your absence details..."
              />
            </div>

            <button
              type="button"
              className="absence-apply-button"
              onClick={() => setShowNotice(true)}
            >
              <CheckCircle size={14} />
              Apply Proration Calculation
              <Zap size={13} />
            </button>

            {showNotice && (
              <div className="absence-success">
                <CheckCircle size={14} />
                Proration preview updated successfully.
              </div>
            )}
          </div>

          {/* CALCULATION INFORMATION */}

          <div className="absence-info-panel">
            <Info size={16} />
            <div>
              <strong>Fair Proration Policy</strong>
              <p>
                Variable expenses are adjusted according to verified
                absence days. Fixed expenses remain unchanged.
                All amounts are calculated in Pakistani Rupees (PKR).
              </p>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN */}

        <aside className="absence-right">

          <div className="absence-panel comparison-panel">

            <div className="absence-panel-heading">
              <h2>
                <Scale size={16} />
                Before vs After Comparison
              </h2>

              <span className="absence-month-badge">
                Oct 2024
              </span>
            </div>

            <div className="absence-table-head">
              <span>EXPENSE CATEGORY</span>
              <span>NORMAL</span>
              <span>ADJUSTED</span>
              <span>DELTA</span>
            </div>

            <div className="absence-expense-list">
              {calculation.categories.map((item, index) => (
                <div className="absence-expense-row" key={item.name}>
                  <div className="absence-expense-name">
                    <span className={`absence-dot dot-${index}`} />
                    {item.name}
                  </div>

                  <span>{formatPKR(item.normal)}</span>

                  <strong>{formatPKR(item.adjusted)}</strong>

                  <span className={
                    item.deduction > 0
                      ? "absence-delta"
                      : "absence-no-delta"
                  }>
                    {item.deduction > 0
                      ? `-${formatPKR(item.deduction)}`
                      : "Rs 0.00"}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTALS */}

            <div className="absence-total-box">
              <div>
                <span>Standard Base Dues ({billingDays} Days):</span>
                <strong>{formatPKR(calculation.standardTotal)}</strong>
              </div>

              <div className="absence-credit-row">
                <span>
                  <CheckCircle size={11} />
                  Proration Credit Applied:
                </span>
                <strong>
                  -{formatPKR(calculation.totalDeduction)}
                </strong>
              </div>

              <div className="absence-adjusted-total">
                <div>
                  <strong>Adjusted October Total</strong>
                  <small>Net Payable for Hamza Tariq</small>
                </div>

                <div>
                  <strong>
                    {formatPKR(calculation.adjustedTotal)}
                  </strong>
                  <small>
                    Net Savings: {formatPKR(calculation.totalDeduction)}
                    <br />
                    ({calculation.savingPercentage.toFixed(1)}%)
                  </small>
                </div>
              </div>
            </div>

            {/* PAYMENT BAR */}

            <div className="absence-payment-bar">
              <div>
                <span>
                  Payable ({formatPKR(calculation.adjustedTotal)})
                </span>
                <span>
                  Deduction ({formatPKR(calculation.totalDeduction)})
                </span>
              </div>

              <div className="absence-payment-progress">
                <span
                  style={{
                    width: `${100 - calculation.savingPercentage}%`
                  }}
                />
                <span
                  style={{
                    width: `${calculation.savingPercentage}%`
                  }}
                />
              </div>
            </div>

          </div>

          {/* BREAKDOWN */}

          <div className="absence-panel breakdown-panel">
            <div className="absence-panel-heading">
              <h2>
                <Wallet size={15} />
                Proration Summary
              </h2>
              <span className="absence-saved-badge">PKR</span>
            </div>

            <div className="absence-breakdown-row">
              <span>Billing period</span>
              <strong>{billingDays} Days</strong>
            </div>

            <div className="absence-breakdown-row">
              <span>Days away</span>
              <strong className="absence-orange">
                {calculation.away} Days
              </strong>
            </div>

            <div className="absence-breakdown-row">
              <span>Active occupancy</span>
              <strong>{calculation.activeDays} Days</strong>
            </div>

            <div className="absence-breakdown-row">
              <span>Total original bill</span>
              <strong>{formatPKR(calculation.standardTotal)}</strong>
            </div>

            <div className="absence-breakdown-row highlight-row">
              <span>Total savings</span>
              <strong>-{formatPKR(calculation.totalDeduction)}</strong>
            </div>

            <div className="absence-breakdown-result">
              <span>FINAL PAYABLE AMOUNT</span>
              <strong>{formatPKR(calculation.adjustedTotal)}</strong>
            </div>
          </div>

        </aside>
      </div>

    </main>
  );
}

export default DynamicAbsence;
