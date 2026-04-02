"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Analytics() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data } = await supabase.from("reports").select("*");
    setReports(data);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Reports Analytics</h1>

      <div className="bg-white p-4 rounded shadow">
        Total Reports: {reports.length}
      </div>
    </div>
  );
}