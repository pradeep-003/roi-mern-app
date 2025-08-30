import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/stocks"
          className="bg-blue-500 text-white p-6 rounded-xl shadow hover:bg-blue-600 text-center font-semibold"
        >
          Manage Stocks
        </Link>

        <Link
          to="/admin/withdraws"
          className="bg-yellow-500 text-white p-6 rounded-xl shadow hover:bg-yellow-600 text-center font-semibold"
        >
          Manage Withdrawals
        </Link>

        <Link
          to="/admin/payments"
          className="bg-green-500 text-white p-6 rounded-xl shadow hover:bg-green-600 text-center font-semibold"
        >
          Manage Payments
        </Link>

        <Link
          to="/admin/approved-payments"
          className=" bg-teal-500 text-white p-6 rounded-xl shadow hover:bg-teal-600 text-center font-semibold"
        >
          Approved Payments
        </Link>
        <Link
          to="/admin/rejected-payments"
          className=" bg-pink-500 text-white p-6 rounded-xl shadow hover:bg-pink-600 text-center font-semibold"
        >
          Rejected Payments
        </Link>

        <Link
          to="/admin/upi"
          className="bg-purple-500 text-white p-6 rounded-xl shadow hover:bg-purple-600 text-center font-semibold"
        >
          Manage UPI/QR
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
