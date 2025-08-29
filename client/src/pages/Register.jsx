import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("❌ " + err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-3 rounded mb-6"
        />

        <select
          type="role"
          name="role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border p-3 rounded mb-6"
        >
          <option value="user">USER</option>
          <option value="admin">ADMIN</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
