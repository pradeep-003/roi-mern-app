// client/src/pages/Admin/ApprovedPayments.jsx
import React from "react";
import { useEffect, useState } from "react";
import API from "../api/axios";

const ApprovedPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/payments/approved")
      .then((res) => setPayments(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">✅ Approved Payments</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-green-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Screenshot</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="text-center">
              <td className="border p-2">{p.userId?.name}</td>
              <td className="border p-2">₹{p.amount}</td>
              <td className="border p-2">
                <a
                  href={`http://localhost:5000/uploads/${p.screenshot}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`http://localhost:5000/uploads/${p.screenshot}`}
                    alt="screenshot"
                    className="h-12 mx-auto"
                  />
                </a>
              </td>
              <td className="border p-2 text-green-600 font-bold">
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ApprovedPayments;
