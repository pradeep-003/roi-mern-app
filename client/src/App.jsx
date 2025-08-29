import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentUpload from "./pages/PaymentUpload";
import Withdraw from "./pages/Withdraw";
import ManageStocks from "./pages/ManageStocks";
import ManagePayments from "./pages/ManagePayments";
import ManageUPI from "./pages/ManageUPI";
import ApprovedPayments from "./pages/ApprovedPayments";
import RejectedPayments from "./pages/RejectedPayments";

function AppRoutes() {
  const { token, role } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Protected Routes */}
      <Route
        path="/dashboard"
        element={
          token && role === "user" ? (
            <UserDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/payment-upload"
        element={
          token && role === "user" ? (
            <PaymentUpload />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/withdraw"
        element={
          token && role === "user" ? <Withdraw /> : <Navigate to="/login" />
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          token && role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/stocks"
        element={
          token && role === "admin" ? (
            <ManageStocks />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/payments"
        element={
          token && role === "admin" ? (
            <ManagePayments />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/upi"
        element={
          token && role === "admin" ? <ManageUPI /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/admin/approved-payments"
        element={
          token && role === "admin" ? (
            <ApprovedPayments />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/rejected-payments"
        element={
          token && role === "admin" ? (
            <RejectedPayments />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
