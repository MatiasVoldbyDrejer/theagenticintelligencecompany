import { buildSnapshot } from "@/lib/build-snapshot";
import type { MeasuredSnapshot } from "@/lib/dataset";
import { editorial } from "./editorial";
import measuredJson from "./open-release.measured.json";

/**
 * The one snapshot the pages read. Merged and validated at module scope, so a
 * bad measured file stops the build instead of reaching a component.
 */
const measured = measuredJson as unknown as MeasuredSnapshot;

if (measured.synthetic) {
  // Not fatal: the page has to be buildable before the release's backfills are
  // done. Loud, because these figures read as measurements on a page that
  // claims to be the largest corpus of its kind.
  console.warn(
    `\n  ⚠  ${measured.slug}: the measured snapshot is SYNTHETIC. Every corpus ` +
      `figure on the dataset page is invented. Re-emit from yap-room before ` +
      `this is announced.\n`,
  );
}

export const dataset = buildSnapshot(measured, editorial);
