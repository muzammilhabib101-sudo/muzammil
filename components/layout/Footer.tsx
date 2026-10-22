import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CurrentYear } from "./CurrentYear";
import styles from "./Footer.module.css";

const { contact } = siteConfig;

const footerLinks = [
  { label: "Email", href: `mailto:${contact.email}` },
  { label: "WhatsApp", href: contact.whatsapp, external: true },
  { label: "LinkedIn", href: contact.linkedin, external: true },
  { label: "Back to top ↑", href: "#top" },
];

export function Footer() {
  const buildYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={cn("container", styles.inner)}>
        <p>
          © <CurrentYear buildYear={buildYear} /> {siteConfig.name} — {siteConfig.role}. Built for the future of AI.
        </p>
        <nav className={styles.links} aria-label="Footer">
          {footerLinks.map(({ label, href, external }) => (
            <a key={label} href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
