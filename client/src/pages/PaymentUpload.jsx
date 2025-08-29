import React, { useEffect, useState } from "react";
import API from "../api/axios";

function PaymentUpload() {
  const [file, setFile] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [amount, setAmount] = useState("");
  const [payInfo, setPayInfo] = useState(null);

  useEffect(() => {
    API.get("/payments/method").then((res) => setPayInfo(res.data || null));
  }, []);

  const handleUpload = async () => {
    if (!file || !amount) return alert("Amount and screenshot are required");

    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("method", method);
    formData.append("amount", amount);

    await API.post("/payments/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("✅ Payment uploaded!");
    setFile(null);
    setAmount("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Payment Screenshot</h1>

      {/* Show UPI/QR set by Admin */}
      {payInfo && (payInfo.upiId || payInfo.qrImage) && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-md">
          <p className="font-semibold mb-2">Pay to:</p>
          {payInfo.upiId && (
            <p className="mb-2">
              UPI: <span className="font-mono">{payInfo.upiId}</span>
            </p>
          )}
          {payInfo.qrImage && (
            <img
              src={`http://localhost:5000/uploads/${payInfo.qrImage}`}
              alt="QR"
              className="w-48 border rounded"
            />
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <label className="block mb-1 font-semibold">Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <label className="block mb-1 font-semibold">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="UPI">UPI</option>
          <option value="QR">QR</option>
        </select>

        <label className="block mb-1 font-semibold">Upload Screenshot</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default PaymentUpload;
