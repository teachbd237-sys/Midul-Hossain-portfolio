/* ===================================================================
   MEHEDUL PORTFOLIO — portfolio page script
   Vanilla JS + GSAP + ScrollTrigger + Lenis
   (Same building blocks as script.js, trimmed to what this page needs)
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

  // anchor links on this page respect lenis (cross-page links like
  // "index.html#about" are untouched and navigate normally)
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

    document.querySelectorAll('a, button, .project-card, [data-magnetic]').forEach(el => {
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
     7. PORTFOLIO DATA + RENDER
     (Same project list as the homepage used to have — add/edit
     projects here, and set each one's YouTube video ID.)
  ------------------------------------------------------------ */
  const projects = [
    { cat: 'commercial', label: 'Commercial', title: 'Motion & Video Editing Showreel', desc: 'Midul Hossain', grad: 'linear-gradient(135deg,#3a1c5e,#161022)', youtube: 'sblqz6fAPnQ' },
    { cat: 'commercial', label: 'Commercial', title: 'Hire me', desc: 'Midul Hossain', grad: 'linear-gradient(135deg,#3a1c5e,#161022)', youtube: 'd6Cyacf-720' },
    { cat: 'commercial', label: 'Commercial', title: 'My Chanel Promo', desc: 'M Tech', grad: 'linear-gradient(135deg,#241c5e,#100f22)', youtube: '12XtxTktxLQ' },
    
    { cat: 'youtube', label: 'YouTube', title: 'Clint Hunting', desc: 'Video For Zenvio Studio', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'cPDrZKY4je0' },
    { cat: 'youtube', label: 'YouTube', title: 'Easy Shopz', desc: 'Video For Zenvio Studio', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'EXTgIBza8jI' },
    { cat: 'youtube', label: 'YouTube', title: 'Quran Care online academy', desc: 'Video For Zenvio Studio', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'sZ_L9ppYM8k' },
    { cat: 'youtube', label: 'YouTube', title: 'MN Fashion', desc: 'Video For Zenvio Studio', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'm0T60NqqWjE' },
    { cat: 'youtube', label: 'YouTube', title: 'Raincot Promo Video', desc: 'Video For Zenvio Studio', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'hkNIYNzlWNY' },
    { cat: 'youtube', label: 'YouTube', title: 'Jihad Khan', desc: 'practice', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'KVB7ipfefLk' },
    { cat: 'youtube', label: 'YouTube', title: 'Tilwatul Quran Academy', desc: 'Video For Zenvio Studio', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'QDtZidvrQb8' },
    { cat: 'youtube', label: 'YouTube', title: 'Creative galariya', desc: 'Video For Creative galariya', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'JpOip4ir29k' },

    { cat: 'motion', label: 'Motion Graphics', title: 'Digital Product Promo Video', desc: 'Flix Premium Shop', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'ITvir7_97pc' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Facebook Verification', desc: 'Digital Sweep', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'RwPkJ2bnPVU' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Netflix Promo Video', desc: '----', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'olrSds3MYdg' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Agency Promo Video', desc: 'Creative Galeriya', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'crBryecoM3Q' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Windows Promo Video', desc: 'Digital Sweep', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'UXWFRShCe6U' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Lebel Print Promo Video', desc: 'Creative Galeriya', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'SvUZOnP65kE' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Grok 4 Promo Video', desc: 'Digital Sweep', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: '2EPBBHtNSvw' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Hospital Promo Video', desc: 'Creative Galeriya', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'sO-W6Z5YAII' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Capcut Pro Promotional Video', desc: 'Digital Sweep', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'pTokZzxkYZo' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Agency Promotional Video', desc: 'Faridpur Ad Agency ', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'Azf-mNlo_MU' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Perfume Promotional Video', desc: 'Nafi Mart', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'ydiwiN1TTDs' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Editing crous Promotional Video', desc: 'Model It Institute', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'k66gKPWLH8c' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Product Promotional Video', desc: '---', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'BJw9DpHrnFI' },
    

    
  ];

  const grid = document.getElementById('portfolioGrid');
  function playIconSVG() {
    return '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal-up';
    card.dataset.filter = p.cat;
    const thumbHtml = p.youtube
      ? `<div class="thumb" style="--grad:${p.grad}"></div>
         <img class="thumb thumb-img" src="https://img.youtube.com/vi/${p.youtube}/maxresdefault.jpg" alt="" loading="lazy"
           onerror="if(this.src.indexOf('maxresdefault')>-1){this.src='https://img.youtube.com/vi/${p.youtube}/hqdefault.jpg';}else{this.remove();}">`
      : `<div class="thumb" style="--grad:${p.grad}"></div>`;
    card.innerHTML = `
      ${thumbHtml}
      <button class="play-btn" aria-label="Play preview">${playIconSVG()}</button>
      <div class="project-card-inner">
        <span class="project-cat">${p.label}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });

  /* filters */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.filter === filter;
        if (window.gsap) {
          gsap.to(card, { opacity: show ? 1 : 0, scale: show ? 1 : 0.9, duration: 0.35, onStart: () => { if (show) card.style.display = ''; }, onComplete: () => { card.style.display = show ? '' : 'none'; } });
        } else {
          card.style.display = show ? '' : 'none';
        }
      });
    });
  });

  /* tilt effect on project cards */
  if (!prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 600, duration: 0.4, ease: 'power2.out' });
    });
    document.addEventListener('mouseover', (e) => {
      if (!e.target.closest('.project-card')) {
        document.querySelectorAll('.project-card').forEach(c => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.6 }));
      }
    });
  }

  /* modal */
  const modal = document.getElementById('portfolioModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCategory = document.getElementById('modalCategory');
  function openModal(p) {
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalCategory.textContent = p.label;
    modalVideo.src = p.youtube ? `https://www.youtube-nocookie.com/embed/${p.youtube}?autoplay=1&rel=0` : '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modalVideo.src = ''; /* clearing the src stops YouTube playback (iframes have no .pause()) */
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ------------------------------------------------------------
     8. BACK TO TOP
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
     9. SCROLL-TRIGGERED ANIMATIONS (GSAP)
  ------------------------------------------------------------ */
  function initScrollAnimations() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    // Generic reveal-up (same pattern used for every non-hero section on
    // the homepage) — covers the page heading, filter bar, and (via the
    // grid stagger below) the project cards.
    document.querySelectorAll('.reveal-up').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // Project cards stagger (overrides the generic reveal above with a
    // nicer staggered entrance once the grid itself scrolls into view)
    gsap.utils.toArray('#portfolioGrid').forEach(g => {
      gsap.to(g.children, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: g, start: 'top 88%' }
      });
    });
  }

});
