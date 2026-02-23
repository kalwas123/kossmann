document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
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
      menu.classList.remove("nav__menu--open");
      toggle.classList.remove("nav__toggle--open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ─── Mobile toggle ─── */
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("nav__menu--open");
    toggle.classList.toggle("nav__toggle--open");
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

  if (!prefersReduced) {
    const animateObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            animateObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 },
    );

    document
      .querySelectorAll("[data-animate]")
      .forEach((el) => animateObserver.observe(el));
  } else {
    document
      .querySelectorAll("[data-animate]")
      .forEach((el) => el.classList.add("is-visible"));
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

  /* ─── Testimonials slider ─── */
  const track = document.querySelector(".testimonials__track");
  const slides = document.querySelectorAll(".testimonial");
  const dotsContainer = document.querySelector(".testimonials__dots");
  const prevBtn = document.querySelector(".testimonials__btn--prev");
  const nextBtn = document.querySelector(".testimonials__btn--next");

  if (track && slides.length) {
    let current = 1;
    const total = slides.length;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("testimonials__dot");
      if (i === 0) dot.classList.add("testimonials__dot--active");
      dot.setAttribute("aria-label", `Opinia ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".testimonials__dot");

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) =>
        d.classList.toggle("testimonials__dot--active", i === current),
      );
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    let startX = 0;
    let isDragging = false;

    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true },
    );

    track.addEventListener(
      "touchend",
      (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? goTo(current + 1) : goTo(current - 1);
        }
      },
      { passive: true },
    );

    // let autoplayTimer = setInterval(() => goTo(current + 1), 6000);

    // const sliderEl = document.querySelector(".testimonials__slider");
    // sliderEl.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    // sliderEl.addEventListener(
    //   "mouseleave",
    //   () => (autoplayTimer = setInterval(() => goTo(current + 1), 6000)),
    // );
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
