/**
 * Waveform colours for the paired sample player.
 *
 * Each colour is a { wave, progress } pair: `wave` paints the un-played bars,
 * `progress` the played portion. Two tones are required — if both were the same
 * the playback fill would be invisible — so the accent lives on `progress` with
 * a light tint of the same hue on `wave`. `text` is the class for that track's
 * mute-toggle label, so the toggle letter matches its waveform.
 */
export type WaveformColor = { wave: string; progress: string; text: string };

// Speaker A — the brand accent on the played portion.
export const WAVE_BLUE: WaveformColor = {
  wave: "#a9d2f2",
  progress: "#0087ff",
  text: "text-[#0087ff]",
};

// Speaker B — the warm taupe, so the two tracks never read as one signal.
export const WAVE_EARTHY: WaveformColor = {
  wave: "#c6c3ba",
  progress: "#5d5b51",
  text: "text-stone-600",
};
