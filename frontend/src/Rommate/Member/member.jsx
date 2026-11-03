
import React, { useState } from "react";
import {
  Users,
  CalendarDays,
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  BedDouble,
  RotateCcw,
  Info,
  CircleCheck,
  UserRound,
  Calculator
} from "lucide-react";

import "./member.css";

const initialMembers = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali.khan@splitfly.int...",
    phone: "+92 300 80419201",
    relation: "Father",
    bed: "Bed A",
    days: 30,
    note: "Present all month • Suite pro",
    status: "Active",
    color: "green"
  },
  {
    id: 2,
    name: "Hamza Tariq",
    email: "hamza.tariq@splitfly.int...",
    phone: "+92 321 9021456",
    relation: "Brother",
    bed: "Bed B",
    days: 28,
    note: "Weekend hackathon away",
    status: "Active",
    color: "blue"
  },
  {
    id: 3,
    name: "Daniyal Ahmed",
    email: "daniyal.a@splitfly.int...",
    phone: "+92 333 7104928",
    relation: "Mother",
    bed: "Bed C",
    days: 15,
    note: "Semester Break / Visited Home",
    status: "Vacation",
    color: "orange"
  },
  {
    id: 4,
    name: "Zain Malik",
    email: "zain.malik@splitfly.int...",
    phone: "+92 345 8891021",
    relation: "Guardian",
    bed: "Bed D",
    days: 30,
    note: "Full residency • Lab duties",
    status: "Active",
    color: "teal"
  },
  {
    id: 5,
    name: "Bilal Raza",
    email: "bilal.raza@splitfly.int...",
    phone: "+92 301 8876542",
    relation: "Friend",
    bed: "Bed E",
    days: 25,
    note: "Personal leave",
    status: "Active",
    color: "purple"
  },
  {
    id: 6,
    name: "Sarah Ahmed",
    email: "sarah.ahmed@splitfly.int...",
    phone: "+92 312 4567890",
    relation: "Sister",
    bed: "Bed F",
    days: 30,
    note: "Full month residency",
    status: "Active",
    color: "pink"
  }
];

export default function MemberManagement() {
  const [members, setMembers] = useState(initialMembers);
  const [pool, setPool] = useState(480);
  const [billingDays, setBillingDays] = useState(30);
  const [billingMonth, setBillingMonth] = useState("October 2024");
  const [showAll, setShowAll] = useState(false);

  const activeMembers = members.filter((member) => member.days > 0);

  const totalDays = members.reduce(
    (sum, member) => sum + member.days,
    0
  );

  const maxResidentDays = members.length * billingDays;

  const occupancy = maxResidentDays
    ? (totalDays / maxResidentDays) * 100
    : 0;

  const updateMember = (id, field, value) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, [field]: value }
          : member
      )
    );
  };

  const resetDays = () => {
    setMembers((prev) =>
      prev.map((member) => ({
        ...member,
        days: billingDays
      }))
    );
  };

  const resetAll = () => {
    setMembers(initialMembers);
    setPool(480);
    setBillingDays(30);
    setBillingMonth("October 2024");
  };

  const getFactor = (days) => {
    return billingDays > 0 ? days / billingDays : 0;
  };

  const totalWeight = members.reduce(
    (sum, member) => sum + getFactor(member.days),
    0
  );

  const getShare = (days) => {
    if (totalWeight === 0) return 0;
    return (pool * getFactor(days)) / totalWeight;
  };

  const getProration = (days) => {
    if (billingDays === 0) return 0;
    return days / billingDays;
  };

  const formatMoney = (amount) =>
    `Rs ${amount.toFixed(2)}`;

  const handleSave = () => {
    alert("Attendance and resident allocation are ready to save.");
  };

  return (
    <div className="member-page">

      {/* HEADER */}

      <header className="member-header">
        <div className="member-heading">

          <div className="member-breadcrumb">
            <span>✣ ROOM 402 • HOSTEL ATTENDANCE & PRORATION</span>
          </div>

          <h1>Member Management & Active Days Attendance Matrix</h1>

          <p>
            Configure physical occupancy days (0–30 days) to calculate
            fair, prorated utility and shared meal splits. Adjustments
            dynamically rebalance variable consumption ledgers.
          </p>
        </div>

        <div className="billing-cycle-card">
          <div className="billing-icon">
            <CalendarDays size={17} />
          </div>

          <div>
            <span>Billing Cycle</span>
            <strong>{billingMonth} ({billingDays} Billed Days)</strong>
          </div>
        </div>
      </header>

      {/* SUMMARY CARDS */}

      <section className="member-stats">

        <div className="member-stat-card">
          <div className="stat-content">
            <span className="stat-label">TOTAL REGISTERED</span>
            <div className="stat-number">
              {members.length}
              <small>Active Residents</small>
            </div>
            <p className="stat-footer">
              <span className="green-dot"></span>
              100% Capacity in Suite 402
            </p>
          </div>

          <div className="stat-icon residents-icon">
            <Users size={20} />
          </div>
        </div>

        <div className="member-stat-card">
          <div className="stat-content">
            <span className="stat-label">BILLED RESIDENT-DAYS</span>
            <div className="stat-number">
              {totalDays}
              <small>/ {maxResidentDays} Max Days</small>
            </div>

            <div className="occupancy-progress">
              <div>
                <span style={{ width: `${occupancy}%` }}></span>
              </div>
              <strong>{occupancy.toFixed(1)}%</strong>
            </div>

            <p className="stat-footer">Occupancy</p>
          </div>

          <div className="stat-icon days-icon">
            <Wallet size={20} />
          </div>
        </div>

        <div className="member-stat-card">
          <div className="stat-content">
            <span className="stat-label">CONFIGURATION STATUS</span>
            <div className="configuration-month">{billingMonth}</div>
            <span className="audit-status">
              <ShieldCheck size={12} />
              Audit Ready • Balanced
            </span>
          </div>

          <div className="stat-icon audit-icon">
            <ClipboardCheck size={21} />
          </div>
        </div>

      </section>

      {/* ATTENDANCE MATRIX */}

      <section className="attendance-panel">

        <div className="attendance-panel-header">
          <div>
            <h2>Room 402 Resident Allocation Matrix</h2>
            <p>
              Sliders calibrate the exact resident presence window.
              Utility weights automatically recalculate variable
              overhead splits.
            </p>
          </div>

          <div className="matrix-actions">
            <button onClick={resetDays}>
              <RotateCcw size={12} />
              Set All to {billingDays} Days
            </button>

            <button
              onClick={() => setShowAll(!showAll)}
              className="pool-button"
            >
              <Wallet size={12} />
              Shared Variable Pool: Rs {pool.toFixed(2)}
            </button>
          </div>
        </div>

        {showAll && (
          <div className="pool-editor">
            <label>Shared Variable Pool (Rs)</label>
            <input
              type="number"
              min="0"
              value={pool}
              onChange={(e) => setPool(Math.max(0, Number(e.target.value)))}
            />

            <label>Billing Days</label>
            <input
              type="number"
              min="1"
              max="30"
              value={billingDays}
              onChange={(e) => {
                const value = Math.min(30, Math.max(1, Number(e.target.value)));
                setBillingDays(value);
                setMembers((prev) =>
                  prev.map((member) => ({
                    ...member,
                    days: Math.min(member.days, value)
                  }))
                );
              }}
            />

            <label>Billing Month</label>
            <input
              value={billingMonth}
              onChange={(e) => setBillingMonth(e.target.value)}
            />
          </div>
        )}

        {/* TABLE HEADER */}

        <div className="attendance-table-header">
          <span>MEMBER DETAILS</span>
          <span>BED UNIT</span>
          <span>ACTIVE DAYS PRESENCE (0–{billingDays})</span>
          <span>ABSENCE JUSTIFICATION / NOTES</span>
          <span>PRORATED FACTOR</span>
          <span>FAIR BILL SHARE</span>
        </div>

        {/* RESIDENT ROWS */}

        <div className="attendance-list">

          {members.map((member) => {
            const factor = getProration(member.days);
            const share = getShare(member.days);
            const isFull = member.days === billingDays;

            return (
              <div className="attendance-row" key={member.id}>

                {/* MEMBER */}

                <div className="member-details">
                  <div className={`member-avatar ${member.color}`}>
                    <UserRound size={19} />
                  </div>

                  <div className="member-person">
                    <div className="member-name-line">
                      <strong>{member.name}</strong>

                      {member.status === "Vacation" && (
                        <span className="vacation-tag">Vacation</span>
                      )}
                    </div>

                    <span>{member.email}</span>
                    <small>♧ {member.phone}</small>
                    <small>✦ Eng: {member.relation}</small>
                  </div>
                </div>

                {/* BED */}

                <div className="bed-unit">
                  <span>
                    <BedDouble size={11} />
                    {member.bed}
                  </span>
                </div>

                {/* SLIDER */}

                <div className="presence-control">

                  <div className="presence-heading">
                    <span>
                      {isFull
                        ? "Full Occupancy"
                        : member.days === 0
                        ? "Vacant"
                        : member.days >= billingDays / 2
                        ? "Prorated Presence"
                        : "Half-Month Absence"}
                    </span>

                    <strong
                      className={
                        isFull
                          ? "full-days"
                          : member.days < billingDays / 2
                          ? "low-days"
                          : "partial-days"
                      }
                    >
                      {member.days} Days
                    </strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={billingDays}
                    value={member.days}
                    onChange={(e) =>
                      updateMember(
                        member.id,
                        "days",
                        Number(e.target.value)
                      )
                    }
                    className="attendance-slider"
                    style={{
                      "--slider-progress":
                        `${factor * 100}%`
                    }}
                  />

                  <div className="slider-labels">
                    <span>0d (Vacant)</span>
                    <span>{Math.round(billingDays / 2)}d</span>
                    <span>{billingDays}d (Max)</span>
                  </div>

                </div>

                {/* ABSENCE NOTES */}

                <div className="absence-control">
                  <input
                    value={member.note}
                    onChange={(e) =>
                      updateMember(member.id, "note", e.target.value)
                    }
                    placeholder="Enter absence reason..."
                  />
                </div>

                {/* FACTOR */}

                <div className="factor-column">
                  <strong
                    className={
                      factor === 1
                        ? "factor-full"
                        : "factor-partial"
                    }
                  >
                    {factor.toFixed(2)}x
                  </strong>

                  {factor < 1 && member.days > 0 && (
                    <span>
                      -Rs {(getShare(member.days) * (1 - factor)).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* SHARE */}

                <div className="fair-share">
                  <strong>{formatMoney(share)}</strong>

                  <span>
                    {member.days === 0
                      ? "No Allocation"
                      : `${(factor * 100).toFixed(0)}% Allocation`}
                  </span>
                </div>

              </div>
            );
          })}

        </div>

        {/* TOTAL FOOTER */}

        <div className="attendance-footer">
          <div>
            <span>Total Resident Days</span>
            <strong>{totalDays} Days</strong>
          </div>

          <div>
            <span>Shared Variable Pool</span>
            <strong>{formatMoney(pool)}</strong>
          </div>

          <div>
            <span>Allocated Amount</span>
            <strong>{formatMoney(totalWeight > 0 ? pool : 0)}</strong>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="attendance-bottom">
          <div className="balance-message">
            <CircleCheck size={15} />
            Attendance and allocation totals recalculated
          </div>

          <button className="reset-button" onClick={resetAll}>
            <RotateCcw size={14} />
            Reset
          </button>

          <button className="save-members-button" onClick={handleSave}>
            <ShieldCheck size={15} />
            Save Attendance Matrix
          </button>
        </div>

      </section>

      {/* INFORMATION */}

      <div className="attendance-info">
        <Info size={15} />
        <p>
          <strong>Proration Policy:</strong> The shared variable pool is
          distributed proportionally according to each resident's
          active days. Changes to attendance automatically update
          each resident's calculated share.
        </p>
      </div>

    </div>
  );
}
