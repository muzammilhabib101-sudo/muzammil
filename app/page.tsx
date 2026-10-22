import { Contact } from "@/components/sections/contact/Contact";
import { Expertise } from "@/components/sections/Expertise";
import { Hero } from "@/components/sections/hero/Hero";
import { Projects } from "@/components/sections/projects/Projects";
import { Stack } from "@/components/sections/Stack";
import { siteConfig } from "@/lib/site";

/** schema.org Person data so search engines can build a rich profile card. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  url: siteConfig.url,
  email: `mailto:${siteConfig.contact.email}`,
  telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
  address: { "@type": "PostalAddress", addressCountry: "TR" },
  sameAs: [siteConfig.contact.linkedin],
  knowsAbout: siteConfig.keywords,
};

export default function HomePage() {
  return (
    // No element needs id="top": browsers scroll "#top" links to the start of the document.
    <main id="main">
      <Hero />
      <Expertise />
      <Stack />
      <Projects />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
