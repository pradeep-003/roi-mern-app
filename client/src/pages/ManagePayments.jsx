import React, { useState, useEffect } from "react";
import API from "../api/axios";

function ManagePayments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await API.get("/payments");
    setPayments(res.data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/payments/${id}/status`, { status });

      setPayments((prev) => prev.filter((p) => p._id !== id));

      alert(`✅ Payment ${status}`);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Payments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ul>
          {payments
            .filter((p) => p.status === "pending") // ✅ show only pending
            .map((p) => (
              <li
                key={p._id}
                className="bg-white shadow-md p-4 rounded-lg mb-4"
              >
                <p>
                  <strong>User:</strong> {p.userId?.name} ({p.userId?.email})
                </p>
                <p>
                  <strong>Method:</strong> {p.method}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{p.amount}
                </p>
                <p>
                  <strong>Status:</strong> {p.status}
                </p>
                {p.screenshotUrl && (
                  <img
                    src={p.screenshotUrl}
                    alt="screenshot"
                    className="w-40 mt-2 rounded border"
                  />
                )}
                {/* Fallback for old records (optional) */}
                {!p.screenshotUrl && p.screenshot && (
                  <img
                    src={`http://localhost:5000/uploads/${p.screenshot}`}
                    alt="screenshot"
                    className="w-40 mt-2 rounded border"
                  />
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(p._id, "approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(p._id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default ManagePayments;
