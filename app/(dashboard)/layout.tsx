import Sidebar from "@/components/layout/sidebar";
import React from "react";

function DashboardLayout() {
  return (
    <main className="h-screen bg-slate-400 flex">
      <Sidebar />
    </main>
  );
}

export default DashboardLayout;
