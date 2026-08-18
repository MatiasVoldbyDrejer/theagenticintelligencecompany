/**
 * Site terms of use, as one exported constant.
 *
 * NOT REVIEWED BY COUNSEL as of v1, same as the data use agreement beside it.
 *
 * Deliberately short. It has two jobs - cover the site, and protect the Open
 * Yap 1K samples - and every clause past those invites a reader to go looking
 * for the catch on a page whose whole argument is that there isn't one.
 *
 * SCOPE. This covers theagenticdatacompany.com only. Samples shared with labs
 * on data.theagenticdatacompany.com travel under their own agreements, and
 * sweeping them in here would put two sets of terms over the same audio.
 *
 * THE CLONING BAR IS A CHOICE, NOT AN INCAPACITY. We hold the rights; the
 * speaker terms cover it. Saying otherwise on a public page would be a false
 * statement about our own contracts, and it would be a weaker bar - a right we
 * lack can be obtained from whoever does hold it, whereas one we hold and
 * decline to pass on cannot be routed around. It is withheld under the data
 * use agreement too, so the two documents say the same thing.
 *
 * Never edit a published version in place - revise by bumping TERMS_VERSION.
 */
export const TERMS_VERSION = "v1";

export const TERMS_NAME = "Terms of Use";

/** Rendered beside the player, so the page and the terms cannot drift apart. */
export const SAMPLE_RIGHTS_SUMMARY =
  "Samples stream here for listening. All rights reserved: no downloading or redistribution, and no use to build a voice identifiable as a speaker.";

export const TERMS_TEXT = `THE AGENTIC DATA COMPANY - TERMS OF USE
Version 1

1. What these terms cover
   These terms cover theagenticdatacompany.com: the pages published on it, and
   the sample audio on the Open Yap 1K page. Using the site means accepting
   them.

   They do not cover data.theagenticdatacompany.com, where datasets and samples
   are shared with labs under their own agreements.

   They do not cover a full dataset. Access to one is granted per recipient,
   free of charge, under the data use agreement published with it.

2. The site
   The text, figures, charts and design here are ours. You may read, quote and
   cite them with attribution. Do not republish a substantial part of the site
   as your own work, and do not collect from it by automated means at a rate
   that degrades it for anyone else.

3. Samples
   The sample audio on the Open Yap 1K page is published so you can hear what
   the corpus sounds like. It streams for listening on the page, and all rights
   in it are reserved.

   Do not download, save, re-record, copy, publish or redistribute a sample,
   and do not use one as an input to any model, product or evaluation. A
   browser holding audio while it plays is playback and is not a breach;
   keeping the file afterwards is.

4. Voices
   We hold the rights we would need to build synthetic voices from these
   recordings, and we do not pass them on - not here, and not under the data
   use agreement. That is a decision about the people who recorded for us,
   not an oversight.

   Do not use a sample to build, train, tune or condition any system whose
   output a reasonable person would identify as the voice of a speaker in it.

5. Speakers
   Speakers appear pseudonymously. Do not attempt to identify one, and do not
   attempt to link a sample to any person, account or external record.

6. Withdrawal
   A speaker may ask us to withdraw a sample, and we will remove it. Removal
   stops us serving it. It cannot reach a copy someone has already taken, and
   we will not pretend otherwise - clauses 3 to 5 continue to apply to that
   copy.

   To report infringing material, or to ask for a sample to be withdrawn, write
   to legal@theagenticdatacompany.com.

7. No warranty, and liability
   The site and the samples are provided as they are, without warranty of any
   kind. Figures published here describe a corpus as measured at the time of
   publication, and may change.

   To the fullest extent permitted by law, our total liability arising out of
   these terms will not exceed one hundred United States dollars (USD 100), and
   we are not liable for indirect, incidental or consequential loss. Nothing
   in this clause limits liability that cannot be limited by law.

8. Changes, and governing law
   We may revise these terms. A revision is published at this address under a
   new version number and applies from the date it is published.

   These terms are governed by the laws of the State of Delaware, United
   States, and the state and federal courts located in Delaware have exclusive
   jurisdiction. This does not limit any data-protection right a speaker has
   under the law of their own country, or restrict where a speaker may bring a
   claim.

The Agentic Data Company
131 Continental Dr, Suite 305
Newark, New Castle County, Delaware 19713, United States
legal@theagenticdatacompany.com
`;
