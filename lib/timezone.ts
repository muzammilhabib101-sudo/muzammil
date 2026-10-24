/*
 * Small timezone helpers built on Intl, shared by the chat UI and the server.
 * They convert a wall-clock time in one IANA zone ("Europe/London") to an exact
 * instant and format it in another zone, including DST changes.
 */

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** The browser's timezone, e.g. "Europe/London" (client only). */
export function browserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/** Milliseconds `timeZone` is ahead of UTC at instant `ts`. */
function zoneOffset(ts: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(ts);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - ts;
}

/**
 * Converts a local date ("2026-11-04") and time ("15:00") in `timeZone` to a
 * Date. Returns null for invalid input or a time skipped by a DST change.
 */
export function zonedTimeToUtc(date: string, time: string, timeZone: string): Date | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t || !isValidTimeZone(timeZone)) return null;

  const [y, mo, da, h, mi] = [d[1], d[2], d[3], t[1], t[2]].map(Number);
  const wall = Date.UTC(y, mo - 1, da, h, mi);
  let ts = wall - zoneOffset(wall, timeZone);
  ts = wall - zoneOffset(ts, timeZone); // second pass settles DST boundaries

  // Reject impossible dates (e.g. 2026-02-30) and times skipped by DST.
  const check = new Date(ts + zoneOffset(ts, timeZone));
  const roundTrips =
    check.getUTCFullYear() === y &&
    check.getUTCMonth() === mo - 1 &&
    check.getUTCDate() === da &&
    check.getUTCHours() === h &&
    check.getUTCMinutes() === mi;
  return roundTrips ? new Date(ts) : null;
}

/** e.g. "Wed, Nov 4, 2026, 3:00 PM GMT" */
export function formatInZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(instant);
}

/** Today's date ("2026-10-24") and time ("14:05") in `timeZone`. */
export function nowInZone(timeZone: string, now = new Date()): { date: string; time: string; weekday: string } {
  const fmt = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-CA", { timeZone, ...options }).format(now);
  return {
    date: fmt({ year: "numeric", month: "2-digit", day: "2-digit" }),
    time: fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
    weekday: new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long" }).format(now),
  };
}
