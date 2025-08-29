import React, { useEffect, useState } from "react";
import API from "../api/axios";

function ManageUPI() {
  const [upiId, setUpiId] = useState("");
  const [qrFile, setQrFile] = useState(null);
  const [settings, setSettings] = useState(null);

  // Load existing UPI/QR
  useEffect(() => {
    API.get("/payments/method").then((res) => {
      if (res.data) {
        setSettings(res.data);
        setUpiId(res.data.upiId || "");
      }
    });
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    if (upiId) formData.append("upiId", upiId);
    if (qrFile) formData.append("qrImage", qrFile);

    await API.post("/payments/method", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("✅ UPI/QR updated successfully!");
    setQrFile(null);

    // Refresh data
    const res = await API.get("/payments/method");
    setSettings(res.data);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage UPI / QR</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-md">
        <label className="block mb-2 font-semibold">UPI ID</label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          placeholder="e.g. name@bank"
        />

        <label className="block mb-2 font-semibold">Upload QR Code</label>
        <input
          type="file"
          onChange={(e) => setQrFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>

      {settings && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow max-w-md">
          <h2 className="text-xl font-semibold mb-2">Current Payment Info</h2>
          {settings.upiId && (
            <p>
              UPI: <span className="font-mono">{settings.upiId}</span>
            </p>
          )}
          {settings.qrImageUrl && (
            <img
              src={settings.qrImageUrl}
              alt="QR"
              className="w-40 mt-2 border rounded"
            />
          )}
          {!settings.qrImageUrl && settings.qrImage && (
            <img
              src={`http://localhost:5000/uploads/${settings.qrImage}`}
              alt="QR"
              className="w-40 mt-2 border rounded"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ManageUPI;
