"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  buildMailtoHref,
  type ContactErrors,
  type ContactFields,
  isFormspreeConfigured,
  sendViaFormspree,
  validateContact,
} from "@/lib/contact";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import styles from "./ContactForm.module.css";

type Status = { tone: "idle" | "success" | "error"; message: string };

const EMPTY_FIELDS: ContactFields = { name: "", email: "", details: "" };
const IDLE: Status = { tone: "idle", message: "" };

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>(IDLE);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof ContactFields;
    setFields((prev) => ({ ...prev, [name]: event.target.value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateContact(fields);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setStatus({ tone: "error", message: "Please add your name, a valid email, and a few words about your project." });
      return;
    }

    // Bots fill the hidden honeypot field; humans never see it.
    if (new FormData(event.currentTarget).get("_gotcha")) return;

    if (!isFormspreeConfigured) {
      window.location.href = buildMailtoHref(fields);
      setStatus({ tone: "success", message: "Your email app should open with the message ready to send." });
      return;
    }

    setSubmitting(true);
    setStatus(IDLE);
    try {
      await sendViaFormspree(fields);
      setStatus({ tone: "success", message: "Message sent. I’ll get back to you within 24 hours." });
      setFields(EMPTY_FIELDS);
    } catch (error) {
      console.error(error);
      setStatus({
        tone: "error",
        message: `Your message couldn’t be sent. Please try again, or email me at ${siteConfig.contact.email}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name: keyof ContactFields) => ({
    id: `contact-${name}`,
    name,
    value: fields[name],
    onChange: handleChange,
    required: true,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? "contact-status" : undefined,
  });

  return (
    <form className={cn("glass", styles.form)} onSubmit={handleSubmit} noValidate data-reveal>
      <div className={cn(styles.field, errors.name && styles.invalid)}>
        <label htmlFor="contact-name">Name</label>
        <input type="text" placeholder="Your name" autoComplete="name" {...fieldProps("name")} />
      </div>
      <div className={cn(styles.field, errors.email && styles.invalid)}>
        <label htmlFor="contact-email">Email</label>
        <input type="email" placeholder="you@company.com" autoComplete="email" {...fieldProps("email")} />
      </div>
      <div className={cn(styles.field, errors.details && styles.invalid)}>
        <label htmlFor="contact-details">Project Details</label>
        <textarea rows={5} placeholder="What would you like to automate or build?" {...fieldProps("details")} />
      </div>

      <input type="text" name="_gotcha" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <Button type="submit" block disabled={submitting}>
        {submitting ? (
          "Sending…"
        ) : (
          <>
            Send Message
            <Icon name="send" />
          </>
        )}
      </Button>

      <p id="contact-status" className={cn(styles.status, styles[status.tone])} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
