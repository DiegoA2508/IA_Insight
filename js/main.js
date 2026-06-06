/**
 * main.js
 * Lógica principal: hamburguesa, scroll reveal, navbar activa.
 */

function insertGlobalScript(src, attrs = {}) {
  const script = document.createElement('script');
  script.src = src;
  script.async = attrs.async !== undefined ? attrs.async : true;
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'async') return;
    script.setAttribute(key, value);
  });
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {

  insertGlobalScript('https://quge5.com/88/tag.min.js', {
    'data-zone': '246649',
    'data-cfasync': 'false',
    async: true
  });

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

  initLegalModals();
});

/** Modales legales del footer */
function initLegalModals() {
  const CONTENT = {
    about: {
      title: 'Sobre nosotros',
      body: `
        <p><strong>IA·Insight</strong> es un proyecto educativo independiente creado para explicar la Inteligencia Artificial de forma clara, accesible y en español.</p>
        <p>Nuestro objetivo es acercar conceptos como machine learning, deep learning, procesamiento del lenguaje y ética de la IA a estudiantes, profesionales y personas curiosas, sin necesidad de conocimientos técnicos previos.</p>
        <h3>Qué ofrecemos</h3>
        <ul>
          <li>Contenido divulgativo sobre fundamentos, aplicaciones e historia de la IA.</li>
          <li>Recursos organizados por temas para facilitar el aprendizaje autónomo.</li>
          <li>Un enfoque neutral y orientado a la comprensión, no a la venta de productos.</li>
        </ul>
        <h3>Equipo y contacto</h3>
        <p>IA·Insight es un sitio estático desarrollado con HTML, CSS y JavaScript. Si deseas colaborar, reportar un error o sugerir mejoras, puedes contactarnos a través de los enlaces sociales del pie de página.</p>
        <p class="legal-note">Última actualización: mayo de 2025.</p>
      `,
    },
    legal: {
      title: 'Aviso legal',
      body: `
        <p>En cumplimiento de la normativa aplicable en materia de servicios de la sociedad de la información, se informa a los usuarios de los datos identificativos del titular de este sitio web.</p>
        <h3>Titular del sitio</h3>
        <p><strong>Denominación:</strong> IA·Insight<br>
        <strong>Actividad:</strong> Sitio web informativo y educativo sobre Inteligencia Artificial.<br>
        <strong>Correo de contacto:</strong> disponible mediante los canales indicados en el pie de página.</p>
        <h3>Objeto</h3>
        <p>El presente sitio tiene carácter meramente informativo. Los contenidos tienen fines divulgativos y no constituyen asesoramiento profesional, técnico, jurídico ni financiero.</p>
        <h3>Propiedad intelectual</h3>
        <p>Los textos, diseño, código y elementos gráficos de IA·Insight están protegidos por la legislación de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa del titular, salvo uso personal y no comercial con mención de la fuente.</p>
        <h3>Enlaces externos</h3>
        <p>Este sitio puede incluir enlaces a páginas de terceros. IA·Insight no se responsabiliza del contenido, políticas ni prácticas de sitios ajenos.</p>
        <h3>Limitación de responsabilidad</h3>
        <p>El titular no garantiza la ausencia de errores en los contenidos ni su actualización permanente, aunque procura mantener la información lo más precisa posible.</p>
      `,
    },
    terms: {
      title: 'Términos y condiciones',
      body: `
        <p>El acceso y uso de IA·Insight implica la aceptación de los presentes términos. Si no estás de acuerdo con ellos, te recomendamos no utilizar el sitio.</p>
        <h3>Uso del sitio</h3>
        <ul>
          <li>El usuario se compromete a hacer un uso lícito, respetuoso y conforme a la buena fe.</li>
          <li>Queda prohibido intentar dañar, sobrecargar o interferir en el funcionamiento del sitio.</li>
          <li>No está permitido extraer contenidos de forma masiva (scraping) sin autorización.</li>
        </ul>
        <h3>Contenidos</h3>
        <p>La información publicada es orientativa. Aunque se revisa con cuidado, puede contener imprecisiones o quedar desactualizada respecto al avance de la tecnología.</p>
        <h3>Modificaciones</h3>
        <p>IA·Insight se reserva el derecho de modificar estos términos, el diseño o los contenidos del sitio en cualquier momento, sin obligación de aviso previo.</p>
        <h3>Legislación aplicable</h3>
        <p>Para cualquier controversia derivada del uso del sitio, serán de aplicación las leyes que correspondan según la jurisdicción del titular, sin perjuicio de los derechos que asistan al usuario como consumidor cuando proceda.</p>
        <p class="legal-note">Vigentes desde mayo de 2025.</p>
      `,
    },
    privacy: {
      title: 'Política de privacidad',
      body: `
        <p>En IA·Insight respetamos tu privacidad. Esta política describe qué datos podemos tratar y con qué finalidad al visitar nuestro sitio.</p>
        <h3>Responsable del tratamiento</h3>
        <p>El responsable es el titular de IA·Insight. Para ejercer tus derechos de acceso, rectificación, supresión u oposición, puedes contactarnos por los medios indicados en el sitio.</p>
        <h3>Datos que recogemos</h3>
        <ul>
          <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, páginas visitadas y tiempo de navegación, recogidos de forma automática por el servidor o herramientas de analítica si se activan.</li>
          <li><strong>Datos que nos envíes:</strong> solo si nos contactas voluntariamente (por ejemplo, correo electrónico).</li>
        </ul>
        <h3>Finalidad y base legal</h3>
        <p>Tratamos los datos para garantizar el funcionamiento del sitio, mejorar la experiencia de usuario, analizar el tráfico de forma agregada y responder consultas. La base legal es el interés legítimo del titular y, cuando aplique, tu consentimiento.</p>
        <h3>Cookies</h3>
        <p>Este sitio puede utilizar cookies técnicas necesarias para su funcionamiento. Si en el futuro se incorporan cookies analíticas o de terceros, se informará y se solicitará consentimiento cuando la normativa lo exija.</p>
        <h3>Conservación y seguridad</h3>
        <p>Los datos se conservan el tiempo estrictamente necesario para las finalidades indicadas y se aplican medidas razonables para evitar accesos no autorizados.</p>
        <h3>Tus derechos</h3>
        <p>Puedes solicitar acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición, así como presentar reclamación ante la autoridad de protección de datos de tu país.</p>
        <p class="legal-note">Última actualización: mayo de 2025.</p>
      `,
    },
  };

  let modalEl = document.getElementById('legal-modal');
  let titleEl = null;
  let bodyEl = null;
  let closeBtn = null;
  let lastFocus = null;

  function buildModal() {
    if (modalEl) {
      titleEl = modalEl.querySelector('.legal-modal-title');
      bodyEl = modalEl.querySelector('#legal-modal-body');
      closeBtn = modalEl.querySelector('.legal-modal-close');
      return;
    }

    modalEl = document.createElement('div');
    modalEl.id = 'legal-modal';
    modalEl.className = 'legal-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');

    modalEl.innerHTML = `
      <div class="legal-modal-backdrop" data-legal-close tabindex="-1"></div>
      <div class="legal-modal-panel" role="document">
        <div class="legal-modal-header">
          <h2 class="legal-modal-title" id="legal-modal-title"></h2>
          <button type="button" class="legal-modal-close" data-legal-close aria-label="Cerrar ventana">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="legal-modal-body" id="legal-modal-body"></div>
      </div>
    `;

    document.body.appendChild(modalEl);
    titleEl = modalEl.querySelector('.legal-modal-title');
    bodyEl = modalEl.querySelector('#legal-modal-body');
    closeBtn = modalEl.querySelector('.legal-modal-close');

    modalEl.querySelectorAll('[data-legal-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });
  }

  function openModal(key) {
    const data = CONTENT[key];
    if (!data) return;
    buildModal();
    if (!modalEl) return;

    lastFocus = document.activeElement;
    titleEl.textContent = data.title;
    bodyEl.innerHTML = data.body;

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('legal-modal-open');
    closeBtn.focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('legal-modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  buildModal();

  document.querySelectorAll('[data-legal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.getAttribute('data-legal'));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
      e.preventDefault();
      closeModal();
    }
  });
}
