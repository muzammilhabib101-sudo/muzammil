import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contactSection } from "@/content/portfolio";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

const { contact } = siteConfig;

const channels: Array<{ icon: IconName; label: string; value: string; href: string; external?: boolean }> = [
  { icon: "mail", label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: "whatsapp", label: "Phone / WhatsApp", value: contact.phoneDisplay, href: contact.whatsapp, external: true },
  { icon: "linkedin", label: "LinkedIn", value: contact.linkedinHandle, href: contact.linkedin, external: true },
];

export function Contact() {
  const { id, kicker, title, description } = contactSection;

  return (
    <section id={id} className={cn("section", styles.contact)} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader
          align="center"
          kicker={kicker}
          titleId={`${id}-title`}
          title={
            <>
              {title.lead} <span className="gradient-text">{title.highlight}</span> {title.trail}
            </>
          }
          description={description}
        />

        <div className={styles.grid}>
          <ul className={styles.cards}>
            {channels.map(({ icon, label, value, href, external }) => (
              <li key={label} data-reveal>
                <a
                  href={href}
                  className={cn("glass", styles.card)}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <span className={styles.icon}>
                    <Icon name={icon} size={22} strokeWidth={1.8} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.value}>{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
