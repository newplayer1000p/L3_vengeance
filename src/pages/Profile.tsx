import React from "react";
import { useProgress } from "../context/ProgressContext";
import { CHALLENGES, BADGES } from "../data/levels";
import { User, Trophy, Flame, PlayCircle, Award, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export function Profile() {
  const { xp, streak, currentLevel, nextLevel, completedModules } = useProgress();
  const navigate = useNavigate();

  const totalBadgesEarned = BADGES.filter((b) => {
    const val = b.type === "modules" ? completedModules.length : b.type === "streak" ? streak : xp;
    return val >= b.req;
  }).length;

  const totalChallengesDone = CHALLENGES.filter((ch) => {
    let prog = 0;
    if (ch.type === "module") prog = completedModules.includes(ch.target as number) ? 100 : 0;
    else if (ch.type === "count") prog = Math.min((completedModules.length / (ch.target as number)) * 100, 100);
    else if (ch.type === "streak") prog = Math.min((streak / (ch.target as number)) * 100, 100);
    else if (ch.type === "xp") prog = Math.min((xp / (ch.target as number)) * 100, 100);
    else prog = 0; // fallback simplified cat
    return prog >= 100;
  }).length;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 animate-fade-in">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
          Mon Profil
        </h1>
        <button onClick={() => navigate("/settings")} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Avatar & Level Summary */}
      <section className="flex flex-col items-center justify-center py-8 mb-8 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl shadow-indigo-500/20 mb-4 z-10">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 z-10">Vocal Artist</h2>
        <p className="text-slate-400 font-medium mt-1 z-10 flex items-center gap-2">
          {currentLevel.name}
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          <span className="text-indigo-400">{xp} XP</span>
        </p>
      </section>

      {/* Key Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Série jours", value: streak.toString(), icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "Modules finis", value: completedModules.length.toString(), icon: PlayCircle, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Défis réussis", value: totalChallengesDone.toString(), icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Badges", value: totalBadgesEarned.toString(), icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-2", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-200">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Architecture Plan Info */}
      <section className="mt-4 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl border-dashed">
        <h3 className="text-lg font-bold text-slate-300 mb-2">Évolutions futures</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          L'architecture de cette application est conçue pour être modulaire. L'intégration de la gestion de comptes personnalisés, de la sauvegarde Cloud et d'un tableau de bord de paiement pourra s'implémenter facilement au-dessus du <span className="text-indigo-400 font-mono">ProgressProvider</span>.
        </p>
      </section>
    </div>
  );
}
