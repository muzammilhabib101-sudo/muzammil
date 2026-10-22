import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { heroContent } from "@/content/portfolio";
import { siteConfig } from "@/lib/site";
import { cn, withBasePath } from "@/lib/utils";
import { Terminal } from "./Terminal";
import styles from "./Hero.module.css";

const { contact } = siteConfig;

const quickLinks: Array<{ icon: IconName; label: string; href: string; external?: boolean }> = [
  { icon: "mail", label: contact.email, href: `mailto:${contact.email}` },
  { icon: "phone", label: contact.phoneDisplay, href: contact.phoneHref },
  { icon: "linkedin", label: "LinkedIn", href: contact.linkedin, external: true },
];

export function Hero() {
  const { eyebrow, headline, lead, stats } = heroContent;

  return (
    <section id="about" className={styles.hero} aria-labelledby="hero-title">
      <div className={cn("container", styles.grid)}>
        <div data-reveal>
          <span className={styles.eyebrow}>
            <span className="pulse-dot" />
            {eyebrow}
          </span>
          <h1 id="hero-title" className={styles.title}>
            {headline.lead} <span className="gradient-text">{headline.highlight}</span> {headline.trail}
          </h1>
          <p className={styles.lead}>{lead}</p>

          <div className={styles.ctas}>
            <ButtonLink href="#projects">
              View Projects
              <Icon name="arrowRight" />
            </ButtonLink>
            <ButtonLink href={withBasePath(siteConfig.resumePath)} variant="glass" download>
              <Icon name="download" />
              Download Resume
            </ButtonLink>
          </div>

          <ul className={styles.badges} aria-label="Quick contact">
            {quickLinks.map(({ icon, label, href, external }) => (
              <li key={href}>
                <a
                  href={href}
                  className={styles.badge}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <Icon name={icon} size={16} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true" data-reveal>
          <Terminal />
          <div className={cn("glass", styles.chip, styles.chipTop)}>
            <span className={cn(styles.chipDot, styles.cyan)} />
            Tool call · <b>search_web()</b>
          </div>
          <div className={cn("glass", styles.chip, styles.chipBottom)}>
            <span className={cn(styles.chipDot, styles.violet)} />3 agents · running
          </div>
        </div>
      </div>

      <div className="container">
        <dl className={styles.stats} data-reveal>
          {stats.map(({ value, label }) => (
            <div key={value} className={styles.stat}>
              <dt className={cn("gradient-text", styles.statValue)}>{value}</dt>
              <dd className={styles.statLabel}>{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
