import { useState } from "react";
import {
  Building2,
  Camera,
  Check,
  Clock3,
  Download,
  FileText,
  MapPin,
  MessageSquare,
  Printer,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import "./monthlyinvoice.css";

// Photo public/images/ folder mein rakho, ya import karke yahan lagao
const METER_IMAGE = "/images/sub-meter.jpg";

const invoiceItems = [
  {
    title: "Base Apartment Lease Rental",
    description: "Fixed Monthly Primary Occupancy Fee (Apartment 402, 1,450 sqft)",
    category: "Fixed Contract",
    rate: "1 Month flat",
    amount: "Rs 120,000",
  },
  {
    title: "Sub-Meter Electricity Consumption",
    description: "412.00 kWh consumed @ Rs 67.96/unit sub-tariff (IESCO reading verified)",
    category: "Metered Electric",
    rate: "412 kWh @ Rs 67.96",
    amount: "Rs 28,000",
  },
  {
    title: "Water Tanker Shared Syndicate Quota",
    description: "Commercial pressurized bowser dispatch (1/6th apartment equity allocation)",
    category: "Syndicate Share",
    rate: "1/6 Bowser split",
    amount: "Rs 6,000",
  },
  {
    title: "Dedicated High-Speed Fiber Internet",
    description: "50 Mbps dedicated fiber uplink (Uncapped SLA connection)",
    category: "Fixed ISP",
    rate: "30 Days unmetered",
    amount: "Rs 3,500",
  },
];

function InfoCard({ label, icon: Icon, children, className = "" }) {
  return (
    <section className={`info-card ${className}`}>
      <div className="info-card-heading">
        <span>{label}</span>
        <span className="icon-tile">
          <Icon size={15} />
        </span>
      </div>
      {children}
    </section>
  );
}

function MeterPhoto({ src }) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className="meter-visual">
      {failed ? (
        <div className="meter-visual__placeholder">
          <Camera size={22} />
          <span>Meter photo not available</span>
        </div>
      ) : (
        <img
          className="meter-visual__image"
          src={src}
          alt="Sub-meter reading photo, Meter ID 04921"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}

      <div className="meter-caption">
        <span>Meter ID: #04921</span>
        <span>Oct 28 · 09:14 PKT</span>
      </div>
    </div>
  );
}

function InvoiceDashboard() {
  return (
    <div className="dashboard">
      <main className="page-content">
        <section className="invoice-heading">
          <div>
            <div className="heading-kicker">Tenant billing statement</div>
            <h1>Invoice #INV-2024-NOV-402</h1>
            <span className="payment-status">
              <span /> Unpaid / Pending settlement
            </span>
            <div className="invoice-meta">
              <span>Issued: Oct 29, 2024</span>
              <i />
              <span>Due: Nov 05, 2024</span>
              <i />
              <span>Tenancy Unit: Apt 402</span>
            </div>
          </div>

          <div className="action-buttons">
            <div className="action-row">
              <button type="button" className="secondary-button">
                <MessageSquare size={15} />
                Share WhatsApp
              </button>
              <button type="button" className="secondary-button">
                <Printer size={15} />
                Print
              </button>
            </div>
            <button type="button" className="download-button">
              <Download size={15} />
              Download PDF Bill
            </button>
          </div>
        </section>

        <section className="grace-banner">
          <div className="hourglass" aria-hidden="true">⌛</div>
          <div className="grace-copy">
            <strong>Standard Clearance Window</strong>
            <span>
              Grace cutoff without surcharge ends strictly on{" "}
              <b>Nov 10, 2024 (23:59 PKT).</b> Late penalty of Rs 5,000 will
              apply thereafter.
            </span>
          </div>
          <div className="countdown">
            <Clock3 size={15} />
            <span>
              <b>Countdown</b>
              <strong>06d 12h 58m 27s</strong>
            </span>
          </div>
        </section>

        <section className="summary-grid">
          <InfoCard label="Premises unit" icon={Building2}>
            <h2>Sunset Heights</h2>
            <p>Apartment 402, Floor 4</p>
            <div className="card-footer">
              <MapPin size={13} />
              Zone: Gulberg Greens, Sector D
            </div>
          </InfoCard>

          <InfoCard label="Landlord entity" icon={Building2}>
            <h2>Malik Tariq Estates</h2>
            <p>NTN/Reg: PK-LHR-2024</p>
            <div className="card-footer">
              <ShieldCheck size={13} />
              Authorized Officer: Malik Tariq
            </div>
          </InfoCard>

          <InfoCard label="Lease reference" icon={FileText}>
            <h2>SH-APT-402-2024</h2>
            <p>24M Bonded Tenancy</p>
            <div className="card-footer lease-footer">
              <span><span className="status-dot" /> Active Contract</span>
              <b>Cycle 11 of 24</b>
            </div>
          </InfoCard>
        </section>

        <section className="details-grid">
          <section className="settlement-card">
            <div className="settlement-header">
              <h2><Wallet size={17} /> Itemized account settlement</h2>
              <div className="table-tags">
                <span>Currency: PKR (Rs)</span>
                <span>{invoiceItems.length} line items</span>
              </div>
            </div>

            <div className="invoice-table-wrap">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th scope="col">Description &amp; sub-tariff</th>
                    <th scope="col">Billing category</th>
                    <th scope="col">Allocation rate</th>
                    <th scope="col">Subtotal (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item) => (
                    <tr key={item.title}>
                      <td className="description-cell">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </td>
                      <td data-label="Category">
                        <span
                          className={`category-tag ${item.category
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td data-label="Rate">{item.rate}</td>
                      <td className="amount-cell" data-label="Subtotal">
                        {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="settlement-total">
              <span>Invoice total</span>
              <strong>Rs 157,500</strong>
            </div>
          </section>

          <aside className="invoice-aside">
            <section className="meter-card">
              <div className="side-card-heading">
                <div>
                  <Zap size={17} />
                  <h2>Sub-Meter<br />Reading Log</h2>
                </div>
                <span className="meter-tag">IESCO Line #402</span>
              </div>

              <MeterPhoto src={METER_IMAGE} />

              <div className="reading-details">
                <div><span>Previous Index (Sep 28)</span><b>4,081 kWh</b></div>
                <div><span>Current Index (Oct 28)</span><b>4,921 kWh</b></div>
                <div className="consumption-row">
                  <span>Billing Consumption Delta</span>
                  <b>412.00 kWh</b>
                </div>
              </div>

              <p className="meter-note">
                Sub-meter reading recorded and logged in compliance with building
                management standards.
              </p>
            </section>

            <section className="clearing-card">
              <div className="clearing-icon"><Check size={17} /></div>
              <div>
                <h2>Clearing instructions</h2>
                <p>Payment is due by Nov 05, 2024.</p>
              </div>
              <span className="fee-badge">0% fee<br />before cutoff</span>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default InvoiceDashboard;