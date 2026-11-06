import { useEffect, useState } from "react";
import ApiPage from "../../components/ApiPage";
import useRoomData from "../../hooks/useRoomData";
import { apiRequest } from "../../services/api";
import "./payment-settings.css";

function readNotificationPreferences(userId) {
  const key = `splitfy.notification-preferences.${userId || "default"}`;
  return {
    paymentUpdates:
      localStorage.getItem(`${key}.paymentUpdates`) !== "false",
    maintenanceRequests:
      localStorage.getItem(`${key}.maintenanceRequests`) !== "false",
  };
}

export default function PaymentSetup({ user }) {
  const { room, loading, error, refresh } = useRoomData(user?._id);
  const [form, setForm] = useState({
    roomName: "",
    monthlyRent: "",
    raastId: "",
    easypaisaNumber: "",
  });
  const [notificationPreferences, setNotificationPreferences] = useState(() =>
    readNotificationPreferences(user?._id)
  );
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setForm({
        roomName: room.roomName || "",
        monthlyRent: String(room.monthlyRent ?? ""),
        raastId: room.raastId || "",
        easypaisaNumber: room.easypaisaNumber || "",
      });
    } else {
      setForm({
        roomName: "",
        monthlyRent: "",
        raastId: "",
        easypaisaNumber: "",
      });
    }
  }, [room]);

  useEffect(() => {
    setNotificationPreferences(readNotificationPreferences(user?._id));
  }, [user?._id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const save = async (event) => {
    event.preventDefault();
    const monthlyRent = Number(form.monthlyRent);
    if (!form.roomName.trim() || !Number.isFinite(monthlyRent) || monthlyRent <= 0) {
      setActionError("Enter a group name and a valid monthly rent.");
      return;
    }

    setSaving(true);
    setMessage("");
    setActionError("");
    try {
      const roomDetails = {
        roomName: form.roomName.trim(),
        monthlyRent,
        raastId: form.raastId.trim(),
        easypaisaNumber: form.easypaisaNumber.trim(),
      };
      if (room) {
        await apiRequest(`/room/${room._id}`, {
          method: "PATCH",
          body: roomDetails,
        });
      } else {
        await apiRequest("/room/create", {
          method: "POST",
          body: roomDetails,
        });
      }
      await refresh();
      setMessage(room ? "Group settings saved." : "Group created successfully.");
    } catch (requestError) {
      setActionError(requestError.message || "Unable to save group settings.");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (preference, enabled) => {
    const key = `splitfy.notification-preferences.${user?._id || "default"}.${preference}`;
    setActionError("");
    try {
      localStorage.setItem(key, String(enabled));
      setNotificationPreferences((current) => ({
        ...current,
        [preference]: enabled,
      }));
    } catch (storageError) {
      setActionError(storageError.message || "Unable to save this device preference.");
    }
  };

  return (
    <ApiPage
      title="Group settings"
      description="Manage your group details, payment methods, and notification preferences."
      loading={loading}
      error={error || actionError}
    >
      <div className="payment-settings-stack">
        <section className="api-card payment-settings-card">
          <div className="payment-settings-card__heading">
            <div>
              <h2>Room details</h2>
              <p>Update your group information and payment methods.</p>
            </div>
            {room && (
              <span className="payment-settings-member-count">
                {room.members?.length || 0} active {(room.members?.length || 0) === 1 ? "member" : "members"}
              </span>
            )}
          </div>

          <form className="payment-settings-form" onSubmit={save}>
            <label>
              Group name
              <input
                autoComplete="organization"
                name="roomName"
                onChange={handleChange}
                placeholder="Group name"
                required
                value={form.roomName}
              />
            </label>
            <label>
              Monthly rent (PKR)
              <input
                min="0.01"
                name="monthlyRent"
                onChange={handleChange}
                placeholder="Monthly rent"
                required
                step="0.01"
                type="number"
                value={form.monthlyRent}
              />
            </label>
            <label>
              Raast ID
              <input
                autoCapitalize="none"
                name="raastId"
                onChange={handleChange}
                placeholder="Raast ID"
                value={form.raastId}
              />
            </label>
            <label>
              Easypaisa number
              <input
                autoComplete="tel"
                name="easypaisaNumber"
                onChange={handleChange}
                placeholder="Easypaisa number"
                type="tel"
                value={form.easypaisaNumber}
              />
            </label>

            {room ? (
              <div className="payment-settings-invite">
                <span>Invite code</span>
                <strong>{room.inviteCode || "Unavailable"}</strong>
              </div>
            ) : !loading && !error ? (
              <p className="payment-settings-helper">
                Create a group to get an invite code and manage shared bills.
              </p>
            ) : null}

            <div className="payment-settings-actions">
              <button className="api-button" disabled={saving || loading} type="submit">
                {saving ? "Saving…" : room ? "Save settings" : "Create group"}
              </button>
              {message && <p className="api-message" role="status">{message}</p>}
            </div>
          </form>
        </section>

        <section className="api-card payment-settings-card">
          <div className="payment-settings-card__heading">
            <div>
              <h2>Notifications</h2>
              <p>Choose which updates to receive on this device.</p>
            </div>
          </div>
          <div className="payment-settings-preferences">
            <label className="payment-settings-preference">
              <span>
                <strong>Payment updates</strong>
                <small>Get notified about payments and settlements.</small>
              </span>
              <input
                checked={notificationPreferences.paymentUpdates}
                onChange={(event) => updatePreference("paymentUpdates", event.target.checked)}
                role="switch"
                type="checkbox"
              />
            </label>
            <label className="payment-settings-preference">
              <span>
                <strong>Maintenance requests</strong>
                <small>Get notified when maintenance requests are updated.</small>
              </span>
              <input
                checked={notificationPreferences.maintenanceRequests}
                onChange={(event) => updatePreference("maintenanceRequests", event.target.checked)}
                role="switch"
                type="checkbox"
              />
            </label>
          </div>
          <p className="payment-settings-helper">Notification preferences apply on this device.</p>
        </section>
      </div>
    </ApiPage>
  );
}
