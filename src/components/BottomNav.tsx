import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Flame, User, Settings } from "lucide-react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Accueil" },
  { path: "/challenges", icon: Flame, label: "Défis" },
  { path: "/profile", icon: User, label: "Profil" },
  { path: "/settings", icon: Settings, label: "Réglages" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/60 z-50 px-2 pb-safe">
      <nav className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 gap-1 min-w-[64px]",
                isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
