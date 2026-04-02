"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Admins() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("role", "dept_admin");

    setAdmins(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Department Admins
      </h1>

      {/* Admins Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-100 px-6 py-3 font-semibold text-gray-600">
          <span>Email</span>
          <span>Department</span>
        </div>

        {admins.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            No admins found
          </div>
        ) : (
          admins.map((admin, index) => (
            <div
              key={admin.id}
              className={`px-6 py-4 flex justify-between items-center border-b transition hover:bg-gray-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <span className="text-gray-800 font-medium">{admin.email}</span>
              <span className="text-gray-500">{admin.department}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}