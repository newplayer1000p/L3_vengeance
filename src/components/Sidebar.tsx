import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Flame, User, Settings, Mic2 } from "lucide-react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Accueil" },
  { path: "/challenges", icon: Flame, label: "Défis" },
  { path: "/profile", icon: User, label: "Profil" },
  { path: "/settings", icon: Settings, label: "Réglages" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 px-4 py-8">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Mic2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
          VocalPro
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
