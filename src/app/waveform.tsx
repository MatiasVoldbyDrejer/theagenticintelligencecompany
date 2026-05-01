const BARS = [0.32, 0.58, 0.84, 1.0, 0.74, 0.46, 0.28, 0.52, 0.78, 0.94, 0.66, 0.38, 0.22, 0.48, 0.7, 0.86, 0.6, 0.34, 0.2, 0.42, 0.64, 0.8, 0.56, 0.3, 0.18, 0.4];

export function Waveform() {
  const width = 280;
  const height = 36;
  const gap = width / BARS.length;
  const strokeW = 1.6;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="block"
    >
      {BARS.map((amp, i) => {
        const x = gap / 2 + i * gap;
        const halfH = (amp * (height - strokeW)) / 2;
        const delay = (i * 90) % 1800;
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={height / 2 - halfH}
            y2={height / 2 + halfH}
            stroke="currentColor"
            strokeWidth={strokeW}
            strokeLinecap="round"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: `breathe ${2400 + (i % 5) * 220}ms ease-in-out ${delay}ms infinite alternate`,
            }}
          />
        );
      })}
    </svg>
  );
}
