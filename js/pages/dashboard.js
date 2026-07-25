(() => {
  'use strict';

  const copy = {
    ar: {
      'nav.home':'الرئيسية','nav.chapters':'الفصول','nav.drugs':'دليل الأدوية','nav.dashboard':'لوحة المذاكرة','nav.book':'الكتاب',
      'hero.title':'ذاكر بتركيز.<br><strong>وكمّل من مكانك.</strong>','hero.text':'لوحة واحدة تجمع تقدم الفصول، نتيجة الأسئلة، هدف اليوم، المفضلة، والملاحظات. البيانات محفوظة محليًا على جهازك ولا تحتاج حسابًا.','hero.local':'لا يتم رفع ملاحظاتك أو نتائجك إلى خادم.',
      'overall.coverage':'التقدم الكلي','overall.answered':'تمت إجابتها','overall.score':'نسبة الصحيح','overall.saved':'محفوظ',
      'continue.eyebrow':'CONTINUE STUDYING','continue.cta':'كمّل المذاكرة','continue.all':'كل الفصول',
      'daily.title':'هدف اليوم','daily.text':'الإجابات الجديدة اليوم فقط.','daily.answered':'سؤال اليوم','daily.target':'الهدف','daily.streak':'أيام متتالية','daily.active':'أيام مذاكرة','daily.notes':'ملاحظات',
      'backup.title':'نسخة احتياطية','backup.text':'لأن البيانات محفوظة على المتصفح، صدّر نسخة قبل تغيير الجهاز أو مسح بيانات المتصفح.','backup.export':'تصدير البيانات','backup.import':'استيراد نسخة','backup.reset':'مسح بيانات المذاكرة',
      'chapters.title':'تقدم الفصول','chapters.text':'التقدم = نسبة الأسئلة التي أجبت عنها من بنك الفصل.',
      'notes.title':'ملاحظاتك','notes.text':'اكتب ملاحظاتك أنت؛ الموقع لا ينسخ محتوى الكتاب.','notes.new':'ملاحظة جديدة','notes.chapter':'الفصل','notes.body':'الملاحظة','notes.cancel':'إلغاء','notes.save':'حفظ','notes.all':'كل الفصول','notes.search':'ابحث في الملاحظات…','notes.empty':'لسه مفيش ملاحظات مطابقة.','notes.edit':'تعديل','notes.delete':'حذف','notes.newTitle':'ملاحظة جديدة','notes.editTitle':'تعديل الملاحظة',
      'footer.text':'لوحة متابعة محلية للمذاكرة، وليست حسابًا سحابيًا أو بديلًا عن الكتاب.',
      answered:'مجاب',score:'صحيح',saved:'محفوظ',continue:'كمّل الفصل',remaining:'متبقي',completed:'تم تحقيق الهدف',questions:'سؤال',lastVisit:'آخر زيارة',never:'لم تبدأ بعد',
      exportDone:'تم تنزيل النسخة الاحتياطية.',importDone:'تم استيراد البيانات بنجاح.',importError:'الملف غير صالح أو لا يخص Derma-Maze.',resetConfirm:'هل تريد مسح كل إجابات الفصول والملاحظات وبيانات المتابعة من هذا الجهاز؟',resetDone:'تم مسح بيانات المذاكرة.',noteSaved:'تم حفظ الملاحظة.',noteDeleted:'تم حذف الملاحظة.',deleteConfirm:'حذف الملاحظة؟'
    },
    en: {
      'nav.home':'Home','nav.chapters':'Chapters','nav.drugs':'Drug Index','nav.dashboard':'Study Dashboard','nav.book':'Book',
      'hero.title':'Study with focus.<br><strong>Continue where you stopped.</strong>','hero.text':'One dashboard for chapter progress, question performance, today’s goal, bookmarks, and personal notes. Data stays locally on your device and requires no account.','hero.local':'Your notes and results are not uploaded to a server.',
      'overall.coverage':'Overall progress','overall.answered':'Answered','overall.score':'Correct rate','overall.saved':'Saved',
      'continue.eyebrow':'CONTINUE STUDYING','continue.cta':'Continue studying','continue.all':'All chapters',
      'daily.title':'Today’s goal','daily.text':'Only newly answered questions today.','daily.answered':'questions today','daily.target':'Target','daily.streak':'day streak','daily.active':'study days','daily.notes':'notes',
      'backup.title':'Local backup','backup.text':'Because data is stored in the browser, export a backup before changing devices or clearing browser data.','backup.export':'Export data','backup.import':'Import backup','backup.reset':'Clear study data',
      'chapters.title':'Chapter progress','chapters.text':'Progress is the percentage of the chapter question bank you have answered.',
      'notes.title':'Your notes','notes.text':'Write your own notes; the website does not reproduce the book content.','notes.new':'New note','notes.chapter':'Chapter','notes.body':'Note','notes.cancel':'Cancel','notes.save':'Save','notes.all':'All chapters','notes.search':'Search notes…','notes.empty':'No matching notes yet.','notes.edit':'Edit','notes.delete':'Delete','notes.newTitle':'New note','notes.editTitle':'Edit note',
      'footer.text':'A local study tracker, not a cloud account or a replacement for the book.',
      answered:'Answered',score:'Correct',saved:'Saved',continue:'Continue chapter',remaining:'Remaining',completed:'Goal completed',questions:'questions',lastVisit:'Last visit',never:'Not started yet',
      exportDone:'Backup downloaded.',importDone:'Data imported successfully.',importError:'This file is invalid or is not a Derma-Maze backup.',resetConfirm:'Clear all chapter answers, notes, and study-tracking data from this device?',resetDone:'Study data cleared.',noteSaved:'Note saved.',noteDeleted:'Note deleted.',deleteConfirm:'Delete this note?'
    }
  };

  const $ = id => document.getElementById(id);
  const lang = () => window.currentDMLang === 'en' ? 'en' : 'ar';
  const t = key => copy[lang()][key] ?? key;
  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  let toastTimer;

  function translateStatic() {
    document.querySelectorAll('[data-dash-i18n]').forEach(el => {
      const value = t(el.dataset.dashI18n);
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('[data-dash-i18n-html]').forEach(el => {
      const value = t(el.dataset.dashI18nHtml);
      if (value !== undefined) el.innerHTML = value;
    });
    $('notesSearch').placeholder = t('notes.search');
  }

  function toast(message) {
    const el = $('dashboardToast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function renderOverview() {
    const stats = window.DMStudy.getAllStats();
    $('dashboardRing').style.setProperty('--progress', stats.coverage);
    $('dashboardCoverage').textContent = `${stats.coverage}%`;
    $('dashboardAnswered').textContent = stats.answered;
    $('dashboardScore').textContent = `${stats.score}%`;
    $('dashboardBookmarks').textContent = stats.bookmarks;
  }

  function renderContinue() {
    const data = window.DMStudy.getContinueData();
    const chapterTitle = lang() === 'en' ? data.chapter.titleEn : data.chapter.titleAr;
    $('continueTitle').textContent = chapterTitle;
    $('continueText').textContent = lang() === 'en'
      ? `You answered ${data.stats.answered} of ${data.chapter.total} questions. Your last section is ready.`
      : `أجبت عن ${data.stats.answered} من ${data.chapter.total} سؤال، وآخر قسم فتحته جاهز تكمل منه.`;
    $('continueLink').href = data.url;
    $('continueChapterLabel').textContent = `Chapter ${data.chapter.number}`;
    $('continuePercent').textContent = `${data.stats.coverage}%`;
    $('continueBar').style.width = `${data.stats.coverage}%`;
    $('continueMeta').textContent = lang() === 'en'
      ? `${data.stats.answered} / ${data.chapter.total} questions answered${data.timestamp ? ` · ${t('lastVisit')}: ${window.DMStudy.formatDate(data.timestamp)}` : ''}`
      : `${data.stats.answered} / ${data.chapter.total} سؤال مجاب${data.timestamp ? ` · ${t('lastVisit')}: ${window.DMStudy.formatDate(data.timestamp)}` : ''}`;
  }

  function renderDaily() {
    const today = window.DMStudy.getTodayAnswered();
    const target = window.DMStudy.getDailyTarget();
    const streak = window.DMStudy.getStreakInfo();
    const notes = window.DMStudy.getNotes();
    $('todayAnswered').textContent = today;
    $('dailyTarget').value = target;
    $('dailyBar').style.width = `${Math.min(100, Math.round((today / target) * 100))}%`;
    $('dailyCaption').textContent = `${today} / ${target}`;
    $('dailyRemaining').textContent = today >= target ? t('completed') : `${t('remaining')} ${target - today}`;
    $('currentStreak').textContent = streak.current;
    $('activeDays').textContent = streak.activeDays;
    $('notesCount').textContent = notes.length;
  }

  function renderChapters() {
    const stats = window.DMStudy.getAllStats().chapters;
    $('dashboardChapterGrid').innerHTML = stats.map(item => {
      const chapter = item.chapter;
      const title = lang() === 'en' ? chapter.titleEn : chapter.titleAr;
      return `<article class="dashboard-chapter-card">
        <header><h3>${escapeHTML(title)}</h3><span>${chapter.number}</span></header>
        <div class="chapter-card-track"><i style="width:${item.coverage}%"></i></div>
        <div class="chapter-card-stats"><div><b>${item.answered}</b><span>${t('answered')}</span></div><div><b>${item.score}%</b><span>${t('score')}</span></div><div><b>${item.bookmarks}</b><span>${t('saved')}</span></div></div>
        <a href="${chapter.page}${chapter.questionAnchor}"><span>${t('continue')}</span><b>↗</b></a>
      </article>`;
    }).join('');
  }

  function populateChapterSelects() {
    const options = window.DMStudy.chapters.map(chapter => `<option value="${chapter.slug}">${escapeHTML(lang()==='en' ? chapter.titleEn : chapter.titleAr)}</option>`).join('');
    $('notesChapterFilter').innerHTML = `<option value="all">${t('notes.all')}</option>${options}`;
    $('noteChapter').innerHTML = `<option value="general">${lang()==='en'?'General':'عام'}</option>${options}`;
  }

  function renderNotes() {
    const query = $('notesSearch').value.trim().toLowerCase();
    const chapterFilter = $('notesChapterFilter').value;
    const notes = window.DMStudy.getNotes().filter(note => {
      const chapterMatch = chapterFilter === 'all' || note.chapter === chapterFilter;
      const textMatch = !query || note.text.toLowerCase().includes(query) || window.DMStudy.chapterLabel(note.chapter).toLowerCase().includes(query);
      return chapterMatch && textMatch;
    });
    $('dashboardNotesList').innerHTML = notes.length ? notes.map(note => `<article class="dashboard-note-card" data-note-id="${escapeHTML(note.id)}"><header><span>${escapeHTML(window.DMStudy.chapterLabel(note.chapter))}</span><time>${escapeHTML(window.DMStudy.formatDate(note.updatedAt || note.createdAt))}</time></header><p>${escapeHTML(note.text)}</p><footer><button class="note-edit" type="button" data-edit-note>${t('notes.edit')}</button><button class="note-delete" type="button" data-delete-note>${t('notes.delete')}</button></footer></article>`).join('') : `<div class="dashboard-empty">${t('notes.empty')}</div>`;
    $('notesCount').textContent = window.DMStudy.getNotes().length;
  }

  function openNoteDialog(note = null) {
    $('noteId').value = note?.id || '';
    $('noteChapter').value = note?.chapter || 'general';
    $('noteBody').value = note?.text || '';
    $('noteDialogTitle').textContent = note ? t('notes.editTitle') : t('notes.newTitle');
    $('noteDialog').showModal();
    setTimeout(() => $('noteBody').focus(), 100);
  }

  function bindNotes() {
    $('newNote').addEventListener('click', () => openNoteDialog());
    $('closeNoteDialog').addEventListener('click', () => $('noteDialog').close());
    $('cancelNote').addEventListener('click', () => $('noteDialog').close());
    $('notesSearch').addEventListener('input', renderNotes);
    $('notesChapterFilter').addEventListener('change', renderNotes);
    $('dashboardNotesList').addEventListener('click', event => {
      const card = event.target.closest('[data-note-id]');
      if (!card) return;
      const note = window.DMStudy.getNotes().find(item => item.id === card.dataset.noteId);
      if (!note) return;
      if (event.target.closest('[data-edit-note]')) openNoteDialog(note);
      if (event.target.closest('[data-delete-note]') && confirm(t('deleteConfirm'))) {
        window.DMStudy.deleteNote(note.id);
        renderAll();
        toast(t('noteDeleted'));
      }
    });
    $('noteForm').addEventListener('submit', event => {
      event.preventDefault();
      const id = $('noteId').value;
      const text = $('noteBody').value.trim();
      if (!text) return;
      if (id) window.DMStudy.updateNote(id, text);
      else window.DMStudy.addNote({chapter:$('noteChapter').value,text});
      $('noteDialog').close();
      renderAll();
      toast(t('noteSaved'));
    });
  }

  function bindDailyTarget() {
    $('dailyTarget').addEventListener('change', () => {
      window.DMStudy.setDailyTarget($('dailyTarget').value);
      renderDaily();
    });
  }

  function bindBackup() {
    $('exportData').addEventListener('click', () => {
      const payload = window.DMStudy.exportData();
      const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `derma-maze-study-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast(t('exportDone'));
    });
    $('importData').addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const payload = JSON.parse(await file.text());
        window.DMStudy.importData(payload);
        renderAll();
        toast(t('importDone'));
      } catch (_) { toast(t('importError')); }
      event.target.value = '';
    });
    $('resetData').addEventListener('click', () => {
      if (!confirm(t('resetConfirm'))) return;
      window.DMStudy.resetStudyData();
      renderAll();
      toast(t('resetDone'));
    });
  }

  function renderAll() {
    translateStatic();
    populateChapterSelects();
    renderOverview();
    renderContinue();
    renderDaily();
    renderChapters();
    renderNotes();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    bindNotes();
    bindDailyTarget();
    bindBackup();
  });
  window.addEventListener('dm-language-change', renderAll);
  window.addEventListener('dm-notes-change', renderAll);
  window.addEventListener('dm-study-imported', renderAll);
  window.addEventListener('dm-study-reset', renderAll);
})();
