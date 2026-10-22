import styles from "./AmbientBackground.module.css";

/** Fixed decorative grid and glowing orbs behind the page. */
export function AmbientBackground() {
  return (
    <div aria-hidden="true">
      <div className={styles.grid} />
      <div className={`${styles.orb} ${styles.orbIndigo}`} />
      <div className={`${styles.orb} ${styles.orbCyan}`} />
    </div>
  );
}
