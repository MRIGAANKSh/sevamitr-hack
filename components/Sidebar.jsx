"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [role, setRole] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    setRole(data?.role);
  };

  const linkStyle = (path) =>
    `block px-3 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white shadow-xl p-6 flex flex-col">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10 text-blue-600">
        Dashboard
      </h1>

      <nav className="space-y-2 text-gray-700">

        {/* 👑 SUPER ADMIN */}
        {role === "super_admin" && (
          <>
            <Link href="/super-admin" className={linkStyle("/super-admin")}>
              Dashboard
            </Link>

            <Link href="/super-admin/create" className={linkStyle("/super-admin/create")}>
              Create Admin
            </Link>

            <Link href="/super-admin/admins" className={linkStyle("/super-admin/admins")}>
              All Admins
            </Link>
          </>
        )}

        {/* 🏢 DEPT ADMIN */}
        {role === "dept_admin" && (
          <>
            <Link href="/dept-admin" className={linkStyle("/dept-admin")}>
              Dashboard
            </Link>

            <Link href="/dept-admin/create-worker" className={linkStyle("/dept-admin/create-worker")}>
              Create Worker
            </Link>

            <Link href="/dept-admin/workers" className={linkStyle("/dept-admin/workers")}>
              View Workers
            </Link>
          </>
        )}

        {/* 👷 WORKER */}
        {role === "worker" && (
          <>
            <Link href="/worker" className={linkStyle("/worker")}>
              Dashboard
            </Link>
          </>
        )}

      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 text-sm text-gray-400">
        Role: {role || "Loading..."}
      </div>
    </div>
  );
}