"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

const SECTION_IDS = navItems.map((item) => item.href.slice(1));

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={cn(styles.nav, scrolled && styles.scrolled, menuOpen && styles.menuOpen)}>
      <div className={cn("container", styles.inner)}>
        <a href="#top" className={styles.brand} aria-label={`${siteConfig.name} — home`}>
          <span className={styles.brandMark}>{siteConfig.initials}</span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{siteConfig.name}</span>
            <span className={styles.brandTag}>
              <span className="pulse-dot" />
              {siteConfig.tagline}
            </span>
          </span>
        </a>

        <nav id="primary-nav" className={cn(styles.links, menuOpen && styles.open)} aria-label="Primary">
          {navItems.map(({ label, href }) => {
            const isActive = activeSection === href.slice(1);
            return (
              <a
                key={href}
                href={href}
                className={cn(styles.link, isActive && styles.active)}
                aria-current={isActive ? "location" : undefined}
                onClick={closeMenu}
              >
                {label}
              </a>
            );
          })}
          <ButtonLink href="#contact" size="sm" className={styles.ctaMobile} onClick={closeMenu}>
            Get in Touch
          </ButtonLink>
        </nav>

        <ButtonLink href="#contact" size="sm" className={styles.cta}>
          Get in Touch
        </ButtonLink>

        <button
          type="button"
          className={styles.toggle}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
