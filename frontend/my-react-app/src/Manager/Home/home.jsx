import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api.js";
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
        arrow: (
            <path d="M5 12h14M13 6l6 6-6 6" />
        ),
        check: <path d="m5 12 4 4L19 6" />,
    };

    return <svg {...common}>{paths[name] || null}</svg>;
}

export default function Splitfy({ onLogin, initialMessage = "" }) {
    const [activeTab, setActiveTab] = useState("signup");

    const [showPassword, setShowPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMessage(initialMessage);
    }, [initialMessage]);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        accepted: false,
    });

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
    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setMessage("");

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

        }

        // SIGNIN VALIDATION
        if (!form.email.trim()) {
            setMessage("Enter your email address to continue.");
            return;
        }

        if (!form.email.includes("@")) {
            setMessage("Please enter a valid email address.");
            return;
        }

        if (!form.password.trim()) {
            setMessage("Enter your password.");
            return;
        }

        setIsSubmitting(true);
        setMessage(
            activeTab === "signup"
                ? "Connecting to Splitfy. The service may take a little longer to start."
                : "Connecting to Splitfy..."
        );

        try {
            const response = activeTab === "signup"
                ? await apiRequest("/auth/register", {
                    method: "POST",
                    body: {
                        name: form.fullName.trim(),
                        email: form.email.trim(),
                        password: form.password,
                        phone: form.mobile.trim(),
                        role: "admin",
                    },
                })
                : await apiRequest("/auth/login", {
                    method: "POST",
                    body: {
                        email: form.email.trim(),
                        password: form.password,
                    },
                });

            if (!response.token || !response._id || !response.role) {
                throw new Error("The server did not return a valid authenticated user.");
            }

            if (typeof onLogin === "function") {
                onLogin(response, response.token);
            }
        } catch (requestError) {
            console.error(
                activeTab === "signup"
                    ? "Account registration request failed."
                    : "Account sign-in request failed.",
                requestError
            );
            setMessage(
                requestError?.status === null
                    ? "We couldn't reach Splitfy. The service may be waking up; wait a moment, then try again."
                    : requestError?.message || "Unable to authenticate your account."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    // Switch between signup and signin
    function switchTab(tab) {
        setActiveTab(tab);
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

                    </header>

                    <div className="hero-copy">

                        <h1>
                            Split Smart.
                            <span>Live Stress-Free.</span>
                        </h1>

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

                    <div className="portal-heading">
                        <span>GROUP LEADER / MANAGER PORTAL</span>
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
                                    Create a Group Leader account to manage your room, members, bills, and expenses.
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
                                    <p className="form-message" role="status" aria-live="polite">
                                        {message}
                                    </p>
                                )}

                                <button
                                    className="submit-button"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating account..." : "Create Free Account"}
                                    {!isSubmitting && <Icon name="arrow" size={17} />}
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
                                    Enter your email and password to review dues
                                    and pay bills instantly.
                                </p>

                            </div>

                            <form onSubmit={handleSubmit} noValidate>

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

                                <p className="field-note">
                                    Normal tenants can login directly to review dues
                                    without setting up a property portfolio.
                                </p>

                                <div className="login-label-row">

                                    <label
                                        className="field-label"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>

                                </div>

                                <div className="input-wrap">

                                    <Icon name="lock" size={15} />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showLoginPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={form.password}
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

                                {message && (
                                    <p className="form-message" role="status" aria-live="polite">
                                        {message}
                                    </p>
                                )}

                                <button
                                    className="submit-button"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Signing in..." : "Sign In & Review Dues"}
                                    {!isSubmitting && <Icon name="arrow" size={17} />}
                                </button>

                            </form>

                            <p className="form-footer">
                                Don&apos;t have a Group Leader account?{" "}

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