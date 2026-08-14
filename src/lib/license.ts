/**
 * The data use agreement, as one exported constant.
 *
 * PLACEHOLDER TEXT — not legal terms. Replace `LICENSE_TEXT` with the real
 * agreement and bump `LICENSE_VERSION`; never edit a published version in
 * place, because an acceptance record points at a version and a hash and both
 * have to keep resolving to what the person actually read.
 *
 * The retention clause is load-bearing rather than boilerplate, and cuts both
 * ways. Speaker withdrawal does not reach recordings already delivered — a
 * recipient needs that before they build on the corpus. Breach, or a written
 * request from us, does reach them.
 */
export const LICENSE_VERSION = "placeholder-v0";

export const LICENSE_NAME = "Placeholder Data Use Agreement v0";

export const LICENSE_TEXT = `PLACEHOLDER DATA USE AGREEMENT (v0)

This text is a structural placeholder. It is not legal advice and is not the
agreement that will govern access to the release.

1. Grant
   The Agentic Data Company grants the recipient a non-exclusive,
   non-transferable, royalty-free licence to use the dataset for commercial or
   research purposes, subject to the terms below.

2. No redistribution
   The recipient may not publish, share, sublicense, resell, or otherwise make
   the dataset or any substantial part of it available to any third party,
   including by depositing it in a public or third-party repository.

3. No re-identification
   The recipient may not attempt to identify any speaker in the dataset, nor
   link any recording or metadata to any external identifier or record.

4. No voice cloning
   The recipient may not use the dataset to create synthetic voice clones,
   voice replicas, or generative reproductions of any person's voice or
   likeness that a reasonable person would identify as matching an individual
   in the dataset.

5. Retention
   The licence to the dataset delivered under this agreement is perpetual. A
   speaker may withdraw from the platform at any time; withdrawal ends further
   collection and further distribution of their recordings, and does not
   require the recipient to delete or stop using any part of the dataset
   already received, or anything derived from it.

   The recipient will permanently delete all copies of the dataset from its
   systems if it breaches this agreement, or on written request from The
   Agentic Data Company.

6. Security
   The recipient will hold the dataset under access controls no weaker than
   those applied to its own confidential material.

7. Attribution
   Published work making use of the dataset should cite it by name.

8. Term
   The licence continues until terminated by either party. Clauses 2, 3, 4 and
   5 survive termination.
`;

/**
 * Plain-language summary of LICENSE_TEXT for the Access section.
 *
 * Kept in this file so a change to the agreement and a change to what the page
 * claims about it are the same edit. The agreement governs; this is a reading
 * of it, not a substitute.
 */
export const LICENSE_PERMITTED = [
  "Commercial use, including in products you sell",
  "Research use, published or internal",
  "Training, fine-tuning and evaluating models",
  "Retaining the delivered dataset, and anything derived from it, after a speaker withdraws",
] as const;

export const LICENSE_PROHIBITED = [
  "Redistributing, resharing, sublicensing or reselling the dataset or any part of it",
  "Attempting to identify a speaker, or link a recording to any external record",
  "Creating voice clones, replicas or generative reproductions identifiable as a speaker in the corpus",
  "Retaining any copy of the dataset after a breach of these terms, or after a written request from The Agentic Data Company",
] as const;

/**
 * Export-control attestation, agreed separately from the data use agreement.
 *
 * Versioned like the agreement: the acceptance record stores this version, so a
 * later revision cannot be mistaken for what a given requester attested to.
 */
export const JURISDICTION_VERSION = "ofac-v1";

export const JURISDICTION_ATTESTATION =
  "I confirm that I am not located in, and will not access this dataset from, any " +
  "jurisdiction subject to comprehensive US economic sanctions administered by the " +
  "Office of Foreign Assets Control (OFAC), including Cuba, Iran, North Korea, Syria, " +
  "and the Crimea, Donetsk, and Luhansk regions of Ukraine. I further confirm that I am " +
  "not located in, and will not access this dataset from, China, Russia, or Belarus, and " +
  "that I am not listed on any US government restricted party list.";
