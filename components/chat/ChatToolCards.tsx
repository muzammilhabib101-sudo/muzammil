import type { ChatAddToolApproveResponseFunction } from "ai";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { AssistantUIMessage } from "@/lib/assistant-tools";
import { siteConfig } from "@/lib/site";
import { browserTimeZone, formatInZone, zonedTimeToUtc } from "@/lib/timezone";
import { cn } from "@/lib/utils";
import styles from "./Chat.module.css";

type Part = AssistantUIMessage["parts"][number];
type BookingPart = Extract<Part, { type: "tool-getBookingOptions" }>;
type AppointmentPart = Extract<Part, { type: "tool-requestAppointment" }>;

function Pending({ label }: { label: string }) {
  return (
    <div className={cn(styles.card, styles.cardPending)} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      {label}
    </div>
  );
}

function ContactLink({ icon, href, label }: { icon: IconName; href: string; label: string }) {
  const external = href.startsWith("http");
  return (
    <li>
      <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        <Icon name={icon} size={15} />
        {label}
      </a>
    </li>
  );
}

/** Result of `getBookingOptions`: booking link, in-chat request and contact channels. */
export function BookingOptionsCard({
  part,
  onRequestInChat,
  disabled,
}: {
  part: BookingPart;
  onRequestInChat: () => void;
  disabled: boolean;
}) {
  if (part.state === "output-error") return null;
  if (part.state !== "output-available") return <Pending label="Loading booking options…" />;

  const { call, bookingUrl, canRequestInChat, responseTime, contact } = part.output;
  const localZone = browserTimeZone();
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span className={styles.cardIcon} aria-hidden="true">
          <Icon name="calendar" size={18} />
        </span>
        <div>
          <p className={styles.cardTitle}>{call.name}</p>
          <p className={styles.cardMeta}>Video or phone · replies {responseTime}</p>
        </div>
      </div>

      <div className={styles.cardActions}>
        {bookingUrl && (
          <a className={styles.cardPrimary} href={bookingUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="calendar" size={15} />
            Pick a time
          </a>
        )}
        {canRequestInChat && (
          <button
            type="button"
            className={bookingUrl ? styles.cardSecondary : styles.cardPrimary}
            onClick={onRequestInChat}
            disabled={disabled}
          >
            <Icon name="send" size={14} />
            Request in chat
          </button>
        )}
      </div>

      {bookingUrl && localZone && localZone !== part.output.ownerTimeZone && (
        <p className={styles.cardHint}>
          The booking page shows times in your local timezone ({localZone}), so they may differ from{" "}
          {siteConfig.name.split(" ")[0]}’s time in {siteConfig.timezoneLabel}. That’s expected.
        </p>
      )}

      <ul className={styles.contactList} aria-label="Other ways to get in touch">
        <ContactLink icon="mail" href={`mailto:${contact.email}`} label={contact.email} />
        <ContactLink icon="whatsapp" href={contact.whatsapp} label="WhatsApp" />
        <ContactLink icon="phone" href={contact.phoneHref} label={contact.phone} />
        <ContactLink icon="linkedin" href={contact.linkedin} label="LinkedIn" />
      </ul>
    </div>
  );
}

/** `requestAppointment`: review-and-approve card, then the sending outcome. */
export function AppointmentCard({
  part,
  onApprovalResponse,
  disabled,
}: {
  part: AppointmentPart;
  onApprovalResponse: ChatAddToolApproveResponseFunction;
  disabled: boolean;
}) {
  switch (part.state) {
    case "input-streaming":
      return <Pending label="Preparing your request…" />;
    case "input-available":
    case "approval-responded":
      return <Pending label="Sending your request…" />;
    case "output-denied":
      return <p className={styles.cardNote}>Request not sent.</p>;
    case "output-error":
      return (
        <div className={cn(styles.card, styles.cardError)} role="alert">
          Something went wrong sending your request.
        </div>
      );
    case "output-available": {
      const { output } = part;
      if (output.status === "sent") {
        return (
          <div className={cn(styles.card, styles.cardSuccess)} role="status">
            <span className={styles.cardIcon} aria-hidden="true">
              <Icon name="check" size={18} />
            </span>
            <div>
              <p className={styles.cardTitle}>Request sent</p>
              <p className={styles.cardMeta}>Check your inbox for a confirmation email.</p>
            </div>
          </div>
        );
      }
      return (
        <div className={cn(styles.card, styles.cardError)} role="alert">
          {output.status === "rate-limited"
            ? "Too many requests from this device. Please try again in a few minutes."
            : "Your request couldn’t be sent right now."}
        </div>
      );
    }
    case "approval-requested": {
      if (part.approval.isAutomatic) return <Pending label="Preparing your request…" />;
      const { name, email, date, time, timezone, notes } = part.input;
      const start = zonedTimeToUtc(date, time, timezone);
      // The denial reason reaches the model, so it asks what to change instead of re-sending.
      const respond = (approved: boolean) =>
        onApprovalResponse({
          id: part.approval.id,
          approved,
          ...(!approved && {
            reason: "Not sent. The visitor clicked 'Edit details' and wants to change something first.",
          }),
        });
      return (
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardIcon} aria-hidden="true">
              <Icon name="calendar" size={18} />
            </span>
            <div>
              <p className={styles.cardTitle}>Review your intro call request</p>
              <p className={styles.cardMeta}>Nothing is sent until you confirm.</p>
            </div>
          </div>
          <dl className={styles.cardDetails}>
            <dt>Name</dt>
            <dd>{name}</dd>
            <dt>Email</dt>
            <dd>{email}</dd>
            <dt>Your time</dt>
            <dd>
              {start ? formatInZone(start, timezone) : `${date} ${time}`}
              <span className={styles.cardCaption}>{timezone}</span>
            </dd>
            {start && timezone !== siteConfig.timezone && (
              <>
                <dt>{siteConfig.name.split(" ")[0]}’s time</dt>
                <dd>
                  {formatInZone(start, siteConfig.timezone)}
                  <span className={styles.cardCaption}>{siteConfig.timezoneLabel}</span>
                </dd>
              </>
            )}
            {notes && (
              <>
                <dt>Notes</dt>
                <dd>{notes}</dd>
              </>
            )}
          </dl>
          <div className={styles.cardActions}>
            <button type="button" className={styles.cardPrimary} onClick={() => respond(true)} disabled={disabled}>
              <Icon name="send" size={14} />
              Send request
            </button>
            <button type="button" className={styles.cardSecondary} onClick={() => respond(false)} disabled={disabled}>
              Edit details
            </button>
          </div>
        </div>
      );
    }
  }
}
