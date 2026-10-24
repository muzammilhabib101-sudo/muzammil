import { type InferUITools, tool, type UIDataTypes, type UIMessage } from "ai";
import { z } from "zod";
import { ownerAppointmentEmail, visitorAppointmentEmail } from "@/lib/email-templates";
import { getMailer } from "@/lib/mailer";
import { MAIL_RATE_LIMIT, rateLimited, stripControlChars } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";
import { formatInZone, zonedTimeToUtc } from "@/lib/timezone";

/*
 * Server-side tools for the portfolio assistant. The client only imports the
 * types at the bottom, so nothing here (SMTP, env vars) reaches the browser.
 */

/** Calendly / Cal.com link for instant booking. Optional; https only. */
function bookingUrl(): string | null {
  const url = process.env.BOOKING_URL?.trim();
  return url && /^https:\/\//i.test(url) ? url : null;
}

/** Single-line value safe for email headers and subjects. */
function oneLine(value: string): string {
  return stripControlChars(value).replace(/[\r\n]+/g, " ").trim();
}

export function createAssistantTools({ ip }: { ip: string }) {
  return {
    getBookingOptions: tool({
      description: `Show the visitor every way to contact ${siteConfig.name} and book a ${siteConfig.introCall.name.toLowerCase()}. Call it whenever the visitor asks how to reach him, hire him, talk, schedule or book a meeting. The UI renders the result as a card, so don't repeat the links in your reply.`,
      inputSchema: z.object({}),
      execute: async () => ({
        call: siteConfig.introCall,
        bookingUrl: bookingUrl(),
        ownerTimeZone: siteConfig.timezone,
        canRequestInChat: getMailer() !== null,
        responseTime: "within 24 hours",
        contact: {
          email: siteConfig.contact.email,
          phone: siteConfig.contact.phoneDisplay,
          phoneHref: siteConfig.contact.phoneHref,
          whatsapp: siteConfig.contact.whatsapp,
          linkedin: siteConfig.contact.linkedin,
        },
      }),
    }),

    requestAppointment: tool({
      description: `Send ${siteConfig.name} a request for a ${siteConfig.introCall.name.toLowerCase()} and email the visitor a confirmation. Only call it once you have the visitor's name, email, preferred date/time and timezone. The visitor reviews and approves the details in the UI before anything is sent.`,
      inputSchema: z
        .object({
          name: z.string().min(2).max(80).describe("The visitor's full name."),
          email: z.email().max(254).describe("The visitor's email address."),
          date: z.string().describe("Preferred date in the visitor's timezone, as YYYY-MM-DD."),
          time: z.string().describe("Preferred start time in the visitor's timezone, 24-hour HH:mm."),
          timezone: z.string().describe('The visitor\'s IANA timezone, e.g. "Europe/London" or "America/New_York".'),
          notes: z
            .string()
            .max(1000)
            .optional()
            .describe("Optional short summary of what the visitor wants to discuss, if they mentioned it."),
        })
        .refine((input) => zonedTimeToUtc(input.date, input.time, input.timezone) !== null, {
          message: "Invalid date, time or timezone. Use YYYY-MM-DD, 24-hour HH:mm and an IANA timezone.",
        })
        .refine((input) => (zonedTimeToUtc(input.date, input.time, input.timezone)?.getTime() ?? 0) > Date.now(), {
          message: "That time is in the past. Ask the visitor for a future date and time.",
        }),
      execute: async (input) => {
        if (rateLimited(`mail:${ip}`, MAIL_RATE_LIMIT)) return { status: "rate-limited" as const };

        const mailer = getMailer();
        if (!mailer) {
          console.error("[chat] SMTP is not configured, so booking requests can't be emailed.");
          return { status: "unavailable" as const, bookingUrl: bookingUrl(), email: siteConfig.contact.email };
        }

        // Validated by the schema above, so this is never null here.
        const start = zonedTimeToUtc(input.date, input.time, input.timezone) as Date;
        const request = {
          name: oneLine(input.name),
          email: oneLine(input.email),
          visitorTime: formatInZone(start, input.timezone),
          ownerTime: formatInZone(start, siteConfig.timezone),
          timezone: input.timezone,
          notes: input.notes ? stripControlChars(input.notes).trim() || undefined : undefined,
        };
        const { transporter, config } = mailer;

        try {
          await transporter.sendMail({
            from: { name: `${siteConfig.name} · Portfolio`, address: config.from },
            to: config.to,
            replyTo: { name: request.name, address: request.email },
            ...ownerAppointmentEmail(request, new Date()),
          });
        } catch (error) {
          console.error("[chat] Failed to send the booking request email:", error);
          return { status: "failed" as const, email: siteConfig.contact.email };
        }

        // The owner already has the request, so a failed confirmation isn't fatal.
        try {
          await transporter.sendMail({
            from: { name: siteConfig.name, address: config.from },
            to: { name: request.name, address: request.email },
            replyTo: config.to,
            ...visitorAppointmentEmail(request),
          });
        } catch (error) {
          console.error("[chat] Failed to send the booking confirmation email:", error);
        }

        return {
          status: "sent" as const,
          // Guidance for the model's follow-up reply; the UI shows its own success card.
          note: `Already sent; nothing left to review. ${siteConfig.name.split(" ")[0]} will confirm by email within 24 hours.`,
        };
      },
    }),
  };
}

export type AssistantTools = ReturnType<typeof createAssistantTools>;
export type AssistantUIMessage = UIMessage<unknown, UIDataTypes, InferUITools<AssistantTools>>;
