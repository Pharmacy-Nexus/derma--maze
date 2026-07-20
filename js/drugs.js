(() => {
  'use strict';

  const drugs = Array.isArray(window.DERMA_MAZE_DRUGS) ? window.DERMA_MAZE_DRUGS : [];
  const FAVORITES_KEY = 'dermaMazeDrugFavorites';

  const ui = {
    ar: {
      'hero.kicker':'DERMA-MAZE SMART DRUG INDEX',
      'hero.title':'الشكل العلمي أولًا.<br><strong>والسوق المصري منفصل.</strong>',
      'hero.text':'فهرس ذكي يوضح الأشكال الدوائية المرتبطة بالاستخدام الجلدي علميًا، حتى لو لم تكن متاحة حاليًا في مصر. حالة التوفر المحلي تظهر بشكل مستقل لكل شكل، من غير جرعات أو بروتوكولات أو شرح علاجي من الكتاب.',
      'hero.searchCta':'ابدأ البحث','hero.policyCta':'افهم طريقة عرض البيانات','hero.statDrugs':'دواء مفهرس','hero.statCategories':'تصنيفات','hero.statLang':'بحث ثنائي اللغة','hero.float1':'الأشكال العلمية عالميًا','hero.float2':'توافر مصر لكل شكل',
      'explorer.title':'اعرف الدواء.<br>واعرف الشكل المقصود.','explorer.text':'ابحث بالاسم أو الاسم البديل، ثم صفِّ النتائج حسب الفئة أو الفصل أو طريق الاستخدام الجلدي. التوفر في مصر لا يغيّر الشكل العلمي المسجل للدواء.',
      'search.label':'ابحث عن دواء','search.results':'نتيجة','search.reset':'إعادة ضبط',
      'filters.open':'فتح الفلاتر','filters.saved':'المحفوظة','filters.title':'تصفية النتائج','filters.category':'الفئة','filters.chapter':'الفصل','filters.route':'طريق الاستخدام الجلدي','filters.savedOnly':'عرض المحفوظة فقط',
      'results.label':'SMART DRUG DIRECTORY','results.showing':'عرض','results.entries':'اسمًا','results.sort':'الترتيب','sort.az':'A → Z','sort.za':'Z → A','sort.featured':'المميز أولًا',
      'empty.title':'مفيش نتيجة مطابقة','empty.text':'جرّب كتابة جزء من الاسم أو الاسم البديل، أو إزالة أحد الفلاتر.','empty.reset':'عرض كل الأدوية',
      'truth.title':'شكل علمي ≠ منتج متوفر في مصر','truth.text':'وجود شكل دوائي ضمن الاستخدامات الجلدية لا يعني أنه متاح محليًا. لذلك يعرض الفهرس الشكل العلمي أولًا، ثم يضع حالة السوق المصري بجواره بشكل مستقل ومؤرَّخ عند التحقق.',
      'truth.global':'الشكل الجلدي العلمي','truth.globalText':'يظهر حتى لو لم يوجد له منتج مصري حاليًا.','truth.egypt':'التوفر في مصر','truth.egyptText':'حالة منفصلة لكل شكل، ولا تُفترض من الشكل العلمي.',
      'policy.title':'الصفحة فهرس ذكي.<br>وليست مرجعًا علاجيًا.','policy.text':'كل بطاقة تساعد القارئ في التعرف على الدواء، أشكاله الجلدية، حالة التوفر المحلية، ومكانه داخل Derma-Maze، من غير نشر المحتوى العلمي الأساسي للكتاب.',
      'policy.showsLabel':'تظهر الصفحة','policy.showsTitle':'بيانات تعريف وفهرسة','policy.show1':'الاسم العلمي والأسماء البديلة','policy.show2':'الفئة والتصنيف الفرعي','policy.show3':'الأشكال المرتبطة بالاستخدام الجلدي','policy.show4':'حالة كل شكل في مصر ومكانه بالكتاب',
      'policy.hidesLabel':'لا تظهر الصفحة','policy.hidesTitle':'المحتوى العلاجي الأساسي','policy.hide1':'الجرعات ومدد العلاج','policy.hide2':'الاختيار الأول والبدائل','policy.hide3':'التشخيص والخوارزميات','policy.hide4':'التحذيرات والجداول والـClinical Pearls',
      'policy.bookTitle':'السياق الكامل داخل الكتاب','policy.bookText':'الفهرس يحدد الاسم والشكل والمكان فقط. تفسير الاختيار العلاجي والمقارنات يظل داخل الفصل الكامل.','policy.bookCta':'اعرف تفاصيل الكتاب',
      'cta.title':'وصلت للاسم والشكل؟<br>ارجع للسياق داخل الكتاب.','cta.text':'الموقع ينظم الوصول للمعلومة، لكن قرار العلاج والجرعات والمقارنات يظل جزءًا من تجربة Derma-Maze الكاملة.','cta.order':'اطلب الكتاب','cta.chapters':'استكشف الفصول',
      all:'الكل', locate:'عرض البطاقة', saved:'محفوظ', save:'حفظ', chapterLabel:'موجود في', routeLabel:'طريق الاستخدام', classLabel:'الفئة', subclassLabel:'التصنيف الفرعي', formsLabel:'الأشكال الجلدية', aliasesLabel:'أسماء بديلة', egyptLabel:'التوفر في مصر', sectionLabel:'القسم', pageLabel:'الصفحة', brandsLabel:'براندات مصرية موثقة', verificationLabel:'آخر تحقق', indexOnly:'الأشكال المعروضة مرتبطة بالاستخدام الجلدي علميًا، سواء كانت متوفرة في مصر أم لا. حالة مصر منفصلة لكل شكل.', bookNote:'الجرعات والاختيار العلاجي والتفاصيل العلمية الكاملة موجودة داخل الفصل المطبوع.', bookCta:'تفاصيل الكتاب', openChapter:'افتح صفحة الفصل', close:'إغلاق', removeFilter:'إزالة الفلتر',
      statusAvailable:'متوفر ومتحقق منه', statusPartial:'متوفر جزئيًا', statusNotVerified:'لا يوجد منتج مصري متحقق منه حاليًا', statusPending:'في انتظار مراجعة السوق', statusUnknown:'غير محدد', brandsNone:'لم تُضف براندات موثقة بعد', pagePending:'يُحدد بعد مراجعة النسخة النهائية', draftBadge:'مسودة بيانات', scientificForm:'الشكل العلمي', marketStatus:'حالة مصر'
    },
    en: {
      'hero.kicker':'DERMA-MAZE SMART DRUG INDEX',
      'hero.title':'Scientific form first.<br><strong>Egyptian market separate.</strong>',
      'hero.text':'A smart index of dermatology-related dosage forms, even when a form is not currently marketed in Egypt. Local availability is tracked separately for every form—without doses, protocols, or therapeutic explanations from the book.',
      'hero.searchCta':'Start searching','hero.policyCta':'How the data works','hero.statDrugs':'indexed drugs','hero.statCategories':'categories','hero.statLang':'bilingual search','hero.float1':'scientific forms worldwide','hero.float2':'Egypt status per form',
      'explorer.title':'Know the drug.<br>Know the exact form.','explorer.text':'Search by drug name or alias, then narrow results by category, chapter, or dermatology route. Egyptian availability never replaces the scientifically relevant form.',
      'search.label':'Search for a drug','search.results':'results','search.reset':'Reset',
      'filters.open':'Open filters','filters.saved':'Saved','filters.title':'Filter results','filters.category':'Category','filters.chapter':'Chapter','filters.route':'Dermatology route','filters.savedOnly':'Show saved only',
      'results.label':'SMART DRUG DIRECTORY','results.showing':'Showing','results.entries':'entries','results.sort':'Sort','sort.az':'A → Z','sort.za':'Z → A','sort.featured':'Featured first',
      'empty.title':'No matching result','empty.text':'Try part of the drug name or alias, or remove one of the filters.','empty.reset':'Show all drugs',
      'truth.title':'Scientific form ≠ Egyptian product availability','truth.text':'A dermatology dosage form can be scientifically relevant without being locally marketed. The index therefore lists the scientific form first and tracks Egyptian availability separately, with a verification date when available.',
      'truth.global':'Scientific dermatology form','truth.globalText':'Shown even when no current Egyptian product exists.','truth.egypt':'Availability in Egypt','truth.egyptText':'A separate status for every form; never inferred from the scientific form.',
      'policy.title':'A smart index.<br>Not a treatment reference.','policy.text':'Every card helps readers identify the drug, its dermatology forms, local availability, and location in Derma-Maze without publishing the book’s core scientific content.',
      'policy.showsLabel':'This page shows','policy.showsTitle':'Identification and index metadata','policy.show1':'Generic name and searchable aliases','policy.show2':'Class and subclass','policy.show3':'Dermatology-related dosage forms','policy.show4':'Egypt status per form and book location',
      'policy.hidesLabel':'This page does not show','policy.hidesTitle':'Core therapeutic content','policy.hide1':'Doses and treatment duration','policy.hide2':'First-line choices and alternatives','policy.hide3':'Diagnosis and algorithms','policy.hide4':'Warnings, tables, and clinical pearls',
      'policy.bookTitle':'Full context stays in the book','policy.bookText':'The index identifies the name, form, and location only. Treatment reasoning and comparisons remain inside the complete chapter.','policy.bookCta':'View book details',
      'cta.title':'Found the name and form?<br>Return to the book for context.','cta.text':'The website organizes access, while treatment decisions, dosing, and comparisons remain part of the complete Derma-Maze experience.','cta.order':'Order the book','cta.chapters':'Explore chapters',
      all:'All', locate:'Open card', saved:'Saved', save:'Save', chapterLabel:'Found in', routeLabel:'Route', classLabel:'Class', subclassLabel:'Subclass', formsLabel:'Dermatology forms', aliasesLabel:'Aliases', egyptLabel:'Availability in Egypt', sectionLabel:'Section', pageLabel:'Page', brandsLabel:'Verified Egyptian brands', verificationLabel:'Last verified', indexOnly:'Displayed forms are scientifically related to dermatology whether or not they are marketed in Egypt. Egyptian status is tracked separately for every form.', bookNote:'Dosing, treatment selection, and full scientific details remain inside the printed chapter.', bookCta:'Book details', openChapter:'Open chapter page', close:'Close', removeFilter:'Remove filter',
      statusAvailable:'Verified available', statusPartial:'Partially available', statusNotVerified:'No currently verified Egyptian product', statusPending:'Market review pending', statusUnknown:'Not specified', brandsNone:'No verified local brands added yet', pagePending:'Pending final-edition review', draftBadge:'Draft data', scientificForm:'Scientific form', marketStatus:'Egypt status'
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
    injectable: { ar:'حقن', en:'Injectable', icon:'◇' },
    intralesional: { ar:'داخل الآفة', en:'Intralesional', icon:'◎' }
  };

  const statusMeta = {
    available: { key:'statusAvailable', className:'available', icon:'✓' },
    partial: { key:'statusPartial', className:'partial', icon:'◐' },
    not_verified: { key:'statusNotVerified', className:'not-verified', icon:'—' },
    pending: { key:'statusPending', className:'pending', icon:'⌛' },
    unknown: { key:'statusUnknown', className:'unknown', icon:'?' }
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
    } catch (_) { return []; }
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...state.favorites]));
  }

  function t(key) { return ui[lang][key] ?? key; }
  function label(map, key) { return map[key]?.[lang] ?? key; }
  function localText(value, fallback = '—') { return value?.[lang] || value?.en || value?.ar || fallback; }
  function formsOf(drug) { return Array.isArray(drug.dermatologyForms) ? drug.dermatologyForms : []; }
  function routesOf(drug) { return [...new Set(formsOf(drug).map(item => item.route).filter(Boolean))]; }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function categoryCount(key) { return key === 'all' ? drugs.length : drugs.filter(d => d.category === key).length; }
  function chapterCount(key) { return key === 'all' ? drugs.length : drugs.filter(d => d.book?.chapter === key).length; }
  function routeCount(key) { return key === 'all' ? drugs.length : drugs.filter(d => routesOf(d).includes(key)).length; }

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
      state.category = button.dataset.category; state.letter = 'all'; renderAll();
    }));
  }

  function renderChapterFilters() {
    el.chapterFilters.innerHTML = Object.entries(chapters).map(([key, item]) => `
      <button class="filter-option ${state.chapter === key ? 'active' : ''}" type="button" data-chapter="${key}">
        <i style="background:${item.accent}">${item.number}</i><b>${item[lang]}</b><small>${chapterCount(key)}</small>
      </button>`).join('');
    el.chapterFilters.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => {
      state.chapter = button.dataset.chapter; state.letter = 'all'; renderAll();
    }));
  }

  function renderRouteFilters() {
    el.routeFilters.innerHTML = Object.entries(routes).map(([key, item]) => `
      <button class="route-filter ${state.route === key ? 'active' : ''}" type="button" data-route="${key}">
        <span>${item.icon}</span><b>${item[lang]}</b><small>${routeCount(key)}</small>
      </button>`).join('');
    el.routeFilters.querySelectorAll('[data-route]').forEach(button => button.addEventListener('click', () => {
      state.route = button.dataset.route; state.letter = 'all'; renderAll();
    }));
  }

  function availableLetters() { return new Set(drugs.map(drug => drug.name.charAt(0).toUpperCase())); }

  function renderAlphabet() {
    const available = availableLetters();
    const letters = ['all', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    el.alphabet.innerHTML = letters.map(letter => {
      const disabled = letter !== 'all' && !available.has(letter);
      return `<button type="button" class="alphabet-letter ${state.letter === letter ? 'active' : ''} ${disabled ? 'disabled' : ''}" data-letter="${letter}" ${disabled ? 'disabled' : ''}>${letter === 'all' ? '•' : letter}</button>`;
    }).join('');
    el.alphabet.querySelectorAll('[data-letter]').forEach(button => button.addEventListener('click', () => {
      state.letter = button.dataset.letter; renderAll();
    }));
  }

  function getFilteredDrugs() {
    const q = normalize(state.query);
    const filtered = drugs.filter(drug => {
      const searchable = normalize([
        drug.name,
        ...(drug.aliases || []),
        localText(drug.class),
        localText(drug.subclass),
        label(categories, drug.category),
        ...formsOf(drug).flatMap(form => [localText(form.form), label(routes, form.route)]),
        label(chapters, drug.book?.chapter)
      ].join(' '));
      if (q && !searchable.includes(q)) return false;
      if (state.category !== 'all' && drug.category !== state.category) return false;
      if (state.chapter !== 'all' && drug.book?.chapter !== state.chapter) return false;
      if (state.route !== 'all' && !routesOf(drug).includes(state.route)) return false;
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

  function overallEgyptStatus(drug) {
    const statuses = formsOf(drug).map(form => form.egyptStatus || 'unknown');
    if (!statuses.length) return 'unknown';
    if (statuses.every(status => status === 'pending')) return 'pending';
    if (statuses.every(status => status === 'available')) return 'available';
    if (statuses.every(status => status === 'not_verified')) return 'not_verified';
    if (statuses.some(status => status === 'available')) return 'partial';
    if (statuses.some(status => status === 'pending')) return 'pending';
    return 'unknown';
  }

  function statusBadge(status, compact = false) {
    const meta = statusMeta[status] || statusMeta.unknown;
    return `<span class="egypt-status ${meta.className} ${compact ? 'compact' : ''}"><i>${meta.icon}</i><b>${t(meta.key)}</b></span>`;
  }

  function formBadges(drug) {
    return formsOf(drug).map(form => `
      <span class="drug-form-badge">
        <i>${routes[form.route]?.icon || '•'}</i>
        <span><small>${label(routes, form.route)}</small><b>${localText(form.form)}</b></span>
      </span>`).join('');
  }

  function primaryChapter(drug) { return chapters[drug.book?.chapter] || chapters.all; }

  function cardTemplate(drug, index) {
    const category = categories[drug.category] || categories.all;
    const chapter = primaryChapter(drug);
    const isSaved = state.favorites.has(drug.id);
    const status = overallEgyptStatus(drug);
    return `
      <article class="drug-card" style="--card-accent:${category.accent}" data-letter="${drug.name.charAt(0)}">
        <div class="drug-card-top">
          <span class="drug-card-code"><i></i>${String(index + 1).padStart(2, '0')} · ${category.en.toUpperCase()}</span>
          <button class="drug-save ${isSaved ? 'saved' : ''}" type="button" data-save-drug="${drug.id}" aria-label="${isSaved ? t('saved') : t('save')}" title="${isSaved ? t('saved') : t('save')}">${isSaved ? '♥' : '♡'}</button>
        </div>
        <div class="drug-card-title-row">
          <div><h3>${drug.name}</h3><p class="drug-card-class">${localText(drug.class)} · ${localText(drug.subclass)}</p></div>
          ${drug.recordStatus === 'draft' ? `<span class="draft-badge">${t('draftBadge')}</span>` : ''}
        </div>
        <div class="drug-card-section-label"><span>${t('formsLabel')}</span><i></i></div>
        <div class="drug-form-row">${formBadges(drug)}</div>
        <div class="drug-market-row"><small>${t('egyptLabel')}</small>${statusBadge(status, true)}</div>
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
    saveFavorites(); renderAll();
  }

  function resetFilters() {
    Object.assign(state, { query:'', category:'all', chapter:'all', route:'all', letter:'all', sort:'az', favoritesOnly:false });
    el.search.value = ''; el.sort.value = 'az'; renderAll();
  }

  function formatVerificationDate(value) {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { year:'numeric', month:'short', day:'numeric' }).format(date);
  }

  function formsTable(drug) {
    return formsOf(drug).map(form => {
      const brands = Array.isArray(form.brands) ? form.brands : [];
      return `
        <div class="dialog-form-row">
          <div class="dialog-form-name"><span>${routes[form.route]?.icon || '•'}</span><div><small>${label(routes, form.route)}</small><b>${localText(form.form)}</b></div></div>
          <div class="dialog-form-market">${statusBadge(form.egyptStatus || 'unknown')}<small>${brands.length ? brands.join(' · ') : t('brandsNone')}</small></div>
        </div>`;
    }).join('');
  }

  function openDrugDialog(id) {
    const drug = drugs.find(item => item.id === id);
    if (!drug) return;
    const category = categories[drug.category] || categories.all;
    const chapter = primaryChapter(drug);
    const aliases = (drug.aliases || []).length ? drug.aliases.join(' · ') : '—';
    const section = localText(drug.book?.section, t('pagePending'));
    const page = drug.book?.page || t('pagePending');
    const verifiedAt = formsOf(drug).map(form => form.verifiedAt).filter(Boolean).sort().at(-1);

    el.dialogContent.innerHTML = `
      <div class="dialog-head" style="--dialog-accent:${category.accent}" data-letter="${drug.name.charAt(0)}">
        <small>DERMA-MAZE · SMART INDEX ENTRY</small>
        <h2>${drug.name}</h2>
        <p>${localText(drug.class)} · ${localText(drug.subclass)}</p>
        ${drug.recordStatus === 'draft' ? `<span class="dialog-draft">${t('draftBadge')}</span>` : ''}
      </div>
      <div class="dialog-body">
        <div class="dialog-index-note"><span>i</span><p>${t('indexOnly')}</p></div>
        <div class="dialog-meta-grid three">
          <div class="dialog-meta-card"><small>${t('classLabel')}</small><b>${localText(drug.class)}</b></div>
          <div class="dialog-meta-card"><small>${t('subclassLabel')}</small><b>${localText(drug.subclass)}</b></div>
          <div class="dialog-meta-card"><small>${t('aliasesLabel')}</small><b>${aliases}</b></div>
        </div>

        <section class="dialog-forms-section">
          <div class="dialog-section-title"><div><small>FORM × MARKET</small><h3>${t('formsLabel')}</h3></div><span>${formsOf(drug).length}</span></div>
          <div class="dialog-form-head"><b>${t('scientificForm')}</b><b>${t('marketStatus')}</b></div>
          <div class="dialog-form-list">${formsTable(drug)}</div>
          <div class="dialog-verification"><span>${t('verificationLabel')}</span><b>${formatVerificationDate(verifiedAt)}</b></div>
        </section>

        <div class="dialog-book-location">
          <div class="dialog-chapter">
            <div><small>${t('chapterLabel').toUpperCase()}</small><b>${chapter.number} · ${chapter[lang]}</b></div>
            <a href="${chapter.href}" aria-label="${t('openChapter')}" title="${t('openChapter')}">↗</a>
          </div>
          <div class="dialog-location-grid">
            <div><small>${t('sectionLabel')}</small><b>${section}</b></div>
            <div><small>${t('pageLabel')}</small><b>${page}</b></div>
          </div>
        </div>

        <div class="dialog-book-cta"><p>${t('bookNote')}</p><a href="index.html#buy">${t('bookCta')} ↗</a></div>
      </div>`;
    if (typeof el.dialog.showModal === 'function') el.dialog.showModal();
  }

  function closeFilters() {
    el.filters.classList.remove('open'); el.filterBackdrop.classList.remove('open'); document.body.style.overflow = '';
  }
  function openFilters() {
    el.filters.classList.add('open'); el.filterBackdrop.classList.add('open'); document.body.style.overflow = 'hidden';
  }

  function renderCounts(filtered) {
    el.heroDrugCount.textContent = String(drugs.length).padStart(2, '0');
    el.heroCategoryCount.textContent = String(Object.keys(categories).length - 1).padStart(2, '0');
    el.resultCount.textContent = filtered.length; el.visibleCount.textContent = filtered.length; el.favoriteCount.textContent = state.favorites.size;
    el.activeCategoryCount.textContent = state.category === 'all' ? 'ALL' : '01';
    el.activeChapterCount.textContent = state.chapter === 'all' ? 'ALL' : '01';
    el.activeRouteCount.textContent = state.route === 'all' ? 'ALL' : '01';
    el.clear.classList.toggle('visible', Boolean(state.query));
    el.savedButton.classList.toggle('active', state.favoritesOnly); el.savedMobile.classList.toggle('active', state.favoritesOnly);
  }

  function renderAll() {
    if (!el.grid) return;
    renderCategoryFilters(); renderChapterFilters(); renderRouteFilters(); renderAlphabet();
    const filtered = getFilteredDrugs();
    renderCards(filtered); renderActiveFilters(); renderCounts(filtered);
  }

  function cacheElements() {
    ['drugSearch','clearDrugSearch','resetDrugFilters','emptyReset','categoryFilters','chapterFilters','routeFilters','alphabetBar','drugGrid','drugEmpty','activeFilterRow','resultCount','visibleCount','heroDrugCount','heroCategoryCount','favoriteCount','activeCategoryCount','activeChapterCount','activeRouteCount','drugSort','showFavorites','showFavoritesMobile','drugFilters','openDrugFilters','closeDrugFilters','drugFilterBackdrop','drugDialog','drugDialogContent','closeDrugDialog'].forEach(id => {
      const key = ({
        drugSearch:'search', clearDrugSearch:'clear', resetDrugFilters:'reset', emptyReset:'emptyReset', categoryFilters:'categoryFilters', chapterFilters:'chapterFilters', routeFilters:'routeFilters', alphabetBar:'alphabet', drugGrid:'grid', drugEmpty:'empty', activeFilterRow:'activeFilters', resultCount:'resultCount', visibleCount:'visibleCount', heroDrugCount:'heroDrugCount', heroCategoryCount:'heroCategoryCount', favoriteCount:'favoriteCount', activeCategoryCount:'activeCategoryCount', activeChapterCount:'activeChapterCount', activeRouteCount:'activeRouteCount', drugSort:'sort', showFavorites:'savedButton', showFavoritesMobile:'savedMobile', drugFilters:'filters', openDrugFilters:'openFilters', closeDrugFilters:'closeFilters', drugFilterBackdrop:'filterBackdrop', drugDialog:'dialog', drugDialogContent:'dialogContent', closeDrugDialog:'closeDialog'
      })[id];
      el[key] = document.getElementById(id);
    });
  }

  function bindEvents() {
    let searchTimer;
    el.search.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.query = el.search.value.trim(); state.letter = 'all'; renderAll(); }, 90);
    });
    el.clear.addEventListener('click', () => { state.query = ''; el.search.value = ''; el.search.focus(); renderAll(); });
    el.reset.addEventListener('click', resetFilters); el.emptyReset.addEventListener('click', resetFilters);
    el.sort.addEventListener('change', () => { state.sort = el.sort.value; renderAll(); });
    const toggleSaved = () => { state.favoritesOnly = !state.favoritesOnly; renderAll(); };
    el.savedButton.addEventListener('click', toggleSaved); el.savedMobile.addEventListener('click', toggleSaved);
    el.openFilters.addEventListener('click', openFilters); el.closeFilters.addEventListener('click', closeFilters); el.filterBackdrop.addEventListener('click', closeFilters);
    el.closeDialog.addEventListener('click', () => el.dialog.close());
    el.dialog.addEventListener('click', event => { if (event.target === el.dialog) el.dialog.close(); });
    document.addEventListener('keydown', event => {
      const tag = document.activeElement?.tagName;
      if (event.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        event.preventDefault(); el.search.focus(); document.getElementById('drug-explorer')?.scrollIntoView({ behavior:'smooth', block:'start' });
      }
      if (event.key === 'Escape') closeFilters();
    });
  }

  document.addEventListener('DOMContentLoaded', () => { cacheElements(); bindEvents(); setStaticLanguage(window.currentDMLang || lang); });
  window.addEventListener('dm-language-change', event => setStaticLanguage(event.detail?.lang || 'ar'));
})();
