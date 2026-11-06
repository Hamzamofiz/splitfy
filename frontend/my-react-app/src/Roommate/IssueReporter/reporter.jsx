
import React, { useState } from "react";
import {
  Snowflake, Hammer, Zap, DoorClosed, Bug, Brush,
  ShieldCheck, Info, UserRound, MessageCircle,
  Clock, History, Building2, ChevronDown,
  FileText, Camera, Upload, X, Send, Phone,
  AlertTriangle, CheckCircle, Image, MapPin
} from "lucide-react";

import "./reporter.css";

const categories = [
  { name: "AC / Cooling", sub: "Priority Unit", icon: Snowflake },
  { name: "Plumbing & Taps", sub: "Pipes & Drains", icon: Hammer },
  { name: "Electrical", sub: "Circuits / Sockets", icon: Zap },
  { name: "Locks / Windows", sub: "Room Access", icon: DoorClosed },
  { name: "Pest Control", sub: "Hostel Suite", icon: Bug },
  { name: "Cleaning / Garbage", sub: "Disposal Log", icon: Brush }
];

const initialTickets = [
  {
    id: "#TKT-892",
    category: "Geyser Heating Element",
    title: "Geyser Heating Element Replacement",
    description: "Settlement split: Rs 140.00 split (Suite)",
    technician: "Bashir Sanitary",
    status: "Resolved & Billed",
    type: "resolved",
    time: "Past 30 Days"
  },
  {
    id: "#TKT-904",
    category: "Plumbing Line",
    title: "Kitchen Sink Drain Slow Flow",
    description: "Assigned: Bashir Sanitary",
    technician: "Bashir Sanitary",
    status: "Technician Dispatched",
    type: "progress",
    time: "Today / PM"
  }
];

function MaintenanceReporter() {
  const [category, setCategory] = useState("AC / Cooling");
  const [severity, setSeverity] = useState("High");
  const [area, setArea] = useState("Room B (Ensuite)");
  const [subject, setSubject] = useState(
    "Master Bathroom Geyser Thermostat Trip & AC Condenser Noise"
  );

  const [description, setDescription] = useState(
    "The water geyser in our ensuite bathroom trips the main circuit breaker after 10 minutes of operation. Also, the 1.5 ton split AC outdoor unit is making a rattling vibration sound."
  );

  const [files, setFiles] = useState([]);
  const [tickets, setTickets] = useState(initialTickets);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("30 Days");

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);

    const valid = selected.filter(file =>
      ["image/jpeg", "image/png", "image/webp", "video/mp4"].includes(file.type)
      && file.size <= 15 * 1024 * 1024
    );

    setFiles(prev => [...prev, ...valid].slice(0, 5));
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitReport = (e) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) return;

    const newTicket = {
      id: `#TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      title: subject,
      description: `${area} • ${severity} Priority`,
      technician: "Awaiting Assignment",
      status: "Pending Review",
      type: "pending",
      time: "Just Now"
    };

    setTickets(prev => [newTicket, ...prev]);
    setSubmitted(true);
  };

  const sendWhatsApp = (number) => {
    const message = encodeURIComponent(
      `Maintenance Request - Room 402\n\nCategory: ${category}\nIssue: ${subject}\nArea: ${area}\nSeverity: ${severity}\n\n${description}`
    );

    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const resetReport = () => {
    setSubmitted(false);
    setSubject("");
    setDescription("");
    setFiles([]);
  };

  return (
    <main className="maintenance-page">

      {/* HEADER */}

      <header className="maintenance-header">
        <div>
          <span className="maintenance-breadcrumb">
            <span /> ROOM 402 • RESIDENT MAINTENANCE & REPAIR
          </span>

          <h1>Maintenance Issue & Incident Reporter</h1>

          <p>
            Log hostel room damage, plumbing leaks, or electrical failures.
            Instantly dispatch work orders to property caretakers via WhatsApp.
          </p>
        </div>

        <div className="maintenance-dispatch-status">
          <ShieldCheck size={17} />
          <span>
            Suite 402 • Direct Caretaker
            <strong>Dispatch</strong>
          </span>
        </div>
      </header>

      {/* SAFETY NOTICE */}

      <div className="maintenance-notice">
        <div className="maintenance-notice-icon">
          <Info size={18} />
        </div>

        <div>
          <strong>Maintenance Notice</strong>
          <p>
            For gas leaks or sparking wiring, immediately shut the
            main valve outside Room 402 and call caretaker directly.
          </p>
        </div>

        <span className="maintenance-safety-tag">
          SAFETY REMINDER
        </span>
      </div>

      {/* MAIN GRID */}

      <div className="maintenance-grid">

        {/* LEFT COLUMN */}

        <section className="maintenance-left">

          <form
            className="maintenance-card maintenance-form"
            onSubmit={submitReport}
          >

            {/* CATEGORY */}

            <div className="maintenance-section-heading">
              <h2>Issue Category</h2>
              <span>Select standard incident type</span>
            </div>

            <div className="maintenance-categories">
              {categories.map(item => {
                const Icon = item.icon;

                return (
                  <button
                    type="button"
                    key={item.name}
                    className={
                      category === item.name
                        ? "maintenance-category selected"
                        : "maintenance-category"
                    }
                    onClick={() => setCategory(item.name)}
                  >
                    <Icon size={20} />
                    <strong>{item.name}</strong>
                    <small>{item.sub}</small>

                    {category === item.name && (
                      <span className="category-check" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* SUBJECT */}

            <div className="maintenance-field">
              <label>ISSUE SUBJECT</label>

              <div className="maintenance-input">
                <FileText size={15} />

                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Enter incident subject..."
                  required
                />
              </div>
            </div>

            {/* SEVERITY AND AREA */}

            <div className="maintenance-two-fields">

              <div className="maintenance-field">
                <label>SEVERITY RATING</label>

                <div className="severity-options">
                  {["Low", "Medium", "High"].map(level => (
                    <button
                      type="button"
                      key={level}
                      className={
                        severity === level
                          ? `severity-button ${level.toLowerCase()} active`
                          : "severity-button"
                      }
                      onClick={() => setSeverity(level)}
                    >
                      {level}
                      {level === "High" && <small>(Urgent)</small>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="maintenance-field">
                <label>INCIDENT AREA</label>

                <div className="maintenance-input">
                  <Building2 size={15} />

                  <select
                    value={area}
                    onChange={e => setArea(e.target.value)}
                  >
                    <option>Room B (Ensuite)</option>
                    <option>Room A (Master)</option>
                    <option>Shared Kitchen</option>
                    <option>Common Bathroom</option>
                    <option>Hostel Corridor</option>
                    <option>Electrical Panel</option>
                    <option>Water Tank Area</option>
                  </select>

                  <ChevronDown size={13} />
                </div>
              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="maintenance-field">
              <div className="maintenance-label-row">
                <label>DETAILED INCIDENT DESCRIPTION</label>

                <span>
                  {description.length} chars entered
                </span>
              </div>

              <textarea
                rows="5"
                maxLength={1000}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the maintenance problem in detail..."
                required
              />
            </div>

            {/* FILE UPLOAD */}

            <div className="maintenance-field">
              <div className="maintenance-label-row">
                <label>PHOTO & VIDEO VERIFICATION</label>
                <span>JPG, PNG, MP4 up to 15MB</span>
              </div>

              <label className="maintenance-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  multiple
                  onChange={handleFiles}
                />

                <div className="maintenance-upload-icon">
                  <Camera size={21} />
                </div>

                <strong>Upload incident evidence</strong>

                <small>
                  Drag and drop or click to browse files
                </small>

                <span className="maintenance-upload-button">
                  <Upload size={13} />
                  Browse Files
                </span>
              </label>

              {files.length > 0 && (
                <div className="maintenance-file-list">
                  {files.map((file, index) => (
                    <div className="maintenance-file" key={`${file.name}-${index}`}>
                      <Image size={15} />

                      <span>
                        <strong>{file.name}</strong>
                        <small>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </small>
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label="Remove file"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUBMIT */}

            <div className="maintenance-submit-area">
              <button
                type="submit"
                className="maintenance-submit"
              >
                <Send size={15} />
                Submit Maintenance Report
              </button>

              <button
                type="button"
                className="maintenance-whatsapp"
                onClick={() => sendWhatsApp("923005550192")}
              >
                <MessageCircle size={15} />
                WhatsApp Dispatch
              </button>
            </div>

            {submitted && (
              <div className="maintenance-success">
                <CheckCircle size={17} />
                <div>
                  <strong>Report added successfully!</strong>
                  <p>Your new ticket is now visible in Active Room Tickets.</p>
                </div>

                <button type="button" onClick={resetReport}>
                  New Report
                </button>
              </div>
            )}

          </form>

          {/* SECONDARY INFORMATION */}

          <div className="maintenance-guidance">
            <ShieldCheck size={17} />

            <div>
              <strong>Resident Reporting Guidelines</strong>
              <p>
                Provide clear descriptions and attach relevant images
                to help the maintenance team diagnose issues accurately.
              </p>
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN */}

        <aside className="maintenance-right">

          {/* CONTACTS */}

          <section className="maintenance-card">

            <div className="maintenance-panel-heading">
              <h2>
                <UserRound size={17} />
                Designated Support Desk
              </h2>

              <span className="maintenance-direct">
                DIRECT CONTACTS
              </span>
            </div>

            <div className="maintenance-contact-list">

              <div className="maintenance-contact primary-contact">
                <div className="contact-avatar teal-avatar">CR</div>

                <div className="contact-info">
                  <strong>Chaudhry Riaz</strong>
                  <small>Hostel Resident Caretaker • On-Duty</small>

                  <div className="contact-phone">
                    +92 300 5550192

                    <button
                      type="button"
                      onClick={() => sendWhatsApp("923005550192")}
                    >
                      <MessageCircle size={12} />
                      Direct WhatsApp
                    </button>
                  </div>
                </div>

                <span className="online-dot" />
              </div>

              <div className="maintenance-contact">
                <div className="contact-avatar orange-avatar">
                  <Hammer size={17} />
                </div>

                <div className="contact-info">
                  <strong>Bashir Sanitary</strong>
                  <small>On-Call Master Plumber</small>

                  <div className="contact-phone">
                    +92 321 4402891
                    <span>Avail: 9 AM - 8 PM</span>
                  </div>
                </div>
              </div>

              <div className="maintenance-contact">
                <div className="contact-avatar blue-avatar">
                  <Zap size={17} />
                </div>

                <div className="contact-info">
                  <strong>Master Ashraf</strong>
                  <small>Suite Electrician & HVAC</small>

                  <div className="contact-phone">
                    +92 333 7104928
                    <span className="emergency-text">
                      24/7 Emergency
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* TICKETS */}

          <section className="maintenance-card tickets-card">

            <div className="maintenance-panel-heading">
              <h2>
                <History size={17} />
                Active Room 402 Tickets
              </h2>

              <span className="ticket-period">Past 30 Days</span>
            </div>

            <div className="ticket-list">

              {tickets.map(ticket => (
                <div className="maintenance-ticket" key={ticket.id}>

                  <div className="ticket-top">
                    <strong>{ticket.id}</strong>
                    <span>•</span>
                    <small>{ticket.category}</small>

                    <span className={`ticket-status ${ticket.type}`}>
                      {ticket.status}
                    </span>
                  </div>

                  <h3>{ticket.title}</h3>

                  <p>{ticket.description}</p>

                  <div className="ticket-bottom">
                    <span>{ticket.time}</span>

                    <span>
                      {ticket.type === "resolved" ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Clock size={12} />
                      )}

                      {ticket.type === "resolved"
                        ? "View Details"
                        : ticket.type === "pending"
                          ? "Awaiting Review"
                          : "In Progress"}
                    </span>
                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* QUICK SUPPORT */}

          <section className="maintenance-card quick-support">
            <h2>
              <Phone size={16} />
              Need Immediate Assistance?
            </h2>

            <p>
              For urgent maintenance concerns, contact the hostel
              caretaker directly.
            </p>

            <button
              type="button"
              onClick={() => sendWhatsApp("923005550192")}
            >
              <MessageCircle size={15} />
              Contact Caretaker
            </button>
          </section>

        </aside>

      </div>
    </main>
  );
}

export default MaintenanceReporter;
