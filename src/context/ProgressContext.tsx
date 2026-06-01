import React, { createContext, useContext, useEffect, useState } from "react";
import { LEVELS } from "../data/levels";

interface ProgressState {
  xp: number;
  streak: number;
  completedModules: number[];
  language: string;
}

interface ProgressContextType extends ProgressState {
  addXp: (amount: number) => void;
  completeModule: (moduleId: number) => void;
  setLanguage: (lang: string) => void;
  currentLevel: typeof LEVELS[0];
  nextLevel: typeof LEVELS[0] | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem("vocalpro_state");
      if (saved) return JSON.parse(saved);
    } catch {}
    return { xp: 0, streak: 1, completedModules: [], language: "fr" };
  });

  useEffect(() => {
    localStorage.setItem("vocalpro_state", JSON.stringify(state));
  }, [state]);

  const addXp = (amount: number) => {
    setState((s) => ({ ...s, xp: s.xp + amount }));
  };

  const completeModule = (id: number) => {
    setState((s) => {
      if (s.completedModules.includes(id)) return s;
      return { ...s, completedModules: [...s.completedModules, id] };
    });
  };

  const setLanguage = (lang: string) => {
    setState((s) => ({ ...s, language: lang }));
  };

  let currentLevel = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (state.xp >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      break;
    }
  }
  const nextLevel = LEVELS.find((l) => l.minXP > state.xp) || null;

  return (
    <ProgressContext.Provider value={{ ...state, addXp, completeModule, setLanguage, currentLevel, nextLevel }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) throw new Error("useProgress must be used within a ProgressProvider");
  return context;
}
