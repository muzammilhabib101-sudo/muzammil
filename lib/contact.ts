import { withBasePath } from "@/lib/utils";

export type ContactFields = {
  name: string;
  email: string;
  details: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, true>>;

/** Upper bounds keep emails readable and stop the endpoint being used for bulk text. */
export const CONTACT_LIMITS = { name: 80, email: 254, details: 5000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared by the form and the `/api/contact` route, so both enforce the same rules. */
export function validateContact({ name, email, details }: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const n = name.trim();
  const e = email.trim();
  const d = details.trim();
  if (n.length < 2 || n.length > CONTACT_LIMITS.name) errors.name = true;
  if (!EMAIL_RE.test(e) || e.length > CONTACT_LIMITS.email) errors.email = true;
  if (d.length < 10 || d.length > CONTACT_LIMITS.details) errors.details = true;
  return errors;
}

export function subjectFor(fields: ContactFields): string {
  return `Project inquiry from ${fields.name.trim()}`;
}

/** Error from `/api/contact`, carrying the server's message and any invalid fields. */
export class ContactRequestError extends Error {
  constructor(
    message: string,
    readonly fields: ContactErrors = {},
  ) {
    super(message);
    this.name = "ContactRequestError";
  }
}

export async function sendContactMessage(fields: ContactFields, honeypot = ""): Promise<void> {
  let res: Response;
  try {
    res = await fetch(withBasePath("/api/contact/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, _gotcha: honeypot }),
    });
  } catch {
    throw new ContactRequestError("Network error. Please check your connection and try again.");
  }
  if (res.ok) return;

  const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: ContactErrors };
  throw new ContactRequestError(data.error ?? `Request failed (${res.status}).`, data.fields);
}
