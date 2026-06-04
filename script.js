/**
 * ============================================================
 * AKASH | AI/ML ENGINEER PORTFOLIO
 * script.js — Interactions, Animations & Canvas
 * ============================================================
 */

/* ── UTILITY: Run after DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTypingEffect();
  initScrollProgress();
  initScrollReveal();
  initActiveNav();
  initSkillBars();
  initContactForm();
  initScrollTop();
  initNeuralCanvas();
  initFooterYear();
});

/* ══════════════════════════════════════════════════════════
   1. NAVBAR — Scroll shadow & sticky behaviour
══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   2. HAMBURGER MENU — Mobile navigation toggle
══════════════════════════════════════════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close on any nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   3. TYPING EFFECT — Hero section animated text
══════════════════════════════════════════════════════════ */
function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'intelligent systems.',
    'ML models.',
    'data pipelines.',
    'AI solutions.',
    'smart chatbots.',
    'the future.',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPING_SPEED   = 80;   // ms per char (typing)
  const DELETING_SPEED = 45;   // ms per char (deleting)
  const PAUSE_AFTER    = 1800; // ms to wait after full phrase
  const PAUSE_BEFORE   = 350;  // ms before starting to type next

  function tick() {
    const phrase = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(tick, isDeleting ? PAUSE_BEFORE : PAUSE_AFTER);
      return;
    }

    if (isDeleting) {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        isPaused   = true;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    } else {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === phrase.length) {
        isDeleting = true;
        isPaused   = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
    }

    setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Start after a short delay to let page settle
  setTimeout(tick, 1000);
}

/* ══════════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR — Top of viewport progress indicator
══════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const update = () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   5. SCROLL REVEAL — Fade-in on scroll using IntersectionObserver
══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   6. ACTIVE NAV HIGHLIGHTING — Highlight nav link for visible section
══════════════════════════════════════════════════════════ */
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = [];

  navLinks.forEach(link => {
    const id = link.dataset.section;
    const el = document.getElementById(id);
    if (el) sections.push({ el, link });
  });

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active from all
          navLinks.forEach(l => l.classList.remove('active'));
          // Add to matching link
          const active = sections.find(s => s.el === entry.target);
          if (active) active.link.classList.add('active');
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0
    }
  );

  sections.forEach(s => observer.observe(s.el));
}

/* ══════════════════════════════════════════════════════════
   7. SKILL BAR ANIMATION — Animate skill bars when visible
══════════════════════════════════════════════════════════ */
function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach(card => observer.observe(card));
}

/* ══════════════════════════════════════════════════════════
   8. CONTACT FORM VALIDATION — Client-side form handling
══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const formSuccess= document.getElementById('formSuccess');

  /**
   * Validate a single field and show/hide error.
   * @param {HTMLElement} input
   * @param {string} errorId
   * @param {string} message
   * @param {(val: string) => boolean} validator
   * @returns {boolean}
   */
  function validateField(input, errorId, message, validator) {
    const errorEl = document.getElementById(errorId);
    const val     = input.value.trim();
    const valid   = validator(val);

    if (!valid) {
      input.classList.add('error');
      if (errorEl) { errorEl.textContent = message; errorEl.classList.add('visible'); }
    } else {
      input.classList.remove('error');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
    }
    return valid;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const errEl = document.getElementById(input.id + 'Error');
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Run all validations
    const validations = [
      validateField(nameInput,    'nameError',    'Please enter your name.',            v => v.length >= 2),
      validateField(emailInput,   'emailError',   'Please enter a valid email address.',v => emailRegex.test(v)),
      validateField(subjectInput, 'subjectError', 'Please enter a subject.',            v => v.length >= 3),
      validateField(messageInput, 'messageError', 'Please write a message (min 10 chars).', v => v.length >= 10),
    ];

    if (!validations.every(Boolean)) return;

    // Simulate form submission (replace with real endpoint / EmailJS / Formspree)
    submitBtn.disabled  = true;
    submitText.textContent = 'Sending…';

    setTimeout(() => {
      formSuccess.textContent = '✅ Message sent! I\'ll get back to you soon.';
      form.reset();
      submitBtn.disabled  = false;
      submitText.textContent = 'Send Message';

      // Clear success after 5s
      setTimeout(() => { formSuccess.textContent = ''; }, 5000);
    }, 1500);
  });
}

/* ══════════════════════════════════════════════════════════
   9. SCROLL-TO-TOP BUTTON
══════════════════════════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('show', window.scrollY > 500);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════
   10. NEURAL NETWORK CANVAS — Animated particle network hero bg
══════════════════════════════════════════════════════════ */
function initNeuralCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* ── Config ── */
  const CONFIG = {
    particleCount : 70,
    maxDist       : 140,   // max px to draw edge
    particleRadius: 2,
    baseSpeed     : 0.3,
    lineAlphaMax  : 0.18,
    cyan          : '0, 212, 255',
    purple        : '124, 77, 255',
    mousePull     : 100,   // px radius where mouse attracts nodes
  };

  let W, H, particles, mouse = { x: -9999, y: -9999 };
  let animId;

  /* ── Particle class ── */
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
      this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
      this.r  = Math.random() * CONFIG.particleRadius + 1;
      this.alpha = Math.random() * 0.5 + 0.3;
      // colour: mostly cyan, some purple
      this.color = Math.random() > 0.2 ? CONFIG.cyan : CONFIG.purple;
    }

    update() {
      // Slight mouse attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mousePull) {
        const force = (CONFIG.mousePull - dist) / CONFIG.mousePull * 0.012;
        this.vx += dx * force;
        this.vy += dy * force;
      }

      // Speed clamp
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > CONFIG.baseSpeed * 3) {
        this.vx = (this.vx / speed) * CONFIG.baseSpeed * 3;
        this.vy = (this.vy / speed) * CONFIG.baseSpeed * 3;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  /* ── Draw edges between nearby particles ── */
  function drawEdges() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i];
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > CONFIG.maxDist) continue;

        const alpha = (1 - d / CONFIG.maxDist) * CONFIG.lineAlphaMax;
        // Blend colours
        const colA = a.color;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${colA}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  /* ── Resize handler ── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    // Re-init particles to spread across new size
    if (particles) particles.forEach(p => {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
    });
  }

  /* ── Init ── */
  function init() {
    resize();
    particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());
  }

  /* ── Animation loop ── */
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawEdges();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  /* ── Mouse tracking ── */
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });
  }

  /* ── Touch support ── */
  hero && hero.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    mouse.x = t.clientX - rect.left;
    mouse.y = t.clientY - rect.top;
  }, { passive: true });

  /* ── Resize debounce ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  /* ── Visibility API — pause when tab hidden ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  });

  init();
  animate();
}

/* ══════════════════════════════════════════════════════════
   11. FOOTER YEAR — Auto-update copyright year
══════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════
   12. SMOOTH SCROLL — Polyfill for older browsers via JS
══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id  = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const navH   = document.getElementById('navbar')?.offsetHeight || 68;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
