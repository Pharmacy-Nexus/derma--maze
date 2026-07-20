(() => {
  'use strict';

  const drugs = Array.isArray(window.DERMA_MAZE_DRUGS) ? window.DERMA_MAZE_DRUGS : [];
  const FAVORITES_KEY = 'dermaMazeDrugFavorites';

  const ui = {
    ar: {
      'hero.kicker':'DERMA-MAZE DRUG INDEX',
      'hero.title':'اكتب اسم الدواء.<br><strong>واعرف مكانه.</strong>',
      'hero.text':'فهرس سريع للأسماء الدوائية المذكورة عبر فصول Derma-Maze. يعرض التصنيف، الشكل العام للاستخدام، والفصل المرتبط فقط—من غير جرعات أو بروتوكولات أو تفاصيل علاجية من الكتاب.',
      'hero.searchCta':'ابدأ البحث','hero.policyCta':'ما الذي تعرضه الصفحة؟','hero.statDrugs':'دواء مفهرس','hero.statCategories':'تصنيفات','hero.statLang':'بحث ثنائي اللغة','hero.float1':'الفصل + الفئة + الشكل','hero.float2':'مكان الدواء، لا محتوى العلاج',
      'explorer.title':'أسرع طريق.<br>للاسم الذي تبحث عنه.','explorer.text':'ابدأ بالاسم، ثم ضيّق النتائج حسب الفئة أو الفصل أو طريقة الاستخدام العامة. أي تفاصيل علمية أو علاجية كاملة تظل داخل الكتاب.',
      'search.label':'ابحث عن دواء','search.results':'نتيجة','search.reset':'إعادة ضبط',
      'filters.open':'فتح الفلاتر','filters.saved':'المحفوظة','filters.title':'تصفية النتائج','filters.category':'الفئة','filters.chapter':'الفصل','filters.route':'طريقة الاستخدام','filters.savedOnly':'عرض المحفوظة فقط',
      'results.label':'DRUG DIRECTORY','results.showing':'عرض','results.entries':'اسمًا','results.sort':'الترتيب','sort.az':'A → Z','sort.za':'Z → A','sort.featured':'المميز أولًا',
      'empty.title':'مفيش نتيجة مطابقة','empty.text':'جرّب كتابة جزء من الاسم أو إزالة أحد الفلاتر.','empty.reset':'عرض كل الأدوية',
      'policy.title':'الصفحة دليل.<br>مش نسخة من الكتاب.','policy.text':'كل بطاقة مصممة لمساعدتك تصل للاسم والفصل بسرعة، من غير نشر معلومات التشخيص أو الجرعات أو اختيار العلاج أو الجداول العلمية المحفوظة داخل Derma-Maze.',
      'policy.showsLabel':'تظهر الصفحة','policy.showsTitle':'بيانات فهرسة خفيفة','policy.show1':'اسم الدواء','policy.show2':'الفئة الدوائية العامة','policy.show3':'الشكل العام للاستخدام','policy.show4':'الفصل الموجود فيه',
      'policy.hidesLabel':'لا تظهر الصفحة','policy.hidesTitle':'المحتوى العلمي الأساسي','policy.hide1':'الجرعات ومدد العلاج','policy.hide2':'الاختيار الأول والبدائل','policy.hide3':'التشخيص والخوارزميات','policy.hide4':'الجداول والـClinical Pearls',
      'policy.bookTitle':'التفاصيل مكانها الكتاب','policy.bookText':'بعد ما تعرف مكان الدواء، ارجع للفصل الكامل داخل الكتاب لفهمه في سياقه الصحيح.','policy.bookCta':'اعرف تفاصيل الكتاب',
      'cta.title':'لقيت الاسم؟<br>كمّل رحلته في الكتاب.','cta.text':'الفهرس يوصلك للمكان، لكن الشرح والمقارنة والسياق العلاجي يفضلوا جزءًا من تجربة Derma-Maze الكاملة.','cta.order':'اطلب الكتاب','cta.chapters':'استكشف الفصول',
      all:'الكل', locate:'اعرف مكانه', saved:'محفوظ', save:'حفظ', chapterLabel:'موجود في', routeLabel:'الشكل العام', classLabel:'الفئة العامة', indexOnly:'هذه البطاقة للتعريف والفهرسة فقط؛ لا تحتوي جرعات أو اختيار علاج أو شرحًا من الكتاب.', bookNote:'التفاصيل العلمية الكاملة موجودة داخل الفصل المطبوع.', bookCta:'تفاصيل الكتاب', openChapter:'افتح صفحة الفصل', close:'إغلاق', removeFilter:'إزالة الفلتر'
    },
    en: {
      'hero.kicker':'DERMA-MAZE DRUG INDEX',
      'hero.title':'Type the drug name.<br><strong>Find its place.</strong>',
      'hero.text':'A fast index of drug names mentioned across Derma-Maze chapters. It shows only the general class, broad route, and related chapter—without doses, protocols, or therapeutic content from the book.',
      'hero.searchCta':'Start searching','hero.policyCta':'What does this page show?','hero.statDrugs':'indexed drugs','hero.statCategories':'categories','hero.statLang':'bilingual search','hero.float1':'chapter + class + route','hero.float2':'drug location, not treatment content',
      'explorer.title':'The fastest path.<br>To the name you need.','explorer.text':'Start with the name, then narrow results by category, chapter, or broad route. Full scientific and therapeutic details remain inside the book.',
      'search.label':'Search for a drug','search.results':'results','search.reset':'Reset',
      'filters.open':'Open filters','filters.saved':'Saved','filters.title':'Filter results','filters.category':'Category','filters.chapter':'Chapter','filters.route':'Route','filters.savedOnly':'Show saved only',
      'results.label':'DRUG DIRECTORY','results.showing':'Showing','results.entries':'entries','results.sort':'Sort','sort.az':'A → Z','sort.za':'Z → A','sort.featured':'Featured first',
      'empty.title':'No matching result','empty.text':'Try part of the name or remove one of the filters.','empty.reset':'Show all drugs',
      'policy.title':'This page is an index.<br>Not a copy of the book.','policy.text':'Every card helps readers reach a drug name and its chapter quickly without publishing diagnosis, dosing, treatment selection, or the scientific tables reserved for Derma-Maze.',
      'policy.showsLabel':'This page shows','policy.showsTitle':'Light index metadata','policy.show1':'Drug name','policy.show2':'General drug class','policy.show3':'Broad route','policy.show4':'Related chapter',
      'policy.hidesLabel':'This page does not show','policy.hidesTitle':'Core scientific content','policy.hide1':'Doses and treatment duration','policy.hide2':'First-line choices and alternatives','policy.hide3':'Diagnosis and algorithms','policy.hide4':'Tables and clinical pearls',
      'policy.bookTitle':'Details stay in the book','policy.bookText':'Once you locate a drug, return to the full chapter in the book to understand it in context.','policy.bookCta':'View book details',
      'cta.title':'Found the name?<br>Continue its journey in the book.','cta.text':'The index gets you to the right place. The explanation, comparison, and therapeutic context remain part of the complete Derma-Maze experience.','cta.order':'Order the book','cta.chapters':'Explore chapters',
      all:'All', locate:'Locate it', saved:'Saved', save:'Save', chapterLabel:'Found in', routeLabel:'Broad route', classLabel:'General class', indexOnly:'This is an index-only card. It does not contain dosing, treatment selection, or book explanations.', bookNote:'The full scientific details remain inside the printed chapter.', bookCta:'Book details', openChapter:'Open chapter page', close:'Close', removeFilter:'Remove filter'
    }
  };

  const categories = {
    all: { ar:'كل الفئات', en:'All categories', accent:'#7b8988' },
    antibacterial: { ar:'مضادات بكتيرية', en:'Antibacterials', accent:'#e9b82f' },
    antifungal: { ar:'مضادات فطريات', en:'Antifungals', accent:'#4eb57f' },
    antiviral: { ar:'مضادات فيروسات', en:'Antivirals', accent:'#b36ba9' },
    antiparasitic: { ar:'مضادات طفيليات', en:'Antiparasitics', accent:'#40b8ca' },
    antimycobacterial: { ar:'مضادات ميكوبكتيريا', en:'Antimycobacterials', accent:'#ef9e52' }
  };

  const chapters = {
    all: { ar:'كل الفصول', en:'All chapters', number:'00', accent:'#7b8988', href:'index.html#chapters' },
    bacterial: { ar:'العدوى البكتيرية', en:'Bacterial Infections', number:'02', accent:'#e9b82f', href:'bacterial.html' },
    fungal: { ar:'العدوى الفطرية', en:'Fungal Infections', number:'03', accent:'#4eb57f', href:'fungal.html' },
    viral: { ar:'الأمراض الفيروسية', en:'Viral Diseases', number:'04', accent:'#b36ba9', href:'viral.html' },
    parasitic: { ar:'الإصابات الطفيلية', en:'Parasitic Infestations', number:'05', accent:'#40b8ca', href:'parasitic.html' },
    mycobacterial: { ar:'أمراض الميكوبكتيريا', en:'Mycobacterial Diseases', number:'06', accent:'#ef9e52', href:'myco.html' }
  };

  const routes = {
    all: { ar:'الكل', en:'All', icon:'✦' },
    oral: { ar:'فموي', en:'Oral', icon:'◉' },
    topical: { ar:'موضعي', en:'Topical', icon:'◌' },
    injectable: { ar:'حقن', en:'Injectable', icon:'◇' }
  };

  const state = {
    query: '', category: 'all', chapter: 'all', route: 'all', letter: 'all', sort: 'az', favoritesOnly: false,
    favorites: new Set(loadFavorites())
  };

  let lang = localStorage.getItem('dermaMazeLang') === 'en' ? 'en' : 'ar';

  const el = {};

  function loadFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (_) {
      return [];
    }
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
  }

  function t(key) {
    return ui[lang][key] ?? key;
  }

  function label(map, key) {
    return map[key]?.[lang] ?? key;
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function categoryCount(key) {
    return key === 'all' ? drugs.length : drugs.filter(d => d.category === key).length;
  }

  function chapterCount(key) {
    return key === 'all' ? drugs.length : drugs.filter(d => d.chapters.includes(key)).length;
  }

  function routeCount(key) {
    return key === 'all' ? drugs.length : drugs.filter(d => d.routes.includes(key)).length;
  }

  function setStaticLanguage(nextLang) {
    lang = nextLang === 'en' ? 'en' : 'ar';
    document.querySelectorAll('[data-drug-i18n]').forEach(node => {
      const value = ui[lang][node.dataset.drugI18n];
      if (value !== undefined) node.textContent = value;
    });
    document.querySelectorAll('[data-drug-i18n-html]').forEach(node => {
      const value = ui[lang][node.dataset.drugI18nHtml];
      if (value !== undefined) node.innerHTML = value;
    });
    if (el.search) el.search.placeholder = el.search.dataset[lang === 'ar' ? 'drugPlaceholderAr' : 'drugPlaceholderEn'];
    renderAll();
  }

  function renderCategoryFilters() {
    el.categoryFilters.innerHTML = Object.entries(categories).map(([key, item]) => `
      <button class="filter-option ${state.category === key ? 'active' : ''}" type="button" data-category="${key}">
        <i style="--dot:${item.accent}"></i><b>${item[lang]}</b><small>${categoryCount(key)}</small>
      </button>`).join('');
    el.categoryFilters.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
      state.category = button.dataset.category;
      state.letter = 'all';
      renderAll();
    }));
  }

  function renderChapterFilters() {
    el.chapterFilters.innerHTML = Object.entries(chapters).map(([key, item]) => `
      <button class="filter-option ${state.chapter === key ? 'active' : ''}" type="button" data-chapter="${key}">
        <i style="background:${item.accent}">${item.number}</i><b>${item[lang]}</b><small>${chapterCount(key)}</small>
      </button>`).join('');
    el.chapterFilters.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => {
      state.chapter = button.dataset.chapter;
      state.letter = 'all';
      renderAll();
    }));
  }

  function renderRouteFilters() {
    el.routeFilters.innerHTML = Object.entries(routes).map(([key, item]) => `
      <button class="route-filter ${state.route === key ? 'active' : ''}" type="button" data-route="${key}">
        <span>${item.icon}</span><b>${item[lang]}</b>
      </button>`).join('');
    el.routeFilters.querySelectorAll('[data-route]').forEach(button => button.addEventListener('click', () => {
      state.route = button.dataset.route;
      state.letter = 'all';
      renderAll();
    }));
  }

  function availableLetters() {
    return new Set(drugs.map(drug => drug.name.charAt(0).toUpperCase()));
  }

  function renderAlphabet() {
    const available = availableLetters();
    const letters = ['all', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    el.alphabet.innerHTML = letters.map(letter => {
      const disabled = letter !== 'all' && !available.has(letter);
      return `<button type="button" class="alphabet-letter ${state.letter === letter ? 'active' : ''} ${disabled ? 'disabled' : ''}" data-letter="${letter}" ${disabled ? 'disabled' : ''}>${letter === 'all' ? '•' : letter}</button>`;
    }).join('');
    el.alphabet.querySelectorAll('[data-letter]').forEach(button => button.addEventListener('click', () => {
      state.letter = button.dataset.letter;
      renderAll();
    }));
  }

  function getFilteredDrugs() {
    const q = normalize(state.query);
    const filtered = drugs.filter(drug => {
      const searchable = normalize([drug.name, drug.class.ar, drug.class.en, label(categories, drug.category), ...drug.routes.map(r => label(routes, r)), ...drug.chapters.map(c => label(chapters, c))].join(' '));
      if (q && !searchable.includes(q)) return false;
      if (state.category !== 'all' && drug.category !== state.category) return false;
      if (state.chapter !== 'all' && !drug.chapters.includes(state.chapter)) return false;
      if (state.route !== 'all' && !drug.routes.includes(state.route)) return false;
      if (state.letter !== 'all' && drug.name.charAt(0).toUpperCase() !== state.letter) return false;
      if (state.favoritesOnly && !state.favorites.has(drug.id)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (state.sort === 'za') return b.name.localeCompare(a.name);
      if (state.sort === 'featured') return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }

  function routeBadges(drug) {
    return drug.routes.map(route => `<span class="drug-route-badge"><i>${routes[route]?.icon || '•'}</i>${label(routes, route)}</span>`).join('');
  }

  function primaryChapter(drug) {
    return chapters[drug.chapters[0]] || chapters.all;
  }

  function cardTemplate(drug, index) {
    const category = categories[drug.category] || categories.all;
    const chapter = primaryChapter(drug);
    const isSaved = state.favorites.has(drug.id);
    return `
      <article class="drug-card" style="--card-accent:${category.accent}" data-letter="${drug.name.charAt(0)}">
        <div class="drug-card-top">
          <span class="drug-card-code"><i></i>${String(index + 1).padStart(2, '0')} · ${category.en.toUpperCase()}</span>
          <button class="drug-save ${isSaved ? 'saved' : ''}" type="button" data-save-drug="${drug.id}" aria-label="${isSaved ? t('saved') : t('save')}" title="${isSaved ? t('saved') : t('save')}">${isSaved ? '♥' : '♡'}</button>
        </div>
        <h3>${drug.name}</h3>
        <p class="drug-card-class">${drug.class[lang]}</p>
        <div class="drug-route-row">${routeBadges(drug)}</div>
        <div class="drug-card-footer">
          <div class="drug-chapter-locator"><small>${t('chapterLabel')}</small><b>${chapter.number} · ${chapter[lang]}</b></div>
          <button class="open-drug" type="button" data-open-drug="${drug.id}" aria-label="${t('locate')}" title="${t('locate')}">↗</button>
        </div>
      </article>`;
  }

  function renderCards(filtered) {
    el.grid.innerHTML = filtered.map(cardTemplate).join('');
    el.empty.hidden = filtered.length > 0;
    el.grid.hidden = filtered.length === 0;

    el.grid.querySelectorAll('[data-save-drug]').forEach(button => button.addEventListener('click', () => toggleFavorite(button.dataset.saveDrug)));
    el.grid.querySelectorAll('[data-open-drug]').forEach(button => button.addEventListener('click', () => openDrugDialog(button.dataset.openDrug)));
  }

  function renderActiveFilters() {
    const chips = [];
    if (state.query) chips.push({ key:'query', label:`“${state.query}”` });
    if (state.category !== 'all') chips.push({ key:'category', label:label(categories, state.category) });
    if (state.chapter !== 'all') chips.push({ key:'chapter', label:label(chapters, state.chapter) });
    if (state.route !== 'all') chips.push({ key:'route', label:label(routes, state.route) });
    if (state.letter !== 'all') chips.push({ key:'letter', label:state.letter });
    if (state.favoritesOnly) chips.push({ key:'favorites', label:t('filters.saved') });
    el.activeFilters.innerHTML = chips.map(chip => `<button class="active-filter-chip" type="button" data-remove-filter="${chip.key}" title="${t('removeFilter')}">${chip.label}<span>×</span></button>`).join('');
    el.activeFilters.querySelectorAll('[data-remove-filter]').forEach(button => button.addEventListener('click', () => removeFilter(button.dataset.removeFilter)));
  }

  function removeFilter(key) {
    if (key === 'query') { state.query = ''; el.search.value = ''; }
    if (key === 'category') state.category = 'all';
    if (key === 'chapter') state.chapter = 'all';
    if (key === 'route') state.route = 'all';
    if (key === 'letter') state.letter = 'all';
    if (key === 'favorites') state.favoritesOnly = false;
    renderAll();
  }

  function toggleFavorite(id) {
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
    saveFavorites();
    renderAll();
  }

  function resetFilters() {
    state.query = '';
    state.category = 'all';
    state.chapter = 'all';
    state.route = 'all';
    state.letter = 'all';
    state.sort = 'az';
    state.favoritesOnly = false;
    el.search.value = '';
    el.sort.value = 'az';
    renderAll();
  }

  function openDrugDialog(id) {
    const drug = drugs.find(item => item.id === id);
    if (!drug) return;
    const category = categories[drug.category] || categories.all;
    const chapter = primaryChapter(drug);
    el.dialogContent.innerHTML = `
      <div class="dialog-head" style="--dialog-accent:${category.accent}" data-letter="${drug.name.charAt(0)}">
        <small>DERMA-MAZE · INDEX ENTRY</small>
        <h2>${drug.name}</h2>
        <p>${drug.class[lang]}</p>
      </div>
      <div class="dialog-body">
        <div class="dialog-index-note"><span>i</span><p>${t('indexOnly')}</p></div>
        <div class="dialog-meta-grid">
          <div class="dialog-meta-card"><small>${t('classLabel')}</small><b>${drug.class[lang]}</b></div>
          <div class="dialog-meta-card"><small>${t('routeLabel')}</small><b>${drug.routes.map(route => label(routes, route)).join(' · ')}</b></div>
        </div>
        <div class="dialog-chapter">
          <div><small>${t('chapterLabel').toUpperCase()}</small><b>${chapter.number} · ${chapter[lang]}</b></div>
          <a href="${chapter.href}" aria-label="${t('openChapter')}" title="${t('openChapter')}">↗</a>
        </div>
        <div class="dialog-book-cta"><p>${t('bookNote')}</p><a href="index.html#buy">${t('bookCta')} ↗</a></div>
      </div>`;
    if (typeof el.dialog.showModal === 'function') el.dialog.showModal();
  }

  function closeFilters() {
    el.filters.classList.remove('open');
    el.filterBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openFilters() {
    el.filters.classList.add('open');
    el.filterBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderCounts(filtered) {
    el.heroDrugCount.textContent = String(drugs.length).padStart(2, '0');
    el.heroCategoryCount.textContent = String(Object.keys(categories).length - 1).padStart(2, '0');
    el.resultCount.textContent = filtered.length;
    el.visibleCount.textContent = filtered.length;
    el.favoriteCount.textContent = state.favorites.size;
    el.activeCategoryCount.textContent = state.category === 'all' ? 'ALL' : '01';
    el.activeChapterCount.textContent = state.chapter === 'all' ? 'ALL' : '01';
    el.activeRouteCount.textContent = state.route === 'all' ? 'ALL' : '01';
    el.clear.classList.toggle('visible', Boolean(state.query));
    el.savedButton.classList.toggle('active', state.favoritesOnly);
    el.savedMobile.classList.toggle('active', state.favoritesOnly);
  }

  function renderAll() {
    if (!el.grid) return;
    renderCategoryFilters();
    renderChapterFilters();
    renderRouteFilters();
    renderAlphabet();
    const filtered = getFilteredDrugs();
    renderCards(filtered);
    renderActiveFilters();
    renderCounts(filtered);
  }

  function cacheElements() {
    el.search = document.getElementById('drugSearch');
    el.clear = document.getElementById('clearDrugSearch');
    el.reset = document.getElementById('resetDrugFilters');
    el.emptyReset = document.getElementById('emptyReset');
    el.categoryFilters = document.getElementById('categoryFilters');
    el.chapterFilters = document.getElementById('chapterFilters');
    el.routeFilters = document.getElementById('routeFilters');
    el.alphabet = document.getElementById('alphabetBar');
    el.grid = document.getElementById('drugGrid');
    el.empty = document.getElementById('drugEmpty');
    el.activeFilters = document.getElementById('activeFilterRow');
    el.resultCount = document.getElementById('resultCount');
    el.visibleCount = document.getElementById('visibleCount');
    el.heroDrugCount = document.getElementById('heroDrugCount');
    el.heroCategoryCount = document.getElementById('heroCategoryCount');
    el.favoriteCount = document.getElementById('favoriteCount');
    el.activeCategoryCount = document.getElementById('activeCategoryCount');
    el.activeChapterCount = document.getElementById('activeChapterCount');
    el.activeRouteCount = document.getElementById('activeRouteCount');
    el.sort = document.getElementById('drugSort');
    el.savedButton = document.getElementById('showFavorites');
    el.savedMobile = document.getElementById('showFavoritesMobile');
    el.filters = document.getElementById('drugFilters');
    el.openFilters = document.getElementById('openDrugFilters');
    el.closeFilters = document.getElementById('closeDrugFilters');
    el.filterBackdrop = document.getElementById('drugFilterBackdrop');
    el.dialog = document.getElementById('drugDialog');
    el.dialogContent = document.getElementById('drugDialogContent');
    el.closeDialog = document.getElementById('closeDrugDialog');
  }

  function bindEvents() {
    let searchTimer;
    el.search.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = el.search.value.trim();
        state.letter = 'all';
        renderAll();
      }, 90);
    });
    el.clear.addEventListener('click', () => {
      state.query = '';
      el.search.value = '';
      el.search.focus();
      renderAll();
    });
    el.reset.addEventListener('click', resetFilters);
    el.emptyReset.addEventListener('click', resetFilters);
    el.sort.addEventListener('change', () => { state.sort = el.sort.value; renderAll(); });
    const toggleSaved = () => { state.favoritesOnly = !state.favoritesOnly; renderAll(); };
    el.savedButton.addEventListener('click', toggleSaved);
    el.savedMobile.addEventListener('click', toggleSaved);
    el.openFilters.addEventListener('click', openFilters);
    el.closeFilters.addEventListener('click', closeFilters);
    el.filterBackdrop.addEventListener('click', closeFilters);
    el.closeDialog.addEventListener('click', () => el.dialog.close());
    el.dialog.addEventListener('click', event => { if (event.target === el.dialog) el.dialog.close(); });
    document.addEventListener('keydown', event => {
      const tag = document.activeElement?.tagName;
      if (event.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        event.preventDefault();
        el.search.focus();
        document.getElementById('drug-explorer')?.scrollIntoView({ behavior:'smooth', block:'start' });
      }
      if (event.key === 'Escape') closeFilters();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    bindEvents();
    setStaticLanguage(window.currentDMLang || lang);
  });

  window.addEventListener('dm-language-change', event => setStaticLanguage(event.detail?.lang || 'ar'));
})();
