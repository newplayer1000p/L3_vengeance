import React from "react";
import { useProgress } from "../context/ProgressContext";
import { Globe, RefreshCw, Smartphone } from "lucide-react";
import { cn } from "../lib/utils";

const LANGUAGES = [
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "es", label: "Español", flag: "🇪🇸" },
];

export function Settings() {
  const { language, setLanguage } = useProgress();

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.")) {
      localStorage.removeItem("vocalpro_state");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
          Paramètres
        </h1>
        <p className="text-slate-400 mt-1">Préférences et gestion du compte</p>
      </header>

      <div className="space-y-6">
        {/* Language */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">Langue de l'application</h3>
          </div>
          <div className="p-4 space-y-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-colors",
                  language === lang.id
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </div>
                {language === lang.id && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_theme(colors.indigo.500)]" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Display Info */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-200">Interface & Thème</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-400">
              L'application s'adapte automatiquement à votre écran. Le mode Sombre est activé par défaut pour économiser la batterie et offrir une expérience optimale de concentration.
            </p>
          </div>
        </section>

        {/* Reset Data */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-200">Zone de danger</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-400 mb-4">
              Effacer vos données supprimera vos points d'XP, vos modules complétés et votre série.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold rounded-xl hover:bg-rose-500/20 hover:border-rose-500/30 transition-colors w-full md:w-auto"
            >
              Réinitialiser la progression
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
