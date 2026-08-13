"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { LICENSE_NAME } from "@/lib/license";
import { t } from "@/components/dataset/type";

const FALLBACK_EMAIL = "matias@theagenticdatacompany.com";

type Status = "idle" | "sending" | "done" | "error";

export default function RequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState<"research" | "commercial" | "">("");
  const [useCase, setUseCase] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [website, setWebsite] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/dataset-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          affiliation,
          email,
          purpose,
          useCase,
          acceptedLicense: accepted,
          website,
        }),
      });
      if (!res.ok) {
        const b = (await res.json().catch(() => ({}))) as { error?: string };
        setError(
          b.error === "send_failed"
            ? `Something went wrong sending your request. Please email ${FALLBACK_EMAIL} directly.`
            : b.error || "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError(`Something went wrong. Please email ${FALLBACK_EMAIL} directly.`);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm border border-zinc-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-zinc-900">Request received</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
          Thanks, {name.trim().split(/\s+/)[0] || "there"}. We read every request and will reply
          to <span className="text-zinc-900">{email}</span> either way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name">
          <Input value={name} onChange={setName} required autoComplete="name" />
        </Field>
        <Field label="Role" optional>
          <Input
            value={role}
            onChange={setRole}
            placeholder="Research scientist, ML engineer…"
            autoComplete="organization-title"
          />
        </Field>
      </div>

      <Field label="Company or institution">
        <Input value={affiliation} onChange={setAffiliation} required autoComplete="organization" />
      </Field>

      <Field
        label="Email"
        hint="Please use your organizational or institutional address — it is what lets us verify the affiliation above."
      >
        <Input
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="you@institution.edu"
          autoComplete="email"
        />
      </Field>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-900">Purpose</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["research", "Research", "Academic or non-commercial work"],
              ["commercial", "Commercial", "Training or evaluating a product"],
            ] as const
          ).map(([value, label, note]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-sm border px-4 py-3 transition-colors ${
                purpose === value
                  ? "border-zinc-900 bg-white"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="purpose"
                  value={value}
                  checked={purpose === value}
                  onChange={() => setPurpose(value)}
                  required
                  className="h-3.5 w-3.5 accent-zinc-900"
                />
                <span className="text-sm font-medium text-zinc-900">{label}</span>
              </div>
              <p className="mt-1 pl-6 text-[12.5px] text-zinc-500">{note}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="How will the dataset be used?"
        hint="What are you training or studying, and what role does conversational audio play in it?"
      >
        <textarea
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          rows={5}
          required
          className="w-full rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:outline-none"
        />
      </Field>

      {/* Honeypot: hidden from people, irresistible to form bots. */}
      <div aria-hidden className="hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-zinc-200 bg-white px-4 py-3.5">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          required
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-zinc-900"
        />
        <span className="text-[13.5px] leading-6 text-zinc-600">
          I have read and agree to the{" "}
          <Link
            href="/dataset/license"
            className="text-zinc-900 underline decoration-zinc-300 underline-offset-4"
          >
            {LICENSE_NAME}
          </Link>
          , including its no-redistribution and deletion-on-notice terms.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}

/** Label wraps its input so clicking the label focuses the field (no id needed). */
function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-zinc-900">
        {label}
        {optional && <span className="ml-1.5 font-normal text-zinc-400">optional</span>}
      </span>
      {hint && <span className={`block ${t.sectionIntro} !text-[12.5px]`}>{hint}</span>}
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full rounded-sm border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:outline-none"
    />
  );
}
