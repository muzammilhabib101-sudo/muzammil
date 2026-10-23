import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "@/lib/site";

/*
 * Server-only SMTP setup. Credentials come from environment variables and are
 * never imported by client code.
 */

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  /** Address emails are sent from (must be allowed by the SMTP account). */
  from: string;
  /** Inbox that receives new contact form messages. */
  to: string;
};

function readConfig(): MailerConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT) || 587;
  return {
    host: SMTP_HOST,
    port,
    // Port 465 uses implicit TLS; 587 upgrades with STARTTLS.
    secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: CONTACT_FROM_EMAIL || SMTP_USER,
    to: CONTACT_TO_EMAIL || siteConfig.contact.email,
  };
}

let cached: { config: MailerConfig; transporter: Transporter } | null = null;

/** Returns the configured transporter, or null when SMTP env vars are missing. */
export function getMailer() {
  if (cached) return cached;
  const config = readConfig();
  if (!config) return null;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    requireTLS: !config.secure,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  cached = { config, transporter };
  return cached;
}
