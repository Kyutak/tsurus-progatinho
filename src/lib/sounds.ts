// Sons via arquivos MP3
function playSound(path: string) {
  if (typeof window === 'undefined') return;

  const audio = new Audio(path);
  audio.volume = 0.5;
  audio.preload = 'auto';

  audio.play().catch((error) => {
    console.error(`Failed to play sound ${path}:`, error);
  });
}

export function playFalling() {
  playSound('/sounds/falling.mp3');
}

export function playVanish() {
  playSound('/sounds/vanish.mp3');
}

// Sons sintéticos via Web Audio API — leves, sem precisar de arquivos
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  return ctx;
}

// Pequeno "tap" de papel — ruído filtrado curto
export function playPaperDrop() {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});

  const duration = 0.12;
  const bufferSize = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // ruído branco com decaimento exponencial
    const t = i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
  }

  const noise = ac.createBufferSource();
  noise.buffer = buffer;

  // filtro passa-banda na faixa de papel amassado (~2-4kHz)
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2800 + Math.random() * 800;
  bp.Q.value = 1.2;

  const gain = ac.createGain();
  gain.gain.value = 0.08;

  noise.connect(bp);
  bp.connect(gain);
  gain.connect(ac.destination);
  noise.start();
  noise.stop(ac.currentTime + duration);
}

// Pop suave ao remover
export function playPop() {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.15);
  gain.gain.setValueAtTime(0.15, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.2);
}
