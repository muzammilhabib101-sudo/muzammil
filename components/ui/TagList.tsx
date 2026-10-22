import styles from "./TagList.module.css";

type TagListProps = { items: readonly string[]; label?: string };

export function TagList({ items, label = "Tags" }: TagListProps) {
  return (
    <ul className={styles.tags} aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
