document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  // ─── Smooth scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
      menu.classList.remove('navbar__menu--open');
      toggle.classList.remove('navbar__toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ─── Mobile toggle ───
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('navbar__menu--open');
    toggle.classList.toggle('navbar__toggle--open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // ─── Navbar scroll shadow ───
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  }, { passive: true });

  // ─── Active section observer ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('navbar__link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: `-${navbar.offsetHeight + 20}px 0px -40% 0px`, threshold: 0 });

  sections.forEach(s => observer.observe(s));

  // ─── GSAP Animations ───
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const defaults = { duration: 0.8, ease: 'power3.out' };

  // Hero — image + decorations appear together, text in parallel
  const heroTl = gsap.timeline({ delay: 0.15 });
  heroTl
    .from('.hero__image-wrapper', { ...defaults, x: -40, opacity: 0, duration: 0.6 })
    .from('.hero__title', { ...defaults, y: 30, opacity: 0, duration: 0.6 }, 0)
    .from('.hero__separator', { width: 0, opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.2)
    .from('.hero__description', { ...defaults, y: 15, opacity: 0, duration: 0.5 }, 0.3)
    .from('.hero__cta', { ...defaults, y: 15, opacity: 0, duration: 0.5 }, 0.35)
    .from('.hero__line', { opacity: 0, duration: 0.5 }, 0.2);

  // About
  gsap.from('.about__title', {
    ...defaults, y: 40, opacity: 0,
    scrollTrigger: { trigger: '.about', start: 'top 80%' }
  });
  gsap.from('.about__separator', {
    ...defaults, width: 0, opacity: 0,
    scrollTrigger: { trigger: '.about', start: 'top 75%' }
  });
  gsap.from('.about__text p', {
    ...defaults, y: 30, opacity: 0, stagger: 0.15,
    scrollTrigger: { trigger: '.about__text', start: 'top 80%' }
  });
  gsap.from('.about__bottom-ornament', {
    ...defaults, scale: 0.5, opacity: 0,
    scrollTrigger: { trigger: '.about__bottom-ornament', start: 'top 90%' }
  });

  // Testimonials
  gsap.from('#testimonials .section-title', {
    ...defaults, y: 40, opacity: 0,
    scrollTrigger: { trigger: '#testimonials', start: 'top 80%' }
  });
  gsap.from('.testimonial-card', {
    ...defaults, y: 60, opacity: 0, stagger: 0.2,
    scrollTrigger: { trigger: '.testimonials__grid', start: 'top 80%' }
  });

  // Process
  gsap.from('#process .section-title', {
    ...defaults, y: 40, opacity: 0,
    scrollTrigger: { trigger: '#process', start: 'top 80%' }
  });
  gsap.from('.process-card', {
    ...defaults, y: 50, opacity: 0, scale: 0.95, stagger: 0.12,
    scrollTrigger: { trigger: '.process__grid', start: 'top 80%' }
  });
  gsap.from('.process-card__connector', {
    duration: 0.4, scaleX: 0, opacity: 0, transformOrigin: 'left center', stagger: 0.15,
    delay: 0.6,
    scrollTrigger: { trigger: '.process__grid', start: 'top 80%' }
  });

  // Achievements
  gsap.from('#achievements .section-title', {
    ...defaults, y: 40, opacity: 0,
    scrollTrigger: { trigger: '#achievements', start: 'top 80%' }
  });
  gsap.from('.achievements__card', {
    ...defaults, y: 50, opacity: 0, stagger: 0.25,
    scrollTrigger: { trigger: '.achievements__inner', start: 'top 70%' }
  });
  gsap.from('.achievements__list li', {
    ...defaults, x: -20, opacity: 0, stagger: 0.06,
    scrollTrigger: { trigger: '.achievements__list', start: 'top 80%' }
  });
  gsap.from('.award-row', {
    ...defaults, x: 20, opacity: 0, stagger: 0.08,
    scrollTrigger: { trigger: '.awards-list', start: 'top 80%' }
  });

  // CTA
  const ctaTl = gsap.timeline({
    scrollTrigger: { trigger: '.cta-section', start: 'top 75%' }
  });
  ctaTl
    .from('.cta-section__title', { ...defaults, y: 40, opacity: 0 })
    .from('.cta-section__separator', { ...defaults, width: 0, opacity: 0, duration: 0.4 }, '-=0.4')
    .from('.cta-section__subtitle', { ...defaults, y: 20, opacity: 0 }, '-=0.3')
    .from('.cta-section__desc', { ...defaults, y: 20, opacity: 0 }, '-=0.2')
    .from('.cta-section__button', { ...defaults, scale: 0.9, opacity: 0 }, '-=0.2');

  // Footer
  gsap.from('.footer__socials', {
    ...defaults, y: 30, opacity: 0,
    scrollTrigger: { trigger: '.footer', start: 'top 85%' }
  });
  gsap.from('.footer__social-icon', {
    ...defaults, scale: 0, opacity: 0, stagger: 0.1,
    scrollTrigger: { trigger: '.footer__socials', start: 'top 90%' }
  });

  // Decorative lines fade in
  gsap.utils.toArray('.about__vline, .achievements__vline, .testimonials__top-line').forEach(el => {
    gsap.from(el, {
      opacity: 0, duration: 1.2,
      scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top 80%' }
    });
  });

  // Section separators & ornaments
  gsap.utils.toArray('.section-separator, .section-ornament').forEach(el => {
    gsap.from(el, {
      scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });
});
