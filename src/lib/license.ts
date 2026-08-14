/**
 * The data use agreement, as one exported constant.
 *
 * PLACEHOLDER TEXT — not legal terms. Replace `LICENSE_TEXT` with the real
 * agreement and bump `LICENSE_VERSION`; never edit a published version in
 * place, because an acceptance record points at a version and a hash and both
 * have to keep resolving to what the person actually read.
 *
 * Two clauses are load-bearing rather than boilerplate: deletion on notice, and
 * no redistribution. They are what makes a gated release compatible with
 * speaker consent — recipients stay identified and accountable, so audio can
 * still be withdrawn after it has been handed over.
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

4. Deletion on notice
   A speaker may withdraw at any time. On written notice, the recipient will
   delete the identified recordings from all systems, including backups and
   derived intermediate artefacts, within thirty days, and confirm in writing.
   Trained model weights are not required to be deleted.

5. Security
   The recipient will hold the dataset under access controls no weaker than
   those applied to its own confidential material.

6. Attribution
   Published work making use of the dataset should cite it by name.

7. Term
   The licence continues until terminated by either party. Clauses 2, 3 and 4
   survive termination.
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
  "Keeping model weights after a deletion notice",
] as const;

export const LICENSE_PROHIBITED = [
  "Redistributing, resharing, sublicensing or reselling the audio",
  "Attempting to identify a speaker, or link a recording to any external record",
  "Keeping identified recordings more than 30 days after a deletion notice",
] as const;
