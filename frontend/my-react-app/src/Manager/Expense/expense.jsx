import { useEffect, useState } from "react";
import ApiPage from "../../components/ApiPage";
import useRoomData from "../../hooks/useRoomData";
import useRoomRecords from "../../hooks/useRoomRecords";
import { apiRequest } from "../../services/api";

const categories = ["Food", "Utilities", "Rent", "Maintenance", "Other"];
const money = (amount) =>
  `Rs ${Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function ExpenseManager({ user }) {
  const { room, loading: roomLoading, error: roomError } = useRoomData(user?._id);
  const { records: expenses, loading, error, refresh } = useRoomRecords(
    room ? `/expenses/room/${room._id}` : null,
    "expenses"
  );
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
    expenseType: "VARIABLE",
  });
  const [splitBetween, setSplitBetween] = useState([]);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSplitBetween((room?.members || []).map((member) => member._id));
  }, [room]);

  const toggleMember = (memberId) => {
    setSplitBetween((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId]
    );
  };

  const createExpense = async (event) => {
    event.preventDefault();
    if (!splitBetween.length) {
      setActionError("Choose at least one member to split this expense.");
      return;
    }

    setSaving(true);
    setActionError("");
    setMessage("");
    try {
      await apiRequest("/expenses", {
        method: "POST",
        body: {
          ...form,
          amount: Number(form.amount),
          roomId: room._id,
          splitBetween,
          paidBy: user._id,
        },
      });
      setForm({ ...form, title: "", amount: "" });
      setMessage("Expense created.");
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to create the expense.");
    } finally {
      setSaving(false);
    }
  };

  const removeExpense = async (expenseId) => {
    setActionError("");
    try {
      await apiRequest(`/expenses/${expenseId}`, { method: "DELETE" });
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to delete the expense.");
    }
  };

  return (
    <ApiPage
      title="Room expenses"
      description="Create and review expense records attached to your room."
      loading={roomLoading || loading}
      error={roomError || error || actionError}
    >
      {room && (
        <div className="api-stack">
          <section className="api-card">
            <h2>Add an expense</h2>
            <form className="api-form" onSubmit={createExpense}>
              <label>
                Title
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </label>
              <label>
                Amount (PKR)
                <input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
              </label>
              <label>
                Category
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label>
                Expense type
                <select value={form.expenseType} onChange={(event) => setForm({ ...form, expenseType: event.target.value })}>
                  <option value="FIXED">Fixed</option>
                  <option value="VARIABLE">Variable</option>
                </select>
              </label>
              <fieldset className="api-form">
                <legend>Split between</legend>
                {(room.members || []).map((member) => (
                  <label key={member._id}>
                    <span><input type="checkbox" checked={splitBetween.includes(member._id)} onChange={() => toggleMember(member._id)} /> {member.name}</span>
                  </label>
                ))}
              </fieldset>
              <button className="api-button" disabled={saving} type="submit">{saving ? "Saving…" : "Create expense"}</button>
            </form>
            {message && <p className="api-message" role="status">{message}</p>}
          </section>

          <section className="api-card">
            <h2>Expense records</h2>
            <div className="api-table-wrap">
              <table className="api-table">
                <thead><tr><th>Title</th><th>Category</th><th>Amount</th><th>Paid by</th><th>Split members</th><th>Date</th><th /></tr></thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.title}</td>
                      <td>{expense.category}</td>
                      <td>{money(expense.amount)}</td>
                      <td>{expense.paidBy?.name || "Member"}</td>
                      <td>{(expense.splitBetween || []).map((member) => member.name || "Member").join(", ")}</td>
                      <td>{new Date(expense.date || expense.createdAt).toLocaleDateString()}</td>
                      <td><button className="api-button api-button--secondary" type="button" onClick={() => removeExpense(expense._id)}>Delete</button></td>
                    </tr>
                  ))}
                  {!expenses.length && <tr><td colSpan="7">No expenses have been recorded for this room.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
      {!roomLoading && !roomError && !room && <p className="api-message">Create a room from the dashboard before adding expenses.</p>}
    </ApiPage>
  );
}
