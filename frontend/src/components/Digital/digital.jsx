import { useState } from "react";
import {
  ShieldCheck, Stamp, FileText, CalendarDays, Wallet, Building2, Briefcase,
  CheckCircle2, Eye, EyeOff, MapPin, Image as ImageIcon, ZoomIn, ZoomOut,
  Maximize2, Minimize2, Smartphone, Landmark, Phone, Scale, FileSignature,
  ChevronLeft, ChevronRight, ScrollText,
} from "lucide-react";
import "./digital.css";

const CNIC_FULL = "35201-1234567-1";
const CNIC_MASKED = "35201-••••442-1";

const CLAUSES = [
  {
    title: "PREMISE DEMISE & INCLUSIONS",
    body: (
      <>
        The Landlord agrees to demise and let unto the Tenant, and the Tenant agrees to hire
        Apartment No. 402, located on the 4th Floor, Sunset Heights, Gulberg III, Lahore,
        together with one (1) designated underground parking bay (#B-12) and shared
        residential amenities.
      </>
    ),
  },
  {
    title: "TERM & CONTINUATION",
    body: (
      <>
        The tenancy shall subsist for a fixed duration of <strong>24 contractual months</strong>,
        commencing on <strong>November 01, 2023</strong> and expiring without further notice on{" "}
        <strong>October 31, 2025</strong>, subject to renewal terms mutualized under Section 9.
      </>
    ),
  },
  {
    title: "RENT & PAYMENT SCHEDULE",
    body: (
      <>
        The Tenant shall pay a monthly rent of <strong>PKR 120,000</strong> on or before the 1st
        day of each calendar month through Raast, IBFT or verified cash receipt. Rent shall remain
        fixed for the entire term unless varied by written mutual consent.
      </>
    ),
  },
  {
    title: "SEGREGATED ESCROW DEPOSIT",
    body: (
      <>
        A security deposit of <strong>PKR 320,000</strong> (equivalent to two months' rent) shall be
        held in a ring-fenced escrow account at Habib Bank Limited and released within thirty (30)
        days of lawful vacation, less verified damages.
      </>
    ),
  },
  {
    title: "UTILITIES & MAINTENANCE",
    body: (
      <>
        The Tenant shall bear electricity, gas, water and internet charges as per sub-meter
        readings. Structural repairs remain the responsibility of the Landlord; routine upkeep
        shall be borne by the Tenant.
      </>
    ),
  },
];

const StatCard = ({ label, icon: Icon, tone, children }) => (
  <article className="tv-stat">
    <header className="tv-stat__head">
      <span className="tv-stat__label">{label}</span>
      <span className={`tv-stat__icon tv-stat__icon--${tone}`}><Icon size={18} /></span>
    </header>
    {children}
  </article>
);

const TenantVault = () => {
  const [revealed, setRevealed] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [full, setFull] = useState(false);
  const [page, setPage] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 140));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 70));

  return (
    <main className="tv">
      {/* ================= HEADER ================= */}
      <header className="tv-hero">
        <div className="tv-hero__main">
          <h1 className="tv-hero__title">Tenant Vault &amp; Digital Tenancy Agreement</h1>

          <span className="tv-hero__badge">Official Record</span>

          <p className="tv-hero__meta">
            <span className="tv-hero__meta-item">
              <ScrollText size={14} /> Reg ID: PK-LHR-2023-APT402-9921B
            </span>
            <span className="tv-hero__dot" />
            <span>Registered with Directorate of Rent Tribunals, Lahore</span>
          </p>
          <p className="tv-hero__meta">Punjab Rented Premises Act 2009 Compliant</p>
        </div>

        <div className="tv-hero__side">
          <div className="tv-hero__chips">
            <div className="tv-chip">
              <ShieldCheck size={20} className="tv-chip__icon" />
              <div className="tv-chip__text">
                <span className="tv-chip__label">NADRA E-KYC</span>
                <strong className="tv-chip__value">Biometric Level 3</strong>
              </div>
            </div>
            <div className="tv-chip tv-chip--amber">
              <Stamp size={20} className="tv-chip__icon" />
              <div className="tv-chip__text">
                <span className="tv-chip__label">E-Stamp Lahore</span>
                <strong className="tv-chip__value">Cert #EST-40291-C</strong>
              </div>
            </div>
          </div>
          <span className="tv-hero__status">
            <span className="tv-hero__pulse" /> Lease Active (Mo 12/24)
          </span>
        </div>
      </header>

      {/* ================= STATS ================= */}
      <section className="tv-stats">
        <StatCard label="Lease Term Window" icon={CalendarDays} tone="blue">
          <strong className="tv-stat__value">24 Months</strong>
          <div className="tv-stat__foot">
            <span>Nov 01, 2023 – Oct 31, 2025</span>
            <b className="tv-stat__note">12 Mo Left</b>
          </div>
        </StatCard>

        <StatCard label="Contracted Base Rent" icon={Wallet} tone="blue">
          <strong className="tv-stat__value tv-stat__value--teal">
            Rs 120,000 <small>/ mo</small>
          </strong>
          <div className="tv-stat__foot">
            <span>Due 1st of every month</span>
            <b className="tv-stat__note">0% Variance</b>
          </div>
        </StatCard>

        <StatCard label="Segregated Escrow Deposit" icon={ShieldCheck} tone="amber">
          <strong className="tv-stat__value tv-stat__value--amber">
            Rs 320,000 <small>(2 Mos)</small>
          </strong>
          <div className="tv-stat__foot">
            <span>Habib Bank Limited</span>
            <b className="tv-stat__note tv-stat__note--teal">Ring-Fenced</b>
          </div>
        </StatCard>

        <StatCard label="Lessor Entity" icon={Building2} tone="indigo">
          <strong className="tv-stat__value tv-stat__value--name">Malik Tariq Estates</strong>
          <div className="tv-stat__foot">
            <span>Emerg: +92 300 5550192</span>
            <a className="tv-stat__call" href="tel:+923005550192">
              <Phone size={12} /> Call
            </a>
          </div>
        </StatCard>
      </section>

      {/* ================= MAIN GRID ================= */}
      <section className="tv-grid">
        {/* ---------- Registry ---------- */}
        <aside className="tv-registry">
          <header className="tv-registry__head">
            <span className="tv-registry__icon"><Briefcase size={20} /></span>
            <h2 className="tv-registry__title">Primary Tenant Registry</h2>
            <span className="tv-registry__tier">Tier-1 Sovereign</span>
          </header>

          <div className="tv-person">
            <span className="tv-person__avatar">HT</span>
            <div className="tv-person__info">
              <strong className="tv-person__name">
                Hamza Tariq
                <span className="tv-person__verified"><CheckCircle2 size={14} /> Verified</span>
              </strong>
              <span className="tv-person__role">Lead Leaseholder • Sunset Heights Apt 402</span>
              <span className="tv-person__since">Tenancy Inception: 01 Nov 2023</span>
            </div>
          </div>

          <div className="tv-cnic">
            <div className="tv-cnic__top">
              <span className="tv-label">CNIC (National ID Card)</span>
              <button
                type="button"
                className="tv-cnic__reveal"
                onClick={() => setRevealed((r) => !r)}
                aria-pressed={revealed}
              >
                {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
                {revealed ? "Hide Digits" : "Reveal Digits"}
              </button>
            </div>

            <div className="tv-cnic__row">
              <strong className="tv-cnic__number">{revealed ? CNIC_FULL : CNIC_MASKED}</strong>
              <span className="tv-cnic__valid"><ShieldCheck size={13} /> NADRA Validated</span>
            </div>

            <p className="tv-cnic__address">
              <MapPin size={14} />
              Permanent Domicile: Model Town, Sector G, Lahore, Punjab
            </p>

            <div className="tv-cnic__files">
              {[
                { side: "CNIC Front", file: "Specimen_Front_HT.pdf" },
                { side: "CNIC Reverse", file: "Specimen_Back_HT.pdf" },
              ].map((f) => (
                <figure key={f.side} className="tv-file">
                  <figcaption className="tv-file__top">
                    <span className="tv-label">{f.side}</span>
                    <ZoomIn size={13} className="tv-file__zoom" />
                  </figcaption>
                  <div className="tv-file__preview"><ImageIcon size={26} /></div>
                  <span className="tv-file__name">{f.file}</span>
                </figure>
              ))}
            </div>
          </div>

          <div className="tv-channels">
            <span className="tv-label">Direct Communication Channels</span>
            <div className="tv-channels__row">
              <span className="tv-channels__icon"><Smartphone size={18} /></span>
              <div className="tv-channels__text">
                <strong>+92 321 9920145</strong>
                <span>Cellular &amp; WhatsApp Verified</span>
              </div>
              <span className="tv-channels__otp">OTP 2FA Active</span>
            </div>
          </div>

          <div className="tv-guarantor">
            <span className="tv-label">Legal Guarantor Bond</span>
            <div className="tv-guarantor__row">
              <span className="tv-guarantor__icon"><Scale size={18} /></span>
              <div className="tv-guarantor__text">
                <strong>Asif Tariq (Father)</strong>
                <span>Surety • Bond Value Rs 1,440,000</span>
              </div>
              <span className="tv-guarantor__status">Active</span>
            </div>
          </div>
        </aside>

        {/* ---------- Document viewer ---------- */}
        <section className={`tv-viewer ${full ? "tv-viewer--full" : ""}`}>
          <header className="tv-viewer__bar">
            <span className="tv-viewer__file">
              <FileText size={16} />
              <span className="tv-viewer__file-name">
                Legally Binding Counterpart • RESIDENTIAL LEASE
              </span>
            </span>

            <div className="tv-viewer__tools">
              <div className="tv-viewer__pager">
                <button
                  type="button"
                  className="tv-viewer__btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="tv-viewer__page">Page {page} of 8</span>
                <button
                  type="button"
                  className="tv-viewer__btn"
                  onClick={() => setPage((p) => Math.min(8, p + 1))}
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <button type="button" className="tv-viewer__btn" onClick={zoomIn} aria-label="Zoom in">
                <ZoomIn size={16} />
              </button>
              <button type="button" className="tv-viewer__btn" onClick={zoomOut} aria-label="Zoom out">
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                className="tv-viewer__btn"
                onClick={() => setFull((f) => !f)}
                aria-label="Toggle fullscreen"
              >
                {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </header>

          <div className="tv-viewer__stage">
            <article className="tv-paper" style={{ "--tv-zoom": zoom / 100 }}>
              <div className="tv-stamp">
                <span className="tv-stamp__icon"><Landmark size={26} /></span>
                <div className="tv-stamp__text">
                  <span className="tv-stamp__gov">Government of Punjab • E-Stamping System</span>
                  <strong className="tv-stamp__no">Stamp Certificate No: PB-LHR-2023-99810243</strong>
                  <span className="tv-stamp__duty">
                    Stamp Duty Paid: PKR 4,800 • Non-Judicial Legal Instrument
                  </span>
                </div>
                <span className="tv-stamp__valid">Valid &amp; Verified</span>
              </div>

              <h2 className="tv-paper__title">RESIDENTIAL TENANCY AGREEMENT</h2>
              <p className="tv-paper__sub">
                Sunset Heights Residential Condominium — Apartment 402
              </p>

              <p className="tv-paper__intro">
                Executed on this 1st day of November 2023 at Lahore, under the jurisdiction of the
                Punjab Rented Premises Act 2009, between <strong>Malik Tariq Estates</strong>{" "}
                (hereinafter called the Lessor/Landlord) and <strong>Hamza Tariq</strong>{" "}
                (hereinafter called the Lessee/Tenant).
              </p>

              <ol className="tv-clauses">
                {CLAUSES.map((c, i) => (
                  <li key={c.title} className="tv-clause">
                    <h3 className="tv-clause__title">
                      <span className="tv-clause__no">{i + 1}.</span> {c.title}
                    </h3>
                    <p className="tv-clause__body">{c.body}</p>
                  </li>
                ))}
              </ol>

              <div className="tv-sign">
                <div className="tv-sign__box">
                  <FileSignature size={18} />
                  <strong>Hamza Tariq</strong>
                  <span>Lessee • Biometric + OTP</span>
                </div>
                <div className="tv-sign__box">
                  <FileSignature size={18} />
                  <strong>Malik Tariq Estates</strong>
                  <span>Lessor • Digital Signature</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
};

export default TenantVault;