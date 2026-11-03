import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Plus,
  Users,
  ShieldCheck,
  Clock,
  Building2,
  FileText,
  ChevronDown,
  Eye,
  RefreshCw,
  Pencil,
  X,
  CheckCircle2,
  CalendarDays,
  Wallet,
  Home,
} from "lucide-react";
import "./tenant.css";

const initialTenants = [
  {
    id: 1,
    name: "Ahmed Khan",
    initials: "AK",
    property: "Sunset Heights",
    unit: "Apartment 402",
    moveIn: "Nov 01, 2022",
    cnic: "35201-*****-442-1",
    verification: "NADRA e-KYC Level 3",
    contactName: "Guarantor Verified",
    phone: "+92 300 1234567",
    leaseStart: "Nov 01, 2023",
    leaseEnd: "Oct 31, 2024",
    expiry: "Expires in 14 days",
    term: "12 Months",
    deposit: "Rs 240,000",
    escrow: "Held in Escrow",
    escrowRef: "41093",
    status: "Active",
  },
  {
    id: 2,
    name: "Dr. Ayla Mansoor",
    initials: "AM",
    property: "Elite Residency",
    unit: "Unit 10A",
    moveIn: "Jan 15, 2024",
    cnic: "37405-*****-019-2",
    verification: "NADRA Biometric Cleared",
    contactName: "Co-Signer Bonded",
    phone: "+92 300 8472911",
    leaseStart: "Jan 15, 2024",
    leaseEnd: "Jan 14, 2025",
    expiry: "Renews in 92 days",
    term: "12 Months",
    deposit: "Rs 360,000",
    escrow: "Held in Escrow",
    escrowRef: "41103",
    status: "Active",
  },
  {
    id: 3,
    name: "Usman Ali",
    initials: "UA",
    property: "Green Valley",
    unit: "Apartment 205",
    moveIn: "Mar 01, 2023",
    cnic: "42101-*****-781-4",
    verification: "NADRA e-KYC Verified",
    contactName: "Guarantor Verified",
    phone: "+92 321 5550123",
    leaseStart: "Mar 01, 2024",
    leaseEnd: "Feb 28, 2025",
    expiry: "Renews in 120 days",
    term: "12 Months",
    deposit: "Rs 180,000",
    escrow: "Held in Escrow",
    escrowRef: "41120",
    status: "Active",
  },
];

function StatCard({ icon: Icon, label, value, note, color }) {
  return (
    <div className="tv-stat-card">
      <div className={`tv-stat-icon ${color}`}>
        <Icon size={21} />
      </div>
      <div className="tv-stat-content">
        <p>{label}</p>
        <h2>{value}</h2>
        <span>{note}</span>
      </div>
    </div>
  );
}

function TenantDashboard() {
  const [tenants, setTenants] = useState(initialTenants);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Tenants");
  const [property, setProperty] = useState("All Properties");
  const [sort, setSort] = useState("name");
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalAction, setModalAction] = useState("");

  const filteredTenants = useMemo(() => {
    let result = [...tenants];

    if (activeTab !== "All Tenants") {
      result = result.filter((tenant) => tenant.status === activeTab);
    }

    if (property !== "All Properties") {
      result = result.filter((tenant) => tenant.property === property);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((tenant) =>
        [
          tenant.name,
          tenant.property,
          tenant.unit,
          tenant.phone,
          tenant.cnic,
        ].some((value) => value.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "property") return a.property.localeCompare(b.property);
      if (sort === "expiry") {
        return new Date(a.leaseEnd) - new Date(b.leaseEnd);
      }
      return 0;
    });

    return result;
  }, [tenants, activeTab, property, search, sort]);

  const activeCount = tenants.filter((t) => t.status === "Active").length;
  const expiringCount = tenants.filter((t) =>
    t.expiry.toLowerCase().includes("expires")
  ).length;

  const exportCSV = () => {
    const headers = [
      "Tenant",
      "Property",
      "Unit",
      "CNIC",
      "Phone",
      "Lease Start",
      "Lease End",
      "Deposit",
      "Status",
    ];

    const rows = filteredTenants.map((t) => [
      t.name,
      t.property,
      t.unit,
      t.cnic,
      t.phone,
      t.leaseStart,
      t.leaseEnd,
      t.deposit,
      t.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "tenant-vault.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const openAction = (tenant, action) => {
    setSelectedTenant(tenant);
    setModalAction(action);
  };

  const closeModal = () => {
    setSelectedTenant(null);
    setModalAction("");
  };

  const handleSaveAction = () => {
    if (!selectedTenant) return;

    if (modalAction === "Renew") {
      setTenants((current) =>
        current.map((tenant) =>
          tenant.id === selectedTenant.id
            ? {
                ...tenant,
                status: "Active",
                expiry: "Renewal requested",
              }
            : tenant
        )
      );
    }

    closeModal();
  };

  const properties = [
    "All Properties",
    ...new Set(tenants.map((tenant) => tenant.property)),
  ];

  return (
    <div className="tenant-vault">
      <div className="tv-page-header">
        <div>
          <span className="tv-eyebrow">PROPERTY MANAGEMENT</span>
          <h1>Tenant Vault</h1>
          <p>Manage tenant profiles, lease records and verification details.</p>
        </div>

        <div className="tv-header-actions">
          <button className="tv-btn tv-btn-light" onClick={exportCSV}>
            <Download size={17} />
            Export CSV
          </button>

          <button
            className="tv-btn tv-btn-primary"
            onClick={() => openAction(null, "Add Tenant")}
          >
            <Plus size={18} />
            Add Tenant
          </button>
        </div>
      </div>

      <div className="tv-stats-grid">
        <StatCard
          icon={Users}
          label="Total Tenants"
          value={tenants.length}
          note="Registered tenant records"
          color="blue"
        />
        <StatCard
          icon={ShieldCheck}
          label="Active Tenants"
          value={activeCount}
          note="Currently active leases"
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Expiring Soon"
          value={expiringCount}
          note="Requires attention"
          color="orange"
        />
        <StatCard
          icon={Building2}
          label="Properties"
          value={new Set(tenants.map((t) => t.property)).size}
          note="Properties with tenants"
          color="purple"
        />
      </div>

      <section className="tv-record-section">
        <div className="tv-section-heading">
          <div>
            <h2>Tenant Records</h2>
            <p>View and manage registered tenant information.</p>
          </div>

          <span className="tv-record-count">
            {filteredTenants.length} Records
          </span>
        </div>

        <div className="tv-toolbar">
          <div className="tv-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search tenant, property, unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="tv-filters">
            <div className="tv-select-wrap">
              <Building2 size={16} />
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
              >
                {properties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>

            <div className="tv-select-wrap">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="property">Sort: Property</option>
                <option value="expiry">Sort: Lease date</option>
              </select>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        <div className="tv-tabs">
          {["All Tenants", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              className={`tv-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "All Tenants" && (
                <span>{tenants.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="tv-table-wrapper">
          <table className="tv-table">
            <thead>
              <tr>
                <th>TENANT</th>
                <th>PROPERTY / UNIT</th>
                <th>VERIFICATION</th>
                <th>LEASE PERIOD</th>
                <th>SECURITY DEPOSIT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>
                    <div className="tv-tenant-info">
                      <div className="tv-avatar">{tenant.initials}</div>
                      <div>
                        <strong>{tenant.name}</strong>
                        <span>{tenant.phone}</span>
                        <small>{tenant.cnic}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="tv-property-info">
                      <strong>{tenant.property}</strong>
                      <span>{tenant.unit}</span>
                      <small>Move-in: {tenant.moveIn}</small>
                    </div>
                  </td>

                  <td>
                    <div className="tv-verification">
                      <CheckCircle2 size={16} />
                      <span>{tenant.verification}</span>
                    </div>
                    <small className="tv-guarantor">
                      {tenant.contactName}
                    </small>
                  </td>

                  <td>
                    <div className="tv-lease-info">
                      <strong>{tenant.leaseStart}</strong>
                      <span>to {tenant.leaseEnd}</span>
                      <small>{tenant.expiry}</small>
                    </div>
                  </td>

                  <td>
                    <div className="tv-deposit">
                      <strong>{tenant.deposit}</strong>
                      <span>
                        <Wallet size={13} />
                        {tenant.escrow}
                      </span>
                      <small>Ref #{tenant.escrowRef}</small>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`tv-status ${
                        tenant.status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      <span />
                      {tenant.status}
                    </span>
                  </td>

                  <td>
                    <div className="tv-row-actions">
                      <button
                        className="tv-icon-btn"
                        title="View tenant record"
                        onClick={() => openAction(tenant, "View")}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="tv-icon-btn"
                        title="Print / Save as PDF"
                        onClick={() => window.print()}
                      >
                        <FileText size={17} />
                      </button>

                      <button
                        className="tv-icon-btn"
                        title="Amend record"
                        onClick={() => openAction(tenant, "Amend")}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="tv-renew-btn"
                        onClick={() => openAction(tenant, "Renew")}
                      >
                        <RefreshCw size={14} />
                        Renew
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="tv-empty-state">
                      <Users size={30} />
                      <strong>No tenants found</strong>
                      <span>Try changing your search or filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="tv-table-footer">
          <span>
            Showing {filteredTenants.length} of {tenants.length} tenant records
          </span>
          <span className="tv-secure-note">
            <ShieldCheck size={15} />
            Secure tenant records
          </span>
        </div>
      </section>

      {modalAction && (
        <div className="tv-modal-overlay" onClick={closeModal}>
          <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tv-modal-header">
              <div>
                <span className="tv-eyebrow">TENANT MANAGEMENT</span>
                <h2>{modalAction} Tenant</h2>
              </div>
              <button className="tv-close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {selectedTenant ? (
              <div className="tv-modal-content">
                <div className="tv-modal-tenant">
                  <div className="tv-avatar">
                    {selectedTenant.initials}
                  </div>
                  <div>
                    <strong>{selectedTenant.name}</strong>
                    <span>
                      {selectedTenant.property} · {selectedTenant.unit}
                    </span>
                  </div>
                </div>

                {modalAction === "View" ? (
                  <div className="tv-detail-grid">
                    <div>
                      <span>CNIC</span>
                      <strong>{selectedTenant.cnic}</strong>
                    </div>
                    <div>
                      <span>Contact</span>
                      <strong>{selectedTenant.phone}</strong>
                    </div>
                    <div>
                      <span>Lease Start</span>
                      <strong>{selectedTenant.leaseStart}</strong>
                    </div>
                    <div>
                      <span>Lease End</span>
                      <strong>{selectedTenant.leaseEnd}</strong>
                    </div>
                    <div>
                      <span>Security Deposit</span>
                      <strong>{selectedTenant.deposit}</strong>
                    </div>
                    <div>
                      <span>Verification</span>
                      <strong>{selectedTenant.verification}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="tv-modal-message">
                    {modalAction === "Renew"
                      ? "Confirm that you want to submit a lease renewal request for this tenant."
                      : "Record amendment is ready for review. You can update the tenant details in your next form integration."}
                  </p>
                )}
              </div>
            ) : (
              <p className="tv-modal-message">
                Add Tenant form can be connected here to register a new tenant.
              </p>
            )}

            <div className="tv-modal-footer">
              <button className="tv-btn tv-btn-light" onClick={closeModal}>
                Close
              </button>

              {modalAction === "Renew" && (
                <button
                  className="tv-btn tv-btn-primary"
                  onClick={handleSaveAction}
                >
                  <CheckCircle2 size={17} />
                  Confirm Renewal
                </button>
              )}

              {modalAction === "Amend" && (
                <button
                  className="tv-btn tv-btn-primary"
                  onClick={closeModal}
                >
                  Continue
                </button>
              )}

              {modalAction === "Add Tenant" && (
                <button
                  className="tv-btn tv-btn-primary"
                  onClick={closeModal}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TenantDashboard;