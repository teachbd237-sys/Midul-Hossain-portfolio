/* ===================================================================
   MEHEDUL PORTFOLIO — main script
   Vanilla JS + GSAP + ScrollTrigger + Lenis
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     1. LOADER
  ------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initScrollAnimations();
        initTimeline();
      }, 300);
    }
    loaderPercent.textContent = progress;
    loaderFill.style.width = progress + '%';
  }, 120);
  document.body.style.overflow = 'hidden';

  /* ------------------------------------------------------------
     2. LENIS SMOOTH SCROLL + GSAP TICKER
  ------------------------------------------------------------ */
  let lenis;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // anchor links respect lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -20 });
          else target.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('navMobile').classList.remove('open');
        }
      }
    });
  });

  /* ------------------------------------------------------------
     3. CUSTOM CURSOR
  ------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (window.matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    function ringLoop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* ------------------------------------------------------------
     4. MAGNETIC BUTTONS
  ------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ------------------------------------------------------------
     5. NAVBAR SCROLL STATE + MOBILE TOGGLE
  ------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navMobile').classList.toggle('open');
  });

  /* ------------------------------------------------------------
     6. SCRUB PROGRESS BAR (styled as video timeline scrubber)
  ------------------------------------------------------------ */
  const scrubFill = document.getElementById('scrubFill');
  const scrubPlayhead = document.getElementById('scrubPlayhead');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrubFill.style.width = pct + '%';
    scrubPlayhead.style.left = pct + '%';
  });

  /* ------------------------------------------------------------
     7. HERO ROLE ROTATOR
  ------------------------------------------------------------ */
  const roles = ['Video Editor', 'Motion Graphics Artist', 'Creative Storyteller'];
  const roleEl = document.getElementById('roleText');
  let roleIndex = 0;
  function cycleRole() {
    roleIndex = (roleIndex + 1) % roles.length;
    if (window.gsap) {
      gsap.to(roleEl, {
        opacity: 0, y: -10, duration: 0.35, onComplete: () => {
          roleEl.textContent = roles[roleIndex];
          gsap.fromTo(roleEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        }
      });
    } else {
      roleEl.textContent = roles[roleIndex];
    }
  }
  setInterval(cycleRole, 2600);

  /* ------------------------------------------------------------
     8. HERO PARTICLES CANVAS
  ------------------------------------------------------------ */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  function initParticles() {
    resizeCanvas();
    const count = window.innerWidth < 768 ? 30 : 60;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.5 + 0.15
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(183,148,246,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  initParticles();
  if (!prefersReducedMotion) drawParticles();
  window.addEventListener('resize', initParticles);

  /* ------------------------------------------------------------
     9. MOUSE PARALLAX ON HERO GLOWS
  ------------------------------------------------------------ */
  const glowA = document.getElementById('glowA');
  const glowB = document.getElementById('glowB');
  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const px = (e.clientX / window.innerWidth - 0.5);
      const py = (e.clientY / window.innerHeight - 0.5);
      gsap.to(glowA, { x: px * 40, y: py * 40, duration: 1.2, ease: 'power2.out' });
      gsap.to(glowB, { x: px * -40, y: py * -40, duration: 1.2, ease: 'power2.out' });
    });
  }

  /* ------------------------------------------------------------
     10. (portfolio grid, filters, and video modal moved to
     portfolio.html / portfolio.js)
  ------------------------------------------------------------ */

  /* ------------------------------------------------------------
     11. CLIENTS MARQUEE — duplicate track for seamless loop
  ------------------------------------------------------------ */
  const track = document.getElementById('marqueeTrack');
  track.innerHTML += track.innerHTML;

  /* ------------------------------------------------------------
     12. TESTIMONIAL SLIDER
  ------------------------------------------------------------ */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testimonialDots');
  let activeTestimonial = 0;
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(i));
    dotsWrap.appendChild(dot);
  });
  function showTestimonial(i) {
    testimonialCards[activeTestimonial].classList.remove('active');
    dotsWrap.children[activeTestimonial].classList.remove('active');
    activeTestimonial = i;
    testimonialCards[activeTestimonial].classList.add('active');
    dotsWrap.children[activeTestimonial].classList.add('active');
  }
  setInterval(() => showTestimonial((activeTestimonial + 1) % testimonialCards.length), 5000);

  /* ------------------------------------------------------------
     13. (contact form removed — WhatsApp CTA used instead)
  ------------------------------------------------------------ */

  /* ------------------------------------------------------------
     14. BACK TO TOP
  ------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 600 ? '1' : '0';
  });
  backToTop.style.transition = 'opacity .3s ease';
  backToTop.style.opacity = '0';
  backToTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------
     15. SCROLL-TRIGGERED ANIMATIONS (GSAP)
  ------------------------------------------------------------ */
  function initScrollAnimations() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.timeline()
      .to('.hero .reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' });

    // Generic reveal-up for everything below the fold
    document.querySelectorAll('section:not(.hero) .reveal-up').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Section titles / timecodes fade in
    gsap.utils.toArray('.section-title, .timecode').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // Stat counters
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.6, ease: 'power2.out',
            onUpdate: () => el.textContent = Math.floor(obj.val) + suffix
          });
        }
      });
    });

    // Skill bars
    document.querySelectorAll('.skill-fill').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => el.style.width = el.dataset.width + '%'
      });
    });

    // Service + project cards stagger
    gsap.utils.toArray('.services-grid').forEach(grid => {
      gsap.to(grid.children, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 85%' }
      });
    });
  }

  /* ------------------------------------------------------------
     16. TIMELINE PROGRESS LINE
  ------------------------------------------------------------ */
  function initTimeline() {
    if (!window.gsap) return;
    gsap.to('#timelineProgress', {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 }
    });
  }

  /* ------------------------------------------------------------
     17. CUSTOM COLORFUL DROPDOWN (Project Language / Video Type)
  ------------------------------------------------------------ */
  const customSelects = document.querySelectorAll('.custom-select');

  function closeAllSelects(except) {
    customSelects.forEach(cs => {
      if (cs !== except) {
        cs.classList.remove('open');
        cs.querySelector('.custom-select-trigger').setAttribute('aria-expanded', 'false');
      }
    });
  }

  customSelects.forEach(cs => {
    const trigger = cs.querySelector('.custom-select-trigger');
    const valueEl = cs.querySelector('.custom-select-value');
    const triggerDot = cs.querySelector('.trigger-dot');
    const hiddenInput = cs.parentElement.querySelector('input[type="hidden"]');
    const options = cs.querySelectorAll('.custom-select-option');

    valueEl.dataset.originalPlaceholder = valueEl.textContent;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = cs.classList.contains('open');
      closeAllSelects(cs);
      cs.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const dotClass = [...opt.querySelector('.option-dot').classList].find(c => c.startsWith('dot-'));
        valueEl.textContent = opt.textContent.trim();
        valueEl.classList.remove('placeholder');
        triggerDot.className = 'trigger-dot ' + dotClass;
        triggerDot.hidden = false;
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        hiddenInput.value = opt.dataset.value;
        hiddenInput.dispatchEvent(new Event('change'));
        cs.classList.remove('input-error');
        cs.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', () => closeAllSelects());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllSelects();
  });

  /* ------------------------------------------------------------
     18. PROJECT BRIEF FORM -> WHATSAPP
     Builds the message from the form fields and opens WhatsApp
     (app or web) with the owner's number + prefilled text.
     The visitor still has to tap Send inside WhatsApp itself —
     no static site can send a WhatsApp message without that tap.
  ------------------------------------------------------------ */
  const OWNER_WHATSAPP_NUMBER = '8801934811655'; // digits only, no + or spaces

  const briefForm = document.getElementById('whatsappBriefForm');
  if (briefForm) {
    const errorBox = document.getElementById('briefFormError');

    briefForm.addEventListener('submit', (e) => {
      e.preventDefault();
      errorBox.textContent = '';

      const name = document.getElementById('briefName');
      const address = document.getElementById('briefAddress');
      const whatsapp = document.getElementById('briefWhatsapp');
      const budget = document.getElementById('briefBudget');
      const topic = document.getElementById('briefTopic');
      const details = document.getElementById('briefDetails');
      const language = document.getElementById('briefLanguage');
      const videoType = document.getElementById('briefVideoType');

      const languageSelect = language.closest('.form-group').querySelector('.custom-select');
      const videoTypeSelect = videoType.closest('.form-group').querySelector('.custom-select');

      [name, address, whatsapp, budget, topic, details].forEach(f => f.classList.remove('input-error'));
      languageSelect.classList.remove('input-error');
      videoTypeSelect.classList.remove('input-error');

      let firstInvalid = null;
      [name, address, whatsapp, budget, topic, details].forEach(f => {
        if (!f.value.trim()) {
          f.classList.add('input-error');
          if (!firstInvalid) firstInvalid = f;
        }
      });
      if (!language.value) {
        languageSelect.classList.add('input-error');
        if (!firstInvalid) firstInvalid = languageSelect;
      }
      if (!videoType.value) {
        videoTypeSelect.classList.add('input-error');
        if (!firstInvalid) firstInvalid = videoTypeSelect;
      }

      const phoneDigits = whatsapp.value.replace(/[^\d+]/g, '');
      const phoneValid = /^\+?\d{10,15}$/.test(phoneDigits);
      if (whatsapp.value.trim() && !phoneValid) {
        whatsapp.classList.add('input-error');
        if (!firstInvalid) firstInvalid = whatsapp;
      }

      if (firstInvalid) {
        errorBox.textContent = (!phoneValid && whatsapp.value.trim())
          ? 'সঠিক হোয়াটসঅ্যাপ নাম্বার দিন (যেমন +8801XXXXXXXXX)।'
          : 'দয়া করে সবগুলো ঘর পূরণ করুন।';
        if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
      }

      const message =
`নতুন প্রজেক্ট ইনকোয়ারি (ওয়েবসাইট থেকে)

নাম: ${name.value.trim()}
ঠিকানা: ${address.value.trim()}
হোয়াটসঅ্যাপ নাম্বার: ${phoneDigits}
প্রজেক্ট ল্যাঙ্গুয়েজ: ${language.value}
বাজেট: ${budget.value.trim()}
ভিডিও টাইপ: ${videoType.value}
ভিডিও টপিক: ${topic.value.trim()}

প্রজেক্ট ডিটেইলস:
${details.value.trim()}`;

      const waUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener');

      briefForm.reset();
      customSelects.forEach(cs => {
        const valueEl = cs.querySelector('.custom-select-value');
        const triggerDot = cs.querySelector('.trigger-dot');
        valueEl.classList.add('placeholder');
        valueEl.textContent = valueEl.dataset.originalPlaceholder || valueEl.textContent;
        triggerDot.hidden = true;
        cs.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
      });
    });
  }

});
