import { useState } from "react";
import "./home.css";

function Icon({ name, size = 16, className = "" }) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        "aria-hidden": true,
    };

    const paths = {
        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),
        building: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M9 21v-4h6v4M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01" />
            </>
        ),
        lock: (
            <>
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
            </>
        ),
        sparkles: (
            <>
                <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
                <path d="m19 14 1.1 2.4L22 17l-1.9.6L19 20l-.9-2.4L16 17l2.1-.6L19 14ZM5 3l.8 1.7L7.5 5l-1.7.8L5 7.5l-.8-1.7L2.5 5l1.7-.3L5 3Z" />
            </>
        ),
        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </>
        ),
        phone: (
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
        ),
        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        key: (
            <>
                <circle cx="8" cy="15" r="4" />
                <path d="m10.8 12.2 8-8 2 2-2 2 2 2-3 3-2-2-2 2" />
            </>
        ),
        arrow: (
            <path d="M5 12h14M13 6l6 6-6 6" />
        ),
        bolt: <path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z" />,
        check: <path d="m5 12 4 4L19 6" />,
    };

    return <svg {...common}>{paths[name] || null}</svg>;
}

export default function Splitfy({ onLogin }) {
    const [mode, setMode] = useState("roommate");
    const [activeTab, setActiveTab] = useState("signup");

    const [showPassword, setShowPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [useOtp, setUseOtp] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        mobile: "",
        inviteCode: "",
        password: "",
        identifier: "",
        loginPassword: "",
        accepted: false,
        remember: true,
    });

    const isManager = mode === "manager";

    // Update form fields
    function updateField(event) {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));

        setMessage("");
    }

    // Submit form
    function handleSubmit(event) {
        event.preventDefault();

        // SIGNUP VALIDATION
        if (activeTab === "signup") {
            if (
                !form.fullName.trim() ||
                !form.email.trim() ||
                !form.mobile.trim()
            ) {
                setMessage(
                    "Please complete your name, email, and mobile number."
                );
                return;
            }

            if (!form.email.includes("@")) {
                setMessage("Please enter a valid email address.");
                return;
            }

            if (form.password.length < 8) {
                setMessage(
                    "Your password must be at least 8 characters long."
                );
                return;
            }

            if (!form.accepted) {
                setMessage(
                    "Please accept the terms and privacy policy to continue."
                );
                return;
            }

            setMessage(
                "Your details look good. Signup API is not connected yet."
            );

            return;
        }

        // SIGNIN VALIDATION
        if (!form.identifier.trim()) {
            setMessage(
                "Enter your mobile number or CNIC to continue."
            );
            return;
        }

        if (!form.loginPassword.trim()) {
            setMessage(
                useOtp
                    ? "Enter the OTP sent to your phone."
                    : "Enter your password."
            );
            return;
        }

        // PASS SELECTED ROLE TO APP.JSX
        setMessage("");

        if (typeof onLogin === "function") {
            onLogin(mode);
        }
    }

    // Switch between signup and signin
    function switchTab(tab) {
        setActiveTab(tab);
        setMessage("");
    }

    // Change portal
    function switchMode(selectedMode) {
        setMode(selectedMode);
        setMessage("");
    }

    return (
        <main className="splitfy-page">

            {/* LEFT BRAND PANEL */}
            <section className="brand-panel" aria-label="About Splitfy">

                <div className="brand-inner">

                    <header className="brand-header">

                        <a
                            className="brand-logo"
                            href="#"
                            aria-label="Splitfy home"
                        >
                            <span className="logo-mark">S</span>

                            <span className="brand-name-wrap">
                                <strong>Splitfy</strong>
                                <small>
                                    Property &amp; Shared Living Platform - Pakistan
                                </small>
                            </span>
                        </a>

                        <span
                            className="status-light"
                            title="All systems operational"
                        />

                    </header>

                    <div className="hero-copy">

                        <div className="hero-badge">
                            <Icon name="bolt" size={13} />
                            <span>Instant Rent &amp; Bill Splitting</span>
                        </div>

                        <h1>
                            Split Smart.
                            <span>Live Stress-Free.</span>
                        </h1>

                        <p>
                            Smart rent splitting, utilities &amp; flatmate expenses
                            for shared living and property owners across Pakistan.
                        </p>

                    </div>

                    {/* FEATURE CARDS */}
                    <div className="feature-grid">

                        <article className="feature-card">

                            <div className="feature-top">

                                <span className="feature-icon aqua">
                                    <Icon name="users" size={20} />
                                </span>

                                <span className="feature-tag">
                                    Roommates
                                </span>

                            </div>

                            <h2>Hostel &amp; Flatmates</h2>

                            <p>
                                Fair grocery division, real-time shared balances
                                &amp; utility bill splits without the awkwardness.
                            </p>

                            <div className="mini-panel">

                                <div className="mini-row">
                                    <span>Wi-Fi &amp; Power Split</span>
                                    <b>PKR 12,500 / each</b>
                                </div>

                                <div className="progress-track">
                                    <span />
                                </div>

                                <div className="mini-row mini-bottom">
                                    <span>Instant Rent &amp; Bill Splitting</span>
                                    <b>Live Sync</b>
                                </div>

                            </div>

                        </article>

                        <article className="feature-card">

                            <div className="feature-top">

                                <span className="feature-icon peach">
                                    <Icon name="building" size={20} />
                                </span>

                                <span className="feature-tag enterprise">
                                    Enterprise
                                </span>

                            </div>

                            <h2>Landlord &amp; Assets</h2>

                            <p>
                                Instant rent collection, tenant records, and
                                automated monthly payment reminders.
                            </p>

                            <div className="mini-panel">

                                <div className="mini-row">
                                    <span>Portfolio Collection</span>
                                    <b>98.4%</b>
                                </div>

                                <div className="progress-track">
                                    <span className="progress-gold" />
                                </div>

                                <div className="mini-row mini-bottom">
                                    <span>
                                        Property &amp; Shared Living Platform - Pakistan
                                    </span>
                                    <b>Automated</b>
                                </div>

                            </div>

                        </article>

                    </div>

                    <div className="brand-decoration decoration-one" />
                    <div className="brand-decoration decoration-two" />

                </div>

            </section>

            {/* RIGHT AUTH PANEL */}
            <section className="form-panel" aria-label="Account access">

                <div
                    className={`auth-card ${
                        activeTab === "signup" ? "signup-card" : ""
                    }`}
                >

                    {/* PORTAL MODE */}
                    <div className="portal-heading">
                        <span>SELECT YOUR PORTAL MODE</span>
                        <span className="switch-hint">SWITCH ANYTIME</span>
                    </div>

                    <div
                        className="portal-switch"
                        role="group"
                        aria-label="Portal mode"
                    >

                        <button
                            type="button"
                            className={
                                mode === "roommate" ? "selected" : ""
                            }
                            onClick={() => switchMode("roommate")}
                            aria-pressed={mode === "roommate"}
                        >
                            <Icon name="users" size={14} />
                            Roommate
                        </button>

                        <button
                            type="button"
                            className={
                                mode === "manager" ? "selected" : ""
                            }
                            onClick={() => switchMode("manager")}
                            aria-pressed={mode === "manager"}
                        >
                            <Icon name="building" size={14} />
                            Manager
                        </button>

                    </div>

                    {/* AUTH TABS */}
                    <div
                        className="auth-tabs"
                        role="tablist"
                        aria-label="Account action"
                    >

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "signin"}
                            className={
                                activeTab === "signin" ? "active" : ""
                            }
                            onClick={() => switchTab("signin")}
                        >
                            <Icon name="lock" size={15} />
                            Sign In
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "signup"}
                            className={
                                activeTab === "signup" ? "active" : ""
                            }
                            onClick={() => switchTab("signup")}
                        >
                            <Icon name="sparkles" size={15} />
                            Create Account
                        </button>

                    </div>

                    {/* SIGNUP */}
                    {activeTab === "signup" ? (

                        <>
                            <div className="form-intro">

                                <h2>Create your Splitfy account</h2>

                                <p>
                                    Instant Rent &amp; Bill Splitting for{" "}
                                    {isManager
                                        ? "property owners"
                                        : "roommates"}{" "}
                                    across Pakistan.
                                </p>

                            </div>

                            <form onSubmit={handleSubmit} noValidate>

                                <label
                                    className="field-label"
                                    htmlFor="fullName"
                                >
                                    Full Name
                                </label>

                                <div className="input-wrap">

                                    <Icon name="users" size={15} />

                                    <input
                                        id="fullName"
                                        name="fullName"
                                        autoComplete="name"
                                        placeholder="e.g. Sarah Jenkins / Hamza Khan"
                                        value={form.fullName}
                                        onChange={updateField}
                                    />

                                </div>

                                <div className="two-columns">

                                    <div>

                                        <label
                                            className="field-label"
                                            htmlFor="email"
                                        >
                                            Email Address
                                        </label>

                                        <div className="input-wrap">

                                            <Icon name="mail" size={15} />

                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="name@domain.com"
                                                value={form.email}
                                                onChange={updateField}
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <label
                                            className="field-label"
                                            htmlFor="mobile"
                                        >
                                            Pakistani Mobile (+92)
                                        </label>

                                        <div className="input-wrap">

                                            <Icon name="phone" size={14} />

                                            <input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                autoComplete="tel"
                                                placeholder="+92 300 1234567"
                                                value={form.mobile}
                                                onChange={updateField}
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* INVITE CODE */}
                                <div className="invite-box">

                                    <div className="invite-heading">

                                        <span>
                                            <Icon name="key" size={14} />
                                            Have a Room Code or Unit Invite Link?
                                        </span>

                                        <small>Optional</small>

                                    </div>

                                    <div className="invite-input-row">

                                        <input
                                            name="inviteCode"
                                            aria-label="Room code or unit invite code"
                                            placeholder="ENTER CODE (E.G., SH-402)"
                                            value={form.inviteCode}
                                            onChange={updateField}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setMessage(
                                                    form.inviteCode.trim()
                                                        ? "Invite code saved. It will be checked when you create your account."
                                                        : "Enter a room or unit invite code first."
                                                )
                                            }
                                        >
                                            Validate
                                        </button>

                                    </div>

                                    <p>
                                        Enter your flatmate&apos;s room token to auto-join
                                        your Karachi, Lahore, or Islamabad home.
                                    </p>

                                </div>

                                {/* PASSWORD */}
                                <label
                                    className="field-label password-label"
                                    htmlFor="password"
                                >
                                    Create Secure Password
                                </label>

                                <div className="input-wrap">

                                    <Icon name="lock" size={15} />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="At least 8 characters"
                                        value={form.password}
                                        onChange={updateField}
                                    />

                                    <button
                                        type="button"
                                        className="input-action"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                    >
                                        <Icon name="eye" size={16} />
                                    </button>

                                </div>

                                {/* SECURITY METER */}
                                <div className="security-meter">

                                    <span
                                        className={
                                            form.password.length >= 8
                                                ? "secure"
                                                : ""
                                        }
                                    />

                                    <small>
                                        {form.password.length >= 8
                                            ? "Good security"
                                            : "Standard security"}
                                    </small>

                                </div>

                                {/* TERMS */}
                                <label className="checkbox-row">

                                    <input
                                        type="checkbox"
                                        name="accepted"
                                        checked={form.accepted}
                                        onChange={updateField}
                                    />

                                    <span>
                                        I agree to the{" "}
                                        <a href="#terms">
                                            Splitfy Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a href="#privacy">
                                            Privacy Policy
                                        </a>{" "}
                                        for Property &amp; Shared Living Platform - Pakistan.
                                    </span>

                                </label>

                                {message && (
                                    <p className="form-message" role="status">
                                        {message}
                                    </p>
                                )}

                                <button
                                    className="submit-button"
                                    type="submit"
                                >
                                    Create Free Account
                                    <Icon name="arrow" size={17} />
                                </button>

                            </form>

                            <p className="form-footer">
                                Already registered on Splitfy?{" "}

                                <button
                                    type="button"
                                    onClick={() => switchTab("signin")}
                                >
                                    Sign in instead
                                </button>
                            </p>

                        </>

                    ) : (

                        /* SIGN IN */
                        <>

                            <div className="form-intro">

                                <h2>Welcome back to Splitfy</h2>

                                <p>
                                    Enter your{" "}
                                    {isManager ? "registered" : "Pakistani"}{" "}
                                    mobile or CNIC to review dues and pay bills instantly.
                                </p>

                            </div>

                            <form onSubmit={handleSubmit} noValidate>

                                <label
                                    className="field-label"
                                    htmlFor="identifier"
                                >
                                    Pakistani Phone Number (+92) or 13-digit CNIC
                                </label>

                                <div className="input-wrap">

                                    <Icon name="phone" size={15} />

                                    <input
                                        id="identifier"
                                        name="identifier"
                                        autoComplete="username"
                                        placeholder="+92 300 1234567 or 42101-XXXXXXX-X"
                                        value={form.identifier}
                                        onChange={updateField}
                                    />

                                </div>

                                <p className="field-note">
                                    Normal tenants can login directly to review dues
                                    without setting up a property portfolio.
                                </p>

                                <div className="login-label-row">

                                    <label
                                        className="field-label"
                                        htmlFor="loginPassword"
                                    >
                                        Password or WhatsApp OTP
                                    </label>

                                    <button
                                        type="button"
                                        className="text-link"
                                        onClick={() =>
                                            setMessage(
                                                "Password reset instructions can be sent after you enter your mobile number."
                                            )
                                        }
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                <div className="input-wrap">

                                    <Icon name="lock" size={15} />

                                    <input
                                        id="loginPassword"
                                        name="loginPassword"
                                        type={
                                            showLoginPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        placeholder={
                                            useOtp
                                                ? "Enter WhatsApp OTP"
                                                : "Enter password or WhatsApp code"
                                        }
                                        value={form.loginPassword}
                                        onChange={updateField}
                                    />

                                    <button
                                        type="button"
                                        className="input-action"
                                        aria-label={
                                            showLoginPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowLoginPassword(
                                                (value) => !value
                                            )
                                        }
                                    >
                                        <Icon name="eye" size={16} />
                                    </button>

                                </div>

                                {/* LOGIN OPTIONS */}
                                <div className="login-options">

                                    <label className="checkbox-row remember-row">

                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={form.remember}
                                            onChange={updateField}
                                        />

                                        <span>
                                            Remember this device for 30 days
                                        </span>

                                    </label>

                                    <button
                                        type="button"
                                        className="otp-link"
                                        onClick={() => {
                                            setUseOtp((value) => !value);

                                            setMessage(
                                                useOtp
                                                    ? "Password sign-in selected."
                                                    : "WhatsApp OTP sign-in selected. Enter your mobile number to continue."
                                            );
                                        }}
                                    >
                                        <Icon name="mail" size={13} />

                                        {useOtp
                                            ? "Use password"
                                            : "Send WhatsApp OTP"}
                                    </button>

                                </div>

                                {message && (
                                    <p className="form-message" role="status">
                                        {message}
                                    </p>
                                )}

                                <button
                                    className="submit-button"
                                    type="submit"
                                >
                                    Sign In &amp; Review Dues
                                    <Icon name="arrow" size={17} />
                                </button>

                            </form>

                            <p className="form-footer">
                                Don&apos;t have an active roommate or tenant workspace?{" "}

                                <button
                                    type="button"
                                    onClick={() => switchTab("signup")}
                                >
                                    Create an account
                                </button>
                            </p>

                        </>

                    )}

                </div>

            </section>

        </main>
    );
}