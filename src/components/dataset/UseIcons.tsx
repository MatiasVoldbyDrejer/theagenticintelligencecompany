import type { UseIcon } from "@/lib/dataset";

/**
 * One glyph per intended use, each drawing the property that makes that use
 * possible rather than illustrating the words.
 *
 * Few, large elements: at 24px a six-bar waveform collapses into texture and
 * two of these would read as the same mark. Each is built from two lanes on a
 * 24-unit grid, which is also what the sample player shows, so they belong to
 * this page rather than to a borrowed icon set.
 */

const LANE_TOP = 6;
const LANE_BOTTOM = 14;
const LANE_H = 4;

/** Two channels running the full timeline, read at one instant. */
function Duplex() {
  return (
    <>
      <rect x="1" y={LANE_TOP} width="22" height={LANE_H} rx="2" fill="currentColor" opacity="0.35" />
      <rect x="1" y={LANE_BOTTOM} width="22" height={LANE_H} rx="2" fill="currentColor" opacity="0.35" />
      <line
        x1="15"
        y1="3"
        x2="15"
        y2="21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}

/** The floor passing from one speaker to the other. */
function Diarization() {
  return (
    <>
      <rect x="1" y={LANE_TOP} width="11" height={LANE_H} rx="2" fill="currentColor" />
      <rect x="13" y={LANE_BOTTOM} width="10" height={LANE_H} rx="2" fill="currentColor" />
      <line
        x1="12.5"
        y1="4"
        x2="12.5"
        y2="20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </>
  );
}

/** Signal resolving into text. */
function Understanding() {
  return (
    <>
      {[
        { x: 1, h: 10 },
        { x: 5, h: 16 },
        { x: 9, h: 7 },
      ].map((b) => (
        <rect
          key={b.x}
          x={b.x}
          y={12 - b.h / 2}
          width="2.5"
          height={b.h}
          rx="1.25"
          fill="currentColor"
        />
      ))}
      {[8, 12, 16].map((y, i) => (
        <line
          key={y}
          x1="15"
          y1={y}
          x2={i === 2 ? 19 : 23}
          y2={y}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity={0.5 + i * 0.25}
        />
      ))}
    </>
  );
}

const GLYPHS: Record<UseIcon, () => React.ReactElement> = {
  duplex: Duplex,
  diarization: Diarization,
  understanding: Understanding,
};

export default function UseIconMark({ name }: { name: UseIcon }) {
  const Glyph = GLYPHS[name];
  if (!Glyph) return null;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-900" aria-hidden focusable="false">
      <Glyph />
    </svg>
  );
}
