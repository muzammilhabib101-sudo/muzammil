import { GlowCard } from "@/components/ui/GlowCard";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TagList } from "@/components/ui/TagList";
import { expertise, expertiseSection } from "@/content/portfolio";
import { cn } from "@/lib/utils";
import styles from "./Expertise.module.css";

export function Expertise() {
  const { id, kicker, title, description } = expertiseSection;

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader kicker={kicker} title={title} description={description} titleId={`${id}-title`} />

        <div className={styles.grid}>
          {expertise.map((item) => (
            <GlowCard key={item.title} className={cn("glass", styles.card)} data-reveal>
              <div className={styles.icon}>
                <Icon name={item.icon} size={24} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <TagList items={item.tags} label={`${item.title} focus areas`} />
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
