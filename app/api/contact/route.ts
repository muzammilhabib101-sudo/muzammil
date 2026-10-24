import { type ContactFields, validateContact } from "@/lib/contact";
import { ownerNotificationEmail, visitorConfirmationEmail } from "@/lib/email-templates";
import { getMailer } from "@/lib/mailer";
import { clientIp, MAIL_RATE_LIMIT, rateLimited, stripControlChars as clean } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden honeypot field; pretend it worked and send nothing.
  if (clean(body._gotcha)) return Response.json({ ok: true });

  const fields: ContactFields = {
    name: clean(body.name).replace(/[\r\n]+/g, " ").trim(),
    email: clean(body.email).replace(/[\r\n]+/g, "").trim(),
    details: clean(body.details).trim(),
  };
  const errors = validateContact(fields);
  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Please add your name, a valid email, and a few words about your project.", fields: errors },
      { status: 400 },
    );
  }

  if (rateLimited(`mail:${clientIp(req)}`, MAIL_RATE_LIMIT)) {
    return Response.json(
      { error: "You’ve sent several messages already. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const mailer = getMailer();
  if (!mailer) {
    console.error("[contact] SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS, then restart.");
    return Response.json(
      { error: `The contact form isn’t available right now. Please email me at ${siteConfig.contact.email}.` },
      { status: 503 },
    );
  }

  const { transporter, config } = mailer;
  const owner = ownerNotificationEmail(fields, new Date());
  try {
    await transporter.sendMail({
      from: { name: `${siteConfig.name} · Portfolio`, address: config.from },
      to: config.to,
      replyTo: { name: fields.name, address: fields.email },
      ...owner,
    });
  } catch (error) {
    console.error("[contact] Failed to send the notification email:", error);
    return Response.json(
      {
        error: `Your message couldn’t be sent. Please try again, or email me at ${siteConfig.contact.email}.`,
      },
      { status: 502 },
    );
  }

  // The owner already has the message, so a failed thank-you email isn't fatal.
  try {
    await transporter.sendMail({
      from: { name: siteConfig.name, address: config.from },
      to: { name: fields.name, address: fields.email },
      replyTo: config.to,
      ...visitorConfirmationEmail(fields),
    });
  } catch (error) {
    console.error("[contact] Failed to send the confirmation email:", error);
  }

  return Response.json({ ok: true });
}
