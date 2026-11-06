import { useState } from "react";
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

// Roommate Components
import RoommateSidebar from "./Roommate/Sidebar/sidebar.jsx";
import RoommateDashboard from "./Roommate/Dashboard/dashboard.jsx";
import Expense from "./Roommate/Expense/expense.jsx";
import Settlement from "./Roommate/Settlement/settlement.jsx";
import IssueReporter from "./Roommate/IssueReporter/reporter.jsx";
import Calculator from "./Roommate/Calculator/calculator.jsx";
import RoommateNavbar from "./Roommate/Navbar/navbar.jsx";

import "./App.css";

function AppContent() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Login according to selected role
  const handleLogin = (role) => {
    setUserRole(role);

    if (role === "manager") {
      navigate("/dashboard", { replace: true });
    } else if (role === "roommate") {
      navigate("/roommate", { replace: true });
    }
  };

  // Logout
  const handleLogout = () => {
    setUserRole(null);
    navigate("/", { replace: true });
  };

  // Home page
  if (!userRole) {
    return <Home onLogin={handleLogin} />;
  }

  // Manager Layout
  if (userRole === "manager") {
    return (
      <div className="app-layout">

        <ManagerSidebar onLogout={handleLogout} />

        <main className="main-content">

          {/* Only Manager Navbar */}
          <ManagerNavbar />

          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bills" element={<UtilityBills />} />
            <Route path="/members" element={<Members />} />
            <Route path="/payment" element={<PaymentSetup />} />
            <Route path="/expenses" element={<ExpenseManager />} />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>

        </main>
      </div>
    );
  }

  // Roommate Layout
  if (userRole === "roommate") {
    return (
      <div className="app-layout">

        <RoommateSidebar onLogout={handleLogout} />

        <main className="main-content">

          {/* Only Roommate Navbar */}
          <RoommateNavbar />

          <Routes>
            <Route path="/roommate" element={<RoommateDashboard />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/settlement" element={<Settlement />} />
            <Route path="/issue-reporter" element={<IssueReporter />} />
            <Route path="/calculator" element={<Calculator />} />

            <Route
              path="*"
              element={<Navigate to="/roommate" replace />}
            />
          </Routes>

        </main>
      </div>
    );
  }

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;