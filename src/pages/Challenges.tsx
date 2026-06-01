import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { CHALLENGES, BADGES } from "../data/levels";
import { Icon } from "../components/Icon";
import { cn } from "../lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

export function Challenges() {
  const { xp, streak, completedModules } = useProgress();

  const getProgress = (target: string | number, type: string) => {
    if (type === "module") return completedModules.includes(target as number) ? 100 : 0;
    if (type === "count") return Math.min((completedModules.length / (target as number)) * 100, 100);
    if (type === "streak") return Math.min((streak / (target as number)) * 100, 100);
    if (type === "xp") return Math.min((xp / (target as number)) * 100, 100);
    return 0; // fallback
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-400">
          Défis & Récompenses
        </h1>
        <p className="text-slate-400 mt-1">Complétez des défis pour gagner de l'XP</p>
      </header>

      {/* Challenges List */}
      <section className="space-y-4 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Missions en cours</h2>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>

        {CHALLENGES.map((ch) => {
          const isLocked = xp < ch.req;
          const prog = getProgress(ch.target, ch.type);
          const isDone = prog >= 100;

          return (
            <div
              key={ch.id}
              className={cn(
                "relative p-5 bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300",
                isDone ? "border-emerald-500/30" : isLocked ? "border-slate-800 opacity-60" : "border-slate-800",
              )}
            >
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  isDone ? "bg-emerald-500" : isLocked ? "bg-slate-700" : "bg-orange-500"
                )}
              />
              <div className="flex items-start md:items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  isDone ? "bg-emerald-500/10 text-emerald-400" : isLocked ? "bg-slate-800 text-slate-500" : "bg-orange-500/10 text-orange-400"
                )}>
                  <Icon name={ch.iconName} className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className={cn("text-base font-bold", isDone ? "text-emerald-400" : "text-slate-200")}>
                    {ch.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{ch.desc}</p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-bold text-indigo-400">+{ch.xp} XP</span>
                  <div className="mt-1">
                    {isDone ? (
                      <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terminé
                      </span>
                    ) : isLocked ? (
                      <span className="text-xs font-medium bg-slate-800 text-slate-400 px-2 py-1 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Lv Requis
                      </span>
                    ) : (
                      <span className="text-xs font-medium bg-orange-500/10 text-orange-400 px-2 py-1 rounded-md">
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!isLocked && !isDone && (
                <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-1000"
                    style={{ width: `${prog}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Badges Grid */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Badges Collectionnés</h2>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const val = badge.type === "modules" ? completedModules.length : badge.type === "streak" ? streak : xp;
            const isEarned = val >= badge.req;

            return (
              <div
                key={badge.id}
                className={cn(
                  "p-4 flex flex-col items-center justify-center text-center bg-slate-900 border rounded-2xl transition-all duration-300",
                  isEarned ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "border-slate-800 opacity-50 grayscale"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                  isEarned ? "bg-amber-500/20 text-amber-500" : "bg-slate-800 text-slate-400"
                )}>
                  <Icon name={badge.iconName} className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">{badge.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Objectif: {badge.req}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
