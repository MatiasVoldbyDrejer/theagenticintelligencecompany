/**
 * The data use agreement, as one exported constant.
 *
 * PLACEHOLDER TEXT — not legal terms. Replace `LICENSE_TEXT` with the real
 * agreement and bump `LICENSE_VERSION`; never edit a published version in
 * place, because an acceptance record points at a version and a hash and both
 * have to keep resolving to what the person actually read.
 *
 * The retention clause is load-bearing rather than boilerplate. A recording
 * licensed under this agreement is not retractable: withdrawal by a speaker
 * stops further collection and further distribution, and does not reach
 * recordings already delivered. A recipient needs that stated plainly before
 * they build on the corpus.
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

4. Retention
   The licence to recordings delivered under this agreement is perpetual. A
   speaker may withdraw from the platform at any time; withdrawal ends further
   collection and further distribution of their recordings, and does not
   require the recipient to delete or stop using recordings already received,
   or anything derived from them.

5. Security
   The recipient will hold the dataset under access controls no weaker than
   those applied to its own confidential material.

6. Attribution
   Published work making use of the dataset should cite it by name.

7. Term
   The licence continues until terminated by either party. Clauses 2, 3 and 4
   survive termination; the grant in clause 1 to recordings already delivered
   is not revoked by termination.
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
  "Retaining delivered recordings, and anything derived from them, indefinitely",
] as const;

export const LICENSE_PROHIBITED = [
  "Redistributing, resharing, sublicensing or reselling the audio",
  "Attempting to identify a speaker, or link a recording to any external record",
] as const;
