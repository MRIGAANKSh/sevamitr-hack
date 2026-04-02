"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Departments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("departments").select("*");
    setData(data);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Departments</h1>

      <div className="grid grid-cols-3 gap-4">
        {data?.map((dept) => (
          <div key={dept.id} className="bg-white p-4 rounded shadow">
            {dept.name}
          </div>
        ))}
      </div>
    </div>
  );
}