(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  if (!body || !body.classList.contains('home-page')) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const text = {
    ar: {
      status: 'معاينة تفاعلية',
      hint: 'اختار صفحة من المجموعة — <b>الكتاب نفسه هيفتح ويتحرك</b> لعرض المعاينة المختارة.',
      cover: 'افتح أو أغلق الكتاب',
      previous: 'المعاينة السابقة',
      next: 'المعاينة التالية',
      thumb: 'افتح المعاينة رقم',
      labels: ['غلاف الفصل', 'مقارنة', 'العلاج', 'الإدارة'],
      watermark: 'DERMA-MAZE • PREVIEW'
    },
    en: {
      status: 'INTERACTIVE PREVIEW',
      hint: 'Choose a page from the collection — <b>the book opens and moves</b> to display the selected preview.',
      cover: 'Open or close the book',
      previous: 'Previous preview',
      next: 'Next preview',
      thumb: 'Open preview number',
      labels: ['Chapter cover', 'Comparison', 'Treatment', 'Management'],
      watermark: 'DERMA-MAZE • PREVIEW'
    }
  };

  const currentLang = () => root.lang === 'en' ? 'en' : 'ar';

  function motionSetup() {
    const start = [
      '.hero-copy',
      '.inside-book .section-head > div',
      '.value-zone .section-head > div',
      '.sales-proof-copy',
      '.faq-zone .section-head > div',
      '.buy-copy'
    ];
    const end = [
      '.hero-art',
      '.inside-book .section-head > p',
      '.value-zone .section-head > p',
      '.sales-proof-visual',
      '.faq-zone .section-head > p',
      '.study-companion-continue'
    ];
    const rise = [
      '.inside-metrics',
      '.study-companion-card',
      '.sales-proof-card',
      '.buy-card'
    ];

    const register = (selector, className) => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('motion-ready', className);
      });
    };
    start.forEach(s => register(s, 'motion-from-start'));
    end.forEach(s => register(s, 'motion-from-end'));
    rise.forEach(s => register(s, 'motion-rise'));

    document.querySelectorAll('.value-card,.inside-feature,.faq-item').forEach((el, index) => {
      el.classList.add('motion-ready', 'motion-rise', 'motion-stagger');
      el.style.setProperty('--motion-delay', `${Math.min(index * 85, 420)}ms`);
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.motion-ready').forEach(el => el.classList.add('motion-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('.motion-ready').forEach(el => observer.observe(el));
  }

  function setupParallax() {
    if (reduceMotion) return;
    const hero = document.querySelector('.hero-art');
    const proof = document.querySelector('.sales-proof-visual');
    let ticking = false;

    const update = () => {
      const y = window.scrollY || 0;
      if (hero) {
        hero.style.setProperty('--hero-shift-y', Math.max(-18, Math.min(18, y * 0.018)).toFixed(2));
      }
      if (proof) {
        const rect = proof.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        proof.style.setProperty('--proof-shift', Math.max(-20, Math.min(20, center * -0.035)).toFixed(2));
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();

    if (finePointer && hero) {
      hero.addEventListener('pointermove', event => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 18;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 13;
        hero.style.setProperty('--hero-shift-x', x.toFixed(2));
        hero.style.setProperty('--hero-shift-y', y.toFixed(2));
      });
      hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--hero-shift-x', '0');
        hero.style.setProperty('--hero-shift-y', '0');
      });
    }
  }

  function buildSalesBook() {
    const art = document.querySelector('.buy-art');
    if (!art || art.dataset.motionBuilt === 'true') return;
    art.dataset.motionBuilt = 'true';
    art.classList.add('motion-book-stage');

    const previews = [
      'assets/images/brand/chapter-cover.webp',
      'assets/images/previews/preview-comparison.webp',
      'assets/images/previews/preview-treatment.webp',
      'assets/images/previews/preview-management.webp'
    ];

    art.innerHTML = `
      <div class="sales-book-scene" id="salesBookScene">
        <div class="sales-book-status"><i></i><span id="salesBookStatus"></span></div>
        <button class="sales-book-control sales-book-prev" id="salesBookPrev" type="button" aria-label=""><span>←</span></button>
        <div class="sales-book" id="salesBook">
          <span class="sales-book-spine" aria-hidden="true"></span>
          <div class="sales-book-page">
            <img id="salesBookPage" src="${previews[0]}" alt="Derma-Maze book preview" loading="lazy"/>
            <span class="sales-book-watermark" id="salesBookWatermark"></span>
            <span class="sales-book-page-label" id="salesBookPageLabel"></span>
          </div>
          <button class="sales-book-cover" id="salesBookCover" type="button" aria-label="">
            <span class="sales-cover-face sales-cover-front"><img src="assets/images/brand/cover-01.webp" alt="Derma-Maze printed book cover"/></span>
            <span class="sales-cover-face sales-cover-back"><span class="sales-cover-back-mark"><img src="assets/icons/favicon.svg" alt=""/><b>DERMA-MAZE</b><small>PRINTED EDITION</small></span></span>
          </button>
        </div>
        <div class="sales-book-shadow" aria-hidden="true"></div>
        <button class="sales-book-control sales-book-next" id="salesBookNext" type="button" aria-label=""><span>→</span></button>
      </div>
      <div class="sales-preview-collection" id="salesPreviewCollection" aria-label="Derma-Maze preview collection">
        ${previews.map((src, index) => `<button class="sales-preview-thumb${index === 0 ? ' is-active' : ''}" type="button" data-preview-index="${index}"><img src="${src}" alt="" loading="lazy"/></button>`).join('')}
      </div>
      <p class="sales-preview-hint" id="salesPreviewHint"></p>
    `;

    const scene = art.querySelector('#salesBookScene');
    const book = art.querySelector('#salesBook');
    const cover = art.querySelector('#salesBookCover');
    const page = art.querySelector('#salesBookPage');
    const label = art.querySelector('#salesBookPageLabel');
    const status = art.querySelector('#salesBookStatus');
    const watermark = art.querySelector('#salesBookWatermark');
    const hint = art.querySelector('#salesPreviewHint');
    const previous = art.querySelector('#salesBookPrev');
    const next = art.querySelector('#salesBookNext');
    const thumbs = [...art.querySelectorAll('.sales-preview-thumb')];
    let index = 0;
    let opened = false;
    let autoPlayed = false;

    const localize = () => {
      const copy = text[currentLang()];
      status.textContent = copy.status;
      hint.innerHTML = copy.hint;
      cover.setAttribute('aria-label', copy.cover);
      previous.setAttribute('aria-label', copy.previous);
      next.setAttribute('aria-label', copy.next);
      watermark.textContent = copy.watermark;
      thumbs.forEach((thumb, i) => thumb.setAttribute('aria-label', `${copy.thumb} ${i + 1}: ${copy.labels[i]}`));
      label.textContent = copy.labels[index];
    };

    const setOpen = value => {
      opened = Boolean(value);
      book.classList.toggle('is-open', opened);
      cover.setAttribute('aria-expanded', String(opened));
    };

    const select = (nextIndex, { open = true } = {}) => {
      const normalized = (nextIndex + previews.length) % previews.length;
      if (normalized !== index) {
        book.classList.add('is-changing');
        window.setTimeout(() => {
          index = normalized;
          page.src = previews[index];
          thumbs.forEach((thumb, i) => thumb.classList.toggle('is-active', i === index));
          localize();
          window.setTimeout(() => book.classList.remove('is-changing'), 70);
        }, reduceMotion ? 0 : 180);
      }
      if (open) setOpen(true);
    };

    cover.addEventListener('click', () => setOpen(!opened));
    previous.addEventListener('click', () => select(index - 1));
    next.addEventListener('click', () => select(index + 1));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => select(i)));

    if (finePointer && !reduceMotion) {
      scene.addEventListener('pointermove', event => {
        const rect = scene.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 5.5;
        const y = ((event.clientY - rect.top) / rect.height - .5) * -4;
        book.style.setProperty('--tilt-x', `${x.toFixed(2)}deg`);
        book.style.setProperty('--tilt-y', `${y.toFixed(2)}deg`);
      });
      scene.addEventListener('pointerleave', () => {
        book.style.setProperty('--tilt-x', '0deg');
        book.style.setProperty('--tilt-y', '0deg');
      });
    }

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const autoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || autoPlayed) return;
          autoPlayed = true;
          window.setTimeout(() => select(1), 620);
          autoObserver.disconnect();
        });
      }, { threshold: .48 });
      autoObserver.observe(art);
    }

    const languageObserver = new MutationObserver(localize);
    languageObserver.observe(root, { attributes: true, attributeFilter: ['lang', 'dir'] });
    localize();
  }

  function init() {
    buildSalesBook();
    motionSetup();
    setupParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
