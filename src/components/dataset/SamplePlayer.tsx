"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Sample } from "@/lib/dataset";
import { t } from "./type";
import { ACCENT, INK } from "./colors";

// One colour per speaker, held across the waveform, the labels, and the
// playhead — the whole point of the sample is that these are two separate
// tracks, so they must never render as one blended signal.
const TRACK_INK = [INK, ACCENT] as const;

/**
 * Two-track sample player. Each speaker's audio is a separate element and the
 * pair is driven together: the first track is the clock, the second is slaved
 * to it and re-synced whenever it drifts past a frame.
 *
 * Waveforms are drawn from peak envelopes baked into the snapshot rather than
 * decoded in the browser, so the page ships no audio-analysis code and the
 * shapes appear before a single byte of audio has loaded.
 */
export default function SamplePlayer({ samples }: { samples: Sample[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const refs = useRef<(HTMLAudioElement | null)[]>([]);
  const sample = samples[index];
  const duration = sample?.durationSeconds ?? 0;

  const stop = useCallback(() => {
    refs.current.forEach((a) => a?.pause());
    setPlaying(false);
  }, []);

  // Switching samples must not leave the previous pair playing underneath.
  useEffect(() => {
    stop();
    setTime(0);
  }, [index, stop]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const [a, b] = refs.current;
      if (a) {
        setTime(a.currentTime);
        // Independent elements drift. Nudge the follower back whenever it is
        // more than a frame out, which is inaudible but keeps the two
        // waveforms honest against each other.
        if (b && Math.abs(b.currentTime - a.currentTime) > 0.04) {
          b.currentTime = a.currentTime;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  async function toggle() {
    if (playing) {
      stop();
      return;
    }
    const els = refs.current.filter(Boolean) as HTMLAudioElement[];
    if (els.length === 0) return;
    els.forEach((a) => {
      a.currentTime = time;
    });
    try {
      await Promise.all(els.map((a) => a.play()));
      setPlaying(true);
    } catch {
      // Autoplay policy or a missing file — leave the control in its paused
      // state rather than showing a playing UI over silence.
      setPlaying(false);
    }
  }

  function seek(fraction: number) {
    const next = Math.max(0, Math.min(1, fraction)) * duration;
    refs.current.forEach((a) => {
      if (a) a.currentTime = next;
    });
    setTime(next);
  }

  if (!sample) return null;
  const progress = duration > 0 ? time / duration : 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3.5">
        <h3 className={t.cardTitle}>Sample</h3>
        {samples.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {samples.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                className={`rounded-sm px-2 py-1 font-mono text-[11px] transition-colors ${
                  i === index
                    ? "bg-zinc-900 text-zinc-50"
                    : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 px-5 py-5">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause sample" : "Play sample"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 transition-colors hover:bg-zinc-700"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          {sample.peaks.map((peaks, i) => (
            <Waveform
              key={i}
              peaks={peaks}
              progress={progress}
              color={TRACK_INK[i] ?? TRACK_INK[0]}
              label={i === 0 ? "Speaker A" : "Speaker B"}
              onSeek={seek}
            />
          ))}
        </div>

        <span className="w-24 shrink-0 text-right font-mono text-[12px] tabular-nums text-zinc-400">
          {fmt(time)} / {fmt(duration)}
        </span>
      </div>

      {sample.tracks.map((src, i) => (
        <audio
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={src}
          preload="metadata"
          onEnded={i === 0 ? stop : undefined}
        />
      ))}
    </div>
  );
}

function Waveform({
  peaks,
  progress,
  color,
  label,
  onSeek,
}: {
  peaks: number[];
  progress: number;
  color: string;
  label: string;
  onSeek: (fraction: number) => void;
}) {
  const bars = useMemo(() => peaks.map((p) => Math.max(0.02, Math.min(1, p))), [peaks]);
  const width = bars.length * 3;

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400">
        {label}
      </span>
      <svg
        viewBox={`0 0 ${width} 40`}
        preserveAspectRatio="none"
        className="h-9 w-full cursor-pointer"
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          onSeek((e.clientX - box.left) / box.width);
        }}
      >
        {bars.map((v, i) => {
          const h = v * 36;
          return (
            <rect
              key={i}
              x={i * 3}
              y={20 - h / 2}
              width={2}
              height={h}
              fill={color}
              opacity={i / bars.length <= progress ? 1 : 0.22}
            />
          );
        })}
      </svg>
    </div>
  );
}

function fmt(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
