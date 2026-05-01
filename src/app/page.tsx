import Image from "next/image";
import { Waveform } from "./waveform";

export default function Home() {
  return (
    <main className="relative z-10 min-h-dvh font-serif">
      <div className="mx-auto w-full max-w-[600px] px-6 pt-[112px] pb-24 sm:px-0">
        <div className="flex justify-center rise" style={{ ["--rise-delay" as string]: "0ms" }}>
          <Image
            src="/logo.svg"
            alt="The Agentic Intelligence Co."
            width={142}
            height={212}
            priority
            className="h-[212px] w-[141.5px]"
          />
        </div>

        <h1
          className="rise mt-[48px] text-center text-[48px] leading-none tracking-tight text-balance"
          style={{ ["--rise-delay" as string]: "200ms" }}
        >
          The Agentic Intelligence Co.
        </h1>

        <div
          className="rise mt-[44px] flex justify-center text-black/60"
          style={{ ["--rise-delay" as string]: "320ms" }}
        >
          <Waveform />
        </div>

        <div className="mt-[44px] space-y-[30px] text-[20px] leading-[30px] [&>p]:rise [&>p:nth-child(1)]:[--rise-delay:520ms] [&>p:nth-child(2)]:[--rise-delay:600ms] [&>p:nth-child(3)]:[--rise-delay:680ms] [&>p:nth-child(4)]:[--rise-delay:760ms] [&>p:nth-child(5)]:[--rise-delay:840ms] [&>p:nth-child(6)]:[--rise-delay:920ms]">
          <p className="dropcap">
            The interface between humans and computers is changing. For sixty
            years, people have communicated with machines through keyboards,
            mice, and screens — a series of workarounds for the medium humans
            actually use to communicate with one another. Recent progress in
            speech models suggests that this is ending. Within a decade, most
            interaction with computers will be conducted through speech, and
            the systems on the other end will respond with fluency approaching
            that of a person.
          </p>
          <p>
            Voice is the hardest modality. Speech carries not only words but
            identity, emotion, intent, hesitation, and the texture of a room.
            To train a model that hears the way humans do, you need data that
            captures all of it — at scale, across languages, across the long
            tail of how people actually talk.
          </p>
          <p>
            Current speech models are trained largely on audiobooks, podcasts,
            scraped video, and synthetic dialogue. None of these are
            conversation. People do not speak the way narrators read or the
            way podcasters perform, and models trained without real
            conversational data exhibit characteristic failures: they miss
            intent, mishandle turn-taking, and feel uncanny in extended use.
            The gap between current training data and the data required to
            close these failures is large, and it is not closing on its own.
            Conversation is not present on the open internet at the scale or
            fidelity that frontier training requires. It cannot be synthesized
            without inheriting the limitations of the model that generates it.
            It has to be collected.
          </p>
          <p>
            We are the company collecting it. We record real people in real
            conversations, at the scale a frontier lab requires, and deliver
            the resulting corpora to the teams training the models that will
            define the next era of computing. Every hour is consented,
            licensed, and paid for at the source. Every dataset is built to a
            standard suitable for frontier training.
          </p>
          <p>
            Our hypothesis is that the labs that lead the voice era will be
            the labs with the best conversational data, and that the work of
            producing that data is itself a generational undertaking. We are
            building the company equal to it.
          </p>
          <p>
            If you are training a speech model, we would like to work with you.
          </p>
        </div>

        <footer
          className="rise mt-[120px] text-center font-sans text-[14px] leading-6 text-[#afafaf]"
          style={{ ["--rise-delay" as string]: "1080ms" }}
        >
          © The Agentic Intelligence Company 2026
        </footer>
      </div>
    </main>
  );
}
