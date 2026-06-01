import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Flame, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { useProgress } from "../context/ProgressContext";
import { MODULES } from "../data/modules";
import { Icon } from "../components/Icon";
import { cn } from "../lib/utils";

const CATEGORIES = [
  { id: "all", label: "Tout" },
  { id: "warmup", label: "Échauffement" },
  { id: "technique", label: "Technique" },
  { id: "solfege", label: "Solfège" },
  { id: "advanced", label: "Avancé" },
];

export function Dashboard() {
  const { xp, streak, currentLevel, nextLevel, completedModules } = useProgress();
  const [activeCat, setActiveCat] = useState("all");

  const filteredModules = activeCat === "all" ? MODULES : MODULES.filter((m) => m.cat === activeCat);

  const progressPercent = nextLevel ? ((xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
            Bonjour, Chanteur
          </h1>
          <p className="text-slate-400 mt-1">Prêt à entraîner votre voix ?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-500">{streak}</span>
          </div>
        </div>
      </header>

      {/* Level Banner */}
      <section className="mb-8 p-6 bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
              <Icon name={currentLevel.iconName} className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{currentLevel.name}</h2>
              <p className="text-sm text-indigo-300/80 font-medium">{xp} XP Total</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Niveau Actuel</span>
              <span>{nextLevel ? nextLevel.name : "Niveau Max"}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
              activeCat === cat.id
                ? "bg-indigo-500 text-white"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
            )}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Modules Grid */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Modules d'entraînement</h2>
          <div className="flex-1 h-px bg-slate-800"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            return (
              <Link
                to={`/exercise/${mod.id}`}
                key={mod.id}
                className={cn(
                  "group relative p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 overflow-hidden",
                  isCompleted && "border-emerald-500/20 bg-emerald-950/10"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"
                  )}>
                    <Icon name={mod.iconName} className="w-6 h-6" />
                  </div>
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Fait
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                      +{mod.xp} XP
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-1 group-hover:text-indigo-300 transition-colors">
                  {mod.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> {mod.steps.length} étapes
                </p>
                
                <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium text-indigo-400">Commencer</span>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
