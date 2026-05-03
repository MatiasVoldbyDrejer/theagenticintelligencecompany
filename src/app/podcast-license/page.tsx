import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TableOfContents } from "./toc";

export const metadata: Metadata = {
  title: "Podcast License Overview — The Agentic Intelligence Co.",
  description:
    "How we license podcast audio for training speech and audio models — what we pay, what we need, and what the license says.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const tocItems = [
  { id: "about", label: "About" },
  { id: "use", label: "Data use" },
  { id: "pay", label: "What we pay" },
  { id: "how", label: "How it works" },
  { id: "need", label: "What we need" },
  { id: "license", label: "License terms" },
];

export default function PodcastLicensePage() {
  return (
    <main className="relative z-10 min-h-dvh font-serif">
      <div className="mx-auto w-full max-w-[1180px] px-6 pt-[80px] pb-32">
        <div className="xl:grid xl:grid-cols-[180px_640px_180px] xl:justify-center xl:gap-x-12">
          <aside className="hidden xl:block">
            <div className="sticky top-[88px]">
              <TableOfContents items={tocItems} />
            </div>
          </aside>

          <div className="mx-auto w-full max-w-[640px]">
            <Link
              href="/"
              className="rise flex justify-center"
              style={{ ["--rise-delay" as string]: "0ms" }}
              aria-label="The Agentic Intelligence Co."
            >
              <Image
                src="/logo.svg"
                alt="The Agentic Intelligence Co."
                width={71}
                height={106}
                priority
                className="h-[106px] w-[70.75px]"
              />
            </Link>

            <h1
              className="rise mt-[36px] text-center text-[36px] leading-[1.1] tracking-tight text-balance"
              style={{ ["--rise-delay" as string]: "180ms" }}
            >
              Podcast License Overview
            </h1>

            <section
              id="about"
              className="rise scroll-mt-[80px]"
              style={{ ["--rise-delay" as string]: "320ms" }}
            >
              <h2 className="mt-[64px] text-[26px] leading-[1.2] tracking-tight">
                About us
              </h2>
              <div className="prose-body mt-[28px]">
                <p>
                  The{" "}
                  <a
                    href="https://theagenticintelligencecompany.com/"
                    className="underline decoration-black/30 underline-offset-[3px] transition hover:decoration-black"
                  >
                    Agentic Intelligence Company
                  </a>{" "}
                  is a data-licensing company based in Copenhagen, Denmark. We
                  work with teams building speech recognition and audio models,
                  and we license real-world audio to them under clear, written
                  terms. We currently work with more than 100 podcasts.
                </p>
                <p>
                  The defining choice we&rsquo;ve made as a company is that we
                  don&rsquo;t scrape. Most of the audio used to build models
                  like these today was taken from the open web without the
                  permission or knowledge of the people who created it. We do
                  the opposite: we license each conversation directly from its
                  creator, in writing, and we pay for it. We think that&rsquo;s
                  the only fair way to do this work, and the only way the
                  people whose recordings make these systems possible actually
                  share in the value they create.
                </p>
              </div>
            </section>

            <Section id="use" title="What the data is used for">
              <p>
                The teams we license to use podcast audio to build systems that
                need to understand or generate natural human speech. A few
                concrete examples:
              </p>
              <ol className="my-[8px] list-decimal space-y-[18px] pl-[24px] marker:text-black/45">
                <li>
                  <em>Speech recognition.</em> Transcription, captioning,
                  dictation, and voice search. Systems trained on real
                  conversation handle accents, overlapping speech, and casual
                  phrasing far better than ones trained only on read-aloud or
                  scripted text.
                </li>
                <li>
                  <em>Accessibility tools.</em> Captioning, voice control, and
                  assistive communication for people who depend on those
                  interfaces &mdash; domains where accuracy on natural,
                  real-world speech matters most.
                </li>
                <li>
                  <em>Translation.</em> Speech-to-text and speech-to-speech
                  translation across languages and accents.
                </li>
                <li>
                  <em>Conversational systems.</em> Software that needs to
                  handle real back-and-forth &mdash; interruptions, overlap,
                  casual phrasing &mdash; instead of one-turn-at-a-time
                  scripted dialogue.
                </li>
                <li>
                  <em>Voice and audio models.</em> Text-to-speech and similar
                  systems learn the rhythm, intonation, and texture of human
                  speech from large, diverse collections of voices. Your
                  recordings are one of many inputs that help those systems
                  learn what speech sounds like in general.
                </li>
              </ol>
              <p>
                In every case, the recordings are one input among thousands.
                Your conversation isn&rsquo;t the model &mdash; it&rsquo;s a
                small part of what helps the model learn how people actually
                talk.
              </p>
            </Section>

            <Section id="pay" title="What we pay">
              <p>
                We pay <em>US$15 per hour</em> of accepted audio, paid up front
                by bank transfer or PayPal once we&rsquo;ve verified your
                recordings &mdash; before we use the audio for anything. There
                is no cap on how many hours you send us, and no exclusivity:
                you&rsquo;re free to license the same recordings to anyone
                else.
              </p>
            </Section>

            <Section id="how" title="How it works">
              <ol className="my-[8px] list-decimal space-y-[18px] pl-[24px] marker:text-black/45">
                <li>
                  <em>You send us recordings.</em> Upload the raw, unprocessed
                  speaker tracks from each conversation through the link we
                  share with you.
                </li>
                <li>
                  <em>We verify them.</em> We check audio quality, speaker
                  count, and that the rights are clean. We let you know what
                  qualifies.
                </li>
                <li>
                  <em>We pay you up front.</em> $15 per accepted hour, paid by
                  bank transfer before we put the audio to use.
                </li>
              </ol>
            </Section>

            <Section id="need" title="What we need from you">
              <SubHeading>One file per speaker, per conversation</SubHeading>
              <p>
                For each conversation, send us one separate audio file for each
                speaker. A two-person episode is two files. A three-person
                episode is three files. Each file should contain only that
                speaker&rsquo;s voice &mdash; captured directly from their own
                microphone &mdash; for the full length of the conversation.
              </p>

              <SubHeading>Raw microphone recordings only</SubHeading>
              <p>
                We need the unprocessed audio straight from each
                speaker&rsquo;s microphone, before any editing or production.
                This means:
              </p>
              <ul className="my-[4px] list-disc space-y-[14px] pl-[24px] marker:text-black/35">
                <li>
                  <em>
                    No music, intros, outros, jingles, ad reads, or sound
                    effects.
                  </em>{" "}
                  Just the speaker&rsquo;s voice.
                </li>
                <li>
                  <em>No mixed or mastered tracks.</em> Don&rsquo;t send the
                  final published episode or any combined stereo mix.
                </li>
                <li>
                  <em>No post-processing.</em> No noise reduction, EQ,
                  compression, de-essing, leveling, normalization, reverb, or
                  voice enhancement tools (e.g., Adobe Enhance, Auphonic,
                  Descript Studio Sound).
                </li>
                <li>
                  <em>No edits.</em> Don&rsquo;t cut out pauses, mistakes,
                  retakes, or off-topic moments. We want the full unedited
                  recording.
                </li>
              </ul>

              <SubHeading>Where to find these files</SubHeading>
              <p>
                Most modern remote-recording tools save a per-speaker raw
                track automatically. Look for files labeled along these lines:
              </p>
              <ul className="my-[4px] list-disc space-y-[14px] pl-[24px] marker:text-black/35">
                <li>
                  <em>Riverside.fm:</em> the individual &ldquo;separate audio
                  tracks&rdquo; for each participant (not the &ldquo;magic
                  editor&rdquo; export).
                </li>
                <li>
                  <em>Zencastr:</em> the per-guest WAV files from the recording
                  session, before any post-production.
                </li>
                <li>
                  <em>SquadCast:</em> the original per-participant track
                  downloads.
                </li>
                <li>
                  <em>Descript / Captivate / Cleanfeed / others:</em> the
                  original per-speaker source files, not the edited project
                  export.
                </li>
                <li>
                  <em>In-person recording:</em> the individual lavalier or
                  shotgun mic tracks from your recorder, before they were
                  mixed.
                </li>
              </ul>

              <SubHeading>File format</SubHeading>
              <ul className="my-[4px] list-disc space-y-[14px] pl-[24px] marker:text-black/35">
                <li>
                  <em>Format:</em> WAV (uncompressed) or FLAC (lossless).
                </li>
                <li>
                  <em>Channels:</em> mono per file (one speaker per file). If
                  your tool only outputs stereo, that&rsquo;s okay &mdash;
                  just don&rsquo;t mix multiple speakers into one file.
                </li>
              </ul>

              <SubHeading>File naming</SubHeading>
              <p>
                Please name files so we can tell which conversation and which
                speaker each one belongs to. A simple pattern works:
              </p>
              <pre className="overflow-x-auto rounded border border-black/10 bg-black/[0.025] px-4 py-3 font-sans text-[14px] leading-[1.5] text-black/80">
                [show-name]_[episode-or-date]_[speaker-name].wav
              </pre>
              <p>For example:</p>
              <ul className="my-[4px] list-disc space-y-[6px] pl-[24px] font-sans text-[15px] marker:text-black/35">
                <li>podcast-name_episode-1_hannah.wav</li>
                <li>podcast-name_episode-1_jane.wav</li>
              </ul>

              <SubHeading>Conversations themselves</SubHeading>
              <ul className="my-[4px] list-disc space-y-[14px] pl-[24px] marker:text-black/35">
                <li>
                  <em>2 or 3 speakers per conversation.</em> Solo episodes and
                  large panels aren&rsquo;t a fit right now.
                </li>
                <li>
                  <em>Released or unreleased episodes are both fine.</em> The
                  recording doesn&rsquo;t need to have ever aired.
                </li>
                <li>
                  <em>Permission.</em> By uploading your recordings, you agree
                  that you have permission to license them to us under the
                  terms of the agreement.
                </li>
              </ul>
            </Section>

            <Section
              id="license"
              title="What the license actually says, in plain English"
            >
              <Clause heading="You keep ownership of your recordings.">
                This isn&rsquo;t a sale. You&rsquo;re granting us a license
                &mdash; you can still publish, syndicate, and re-license the
                same recordings anywhere else you want. We&rsquo;re really
                just renting access.
              </Clause>
              <Clause heading={"It’s non-exclusive."}>
                You can license the same recordings to other companies in
                parallel. We have no claim to your podcast, your brand, or any
                future episodes you don&rsquo;t choose to send us.
              </Clause>
              <Clause heading="We use the audio to train speech recognition and audio models.">
                We license the audio to teams building speech recognition and
                audio models, and your recordings will be used by those teams
                to train and improve their systems. We may license the same
                recording to more than one team we work with.
              </Clause>
              <Clause
                heading={
                  "Privacy: we care about how people speak, not what they’re saying."
                }
              >
                What makes the audio valuable is the natural rhythm, accent,
                overlap, and texture of real conversation &mdash; not the
                specific topics. Before recordings reach the teams we work
                with, names and other personal identifiers are anonymized and
                any obviously sensitive information is stripped out.
              </Clause>
              <Clause heading="The license is perpetual for accepted recordings.">
                Once we&rsquo;ve accepted and paid for a conversation, the
                license to that specific recording continues &mdash; it
                doesn&rsquo;t end if either of us walks away later. The
                recordings we never accept are deleted.
              </Clause>
              <Clause heading="You confirm the rights are clean.">
                You promise that you actually have the right to license what
                you&rsquo;re sending us.
              </Clause>
            </Section>

            <footer className="mt-[96px] text-center font-sans text-[13px] leading-6 text-[#afafaf]">
              © The Agentic Intelligence Company 2026
            </footer>
          </div>

          <div className="hidden xl:block" aria-hidden />
        </div>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-[80px] scroll-mt-[80px]">
      <hr className="border-0 border-t border-black/10" />
      <h2 className="mt-[44px] text-[26px] leading-[1.2] tracking-tight">
        {title}
      </h2>
      <div className="prose-body mt-[28px]">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-[40px] font-sans text-[15px] font-semibold leading-[1.4] tracking-[-0.005em] text-black first:mt-0">
      {children}
    </h3>
  );
}

function Clause({
  heading,
  children,
}: {
  heading: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-[36px] first:mt-0">
      <p className="font-sans text-[16px] font-semibold leading-[1.4] tracking-[-0.005em] text-black">
        {heading}
      </p>
      <p className="mt-[10px]">{children}</p>
    </div>
  );
}
