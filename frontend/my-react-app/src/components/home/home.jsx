
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Landmark,
  Link2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import "./home.css";

export default function Home({ onLogin }) {
  const [portal, setPortal] = useState("tenant");
  const [mode, setMode] = useState("create");
  const [showPassword, setShowPassword] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [roomCodeStatus, setRoomCodeStatus] = useState("");
  const [message, setMessage] = useState("");

  const handleValidateCode = () => {
    if (!roomCode.trim()) {
      setRoomCodeStatus("Enter a room code first.");
      return;
    }

    setRoomCodeStatus(
      "Code entered — ready to validate with your backend."
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    onLogin();
  };

  return (
    <main className="page-shell">
      <section className="intro-panel">
        <div className="intro-content">
          <a className="brand" href="/" aria-label="Splitify home">
            <span className="brand-mark">
              <span>S</span>
            </span>

            <span className="brand-copy">
              <strong>Splitify</strong>
              <small>
                Property &amp; Shared Living Platform · Pakistan
              </small>
            </span>
          </a>

          <div className="intro-status" aria-label="System status">
            <span />
          </div>

          <div className="hero-copy">
            <div className="eyebrow">
              <Zap size={13} fill="currentColor" />
              <span>Instant Rent &amp; Bill Splitting</span>
            </div>

            <h1>
              Split Smart.
              <span>Live Stress-Free.</span>
            </h1>

            <p>
              Instant rent and bill splitting for roommates and
              property owners across Pakistan.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-card-top">
                <span className="feature-icon mint">
                  <UsersRound size={19} />
                </span>
                <span className="feature-tag">Roommates</span>
              </div>

              <h2>Hostel &amp; Flatmates</h2>
              <p>
                Fair grocery division, real-time shared balances,
                and utility bill splits without the awkwardness.
              </p>

              <div className="mini-panel">
                <div className="mini-row">
                  <span>Wi-Fi &amp; Power Split</span>
                  <strong>PKR 12,500 / each</strong>
                </div>

                <div className="progress-track">
                  <span />
                </div>

                <div className="mini-row muted">
                  <span>Instant rent &amp; bill splitting</span>
                  <strong>Live sync</strong>
                </div>
              </div>
            </article>

            <article className="feature-card">
              <div className="feature-card-top">
                <span className="feature-icon peach">
                  <Building2 size={19} />
                </span>
                <span className="feature-tag warm">Enterprise</span>
              </div>

              <h2>Landlord &amp; Assets</h2>
              <p>
                Instant rent collection, tenant records, and
                automated monthly payment reminders.
              </p>

              <div className="mini-panel">
                <div className="mini-row">
                  <span>Portfolio Collection</span>
                  <strong>98.4%</strong>
                </div>

                <div className="progress-track">
                  <span className="progress-gold" />
                </div>

                <div className="mini-row muted">
                  <span>Property &amp; shared living platform</span>
                  <strong>Automated</strong>
                </div>
              </div>
            </article>
          </div>

          <div className="intro-footer">
            <ShieldCheck size={15} />
            <span>
              Built for simpler, more transparent shared living.
            </span>
          </div>
        </div>
      </section>

      <section className="form-panel">
        <div className="account-card">
          <div className="card-topline">
            <span>Select your portal mode</span>
            <span className="switch-note">Switch anytime</span>
          </div>

          <div className="segmented portal-switch" role="tablist">
            <button
              type="button"
              className={portal === "tenant" ? "active" : ""}
              onClick={() => setPortal("tenant")}
              role="tab"
              aria-selected={portal === "tenant"}
            >
              <UsersRound size={14} />
              Tenant
            </button>

            <button
              type="button"
              className={portal === "landlord" ? "active" : ""}
              onClick={() => setPortal("landlord")}
              role="tab"
              aria-selected={portal === "landlord"}
            >
              <Landmark size={14} />
              Landlord
            </button>
          </div>

          <div className="segmented mode-switch" role="tablist">
            <button
              type="button"
              className={mode === "signin" ? "active" : ""}
              onClick={() => {
                setMode("signin");
                setMessage("");
              }}
              role="tab"
              aria-selected={mode === "signin"}
            >
              <LockKeyhole size={15} />
              Sign In
            </button>

            <button
              type="button"
              className={mode === "create" ? "active" : ""}
              onClick={() => {
                setMode("create");
                setMessage("");
              }}
              role="tab"
              aria-selected={mode === "create"}
            >
              <Sparkles size={15} />
              Create Account
            </button>
          </div>

          <header className="form-heading">
            <h2>
              {mode === "create"
                ? "Create your Splitify account"
                : "Welcome back to Splitify"}
            </h2>

            <p>
              {mode === "create"
                ? "Instant rent and bill splitting for roommates and property owners across Pakistan."
                : "Sign in to manage your shared living, rent, and bills."}
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {mode === "create" && (
              <label className="field">
                <span>Full Name</span>
                <div className="input-wrap">
                  <UsersRound size={15} />
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins / Hamza Khan"
                    required
                  />
                </div>
              </label>
            )}

            <div className="field-row">
              <label className="field">
                <span>Email Address</span>
                <div className="input-wrap">
                  <Mail size={15} />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    required
                  />
                </div>
              </label>

              {mode === "create" && (
                <label className="field">
                  <span>Pakistani Mobile (+92)</span>
                  <div className="input-wrap">
                    <Phone size={15} />
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                </label>
              )}
            </div>

            {mode === "create" && (
              <>
                <div className="field-label-row">
                  <span className="field-label">
                    Primary account mode
                  </span>
                </div>

                <div className="room-code-box">
                  <div className="room-code-heading">
                    <span>
                      <Link2 size={14} />
                      Have a room code or unit invite link?
                    </span>
                    <span className="optional-tag">Optional</span>
                  </div>

                  <div className="code-entry">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(event) => {
                        setRoomCode(event.target.value);
                        setRoomCodeStatus("");
                      }}
                      placeholder="Enter code (e.g., SH-402)"
                      aria-label="Room code"
                    />

                    <button
                      type="button"
                      onClick={handleValidateCode}
                    >
                      Validate
                    </button>
                  </div>

                  <p>
                    Enter your flatmate’s room token to auto-join
                    your Karachi, Lahore, or Islamabad hostel ledger.
                  </p>

                  {roomCodeStatus && (
                    <div className="code-feedback">
                      {roomCodeStatus}
                    </div>
                  )}
                </div>
              </>
            )}

            <label className="field password-field">
              <span>
                {mode === "create"
                  ? "Create secure password"
                  : "Password"}
              </span>

              <div className="input-wrap">
                <KeyRound size={15} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    mode === "create"
                      ? "At least 8 characters"
                      : "Your password"
                  }
                  minLength={mode === "create" ? 8 : undefined}
                  required
                />

                <button
                  className="visibility-button"
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </label>

            {mode === "create" && (
              <>
                <div className="password-meter">
                  <span />
                  <span />
                  <span />
                  <small>Standard security</small>
                </div>

                <label className="terms-row">
                  <input type="checkbox" required />
                  <span>
                    I agree to the{" "}
                    <a href="#terms">Splitify Terms of Service</a>{" "}
                    and <a href="#privacy">Privacy Policy</a> for
                    Property &amp; Shared Living Platform - Pakistan.
                  </span>
                </label>
              </>
            )}

            <button className="submit-button" type="submit">
              {mode === "create"
                ? "Create Free Account"
                : "Sign In"}
              <ArrowRight size={17} />
            </button>

            {message && (
              <p className="form-message">{message}</p>
            )}
          </form>

          <p className="card-footer">
            {mode === "create" ? (
              <>
                Already registered on Splitify?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setMessage("");
                  }}
                >
                  Sign in instead
                </button>
              </>
            ) : (
              <>
                New to Splitify?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("create");
                    setMessage("");
                  }}
                >
                  Create an account
                </button>
              </>
            )}
          </p>

          <div className="secure-note">
            <Check size={13} />
            <span>
              Your details are protected and encrypted.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
