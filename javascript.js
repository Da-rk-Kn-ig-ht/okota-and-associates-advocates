//──EMAILJS INITIALIZATION──
emailjs.init({publicKey: 'xOzQ7NNXlkqe5mzOz'});
// ── 1. HERO ANIMATIONS ──
    window.addEventListener('load', () => {
      document.querySelector('.hero-eyebrow').classList.add('animate');
      document.querySelector('.hero h1').classList.add('animate');
      document.querySelector('.hero-desc').classList.add('animate');
      document.querySelector('.hero-actions').classList.add('animate');
    });

    // ── 2. SCROLL PROGRESS BAR ──
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      document.getElementById('progressBar').style.width = ((scrollTop / docHeight) * 100) + '%';
    });

    // ── 3. NAV: SCROLL SHRINK + ACTIVE LINKS + BACK TO TOP ──
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
      });
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    });

    // ── 4. MOBILE HAMBURGER MENU ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    function toggleMenu(forceClose) {
      const isOpen = forceClose ? false : hamburger.classList.toggle('open');
      if (forceClose) hamburger.classList.remove('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    }

    hamburger.addEventListener('click', () => toggleMenu());
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        toggleMenu(true);
      }
    });

    // ── 5. SCROLL REVEAL ──
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    // ── 6. COUNTER ANIMATION ──
    function animateCounter(el, target, suffix, duration) {
      let start = 0;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = (start >= 1000 ? (start / 1000).toFixed(1) + 'k' : start) + suffix;
        if (start >= target) clearInterval(timer);
      }, 16);
    }
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('[data-target]').forEach(el => {
            animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '', 1400);
          });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) counterObserver.observe(statsEl);

    // ── 7. FORM VALIDATION ──
    function validateField(id, errId, testFn) {
      const el = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!el || !err) return true;
      const ok = testFn(el.value.trim());
      el.classList.toggle('error', !ok);
      err.classList.toggle('show', !ok);
      if (!el.dataset.listenerAttached) {
        el.dataset.listenerAttached = 'true';
        el.addEventListener('input', () => {
          if (testFn(el.value.trim())) {
            el.classList.remove('error');
            err.classList.remove('show');
          }
        });
      }
      return ok;
    }

    document.getElementById('formSubmit')?.addEventListener('click', () => {
      const v1 = validateField('firstName',    'firstNameErr', v => v.length > 0);
      const v2 = validateField('lastName',     'lastNameErr',  v => v.length > 0);
      const v3 = validateField('phone',        'phoneErr',     v => /[\d\s\-()+]{7,}/.test(v));
      const v4 = validateField('email',        'emailErr',     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      const v5 = validateField('practiceArea', 'practiceErr',  v => v !== '');
      const v6 = validateField('message',      'messageErr',   v => v.length >= 10);

      if (v1 && v2 && v3 && v4 && v5 && v6) {
        const btn = document.getElementById('formSubmit');
        btn.classList.add('loading');
        btn.textContent = 'Sending…';

        // ── EMAILJS CONFIGURATION ──
        const EMAILJS_SERVICE_ID  = 'service_y7kd1h2';
        const EMAILJS_TEMPLATE_ID = 'template_i84j0fp';
        const EMAILJS_PUBLIC_KEY  = 'xOzQ7NNXlkqe5mzOz';

        // ── TEMPLATE PARAMS (matches your EmailJS template variables) ──
        const templateParams = {
          first_name:    document.getElementById('firstName').value.trim(),
          last_name:     document.getElementById('lastName').value.trim(),
          phone:         document.getElementById('phone').value.trim(),
          email:         document.getElementById('email').value.trim(),
          practice_area: document.getElementById('practiceArea').value,
          message:       document.getElementById('message').value.trim(),
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(() => {
            btn.style.display = 'none';
            document.getElementById('formSuccess').classList.add('show');
            ['firstName','lastName','phone','email','practiceArea','message'].forEach(id => {
              const el = document.getElementById(id);
              if (el) { el.value = ''; delete el.dataset.listenerAttached; }
            });
          })
          .catch((error) => {
            console.error('EmailJS error:', error);
            btn.classList.remove('loading');
            btn.textContent = 'Submit Consultation Request →';
            alert('Something went wrong. Please try again or call us directly on 0729 082 553.');
          });
      }
    });

   // ── 8. SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── 9. CLEAN URL AFTER ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', window.location.pathname);
    }
  });
});
