import { useState } from "react";
import ApiPage from "../../components/ApiPage";
import useRoomData from "../../hooks/useRoomData";
import useRoomRecords from "../../hooks/useRoomRecords";
import { apiRequest } from "../../services/api";
import "./dashboard-activity.css";

const money = (amount) =>
  `Rs ${Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const moneyPkr = (amount) =>
  `PKR ${Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-PK") : "Date unavailable";

const getBillStatus = (bill) => {
  if (typeof bill.status === "string" && bill.status.trim()) {
    return bill.status.trim();
  }

  const assignments = Array.isArray(bill.assignedTo) ? bill.assignedTo : [];
  if (assignments.length && assignments.every((assignment) => assignment.isPaid)) {
    return "Paid";
  }
  if (assignments.some((assignment) => assignment.isPaid)) {
    return "Partially Paid";
  }
  return "Pending";
};

export default function Dashboard({ user }) {
  const { room, loading: roomLoading, error: roomError, refresh } =
    useRoomData(user?._id);
  const { records: bills, loading: billsLoading, error: billsError } =
    useRoomRecords(room ? `/bills/room/${room._id}` : null, "bills");
  const { records: expenses, loading: expensesLoading, error: expensesError } =
    useRoomRecords(room ? `/expenses/room/${room._id}` : null, "expenses");
  const { records: settlements, loading: settlementsLoading, error: settlementsError } =
    useRoomRecords(room ? `/settlements/room/${room._id}` : null, "settlements");
  const { records: maintenance, loading: maintenanceLoading, error: maintenanceError } =
    useRoomRecords(room ? `/maintenance/room/${room._id}` : null, "maintenanceIssues");
  const [form, setForm] = useState({
    roomName: "",
    monthlyRent: "",
    raastId: "",
    easypaisaNumber: "",
  });
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const createRoom = async (event) => {
    event.preventDefault();
    setActionError("");
    setSaving(true);
    try {
      await apiRequest("/room/create", {
        method: "POST",
        body: { ...form, monthlyRent: Number(form.monthlyRent) },
      });
      setForm({ roomName: "", monthlyRent: "", raastId: "", easypaisaNumber: "" });
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to create the room.");
    } finally {
      setSaving(false);
    }
  };

  const loading =
    roomLoading || billsLoading || expensesLoading || settlementsLoading || maintenanceLoading;
  const error =
    roomError || billsError || expensesError || settlementsError || maintenanceError || actionError;
  const upcomingBills = bills
    .filter((bill) => getBillStatus(bill).toLowerCase() !== "paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const recentActivity = [
    ...expenses.map((expense) => ({
      id: `expense-${expense._id}`,
      title: expense.title,
      type: `${expense.category || "Expense"} · ${expense.approvalStatus || "Recorded"}`,
      status: expense.approvalStatus || "Recorded",
      amount: expense.amount,
      date: expense.date || expense.createdAt,
    })),
    ...settlements.map((settlement) => ({
      id: `settlement-${settlement._id}`,
      title: settlement.note || settlement.payer?.name || "Settlement",
      type: settlement.paymentMethod || "Payment",
      status: settlement.status,
      amount: settlement.amount,
      date: settlement.createdAt,
    })),
    ...maintenance.map((item) => ({
      id: `maintenance-${item._id}`,
      title: item.description || `${item.issueType} maintenance`,
      type: `Maintenance · ${item.issueType}`,
      status: item.status,
      amount: item.repairCost,
      date: item.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 5);

  return (
    <ApiPage
      title="Dashboard"
      description="Room, members, bills, and expenses from your Splitfy account."
      loading={loading}
      error={error}
    >
      {!roomLoading && !roomError && !room && (
        <section className="api-card">
          <h2>Create your room</h2>
          <p className="api-muted">Create a room to invite members and manage shared records.</p>
          <form className="api-form" onSubmit={createRoom}>
            <label>
              Room name
              <input
                required
                value={form.roomName}
                onChange={(event) => setForm({ ...form, roomName: event.target.value })}
              />
            </label>
            <label>
              Monthly rent (PKR)
              <input
                required
                min="1"
                step="0.01"
                type="number"
                value={form.monthlyRent}
                onChange={(event) => setForm({ ...form, monthlyRent: event.target.value })}
              />
            </label>
            <label>
              Raast ID
              <input
                value={form.raastId}
                onChange={(event) => setForm({ ...form, raastId: event.target.value })}
              />
            </label>
            <label>
              Easypaisa number
              <input
                value={form.easypaisaNumber}
                onChange={(event) => setForm({ ...form, easypaisaNumber: event.target.value })}
              />
            </label>
            <button className="api-button" disabled={saving} type="submit">
              {saving ? "Creating…" : "Create room"}
            </button>
          </form>
        </section>
      )}

      {room && (
        <div className="api-stack">
          <section className="api-grid">
            <article className="api-card">
              <h2>Room</h2>
              <strong className="api-card__value">{room.roomName}</strong>
              <p className="api-muted">Monthly rent: {money(room.monthlyRent)}</p>
            </article>
            <article className="api-card">
              <h2>Members</h2>
              <strong className="api-card__value">{room.members?.length || 0}</strong>
            </article>
            <article className="api-card">
              <h2>Room bills</h2>
              <strong className="api-card__value">{money(bills.reduce((sum, bill) => sum + bill.totalAmount, 0))}</strong>
              <p className="api-muted">{bills.length} records</p>
            </article>
            <article className="api-card">
              <h2>Room expenses</h2>
              <strong className="api-card__value">{money(expenses.reduce((sum, expense) => sum + expense.amount, 0))}</strong>
              <p className="api-muted">{expenses.length} records</p>
            </article>
          </section>

          <section className="dashboard-activity-grid" aria-label="Room updates">
            <article className="dashboard-activity-card">
              <div className="dashboard-activity-card__heading">
                <h2>Active bills</h2>
                <span>Due soon</span>
              </div>
              {upcomingBills.length ? (
                <ul className="dashboard-activity-list">
                  {upcomingBills.map((bill) => (
                    <li className="dashboard-activity-item" key={bill._id}>
                      <div className="dashboard-activity-item__details">
                        <strong>{bill.title}</strong>
                        <span>
                          <span className={`dashboard-activity-status${getBillStatus(bill).toLowerCase() === "partially paid" ? " is-partial" : ""}`}>
                            {getBillStatus(bill)}
                          </span>
                          <span>Due {formatDate(bill.dueDate)}</span>
                        </span>
                      </div>
                      <strong className="dashboard-activity-amount">{moneyPkr(bill.totalAmount)}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dashboard-activity-empty">
                  {billsLoading ? "Loading bills…" : "No active bills."}
                </p>
              )}
            </article>

            <article className="dashboard-activity-card">
              <div className="dashboard-activity-card__heading">
                <h2>Recent activity</h2>
                <span>Latest updates</span>
              </div>
              {recentActivity.length ? (
                <ul className="dashboard-activity-list">
                  {recentActivity.map((item) => {
                    const isComplete = ["APPROVED", "COMPLETED", "RESOLVED"].includes(
                      item.status?.toUpperCase()
                    );
                    return (
                      <li className="dashboard-activity-item" key={item.id}>
                        <div className="dashboard-activity-item__details">
                          <strong>{item.title}</strong>
                          <span>
                            <span className={`dashboard-activity-status${isComplete ? " is-complete" : ""}`}>
                              {item.status}
                            </span>
                            <span>{item.type}</span>
                            <span>{formatDate(item.date)}</span>
                          </span>
                        </div>
                        <strong className="dashboard-activity-amount">{moneyPkr(item.amount)}</strong>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="dashboard-activity-empty">
                  {expensesLoading || settlementsLoading || maintenanceLoading
                    ? "Loading activity…"
                    : "No recent activity."}
                </p>
              )}
            </article>
          </section>

          <section className="api-card">
            <h2>Room members</h2>
            <p className="api-muted">Invite code: <strong>{room.inviteCode}</strong></p>
            <div className="api-table-wrap">
              <table className="api-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Assigned bills</th></tr>
                </thead>
                <tbody>
                  {(room.members || []).map((member) => {
                    const assigned = bills.flatMap((bill) =>
                      (bill.assignedTo || [])
                        .filter((item) => (item.user?._id || item.user) === member._id)
                        .map((item) => ({ ...item, title: bill.title }))
                    );
                    return (
                      <tr key={member._id}>
                        <td>{member.name}</td>
                        <td>{member.email}</td>
                        <td>{member.role}</td>
                        <td>
                          {assigned.length
                            ? assigned.map((item) => `${item.title}: ${money(item.shareAmount)} (${item.isPaid ? "paid" : "pending"})`).join(", ")
                            : "None"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </ApiPage>
  );
}
