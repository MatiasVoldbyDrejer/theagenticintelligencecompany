import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  JURISDICTION_ATTESTATION,
  JURISDICTION_VERSION,
  LICENSE_NAME,
  LICENSE_TEXT,
  LICENSE_VERSION,
} from "@/lib/license";

const NOTIFY_EMAIL = (
  process.env.DATASET_ACCESS_NOTIFY_EMAIL ?? "matias@theagenticdatacompany.com"
).trim();
const FROM_EMAIL = (
  process.env.DATASET_ACCESS_FROM_EMAIL ?? "requests@theagenticdatacompany.com"
).trim();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Per-instance throttle. Serverless instances are not shared, so this bounds a
 * single attacker's burst rather than the global rate — enough to keep a script
 * from emptying the send quota, and the honeypot below catches the rest. The
 * durable limiter arrives with the database record.
 */
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 8;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Intake for dataset access requests.
 *
 * The acceptance record is the part that matters: the version AND a hash of the
 * exact agreement text served are captured alongside the answers, so what a
 * requester agreed to stays provable after the text is revised. Today that
 * record lives in the notification email; it is meant to move to a durable row.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const f = body as Record<string, unknown>;

  // Honeypot: a field hidden from people and irresistible to form bots. A
  // filled value is silently accepted so the bot has nothing to tune against.
  if (clean(f.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(f.name, 120);
  const role = clean(f.role, 160);
  const affiliation = clean(f.affiliation, 200);
  const email = clean(f.email, 200);
  const purpose = clean(f.purpose, 20);
  const useCase = clean(f.useCase, 4000);
  const accepted = f.acceptedLicense === true;
  const confirmedJurisdiction = f.confirmedJurisdiction === true;

  if (!name || !role || !affiliation || !useCase || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      {
        error:
          "Please fill in your name, role, affiliation, a valid email, and your intended use.",
      },
      { status: 400 },
    );
  }
  if (purpose !== "commercial" && purpose !== "research") {
    return NextResponse.json({ error: "Please select a purpose." }, { status: 400 });
  }
  if (!accepted) {
    return NextResponse.json(
      { error: "Please accept the data use agreement." },
      { status: 400 },
    );
  }
  if (!confirmedJurisdiction) {
    return NextResponse.json(
      { error: "Please confirm the jurisdiction and restricted-party statement." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip, Date.now())) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  const sha = (text: string) => createHash("sha256").update(text).digest("hex");
  const licenseHash = sha(LICENSE_TEXT);
  const jurisdictionHash = sha(JURISDICTION_ATTESTATION);
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const lines = [
    `Name:        ${name}`,
    `Role:        ${role}`,
    `Affiliation: ${affiliation}`,
    `Email:       ${email}`,
    `Purpose:     ${purpose}`,
    "",
    "Intended use:",
    useCase,
    "",
    "- Acceptance record -",
    `Agreement:   ${LICENSE_NAME}`,
    `Version:     ${LICENSE_VERSION}`,
    `Text sha256: ${licenseHash}`,
    `Jurisdiction attestation: ${JURISDICTION_VERSION} (sha256 ${jurisdictionHash})`,
    `IP:          ${ip}`,
    `User agent:  ${userAgent}`,
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: email,
      subject: `Dataset access request - ${affiliation} (${purpose})`,
      text: lines.join("\n"),
      html: `<pre style="font:13px ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(
        lines.join("\n"),
      )}</pre>`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
