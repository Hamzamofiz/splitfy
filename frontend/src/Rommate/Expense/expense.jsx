
import React, { useState } from "react";
import {
  Wrench, Zap, Droplets, Fan, Hammer, SprayCan,
  FileText, Phone, Store, CalendarDays, Wallet,
  ChevronDown, Users, CheckCircle2, Circle,
  Lightbulb, Receipt, ShieldCheck, Search,
  RefreshCw, Eye, Paperclip, ArrowRight,
  Calculator, Info, X
} from "lucide-react";

import "./expense.css";

const repairCategories = [
  { name: "Electrical", icon: Zap },
  { name: "Plumbing", icon: Droplets },
  { name: "AC Service", icon: Fan },
  { name: "Carpentry", icon: Hammer },
  { name: "Deep Cleaning", icon: SprayCan }
];

const occupants = [
  {
    id: 1,
    name: "Ali Khan",
    room: "Bed 402-A",
    role: "Master Ensuite",
    type: "ensuite",
    avatar: "AK",
    color: "green"
  },
  {
    id: 2,
    name: "Hamza Tariq",
    room: "Bed 402-B",
    role: "Master Ensuite",
    type: "ensuite",
    avatar: "HT",
    color: "blue"
  },
  {
    id: 3,
    name: "Daniyal Ahmed",
    room: "Bed 402-C",
    role: "Master Ensuite",
    type: "ensuite",
    avatar: "DA",
    color: "orange"
  },
  {
    id: 4,
    name: "Zain Malik",
    room: "Bed 402-D",
    role: "Common Bath",
    type: "common",
    avatar: "ZM",
    color: "peach"
  },
  {
    id: 5,
    name: "Bilal Raza",
    room: "Bed 402-E",
    role: "Common Bath",
    type: "common",
    avatar: "BR",
    color: "purple"
  },
  {
    id: 6,
    name: "Sarah Ahmed",
    room: "Bed 402-F",
    role: "Common Bath",
    type: "common",
    avatar: "SA",
    color: "pink"
  }
];

export default function MaintenanceAllocator() {
  const [category, setCategory] = useState("Electrical");
  const [selected, setSelected] = useState([1, 2, 3, 4, 5, 6]);
  const [amount, setAmount] = useState("140");
  const [splitMethod, setSplitMethod] = useState({});
  const [description, setDescription] = useState(
    "Geyser Heating Element Replacement & Repair"
  );
  const [technician, setTechnician] = useState("Bashir Electric & Hardware");
  const [phone, setPhone] = useState("+92 300 5550189");
  const [serviceDate, setServiceDate] = useState("2024-10-12");
  const [paymentSource, setPaymentSource] = useState("admin");
  const [attachment, setAttachment] = useState(null);

  const total = Number(amount) || 0;

  const toggleOccupant = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(occupants.map((person) => person.id));
  };

  const selectEnsuite = () => {
    setSelected(
      occupants
        .filter((person) => person.type === "ensuite")
        .map((person) => person.id)
    );
  };

  const clearSelection = () => setSelected([]);

  const getMethod = (id) => splitMethod[id] || "equal";

  const setMethod = (id, value) => {
    setSplitMethod((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const getShare = (id) => {
    const person = occupants.find((item) => item.id === id);
    const method = getMethod(id);
    const selectedPeople = occupants.filter((item) =>
      selected.includes(item.id)
    );

    if (!selected.includes(id)) return 0;

    if (method === "equal") {
      return total / selected.length;
    }

    if (method === "ensuite") {
      const group = selectedPeople.filter(
        (item) => item.type === person.type
      );

      return group.length ? total / group.length : 0;
    }

    if (method === "fixed") {
      return 0;
    }

    return total / selected.length;
  };

  const totalAllocated = selected.reduce(
    (sum, id) => sum + getShare(id),
    0
  );

  const formatMoney = (value) =>
    `Rs ${value.toFixed(2)}`;

  const handleAttachment = (e) => {
    setAttachment(e.target.files[0] || null);
  };

  const handleSave = () => {
    if (!description.trim() || !total || selected.length === 0) {
      alert("Please enter the repair details, amount, and select occupants.");
      return;
    }

    alert("Maintenance allocation details are ready for submission.");
  };

  return (
    <div className="maintenance-page">

      {/* HEADER */}

      <header className="maintenance-header">
        <div className="maintenance-title">
          <div className="maintenance-breadcrumb">
            <span className="room-label">
              <span></span>
              ROOM 402 LEDGERS
            </span>
            <span>•</span>
            <span>Voucher #SPL-2024-1049</span>
          </div>

          <h1>Maintenance & Ad-Hoc Repair Allocator</h1>

          <p>
            Log room repairs, plumbing, cleaning visits, or shared
            hardware purchases and assign customized cost shares
            across active occupants.
          </p>
        </div>

        <div className="maintenance-header-cards">
          <div className="header-stat">
            <span>MONTHLY AD-HOC CAP</span>
            <strong>Rs 350.00</strong>
          </div>

          <div className="header-stat impact-stat">
            <span>IMPACT POOL</span>
            <strong>{selected.length} Roommates</strong>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}

      <main className="maintenance-layout">

        {/* LEFT COLUMN */}

        <div className="maintenance-left">

          <section className="maintenance-card work-order-card">

            <div className="maintenance-section-title">
              <div className="section-icon">
                <Wrench size={17} />
              </div>

              <div>
                <h3>Invoice & Work Order</h3>
                <p>Step 1: Capture procurement details</p>
              </div>
            </div>

            {/* Categories */}

            <div className="maintenance-field">
              <label>Repair Scope Category</label>

              <div className="repair-categories">
                {repairCategories.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.name}
                      className={`repair-category ${
                        category === item.name ? "active" : ""
                      }`}
                      onClick={() => setCategory(item.name)}
                    >
                      <Icon size={14} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}

            <div className="maintenance-field">
              <div className="field-heading">
                <label>Work Description / Voucher Title</label>
                <span>Ref #449</span>
              </div>

              <div className="maintenance-input">
                <FileText size={15} />
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter repair description"
                />
              </div>
            </div>

            {/* Technician */}

            <div className="maintenance-form-grid">
              <div className="maintenance-field">
                <label>Technician / Shop</label>
                <div className="maintenance-input">
                  <Store size={14} />
                  <input
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                  />
                </div>
              </div>

              <div className="maintenance-field">
                <label>Phone Contact</label>
                <div className="maintenance-input">
                  <Phone size={14} />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Amount and Date */}

            <div className="maintenance-form-grid">
              <div className="maintenance-field">
                <label>Total Payable Amount</label>
                <div className="maintenance-input amount-control">
                  <span>Rs</span>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="maintenance-field">
                <label>Service Date</label>
                <div className="maintenance-input">
                  <CalendarDays size={14} />
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}

            <div className="maintenance-field">
              <label>Disbursement Source (Who Paid?)</label>

              <div className="maintenance-input">
                <Wallet size={15} />

                <select
                  value={paymentSource}
                  onChange={(e) => setPaymentSource(e.target.value)}
                >
                  <option value="admin">
                    Paid by Admin (Out-of-Pocket / To be Reimbursed)
                  </option>
                  <option value="cash">Room Cash Fund</option>
                  <option value="resident">Paid by Resident</option>
                  <option value="vendor">Direct Vendor Payment</option>
                </select>

                <ChevronDown size={13} />
              </div>

              <p className="payment-note">
                <Info size={12} />
                Group admin will be credited Rs {total.toFixed(2)} upon final settlement.
              </p>
            </div>

            {/* Attachment */}

            <div className="maintenance-field attachment-field">
              <div className="field-heading">
                <label>Proof of Payment & Warranty Card</label>
                <span className="digital-verified">
                  <CheckCircle2 size={11} />
                  Digital Receipt Verified
                </span>
              </div>

              <label className="attachment-box">
                <div className="attachment-preview">
                  <Receipt size={21} />
                  <span>IMG 402</span>
                </div>

                <div className="attachment-info">
                  <strong>
                    {attachment ? attachment.name : "inv_oct12_bashir_sanitary.pdf"}
                  </strong>
                  <span>
                    {attachment
                      ? `${(attachment.size / 1024 / 1024).toFixed(2)} MB · Uploaded`
                      : "1.4 MB · Stored in Splitfy Vault"}
                  </span>
                  <span className="warranty-text">1-Yr Warranty</span>
                </div>

                <span className="attachment-action">
                  <Paperclip size={15} />
                </span>

                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleAttachment}
                />
              </label>
            </div>

          </section>

          {/* NOTICE */}

          <div className="partition-notice">
            <Lightbulb size={18} />

            <div>
              <strong>Equitable Partition Notice</strong>
              <p>
                Repairs for ensuite facilities can be allocated to
                designated room occupants, whilst hallway fixtures
                are shared among all residents.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}

        <div className="maintenance-right">

          <section className="maintenance-card allocation-panel">

            {/* Allocation Heading */}

            <div className="allocation-heading">
              <div className="section-icon allocation-icon">
                <Users size={18} />
              </div>

              <div>
                <h3>Target Group Allocation</h3>
                <p>Hostel Suite / Room</p>
                <span>402 Active Cohort</span>
              </div>
            </div>

            {/* Selection Controls */}

            <div className="selection-toolbar">
              <button onClick={selectAll}>
                Select All (6)
              </button>

              <button onClick={selectEnsuite}>
                Only Affected Bath (3)
              </button>

              <button onClick={clearSelection}>
                Clear
              </button>
            </div>

            {/* Allocation Ratio */}

            <div className="allocation-ratio">
              <div className="ratio-heading">
                <strong>Allocation Partition Ratio</strong>
                <span>
                  {selected.length} of 6 Active
                  ({Math.round(selected.length / 6 * 100)}% Covered)
                </span>
              </div>

              <div className="ratio-track">
                <span
                  style={{
                    width: `${selected.length / 6 * 100}%`
                  }}
                ></span>
              </div>

              <div className="ratio-footer">
                <span>
                  Rs {(total - totalAllocated).toFixed(2)} Unallocated
                </span>
                <span>Equi-Split Mode Active</span>
              </div>
            </div>

            {/* Table Heading */}

            <div className="occupant-table-heading">
              <span>INC.</span>
              <span>OCCUPANT / ROLE</span>
              <span>SPLIT METHOD</span>
              <span>COMPUTED SHARE</span>
              <span>STATUS</span>
            </div>

            {/* Occupants */}

            <div className="occupant-list">
              {occupants.map((person) => {
                const isSelected = selected.includes(person.id);

                return (
                  <div
                    className={`occupant-row ${
                      isSelected ? "" : "not-selected"
                    }`}
                    key={person.id}
                  >
                    <button
                      className={`occupant-check ${
                        isSelected ? "checked" : ""
                      }`}
                      onClick={() => toggleOccupant(person.id)}
                      aria-label={`Toggle ${person.name}`}
                    >
                      {isSelected && <CheckCircle2 size={13} />}
                    </button>

                    <div className="occupant-details">
                      <div className={`occupant-avatar ${person.color}`}>
                        {person.avatar}
                      </div>

                      <div>
                        <strong>{person.name}</strong>
                        <span>{person.room} • {person.role}</span>
                      </div>
                    </div>

                    <select
                      className="split-select"
                      value={getMethod(person.id)}
                      disabled={!isSelected}
                      onChange={(e) =>
                        setMethod(person.id, e.target.value)
                      }
                    >
                      <option value="equal">Equal Share</option>
                      <option value="ensuite">Group Share</option>
                      <option value="fixed">Custom</option>
                    </select>

                    <strong className="computed-share">
                      {isSelected
                        ? formatMoney(getShare(person.id))
                        : "—"}
                    </strong>

                    <span className={`occupant-status ${
                      isSelected ? "verified" : "inactive"
                    }`}>
                      {isSelected ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Circle size={13} />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total */}

            <div className="allocation-summary">
              <div>
                <span>Selected Occupants</span>
                <strong>{selected.length} / 6</strong>
              </div>

              <div>
                <span>Total Allocated</span>
                <strong>{formatMoney(totalAllocated)}</strong>
              </div>

              <div>
                <span>Remaining</span>
                <strong className="remaining-amount">
                  {formatMoney(Math.max(0, total - totalAllocated))}
                </strong>
              </div>
            </div>

            <button
              className="save-allocation-btn"
              onClick={handleSave}
            >
              <ShieldCheck size={16} />
              Confirm & Save Repair Allocation
            </button>

          </section>

        </div>

      </main>
    </div>
  );
}
