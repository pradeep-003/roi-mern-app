import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function UserDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [roiData, setRoiData] = useState([]);
  const [buyAmount, setBuyAmount] = useState({}); // { [stockId]: amount }

  // 🔹 Buy Stock
  const buyStock = async (stockId) => {
    const amount = Number(buyAmount[stockId] || 0);
    if (!amount || amount <= 0) return alert("Enter a valid amount");

    try {
      await API.post(`/stocks/buy/${stockId}`, { amount });

      // refresh wallet & ROI
      const u = await API.get("/users/me");
      setWallet(u.data?.walletBalance || 0);
      const roi = await API.get("/roi");
      setRoiData(roi.data || []);

      setBuyAmount((prev) => ({ ...prev, [stockId]: "" }));
      alert("✅ Purchase completed");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  // 🔹 Sell Stock
  const sellStock = async (stockId, amount) => {
    try {
      const res = await API.post(`/stocks/sell/${stockId}`, { amount });
      alert(res.data.message);

      // refresh wallet & ROI
      const u = await API.get("/users/me");
      setWallet(u.data?.walletBalance || 0);
      const roi = await API.get("/roi");
      setRoiData(roi.data || []);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || err.message));
    }
  };

  // 🔹 Initial Data Fetch
  useEffect(() => {
    API.get("/users/me").then((res) => setWallet(res.data?.walletBalance || 0));
    API.get("/stocks").then((res) => setStocks(res.data));
    API.get("/roi")
      .then((res) => setRoiData(res.data))
      .catch(() => setRoiData([]));
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    logout(); // clears context + localStorage
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Wallet */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <p className="text-xl">
          💰 Wallet Balance: <span className="font-semibold">₹{wallet}</span>
        </p>
      </div>

      {/* Available Stocks */}
      <h2 className="text-2xl font-semibold mb-3">📊 Available Stocks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {stocks.map((s) => (
          <div
            key={s._id}
            className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{s.name}</h3>
              <p>
                ₹{s.price} | ROI {s.roiPercentage}%
              </p>
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={buyAmount[s._id] || ""}
              onChange={(e) =>
                setBuyAmount({ ...buyAmount, [s._id]: e.target.value })
              }
              className="border p-2 rounded w-28 mr-2"
            />
            <button
              onClick={() => buyStock(s._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Buy
            </button>
          </div>
        ))}
      </div>

      {/* ROI Data */}
      <h2 className="text-2xl font-semibold mb-3">
        📈 My Investments & Profit
      </h2>
      {roiData.length === 0 ? (
        <p className="text-gray-500">No investments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Stock</th>
                <th className="p-3">Amount</th>
                <th className="p-3">ROI %</th>
                <th className="p-3">Purchase Date</th>
                <th className="p-3">Profit</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {roiData.map((r, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{r.stock}</td>
                  <td className="p-3">₹{r.amount}</td>
                  <td className="p-3">{r.roiPercentage}%</td>
                  <td className="p-3">
                    {new Date(r.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    ₹{r.profit}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => sellStock(r.stockId, r.amount)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <Link
          to="/payment-upload"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 pointer-cursor"
        >
          Upload Payment
        </Link>
        <Link
          to="/withdraw"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 pointer-cursor"
        >
          Request Withdraw
        </Link>
      </div>
    </div>
  );
}

export default UserDashboard;
