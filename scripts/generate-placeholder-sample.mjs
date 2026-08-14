// Builds a PLACEHOLDER two-speaker sample so the player can be seen working
// before real clips are cut:
//
//   node scripts/generate-placeholder-sample.mjs
//
// Writes public/samples/*.mp3 and prints the `samples` entry to paste into
// src/data/open-release.json. The audio is synthetic — filtered noise shaped
// into syllables and turns, at speech-like formant frequencies. It is not
// speech and is not from the corpus; it exists so the waveform, the transport,
// the mute toggles and click-to-seek can all be judged for real.
//
// Turns alternate with a little overlap at the boundaries, because that overlap
// is the thing the two-track layout exists to show.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";

const RATE = 24000;
const SECONDS = 24;
const OUT_DIR = "public/samples";

let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

/** Alternating turns with a short overlap where the next speaker comes in. */
function buildTurns() {
  const turns = [];
  let t = 0.35;
  let speaker = 0;
  while (t < SECONDS - 1) {
    const len = 1.1 + rnd() * 2.9;
    turns.push({ speaker, start: t, end: Math.min(SECONDS - 0.2, t + len) });
    // Negative gap = the next speaker starts before this one finishes.
    const gap = rnd() < 0.35 ? -(0.05 + rnd() * 0.25) : 0.08 + rnd() * 0.4;
    t += len + gap;
    speaker = 1 - speaker;
  }
  return turns;
}

/**
 * One speaker's track: filtered noise gated into syllables inside their turns,
 * plus a low room-noise floor everywhere else.
 */
function renderTrack(turns, speaker) {
  const n = SECONDS * RATE;
  const out = new Float32Array(n);
  // Two resonances an octave-ish apart read as a voice rather than a buzz; the
  // two speakers sit at different pitches so the tracks are tellable apart.
  const f0 = speaker === 0 ? 118 : 196;
  let lp = 0;
  let bp = 0;

  for (const turn of turns.filter((x) => x.speaker === speaker)) {
    let t = turn.start;
    while (t < turn.end) {
      const syl = 0.12 + rnd() * 0.2;
      const end = Math.min(turn.end, t + syl);
      const amp = 0.16 + rnd() * 0.2;
      const drift = 0.85 + rnd() * 0.4;
      for (let i = Math.floor(t * RATE); i < Math.floor(end * RATE); i++) {
        const local = (i / RATE - t) / syl;
        // Raised-cosine syllable envelope — no clicks at the edges.
        const env = 0.5 - 0.5 * Math.cos(2 * Math.PI * Math.min(1, Math.max(0, local)));
        const phase = (2 * Math.PI * f0 * drift * i) / RATE;
        const glottal = Math.sin(phase) + 0.4 * Math.sin(2 * phase) + 0.2 * Math.sin(3 * phase);
        const noise = rnd() * 2 - 1;
        lp += 0.08 * (noise - lp);
        bp += 0.35 * (glottal * 0.7 + lp * 0.6 - bp);
        out[i] += env * amp * bp;
      }
      t = end + rnd() * 0.05;
    }
  }

  // Room floor, so the "silent" half of a track is not digital silence.
  for (let i = 0; i < n; i++) out[i] += (rnd() * 2 - 1) * 0.0022;
  return out;
}

/** 16-bit mono PCM WAV. */
function toWav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

/** Absolute peak per bucket — the same shape the delivered peaks files carry. */
function peaksOf(samples, buckets = 900) {
  const out = [];
  const size = Math.floor(samples.length / buckets);
  for (let i = 0; i < buckets; i++) {
    let m = 0;
    for (let j = i * size; j < (i + 1) * size && j < samples.length; j++) {
      const v = Math.abs(samples[j]);
      if (v > m) m = v;
    }
    out.push(Number(m.toFixed(4)));
  }
  return out;
}

const turns = buildTurns();
mkdirSync(OUT_DIR, { recursive: true });

const tracks = [0, 1].map((speaker) => {
  const pcm = renderTrack(turns, speaker);
  const letter = speaker === 0 ? "a" : "b";
  const wav = path.join(OUT_DIR, `placeholder_speaker_${letter}.wav`);
  const mp3 = path.join(OUT_DIR, `placeholder_speaker_${letter}.mp3`);
  writeFileSync(wav, toWav(pcm));
  // Mono 64k is plenty for a placeholder and keeps the repo small.
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "64k", mp3]);
  rmSync(wav);
  return { letter, mp3, peaks: peaksOf(pcm) };
});

const entry = {
  conversationId: "placeholder-0001",
  language: "en-US",
  speakerA: { src: `/samples/placeholder_speaker_a.mp3`, durationSeconds: SECONDS },
  speakerB: { src: `/samples/placeholder_speaker_b.mp3`, durationSeconds: SECONDS },
  peaks: {
    a: { peaks: tracks[0].peaks, duration: SECONDS },
    b: { peaks: tracks[1].peaks, duration: SECONDS },
  },
};

writeFileSync("src/data/placeholder-sample.json", JSON.stringify(entry, null, 2) + "\n");
console.log(`wrote ${tracks.map((t) => t.mp3).join(", ")}`);
console.log(`wrote src/data/placeholder-sample.json`);
console.log(`${turns.length} turns over ${SECONDS}s`);
