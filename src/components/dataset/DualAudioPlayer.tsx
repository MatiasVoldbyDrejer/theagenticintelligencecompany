"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface DualAudioPlayerProps {
  urlA: string | null;
  urlB: string | null;
  className?: string;
  muteA?: boolean;
  muteB?: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

export interface DualAudioPlayerHandle {
  seek: (seconds: number) => void;
  getAudioA: () => HTMLAudioElement | null;
  getAudioB: () => HTMLAudioElement | null;
}

/** Drives the two per-speaker tracks as one transport: a single play/pause and
 *  scrubber, with both elements seeking together. */
const DualAudioPlayer = forwardRef<DualAudioPlayerHandle, DualAudioPlayerProps>(
  function DualAudioPlayer(
    { urlA, urlB, className = "", muteA, muteB, onTimeUpdate },
    ref,
  ) {
    const audioARef = useRef<HTMLAudioElement>(null);
    const audioBRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(false);

    const getDuration = useCallback(() => {
      const dA = audioARef.current?.duration ?? 0;
      const dB = audioBRef.current?.duration ?? 0;
      return Math.max(dA, dB) || 0;
    }, []);

    useEffect(() => {
      const a = audioARef.current;
      const b = audioBRef.current;
      if (!a && !b) return;

      const onTimeUpdateInternal = () => {
        const d = getDuration();
        if (!d) return;
        const currentTime = Math.max(a?.currentTime ?? 0, b?.currentTime ?? 0);
        setProgress((currentTime / d) * 100);
        onTimeUpdate?.(currentTime);
      };
      const onLoadedMetadata = () => setDuration(getDuration());
      const onEndedInternal = () => {
        const aEnded = !a || a.ended || a.currentTime >= (a.duration || 0);
        const bEnded = !b || b.ended || b.currentTime >= (b.duration || 0);
        if (!aEnded || !bEnded) return;
        a?.pause();
        b?.pause();
        if (a) a.currentTime = 0;
        if (b) b.currentTime = 0;
        setPlaying(false);
        setProgress(0);
      };
      const onErrorInternal = () => setError(true);

      const elements = [a, b].filter(Boolean) as HTMLAudioElement[];
      for (const el of elements) {
        el.addEventListener("timeupdate", onTimeUpdateInternal);
        el.addEventListener("loadedmetadata", onLoadedMetadata);
        el.addEventListener("ended", onEndedInternal);
        el.addEventListener("error", onErrorInternal);
      }

      // If metadata already loaded (cache hit), `loadedmetadata` fired before
      // these listeners attached and the readout would sit at 0:00 until play.
      const alreadyLoaded =
        (a && Number.isFinite(a.duration) && a.duration > 0) ||
        (b && Number.isFinite(b.duration) && b.duration > 0);
      if (alreadyLoaded) onLoadedMetadata();

      return () => {
        for (const el of elements) {
          el.removeEventListener("timeupdate", onTimeUpdateInternal);
          el.removeEventListener("loadedmetadata", onLoadedMetadata);
          el.removeEventListener("ended", onEndedInternal);
          el.removeEventListener("error", onErrorInternal);
        }
      };
    }, [urlA, urlB, getDuration, onTimeUpdate]);

    useEffect(() => {
      if (audioARef.current) audioARef.current.muted = !!muteA;
      if (audioBRef.current) audioBRef.current.muted = !!muteB;
    }, [muteA, muteB, urlA, urlB]);

    const togglePlay = useCallback(() => {
      const a = audioARef.current;
      const b = audioBRef.current;
      if (playing) {
        a?.pause();
        b?.pause();
        setPlaying(false);
      } else {
        const playA = a?.play() ?? Promise.resolve();
        const playB = b?.play() ?? Promise.resolve();
        Promise.all([playA, playB])
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      }
    }, [playing]);

    useImperativeHandle(
      ref,
      () => ({
        seek: (seconds: number) => {
          const clamped = Math.max(0, seconds);
          if (audioARef.current) audioARef.current.currentTime = clamped;
          if (audioBRef.current) audioBRef.current.currentTime = clamped;
          const d = getDuration();
          if (d) setProgress((clamped / d) * 100);
          onTimeUpdate?.(clamped);
        },
        getAudioA: () => audioARef.current,
        getAudioB: () => audioBRef.current,
      }),
      [getDuration, onTimeUpdate],
    );

    function seek(e: React.MouseEvent<HTMLDivElement>) {
      const d = getDuration();
      if (!d) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const time = ((e.clientX - rect.left) / rect.width) * d;
      if (audioARef.current) audioARef.current.currentTime = time;
      if (audioBRef.current) audioBRef.current.currentTime = time;
    }

    function formatDuration(s: number) {
      return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    }

    if (!urlA && !urlB) return <span className="text-xs text-ink/30">No audio</span>;
    if (error) return <span className="text-xs text-ink/40">Audio unavailable</span>;

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {urlA && <audio ref={audioARef} src={urlA} preload="metadata" />}
        {urlB && <audio ref={audioBRef} src={urlB} preload="metadata" />}
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-bg transition-opacity hover:opacity-90"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="1" y="1" width="3.5" height="10" rx="0.5" />
              <rect x="7.5" y="1" width="3.5" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <polygon points="2,0 12,6 2,12" />
            </svg>
          )}
        </button>
        <div
          className="h-2 flex-1 cursor-pointer rounded-full bg-ink/10"
          onClick={seek}
          role="slider"
          aria-label="Audio progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        >
          <div
            className="h-full rounded-full bg-ink transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        {duration > 0 && (
          <span className="shrink-0 font-mono text-xs tabular-nums text-ink/50">
            {formatDuration(duration)}
          </span>
        )}
      </div>
    );
  },
);

export default DualAudioPlayer;
