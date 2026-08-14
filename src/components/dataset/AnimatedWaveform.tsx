"use client";

import { type MouseEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Real DOM bars rather than a <canvas>, so each animates independently — every
 * bar is its own decaying oscillator, which is what makes the settle-jitter read
 * as organic instead of one block moving in lockstep.
 */

const REST = 0.56; // height fraction of the tallest bar at rest
const JITTER_MS = 1600;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** max-per-bucket, matching the way a waveform renderer bins samples. */
function downsample(peaks: number[], n: number): number[] {
  const out: number[] = [];
  const bucket = peaks.length / n;
  for (let i = 0; i < n; i++) {
    const start = Math.floor(i * bucket);
    const end = Math.max(start + 1, Math.floor((i + 1) * bucket));
    let m = 0;
    for (let j = start; j < end && j < peaks.length; j++) m = Math.max(m, peaks[j]);
    out.push(m);
  }
  return out;
}

type BarParam = { amp: number; f1: number; f2: number; p1: number; p2: number };

/** Two summed sines at independent phase, so the motion never repeats. */
function makeParams(n: number, seed: number): BarParam[] {
  const r = mulberry32(seed);
  const out: BarParam[] = [];
  for (let i = 0; i < n; i++) {
    const f1 = 0.9 + r() * 1.3;
    out.push({
      amp: 0.5 + r() * 0.7,
      f1,
      f2: f1 * (1.3 + r() * 0.5),
      p1: r() * 6.28,
      p2: r() * 6.28,
    });
  }
  return out;
}

interface AnimatedWaveformProps {
  peaks: number[];
  duration: number;
  audio: HTMLAudioElement | null;
  label: string;
  waveColor: string;
  progressColor: string;
  height?: number;
  muted?: boolean;
  onSeek?: (seconds: number) => void;
  animate?: boolean;
  /** So stacked speakers cascade rather than firing together. */
  revealDelayMs?: number;
}

export default function AnimatedWaveform({
  peaks,
  duration,
  audio,
  label,
  waveColor,
  progressColor,
  height = 56,
  muted = false,
  onSeek,
  animate = true,
  revealDelayMs = 0,
}: AnimatedWaveformProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [barCount, setBarCount] = useState(0);
  const [inView, setInView] = useState(false);
  const hasRun = useRef(false);

  // Before paint, so the bars appear at the right density with no flash.
  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setBarCount(Math.max(40, Math.min(200, Math.round(w / 4))));
    };
    measure();
    // Watches the row rather than the window: the row also resizes when a
    // sibling panel opens, which a window `resize` never hears about.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Peaks are absolute amplitude and speech sits well below full scale, so
  // without normalising every waveform renders nearly flat. An all-silent clip
  // has no peak to divide by and is left as-is.
  const values = useMemo(() => {
    if (barCount <= 0) return [];
    const ds = downsample(peaks, barCount);
    const peak = ds.reduce((m, v) => Math.max(m, v), 0);
    return peak > 0 ? ds.map((v) => v / peak) : ds;
  }, [peaks, barCount]);

  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) | 0;
    return (Math.abs(h) % 100000) + 1;
  }, [label]);
  const params = useMemo(() => makeParams(values.length, seed), [values.length, seed]);

  // No fallback: if the observer never fires the bars stay at rest and fully
  // visible, which is fine — the animation is a bonus.
  useEffect(() => {
    if (!animate || typeof IntersectionObserver === "undefined") return;
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  useEffect(() => {
    if (!animate || !inView || hasRun.current) return;
    const el = rowRef.current;
    if (!el) return;
    const bars = Array.from(el.children) as HTMLElement[];
    if (!bars.length) return;
    hasRun.current = true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Only for the burst: leaving will-change on permanently pins hundreds of
    // needless compositor layers.
    for (const b of bars) b.style.willChange = "transform";
    const settle = () => {
      for (const b of bars) {
        b.style.transform = "";
        b.style.willChange = "";
      }
    };

    let raf = 0;
    let startTs = 0;
    const n = bars.length;
    const tick = (now: number) => {
      if (!startTs) startTs = now;
      const p = Math.min(1, (now - startTs) / JITTER_MS);
      const t = (now - startTs) / 1000;
      const env = Math.min(1, p / 0.08) * Math.pow(1 - p, 1.2);
      for (let i = 0; i < n; i++) {
        const bp = params[i];
        const osc =
          0.7 * Math.sin(6.28 * bp.f1 * t + bp.p1) + 0.3 * Math.sin(6.28 * bp.f2 * t + bp.p2);
        bars[i].style.transform = `scaleY(${Math.max(0.12, 1 + 0.7 * bp.amp * env * osc)})`;
      }
      if (p < 1) raf = requestAnimationFrame(tick);
      else settle();
    };
    const startTimer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, revealDelayMs);

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      // On interruption, drop transform and will-change so nothing stays pinned.
      settle();
    };
  }, [animate, inView, params, revealDelayMs]);

  // Colours are set IMPERATIVELY, so the bar list never re-renders during
  // playback.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const bars = Array.from(el.children) as HTMLElement[];
    const paint = () => {
      const dur = duration || audio?.duration || 0;
      const frac = dur > 0 && audio ? Math.min(1, Math.max(0, audio.currentTime / dur)) : 0;
      const played = Math.round(frac * bars.length);
      for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = i < played ? progressColor : waveColor;
      }
    };
    paint();
    if (!audio) return;

    let raf = 0;
    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      cancelAnimationFrame(raf);
      loop();
    };
    const onStop = () => {
      cancelAnimationFrame(raf);
      paint();
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onStop);
    audio.addEventListener("ended", onStop);
    audio.addEventListener("seeked", paint);
    audio.addEventListener("timeupdate", paint);
    if (!audio.paused) onPlay();
    return () => {
      cancelAnimationFrame(raf);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onStop);
      audio.removeEventListener("ended", onStop);
      audio.removeEventListener("seeked", paint);
      audio.removeEventListener("timeupdate", paint);
    };
  }, [audio, duration, waveColor, progressColor, values.length]);

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(frac * duration);
  };

  return (
    <div ref={cardRef} className="relative rounded-md border border-ink/10 bg-ink/[0.02] p-2">
      <div className="mb-1 flex items-center justify-between text-xs text-ink/60">
        <span className="font-medium">{label}</span>
        {muted && <span className="text-ink/40">Muted</span>}
      </div>
      <div
        ref={rowRef}
        onClick={handleSeek}
        role={onSeek ? "button" : undefined}
        aria-label={onSeek ? "Seek" : undefined}
        className={`flex w-full items-center justify-between overflow-visible transition-opacity ${
          onSeek && !muted ? "cursor-pointer" : ""
        } ${muted ? "pointer-events-none opacity-0" : "opacity-100"}`}
        style={{ height }}
        aria-hidden={muted}
      >
        {values.map((v, i) => (
          <span
            key={i}
            style={{
              width: 2,
              height: Math.max(2, Math.round(v * height * REST)),
              backgroundColor: waveColor,
              borderRadius: 1,
              flexShrink: 0,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
    </div>
  );
}
