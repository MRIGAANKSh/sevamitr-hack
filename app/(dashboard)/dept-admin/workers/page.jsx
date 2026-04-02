"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    // 🔐 Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    // 📥 Get dept admin info
    const { data: adminData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !adminData) {
      alert("Error fetching admin data");
      return;
    }

    setDepartment(adminData.department);

    // 👷 Get workers of same department
    const { data: workersData } = await supabase
      .from("workers")
      .select("*")
      .eq("department", adminData.department);

    setWorkers(workersData || []);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">
        {department} Workers
      </h1>

      {/* Workers Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        
        {workers.length === 0 ? (
          <p className="p-4 text-gray-500">
            No workers available
          </p>
        ) : (
          workers.map((worker) => (
            <div
              key={worker.id}
              className="flex justify-between items-center p-4 border-b hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold">{worker.email}</p>
                <p className="text-sm text-gray-500">
                  Created by: {worker.created_by}
                </p>
              </div>

              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                Active
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}