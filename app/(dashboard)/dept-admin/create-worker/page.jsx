"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreateWorker() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    // 🔐 Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("You are not logged in");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/create-worker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`, // ✅ FIX
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("✅ Worker Created Successfully");
      setEmail("");
      setPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px]">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Create Worker
        </h2>

        {/* Email Input */}
        <input
          value={email}
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Worker Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          value={password}
          type="password"
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Worker"}
        </button>

      </div>
    </div>
  );
}