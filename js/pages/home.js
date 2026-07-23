const chapterData = {
  ar: [
    {n:'01',title:'Introduction to Dermatology',tag:'FOUNDATION',desc:'مدخل منظم للفصل التأسيسي مع تدريب تفاعلي، صور، وحفظ للتقدم.',topics:['Study Mode','Image Review','Saved Progress'],img:'assets/images/chapters/intro/intro-01.webp',accent:'#c7a35a',url:'intro.html',questions:45,cases:10,images:20},
    {n:'02',title:'Bacterial Skin Infections',tag:'BACTERIAL',desc:'صفحة مستقلة للمراجعة التفاعلية، الكيسات، الصور، وأنماط الامتحان.',topics:['Study Mode','Clinical Cases','Exam Mode'],img:'assets/images/chapters/bacterial/bacterial-01.webp',accent:'#c7a35a',url:'bacterial.html',questions:150,cases:45,images:15},
    {n:'03',title:'Fungal Infections',tag:'FUNGAL',desc:'تدريب منظم على موضوعات الفصل مع بحث، فلاتر، ومراجعة ثنائية اللغة.',topics:['Smart Filters','Clinical Cases','Bookmarks'],img:'assets/images/chapters/fungal/fungal-01.webp',accent:'#c7a35a',url:'fungal.html',questions:150,cases:45,images:15},
    {n:'04',title:'Viral Skin Diseases',tag:'VIRAL',desc:'بنك أسئلة مستقل يجمع الأسئلة، الكيسات، والصور في تجربة واحدة.',topics:['Question Bank','Image Review','Saved Progress'],img:'assets/images/chapters/viral/viral-01.webp',accent:'#c7a35a',url:'viral.html',questions:150,cases:45,images:15},
    {n:'05',title:'Parasitic Infestation',tag:'PARASITIC',desc:'مراجعة مركزة للفصل مع أوضاع دراسة وامتحان وحفظ للنتائج.',topics:['Study Mode','Exam Mode','Bookmarks'],img:'assets/images/chapters/parasitic/parasitic-01.webp',accent:'#c7a35a',url:'parasitic.html',questions:80,cases:25,images:10},
    {n:'06',title:'Mycobacterial Skin Diseases',tag:'MYCOBACTERIAL',desc:'صفحة مخصصة للفصل مع أسئلة ثنائية اللغة ومتابعة للتقدم.',topics:['Question Bank','Clinical Cases','Progress'],img:'assets/images/chapters/myco/myco-01.webp',accent:'#c7a35a',url:'myco.html',questions:100,cases:30,images:10}
  ],
  en: [
    {n:'01',title:'Introduction to Dermatology',tag:'FOUNDATION',desc:'A structured foundation chapter with interactive practice, images, and saved progress.',topics:['Study Mode','Image Review','Saved Progress'],img:'assets/images/chapters/intro/intro-01.webp',accent:'#c7a35a',url:'intro.html',questions:45,cases:10,images:20},
    {n:'02',title:'Bacterial Skin Infections',tag:'BACTERIAL',desc:'A dedicated review page with interactive practice, cases, images, and exam modes.',topics:['Study Mode','Clinical Cases','Exam Mode'],img:'assets/images/chapters/bacterial/bacterial-01.webp',accent:'#c7a35a',url:'bacterial.html',questions:150,cases:45,images:15},
    {n:'03',title:'Fungal Infections',tag:'FUNGAL',desc:'Structured chapter practice with search, filters, and bilingual review.',topics:['Smart Filters','Clinical Cases','Bookmarks'],img:'assets/images/chapters/fungal/fungal-01.webp',accent:'#c7a35a',url:'fungal.html',questions:150,cases:45,images:15},
    {n:'04',title:'Viral Skin Diseases',tag:'VIRAL',desc:'An independent question bank combining questions, cases, and images in one experience.',topics:['Question Bank','Image Review','Saved Progress'],img:'assets/images/chapters/viral/viral-01.webp',accent:'#c7a35a',url:'viral.html',questions:150,cases:45,images:15},
    {n:'05',title:'Parasitic Infestation',tag:'PARASITIC',desc:'Focused chapter review with Study Mode, Exam Mode, and saved results.',topics:['Study Mode','Exam Mode','Bookmarks'],img:'assets/images/chapters/parasitic/parasitic-01.webp',accent:'#c7a35a',url:'parasitic.html',questions:80,cases:25,images:10},
    {n:'06',title:'Mycobacterial Skin Diseases',tag:'MYCOBACTERIAL',desc:'A dedicated chapter page with bilingual questions and progress tracking.',topics:['Question Bank','Clinical Cases','Progress'],img:'assets/images/chapters/myco/myco-01.webp',accent:'#c7a35a',url:'myco.html',questions:100,cases:30,images:10}
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
    rail.scrollLeft = 0;
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
