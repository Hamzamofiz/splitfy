import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { apiRequest } from "../../services/api.js";
import "./navbar.css";

export default function ManagerNavbar({ user, onUserUpdated }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const profileRef = useRef(null);
  const displayName = user?.name || "User";

  useEffect(() => {
    if (profileOpen) {
      setProfileForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
      setProfileMessage("");
    }
  }, [profileOpen, user]);

  useEffect(() => {
    if (!profileOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    try {
      const updatedUser = await apiRequest("/auth/profile", {
        method: "PUT",
        body: {
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          phone: profileForm.phone.trim(),
        },
      });
      onUserUpdated(updatedUser);
      setProfileMessage("Profile updated.");
    } catch (error) {
      setProfileMessage(error.message || "Unable to update your profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <header className="top-navbar manager-api-navbar">
      <div className="nav-dropdown-wrapper profile-menu" ref={profileRef}>
        <button
          className="profile-trigger"
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          aria-expanded={profileOpen}
          aria-haspopup="dialog"
          aria-label={`Edit profile for ${displayName}`}
        >
          <span className="profile-avatar" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </button>
        {profileOpen && (
          <div className="nav-dropdown profile-dropdown" role="dialog" aria-labelledby="profile-dialog-title">
            <div className="profile-dropdown-heading">
              <div>
                <strong id="profile-dialog-title">Edit profile</strong>
                <small>{user?.role === "admin" ? "Group Leader" : user?.role}</small>
              </div>
            </div>
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <label>
                <span>Name</span>
                <input
                  autoComplete="name"
                  name="name"
                  onChange={handleProfileChange}
                  required
                  value={profileForm.name}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={handleProfileChange}
                  required
                  type="email"
                  value={profileForm.email}
                />
              </label>
              <label>
                <span>Phone</span>
                <input
                  autoComplete="tel"
                  name="phone"
                  onChange={handleProfileChange}
                  type="tel"
                  value={profileForm.phone}
                />
              </label>
              {profileMessage && (
                <p className="profile-form-message" role="status">{profileMessage}</p>
              )}
              <button className="api-button profile-save-button" disabled={savingProfile} type="submit">
                {savingProfile ? "Saving…" : "Save profile"}
              </button>
            </form>
          </div>
        )}
      </div>
      <button className="api-button" type="button" onClick={() => navigate("/expenses")}>
        <Plus size={15} /> Add expense
      </button>
    </header>
  );
}
