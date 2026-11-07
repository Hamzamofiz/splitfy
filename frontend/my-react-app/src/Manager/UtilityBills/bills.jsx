import { useRef, useState } from "react";
import ApiPage from "../../components/ApiPage";
import useRoomData from "../../hooks/useRoomData";
import useRoomRecords from "../../hooks/useRoomRecords";
import { apiRequest } from "../../services/api";

const billTypes = ["Rent", "Electricity", "Water", "Gas", "Maintenance", "Internet", "other"];
const maxReceiptSize = 5 * 1024 * 1024;
const money = (amount) =>
  `Rs ${Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const readImageAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read the selected receipt image."));
      }
    };
    reader.onerror = () =>
      reject(reader.error || new Error("Unable to read the selected receipt image."));
    reader.readAsDataURL(file);
  });

export default function UtilityBills({ user }) {
  const { room, loading: roomLoading, error: roomError } = useRoomData(user?._id);
  const { records: bills, loading, error, refresh } = useRoomRecords(
    room ? `/bills/room/${room._id}` : null,
    "bills"
  );
  const [form, setForm] = useState({
    title: "",
    totalAmount: "",
    dueDate: new Date().toISOString().slice(0, 10),
    billType: "Electricity",
  });
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);
  const receiptInputRef = useRef(null);

  const selectReceiptImage = (event) => {
    const file = event.target.files?.[0] || null;
    setActionError("");

    if (file && !file.type.startsWith("image/")) {
      setReceiptImage(null);
      event.target.value = "";
      setActionError("Choose an image file for the receipt.");
      return;
    }

    if (file && file.size > maxReceiptSize) {
      setReceiptImage(null);
      event.target.value = "";
      setActionError("Receipt images must be 5 MB or smaller.");
      return;
    }

    setReceiptImage(file);
  };

  const createBill = async (event) => {
    event.preventDefault();
    if (!room?.members?.length) {
      setActionError("At least one room member is required to assign a bill.");
      return;
    }

    setSaving(true);
    setActionError("");
    setMessage("");
    const cents = Math.round(Number(form.totalAmount) * 100);
    const baseShare = Math.floor(cents / room.members.length);
    const assignedTo = room.members.map((member, index) => ({
      user: member._id,
      shareAmount: (index === room.members.length - 1
        ? cents - baseShare * (room.members.length - 1)
        : baseShare) / 100,
    }));

    try {
      const meterPhotoUrl = receiptImage
        ? await readImageAsDataUrl(receiptImage)
        : null;
      await apiRequest("/bills", {
        method: "POST",
        body: {
          ...form,
          totalAmount: Number(form.totalAmount),
          roomId: room._id,
          assignedTo,
          meterPhotoUrl,
        },
      });
      setForm({ ...form, title: "", totalAmount: "" });
      setReceiptImage(null);
      if (receiptInputRef.current) receiptInputRef.current.value = "";
      setMessage("Bill created and assigned to all room members.");
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to create the bill.");
    } finally {
      setSaving(false);
    }
  };

  const removeBill = async (billId) => {
    setActionError("");
    setMessage("");
    try {
      await apiRequest(`/bills/${billId}`, { method: "DELETE" });
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to delete the bill.");
    }
  };

  const markPaid = async (billId) => {
    setActionError("");
    setMessage("");
    try {
      await apiRequest(`/bills/${billId}/pay`, { method: "PATCH", body: {} });
      setMessage("Your bill assignment was marked paid.");
      await refresh();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to update the bill payment.");
    }
  };

  return (
    <ApiPage
      title="Room bills"
      description="Create bills using the bill fields and assignment model supported by the API."
      loading={roomLoading || loading}
      error={roomError || error || actionError}
    >
      {room && (
        <div className="api-stack">
          <section className="api-card">
            <h2>Add a bill</h2>
            <form className="api-form" onSubmit={createBill}>
              <label>
                Title
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
              </label>
              <label>
                Total amount (PKR)
                <input required min="0.01" step="0.01" type="number" value={form.totalAmount} onChange={(event) => setForm({ ...form, totalAmount: event.target.value })} />
              </label>
              <label>
                Due date
                <input required type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
              </label>
              <label>
                Bill type
                <select value={form.billType} onChange={(event) => setForm({ ...form, billType: event.target.value })}>
                  {billTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </label>
              <label>
                Receipt image (optional, max 5 MB)
                <input
                  ref={receiptInputRef}
                  accept="image/*"
                  onChange={selectReceiptImage}
                  type="file"
                />
              </label>
              <p className="api-muted">The amount is split evenly across {room.members?.length || 0} room members.</p>
              <button className="api-button" disabled={saving} type="submit">{saving ? "Saving…" : "Create bill"}</button>
            </form>
            {message && <p className="api-message" role="status">{message}</p>}
          </section>

          <section className="api-card">
            <h2>Bill records</h2>
            <div className="api-table-wrap">
              <table className="api-table">
                <thead><tr><th>Title</th><th>Type</th><th>Total</th><th>Due</th><th>Assignments</th><th>Actions</th></tr></thead>
                <tbody>
                  {bills.map((bill) => {
                    const assignment = (bill.assignedTo || []).find((item) =>
                      (item.user?._id || item.user) === user?._id
                    );
                    return (
                      <tr key={bill._id}>
                        <td>{bill.title}</td>
                        <td>{bill.billType}</td>
                        <td>{money(bill.totalAmount)}</td>
                        <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                        <td>{(bill.assignedTo || []).map((item) => `${item.user?.name || "Member"}: ${money(item.shareAmount)} (${item.isPaid ? "paid" : "pending"})`).join(", ")}</td>
                        <td>
                          <div className="api-actions">
                            {assignment && !assignment.isPaid && (
                              <button className="api-button" type="button" onClick={() => markPaid(bill._id)}>Mark my share paid</button>
                            )}
                            <button className="api-button api-button--secondary" type="button" onClick={() => removeBill(bill._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!bills.length && <tr><td colSpan="6">No bills have been recorded for this room.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
      {!roomLoading && !roomError && !room && <p className="api-message">Create a room from the dashboard before adding bills.</p>}
    </ApiPage>
  );
}
