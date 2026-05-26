/**
 * main.js
 * Lógica principal: hamburguesa, scroll reveal, navbar activa.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Partículas ──────────────────────────────────────────
  if (typeof initParticles === 'function') {
    initParticles('bg-canvas');
  }

  // ── Scroll Reveal (Intersection Observer) ───────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  // ── Navbar: link activo según página actual ─────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });

  // ── Navbar: clase scrolled al hacer scroll ──────────────
  const nav = document.querySelector('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Hamburguesa ─────────────────────────────────────────
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Bloquea scroll del body cuando el menú está abierto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cierra el menú al hacer clic en un link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });

    // Cierra el menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }

});
