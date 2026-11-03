
import React, { useState } from "react";
import "./collection.css";

const maintenanceItems = [
  {
    id: 1,
    priority: "HIGH URGENCY",
    unit: "Unit 104",
    property: "Sunset Heights",
    time: "18 mins ago",
    title: "Bathroom plumbing valve leak reported",
    description:
      "Tenant Tariq Al-Mansoor uploaded video proof of main riser pipe drip.",
    attachment: "1 attachment verified (0:14s MP4)",
  },
  {
    id: 2,
    priority: "MEDIUM",
    unit: "Unit 202",
    property: "Elite Residency",
    time: "42 mins ago",
    title: "Air conditioning maintenance required",
    description: "Tenant requested inspection of the cooling system.",
    attachment: "Maintenance request submitted",
  },
  {
    id: 3,
    priority: "LOW PRIORITY",
    unit: "Unit 305",
    property: "Sunset Heights",
    time: "1 hour ago",
    title: "Common area lighting replacement",
    description: "Lobby lighting inspection and replacement requested.",
    attachment: "No attachment",
  },
];

export default function ExecutiveDashboard() {
  const [activeCurrency, setActiveCurrency] = useState("PKR (Rs)");
  const [maintenance, setMaintenance] = useState(maintenanceItems);
  const [showLogs, setShowLogs] = useState(false);
  const [notification, setNotification] = useState("");
  const [syncing, setSyncing] = useState(false);

  const showAction = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const syncAccounts = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showAction("Account synchronization completed.");
    }, 1200);
  };

  const dispatchPlumber = (id) => {
    setMaintenance((items) =>
      items.filter((item) => item.id !== id)
    );
    showAction("Maintenance dispatch marked as assigned.");
  };

  return (
    <div className="executive-dashboard">

      {/* HEADER */}
      <header className="executive-header">

        <div>
          <div className="live-label">
            <span className="live-dot"></span>
            LIVE REAL-TIME TELEMETRY
          </div>

          <h1>
            Executive Command & Quick
            <br />
            Collection Hub
          </h1>

          <p>
            Live telemetry across Sunset Heights & Elite Estates •
            Real-time synchronization active for Pakistani rental portfolios.
          </p>
        </div>

        <div className="executive-actions">

          <select
            value={activeCurrency}
            onChange={(e) => setActiveCurrency(e.target.value)}
          >
            <option>PKR (Rs)</option>
            <option>USD ($)</option>
          </select>

          <button
            className="sync-button"
            onClick={syncAccounts}
            disabled={syncing}
          >
            ↻ {syncing ? "Syncing..." : "Sync Accounts"}
          </button>

        </div>

      </header>

      {/* MAIN TOP GRID */}
      <section className="executive-top-grid">

        {/* RENT REALIZATION */}
        <div className="realization-card">

          <div className="realization-heading">
            <div className="realization-icon">▣</div>

            <div>
              <h2>Rent Realization Index • October 2024</h2>
              <p>
                Reconciled portfolio gross yield across 18
                operational units
              </p>
            </div>

            <span className="target-pill">
              78.05% TARGET REACHED
            </span>
          </div>

          <div className="realization-content">

            <div className="realization-left">
              <label>GROSS REALIZED / ANTICIPATED</label>

              <h3>Rs 1,440,000</h3>
              <h4>/ Rs 1,845,000</h4>

              <p>
                Outstanding balance of Rs 405,000 distributed
                across 3 delinquent & deferred doors.
              </p>
            </div>

            <div className="progress-circle">
              <div className="circle-inner">
                <b>78.1%</b>
                <span>Cleared</span>
              </div>
            </div>

          </div>

          <div className="collection-stats">

            <div>
              <span>Outstanding Due</span>
              <b className="red-value">Rs 405,000</b>
              <small>3 Units Pending</small>
            </div>

            <div>
              <span>Cleared Tenants</span>
              <b>15 of 18</b>
              <small>83.3% Door Compliance</small>
            </div>

            <div>
              <span>Avg Days to Pay</span>
              <b>2.4 Days</b>
              <small>↓ 0.8d vs Sept</small>
            </div>

          </div>

          <div className="settlement-section">
            <div className="settlement-labels">
              <span>Settlement Horizon</span>
              <b>Rs 1,440,000 Settled • Rs 405,000 Trailing</b>
            </div>

            <div className="settlement-bar">
              <span className="settled"></span>
              <span className="trailing"></span>
            </div>
          </div>

        </div>

        {/* QUICK COLLECTION ACTIONS */}
        <div className="quick-actions-card">

          <div className="quick-heading">
            <div className="quick-icon">ϟ</div>

            <div>
              <h2>1-Tap Direct Triggers</h2>
              <p>Priority Dispatch & Collection Actions</p>
            </div>

            <span className="immediate-pill">Immediate</span>
          </div>

          <p className="quick-description">
            Accelerate recovery — trigger immediate client touches
            or create friction-free digital payment hubs instantly.
          </p>

          <div className="trigger-list">

            <button
              className="trigger-item"
              onClick={() =>
                showAction("WhatsApp reminder dispatch initiated.")
              }
            >
              <span className="trigger-icon whatsapp-icon">▤</span>
              <span>
                <b>Broadcast WhatsApp Due Reminders</b>
                <small>
                  Dispatches personalized payment links to all
                  3 unpaid doors.
                </small>
              </span>
              <span className="trigger-arrow">›</span>
            </button>

            <button
              className="trigger-item"
              onClick={() =>
                showAction("Sample property QR payment hub generated.")
              }
            >
              <span className="trigger-icon qr-icon">▦</span>
              <span>
                <b>Instant QR for Sunset Heights Lobby</b>
                <small>
                  Generates dynamic display kiosk QR for counter payments.
                </small>
              </span>
              <span className="trigger-arrow">›</span>
            </button>

            <button
              className="trigger-item"
              onClick={() =>
                showAction("Cash handover record opened.")
              }
            >
              <span className="trigger-icon cash-icon">▣</span>
              <span>
                <b>Record Direct Cash Handover</b>
                <small>
                  Log physical currency with dual digital signature receipt.
                </small>
              </span>
              <span className="trigger-arrow">›</span>
            </button>

          </div>

          <div className="verification-row">
            <span>
              ♢ Rast Direct Ledger Verification Enabled
            </span>
            <b>3 tenants flagged</b>
          </div>

        </div>

      </section>

      {/* LOWER GRID */}
      <section className="executive-bottom-grid">

        {/* MAINTENANCE FEED */}
        <div className="maintenance-card">

          <div className="maintenance-header">

            <div className="maintenance-title">
              <span className="maintenance-main-icon">♧</span>

              <div>
                <h2>Urgent Property & Maintenance Feed</h2>
                <p>
                  {maintenance.length} Items Requiring Operational Resolution
                </p>
              </div>
            </div>

            <button
              className="view-logs"
              onClick={() => setShowLogs(!showLogs)}
            >
              {showLogs ? "Hide Logs" : "View All Logs"} →
            </button>

          </div>

          {maintenance.length > 0 ? (
            maintenance.map((item) => (

              <div className="maintenance-item" key={item.id}>

                <div className="maintenance-alert-icon">
                  ⚒
                </div>

                <div className="maintenance-details">

                  <span className="priority-tag">
                    {item.priority}
                  </span>

                  <h3>
                    {item.unit} • {item.property}
                  </h3>

                  <small>◷ {item.time}</small>

                  <p>{item.title}</p>
                  <p>{item.description}</p>

                  <span className="attachment-info">
                    ▫ {item.attachment}
                  </span>

                  {showLogs && (
                    <div className="maintenance-log">
                      Request ID: MAINT-{item.id}00
                      <br />
                      Status: Awaiting operational resolution
                    </div>
                  )}

                </div>

                <button
                  className="dispatch-plumber"
                  onClick={() => dispatchPlumber(item.id)}
                >
                  ⚒ Dispatch Plumber
                </button>

              </div>

            ))
          ) : (
            <div className="no-maintenance">
              No pending maintenance requests.
            </div>
          )}

        </div>

        {/* PROPERTY CARD */}
        <aside className="property-column">

          <div className="property-card">

            <div className="property-image">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
                alt="Modern residential property"
              />

              <div className="property-overlay">

                <span>PRIMARY ASSET</span>

                <h2>Sunset Heights • Tower A</h2>

                <small>12 Units</small>

              </div>
            </div>

            <div className="property-metrics">

              <div>
                <span>Occupancy Velocity</span>
                <b>94.4%</b>
                <small>Stable</small>
              </div>

              <div>
                <span>Maintenance Score</span>
                <b>9.2 / 10</b>
                <small>Excellent Health</small>
              </div>

            </div>

          </div>

        </aside>

      </section>

      {/* NOTIFICATION */}
      {notification && (
        <div className="executive-toast">
          ✓ {notification}
        </div>
      )}

    </div>
  );
}
