import type { Level, Challenge, Badge } from "../types";

export const LEVELS: Level[] = [
  { id: 0, name: "Débutant", iconName: "Sprout", minXP: 0 },
  { id: 1, name: "Curieux", iconName: "Search", minXP: 100 },
  { id: 2, name: "Apprenti", iconName: "Music", minXP: 250 },
  { id: 3, name: "Chanteur", iconName: "Mic", minXP: 500 },
  { id: 4, name: "Musicien", iconName: "AudioWaveform", minXP: 1000 },
  { id: 5, name: "Intermédiaire", iconName: "Star", minXP: 1500 },
  { id: 6, name: "Confirmé", iconName: "Award", minXP: 2500 },
  { id: 7, name: "Expert", iconName: "Crown", minXP: 4000 },
  { id: 8, name: "Virtuose", iconName: "Sparkles", minXP: 6000 },
  { id: 9, name: "Maestro", iconName: "Trophy", minXP: 10000 },
];

export const CHALLENGES: Challenge[] = [
  { id: 0, iconName: "Wind", name: "Premier Souffle", desc: "Complétez le module Respiration", xp: 30, req: 0, type: "module", target: 0 },
  { id: 1, iconName: "Flame", name: "3 jours de suite", desc: "Pratiquez 3 jours consécutifs", xp: 50, req: 0, type: "streak", target: 3 },
  { id: 2, iconName: "Star", name: "Premier module", desc: "Terminez votre premier module", xp: 25, req: 0, type: "count", target: 1 },
  { id: 3, iconName: "Activity", name: "Gammes maîtrisées", desc: "Complétez le module Solfège", xp: 60, req: 150, type: "module", target: 9 },
  { id: 4, iconName: "Layers", name: "5 modules complétés", desc: "Terminez 5 modules au total", xp: 80, req: 150, type: "count", target: 5 },
  { id: 5, iconName: "Mic2", name: "Karaoké Star", desc: "Complétez un module Avancé", xp: 70, req: 350, type: "cat", target: "advanced" },
];

export const BADGES: Badge[] = [
  { id: "b1", iconName: "Milestone", name: "Premier pas", req: 1, type: "modules" },
  { id: "b2", iconName: "Music4", name: "Musicien", req: 5, type: "modules" },
  { id: "b3", iconName: "Flame", name: "Assidu", req: 3, type: "streak" },
  { id: "b4", iconName: "Mic", name: "Chanteur", req: 10, type: "modules" },
  { id: "b5", iconName: "Gem", name: "Cristal", req: 500, type: "xp" },
  { id: "b6", iconName: "Crown", name: "Royal", req: 1000, type: "xp" },
];
