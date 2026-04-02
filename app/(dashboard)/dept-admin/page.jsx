"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DeptAdmin() {
  const [department, setDepartment] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

      // 📥 Get dept admin info
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        console.error(userError);
        return;
      }

      setDepartment(userData.department);

      // 📊 Get reports
      const { data: reportsData, error: reportError } = await supabase
        .from("reports")
        .select("*")
        .eq("department", userData.department);

      if (reportError) {
        console.error(reportError);
        return;
      }

      setReports(reportsData || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Department: {department || "Loading..."}
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of reports for your department
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (

        /* Empty State */
        <div className="text-center text-gray-500 py-20 bg-white rounded-2xl shadow">
          No reports available
        </div>

      ) : (

        /* Reports Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {report.title}
              </h3>

              <p className="text-gray-500 mb-2">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    report.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {report.status}
                </span>
              </p>

              <p className="text-gray-400 text-sm">
                Created:{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

      )}
    </div>
  );
}