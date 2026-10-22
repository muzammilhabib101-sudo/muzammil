import { SectionHeader } from "@/components/ui/SectionHeader";
import { TagList } from "@/components/ui/TagList";
import { projects, projectsSection } from "@/content/portfolio";
import { cn } from "@/lib/utils";
import { ProjectArt } from "./ProjectArt";
import styles from "./Projects.module.css";

export function Projects() {
  const { id, kicker, title, description } = projectsSection;

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader kicker={kicker} title={title} description={description} titleId={`${id}-title`} />

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <article key={project.title} className={cn("glass", styles.project)} data-reveal>
              <div className={cn(styles.art, styles[project.art])}>
                <ProjectArt kind={project.art} />
              </div>
              <div className={styles.body}>
                <span className={styles.num}>Case {String(i + 1).padStart(2, "0")}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <TagList items={project.tags} label={`${project.title} technologies`} />
                <a href="#contact" className={styles.link}>
                  Discuss this project <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
