
import React, { useState } from "react";
import "./maintenance.css";

const initialAlerts = [
  {
    id: 1,
    category: "maintenance",
    priority: "HIGH URGENCY",
    title: "Sunset Heights — Apt 301",
    issue: "Geyser thermostat tripped breaker. Water leakage spreading under sink.",
    description: "Reported by Tenant Daniyal Ahmed via Splitfy Mobile.",
    ticket: "MNT-8942",
    time: "25 mins ago",
    tag: "Plumbing Urgent • Immediate Attention",
    attachment: "pipe_burst_sink.jpg",
    building: "Block C • 3rd Floor",
    isolation: "Panel Breaker #7 Tripped",
    technician: "Bashir Plumbing",
    distance: "500m away",
  },
  {
    id: 2,
    category: "vacancy",
    priority: "TOUR BOOKING",
    title: "Gulberg Suites — Unit 4B",
    issue: "New prospective tenant inquiry from Hamza Baig (Executive Tech Lead).",
    description: "Requesting viewing visit for 2-Bed Furnished suite on Saturday 3:00 PM.",
    ticket: "INQ-4201",
    time: "14 mins ago",
    tag: "Splitfy Public Portal",
    attachment: "Verified Lead",
    building: "Saturday 15:00 Free",
    isolation: "Income Verified • 94% Match",
  },
  {
    id: 3,
    category: "lease",
    priority: "LEASE EXPIRATION",
    title: "Elite Residency — Unit 202",
    issue: "Lease renewal confirmation required.",
    description: "Tenant has been notified. Awaiting renewal decision.",
    ticket: "LSE-2202",
    time: "1 hour ago",
    tag: "Renewal Reminder",
    attachment: "Tenant Record",
    building: "Unit 202",
    isolation: "Renewal Pending",
  },
];

const technicians = [
  {
    id: 1,
    name: "Bashir Plumbing",
    distance: "500m away",
    availability: "Available",
    rating: "4.9",
    jobs: 32,
    type: "Plumbing",
    initials: "BP",
  },
  {
    id: 2,
    name: "Rashid Electric",
    distance: "On Job (Unit 208)",
    availability: "Free 20m",
    rating: "4.8",
    jobs: 48,
    type: "Electrician",
    initials: "RE",
  },
  {
    id: 3,
    name: "Farooq HVAC Tech",
    distance: "1.2 km away",
    availability: "Standby",
    rating: "4.9",
    jobs: 19,
    type: "HVAC",
    initials: "FH",
  },
];

export default function OperationsDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [notification, setNotification] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showRouting, setShowRouting] = useState(false);
  const [showContractors, setShowContractors] = useState(false);

  const notify = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredAlerts = alerts.filter((alert) => {
    return activeTab === "all" || alert.category === activeTab;
  });

  const dispatchTechnician = (technician) => {
    setSelectedTechnician(technician);
    notify(`${technician} dispatch initiated (demo).`);
  };

  const removeAlert = (id) => {
    setAlerts((items) => items.filter((item) => item.id !== id));
    notify("Alert marked as resolved (demo).");
  };

  return (
    <div className="operations-dashboard">

      {/* LIVE HEADER */}
      <header className="operations-header">

        <div className="header-main">

          <div className="header-bell">♧</div>

          <div className="header-content">

            <div className="header-title-line">
              <h1>Real-Time Portfolio Operations & Incident Dispatch</h1>
              <span className="live-badge">● LIVE FEED</span>
            </div>

            <p>
              Active maintenance incidents, technician dispatch, and
              tenant vacancy turnover management across Pakistani rental properties.
            </p>

            <div className="header-status">
              <b>{alerts.length} Active Incidents (1 High Urgency)</b>
              <span>✓ Avg Dispatch Resolution: 18m</span>
            </div>

          </div>

        </div>

        <div className="header-buttons">
          <button
            className="rules-button"
            onClick={() => setShowRouting(!showRouting)}
          >
            ☷ Rules & Routing
          </button>

          <button
            className="broadcast-button"
            onClick={() => notify("Broadcast alert prepared (demo).")}
          >
            ▣ Broadcast Alert
          </button>
        </div>

        {showRouting && (
          <div className="routing-panel">
            <b>Incident Routing Rules</b>
            <p>Plumbing → Nearest available plumber</p>
            <p>Electrical → On-duty electrician</p>
            <p>HVAC → Preferred HVAC contractor</p>
            <p>Vacancy → Leasing operations team</p>
          </div>
        )}

      </header>

      {/* MAIN GRID */}
      <div className="operations-layout">

        {/* LEFT COLUMN */}
        <main className="operations-main">

          {/* FILTER TABS */}
          <section className="alert-filters">

            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Alerts <span>{alerts.length}</span>
            </button>

            <button
              className={activeTab === "maintenance" ? "active" : ""}
              onClick={() => setActiveTab("maintenance")}
            >
              Urgent Maintenance <span>3</span>
            </button>

            <button
              className={activeTab === "vacancy" ? "active" : ""}
              onClick={() => setActiveTab("vacancy")}
            >
              Vacancy & Inquiries <span>3</span>
            </button>

            <button
              className={activeTab === "lease" ? "active" : ""}
              onClick={() => setActiveTab("lease")}
            >
              Lease Expirations <span>2</span>
            </button>

            <div className="priority-sort">
              ⇅ PRIORITY SORTED
            </div>

          </section>

          {/* ALERT CARDS */}
          <section className="alerts-list">

            {filteredAlerts.length === 0 && (
              <div className="empty-alerts">
                No alerts in this category.
              </div>
            )}

            {filteredAlerts.map((alert) => (

              <article
                key={alert.id}
                className={`incident-card ${alert.category}`}
              >

                <div className="incident-top">

                  <div className="incident-icon">
                    {alert.category === "maintenance" ? "⚒" :
                     alert.category === "vacancy" ? "♙" : "▣"}
                  </div>

                  <div className="incident-content">

                    <div className="incident-labels">
                      <span className={`priority-label ${alert.category}`}>
                        {alert.priority}
                      </span>

                      <span className="ticket-number">
                        Ticket #{alert.ticket}
                      </span>

                      <small>◷ {alert.time}</small>
                    </div>

                    <h2>{alert.title}</h2>

                    <p>{alert.issue}</p>
                    <p>{alert.description}</p>

                  </div>

                  {alert.category === "maintenance" && (
                    <span className="urgent-tag">
                      ● Plumbing Urgent • Immediate Attention
                    </span>
                  )}

                </div>

                <div className="incident-meta">

                  <div>
                    <span className="meta-icon">▣</span>
                    <div>
                      <small>Tenant Attachment</small>
                      <b>{alert.attachment}</b>
                    </div>
                  </div>

                  <div>
                    <span className="meta-icon">♙</span>
                    <div>
                      <small>Building Sub-Location</small>
                      <b>{alert.building}</b>
                    </div>
                  </div>

                  <div>
                    <span className="meta-icon">ϟ</span>
                    <div>
                      <small>Sub-Circuit Isolation</small>
                      <b>{alert.isolation}</b>
                    </div>
                  </div>

                </div>

                {alert.category === "maintenance" ? (

                  <>

                    <div className="recommended-tech">
                      <span>● Recommended: Plumber Bashir (500m away)</span>
                    </div>

                    <div className="incident-actions">

                      <button
                        className="whatsapp-caretaker"
                        onClick={() => notify("Caretaker WhatsApp message prepared.")}
                      >
                        ▣ WhatsApp Caretaker
                      </button>

                      <button
                        className="dispatch-button"
                        onClick={() => dispatchTechnician("Bashir Plumbing")}
                      >
                        ϟ 1-Click Dispatch On-Call Plumber Bashir
                      </button>

                      <button
                        className="resolve-button"
                        onClick={() => removeAlert(alert.id)}
                      >
                        Resolve
                      </button>

                    </div>

                  </>

                ) : (

                  <div className="incident-actions secondary-actions">

                    <button
                      className="whatsapp-caretaker"
                      onClick={() => notify("Inquiry contact message prepared.")}
                    >
                      ▣ Contact Tenant
                    </button>

                    <button
                      className="dispatch-button"
                      onClick={() => notify("Booking action initiated (demo).")}
                    >
                      {alert.category === "vacancy"
                        ? "✓ Schedule Tour & Send Notice"
                        : "✓ Review Lease Renewal"}
                    </button>

                  </div>

                )}

              </article>

            ))}

          </section>

        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="operations-sidebar">

          {/* TECHNICIANS */}
          <section className="technicians-card">

            <div className="sidebar-card-heading">

              <div>
                <h2>♧ On-Duty Technicians</h2>
                <p>Active contractors assigned to Sunset Heights & Gulberg Suites sector.</p>
              </div>

              <span className="active-count">3 Active</span>

            </div>

            <div className="technician-list">

              {technicians.map((tech) => (

                <div className="technician-item" key={tech.id}>

                  <div className="technician-info">

                    <div className="technician-avatar">
                      {tech.initials}
                    </div>

                    <div className="technician-details">
                      <h3>{tech.name} <span>✪ {tech.rating}</span></h3>
                      <p>◉ {tech.distance}</p>
                      <small>{tech.availability}</small>
                    </div>

                    <div className="technician-jobs">
                      {tech.jobs}
                      <small>Jobs</small>
                    </div>

                  </div>

                  <div className="technician-actions">

                    <button
                      onClick={() => notify(`Calling ${tech.name} (demo).`)}
                    >
                      ☎ Direct Call
                    </button>

                    <button
                      onClick={() => notify(`WhatsApp opened for ${tech.name} (demo).`)}
                    >
                      ▣ WhatsApp
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <button
              className="add-contractor"
              onClick={() => setShowContractors(!showContractors)}
            >
              ⊕ Add Preferred Contractor
            </button>

            {showContractors && (
              <div className="contractor-panel">
                <b>Preferred Contractor Registration</b>
                <input placeholder="Contractor name" />
                <input placeholder="Specialty / trade" />
                <button onClick={() => notify("Contractor registration saved (demo).")}>
                  Save Contractor
                </button>
              </div>
            )}

          </section>

          {/* TURNAROUND */}
          <section className="turnaround-card">

            <div className="turnaround-heading">
              <h2>30-Day Turnaround Velocity</h2>
              <span>96.4% Efficiency</span>
            </div>

            <div className="turnaround-content">

              <div className="velocity-circle">
                <div>
                  <b>88%</b>
                  <small>On Target</small>
                </div>
              </div>

              <div className="velocity-stats">

                <div>
                  <span>Avg Repair Time</span>
                  <b>2.4 hrs</b>
                </div>

                <div>
                  <span>Vacancy Fill Cy...</span>
                  <b>51 days</b>
                </div>

                <div>
                  <span>Tenant Satisfaction</span>
                  <b>4.92 / 5.0</b>
                </div>

              </div>

            </div>

          </section>

        </aside>

      </div>

      {notification && (
        <div className="operations-toast">
          ✓ {notification}
        </div>
      )}

    </div>
  );
}
