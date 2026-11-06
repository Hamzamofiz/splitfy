import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Home
import Home from "./Manager/Home/home.jsx";

// Manager Components
import ManagerSidebar from "./Manager/Sidebar/sidebar.jsx";
import Dashboard from "./Manager/Dashboard/dashboard.jsx";
import UtilityBills from "./Manager/UtilityBills/bills.jsx";
import Members from "./Manager/Members/members.jsx";
import PaymentSetup from "./Manager/Payment/payment.jsx";
import ExpenseManager from "./Manager/Expense/expense.jsx";
import ManagerNavbar from "./Manager/Navbar/navbar.jsx";

import { apiRequest, clearToken, getToken, setToken } from "./services/api.js";

import "./App.css";

function AppContent() {
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(Boolean(getToken()));
  const [sessionError, setSessionError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) return;

    let active = true;
    apiRequest("/auth/profile")
      .then((profile) => {
        if (!active) return;
        if (profile.role !== "admin") {
          clearToken();
          setSessionError("This web portal is for Group Leaders and Managers. Sign in with an admin account.");
          return;
        }
        setUser(profile);
      })
      .catch((error) => {
        if (!active) return;
        clearToken();
        setSessionError(error.message || "Unable to restore your session.");
      })
      .finally(() => {
        if (active) setSessionLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogin = (authenticatedUser, token) => {
    if (authenticatedUser.role !== "admin") {
      clearToken();
      setSessionError("This web portal is for Group Leaders and Managers. Sign in with an admin account.");
      return;
    }

    setToken(token);
    setUser(authenticatedUser);
    setSessionError("");

    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/", { replace: true });
  };

  if (sessionLoading) {
    return <main className="session-loading">Loading your Splitfy account…</main>;
  }

  if (!user) {
    return <Home onLogin={handleLogin} initialMessage={sessionError} />;
  }

  return (
    <div className="app-layout">
      <ManagerSidebar onLogout={handleLogout} user={user} />

      <main className="main-content">
        <ManagerNavbar user={user} onUserUpdated={setUser} />
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/bills" element={<UtilityBills user={user} />} />
          <Route path="/members" element={<Members user={user} />} />
          <Route path="/payment" element={<PaymentSetup user={user} />} />
          <Route path="/expenses" element={<ExpenseManager user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;