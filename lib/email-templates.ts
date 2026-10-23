import type { ContactFields } from "@/lib/contact";
import { siteConfig } from "@/lib/site";

/*
 * HTML emails built with tables and inline styles so they render consistently
 * in Gmail, Outlook and Apple Mail. Colours mirror the tokens in globals.css.
 * Every visitor-supplied value is escaped before it is inserted.
 */

const C = {
  bg: "#0B0F19",
  card: "#0F1524",
  border: "#1E293B",
  text: "#E2E8F0",
  strong: "#F8FAFC",
  muted: "#94A3B8",
  dim: "#64748B",
  indigo: "#6366F1",
  cyan: "#06B6D4",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const GRADIENT = `background-color:${C.indigo};background-image:linear-gradient(135deg,${C.indigo} 0%,${C.cyan} 100%);`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapes text and keeps the visitor's line breaks. */
function multiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;border-radius:999px;${GRADIENT}color:#ffffff;font-weight:600;font-size:14px;text-decoration:none;">${label}</a>`;
}

function layout({ preheader, title, body }: { preheader: string; title: string; body: string }): string {
  const { contact } = siteConfig;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background-color:${C.bg};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${FONT};">
  <tr><td style="padding:0 4px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;border-radius:12px;${GRADIENT}color:#ffffff;font-weight:700;font-size:14px;">${siteConfig.initials}</td>
      <td style="padding-left:12px;">
        <div style="color:${C.strong};font-size:16px;font-weight:600;">${escapeHtml(siteConfig.name)}</div>
        <div style="color:${C.muted};font-size:13px;">${escapeHtml(siteConfig.role)}</div>
      </td>
    </tr></table>
  </td></tr>
  <tr><td bgcolor="${C.card}" style="background-color:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;">
    <div style="height:4px;line-height:4px;font-size:0;${GRADIENT}">&nbsp;</div>
    <div style="padding:32px 32px 28px;color:${C.text};font-size:15px;line-height:1.65;">${body}</div>
  </td></tr>
  <tr><td align="center" style="padding:24px 8px 0;color:${C.dim};font-size:12.5px;line-height:1.7;">
    <a href="${escapeHtml(siteConfig.url)}" style="color:${C.cyan};text-decoration:none;">Portfolio</a>
    &nbsp;·&nbsp;
    <a href="${escapeHtml(contact.linkedin)}" style="color:${C.cyan};text-decoration:none;">LinkedIn</a>
    &nbsp;·&nbsp;
    <a href="mailto:${escapeHtml(contact.email)}" style="color:${C.cyan};text-decoration:none;">${escapeHtml(contact.email)}</a>
    <br>${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.role)} · ${escapeHtml(siteConfig.location)}
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function detailRow(label: string, valueHtml: string): string {
  return `<tr>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};vertical-align:top;width:110px;color:${C.muted};font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">${label}</td>
  <td style="padding:12px 0;border-bottom:1px solid ${C.border};color:${C.strong};font-size:15px;">${valueHtml}</td>
</tr>`;
}

type Email = { subject: string; html: string; text: string };

/** Notification sent to the site owner with the visitor's details. */
export function ownerNotificationEmail(fields: ContactFields, receivedAt: Date): Email {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const details = fields.details.trim();
  const when = receivedAt.toUTCString();

  const body = `
<p style="margin:0 0 6px;color:${C.cyan};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;">New contact form message</p>
<h1 style="margin:0 0 22px;color:${C.strong};font-size:22px;line-height:1.3;">${escapeHtml(name)} wants to talk about a project</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
  ${detailRow("Name", escapeHtml(name))}
  ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${C.cyan};text-decoration:none;">${escapeHtml(email)}</a>`)}
  ${detailRow("Received", escapeHtml(when))}
</table>
<p style="margin:0 0 10px;color:${C.muted};font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;">Message</p>
<div style="margin:0 0 28px;padding:18px 20px;background-color:${C.bg};border:1px solid ${C.border};border-left:3px solid ${C.indigo};border-radius:12px;color:${C.text};font-size:15px;line-height:1.7;">${multiline(details)}</div>
${button(`mailto:${email}?subject=${encodeURIComponent(`Re: Your project inquiry`)}`, `Reply to ${escapeHtml(name.split(/\s+/)[0])}`)}
<p style="margin:18px 0 0;color:${C.dim};font-size:13px;">Tip: just hit reply. This email’s reply-to is set to the sender.</p>`;

  return {
    subject: `New project inquiry from ${name}`,
    html: layout({ preheader: details.slice(0, 120), title: "New contact form message", body }),
    text: `New contact form message\n\nName: ${name}\nEmail: ${email}\nReceived: ${when}\n\nMessage:\n${details}\n`,
  };
}

/**
 * Thank-you note sent to the visitor. It deliberately does not echo their
 * message, so the form can't be used to send arbitrary content to third parties.
 */
export function visitorConfirmationEmail(fields: ContactFields): Email {
  const firstName = fields.name.trim().split(/\s+/)[0];
  const { contact } = siteConfig;
  const ownerFirst = siteConfig.name.split(" ")[0];

  const body = `
<h1 style="margin:0 0 18px;color:${C.strong};font-size:22px;line-height:1.3;">Thanks for reaching out, ${escapeHtml(firstName)}!</h1>
<p style="margin:0 0 16px;">I’ve received your message and appreciate you taking the time to get in touch. I read every inquiry personally and usually reply within <strong style="color:${C.strong};">24 hours</strong>.</p>
<p style="margin:0 0 24px;">In the meantime, feel free to look through my recent work or connect with me on LinkedIn. If it’s urgent, you can also reach me on WhatsApp at <a href="${escapeHtml(contact.whatsapp)}" style="color:${C.cyan};text-decoration:none;">${escapeHtml(contact.phoneDisplay)}</a>.</p>
${button(`${siteConfig.url}/#projects`, "View my projects")}
<p style="margin:28px 0 0;">Talk soon,<br><strong style="color:${C.strong};">${escapeHtml(siteConfig.name)}</strong><br><span style="color:${C.muted};font-size:14px;">${escapeHtml(siteConfig.role)}</span></p>
<p style="margin:24px 0 0;padding-top:18px;border-top:1px solid ${C.border};color:${C.dim};font-size:12.5px;">You’re receiving this because this address was used on the contact form at ${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}. If that wasn’t you, you can safely ignore this email.</p>`;

  return {
    subject: `Thanks for reaching out, ${firstName} — I’ve received your message`,
    html: layout({ preheader: `Thanks for getting in touch. ${ownerFirst} will reply within 24 hours.`, title: "Thanks for reaching out", body }),
    text: `Hi ${firstName},\n\nThanks for reaching out! I've received your message and usually reply within 24 hours.\n\nIn the meantime, you can see my recent work at ${siteConfig.url}/#projects or reach me on WhatsApp at ${contact.phoneDisplay}.\n\nTalk soon,\n${siteConfig.name}\n${siteConfig.role}\n\nYou're receiving this because this address was used on the contact form at ${siteConfig.url}. If that wasn't you, you can ignore this email.\n`,
  };
}
