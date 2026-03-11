document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
  const navRight = document.querySelector(".nav__right");
  const menu = document.querySelector(".nav__menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");

  /* ─── Smooth scroll ─── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      const top =
        target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
      window.scrollTo({ top, behavior: "smooth" });
      if (navRight) navRight.classList.remove("nav__right--open");
      menu.classList.remove("nav__menu--open");
      toggle.classList.remove("nav__toggle--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ─── Mobile toggle ─── */
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("nav__menu--open");
    if (navRight) navRight.classList.toggle("nav__right--open", isOpen);
    toggle.classList.toggle("nav__toggle--open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  /* ─── Navbar scroll ─── */
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("nav--scrolled", window.scrollY > 10);
    },
    { passive: true },
  );

  /* ─── Active section highlight ─── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "nav__link--active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }
      });
    },
    {
      rootMargin: `-${nav.offsetHeight + 20}px 0px -40% 0px`,
      threshold: 0,
    },
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ─── Scroll animations ─── */
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const animatedEls = document.querySelectorAll("[data-animate]");

  if (!prefersReduced) {
    const viewportH = window.innerHeight;

    animatedEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < viewportH * 0.9;
      if (inViewport) {
        el.classList.add("is-visible");
      }
    });

    const animateObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            animateObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.2 },
    );

    animatedEls.forEach((el) => {
      if (!el.classList.contains("is-visible")) animateObserver.observe(el);
    });
  } else {
    animatedEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ─── Counter animation ─── */
  const counters = document.querySelectorAll("[data-count]");
  const counterDuration = 1800;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / counterDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (!prefersReduced) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => (c.textContent = c.dataset.count));
  }

  /* ─── Testimonials: truncate long text (500 chars) + "Pokaż więcej" ─── */
  const MAX_TESTIMONIAL_CHARS = 700;
  document.querySelectorAll(".testimonial").forEach((article) => {
    const content = article.querySelector(".testimonial__content");
    if (!content) return;
    const paragraphs = content.querySelectorAll("p");
    if (!paragraphs.length) return;
    const fullText = Array.from(paragraphs)
      .map((p) => p.textContent.trim())
      .filter(Boolean)
      .join(" ");
    if (fullText.length <= MAX_TESTIMONIAL_CHARS) return;

    const excerpt = fullText.slice(0, MAX_TESTIMONIAL_CHARS);
    const rest = fullText.slice(MAX_TESTIMONIAL_CHARS);
    const body = document.createElement("div");
    body.className = "testimonial__body";
    const excerptSpan = document.createElement("span");
    excerptSpan.className = "testimonial__excerpt";
    excerptSpan.textContent = excerpt;
    const dotsSpan = document.createElement("span");
    dotsSpan.className = "testimonial__dots";
    dotsSpan.textContent = "...";
    const restSpan = document.createElement("span");
    restSpan.className = "testimonial__rest";
    restSpan.textContent = rest;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "testimonial__read-more";
    btn.textContent = "Pokaż więcej";
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const expanded = body.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded);
      btn.textContent = expanded ? "Pokaż mniej" : "Pokaż więcej";
    });
    body.append(excerptSpan, dotsSpan, restSpan, btn);
    paragraphs.forEach((p) => p.remove());
    content.insertBefore(body, content.firstElementChild.nextSibling);
  });

  /* ─── Testimonials: show more cards ─── */
  const testimonialsGrid = document.querySelector(".testimonials__grid");
  const testimonialsBtn = document.querySelector(".testimonials__show-more");

  if (testimonialsGrid && testimonialsBtn) {
    testimonialsBtn.addEventListener("click", () => {
      const isExpanded = testimonialsGrid.classList.toggle("is-expanded");
      testimonialsBtn.setAttribute("aria-expanded", isExpanded);
      testimonialsBtn.textContent = isExpanded
        ? "Pokaż mniej"
        : "Pokaż więcej opinii";
    });
  }

  /* ─── GDPR toggle ─── */
  const gdprToggle = document.querySelector(".footer__gdpr-toggle");
  const gdprSection = document.getElementById("gdpr");

  if (gdprToggle && gdprSection) {
    gdprToggle.addEventListener("click", () => {
      const expanded = gdprToggle.getAttribute("aria-expanded") === "true";
      gdprToggle.setAttribute("aria-expanded", !expanded);
      gdprSection.hidden = expanded;
    });
  }
});
