import { siteConfig } from "@/lib/site";

export type ContactFields = {
  name: string;
  email: string;
  details: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, true>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name, email, details }: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (name.trim().length < 2) errors.name = true;
  if (!EMAIL_RE.test(email.trim())) errors.email = true;
  if (details.trim().length < 10) errors.details = true;
  return errors;
}

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() ?? "";

/** True once a Formspree form ID is configured; otherwise we fall back to mailto. */
export const isFormspreeConfigured = FORMSPREE_ID.length > 0;

function subjectFor(fields: ContactFields): string {
  return `Project inquiry from ${fields.name.trim()}`;
}

export async function sendViaFormspree(fields: ContactFields): Promise<void> {
  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      name: fields.name.trim(),
      email: fields.email.trim(),
      message: fields.details.trim(),
      _subject: subjectFor(fields),
    }),
  });
  if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
}

export function buildMailtoHref(fields: ContactFields): string {
  const body = `Name: ${fields.name.trim()}\nEmail: ${fields.email.trim()}\n\nProject Details:\n${fields.details.trim()}`;
  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    subjectFor(fields),
  )}&body=${encodeURIComponent(body)}`;
}
