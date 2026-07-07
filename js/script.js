/* ===========================================================
   RR DECORATION CENTER — Site Interactions
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 350);
  });
  setTimeout(() => preloader && preloader.classList.add('is-hidden'), 2500);

  /* -------------------------------------------------------
     DECLARE shared variables FIRST so all functions below
     can safely reference them without hoisting errors
  ------------------------------------------------------- */
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-section]');
  const sections = ['home', 'about', 'services', 'gallery', 'testimonials', 'contact'];

  /* ---------- Mobile bottom nav: scroll-spy active state ---------- */
  function updateMobileNavActive() {
    if (!mobileNavItems.length) return;
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = id;
    });
    mobileNavItems.forEach(item => {
      item.classList.toggle('is-active', item.getAttribute('data-section') === current);
    });
  }

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('site-header');

  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');

    const backTop = document.getElementById('back-to-top');
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add('is-visible');
      else backTop.classList.remove('is-visible');
    }

    updateMobileNavActive();
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backTopBtn = document.getElementById('back-to-top');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hero slideshow ---------- */
  const heroSlides = document.querySelectorAll('#hero-slides .hero-slide');
  const heroDotsWrap = document.getElementById('hero-dots');
  let heroIndex = 0;
  let heroTimer;

  if (heroSlides.length && heroDotsWrap) {
    heroSlides.forEach((slide, i) => {
      const bg = slide.getAttribute('data-bg');
      if (bg) slide.style.backgroundImage = `url('${bg}')`;
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show slide ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToHeroSlide(i));
      heroDotsWrap.appendChild(dot);
    });

    function goToHeroSlide(i) {
      heroSlides[heroIndex].classList.remove('is-active');
      heroDotsWrap.children[heroIndex].classList.remove('is-active');
      heroIndex = i;
      heroSlides[heroIndex].classList.add('is-active');
      heroDotsWrap.children[heroIndex].classList.add('is-active');
      resetHeroTimer();
    }
    function nextHeroSlide() {
      goToHeroSlide((heroIndex + 1) % heroSlides.length);
    }
    function resetHeroTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(nextHeroSlide, 5500);
    }
    resetHeroTimer();
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.count');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 8900;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => counterObserver.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Desktop: hover to play videos in gallery ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    galleryItems.forEach(item => {
      if (!item.classList.contains('video-item')) return;
      const vid = item.querySelector('video');
      if (!vid) return;
      item.addEventListener('mouseenter', () => vid.play().catch(() => { }));
      item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    });
  }

  /* ---------- Lightbox (images AND videos) ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVid = document.getElementById('lightbox-video');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let lightboxList = [];
  let lightboxIndex = 0;

  // Inject counter badge into lightbox
  const counter = document.createElement('div');
  counter.className = 'lightbox-counter';
  counter.id = 'lightbox-counter';
  if (lightbox) lightbox.appendChild(counter);

  const getVisibleItems = () =>
    Array.from(galleryItems).filter(i => !i.classList.contains('is-hidden'));

  const showLightboxItem = () => {
    const item = lightboxList[lightboxIndex];
    if (!item) return;
    const isVideo = item.classList.contains('video-item');

    lightboxImg.style.display = 'none';
    lightboxImg.src = '';
    lightboxVid.style.display = 'none';
    lightboxVid.pause && lightboxVid.pause();
    lightboxVid.src = '';

    if (isVideo) {
      const vid = item.querySelector('video');
      if (vid) {
        lightboxVid.src = vid.src;
        lightboxVid.style.display = 'block';
        lightboxVid.play().catch(() => { });
      }
    } else {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.display = 'block';
      }
    }

    const ctr = document.getElementById('lightbox-counter');
    if (ctr) ctr.textContent = `${lightboxIndex + 1} / ${lightboxList.length}`;
  };

  const openLightbox = (item) => {
    lightboxList = getVisibleItems();
    lightboxIndex = lightboxList.indexOf(item);
    // pause all grid previews
    galleryItems.forEach(gi => { const v = gi.querySelector('video'); if (v) v.pause(); });
    showLightboxItem();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxVid.pause) lightboxVid.pause();
    lightboxVid.src = '';
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', e => {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex - 1 + lightboxList.length) % lightboxList.length;
      showLightboxItem();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', e => {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex + 1) % lightboxList.length;
      showLightboxItem();
    });
  }
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev?.click();
    if (e.key === 'ArrowRight') lightboxNext?.click();
  });

  // Touch swipe on lightbox
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 40) return;
      dx < 0 ? lightboxNext?.click() : lightboxPrev?.click();
    }, { passive: true });
  }

  /* ---------- Testimonials carousel ---------- */
  const testiTrack = document.getElementById('testi-track');
  const testiDotsWrap = document.getElementById('testi-dots');
  let testiIndex = 0;
  let testiTimer;

  if (testiTrack && testiDotsWrap) {
    const testiCards = testiTrack.querySelectorAll('.testi-card');
    testiCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToTesti(i));
      testiDotsWrap.appendChild(dot);
    });
    function goToTesti(i) {
      testiIndex = (i + testiCards.length) % testiCards.length;
      testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
      Array.from(testiDotsWrap.children).forEach((d, idx) =>
        d.classList.toggle('is-active', idx === testiIndex)
      );
      resetTestiTimer();
    }
    function resetTestiTimer() {
      clearInterval(testiTimer);
      testiTimer = setInterval(() => goToTesti(testiIndex + 1), 6000);
    }
    resetTestiTimer();
  }

  /* ---------- Floating labels: mark filled select fields ---------- */
  document.querySelectorAll('.field select').forEach(sel => {
    const markFilled = () => sel.closest('.field')?.classList.toggle('select-filled', !!sel.value);
    sel.addEventListener('change', markFilled);
    markFilled();
  });

  /* ---------- Contact form → WhatsApp with detailed pre-defined message ---------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const phone = document.getElementById('f-phone').value.trim();
      const eventType = document.getElementById('f-event').value.trim();
      const date = document.getElementById('f-date').value.trim();
      const msg = document.getElementById('f-msg').value.trim();

      let formattedDate = date;
      if (date) {
        try {
          formattedDate = new Date(date).toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });
        } catch (_) { formattedDate = date; }
      }

      const lines = [
        `🌸 *New Decoration Enquiry — RR Decoration Center*`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 *Name:* ${name}`,
        `📞 *Phone:* ${phone}`,
        eventType ? `🎉 *Event Type:* ${eventType}` : null,
        date ? `📅 *Event Date:* ${formattedDate}` : null,
        msg ? `📝 *Details:* ${msg}` : null,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `📍 *Location:* Thanjavur, Tamil Nadu`,
        `🙏 Kindly confirm availability and share a quote at your earliest convenience.`
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/919944657416?text=${text}`, '_blank', 'noopener');
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});