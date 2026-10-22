import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

type Variant = "primary" | "glass";
type Size = "md" | "sm";

type StyleProps = { variant?: Variant; size?: Size; block?: boolean };

export function buttonClass({ variant = "primary", size = "md", block }: StyleProps, className?: string) {
  return cn(styles.btn, styles[variant], size === "sm" && styles.sm, block && styles.block, className);
}

/** Anchor styled as a button — used for in-page navigation and external links. */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...props
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonClass({ variant, size, block }, className)} {...props} />;
}

export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass({ variant, size, block }, className)} {...props} />;
}
