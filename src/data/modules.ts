import type { Module } from "../types";

// Contains a representative subset of modules for the prototype.
// Modular architecture allows easy expansion.
export const MODULES: Module[] = [
  {
    id: 0,
    name: "Échauffement I — Respiration",
    iconName: "Thermometer",
    xp: 20,
    cat: "warmup",
    steps: [
      { type: "breath" },
      { type: "piano_ex", name: "Piano suit — DO MI SOL", desc: "Le piano joue la mélodie — chantez chaque note immédiatement !", sequence: ["DO", "MI", "SOL", "MI", "DO"], tempo: 900 },
      { type: "scales" },
      { type: "humming" },
      { type: "quiz", q: "Pourquoi échauffer la voix avant de chanter ?", opts: ["Pour fatiguer les cordes vocales", "Pour préparer et assouplir les cordes vocales", "Pour chanter plus fort"], ok: 1 },
      { type: "done" }
    ]
  },
  {
    id: 1,
    name: "Respiration & Souffle",
    iconName: "Wind",
    xp: 25,
    cat: "warmup",
    steps: [
      { type: "breath" },
      {
        type: "tech", name: "Respiration costale",
        desc: "La respiration costale utilise le diaphragme pour maximiser le souffle. C'est la technique de base de tout chanteur professionnel.",
        list: ["Posez une main sur le ventre", "Inspirez lentement — sentez le ventre gonfler", "Expirez sur 8 temps en faisant 'Ssss'", "Ne levez jamais les épaules", "Répétez 5 fois en augmentant la durée"],
        syls: ["Ssss", "Ffff", "Hhhh", "Vvvv"]
      },
      { type: "video", name: "Tutoriel — Maîtriser sa Respiration", desc: "Suivez ces conseils vidéo indispensables pour libérer votre diaphragme.", url: "https://www.youtube.com/watch?v=FALUqC2zU8c" },
      { type: "piano_ex", name: "Piano — Gamme montante", desc: "Suivez le piano note par note en chantant sur AH !", sequence: ["DO", "RÉ", "MI", "FA", "SOL"], tempo: 1000 },
      { type: "metronome" },
      { type: "quiz", q: "Quelle partie du corps actionne la respiration diaphragmatique ?", opts: ["Les épaules", "Le diaphragme", "La gorge"], ok: 1 },
      { type: "done" }
    ]
  },
  {
    id: 2,
    name: "Projection vocale",
    iconName: "Megaphone",
    xp: 30,
    cat: "technique",
    steps: [
      { type: "breath" },
      {
        type: "tech", name: "Projection depuis le diaphragme",
        desc: "La projection permet d'être entendu sans forcer la gorge. Elle vient du diaphragme — jamais du cou ou de la gorge.",
        list: ["Tenez-vous droit, pieds écartés à la largeur des épaules", "Main sur le diaphragme", "Inspirez profondément par le ventre", "Dites 'HA !' en poussant avec le diaphragme", "Sentez la vibration résonner dans la poitrine"],
        syls: ["HA !", "HO !", "HE !", "HI !"]
      },
      { type: "video", name: "Cours — Projeter sa Voix", desc: "Une explication physique et pratique pour chanter fort sans détruire ses cordes vocales.", url: "https://www.youtube.com/watch?v=8bAs5AWhI0I" },
      { type: "pitch" },
      { type: "quiz", q: "D'où doit venir la projection vocale ?", opts: ["De la gorge", "Du diaphragme", "Du nez"], ok: 1 },
      { type: "done" }
    ]
  },
  {
    id: 3,
    name: "Lip Trills — Vibration",
    iconName: "Smile",
    xp: 30,
    cat: "warmup",
    steps: [
      { type: "breath" },
      {
        type: "tech", name: "Lip Trills",
        desc: "Les lip trills massent les cordes vocales en douceur. Ils relâchent la gorge et préparent la voix sans fatigue.",
        list: ["Relâchez complètement les lèvres et la gorge", "Soufflez de l'air en faisant vibrer les lèvres (brrrr)", "Montez et descendez en gamme sur les trilles", "Pratiquez 3 minutes sans jamais forcer"],
        syls: ["brrrr", "BRRR", "prrrr"]
      },
      { type: "metronome" },
      { type: "recorder" },
      { type: "done" }
    ]
  },
  {
    id: 8,
    name: "Solfège — Do Ré Mi",
    iconName: "Music",
    xp: 40,
    cat: "solfege",
    steps: [
      { type: "scales" },
      {
        type: "tech", name: "Do Ré Mi Fa Sol La Si",
        desc: "Le solfège est la base de tout musicien. Chaque note a une couleur sonore unique.",
        list: ["DO — note fondamentale", "RÉ — un ton au-dessus", "MI — un ton au-dessus du RÉ", "FA — note pivot", "SOL — quinte de la gamme", "LA — base du diapason", "SI — note sensible"],
        syls: ["DO", "RÉ", "MI", "FA", "SOL", "LA", "SI"]
      },
      { type: "pitch" },
      { type: "quiz", q: "Quelle note vient après SOL dans la gamme ?", opts: ["FA", "LA", "SI"], ok: 1 },
      { type: "done" }
    ]
  },
  {
    id: 15,
    name: "Vibrato & Ornements",
    iconName: "AudioLines",
    xp: 55,
    cat: "advanced",
    steps: [
      { type: "tech", name: "Maîtriser le vibrato", desc: "Le vibrato est une légère oscillation naturelle.", list: ["Relâchez la gorge", "Chantez une note tenue longue", "Laissez la voix osciller"], syls: ["AH~", "OH~"] },
      { type: "recorder" },
      { type: "done" }
    ]
  }
] as any; // Type override for the prototype to map perfectly to Step array
