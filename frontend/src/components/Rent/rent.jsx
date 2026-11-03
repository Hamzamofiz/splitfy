import { useState } from "react";
import {
  Banknote,
  CalendarX2,
  Check,
  CheckCheck,
  Clock3,
  Gavel,
  MessageSquare,
  Paperclip,
  ReceiptText,
  RefreshCw,
  Send,
  ShieldCheck,
  X,
  Award,
} from "lucide-react";
import "./rent.css";

const REF = "EXT-2024-NOV-402";
const INVOICE_TOTAL = 160000;
const PENALTY = 5000;
const UPFRONT_RATE = 0.3;
const NOTE_LIMIT = 240;

const formatPKR = (n) => `Rs ${n.toLocaleString("en-US")}`;

const REASONS = [
  {
    id: "salary",
    title: "Delayed Salary / Client Payout",
    text: "Awaiting professional remittance or monthly corporate payroll disbursement.",
  },
  {
    id: "bank",
    title: "Interbank Transfer Hold",
    text: "Funds transacted but subject to automated clearing or weekend processing lag.",
  },
  {
    id: "medical",
    title: "Medical / Urgent Family Need",
    text: "Unforeseen capital redirection with immediate resolution scheduled.",
  },
  {
    id: "academic",
    title: "Academic / Bursary Grant Hold",
    text: "Institutional disbursement awaiting final bursar clearance cycle.",
  },
];

const DATES = [
  { id: "d3", offset: "+3 Days", label: "Nov 08", weekday: "Friday" },
  { id: "d7", offset: "+7 Days", label: "Nov 12", weekday: "Tuesday, 2024", optimal: true },
  { id: "d10", offset: "+10 Days", label: "Nov 15", weekday: "Friday" },
  { id: "d14", offset: "+14 Days Max", label: "Nov 19", weekday: "Tuesday" },
];

const HISTORY = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

function StatCard({ label, value, valueTone, note, noteTone = "muted", noteIcon: NoteIcon, icon: Icon }) {
  return (
    <article className="deferment__stat">
      <div className="deferment__stat-body">
        <span className="deferment__stat-label">{label}</span>
        <strong className={`deferment__stat-value ${valueTone ? `deferment__stat-value--${valueTone}` : ""}`}>
          {value}
        </strong>
        <span className={`deferment__stat-note deferment__stat-note--${noteTone}`}>
          {NoteIcon && <NoteIcon size={11} />}
          {note}
        </span>
      </div>
      <span className="deferment__stat-icon">
        <Icon size={16} />
      </span>
    </article>
  );
}

function PanelHead({ step, title, aside }) {
  return (
    <header className="deferment__panel-head">
      <h2 className="deferment__panel-title">
        <span className="deferment__step">{step}</span>
        {title}
      </h2>
      {aside && <span className="deferment__panel-aside">{aside}</span>}
    </header>
  );
}

export default function RentDeferment({
  tenant = { name: "Hamza Tariq" },
  landlord = { name: "Malik Tariq" },
  onSubmit,
}) {
  const [reason, setReason] = useState("salary");
  const [dateId, setDateId] = useState("d7");
  const [upfront, setUpfront] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedReason = REASONS.find((r) => r.id === reason);
  const selectedDate = DATES.find((d) => d.id === dateId);
  const upfrontAmount = INVOICE_TOTAL * UPFRONT_RATE;
  const remaining = INVOICE_TOTAL - upfrontAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitted(true);
    if (onSubmit) {
      onSubmit({
        ref: REF,
        reason,
        targetDate: selectedDate.label,
        upfront: upfront ? upfrontAmount : 0,
        note: note.trim(),
        fileName: file ? file.name : null,
      });
    }
  };

  return (
    <div className="deferment">
      <div className="deferment__container">
        {/* Header */}
        <header className="deferment__header">
          <div className="deferment__title-wrap">
            <div className="deferment__tags">
              <span className="deferment__tag deferment__tag--blue">
                Tenancy Apt 402 • Ref: {REF}
              </span>
              <span className="deferment__tag deferment__tag--teal">
                <ShieldCheck size={11} /> Standing: Grade A
              </span>
            </div>
            <h1 className="deferment__title">Request Rent Deferment &amp; Grace Period</h1>
            <p className="deferment__subtitle">
              Formal tenancy ledger modification for Apartment 402, Sunset Heights.
            </p>
          </div>

          <div className="deferment__chips">
            <span className="deferment__chip">
              <Clock3 size={13} /> Grace Window: 14 Days Max
            </span>
            <span className="deferment__chip deferment__chip--peach">
              <Check size={13} /> Zero Late Penalty Active
            </span>
          </div>
        </header>

        {/* Stats */}
        <section className="deferment__stats" aria-label="Billing summary">
          <StatCard
            label="Scheduled due"
            value="Nov 05, 2024"
            note="Cycle Closes in 48h"
            noteTone="danger"
            noteIcon={Clock3}
            icon={CalendarX2}
          />
          <StatCard
            label="Total invoice"
            value={formatPKR(INVOICE_TOTAL)}
            note="Single-Unit Lease Ledger"
            icon={ReceiptText}
          />
          <StatCard
            label="Penalty exposure"
            value={formatPKR(PENALTY)}
            valueTone="amber"
            note="100% Waivable upon approval"
            noteTone="teal"
            noteIcon={Check}
            icon={Gavel}
          />
        </section>

        {/* Reliability */}
        <section className="deferment__reliability">
          <div className="deferment__grade">
            <span className="deferment__grade-icon">
              <Award size={18} />
            </span>
            <div>
              <h2 className="deferment__grade-title">
                Grade A Reliable <span className="deferment__score">5 / 5 Score</span>
              </h2>
              <p className="deferment__grade-text">
                Eligible for up to 14 days emergency extension with complete statutory late fee waiver.
              </p>
            </div>
          </div>

          <div className="deferment__history">
            <p className="deferment__history-title">
              Past 6-Month Settlement: <b>100% On-Time (6/6 Clear)</b>
            </p>
            <ul className="deferment__months">
              {HISTORY.map((m) => (
                <li key={m} className="deferment__month">
                  <span className="deferment__month-label">{m}</span>
                  <span className="deferment__month-dot">
                    <Check size={11} strokeWidth={3} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <form className="deferment__layout" onSubmit={handleSubmit}>
          {/* Left column */}
          <div className="deferment__main">
            {/* Step 1 */}
            <section className="deferment__panel">
              <PanelHead step={1} title="Primary Reason for Deferment" aside="Required field" />
              <div className="deferment__reasons" role="radiogroup" aria-label="Primary reason for deferment">
                {REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`deferment__reason ${reason === r.id ? "deferment__reason--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                    />
                    <span>
                      <strong>{r.title}</strong>
                      <small>{r.text}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Step 2 */}
            <section className="deferment__panel">
              <PanelHead step={2} title="Proposed Target Payment Date" aside="Standard Due: Nov 05, 2024" />
              <div className="deferment__dates" role="radiogroup" aria-label="Proposed target payment date">
                {DATES.map((d) => (
                  <label
                    key={d.id}
                    className={`deferment__date ${dateId === d.id ? "deferment__date--active" : ""}`}
                  >
                    <input
                      className="deferment__sr"
                      type="radio"
                      name="date"
                      value={d.id}
                      checked={dateId === d.id}
                      onChange={() => setDateId(d.id)}
                    />
                    {d.optimal && <span className="deferment__ribbon">Optimal</span>}
                    <span className="deferment__date-offset">{d.offset}</span>
                    <strong className="deferment__date-day">{d.label}</strong>
                    <span className="deferment__date-week">{d.weekday}</span>
                  </label>
                ))}
              </div>

              <div className="deferment__upfront">
                <span className="deferment__upfront-icon">
                  <Banknote size={15} />
                </span>
                <div className="deferment__upfront-copy">
                  <div className="deferment__upfront-title">
                    <strong>30% Upfront Commitment sum</strong>
                    <span className="deferment__badge">Accelerated trust</span>
                  </div>
                  <small>
                    Pay {formatPKR(upfrontAmount)} today, remaining {formatPKR(remaining)} by{" "}
                    {selectedDate.label}.
                  </small>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={upfront}
                  aria-label="Add 30% upfront commitment"
                  className="deferment__switch"
                  onClick={() => setUpfront((v) => !v)}
                />
              </div>
            </section>

            {/* Step 3 */}
            <section className="deferment__panel">
              <PanelHead step={3} title="Additional Context" aside="Optional" />
              <textarea
                className="deferment__textarea"
                value={note}
                maxLength={NOTE_LIMIT}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a short note for your landlord, e.g. expected payout date."
                aria-label="Additional context for landlord"
              />
              <div className="deferment__note-foot">
                <label className="deferment__attach">
                  <input
                    className="deferment__sr"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      setFile(e.target.files[0] || null);
                      e.target.value = "";
                    }}
                  />
                  <Paperclip size={13} /> Attach supporting document
                </label>

                {file && (
                  <span className="deferment__file">
                    <span className="deferment__file-name">{file.name}</span>
                    <button type="button" aria-label="Remove attachment" onClick={() => setFile(null)}>
                      <X size={11} />
                    </button>
                  </span>
                )}

                <span className="deferment__count">
                  {note.length}/{NOTE_LIMIT}
                </span>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className="deferment__aside">
            <section className="deferment__card">
              <header className="deferment__card-head">
                <ShieldCheck size={17} />
                <h2>Sunset Heights Tenancy Policy</h2>
              </header>

              <ul className="deferment__policy">
                <li>
                  <Clock3 size={14} />
                  <span>Standard 14-Day Grace Period under Sunset Heights Tenancy Agreement.</span>
                </li>
                <li>
                  <Banknote size={14} />
                  <span>
                    Late surcharge of <b>{formatPKR(PENALTY)} completely waived</b> upon confirmed{" "}
                    {selectedDate.label} clearance.
                  </span>
                </li>
                <li>
                  <MessageSquare size={14} />
                  <span>
                    Instant synchronized push to Landlord {landlord.name}'s verified WhatsApp dispatch channel.
                  </span>
                </li>
                <li>
                  <RefreshCw size={14} />
                  <span>Payment ledger updates automatically once transaction receipts are verified.</span>
                </li>
              </ul>

              <div className="deferment__savings">
                <span>Estimated net savings</span>
                <b>
                  {formatPKR(PENALTY)} <small>Late Surcharge</small>
                </b>
              </div>
            </section>

            <section className="deferment__card">
              <header className="deferment__preview-head">
                <span>
                  <i className="deferment__live" /> Landlord dispatch preview
                </span>
                <span>WhatsApp Cloud</span>
              </header>

              <div className="deferment__chat">
                <div className="deferment__chat-bar">
                  <span className="deferment__chat-avatar">SE</span>
                  <div>
                    <strong>Sunset Estates Bot</strong>
                    <small>Business account</small>
                  </div>
                </div>

                <div className="deferment__chat-body">
                  <div className="deferment__bubble">
                    <p>
                      <b>Rent deferment request</b> · Apt 402
                    </p>
                    <p>
                      {tenant.name} requests to move the {formatPKR(INVOICE_TOTAL)} due on Nov 05 to{" "}
                      <b>{selectedDate.label}</b>.
                    </p>
                    <p>Reason: {selectedReason.title}</p>
                    {upfront && (
                      <p>
                        Upfront today: <b>{formatPKR(upfrontAmount)}</b>
                      </p>
                    )}
                    {note.trim() && <p className="deferment__bubble-note">Note: {note.trim()}</p>}
                    <p>Ref: {REF}</p>
                    <span className="deferment__bubble-time">
                      09:41 <CheckCheck size={12} />
                    </span>
                  </div>

                  <div className="deferment__quick">
                    <span>Approve</span>
                    <span>Decline</span>
                  </div>
                </div>
              </div>
            </section>
          </aside>

          {/* Submit bar */}
          <footer className="deferment__submit">
            {submitted ? (
              <div className="deferment__success" role="status">
                <span className="deferment__success-icon">
                  <Check size={16} />
                </span>
                <div>
                  <strong>Request sent to {landlord.name}</strong>
                  <small>Ref {REF} · You will get a WhatsApp update once it is reviewed.</small>
                </div>
                <button type="button" className="deferment__link" onClick={() => setSubmitted(false)}>
                  Edit request
                </button>
              </div>
            ) : (
              <>
                <dl className="deferment__summary">
                  <div>
                    <dt>Reason</dt>
                    <dd>{selectedReason.title}</dd>
                  </div>
                  <div>
                    <dt>New due date</dt>
                    <dd>{selectedDate.label}, 2024</dd>
                  </div>
                  <div>
                    <dt>Upfront today</dt>
                    <dd>{upfront ? formatPKR(upfrontAmount) : "None"}</dd>
                  </div>
                  <div>
                    <dt>Late fee</dt>
                    <dd className="deferment__ok">
                      Rs 0 <s>{formatPKR(PENALTY)}</s>
                    </dd>
                  </div>
                </dl>

                <div className="deferment__actions">
                  <label className="deferment__agree">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    <span>
                      I confirm these details are accurate and I will settle by {selectedDate.label}.
                    </span>
                  </label>
                  <button type="submit" className="deferment__button" disabled={!agreed}>
                    <Send size={14} /> Send request to landlord
                  </button>
                </div>
              </>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}