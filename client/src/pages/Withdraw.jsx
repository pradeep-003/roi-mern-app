import React from "react";
import API from "../api/axios";

function Withdraw() {
  const handleWithdraw = async () => {
    try {
      const res = await API.post("/withdraw");
      alert("✅ " + res.data.message);
    } catch (err) {
      alert("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-md p-6 rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Withdraw Funds</h1>
        <button
          onClick={handleWithdraw}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Request Withdraw
        </button>
      </div>
    </div>
  );
}

export default Withdraw;
