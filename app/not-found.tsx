import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main" className={`container ${styles.wrapper}`}>
      <span className={styles.code}>404</span>
      <h1>This page drifted out of the agent loop.</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Link href="/" className={buttonClass({})}>
        Back to home
      </Link>
    </main>
  );
}
