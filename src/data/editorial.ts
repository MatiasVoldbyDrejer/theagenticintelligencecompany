import type { Editorial, PairedSample } from "@/lib/dataset";
import placeholderSample from "./placeholder-sample.json";

/**
 * Every word on the dataset page that is not a measurement.
 *
 * Hand-written and never generated: the emitter in yap-room overwrites
 * `open-release.measured.json` wholesale on every run, and this file is what it
 * cannot reach. Nothing here may state a figure — put it in the measured half
 * and let the page read it, or it will drift from the corpus the moment the
 * release is rebuilt.
 */

const NAME = "Open Yap 1K";

export const editorial: Editorial = {
  name: NAME,
  tagline: "Channel-separated English natural two-speaker conversations",
  description: [
    `${NAME} is a dataset of channel-separated English natural two-speaker conversations collected through The Agentic Data Company’s platform. Conversations are between friends, family, partners, and colleagues. The conversations were recorded in diverse, real-world conditions, and microphones and environments vary across sessions. Each speaker’s microphone is captured locally as uncompressed 16-bit PCM at 48 kHz.`,
    "The dataset is intended for conversational/S2S, diarization, and audio understanding. It is released publicly to support research and the products its recipients build on it.",
  ].join("\n\n"),

  overview: [
    { detail: "Speakers per recording", value: "2" },
    { detail: "Channels", value: "Dual (one file per speaker)" },
    { detail: "Audio format", value: ".flac / .wav", chip: true },
    { detail: "Sample rate", value: "48 kHz", chip: true },
    { detail: "Bit depth", value: "16-bit PCM", chip: true },
    { detail: "Languages", value: "English (en)" },
    { detail: "Metadata format", value: ".json", chip: true, note: "UTF-8" },
    {
      detail: "Transcription type",
      value: "ASR, word-level with timings",
      note: "(not human-verified)",
    },
    { detail: "Transcription engine", value: "Deepgram Nova-3", chip: true },
    { detail: "Licensing", value: "Free, under a data use agreement" },
  ],

  comparison: {
    note: "Hours are as documented by each corpus. Structure differs across entries - AMI is multi-party, DailyTalk is acted, SpokenWOZ is task-oriented - see the capture column. Telephone-band corpora carry roughly 3.4 kHz of usable speech regardless of the container they ship in, so hours are not directly comparable across the two groups. Corpora assembled by separating third-party recordings are left out: DuplexChat indexes 282,634 hours of English podcast audio, but ships no audio of its own, recovers each speaker by estimation rather than by capture, and leaves the recordings under their original copyright.",
    datasets: [
      { name: "Fisher English", hours: 2000, year: 2004, capture: "Telephone", license: "LDC paid", narrowband: true, access: "paid" },
      { name: NAME, hours: 1020, year: 2026, capture: "Remote, per-speaker", license: "Free, DUA", narrowband: false, ours: true, access: "free-commercial" },
      { name: "CANDOR", hours: 850, year: 2023, capture: "Video chat", license: "CC-BY-NC-4.0", narrowband: false, access: "free-noncommercial" },
      { name: "otoSpeech full-duplex", hours: 280, year: 2026, capture: "Two-speaker", license: "CC-BY-4.0", narrowband: false, access: "free-commercial" },
      { name: "Switchboard-1", hours: 260, year: 1993, capture: "Telephone", license: "LDC paid", narrowband: true, access: "paid" },
      { name: "SpokenWOZ", hours: 249, year: 2023, capture: "Task-oriented", license: "CC-BY-NC-4.0", narrowband: true, access: "free-noncommercial" },
      { name: "CALLHOME", hours: 120, year: 1996, capture: "Telephone", license: "LDC paid", narrowband: true, access: "paid" },
      { name: "AMI Meeting Corpus", hours: 100, year: 2006, capture: "In-person meetings", license: "CC-BY-4.0", narrowband: false, access: "free-commercial" },
      { name: "CALLFRIEND", hours: 60, year: 1996, capture: "Telephone", license: "LDC paid", narrowband: true, access: "paid" },
      { name: "DailyTalk", hours: 20, year: 2022, capture: "Acted dialogue", license: "CC-BY-NC-SA-4.0", narrowband: false, access: "free-noncommercial" },
    ],
  },

  citation: {
    text: `The Agentic Data Company. ${NAME}: channel-separated English natural two-speaker conversations. 2026. Version 1.0. https://theagenticdatacompany.com/open-yap-1k`,
    bibtex: [
      "@misc{openyap1k,",
      `  title     = {${NAME}: Channel-Separated English Natural Two-Speaker Conversations},`,
      "  author    = {The Agentic Data Company},",
      "  year      = {2026},",
      "  version   = {1.0},",
      "  publisher = {The Agentic Data Company},",
      "  url       = {https://theagenticdatacompany.com/open-yap-1k},",
      "}",
    ].join("\n"),
  },

  provenance: {
    summary:
      "All audio was recorded on our own platform. No part of the corpus is scraped, licensed from a third party, or synthesised.",
    points: [
      "Speakers register, give explicit consent before their first recording, and are paid for their time.",
      "Demographics are self-reported at registration, before any recording, and are never inferred from audio.",
      "Speaker and conversation identifiers are pseudonymous and stable within the release. Names, contact details and account identifiers are not included.",
    ],
  },

  quality: [
    {
      title: "Human linguistic QA",
      body: "A human reviews each conversation for language proficiency, accent classification, and ratings for naturalness and expressivity. Conversations judged to be read or performed rather than spontaneous are rejected and not delivered.",
    },
    {
      title: "Track alignment",
      body: "Both tracks are trimmed to a common start reference and equalised to an identical sample count. Pairs that cannot be aligned - either track missing a recorder-start anchor - are excluded from the release rather than shipped approximately aligned.",
    },
    {
      title: "Transcript screening",
      body: "Every transcript is passed through an LLM screen for personally identifying information and for content-policy violations. Flagged conversations are withheld pending human adjudication and are not delivered until cleared.",
    },
  ],

  useCases: [
    {
      title: "Conversational and speech-to-speech",
      icon: "duplex",
      body: "Both sides as independent signals on one timeline.",
    },
    {
      title: "Diarization",
      icon: "diarization",
      body: "Speaker labels by construction, not annotation.",
    },
    {
      title: "Audio understanding",
      icon: "understanding",
      body: "Unprompted speech with word-level transcripts and speaker metadata.",
    },
  ],

  audio: {
    note: "Each figure is computed per track on the delivered files and ships in conv_<id>/metrics.json, so every distribution below can be recomputed from the archive. Percentiles are over conversations and unweighted by duration.",

    // Keys are the group titles the emitter produces. A group with no entry
    // here fails the build rather than rendering as a heading over a gap.
    groupDescriptions: {
      Signal:
        "Computed from the delivered bytes, not from the capture settings requested at record time.",
      "Conversational dynamics":
        "Derived from the two independent signals rather than estimated from a mixture.",
    },

    // Keys are the metric labels the emitter produces. Optional per metric.
    metricNotes: {
      "Effective bandwidth":
        "Highest frequency carrying real energy, over voiced frames. Separates a native 48 kHz capture from a lower-rate source carrying a 48 kHz header: an upsampled track collapses toward its original Nyquist limit.",
      "Speech SNR":
        "Ratio of mean power over voiced frames to mean power over non-voiced frames, per track, using the same voice-activity segmentation as the noise floor below.",
      "Noise floor": "10th-percentile short-term RMS over non-voiced frames.",
      "Integrated loudness":
        "ITU-R BS.1770 integrated loudness over the whole track. Audio is delivered un-normalised; this is reported so a target level can be applied without probing every file.",
      "True peak":
        "Maximum inter-sample peak, 4x oversampled. Values at 0 dBTP indicate a track at clipping risk.",
      Overlap:
        "Share of voiced time in which both tracks are simultaneously voiced. Reported separately from the turn-taking gap: a mixed-channel recording cannot distinguish this from a single speaker.",
      "Turn-taking gap":
        "Median silence between one speaker’s last voiced frame and the other’s first, per conversation. Non-negative by construction; simultaneous speech is counted under Overlap, not as a negative gap. Ships as turn_taking_gap_ms.",
      "Speech dominance":
        "Speaker A’s share of the conversation’s talk time. 0.5 is an even split. Ships as speech_dominance.",
      "Speaking rate": "Transcript words per minute of voiced time, per speaker. Ships as avg_wpm.",
      "Conversation length":
        "Speakers end the call when the conversation ends; nothing is padded to a target length.",
    },
  },

  // PLACEHOLDER audio, from scripts/generate-placeholder-sample.mjs. Replace
  // with real cut clips; the player renders nothing when this is empty.
  samples: [placeholderSample as PairedSample],
};
