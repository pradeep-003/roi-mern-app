import React, { useState, useEffect } from "react";
import API from "../api/axios";

function ManageStocks() {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({
    name: "",
    price: "",
    roiPercentage: "",
  });

  const fetchStocks = async () => {
    const res = await API.get("/stocks");
    setStocks(res.data);
  };

  const deleteStock = async (id) => {
    try {
      await API.delete(`/stocks/${id}`);
      fetchStocks(); // refresh list
      alert("🗑️ Stock Deleted!");
    } catch (err) {
      alert("❌ " + err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const addStock = async () => {
    await API.post("/stocks/add", newStock);
    fetchStocks();
    setNewStock({ name: "", price: "", roiPercentage: "" });
    alert("✅ Stock Added!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Stocks</h1>

      {/* Add Stock Form */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">➕ Add New Stock</h2>
        <input
          type="text"
          placeholder="Stock Name"
          value={newStock.name}
          onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="number"
          placeholder="Price"
          value={newStock.price}
          onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="number"
          placeholder="ROI %"
          value={newStock.roiPercentage}
          onChange={(e) =>
            setNewStock({ ...newStock, roiPercentage: e.target.value })
          }
          className="border p-2 rounded w-full mb-3"
        />
        <button
          onClick={addStock}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Add Stock
        </button>
      </div>

      {/* Stock List */}
      <h2 className="text-2xl font-semibold mb-3">📊 Existing Stocks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stocks.map((s) => (
          <div
            key={s._id}
            className="bg-white shadow-md p-4 rounded-lg flex justify-between"
          >
            <div>
              <h3 className="font-bold">{s.name}</h3>
              <p>
                ₹{s.price} | ROI {s.roiPercentage}%
              </p>
            </div>
            <button
              onClick={() => deleteStock(s._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageStocks;
