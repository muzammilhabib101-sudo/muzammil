import { SectionHeader } from "@/components/ui/SectionHeader";
import { stack, stackSection } from "@/content/portfolio";
import { cn } from "@/lib/utils";
import styles from "./Stack.module.css";

export function Stack() {
  const { id, kicker, title, description } = stackSection;

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader kicker={kicker} title={title} description={description} titleId={`${id}-title`} />

        <div className={styles.grid}>
          {stack.map((group) => (
            <div key={group.title} className={cn("glass", styles.card)} data-reveal>
              <div className={styles.head}>
                <span className={styles.index} aria-hidden="true">
                  {group.index}
                </span>
                <h3>{group.title}</h3>
              </div>
              <ul className={styles.chips}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
