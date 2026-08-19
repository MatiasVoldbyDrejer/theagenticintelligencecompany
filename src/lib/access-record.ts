import { createHmac } from "node:crypto";

/**
 * Persists an access request to the yap-room database.
 *
 * This site holds no database credentials. It signs the payload and posts it to
 * an intake route there, which is the only thing that writes the row - a
 * service-role key here would bypass RLS across that whole database.
 *
 * Returns the row id, or null if the record could not be written. The caller
 * decides what to do about that; it must not silently look like success.
 */
export async function recordAccessRequest(payload: Record<string, unknown>): Promise<{
  id: string | null;
  error: string | null;
}> {
  const endpoint = process.env.DATA_ACCESS_INTAKE_URL;
  const secret = process.env.DATA_ACCESS_INTAKE_SECRET;
  if (!endpoint || !secret) {
    return { id: null, error: "not_configured" };
  }

  // The signature covers the exact bytes sent, so the body is serialised once
  // and both signed and posted from that same string.
  const body = JSON.stringify(payload);
  const signature = createHmac("sha256", secret).update(body).digest("hex");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-signature": signature },
      body,
    });
    if (!res.ok) {
      return { id: null, error: `intake_${res.status}` };
    }
    const json = (await res.json()) as { id?: string };
    return { id: json.id ?? null, error: null };
  } catch {
    return { id: null, error: "intake_unreachable" };
  }
}
