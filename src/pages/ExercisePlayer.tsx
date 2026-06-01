import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MODULES } from "../data/modules";
import { Step } from "../types";
import { useProgress } from "../context/ProgressContext";
import { ArrowLeft, Play, Square, Mic, MicOff, CheckCircle, Plus, Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { playBreathTick, playNote, playMetroClick } from "../lib/audio";

export function ExercisePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addXp, completeModule } = useProgress();

  const moduleObj = MODULES.find((m: any) => m.id === Number(id));
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // States for interactive components
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [quizSelectedIdx, setQuizSelectedIdx] = useState<number | null>(null);

  // Metronome State
  const [mBPM, setMBPM] = useState(80);
  const [isMetroRunning, setIsMetroRunning] = useState(false);
  const [metroBeat, setMetroBeat] = useState(0);

  // Breath State
  const [bPhase, setBPhase] = useState("Prêt");
  const [bCnt, setBCnt] = useState(0);
  const [isBreathRunning, setIsBreathRunning] = useState(false);
  
  // Ref for MediaRecorder & Timer Streams
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const metroTimerRef = useRef<any>(null);
  const breathTimerRef = useRef<any>(null);

  const startRecording = async () => {
    setAudioUrl(null);
    setMicError(null);
    audioChunksRef.current = [];
    setRecordingTime(0);
    setIsRecording(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'API MediaDevices ou getUserMedia n'est pas supportée dans votre navigateur ou contexte actuel (ex. iframe non sécurisée).");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Stop and release mic stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch (err: any) {
      console.error("Mic access denied or error:", err);
      setMicError(
        "Accès au microphone refusé ou impossible. Veuillez accorder la permission dans votre navigateur. " +
        "Si l'application est ouverte dans une vue intégrée de test, veuillez cliquer sur l'icône de partage / d'ouverture globale en haut à droite pour ouvrir l'application dans un onglet autonome."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isMetroRunning) {
      metroTimerRef.current = setInterval(() => {
        setMetroBeat(b => {
          const newBeat = b + 1;
          playMetroClick(newBeat % 4 === 1);
          return newBeat;
        });
      }, Math.round(60000 / mBPM));
    } else {
      clearInterval(metroTimerRef.current);
    }
    return () => clearInterval(metroTimerRef.current);
  }, [isMetroRunning, mBPM]);

  // Clean up all timers and audio urls when step changes
  useEffect(() => {
    setIsPlaying(false);
    setIsRecording(false);
    setIsMetroRunning(false);
    setIsBreathRunning(false);
    setActiveNoteIdx(null);
    setAudioUrl(null);
    setMicError(null);
    setRecordingTime(0);
    setQuizSelectedIdx(null);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(metroTimerRef.current);
      clearInterval(breathTimerRef.current);
    };
  }, [currentStepIdx]);

  if (!moduleObj) return <div className="p-8 text-slate-100">Module introuvable.</div>;

  const step = moduleObj.steps[currentStepIdx];
  const isLast = currentStepIdx === moduleObj.steps.length - 1;

  const goNext = () => {
    if (isLast) {
      addXp(moduleObj.xp);
      completeModule(moduleObj.id);
      navigate("/");
    } else {
      setCurrentStepIdx((i) => i + 1);
    }
  };

  const playSequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setActiveNoteIdx(null);
      return;
    }
    setIsPlaying(true);
    let i = 0;
    const seq = step.sequence || [];
    const playNext = () => {
      if (i >= seq.length) {
        setIsPlaying(false);
        setActiveNoteIdx(null);
        return;
      }
      playNote(seq[i]);
      setActiveNoteIdx(i);
      i++;
      setTimeout(playNext, 1000);
    };
    playNext();
  };

  const startBreath = () => {
    if (isBreathRunning) {
      setIsBreathRunning(false);
      clearInterval(breathTimerRef.current);
      setBPhase("Prêt");
      setBCnt(0);
      return;
    }
    setIsBreathRunning(true);
    const phases = [
      { l: 'Inspirez', d: 4, c: 'text-indigo-400' },
      { l: 'Retenez', d: 2, c: 'text-amber-400' },
      { l: 'Expirez', d: 6, c: 'text-emerald-400' },
      { l: 'Pause', d: 2, c: 'text-slate-400' }
    ];
    let pi = 0;
    let cnt = phases[0].d;
    setBPhase(phases[0].l);
    setBCnt(cnt);

    breathTimerRef.current = setInterval(() => {
      playBreathTick();
      cnt--;
      if (cnt <= 0) {
        pi = (pi + 1) % phases.length;
        cnt = phases[pi].d;
        setBPhase(phases[pi].l);
      }
      setBCnt(cnt);
    }, 1000);
  };

  const renderContent = (step: Step) => {
    switch (step.type) {
      case "breath":
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <button
              onClick={startBreath}
              className={cn(
                "relative w-48 h-48 rounded-full border-2 border-indigo-500/20 flex flex-col items-center justify-center overflow-hidden mb-8 transition-transform duration-1000",
                isBreathRunning && bPhase === "Inspirez" && "scale-125 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.4)]",
                isBreathRunning && bPhase === "Expirez" && "scale-90 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]",
                isBreathRunning && bPhase === "Retenez" && "scale-125 border-amber-500",
                !isBreathRunning && "hover:border-indigo-500/50"
              )}
            >
              <div className={cn("absolute inset-0 opacity-10 rounded-full", isBreathRunning ? "bg-white" : "bg-indigo-500 animate-pulse")}></div>
              <div className="z-10 text-center flex flex-col items-center justify-center">
                {isBreathRunning ? (
                  <>
                    <span className="text-4xl font-bold text-white mb-1">{bCnt}</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-300">{bPhase}</span>
                  </>
                ) : (
                  <>
                    <WindIcon />
                    <p className="text-sm font-bold text-indigo-400 mt-2">Démarrer</p>
                  </>
                )}
              </div>
            </button>
            <p className="text-slate-300 text-center max-w-md">
              Inspirez lentement par le nez en gonflant le ventre. Retenez. Expirez lentement par la bouche.
            </p>
          </div>
        );
      case "tech":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">{step.name}</h3>
            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
            {step.list && (
              <ul className="space-y-3">
                {step.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 text-sm mt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {step.syls && (
              <div className="mt-6 flex flex-wrap gap-2">
                {step.syls.map((syl, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm font-semibold text-slate-200">
                    {syl}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case "quiz":
        return (
          <div className="space-y-6 py-6 animate-fade-in">
            <h3 className="text-xl font-bold text-indigo-400">❓ Quiz de compréhension</h3>
            <p className="text-lg font-medium text-slate-200">{step.q}</p>
            <div className="space-y-3 mt-4">
              {step.opts?.map((opt, i) => {
                const isSelected = quizSelectedIdx === i;
                const isCorrectAnswer = i === step.ok;
                const hasSelectedAny = quizSelectedIdx !== null;

                return (
                  <button
                    key={i}
                    disabled={hasSelectedAny && quizSelectedIdx === step.ok}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left duration-350 active:scale-99 outline-none",
                      !hasSelectedAny && "bg-slate-800/50 border-slate-700 hover:border-indigo-500 hover:bg-slate-800",
                      hasSelectedAny && isCorrectAnswer && "bg-emerald-500/10 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
                      hasSelectedAny && isSelected && !isCorrectAnswer && "bg-rose-500/10 border-rose-500/60 text-rose-300",
                      hasSelectedAny && !isSelected && !isCorrectAnswer && "bg-slate-800/20 border-slate-850 opacity-40"
                    )}
                    onClick={() => {
                      setQuizSelectedIdx(i);
                    }}
                  >
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs transition-colors",
                      !hasSelectedAny && "bg-slate-900 text-slate-400",
                      hasSelectedAny && isCorrectAnswer && "bg-emerald-500 text-slate-950",
                      hasSelectedAny && isSelected && !isCorrectAnswer && "bg-rose-500 text-slate-950",
                      hasSelectedAny && !isSelected && !isCorrectAnswer && "bg-slate-900/40 text-slate-500"
                    )}>
                      {String.fromCharCode(65 + i)}
                     </span>
                     <span className="font-semibold">{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizSelectedIdx !== null && (
              <div className="mt-4 animate-fade-in">
                {quizSelectedIdx === step.ok ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-550/25 rounded-xl text-emerald-300 text-sm font-semibold flex items-center gap-2">
                    ✨ Excellente réponse ! Vous avez compris ce concept. Vous pouvez continuer le cours.
                  </div>
                ) : (
                  <div className="p-4 bg-rose-500/10 border border-rose-550/25 rounded-xl text-rose-300 text-sm font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span>❌ Mauvaise réponse. Réessayez pour continuer !</span>
                    <button
                      onClick={() => setQuizSelectedIdx(null)}
                      className="px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-block"
                    >
                      Essayer de nouveau
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "recorder":
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <h3 className="text-xl font-bold text-slate-100">🎙 Enregistreur de Performance</h3>
            <p className="text-slate-400 text-center max-w-sm">
              Enregistrez un extrait de votre voix pour évaluer votre justesse et votre posture.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center text-white transition-all shadow-xl",
                  isRecording 
                    ? "bg-rose-500 hover:bg-rose-600 animate-pulse outline outline-4 outline-rose-500/30" 
                    : "bg-indigo-500 hover:bg-indigo-600 active:scale-95"
                )}
              >
                {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </button>
              <div className="text-2xl font-mono font-bold text-slate-300">
                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
              </div>
              {isRecording && (
                <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
                  Enregistrement en cours...
                </span>
              )}
            </div>

            {micError && (
              <div className="w-full max-w-md bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm p-4 rounded-2xl space-y-2">
                <p className="font-semibold text-rose-400">⚠️ Erreur de Microphone :</p>
                <p className="text-xs text-rose-300 leading-relaxed">{micError}</p>
                <button 
                  onClick={() => {
                    const testUrl = window.location.href;
                    window.open(testUrl, '_blank');
                  }}
                  className="mt-2 text-xs font-bold tracking-wide uppercase px-4 py-1.5 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/30 transition-colors w-full"
                >
                  Ouvrir dans un nouvel onglet ↗
                </button>
              </div>
            )}

            {audioUrl && (
              <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col items-center space-y-3 mt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Votre enregistrement</span>
                <audio src={audioUrl} controls className="w-full focus:outline-none accent-indigo-500" />
              </div>
            )}
          </div>
        );
      case "video":
        const videoId = step.url ? (step.url.includes("v=") ? step.url.split("v=")[1]?.split("&")[0] : step.url.split("/").pop()) : "dQw4w9WgXcQ";
        const fullWatchUrl = step.url || `https://www.youtube.com/watch?v=${videoId}`;
        return (
          <div className="space-y-6 text-center py-4">
            <h3 className="text-xl font-bold text-slate-100">{step.name || "Didactique & Astuces"}</h3>
            <p className="text-slate-400 max-w-lg mx-auto">{step.desc || "Regardez attentivement cette vidéo pour comprendre l'exercice."}</p>
            <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-slate-800 bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={step.name || "Vocal Instructor Video"}
              />
            </div>
            <div className="pt-2">
              <a
                href={fullWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-102 active:scale-98"
                style={{ backgroundColor: "#e22e2e" }}
              >
                <span>Regarder la leçon sur YouTube ↗</span>
              </a>
              <p className="text-xs text-slate-500 mt-2">Cliquez si la vidéo ne s'affiche pas correctement dans la vue de test.</p>
            </div>
          </div>
        );
      case "piano_ex":
        return (
          <div className="space-y-6 text-center py-8">
            <h3 className="text-xl font-bold">{step.name}</h3>
            <p className="text-slate-400">{step.desc}</p>
            <div className="flex justify-center gap-2 my-8 flex-wrap">
              {step.sequence?.map((note, i) => (
                <div key={i} className={cn(
                  "px-4 py-3 rounded-lg border font-bold transition-all duration-300",
                  activeNoteIdx === i ? "bg-amber-500/30 border-amber-500 text-amber-400 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                )}>
                  {note}
                </div>
              ))}
            </div>
            <button
              onClick={playSequence}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold rounded-xl flex items-center gap-2 mx-auto shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"
            >
              {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isPlaying ? "Arrêter" : "Jouer la séquence"}
            </button>
          </div>
        );
      case "scales":
        return (
          <div className="space-y-6 text-center py-8">
            <h3 className="text-xl font-bold">Gammes Vocales</h3>
            <p className="text-slate-400">Jouez une note et chantez-la pour travailler votre justesse.</p>
            <div className="flex justify-center gap-2 my-8 flex-wrap">
              {["DO", "RÉ", "MI", "FA", "SOL", "LA", "SI", "DO2"].map((note, i) => (
                <button
                  key={i}
                  onClick={() => playNote(note)}
                  className="px-4 py-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold hover:bg-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        );
      case "metronome":
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <h3 className="text-xl font-bold">Métronome Vocal</h3>
            <p className="text-slate-400 text-center max-w-sm">Chantez en rythme. Utilisez les boutons pour ajuster la vitesse.</p>
            
            <div className="flex items-center gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
              <button onClick={() => setMBPM(b => Math.max(40, b - 5))} className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors">
                <Minus className="w-6 h-6" />
              </button>
              <div className="text-center min-w-[80px]">
                <div className="text-4xl font-bold text-white">{mBPM}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">BPM</div>
              </div>
              <button onClick={() => setMBPM(b => Math.min(200, b + 5))} className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={() => setIsMetroRunning(!isMetroRunning)}
              className={cn(
                "w-24 h-24 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-xl font-bold text-sm",
                isMetroRunning ? "bg-amber-500 hover:bg-amber-600 outline outline-4 outline-amber-500/30" : "bg-indigo-500 hover:bg-indigo-600"
              )}
            >
              {isMetroRunning ? (
                <>
                  <Square className="w-6 h-6 mb-1 fill-current" /> Arrêter
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mb-1 fill-current ml-1" /> Démarrer
                </>
              )}
            </button>
          </div>
        );
      case "done":
        return (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
            <h3 className="text-2xl font-bold text-white">Module Terminé !</h3>
            <p className="text-slate-400">Excellent travail. Vous avez complété avec succès toutes les étapes de ce module.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold">
              +{moduleObj.xp} XP
            </div>
          </div>
        );
      case "humming":
        return (
          <div className="space-y-6 text-center py-8 animate-fade-in flex flex-col items-center">
            <h3 className="text-xl font-bold text-indigo-400">🐝 Exercice de Bourdonnement (Humming)</h3>
            <p className="text-slate-400 max-w-sm">
              Fermez la bouche, détendez la mâchoire et soufflez doucement un son vibrant (Mmmmmm) pour réveiller les résonateurs du visage.
            </p>
            
            <div className="relative w-36 h-36 flex items-center justify-center my-6">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping duration-2000"></div>
              <div className="absolute inset-4 bg-indigo-550/20 rounded-full animate-pulse"></div>
              <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-slate-100 font-bold text-lg border-2 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                Mmm!
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-xs text-slate-450 max-w-md space-y-2 text-left">
              <p className="font-semibold text-indigo-300">💡 Astuces de pro :</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Sentez les vibrations sur l'avant de vos lèvres et le nez.</li>
                <li>Si vous ressentez des chatouillements, vous le faites parfaitement !</li>
                <li>Gardez une colonne d'air bien stable.</li>
              </ul>
            </div>
          </div>
        );
      case "pitch":
        return (
          <div className="space-y-6 text-center py-8 animate-fade-in flex flex-col items-center">
            <h3 className="text-xl font-bold text-indigo-400">🎯 Contrôle de Justesse & Intonation</h3>
            <p className="text-slate-400 max-w-sm">
              Chantez une note claire et tentez de garder votre justesse. Ce module s'entraîne avec le métronome ou un instrument d'accompagnement.
            </p>

            {/* Tuning needle visualization */}
            <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Indicateur de Justesse</span>
              <div className="h-4 w-full bg-slate-900 rounded-full relative overflow-hidden border border-slate-850">
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-500 z-10"></div>
                {/* Simulated needle wobble */}
                <div className="absolute top-0 bottom-0 w-4 bg-indigo-500/80 rounded-full blur-xs transition-all duration-300 animate-pulse" style={{ left: "calc(50% - 8px)" }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 tracking-wider font-semibold">
                <span className="text-rose-450">TROP BAS</span>
                <span className="text-emerald-400 font-bold">ACCORDÉ</span>
                <span className="text-rose-450">TROP HAUT</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-md">
              Améliorez votre oreille interne en écoutant les gammes présentées dans le module et reproduisez-les avec précision.
            </p>
          </div>
        );
      default:
        return (
          <div className="py-12 text-center text-slate-400">
            Exercice de type <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 rounded">{step.type}</span> (Générique)
            <br /> <br /> Suivez les instructions et pratiquez avec votre voix.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 animate-fade-in md:border-x md:border-slate-800 mx-auto max-w-3xl w-full">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-slate-200 line-clamp-1">{moduleObj.name}</h2>
          <p className="text-xs text-slate-500">Étape {currentStepIdx + 1} sur {moduleObj.steps.length}</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex gap-1 p-4 shrink-0">
        {moduleObj.steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-1.5 rounded-full transition-colors",
              i < currentStepIdx ? "bg-emerald-500" : i === currentStepIdx ? "bg-indigo-500" : "bg-slate-800"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-black/50">
          {renderContent(step)}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 pb-safe">
        <button
          onClick={goNext}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all outline-none"
        >
          {isLast ? "Terminer le Module 🎉" : "Continuer"}
        </button>
      </div>
    </div>
  );
}

// Inline component for isolated SVG
function WindIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 mx-auto opacity-80"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>
  );
}
