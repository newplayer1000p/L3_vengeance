export interface Level {
  id: number;
  name: string;
  iconName: string;
  minXP: number;
}

export interface Step {
  type: "breath" | "piano_ex" | "scales" | "humming" | "tech" | "video" | "recorder" | "quiz" | "metronome" | "pitch" | "done";
  name?: string;
  desc?: string;
  list?: string[];
  syls?: string[];
  url?: string;
  q?: string;
  opts?: string[];
  ok?: number;
  tempo?: number;
  sequence?: string[];
}

export interface Module {
  id: number;
  name: string;
  iconName: string;
  xp: number;
  cat: "warmup" | "technique" | "solfege" | "advanced";
  steps: Step[];
}

export interface Challenge {
  id: number;
  iconName: string;
  name: string;
  desc: string;
  xp: number;
  req: number; // XP required to unlock
  type: "module" | "streak" | "count" | "xp" | "cat";
  target: number | string;
}

export interface Badge {
  id: string;
  iconName: string;
  name: string;
  req: number;
  type: "modules" | "streak" | "xp";
}
