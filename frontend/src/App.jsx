import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Tenant Components
import Home from "./components/Home/home.jsx";
import Dashboard from "./components/Dashboard/dashboard.jsx";
import MonthlyInvoice from "./components/Monthlyinvoice/monthlyinvoice.jsx";
import PaymentDashboard from "./components/Payment/payment.jsx";
import Cash from "./components/Cash/cash.jsx";
import Sidebar from "./components/Sidebar/sidebar.jsx";
import Navbar from "./components/Navbar/navbar.jsx";
import Rent from "./components/Rent/rent.jsx";
import Digital from "./components/Digital/digital.jsx";

// Landlord Components
import AdminSidebar from "./Admin/Sidebar/sidebar.jsx";
import Analytics from "./Admin/Analytics/analytics.jsx";
import InvoiceGenerator from "./Admin/InvoiceGenerator/invoice.jsx";
import Verification from "./Admin/Verification/verifiaction.jsx";
import TenantVault from "./Admin/TenantVault/tenant.jsx";
import DefermentRequests from "./Admin/DefermentRequests/defrement.jsx";
import QuickCollection from "./Admin/QuickCollection/collection.jsx";
import CashVerification from "./Admin/CashVerification/cash.jsx";
import Maintenance from "./Admin/Maintenance/maintenance.jsx";

// Manager Components
import ManagerSidebar from "./Manager/Sidebar/sidebar.jsx";
import ManagerOverview from "./Manager/Overview/overview.jsx";
import CashExpense from "./Manager/AddExpense/expenses.jsx";
import AbsenceCalculator from "./Manager/AbsenceCalculator/calculator.jsx";
import AuditBills from "./Manager/AuditBills/bills.jsx";
import IssueReporter from "./Manager/IssueReporter/reporter.jsx";
import MyLedger from "./Manager/MyLedger/ledger.jsx";
import SettlementHub from "./Manager/SettlementHub/settelment.jsx";

// Roommate Components
import RoommateSidebar from "./Rommate/Sidebar/sidebar.jsx";
import RoommateDashboard from "./Rommate/Dashboard/dashboard.jsx";
import RoommateBills from "./Rommate/Bills/bills.jsx";
import RoommateExpense from "./Rommate/Expense/expense.jsx";
import RoommateExpenseManager from "./Rommate/Expensemanager/manager.jsx";
import RoommateMember from "./Rommate/Member/member.jsx";
import RoommatePayment from "./Rommate/Payment/payment.jsx";
import RoommateAnalytics from "./Rommate/Analytics/analytics.jsx";
import RoommateAudit from "./Rommate/Audit/audit.jsx";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const roleConfig = {
    tenant: { portal: "rental", label: "Tenant" },
    landlord: { portal: "rental", label: "Landlord" },
    roommate: { portal: "student", label: "Roommate" },
    manager: { portal: "student", label: "Manager" },
  };

  const handleLogin = (userData) => {
    const { password, ...safeUserData } = userData;
    const role = roleConfig[safeUserData.role];

    if (!role || role.portal !== safeUserData.portal) {
      alert("Invalid portal or role selection.");
      return;
    }

    setUser(safeUserData);
    navigate(`/${safeUserData.role}`);
  };

  const handleNavigation = (page) => {
    if (!user) return;

    if (page === "dashboard" || page === "/manager") {
      navigate(`/${user.role}`);
      return;
    }

    navigate(page.startsWith("/") ? page : `/${page}`);
  };

  const handleClaimPayment = () => {
    navigate("/cash");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <Home onLogin={handleLogin} />;
  }

  const isTenant = user.role === "tenant";
  const isLandlord = user.role === "landlord";
  const isManager = user.role === "manager";
  const isRoommate = user.role === "roommate";

  const currentRole = roleConfig[user.role];

  return (
    <div
      className={`app-layout ${
        isLandlord ? "app-layout--landlord" : ""
      } ${
        isRoommate ? "app-layout--roommate" : ""
      }`}
    >
      {/* Sidebar */}
      {isLandlord ? (
        <AdminSidebar
          onNavigate={handleNavigation}
          onLogout={handleLogout}
        />
      ) : isRoommate ? (
        <RoommateSidebar
          onNavigate={handleNavigation}
          activeItem="Dashboard"
          user={user}
        />
      ) : isManager ? (
        <ManagerSidebar
          onNavigate={handleNavigation}
          activeItem="Dashboard"
          user={user}
        />
      ) : (
        <Sidebar
          mode={currentRole.label}
          onNavigate={handleNavigation}
        />
      )}

      <main className="app-content">

        {/* Navbar - Hidden for Roommate */}
        {!isRoommate && (
          <Navbar
            onClaimPayment={isTenant ? handleClaimPayment : undefined}
            user={user}
            onLogout={handleLogout}
          />
        )}

        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={`/${user.role}`} replace />}
          />

          {/* Tenant Dashboard */}
          <Route
            path="/tenant"
            element={
              isTenant ? <Dashboard /> : <Navigate to={`/${user.role}`} replace />
            }
          />

          {/* Landlord Dashboard */}
          <Route
            path="/landlord"
            element={
              isLandlord ? <Analytics /> : <Navigate to={`/${user.role}`} replace />
            }
          />

          {/* Landlord Pages */}
          <Route
            path="/landlord/invoice-generator"
            element={isLandlord ? <InvoiceGenerator /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/landlord/payment-verification"
            element={isLandlord ? <Verification /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/landlord/tenant-vault"
            element={isLandlord ? <TenantVault /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/landlord/deferment-requests"
            element={isLandlord ? <DefermentRequests /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/landlord/quick-collection"
            element={isLandlord ? <QuickCollection /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/landlord/cash-verification"
            element={isLandlord ? <CashVerification /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/landlord/maintenance"
            element={isLandlord ? <Maintenance /> : <Navigate to={`/${user.role}`} replace />}
          />

          {/* Roommate Dashboard */}
          <Route
            path="/roommate"
            element={isRoommate ? <RoommateDashboard /> : <Navigate to={`/${user.role}`} replace />}
          />

          {/* Roommate Pages */}
          <Route
            path="/roommate/bills"
            element={isRoommate ? <RoommateBills /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/roommate/expense"
            element={isRoommate ? <RoommateExpense /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/roommate/member"
            element={isRoommate ? <RoommateMember /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/roommate/payment"
            element={isRoommate ? <RoommatePayment /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/roommate/analytics"
            element={isRoommate ? <RoommateAnalytics /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/roommate/expense-manager"
            element={isRoommate ? <RoommateExpenseManager /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/roommate/audit"
            element={isRoommate ? <RoommateAudit /> : <Navigate to={`/${user.role}`} replace />}
          />

          {/* Manager Dashboard */}
          <Route
            path="/manager"
            element={isManager ? <ManagerOverview /> : <Navigate to={`/${user.role}`} replace />}
          />

          {/* Tenant Pages */}
          <Route
            path="/invoice"
            element={isTenant ? <MonthlyInvoice /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/payment"
            element={isTenant ? <PaymentDashboard /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/cash"
            element={isTenant ? <Cash /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/extension"
            element={isTenant ? <Rent /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/lease"
            element={isTenant ? <Digital /> : <Navigate to={`/${user.role}`} replace />}
          />

          {/* Manager Pages */}
          <Route
            path="/add-expense"
            element={isManager ? <CashExpense /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/absence-calculator"
            element={isManager ? <AbsenceCalculator /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/issue-reporter"
            element={isManager ? <IssueReporter /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/settlement-hub"
            element={isManager ? <SettlementHub /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/ledger"
            element={isManager ? <MyLedger /> : <Navigate to={`/${user.role}`} replace />}
          />
          <Route
            path="/audit-bills"
            element={isManager ? <AuditBills /> : <Navigate to={`/${user.role}`} replace />}
          />

          {/* Unknown Routes */}
          <Route
            path="*"
            element={<Navigate to={`/${user.role}`} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;