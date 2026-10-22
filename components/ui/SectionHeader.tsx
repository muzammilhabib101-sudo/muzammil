import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./SectionHeader.module.css";

type SectionHeaderProps = {
  kicker: string;
  title: ReactNode;
  description: string;
  align?: "start" | "center";
  titleId?: string;
};

export function SectionHeader({ kicker, title, description, align = "start", titleId }: SectionHeaderProps) {
  return (
    <div className={cn(styles.head, align === "center" && styles.center)} data-reveal>
      <span className={styles.kicker}>{kicker}</span>
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
