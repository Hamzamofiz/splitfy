
import React, { useMemo, useState } from "react";
import {
  Building2,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Download,
  Plus,
  BellRing,
  FileText,
  MapPin,
  BedDouble,
  Users,
  ArrowUpRight,
  Search,
  X,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Home,
} from "lucide-react";

import "./analytics.css";

const initialProperties = [
  {
    id: 1,
    name: "Sunset Heights Residences",
    location: "F-10/3 Markaz, Islamabad",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",
    occupancy: 100,
    units: 8,
    occupied: 8,
    vacant: 0,
    status: "100% Collected",
    tag: "Block A & B",
    description: "Co-equal Split • Node Active",
    rent: 680000,
    color: "teal",
  },
  {
    id: 2,
    name: "Elite Residency Block B",
    location: "DHA Phase 6, Lahore",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900",
    occupancy: 83,
    units: 6,
    occupied: 5,
    vacant: 1,
    status: "83% Collected",
    tag: "Penthouses & 3-Bed",
    description: "1 Pending Tenant Payment",
    rent: 745000,
    color: "blue",
  },
  {
    id: 3,
    name: "Gulberg Executive Suites",
    location: "Gulberg III, Lahore",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900",
    occupancy: 75,
    units: 4,
    occupied: 3,
    vacant: 1,
    status: "1 Vacancy Alert",
    tag: "Furnished Corporate",
    description: "High Turnover Cap",
    rent: 420000,
    color: "orange",
  },
];

export default function PropertyPortfolio() {
  const [properties, setProperties] = useState(initialProperties);
  const [cycle, setCycle] = useState("November 2024");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    units: "",
    rent: "",
  });

  const totalUnits = properties.reduce(
    (sum, property) => sum + property.units,
    0
  );

  const occupiedUnits = properties.reduce(
    (sum, property) => sum + property.occupied,
    0
  );

  const totalRent = properties.reduce(
    (sum, property) => sum + property.rent,
    0
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) =>
      `${property.name} ${property.location}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [properties, search]);

  const addProperty = (e) => {
    e.preventDefault();

    if (
      !newProperty.name.trim() ||
      !newProperty.location.trim() ||
      !newProperty.units ||
      !newProperty.rent
    ) {
      return;
    }

    const property = {
      id: Date.now(),
      name: newProperty.name,
      location: newProperty.location,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900",
      occupancy: 0,
      units: Number(newProperty.units),
      occupied: 0,
      vacant: Number(newProperty.units),
      status: "New Property",
      tag: "Recently Added",
      description: "Awaiting tenant registration",
      rent: Number(newProperty.rent),
      color: "teal",
    };

    setProperties((prev) => [...prev, property]);

    setNewProperty({
      name: "",
      location: "",
      units: "",
      rent: "",
    });

    setShowModal(false);
    setAlertMessage("Property added successfully.");
  };

  const downloadReport = () => {
    const headers = [
      "Property",
      "Location",
      "Total Units",
      "Occupied Units",
      "Vacant Units",
      "Occupancy",
      "Monthly Rent",
    ];

    const rows = properties.map((property) => [
      property.name,
      property.location,
      property.units,
      property.occupied,
      property.vacant,
      `${property.occupancy}%`,
      property.rent,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Splitfy-Property-Portfolio.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const showAction = (message) => {
    setAlertMessage(message);
  };

  return (
    <div className="portfolio-page">

      {/* HEADER */}

      <header className="portfolio-header">

        <div className="portfolio-heading">

          <span className="portfolio-eyebrow">
            <span></span>
            PROPERTY PORTFOLIO • MASTER RENTAL LEDGER
          </span>

          <h1>Portfolio Financial Analytics & Master Property Ledger</h1>

          <p>
            Consolidated performance metrics, liquidity allocation,
            and unit-level rent velocity across 3 developments.
          </p>

        </div>

        <div className="portfolio-header-actions">

          <label className="portfolio-cycle">
            <ShieldCheck size={13} />

            <span>Cycle:</span>

            <select
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              aria-label="Billing cycle"
            >
              <option>November 2024</option>
              <option>October 2024</option>
              <option>September 2024</option>
              <option>August 2024</option>
            </select>
          </label>

          <button
            type="button"
            className="portfolio-download-btn"
            onClick={downloadReport}
          >
            <Download size={13} />
            Download Audit Report
          </button>

          <button
            type="button"
            className="portfolio-add-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} />
            Add New Property
          </button>

        </div>

      </header>

      {/* NOTIFICATION */}

      {alertMessage && (
        <div className="portfolio-toast" role="status">
          <CheckCircle2 size={15} />
          {alertMessage}

          <button
            type="button"
            onClick={() => setAlertMessage("")}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI CARDS */}

      <section className="portfolio-stats">

        <article className="portfolio-stat-card collection-stat">

          <div className="portfolio-stat-heading">
            <span>TOTAL MONTHLY COLLECTION</span>

            <div className="portfolio-stat-icon teal-icon">
              <Wallet size={16} />
            </div>
          </div>

          <h2>Rs {totalRent.toLocaleString("en-PK")}</h2>

          <div className="portfolio-collection-info">
            <span>78% Collected</span>
            <strong>Rs 1,440,000 of Rs 1,845,000</strong>
          </div>

          <div className="portfolio-progress">
            <span style={{ width: "78%" }}></span>
          </div>

          <div className="portfolio-stat-bottom">
            <span>
              <i className="dot-collected"></i>
              Rs 1,440,000 Collected
            </span>

            <span>
              <i className="dot-pending"></i>
              Rs 405,000 Pending
            </span>
          </div>

        </article>

        <article className="portfolio-stat-card occupancy-stat">

          <div className="portfolio-stat-heading">
            <span>PORTFOLIO OCCUPANCY</span>

            <div className="portfolio-stat-icon blue-icon">
              <Building2 size={16} />
            </div>
          </div>

          <h2>
            {totalUnits
              ? ((occupiedUnits / totalUnits) * 100).toFixed(1)
              : "0.0"}%
          </h2>

          <div className="portfolio-occupancy-info">
            <span>{occupiedUnits} of {totalUnits} Units Occupied</span>
            <strong>Healthy High Tier</strong>
          </div>

          <div className="portfolio-unit-dots">
            {properties.flatMap((property) =>
              Array.from({ length: property.units }, (_, index) => (
                <i
                  key={`${property.id}-${index}`}
                  className={
                    index < property.occupied ? "occupied-dot" : "vacant-dot"
                  }
                ></i>
              ))
            )}
          </div>

          <div className="portfolio-stat-note">
            {totalUnits - occupiedUnits} Pending Renewal / Vacant Units
          </div>

        </article>

        <article className="portfolio-stat-card cashflow-stat">

          <div className="portfolio-stat-heading">
            <span>NET OPERATING CASHFLOW</span>

            <div className="portfolio-stat-icon blue-icon">
              <TrendingUp size={16} />
            </div>
          </div>

          <h2>+Rs 1,328,000</h2>

          <div className="portfolio-cashflow-info">
            <strong>
              <TrendingUp size={12} />
              +6.2% vs Last Month
            </strong>
            <span>Margin 72%</span>
          </div>

          <div className="portfolio-mini-line">
            <span></span>
          </div>

          <div className="portfolio-stat-bottom">
            <span>Disbursements Cleared</span>
            <strong>Auto-Split On</strong>
          </div>

        </article>

        <article className="portfolio-stat-card maintenance-stat">

          <div className="portfolio-stat-heading">
            <span>MAINTENANCE & SINKING FUND</span>

            <div className="portfolio-stat-icon orange-icon">
              <ShieldCheck size={16} />
            </div>
          </div>

          <h2>Rs 520,000</h2>

          <div className="portfolio-fund-info">
            <span>Emergency Maintenance Pool</span>
            <strong>86.6% funded</strong>
          </div>

          <div className="portfolio-progress fund-progress">
            <span style={{ width: "86.6%" }}></span>
          </div>

          <div className="portfolio-stat-note">
            Pool active & HBL / Meezan Account #9021
          </div>

        </article>

      </section>

      {/* PRIORITY ALERT */}

      <section className="portfolio-alert">

        <div className="portfolio-alert-icon">
          <BellRing size={17} />
        </div>

        <div className="portfolio-alert-content">
          <div className="portfolio-alert-title">
            Priority Action Required: 2 Portfolio Alerts

            <span>Urgent Attention</span>
          </div>

          <p>
            Unit 302 (Sunset Heights): lease expires in 14 days.
            Pending Gulberg Phase 2 sub-meter electricity reconciliation
            (Rs 34,000).
          </p>
        </div>

        <div className="portfolio-alert-actions">

          <button
            type="button"
            className="portfolio-audit-btn"
            onClick={() =>
              showAction("Sub-meter audit details are ready for review.")
            }
          >
            View Sub-Meter Audit
          </button>

          <button
            type="button"
            className="portfolio-renew-btn"
            onClick={() =>
              showAction("Renewal contract request selected.")
            }
          >
            Issue Renewal Contract
          </button>

        </div>

      </section>

      {/* PROPERTY SECTION */}

      <section className="portfolio-properties-section">

        <div className="portfolio-section-heading">

          <div>
            <h2>
              <Building2 size={17} />
              Properties Under Active Management
            </h2>

            <p>Manage your developments and rental performance.</p>
          </div>

          <div className="portfolio-live-indicator">
            <span></span>
            Real-Time Split & Collection Velocity
          </div>

        </div>

        {/* SEARCH */}

        <div className="portfolio-search-row">

          <div className="portfolio-search">
            <Search size={15} />

            <input
              type="text"
              placeholder="Search properties or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <span>
            {filteredProperties.length} Properties
          </span>

        </div>

        {/* PROPERTY CARDS */}

        <div className="portfolio-property-grid">

          {filteredProperties.map((property) => (
            <article
              className="portfolio-property-card"
              key={property.id}
            >

              <div className="portfolio-property-image">

                <img
                  src={property.image}
                  alt={property.name}
                  loading="lazy"
                />

                <span className="portfolio-property-location">
                  <MapPin size={10} />
                  {property.location}
                </span>

                <span
                  className={`portfolio-property-status ${property.color}`}
                >
                  {property.status}
                </span>

              </div>

              <div className="portfolio-property-details">

                <div className="portfolio-property-title">
                  <h3>{property.name}</h3>

                  <span>{property.tag}</span>
                </div>

                <p>{property.units} Total Units • {property.occupied} Leased • {property.vacant} Vacant</p>

                <div className="portfolio-property-progress-info">
                  <span>Occupancy Rate</span>
                  <strong>{property.occupancy}%</strong>
                </div>

                <div className="portfolio-property-progress">
                  <span
                    style={{ width: `${property.occupancy}%` }}
                  ></span>
                </div>

                <div className="portfolio-property-footer">

                  <div>
                    <Wallet size={13} />
                    <span>
                      Rs {property.rent.toLocaleString("en-PK")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      showAction(
                        `${property.name} selected for property overview.`
                      )
                    }
                  >
                    View Details
                    <ArrowUpRight size={13} />
                  </button>

                </div>

              </div>

            </article>
          ))}

          {filteredProperties.length === 0 && (
            <div className="portfolio-no-results">
              <Search size={25} />
              <strong>No properties found</strong>
              <span>Try another property name or location.</span>
            </div>
          )}

        </div>

      </section>

      {/* ADD PROPERTY MODAL */}

      {showModal && (
        <div
          className="portfolio-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="portfolio-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="portfolio-modal-heading">

              <div>
                <span>PROPERTY MANAGEMENT</span>
                <h2>Add New Property</h2>
                <p>Enter your development details below.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close form"
              >
                <X size={19} />
              </button>

            </div>

            <form onSubmit={addProperty}>

              <label>
                Property Name
                <input
                  type="text"
                  placeholder="e.g. Royal Residency"
                  value={newProperty.name}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Property Location
                <input
                  type="text"
                  placeholder="City, Area"
                  value={newProperty.location}
                  onChange={(e) =>
                    setNewProperty({
                      ...newProperty,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <div className="portfolio-modal-row">

                <label>
                  Total Units
                  <input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={newProperty.units}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        units: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  Monthly Rent (Rs)
                  <input
                    type="number"
                    min="1"
                    placeholder="500000"
                    value={newProperty.rent}
                    onChange={(e) =>
                      setNewProperty({
                        ...newProperty,
                        rent: e.target.value,
                      })
                    }
                    required
                  />
                </label>

              </div>

              <div className="portfolio-modal-actions">

                <button
                  type="button"
                  className="portfolio-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="portfolio-modal-submit"
                >
                  <Plus size={15} />
                  Add Property
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
