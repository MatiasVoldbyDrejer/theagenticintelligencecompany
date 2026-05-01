import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "The Agentic Intelligence Co.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoudy() {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!url) throw new Error("Could not resolve Goudy font URL");
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OG() {
  const iconBuffer = readFileSync(join(process.cwd(), "src/app/icon.png"));
  const iconDataUrl = `data:image/png;base64,${iconBuffer.toString("base64")}`;
  const goudy = await loadGoudy();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Goudy",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconDataUrl} width={180} height={180} alt="" />
        <div style={{ fontSize: 84, marginTop: 56, letterSpacing: "-0.01em" }}>
          The Agentic Intelligence Co.
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 40,
            color: "#555555",
            maxWidth: 900,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Conversational data at frontier scale for the labs training the next era of speech models.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Goudy", data: goudy, style: "normal", weight: 400 },
      ],
    },
  );
}
