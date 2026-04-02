"use client";

import { useState } from "react";

export default function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/create-user", {
      method: "POST",
      body: JSON.stringify({ email, password, department }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Admin Created Successfully");
      // Clear form after success
      setEmail("");
      setPassword("");
      setDepartment("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create Dept Admin
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition"
        >
          Create Admin
        </button>
      </div>
    </div>
  );
}