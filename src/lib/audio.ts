export const NOTE_FREQ: Record<string, number> = {
  'DO': 261.63, 'DO#': 277.18, 'RE': 293.66, 'RÉ': 293.66, 'MI': 329.63,
  'FA': 349.23, 'SOL': 392.00, 'LA': 440.00, 'SI': 493.88,
  'DO2': 523.25, 'RE2': 587.33, 'RÉ2': 587.33, 'MI2': 659.25,
  'FA2': 698.46, 'SOL2': 783.99, 'LA2': 880.00, 'SI2': 987.77
};

export function playNote(noteName: string) {
  try {
    const freq = NOTE_FREQ[noteName];
    if (!freq) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.0);
    osc2.start();
    osc2.stop(ctx.currentTime + 1.0);

    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 2500);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

export function playBreathTick() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
    setTimeout(() => ctx.close(), 150);
  } catch (e) {
    console.log('Audio error:', e);
  }
}

export function playMetroClick(isAccent: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
    setTimeout(() => ctx.close(), 200);
  } catch (e) {
    console.log('Audio error:', e);
  }
}
