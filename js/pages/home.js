const chapterData = {
  ar: [
    {n:'01',title:'Introduction to Dermatology',tag:'FOUNDATION',desc:'بداية الرحلة: تركيب الجلد، طبقات البشرة، الـdermis، والـprimary والـsecondary lesions.',topics:['Skin structure','Primary lesions','Secondary lesions'],img:'assets/images/chapters/intro/intro-01.webp',accent:'#4aa9d8',url:'intro.html',questions:45,cases:10,images:20},
    {n:'02',title:'Bacterial Skin Infections',tag:'BACTERIAL',desc:'من impetigo السطحي إلى cellulitis والـred flags، مع الكيسات واختيارات العلاج.',topics:['Impetigo','Cellulitis','Folliculitis'],img:'assets/images/chapters/bacterial/bacterial-01.webp',accent:'#f4bd22',url:'bacterial.html',questions:150,cases:45,images:15},
    {n:'03',title:'Fungal Infections',tag:'FUNGAL',desc:'Tinea بأنواعها، candidiasis، pityriasis versicolor، onychomycosis، والعلاج الموضعي والجهازي.',topics:['Tinea pedis','Tinea capitis','Onychomycosis'],img:'assets/images/chapters/fungal/fungal-01.webp',accent:'#6ebd43',url:'fungal.html',questions:150,cases:45,images:15},
    {n:'04',title:'Viral Skin Diseases',tag:'VIRAL',desc:'HSV وVZV وHPV وmolluscum وHFMD والطفوح الفيروسية بمفاتيح تمييز سريرية.',topics:['HSV','Herpes zoster','Viral exanthems'],img:'assets/images/chapters/viral/viral-01.webp',accent:'#b052a0',url:'viral.html',questions:150,cases:45,images:15},
    {n:'05',title:'Parasitic Infestation',tag:'PARASITIC',desc:'Scabies وpediculosis وleishmaniasis وCLM، مع الوقاية والعلاج ومنع إعادة العدوى.',topics:['Scabies','Pediculosis','Leishmaniasis'],img:'assets/images/chapters/parasitic/parasitic-01.webp',accent:'#24a8c7',url:'parasitic.html',questions:80,cases:25,images:10},
    {n:'06',title:'Mycobacterial Skin Diseases',tag:'MYCOBACTERIAL',desc:'Leprosy وcutaneous TB والمناعة الخلوية والتفاعلات والعلاج متعدد الأدوية.',topics:['Leprosy','Leprosy reactions','Cutaneous TB'],img:'assets/images/chapters/myco/myco-01.webp',accent:'#d36a22',url:'myco.html',questions:100,cases:30,images:10}
  ],
  en: [
    {n:'01',title:'Introduction to Dermatology',tag:'FOUNDATION',desc:'The starting point: skin structure, epidermal layers, dermis, and primary and secondary lesions.',topics:['Skin structure','Primary lesions','Secondary lesions'],img:'assets/images/chapters/intro/intro-01.webp',accent:'#4aa9d8',url:'intro.html',questions:45,cases:10,images:20},
    {n:'02',title:'Bacterial Skin Infections',tag:'BACTERIAL',desc:'From superficial impetigo to cellulitis and red flags, with clinical cases and treatment selection.',topics:['Impetigo','Cellulitis','Folliculitis'],img:'assets/images/chapters/bacterial/bacterial-01.webp',accent:'#f4bd22',url:'bacterial.html',questions:150,cases:45,images:15},
    {n:'03',title:'Fungal Infections',tag:'FUNGAL',desc:'Tinea patterns, candidiasis, pityriasis versicolor, onychomycosis, and topical versus systemic therapy.',topics:['Tinea pedis','Tinea capitis','Onychomycosis'],img:'assets/images/chapters/fungal/fungal-01.webp',accent:'#6ebd43',url:'fungal.html',questions:150,cases:45,images:15},
    {n:'04',title:'Viral Skin Diseases',tag:'VIRAL',desc:'HSV, VZV, HPV, molluscum, HFMD, and viral exanthems presented through clinical diagnostic clues.',topics:['HSV','Herpes zoster','Viral exanthems'],img:'assets/images/chapters/viral/viral-01.webp',accent:'#b052a0',url:'viral.html',questions:150,cases:45,images:15},
    {n:'05',title:'Parasitic Infestation',tag:'PARASITIC',desc:'Scabies, pediculosis, leishmaniasis, and CLM with treatment, prevention, and reinfection control.',topics:['Scabies','Pediculosis','Leishmaniasis'],img:'assets/images/chapters/parasitic/parasitic-01.webp',accent:'#24a8c7',url:'parasitic.html',questions:80,cases:25,images:10},
    {n:'06',title:'Mycobacterial Skin Diseases',tag:'MYCOBACTERIAL',desc:'Leprosy, cutaneous TB, cell-mediated immunity, reactions, and multidrug treatment principles.',topics:['Leprosy','Leprosy reactions','Cutaneous TB'],img:'assets/images/chapters/myco/myco-01.webp',accent:'#d36a22',url:'myco.html',questions:100,cases:30,images:10}
  ]
};

let activeChapterIndex = 0;
let railScrollTimer = null;

function renderChapters(lang = window.currentDMLang || 'ar') {
  const rail = document.getElementById('chapterCards');
  if (!rail) return;
  const labels = lang === 'ar'
    ? {questions:'سؤال', cases:'كيس', images:'صورة', cta:'افتح صفحة الفصل'}
    : {questions:'Questions', cases:'Cases', images:'Images', cta:'Open chapter page'};

  rail.innerHTML = chapterData[lang].map((chapter, index) => `
    <article class="chapter-slide ${index % 2 ? 'reverse' : ''} reveal visible" style="--accent:${chapter.accent};--shine-delay:${(index * 0.32).toFixed(2)}s" data-index="${index}">
      <span class="chapter-giant-number" data-number="${chapter.n}" aria-hidden="true">${chapter.n}</span>
      <span class="chapter-number-trace" aria-hidden="true">${chapter.n}</span>
      <div class="chapter-slide-visual">
        <div class="chapter-poster-glow"></div>
        <img src="${chapter.img}" alt="${chapter.title}" loading="lazy">
        <span class="chapter-poster-label">CHAPTER ${chapter.n}</span>
      </div>
      <div class="chapter-slide-copy">
        <div class="chapter-slide-kicker"><i></i><span>${chapter.tag}</span></div>
        <h3>${chapter.title}</h3>
        <p>${chapter.desc}</p>
        <div class="chapter-topic-pills">${chapter.topics.map(topic => `<span>${topic}</span>`).join('')}</div>
        <div class="chapter-stat-line">
          <span><b>${chapter.questions}</b><small>${labels.questions}</small></span>
          <i></i>
          <span><b>${chapter.cases}</b><small>${labels.cases}</small></span>
          <i></i>
          <span><b>${chapter.images}</b><small>${labels.images}</small></span>
        </div>
        <a class="chapter-open-button" href="${chapter.url}"><span>${labels.cta}</span><b>↗</b></a>
      </div>
    </article>
  `).join('');

  activeChapterIndex = 0;
  requestAnimationFrame(() => {
    const first = rail.querySelector('.chapter-slide');
    if (first) first.scrollIntoView({block:'nearest', inline:'center'});
    updateChapterUI(0);
  });
}

function updateChapterUI(index) {
  const total = chapterData[window.currentDMLang || 'ar'].length;
  activeChapterIndex = Math.max(0, Math.min(total - 1, index));
  const counter = document.getElementById('chapterCounter');
  const progress = document.getElementById('chapterProgress');
  if (counter) counter.textContent = `${String(activeChapterIndex + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  if (progress) progress.style.width = `${((activeChapterIndex + 1) / total) * 100}%`;
}

function goToChapter(index) {
  const rail = document.getElementById('chapterCards');
  if (!rail) return;
  const slides = [...rail.querySelectorAll('.chapter-slide')];
  if (!slides.length) return;
  const safeIndex = (index + slides.length) % slides.length;
  slides[safeIndex].scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
  updateChapterUI(safeIndex);
}

function detectActiveChapter() {
  const rail = document.getElementById('chapterCards');
  if (!rail) return;
  const slides = [...rail.querySelectorAll('.chapter-slide')];
  if (!slides.length) return;
  const railRect = rail.getBoundingClientRect();
  const center = railRect.left + railRect.width / 2;
  let closest = 0;
  let distance = Infinity;
  slides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const slideCenter = rect.left + rect.width / 2;
    const currentDistance = Math.abs(center - slideCenter);
    if (currentDistance < distance) {
      distance = currentDistance;
      closest = index;
    }
  });
  updateChapterUI(closest);
}

function initChapterCarousel() {
  const rail = document.getElementById('chapterCards');
  const previous = document.getElementById('chapterPrev');
  const next = document.getElementById('chapterNext');
  if (!rail) return;

  previous?.addEventListener('click', () => goToChapter(activeChapterIndex - 1));
  next?.addEventListener('click', () => goToChapter(activeChapterIndex + 1));

  rail.addEventListener('scroll', () => {
    window.clearTimeout(railScrollTimer);
    railScrollTimer = window.setTimeout(detectActiveChapter, 80);
  }, {passive:true});

  rail.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToChapter(activeChapterIndex + (document.documentElement.dir === 'rtl' ? 1 : -1));
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToChapter(activeChapterIndex + (document.documentElement.dir === 'rtl' ? -1 : 1));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderChapters(window.currentDMLang);
  initChapterCarousel();
});

window.addEventListener('dm-language-change', event => renderChapters(event.detail.lang));
