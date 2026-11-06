
import React, { useMemo, useState } from "react";
import {
  Users,
  CalendarDays,
  BadgeCheck,
  RotateCcw,
  Wallet,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  ChevronDown,
  Download,
  Info,
  Clock3,
  UserRound,
} from "lucide-react";

import "./members.css";

const initialResidents = [
  {
    id: 1,
    name: "Ali Khan",
    role: "Host",
    email: "ali.khan@splitify.int...",
    phone: "+92 300 4819201",
    relation: "Father",
    room: "Bed A",
    days: 30,
    note: "Present all month • Suite protection",
    color: "teal",
  },
  {
    id: 2,
    name: "Hamza Tariq",
    role: "Resident",
    email: "hamza.tariq@splitify.int...",
    phone: "+92 321 9902145",
    relation: "Brother",
    room: "Bed B",
    days: 28,
    note: "Weekend hackathon away in Islamabad",
    color: "blue",
  },
  {
    id: 3,
    name: "Daniyal Ahmed",
    role: "Vacation",
    email: "daniyal.a@splitify.int...",
    phone: "+92 333 7104928",
    relation: "Guest Member",
    room: "Bed C",
    days: 15,
    note: "Semester Break / Visited Home",
    color: "orange",
  },
  {
    id: 4,
    name: "Zain Malik",
    role: "Resident",
    email: "zain.malik@splitify.int...",
    phone: "+92 345 8891024",
    relation: "Guardian",
    room: "Bed D",
    days: 30,
    note: "Full residency • Lab duties",
    color: "blue",
  },
  {
    id: 5,
    name: "Usman Ali",
    role: "Resident",
    email: "usman.ali@splitify.int...",
    phone: "+92 312 5567812",
    relation: "Brother",
    room: "Bed E",
    days: 27,
    note: "Three days outside the city",
    color: "purple",
  },
  {
    id: 6,
    name: "Ryan Cooper",
    role: "Resident",
    email: "ryan.cooper@splitify.int...",
    phone: "+92 301 6678123",
    relation: "Roommate",
    room: "Bed F",
    days: 28,
    note: "Weekend family visit",
    color: "green",
  },
];

const TOTAL_CYCLE_DAYS = 30;

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const MemberManagement = () => {
  const [residents, setResidents] = useState(initialResidents);
  const [poolAmount, setPoolAmount] = useState("480.00");
  const [billingMonth, setBillingMonth] = useState("October 2024");
  const [showDetails, setShowDetails] = useState(null);

  // Total billed resident days
  const billedDays = useMemo(
    () => residents.reduce((sum, resident) => sum + resident.days, 0),
    [residents]
  );

  // Total possible resident days
  const maximumDays = residents.length * TOTAL_CYCLE_DAYS;

  // Occupancy percentage
  const occupancy = maximumDays
    ? (billedDays / maximumDays) * 100
    : 0;

  // Shared variable pool
  const totalPool = Math.max(0, Number(poolAmount) || 0);

  // Cost per resident day
  const dailyRate = maximumDays > 0
    ? totalPool / maximumDays
    : 0;

  // Update attendance
  const handleDaysChange = (id, value) => {
    setResidents((previous) =>
      previous.map((resident) =>
        resident.id === id
          ? { ...resident, days: Number(value) }
          : resident
      )
    );
  };

  // Update absence notes
  const handleNoteChange = (id, value) => {
    setResidents((previous) =>
      previous.map((resident) =>
        resident.id === id
          ? { ...resident, note: value }
          : resident
      )
    );
  };

  // Reset attendance
  const handleReset = () => {
    setResidents(initialResidents);
    setPoolAmount("480.00");
  };

  // Calculate individual fair share
  const getFairShare = (days) => days * dailyRate;

  // Calculate prorated factor
  const getProratedFactor = (days) =>
    days / TOTAL_CYCLE_DAYS;

  // Calculate total allocated amount
  const totalAllocated = residents.reduce(
    (sum, resident) => sum + getFairShare(resident.days),
    0
  );

  // Remaining amount due to absences
  const occupancySavings = Math.max(0, totalPool - totalAllocated);

  // Export CSV
  const handleExport = () => {
    const rows = [
      [
        "Resident",
        "Room",
        "Active Days",
        "Absence Notes",
        "Prorated Factor",
        "Fair Bill Share (PKR)",
      ],
      ...residents.map((resident) => [
        resident.name,
        resident.room,
        resident.days,
        resident.note,
        getProratedFactor(resident.days).toFixed(2),
        getFairShare(resident.days).toFixed(2),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "splitify-member-attendance.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="member-page">

      {/* HEADER */}

      <header className="member-header">

        <div className="member-heading">

          <div className="member-breadcrumb">
            <span>ROOM 402 • HOSTEL ATTENDANCE & PRORATION</span>
          </div>

          <h1>Member Management & Active Days Attendance Matrix</h1>

          <p>
            Configure physical occupancy days (0–30 days) to calculate
            fair, prorated utility and shared meal splits. Adjustments
            dynamically rebalance variable consumption ledgers.
          </p>

        </div>

        <div className="billing-cycle-card">
          <div className="cycle-icon">
            <CalendarDays size={19} />
          </div>

          <div>
            <span>Billing Cycle</span>

            <strong>
              Oct 01 – Oct 31, 2024 (30 Billed Days)
            </strong>
          </div>
        </div>

      </header>

      {/* SUMMARY CARDS */}

      <section className="member-summary">

        <div className="member-stat-card">

          <div className="stat-content">
            <span className="stat-label">TOTAL REGISTERED</span>

            <div className="stat-number">
              {residents.length}
              <small>Active Residents</small>
            </div>

            <div className="stat-footnote">
              <span className="status-dot" />
              100% capacity in Suite 402
            </div>
          </div>

          <div className="stat-icon users-icon">
            <Users size={21} />
          </div>

        </div>

        <div className="member-stat-card">

          <div className="stat-content">
            <span className="stat-label">BILLED RESIDENT-DAYS</span>

            <div className="stat-number">
              {billedDays}
              <small>/ {maximumDays} Max Days</small>
            </div>

            <div className="occupancy-progress">
              <div>
                <span style={{ width: `${occupancy}%` }} />
              </div>

              <strong>{occupancy.toFixed(1)}% Occupancy</strong>
            </div>
          </div>

          <div className="stat-icon days-icon">
            <Wallet size={21} />
          </div>

        </div>

        <div className="member-stat-card">

          <div className="stat-content">
            <span className="stat-label">CONFIGURATION STATUS</span>

            <div className="configuration-month">
              {billingMonth}
            </div>

            <div className="audit-status">
              <BadgeCheck size={12} />
              Audit Ready • Balanced
            </div>
          </div>

          <div className="stat-icon config-icon">
            <CheckCircle2 size={21} />
          </div>

        </div>

      </section>

      {/* ATTENDANCE MATRIX */}

      <section className="member-matrix">

        <div className="matrix-header">

          <div>
            <h2>Room 402 Resident Allocation Matrix</h2>

            <p>
              Sliders calibrate the exact resident presence window.
              Utility weights automatically recalculate whenever
              attendance splits change.
            </p>
          </div>

          <div className="matrix-actions">

            <button
              type="button"
              className="reset-days-btn"
              onClick={handleReset}
            >
              <RotateCcw size={13} />
              Set All to 30 Days
            </button>

            <label className="pool-input-box">
              <Wallet size={14} />

              <span>Shared Variable Pool: Rs</span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={poolAmount}
                onChange={(e) => setPoolAmount(e.target.value)}
                aria-label="Shared variable pool in rupees"
              />
            </label>

          </div>

        </div>

        {/* TABLE HEADER */}

        <div className="matrix-table-header">

          <span>MEMBER DETAILS</span>
          <span>BED UNIT</span>
          <span>ACTIVE DAYS PRESENCE (0–30)</span>
          <span>ABSENCE JUSTIFICATION / NOTES</span>
          <span>PRORATED FACTOR</span>
          <span>FAIR BILL SHARE</span>

        </div>

        {/* RESIDENT ROWS */}

        <div className="resident-list">

          {residents.map((resident) => {

            const factor = getProratedFactor(resident.days);
            const fairShare = getFairShare(resident.days);

            const isFull = resident.days === 30;
            const isHalf = resident.days <= 15;

            return (

              <article
                className="resident-row"
                key={resident.id}
              >

                {/* MEMBER DETAILS */}

                <div className="resident-details">

                  <div className={`resident-avatar ${resident.color}`}>
                    <UserRound size={21} />
                  </div>

                  <div className="resident-info">

                    <div className="resident-name-line">
                      <strong>{resident.name}</strong>

                      {resident.role === "Host" && (
                        <span className="host-badge">Host</span>
                      )}

                      {resident.role === "Vacation" && (
                        <span className="vacation-badge">
                          Vacation
                        </span>
                      )}
                    </div>

                    <span className="resident-email">
                      <Mail size={10} />
                      {resident.email}
                    </span>

                    <span className="resident-phone">
                      <Phone size={10} />
                      {resident.phone}
                    </span>

                    <span className="resident-relation">
                      • Emg: {resident.relation}
                    </span>

                  </div>

                </div>

                {/* BED UNIT */}

                <div className="bed-column">
                  <span className="bed-badge">
                    <Building2 size={11} />
                    {resident.room}
                  </span>
                </div>

                {/* ATTENDANCE SLIDER */}

                <div className="attendance-column">

                  <div className="attendance-top">

                    <span className={
                      isFull
                        ? "occupancy-full"
                        : isHalf
                          ? "occupancy-low"
                          : "occupancy-partial"
                    }>
                      {isFull
                        ? "Full Occupancy"
                        : isHalf
                          ? "Half-Month Absence"
                          : "Prorated Presence"}
                    </span>

                    <strong className={
                      isFull
                        ? "days-full"
                        : isHalf
                          ? "days-low"
                          : "days-partial"
                    }>
                      {resident.days} Days
                    </strong>

                  </div>

                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={resident.days}
                    onChange={(e) =>
                      handleDaysChange(resident.id, e.target.value)
                    }
                    className="attendance-slider"
                    aria-label={`${resident.name} active days`}
                    style={{
                      "--slider-progress": `${(resident.days / 30) * 100}%`,
                    }}
                  />

                  <div className="slider-labels">
                    <span>0d (Vacant)</span>
                    <span>15d</span>
                    <span>30d (Max)</span>
                  </div>

                </div>

                {/* ABSENCE NOTES */}

                <div className="absence-column">

                  <input
                    type="text"
                    value={resident.note}
                    onChange={(e) =>
                      handleNoteChange(resident.id, e.target.value)
                    }
                    placeholder="Enter absence reason..."
                    aria-label={`Absence notes for ${resident.name}`}
                  />

                </div>

                {/* PRORATED FACTOR */}

                <div className="factor-column">
                  <span className={`factor-badge ${
                    factor === 1
                      ? "factor-full"
                      : factor <= 0.5
                        ? "factor-low"
                        : "factor-partial"
                  }`}>
                    {factor.toFixed(2)}x
                  </span>
                </div>

                {/* FAIR SHARE */}

                <div className="fair-share-column">

                  <strong>
                    Rs {formatPKR(fairShare)}
                  </strong>

                  <span>
                    {factor === 1
                      ? "100% Allocation"
                      : `${(factor * 100).toFixed(0)}%`}
                  </span>

                  {resident.days < 30 && (
                    <small>
                      -Rs {formatPKR(
                        (30 - resident.days) * dailyRate
                      )} Proration
                    </small>
                  )}

                  <button
                    className="resident-details-toggle"
                    type="button"
                    onClick={() =>
                      setShowDetails(
                        showDetails === resident.id
                          ? null
                          : resident.id
                      )
                    }
                  >
                    <ChevronDown
                      size={13}
                      className={
                        showDetails === resident.id ? "rotated" : ""
                      }
                    />
                  </button>

                </div>

                {showDetails === resident.id && (

                  <div className="resident-expanded">

                    <div>
                      <span>Active Days</span>
                      <strong>{resident.days} / 30</strong>
                    </div>

                    <div>
                      <span>Daily Rate</span>
                      <strong>Rs {formatPKR(dailyRate)}</strong>
                    </div>

                    <div>
                      <span>Prorated Share</span>
                      <strong>Rs {formatPKR(fairShare)}</strong>
                    </div>

                  </div>

                )}

              </article>

            );
          })}

        </div>

        {/* MATRIX FOOTER */}

        <div className="matrix-footer">

          <div className="matrix-footer-info">
            <Info size={15} />

            <span>
              Daily allocation rate: Rs {formatPKR(dailyRate)} per resident-day
            </span>
          </div>

          <button
            type="button"
            className="export-members-btn"
            onClick={handleExport}
          >
            <Download size={14} />
            Export Attendance
          </button>

        </div>

      </section>

      {/* FINANCIAL SUMMARY */}

      <section className="member-financial-summary">

        <div className="financial-card">
          <span>TOTAL SHARED POOL</span>
          <strong>Rs {formatPKR(totalPool)}</strong>
          <small>Configured monthly variable expenses</small>
        </div>

        <div className="financial-card">
          <span>ALLOCATED AMOUNT</span>
          <strong>Rs {formatPKR(totalAllocated)}</strong>
          <small>Based on actual active resident-days</small>
        </div>

        <div className="financial-card savings-card">
          <span>VACANCY / ABSENCE SAVINGS</span>
          <strong>Rs {formatPKR(occupancySavings)}</strong>
          <small>Unallocated amount from absent days</small>
        </div>

      </section>

      <div className="member-disclaimer">
        <ShieldCheckIcon />
        Attendance changes automatically update each resident's
        estimated variable bill share. This is a frontend calculation
        demo and does not save data to a backend.
      </div>

    </div>
  );
};

// Small reusable icon
const ShieldCheckIcon = () => (
  <BadgeCheck size={15} />
);

export default MemberManagement;
