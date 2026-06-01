import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <main className="flex-1 max-w-4xl mx-auto w-full pb-24 md:pb-8 relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
