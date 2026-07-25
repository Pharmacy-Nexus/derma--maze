(() => {
  'use strict';

  const META_KEY = 'dermaMazeStudyMetaV1';
  const NOTES_KEY = 'dermaMazeNotesV1';
  const TARGET_KEY = 'dermaMazeDailyTargetV1';
  const CONFIG = window.DM_SITE_CONFIG || {};

  const chapters = [
    {slug:'intro', number:'01', titleAr:'مقدمة الأمراض الجلدية', titleEn:'Introduction to Dermatology', page:'intro.html', total:45, storageKey:'dermaMazeIntroProgressV1', questionAnchor:'#question-bank'},
    {slug:'bacterial', number:'02', titleAr:'عدوى الجلد البكتيرية', titleEn:'Bacterial Skin Infections', page:'bacterial.html', total:150, storageKey:'dermaMazeBacterialProgressV1', questionAnchor:'#question-bank'},
    {slug:'fungal', number:'03', titleAr:'العدوى الفطرية', titleEn:'Fungal Infections', page:'fungal.html', total:150, storageKey:'dermaMazeFungalProgressV1', questionAnchor:'#question-bank'},
    {slug:'viral', number:'04', titleAr:'الأمراض الجلدية الفيروسية', titleEn:'Viral Skin Diseases', page:'viral.html', total:150, storageKey:'dermaMazeViralProgressV1', questionAnchor:'#question-bank'},
    {slug:'parasitic', number:'05', titleAr:'الإصابات الطفيلية', titleEn:'Parasitic Infestation', page:'parasitic.html', total:80, storageKey:'dermaMazeParasiticProgressV2', questionAnchor:'#question-bank'},
    {slug:'myco', number:'06', titleAr:'الأمراض الجلدية الميكوبكتيرية', titleEn:'Mycobacterial Skin Diseases', page:'myco.html', total:100, storageKey:'dermaMazeMycoProgressV1', questionAnchor:'#question-bank'}
  ];

  const safeParse = (value, fallback) => {
    try { return JSON.parse(value); } catch (_) { return fallback; }
  };
  const readJSON = (key, fallback) => {
    try { return safeParse(localStorage.getItem(key), fallback); } catch (_) { return fallback; }
  };
  const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
  };
  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const dateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const getLang = () => window.currentDMLang === 'en' ? 'en' : 'ar';
  const titleFor = chapter => getLang() === 'en' ? chapter.titleEn : chapter.titleAr;

  function getChapterBySlug(slug) {
    return chapters.find(chapter => chapter.slug === slug) || null;
  }

  function detectCurrentChapter() {
    const body = document.body;
    if (!body) return null;
    const classMap = [
      ['intro-page','intro'],['bac-page','bacterial'],['fun-page','fungal'],['vir-page','viral'],['par-page','parasitic'],['myco-page','myco']
    ];
    const found = classMap.find(([className]) => body.classList.contains(className));
    if (found) return getChapterBySlug(found[1]);
    const filename = location.pathname.split('/').pop().replace('.html','');
    return getChapterBySlug(filename);
  }

  function readChapterProgress(chapter) {
    const raw = readJSON(chapter.storageKey, {});
    const answers = raw && typeof raw.answers === 'object' && raw.answers ? raw.answers : {};
    const answerValues = Object.values(answers).filter(Boolean);
    const answered = answerValues.length;
    const correct = answerValues.filter(answer => answer.correct === true || answer.selected === answer.correct).length;
    const bookmarks = Array.isArray(raw.bookmarks) ? raw.bookmarks.length : 0;
    const coverage = Math.min(100, Math.round((answered / chapter.total) * 100));
    const score = answered ? Math.round((correct / answered) * 100) : 0;
    return {chapter, answered, correct, bookmarks, coverage, score, answers};
  }

  function getAllStats() {
    const chapterStats = chapters.map(readChapterProgress);
    const total = chapters.reduce((sum, chapter) => sum + chapter.total, 0);
    const answered = chapterStats.reduce((sum, item) => sum + item.answered, 0);
    const correct = chapterStats.reduce((sum, item) => sum + item.correct, 0);
    const bookmarks = chapterStats.reduce((sum, item) => sum + item.bookmarks, 0);
    const coverage = total ? Math.round((answered / total) * 100) : 0;
    const score = answered ? Math.round((correct / answered) * 100) : 0;
    return {chapters:chapterStats, total, answered, correct, bookmarks, coverage, score};
  }

  function getMeta() {
    const meta = readJSON(META_KEY, {});
    return {
      lastVisited: meta.lastVisited || null,
      studyDays: Array.isArray(meta.studyDays) ? meta.studyDays : [],
      visits: Number(meta.visits) || 0
    };
  }

  function saveMeta(meta) {
    writeJSON(META_KEY, meta);
  }

  function recordStudyDay(meta, timestamp = Date.now()) {
    const day = dateKey(new Date(timestamp));
    if (!meta.studyDays.includes(day)) meta.studyDays.push(day);
    meta.studyDays = meta.studyDays.slice(-400);
  }

  function updateVisit(anchor = '') {
    const chapter = detectCurrentChapter();
    if (!chapter) return;
    const meta = getMeta();
    meta.lastVisited = {
      slug: chapter.slug,
      page: chapter.page,
      anchor: anchor || location.hash || chapter.questionAnchor,
      titleAr: chapter.titleAr,
      titleEn: chapter.titleEn,
      timestamp: Date.now()
    };
    meta.visits += 1;
    recordStudyDay(meta);
    saveMeta(meta);
  }

  function initSectionTracking() {
    const chapter = detectCurrentChapter();
    if (!chapter) return;
    updateVisit(location.hash || chapter.questionAnchor);
    const sections = [...document.querySelectorAll('main section[id]')];
    if (!sections.length || !('IntersectionObserver' in window)) return;
    let timer;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      clearTimeout(timer);
      timer = setTimeout(() => updateVisit(`#${visible.target.id}`), 350);
    }, {rootMargin:'-25% 0px -55% 0px', threshold:[0,.15,.35]});
    sections.forEach(section => observer.observe(section));
  }

  function getNotes() {
    const notes = readJSON(NOTES_KEY, []);
    return Array.isArray(notes) ? notes : [];
  }

  function saveNotes(notes) {
    return writeJSON(NOTES_KEY, notes);
  }

  function addNote({chapter, text}) {
    const clean = String(text || '').trim();
    if (!clean) return null;
    const notes = getNotes();
    const note = {id:`note_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, chapter:chapter || 'general', text:clean, createdAt:Date.now(), updatedAt:Date.now()};
    notes.unshift(note);
    saveNotes(notes);
    window.dispatchEvent(new CustomEvent('dm-notes-change'));
    return note;
  }

  function updateNote(id, text) {
    const clean = String(text || '').trim();
    if (!clean) return false;
    const notes = getNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index < 0) return false;
    notes[index] = {...notes[index], text:clean, updatedAt:Date.now()};
    saveNotes(notes);
    window.dispatchEvent(new CustomEvent('dm-notes-change'));
    return true;
  }

  function deleteNote(id) {
    const notes = getNotes();
    const next = notes.filter(note => note.id !== id);
    if (next.length === notes.length) return false;
    saveNotes(next);
    window.dispatchEvent(new CustomEvent('dm-notes-change'));
    return true;
  }

  function getTodayAnswered() {
    const today = dateKey();
    let count = 0;
    chapters.forEach(chapter => {
      const stats = readChapterProgress(chapter);
      Object.values(stats.answers).forEach(answer => {
        if (answer && answer.updatedAt && dateKey(new Date(answer.updatedAt)) === today) count += 1;
      });
    });
    return count;
  }

  function getStreakInfo() {
    const meta = getMeta();
    const days = new Set(meta.studyDays);
    chapters.forEach(chapter => {
      const stats = readChapterProgress(chapter);
      Object.values(stats.answers).forEach(answer => {
        if (answer && answer.updatedAt) days.add(dateKey(new Date(answer.updatedAt)));
      });
    });
    const ordered = [...days].sort();
    let cursor = new Date();
    if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let current = 0;
    while (days.has(dateKey(cursor))) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return {current, activeDays:ordered.length, lastDay:ordered.at(-1) || null};
  }

  function getDailyTarget() {
    const fallback = Number(CONFIG.study?.defaultDailyTarget) || 20;
    try {
      const value = Number(localStorage.getItem(TARGET_KEY));
      return Number.isFinite(value) && value >= 1 && value <= 300 ? value : fallback;
    } catch (_) { return fallback; }
  }

  function setDailyTarget(value) {
    const safe = Math.min(300, Math.max(1, Number(value) || 20));
    try { localStorage.setItem(TARGET_KEY, String(safe)); } catch (_) {}
    return safe;
  }

  function formatDate(timestamp) {
    if (!timestamp) return '—';
    try {
      return new Intl.DateTimeFormat(getLang() === 'en' ? 'en-GB' : 'ar-EG', {dateStyle:'medium', timeStyle:'short'}).format(new Date(timestamp));
    } catch (_) { return new Date(timestamp).toLocaleString(); }
  }

  function getContinueData() {
    const meta = getMeta();
    let last = meta.lastVisited;
    if (!last) {
      const best = getAllStats().chapters.sort((a,b) => b.answered - a.answered)[0];
      const chapter = best?.chapter || chapters[0];
      last = {slug:chapter.slug,page:chapter.page,anchor:chapter.questionAnchor,titleAr:chapter.titleAr,titleEn:chapter.titleEn,timestamp:null};
    }
    const chapter = getChapterBySlug(last.slug) || chapters[0];
    const stats = readChapterProgress(chapter);
    return {chapter, stats, url:`${chapter.page}${last.anchor || chapter.questionAnchor}`, timestamp:last.timestamp};
  }

  function exportData() {
    const payload = {
      schema:'derma-maze-study-backup',
      version:1,
      exportedAt:new Date().toISOString(),
      data:{
        meta:getMeta(),
        notes:getNotes(),
        target:getDailyTarget(),
        chapters:Object.fromEntries(chapters.map(chapter => [chapter.storageKey, readJSON(chapter.storageKey,{})])),
        drugFavorites:readJSON('dermaMazeDrugFavoritesV1', readJSON('dermaMazeDrugFavorites', []))
      }
    };
    return payload;
  }

  function importData(payload) {
    if (!payload || payload.schema !== 'derma-maze-study-backup' || !payload.data) throw new Error('Invalid backup');
    if (payload.data.meta) writeJSON(META_KEY, payload.data.meta);
    if (Array.isArray(payload.data.notes)) saveNotes(payload.data.notes);
    if (payload.data.target) setDailyTarget(payload.data.target);
    if (payload.data.chapters && typeof payload.data.chapters === 'object') {
      chapters.forEach(chapter => {
        const value = payload.data.chapters[chapter.storageKey];
        if (value && typeof value === 'object') writeJSON(chapter.storageKey, value);
      });
    }
    if (Array.isArray(payload.data.drugFavorites)) writeJSON('dermaMazeDrugFavoritesV1', payload.data.drugFavorites);
    window.dispatchEvent(new CustomEvent('dm-study-imported'));
    return true;
  }

  function resetStudyData() {
    const keys = [META_KEY, NOTES_KEY, TARGET_KEY, ...chapters.map(chapter => chapter.storageKey)];
    keys.forEach(key => { try { localStorage.removeItem(key); } catch (_) {} });
    window.dispatchEvent(new CustomEvent('dm-study-reset'));
  }

  function chapterLabel(slug) {
    if (slug === 'general') return getLang() === 'en' ? 'General' : 'عام';
    const chapter = getChapterBySlug(slug);
    return chapter ? titleFor(chapter) : slug;
  }

  function initNoteDrawer() {
    const chapter = detectCurrentChapter();
    if (!chapter || document.querySelector('.study-note-drawer')) return;
    const lang = getLang();
    const labels = lang === 'en' ? {
      note:'Notes', dashboard:'Dashboard', head:'Chapter notes', placeholder:'Write a short note for this chapter…', save:'Save note', saved:'Saved locally', empty:'No notes for this chapter yet.', delete:'Delete'
    } : {
      note:'ملاحظاتي', dashboard:'لوحة المذاكرة', head:'ملاحظات الفصل', placeholder:'اكتب ملاحظة قصيرة تخص الفصل…', save:'حفظ الملاحظة', saved:'تُحفظ على هذا الجهاز', empty:'لسه مفيش ملاحظات للفصل ده.', delete:'حذف'
    };

    const tools = document.createElement('div');
    tools.className = 'study-floating-tools';
    tools.innerHTML = `
      <button class="study-float-btn" type="button" data-open-notes><i>✎</i><span>${labels.note}</span></button>
      <a class="study-float-btn" href="dashboard.html"><i>◎</i><span>${labels.dashboard}</span></a>`;

    const backdrop = document.createElement('div');
    backdrop.className = 'study-drawer-backdrop';
    const drawer = document.createElement('aside');
    drawer.className = 'study-note-drawer';
    drawer.setAttribute('aria-hidden','true');
    drawer.innerHTML = `
      <div class="study-note-head"><div><small>DERMA-MAZE · ${chapter.number}</small><h2>${labels.head}</h2></div><button class="study-note-close" aria-label="Close" type="button">×</button></div>
      <div class="study-note-compose"><textarea maxlength="2500" placeholder="${labels.placeholder}"></textarea><div class="study-note-actions"><small>${labels.saved}</small><button class="study-note-save" type="button">${labels.save}</button></div></div>
      <div class="study-note-list"></div>`;

    document.body.append(tools, backdrop, drawer);
    const textarea = drawer.querySelector('textarea');
    const list = drawer.querySelector('.study-note-list');
    const open = () => { drawer.classList.add('open'); backdrop.classList.add('open'); drawer.setAttribute('aria-hidden','false'); setTimeout(() => textarea.focus(), 220); };
    const close = () => { drawer.classList.remove('open'); backdrop.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); };
    const render = () => {
      const notes = getNotes().filter(note => note.chapter === chapter.slug);
      list.innerHTML = notes.length ? notes.map(note => `
        <article class="study-note-item" data-note-id="${escapeHTML(note.id)}"><p>${escapeHTML(note.text)}</p><footer><time>${escapeHTML(formatDate(note.updatedAt || note.createdAt))}</time><button type="button" data-delete-note>${labels.delete}</button></footer></article>`).join('') : `<div class="study-note-empty">${labels.empty}</div>`;
    };
    render();
    tools.querySelector('[data-open-notes]').addEventListener('click', open);
    drawer.querySelector('.study-note-close').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    drawer.querySelector('.study-note-save').addEventListener('click', () => {
      if (addNote({chapter:chapter.slug,text:textarea.value})) { textarea.value=''; render(); }
    });
    list.addEventListener('click', event => {
      const button = event.target.closest('[data-delete-note]');
      if (!button) return;
      const card = button.closest('[data-note-id]');
      if (card && deleteNote(card.dataset.noteId)) render();
    });
    window.addEventListener('dm-language-change', () => location.reload(), {once:true});
  }

  function initHomeStudyPreview() {
    const ring = document.getElementById('homeStudyRing');
    if (!ring) return;
    const stats = getAllStats();
    const notes = getNotes();
    const continueData = getContinueData();
    ring.style.setProperty('--progress', stats.coverage);
    const pct = document.getElementById('homeStudyPercent'); if (pct) pct.textContent = `${stats.coverage}%`;
    const title = document.getElementById('homeContinueTitle'); if (title) title.textContent = titleFor(continueData.chapter);
    const detail = document.getElementById('homeContinueDetail'); if (detail) detail.textContent = getLang()==='en' ? `${continueData.stats.answered} of ${continueData.chapter.total} questions answered` : `تمت إجابة ${continueData.stats.answered} من ${continueData.chapter.total} سؤال`;
    const answered = document.getElementById('homeAnswered'); if (answered) answered.textContent = stats.answered;
    const bookmarks = document.getElementById('homeBookmarks'); if (bookmarks) bookmarks.textContent = stats.bookmarks;
    const noteCount = document.getElementById('homeNotes'); if (noteCount) noteCount.textContent = notes.length;
    const link = document.getElementById('homeContinueLink'); if (link) link.href = continueData.url;
  }

  function initOrderConfig() {
    const order = CONFIG.order || {};
    const links = [...document.querySelectorAll('a[href*="wa.me/201000000000"], [data-order-link]')];
    if (!links.length) return;
    if (order.enabled && order.whatsappNumber) {
      links.forEach(link => {
        const message = getLang() === 'en' ? order.messageEn : order.messageAr;
        link.href = `https://wa.me/${String(order.whatsappNumber).replace(/\D/g,'')}?text=${encodeURIComponent(message || '')}`;
        link.classList.remove('order-disabled');
        link.removeAttribute('aria-disabled');
      });
    } else {
      links.forEach(link => {
        link.removeAttribute('href');
        link.classList.add('order-disabled');
        link.setAttribute('aria-disabled','true');
        link.setAttribute('title', getLang()==='en' ? 'Add final order details in site-config.js' : 'أضف بيانات الطلب النهائية في site-config.js');
      });
      document.querySelectorAll('.order-status-note').forEach(note => note.classList.add('visible'));
    }
  }

  window.DMStudy = {
    chapters,
    getChapterBySlug,
    getChapterStats: readChapterProgress,
    getAllStats,
    getMeta,
    getNotes,
    addNote,
    updateNote,
    deleteNote,
    getTodayAnswered,
    getStreakInfo,
    getDailyTarget,
    setDailyTarget,
    getContinueData,
    formatDate,
    chapterLabel,
    exportData,
    importData,
    resetStudyData
  };

  document.addEventListener('DOMContentLoaded', () => {
    initSectionTracking();
    initNoteDrawer();
    initHomeStudyPreview();
    initOrderConfig();
  });
})();
