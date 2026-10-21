(() => {
  const CONTACT_EMAIL = "muzammilhabib101@gmail.com";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Footer year ----------
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Sticky nav state ----------
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Mobile menu ----------
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // ---------- Active section highlighting ----------
  const navAnchors = [...links.querySelectorAll('a:not(.btn)')];
  const sections = navAnchors.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => sectionObserver.observe(s));

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      revealObserver.observe(el);
    });
  }

  // ---------- Cursor glow on cards ----------
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // ---------- Terminal typing animation ----------
  const lines = [
    '<span class="c"># orchestrate a team of autonomous agents</span>',
    '<span class="k">from</span> agents <span class="k">import</span> Planner, Researcher, Reviewer',
    '',
    'crew = <span class="f">Orchestrator</span>(',
    '    agents=[Planner(), Researcher(), Reviewer()],',
    '    model=<span class="s">"claude"</span>, tools=[search, code_exec],',
    ')',
    'result = <span class="k">await</span> crew.<span class="f">run</span>(<span class="s">"Audit repo &amp; open PR"</span>)',
    '',
    '<span class="c">› planner   </span> decomposed task into 4 steps',
    '<span class="c">› researcher</span> 6 tool calls · context ready',
    '<span class="c">› reviewer  </span> tests passed',
    '<span class="ok">✓ PR #128 opened — fully autonomous</span>',
  ];
  const codeEl = document.getElementById("terminalCode");

  if (reduceMotion) {
    codeEl.innerHTML = lines.join("\n");
  } else {
    // Type out visible characters while keeping HTML tags intact.
    const full = lines.join("\n");
    const tokens = full.match(/<[^>]+>|&[a-z]+;|[\s\S]/g);
    let i = 0;
    const type = () => {
      if (i >= tokens.length) {
        setTimeout(() => { i = 0; codeEl.innerHTML = ""; type(); }, 4500);
        return;
      }
      // Flush tags immediately; only visible chars cost time.
      while (i < tokens.length && tokens[i].startsWith("<")) i++;
      if (i < tokens.length) i++;
      codeEl.innerHTML = tokens.slice(0, i).join("");
      const ch = tokens[i - 1];
      setTimeout(type, ch === "\n" ? 140 : 18 + Math.random() * 22);
    };
    setTimeout(type, 600);
  }

  // ---------- Contact form ----------
  // Sends through Formspree. Create a form at https://formspree.io, then paste
  // its ID below. Until then, the form falls back to opening the visitor's mail app.
  const FORMSPREE_ID = "YOUR_FORM_ID";
  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;
  const formspreeReady = FORMSPREE_ID !== "YOUR_FORM_ID";

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.innerHTML;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setStatus = (type, text) => {
    status.className = `form-status ${type}`;
    status.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let valid = true;

    [["name", data.name.trim().length > 1],
     ["email", emailRe.test(data.email.trim())],
     ["details", data.details.trim().length > 9]].forEach(([field, ok]) => {
      form.querySelector(`#${field}`).closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      setStatus("error", "Please add your name, a valid email, and a few words about your project.");
      return;
    }

    // Bots fill the hidden field; humans never see it.
    if (data._gotcha) return;

    const subject = `Project inquiry from ${data.name.trim()}`;

    if (!formspreeReady) {
      const body = `Name: ${data.name.trim()}\nEmail: ${data.email.trim()}\n\nProject Details:\n${data.details.trim()}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("success", "Your email app should open with the message ready to send.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    setStatus("", "");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          message: data.details.trim(),
          _subject: subject,
        }),
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus("success", "Message sent. I’ll get back to you within 24 hours.");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error", `Your message couldn’t be sent. Please try again, or email me at ${CONTACT_EMAIL}.`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitLabel;
    }
  });

  form.querySelectorAll("input, textarea").forEach((el) =>
    el.addEventListener("input", () => el.closest(".field").classList.remove("invalid"))
  );
})();
