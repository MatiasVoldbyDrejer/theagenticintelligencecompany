"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PairedSample } from "@/lib/dataset";
import DualAudioPlayer, { type DualAudioPlayerHandle } from "./DualAudioPlayer";
import AnimatedWaveform from "./AnimatedWaveform";
import { Card } from "./Card";

/** Inlined so the dataset pages stay dependency-free. */
function ShuffleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M16 3h5v5" />
      <path d="M4 20 21 3" />
      <path d="M21 16v5h-5" />
      <path d="m15 15 6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

/**
 * The dataset's sample conversations in the paired-waveform player.
 *
 * Peaks are baked into the snapshot rather than fetched, so the waveforms paint
 * on first render with no audio decode in the browser — the page ships no
 * analysis code and the shapes are there before a byte of audio has loaded.
 */
export default function SampleClips({
  samples,
  waveColorA = "#a9d2f2",
  progressColorA = "#0087ff",
  muteColorA = "text-[#0087ff]",
  waveColorB = "#c6c3ba",
  progressColorB = "#5d5b51",
  muteColorB = "text-stone-600",
}: {
  samples: PairedSample[];
  waveColorA?: string;
  progressColorA?: string;
  muteColorA?: string;
  waveColorB?: string;
  progressColorB?: string;
  muteColorB?: string;
}) {
  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, Math.max(0, samples.length - 1));
  const current = samples[safeIndex] ?? null;
  const multiple = samples.length > 1;

  // A random OTHER sample: with many clips, stepping Prev/Next is tedious.
  // Guarded so a one-sample dataset never loops.
  const shuffle = useCallback(() => {
    if (samples.length <= 1) return;
    let next = safeIndex;
    while (next === safeIndex) next = Math.floor(Math.random() * samples.length);
    setIndex(next);
  }, [samples.length, safeIndex]);

  if (!current) return null;

  return (
    <section>
      <Card>
        <div className="space-y-4 p-6">
          {/* Title + Shuffle live INSIDE the card, above the player, so the whole
              sample-audio module reads as one self-contained box. */}
          <div className="flex items-center gap-1">
            <h2 className="text-[26px] font-normal text-zinc-900">Sample audio</h2>
            {/* translate-y optically centers the icon on the letterforms:
                items-center aligns to the text's line box, which sits a touch
                high because the heading's descender space goes unused. */}
            {multiple && (
              <button
                type="button"
                onClick={shuffle}
                aria-label="Shuffle to a random sample"
                title="Shuffle"
                className="inline-flex h-6 w-6 shrink-0 translate-y-[1.5px] items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
              >
                <ShuffleIcon />
              </button>
            )}
          </div>
          {/* Re-key per conversation so player + waveforms fully remount on a
              switch — DualAudioPlayer keeps progress in state with no
              reset-on-URL-change, so a remount is what resets the bar. */}
          <PairedClip
            key={current.conversationId}
            sample={current}
            waveColorA={waveColorA}
            progressColorA={progressColorA}
            muteColorA={muteColorA}
            waveColorB={waveColorB}
            progressColorB={progressColorB}
            muteColorB={muteColorB}
          />
        </div>
      </Card>
    </section>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6v4h2.5L9 13V3L5.5 6H3z" fill="currentColor" stroke="none" />
      {muted ? (
        <>
          <line x1="11" y1="6" x2="14" y2="10" />
          <line x1="14" y1="6" x2="11" y2="10" />
        </>
      ) : (
        <>
          <path d="M11.5 6.5c.7.4 1 1 1 1.5s-.3 1.1-1 1.5" />
          <path d="M13 4.5c1.5.8 2.2 2 2.2 3.5s-.7 2.7-2.2 3.5" />
        </>
      )}
    </svg>
  );
}

export function MuteToggle({
  label,
  muted,
  onToggle,
  color,
}: {
  label: string;
  muted: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? `Unmute speaker ${label}` : `Mute speaker ${label}`}
      className={`inline-flex h-7 items-center gap-1 rounded-full border px-2.5 font-medium transition-colors ${
        muted
          ? "border-zinc-300 bg-zinc-100 text-zinc-400"
          : `border-zinc-300 bg-white ${color} hover:bg-zinc-100`
      }`}
    >
      <SpeakerIcon muted={muted} />
      {label}
    </button>
  );
}

function PairedClip({
  sample,
  waveColorA,
  progressColorA,
  muteColorA,
  waveColorB,
  progressColorB,
  muteColorB,
}: {
  sample: PairedSample;
  waveColorA: string;
  progressColorA: string;
  muteColorA: string;
  waveColorB: string;
  progressColorB: string;
  muteColorB: string;
}) {
  const playerRef = useRef<DualAudioPlayerHandle>(null);
  const [audioA, setAudioA] = useState<HTMLAudioElement | null>(null);
  const [audioB, setAudioB] = useState<HTMLAudioElement | null>(null);
  const [muteA, setMuteA] = useState(false);
  const [muteB, setMuteB] = useState(false);

  // Refs are populated after mount plus a microtask flush, hence setTimeout(0).
  useEffect(() => {
    const id = window.setTimeout(() => {
      setAudioA(playerRef.current?.getAudioA() ?? null);
      setAudioB(playerRef.current?.getAudioB() ?? null);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const seekBoth = useCallback((seconds: number) => {
    playerRef.current?.seek(seconds);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <DualAudioPlayer
          ref={playerRef}
          className="flex-1"
          urlA={sample.speakerA.src}
          urlB={sample.speakerB.src}
          muteA={muteA}
          muteB={muteB}
        />
        <div className="flex shrink-0 items-center gap-1.5 text-xs">
          <MuteToggle
            label="A"
            muted={muteA}
            onToggle={() => setMuteA((v) => !v)}
            color={muteColorA}
          />
          <MuteToggle
            label="B"
            muted={muteB}
            onToggle={() => setMuteB((v) => !v)}
            color={muteColorB}
          />
        </div>
      </div>
      {/* Waveforms draw straight from the baked peaks, no decode. Playback
          progress and click-to-seek come from the shared player above. */}
      <div className="space-y-2">
        <AnimatedWaveform
          audio={audioA}
          peaks={sample.peaks.a.peaks}
          duration={sample.peaks.a.duration}
          label="Speaker A"
          waveColor={waveColorA}
          progressColor={progressColorA}
          height={56}
          muted={muteA}
          onSeek={seekBoth}
        />
        <AnimatedWaveform
          audio={audioB}
          peaks={sample.peaks.b.peaks}
          duration={sample.peaks.b.duration}
          label="Speaker B"
          waveColor={waveColorB}
          progressColor={progressColorB}
          height={56}
          muted={muteB}
          onSeek={seekBoth}
          revealDelayMs={140}
        />
      </div>
    </div>
  );
}
