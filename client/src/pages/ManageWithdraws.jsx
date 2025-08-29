import React, { useEffect, useState } from "react";
import API from "../api/axios";

function ManageWithdraws() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const res = await API.get("/withdraw");
    setRequests(res.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/withdraw/${id}/status`, { status });

      // ✅ Remove from list instantly
      setRequests((prev) => prev.filter((r) => r._id !== id));

      alert(`✅ Withdraw ${status}`);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Withdrawals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests
          .filter((w) => w.status === "pending") // ✅ only pending
          .map((w) => (
            <div key={w._id} className="bg-white shadow-md p-4 rounded-lg mb-4">
              <p>
                <strong>User:</strong> {w.userId?.name} ({w.userId?.email})
              </p>
              <p>
                <strong>Amount:</strong> ₹{w.amount}
              </p>
              <p>
                <strong>Status:</strong> {w.status}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(w._id, "approved")}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(w._id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ManageWithdraws;
