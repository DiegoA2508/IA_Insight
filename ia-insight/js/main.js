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
    // Accesibilidad: estado inicial
    mobileMenu.setAttribute('aria-hidden', 'true');

    let lastFocusedEl = null;

    const closeMobileMenu = () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Devuelve el foco al botón (o al último foco si existe)
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      } else {
        hamburger.focus?.();
      }
    };

    const openMobileMenu = () => {
      lastFocusedEl = document.activeElement;
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', true);
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Enfoca el primer elemento interactivo del menú
      const firstFocusable = mobileMenu.querySelector('a, button');
      firstFocusable?.focus?.();
    };

    hamburger.addEventListener('click', () => {
      const willOpen = !hamburger.classList.contains('open');
      if (willOpen) openMobileMenu();
      else closeMobileMenu();
    });

    // Cierra el menú al hacer clic en un link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // CTA del menú móvil (evita onclick inline)
    const mobileCta = mobileMenu.querySelector('.nav-mobile-cta[data-href]');
    if (mobileCta) {
      mobileCta.addEventListener('click', () => {
        const href = mobileCta.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    }

    // Cierra el menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        if (hamburger.classList.contains('open')) closeMobileMenu();
      }
    });

    // Cierra con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        e.preventDefault();
        closeMobileMenu();
      }
    });
  }

  // CTA del menú móvil en index.html (cuando existe fuera del bloque anterior)
  document.querySelectorAll('.nav-mobile-cta[data-href]').forEach(btn => {
    // Evita duplicar listener si el botón está dentro del mobileMenu manejado arriba
    if (btn.closest('#nav-mobile') && hamburger && mobileMenu) return;
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('data-href');
      if (href) window.location.href = href;
    });
  });

});
