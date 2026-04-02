"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SuperAdmin() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // ✅ FIX: use getSession instead of getUser
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // 🔍 Get role
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !userData) {
        console.error(error);
        return;
      }

      if (userData.role !== "super_admin") {
        alert("Access Denied");
        window.location.href = "/login";
        return;
      }

      // 📊 Fetch all dept admins
      const { data: adminList } = await supabase
        .from("users")
        .select("*")
        .eq("role", "dept_admin");

      setAdmins(adminList || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        Super Admin Dashboard
      </h1>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (

        /* Stats */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Dept Admins
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {admins.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-600">
              Departments
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {new Set(admins.map(a => a.department)).size}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-600">
              Active System
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              ✔
            </p>
          </div>

        </div>

      )}
    </div>
  );
}