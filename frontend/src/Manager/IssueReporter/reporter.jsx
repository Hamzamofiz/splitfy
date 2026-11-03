
import React, { useState } from "react";
import {
  Snowflake,
  Hammer,
  Zap,
  DoorClosed,
  Bug,
  Brush,
  ShieldAlert,
  Info,
  Contact,
  History,
  Phone,
  MessageCircle,
  Camera,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Building2,
  Clock,
  Wrench,
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  Send
} from "lucide-react";

import "./reporter.css";

const issueCategories = [
  { id: "ac", name: "AC / Cooling", detail: "Priority Unit", icon: Snowflake },
  { id: "plumbing", name: "Plumbing & Taps", detail: "Pipes & Drains", icon: Hammer },
  { id: "electrical", name: "Electrical / Sockets", detail: "Breaker Trips", icon: Zap },
  { id: "locks", name: "Locks / Windows", detail: "Room Access", icon: DoorClosed },
  { id: "pest", name: "Pest Control", detail: "Hostel Suite", icon: Bug },
  { id: "cleaning", name: "Cleaning / Garbage", detail: "Disposal Issue", icon: Brush }
];

const supportContacts = [
  {
    name: "Chaudhry Riaz",
    role: "Hostel Resident Caretaker",
    phone: "+923005550192",
    displayPhone: "+92 300 5550192",
    initials: "CR",
    type: "caretaker",
    availability: "On-Duty",
    status: "Available"
  },
  {
    name: "Bashir Sanitary",
    role: "On-Call Master Plumber",
    phone: "+923214402891",
    displayPhone: "+92 321 4402891",
    initials: "BS",
    type: "plumber",
    availability: "9 AM - 8 PM",
    status: "Available"
  },
  {
    name: "Master Ashraf",
    role: "Suite Electrician & HVAC",
    phone: "+923337109428",
    displayPhone: "+92 333 7109428",
    initials: "MA",
    type: "electrician",
    availability: "24/7 Emergency",
    status: "Emergency"
  }
];

const tickets = [
  {
    id: "#TKT-892",
    category: "Geyser Heating Element",
    title: "Geyser Heating Element Replacement",
    description: "Settlement split: Rs 140.00 split (Suite)",
    status: "Resolved & Billed",
    type: "resolved"
  },
  {
    id: "#TKT-904",
    category: "Plumbing Line",
    title: "Kitchen Sink Drain Slow Flow",
    description: "Assigned: Bashir Sanitary",
    status: "Technician Dispatched",
    time: "Today 4 PM",
    type: "progress"
  },
  {
    id: "#TKT-911",
    category: "Electrical",
    title: "Room Switchboard Inspection",
    description: "Awaiting caretaker inspection",
    status: "Pending Review",
    type: "pending"
  }
];

export default function MaintenanceReporter() {
  const [category, setCategory] = useState("ac");
  const [severity, setSeverity] = useState("High");
  const [subject, setSubject] = useState(
    "Master Bathroom Geyser Thermostat Trip & AC Condenser Noise"
  );
  const [area, setArea] = useState("Room B (Ensuite)");
  const [description, setDescription] = useState(
    "The water geyser in our ensuite bathroom trips the main circuit breaker after 10 minutes of operation. Also, the 1.5 ton split AC outdoor unit is making a rattling vibration sound."
  );
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategory = (item) => {
    setCategory(item.id);
    setSubject(item.name + " - Maintenance Issue");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="maintenance-page">

      {/* HEADER */}

      <header className="maintenance-header">

        <div className="maintenance-header-content">

          <span className="maintenance-eyebrow">
            <span></span>
            ROOM 402 • RESIDENT MAINTENANCE & REPAIR
          </span>

          <h1>Maintenance Issue & Incident Reporter</h1>

          <p>
            Log hostel room damage, plumbing leaks, or electrical failures.
            Instantly dispatch work orders to property caretakers via WhatsApp.
          </p>

        </div>

        <div className="maintenance-header-badge">
          <ShieldAlert size={17} />

          <div>
            <strong>Suite 402</strong>
            <span>Direct Caretaker Dispatch</span>
          </div>
        </div>

      </header>

      <div className="maintenance-layout">

        {/* LEFT CONTENT */}

        <div className="maintenance-left">

          {/* SAFETY NOTICE */}

          <div className="maintenance-notice">

            <div className="notice-icon">
              <Info size={18} />
            </div>

            <div className="notice-content">
              <div className="notice-heading">
                <h3>Maintenance Notice</h3>
                <span>SAFETY REMINDER</span>
              </div>

              <p>
                For gas leaks or sparking wiring, immediately shut the main
                valve outside Room 402 and call the caretaker directly.
              </p>
            </div>

          </div>

          {/* REPORT FORM */}

          <form
            className="maintenance-form"
            onSubmit={handleSubmit}
          >

            {/* ISSUE CATEGORY */}

            <section className="maintenance-section">

              <div className="maintenance-section-heading">
                <h2>Issue Category</h2>
                <span>Select standard incident type</span>
              </div>

              <div className="issue-category-grid">

                {issueCategories.map((item) => {
                  const Icon = item.icon;
                  const active = category === item.id;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`issue-category ${
                        active ? "issue-category-active" : ""
                      }`}
                      onClick={() => handleCategory(item)}
                    >
                      {active && <span className="category-check"></span>}

                      <Icon size={20} />

                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </button>
                  );
                })}

              </div>

            </section>

            {/* SUBJECT */}

            <section className="maintenance-section">

              <label className="maintenance-label">
                Issue Subject
              </label>

              <div className="maintenance-input subject-input">
                <FileText size={15} />

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter a short issue title"
                  required
                />
              </div>

            </section>

            {/* SEVERITY AND AREA */}

            <section className="maintenance-section">

              <div className="incident-fields">

                <div className="incident-field">

                  <label className="maintenance-label">
                    Severity Rating
                  </label>

                  <div className="severity-options">

                    {["Low", "Medium", "High"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`severity-btn severity-${item.toLowerCase()} ${
                          severity === item ? "severity-selected" : ""
                        }`}
                        onClick={() => setSeverity(item)}
                      >
                        {item}
                        {item === "High" && (
                          <small>(Urgent)</small>
                        )}
                      </button>
                    ))}

                  </div>

                </div>

                <div className="incident-field">

                  <label className="maintenance-label">
                    Incident Area
                  </label>

                  <div className="maintenance-input">
                    <Building2 size={15} />

                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    >
                      <option>Room B (Ensuite)</option>
                      <option>Room A (Bedroom)</option>
                      <option>Shared Kitchen</option>
                      <option>Common Bathroom</option>
                      <option>Balcony</option>
                      <option>Hallway</option>
                      <option>Entire Suite</option>
                    </select>

                    <ChevronDown size={14} />
                  </div>

                </div>

              </div>

            </section>

            {/* DESCRIPTION */}

            <section className="maintenance-section">

              <div className="description-heading">
                <label className="maintenance-label">
                  Detailed Incident Description
                </label>

                <span>
                  {description.length} characters entered
                </span>
              </div>

              <textarea
                className="incident-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Describe what happened, when it started and any relevant details..."
                required
              />

            </section>

            {/* UPLOAD */}

            <section className="maintenance-section">

              <div className="description-heading">
                <label className="maintenance-label">
                  Photo & Video Verification
                </label>

                <span>JPG, PNG, MP4 up to 15MB each</span>
              </div>

              <label className="maintenance-upload">

                <input
                  type="file"
                  accept="image/jpeg,image/png,video/mp4"
                  multiple
                  onChange={handleFiles}
                />

                <div className="maintenance-upload-icon">
                  <Camera size={21} />
                </div>

                <strong>Upload photos or videos</strong>

                <p>
                  Add visual evidence to help the technician understand
                  the issue.
                </p>

                <span className="maintenance-upload-btn">
                  <Upload size={14} />
                  Browse Files
                </span>

              </label>

              {files.length > 0 && (
                <div className="maintenance-file-list">

                  {files.map((file, index) => (
                    <div className="maintenance-file" key={`${file.name}-${index}`}>

                      <div>
                        <FileText size={16} />
                        <span>{file.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  ))}

                </div>
              )}

            </section>

            {/* DECLARATION */}

            <div className="maintenance-declaration">
              <ShieldAlert size={16} />

              <span>
                I confirm that the information provided is accurate and
                the reported issue requires maintenance attention.
              </span>
            </div>

            <button className="maintenance-submit" type="submit">
              <Send size={16} />
              Submit Maintenance Report
              <ArrowRight size={16} />
            </button>

            {submitted && (
              <div className="maintenance-success">
                <CheckCircle2 size={17} />
                Report prepared successfully. Backend submission is not
                connected yet.
              </div>
            )}

          </form>

        </div>

        {/* RIGHT SIDEBAR */}

        <aside className="maintenance-right">

          {/* SUPPORT CONTACTS */}

          <section className="maintenance-card support-card">

            <div className="maintenance-card-heading">

              <div className="maintenance-card-title">
                <Contact size={17} />
                <h2>Designated Support Desk</h2>
              </div>

              <span>DIRECT CONTACTS</span>

            </div>

            <div className="support-list">

              {supportContacts.map((person) => (
                <div className="support-person" key={person.name}>

                  <div className={`support-avatar ${person.type}`}>
                    {person.initials}
                  </div>

                  <div className="support-person-info">

                    <strong>{person.name}</strong>
                    <span>{person.role}</span>

                    <small>{person.displayPhone}</small>

                    {person.type === "caretaker" && (
                      <a
                        className="whatsapp-link"
                        href={`https://wa.me/${person.phone}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle size={12} />
                        Direct WhatsApp
                      </a>
                    )}

                  </div>

                  <div className="support-person-status">

                    <span
                      className={`status-dot ${person.status === "Emergency" ? "emergency-dot" : ""}`}
                    ></span>

                    {person.type !== "caretaker" && (
                      <>
                        <strong>{person.displayPhone}</strong>
                        <small
                          className={
                            person.status === "Emergency"
                              ? "emergency-text"
                              : ""
                          }
                        >
                          {person.availability}
                        </small>
                      </>
                    )}

                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* ACTIVE TICKETS */}

          <section className="maintenance-card tickets-card">

            <div className="maintenance-card-heading">

              <div className="maintenance-card-title">
                <History size={17} />
                <h2>Active Room 402 Tickets</h2>
              </div>

              <span className="ticket-period">Past 30 Days</span>

            </div>

            <div className="ticket-list">

              {tickets.map((ticket) => (
                <div className="ticket-item" key={ticket.id}>

                  <div className="ticket-top">

                    <strong>{ticket.id}</strong>
                    <span>{ticket.category}</span>

                    <span className={`ticket-status ${ticket.type}`}>
                      {ticket.status}
                      {ticket.time && ` (${ticket.time})`}
                    </span>

                  </div>

                  <h3>{ticket.title}</h3>

                  <div className="ticket-bottom">
                    <span>{ticket.description}</span>

                    {ticket.type === "resolved" ? (
                      <button type="button" className="ticket-action">
                        View Settlement <ArrowRight size={12} />
                      </button>
                    ) : (
                      <span className={`ticket-progress ${ticket.type}`}>
                        {ticket.type === "progress"
                          ? "In Progress"
                          : "Awaiting Review"}
                      </span>
                    )}

                  </div>

                </div>
              ))}

            </div>

            <button type="button" className="all-tickets">
              View All Maintenance Tickets
              <ArrowRight size={14} />
            </button>

          </section>

          {/* EMERGENCY CARD */}

          <section className="maintenance-emergency">

            <div className="emergency-icon">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h3>Need urgent assistance?</h3>
              <p>
                Contact your hostel caretaker directly for emergencies.
              </p>

              <a href="tel:+923005550192">
                <Phone size={14} />
                Call Caretaker
              </a>
            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}
