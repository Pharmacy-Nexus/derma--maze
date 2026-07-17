
(() => {
  'use strict';

  const STORAGE_KEY = 'dermaMazeViralProgressV1';
  const SESSION_SEED_KEY = 'dermaMazeViralSeed';
  const questions = window.VIRAL_QUESTIONS || [];
  const topics = window.VIRAL_TOPICS || [];

  const copy = {
    ar: {
      'nav.home':'الرئيسية','nav.topics':'الموضوعات','nav.questions':'بنك الأسئلة','nav.results':'النتائج','nav.book':'الكتاب',
      'hero.title':'كل فيروس له بصمة.<br><strong>وكل بصمة تغيّر القرار.</strong>',
      'hero.text':'صفحة مستقلة للأمراض الجلدية الفيروسية تجمع 150 سؤالًا ثنائي اللغة في التشخيص والكيسات والعلاج والصور السريرية.',
      'hero.start':'ابدأ التدريب','hero.explore':'استكشف الموضوعات','hero.q':'سؤالًا','hero.t':'موضوعًا','hero.m':'أنماط',
      'topics.title':'قسّم الفصل.<br>واتقن كل موضوع لوحده.','topics.text':'كل بطاقة تفتح تدريب الموضوع مباشرة، وتوضح عدد الأسئلة وأنواعها مع Clinical Pearl سريعة تساعدك تبدأ من النقطة الصح.',
      'path.title':'ذاكر بطريقتك.<br>مش بطريقة واحدة.','path.text':'ابدأ من Topic محدد، اختبر نفسك في عشرة أسئلة عشوائية، أو ادخل امتحان الفصل الكامل. ترتيب الاختيارات يتغير تلقائيًا حتى لا تحفظ نمط الإجابة.',
      'path.studyTitle':'تعلّم بعد كل سؤال','path.studyText':'الإجابة والتفسير والـClinical Reasoning يظهرون فورًا.','path.studyCta':'ابدأ Study Mode',
      'path.randomTitle':'تحدي سريع من 10','path.randomText':'عشرة أسئلة عشوائية من الفلاتر المختارة أو من الفصل كله.','path.randomCta':'ابدأ Random 10',
      'path.examTitle':'امتحان 150 سؤالًا','path.examText':'الإجابات لا تظهر حتى تنهي الجلسة وتشاهد تحليل الأداء.','path.examCta':'ابدأ Full Exam',
      'bank.title':'فلتر السؤال.<br>وبعدين ركّز في القرار.','bank.text':'اختار الموضوع والنوع والصعوبة. يمكنك البحث بالكلمة، حفظ الأسئلة، واستكمال تقدمك لاحقًا من نفس الجهاز.',
      'filter.study':'Study','filter.studySub':'حل وتعلّم فورًا','filter.exam':'Exam','filter.examSub':'الحل في النهاية',
      'filter.topic':'الموضوع','filter.type':'نوع السؤال','filter.difficulty':'الصعوبة','filter.search':'بحث','filter.apply':'ابدأ المجموعة','filter.random':'Random 10','filter.bookmarks':'المحفوظة',
      'session.label':'CURRENT SESSION','session.score':'النتيجة','session.answered':'تمت الإجابة','session.correct':'إجابات صحيحة','session.saved':'أسئلة محفوظة','session.reset':'إعادة المجموعة الحالية','session.resetAll':'ابدأ الفصل من الصفر',
      'session.note':'يُحفظ تقدمك على هذا الجهاز. المحتوى تعليمي ولا يستبدل البروتوكولات المحلية أو التقييم الطبي.',
      'question.zoom':'تكبير الصورة','question.savedAnswer':'تم حفظ إجابتك. سيظهر التصحيح عند إنهاء مجموعة الامتحان.','question.previous':'السابق','question.skip':'تخطي','question.next':'التالي',
      'empty.title':'مفيش أسئلة مطابقة للفلاتر','empty.text':'غيّر البحث أو اختار All في أحد الفلاتر وابدأ المجموعة من جديد.',
      'finish.review':'راجع الإجابات','finish.restart':'ابدأ من جديد',
      'results.title':'اعرف إنت قوي فين.<br>ومحتاج تراجع إيه.','results.text':'النتائج تتحدث تلقائيًا حسب كل Topic. النسبة تعتمد على الأسئلة التي أجبت عنها، وليس على إجمالي أسئلة الموضوع.',
      'results.overall':'OVERALL SCORE','results.coverage':'COVERAGE','results.strongest':'STRONGEST TOPIC','results.review':'REVIEW NEXT',
      'next.previous':'← الفصل السابق','next.next':'الفصل التالي →',
      'footer.disclaimer':'بنك أسئلة تعليمي للصيادلة وطلاب الصيدلة، ولا يُعد بديلًا عن التقييم الطبي أو البروتوكولات المحلية.',
      allTopics:'كل الموضوعات', allTypes:'كل الأنواع', allDifficulties:'كل المستويات',
      typeMCQ:'MCQ',typeCase:'Clinical Case',typeTreatment:'Treatment',typeImage:'Image-Based',
      diffEasy:'Easy',diffMedium:'Medium',diffHard:'Hard',
      questionsWord:'سؤال', answeredWord:'تمت الإجابة', savedWord:'محفوظ',
      startTopic:'ابدأ أسئلة الموضوع', clinicalPearl:'CLINICAL PEARL',
      correct:'إجابة صحيحة', incorrect:'مش أفضل إجابة', correctAnswer:'الإجابة الصحيحة',
      examComplete:'انتهت المجموعة 👏', studyComplete:'خلصت المجموعة 👏',
      examCompleteText:'شاهد النتيجة، ثم راجع الأسئلة لتظهر الإجابات والتفسيرات.',
      studyCompleteText:'تقدر تراجع نتيجتك حسب الموضوع أو تبدأ مجموعة جديدة.',
      noAnswers:'لم تتم الإجابة على أي سؤال بعد.',
      filterSession:'مجموعة مفلترة', randomSession:'تحدي عشوائي', fullSession:'الامتحان الكامل', bookmarksSession:'الأسئلة المحفوظة',
      reviewAnswers:'مراجعة الإجابات',
      resetConfirm:'هل تريد مسح إجابات المجموعة الحالية والبدء من جديد؟',
      resetAllConfirm:'هل تريد مسح كل الإجابات والتقدم المحفوظ في فصل الأمراض الجلدية الفيروسية والبدء من الصفر؟ ستظل الأسئلة المحفوظة في المفضلة كما هي.',
      bookmarksEmpty:'لا توجد أسئلة محفوظة حتى الآن.',
      strongestEmpty:'—', reviewEmpty:'—',
      resultAnswered:'مجاب', resultCorrect:'صحيح'
    },
    en: {
      'nav.home':'Home','nav.topics':'Topics','nav.questions':'Question bank','nav.results':'Results','nav.book':'Book',
      'hero.title':'Every virus leaves a pattern.<br><strong>Every pattern changes the decision.</strong>',
      'hero.text':'A dedicated viral skin diseases page with 150 bilingual questions covering diagnosis, clinical cases, treatment selection, and images.',
      'hero.start':'Start practicing','hero.explore':'Explore topics','hero.q':'Questions','hero.t':'Topics','hero.m':'Modes',
      'topics.title':'Break down the chapter.<br>Master one topic at a time.','topics.text':'Each card opens topic-specific practice and shows question volume, formats, and a quick clinical pearl.',
      'path.title':'Study your way.<br>Not just one way.','path.text':'Choose one topic, take a random ten-question challenge, or enter the complete chapter exam. Options are automatically shuffled to remove answer-pattern memorization.',
      'path.studyTitle':'Learn after every question','path.studyText':'The answer, explanation, and clinical reasoning appear immediately.','path.studyCta':'Start Study Mode',
      'path.randomTitle':'Quick random ten','path.randomText':'Ten random questions from the selected filters or the entire chapter.','path.randomCta':'Start Random 10',
      'path.examTitle':'Full 150-question exam','path.examText':'Answers remain hidden until the session is completed and reviewed.','path.examCta':'Start Full Exam',
      'bank.title':'Filter the question.<br>Then focus on the decision.','bank.text':'Choose the topic, format, and difficulty. Search by keyword, save questions, and continue your progress later on the same device.',
      'filter.study':'Study','filter.studySub':'Answer and learn now','filter.exam':'Exam','filter.examSub':'Review at the end',
      'filter.topic':'Topic','filter.type':'Question type','filter.difficulty':'Difficulty','filter.search':'Search','filter.apply':'Start set','filter.random':'Random 10','filter.bookmarks':'Saved',
      'session.label':'CURRENT SESSION','session.score':'Score','session.answered':'Answered','session.correct':'Correct','session.saved':'Saved questions','session.reset':'Reset current set','session.resetAll':'Restart chapter from zero',
      'session.note':'Progress is stored on this device. This educational content does not replace clinical assessment or local protocols.',
      'question.zoom':'Enlarge image','question.savedAnswer':'Your answer is saved. Correction will appear when the exam set is completed.','question.previous':'Previous','question.skip':'Skip','question.next':'Next',
      'empty.title':'No questions match these filters','empty.text':'Change the search or choose All in a filter, then start the set again.',
      'finish.review':'Review answers','finish.restart':'Start again',
      'results.title':'See your strengths.<br>Know what to review.','results.text':'Performance updates automatically by topic. Percentages are based on answered questions, not the full topic total.',
      'results.overall':'OVERALL SCORE','results.coverage':'COVERAGE','results.strongest':'STRONGEST TOPIC','results.review':'REVIEW NEXT',
      'next.previous':'← Previous chapter','next.next':'Next chapter →',
      'footer.disclaimer':'An educational question bank for pharmacists and pharmacy students. It does not replace medical assessment or local protocols.',
      allTopics:'All topics',allTypes:'All formats',allDifficulties:'All levels',
      typeMCQ:'MCQ',typeCase:'Clinical Case',typeTreatment:'Treatment',typeImage:'Image-Based',
      diffEasy:'Easy',diffMedium:'Medium',diffHard:'Hard',
      questionsWord:'questions',answeredWord:'answered',savedWord:'saved',
      startTopic:'Practice this topic',clinicalPearl:'CLINICAL PEARL',
      correct:'Correct answer',incorrect:'Not the best answer',correctAnswer:'Correct answer',
      examComplete:'Set completed 👏',studyComplete:'Set completed 👏',
      examCompleteText:'View your score, then review the questions to reveal answers and explanations.',
      studyCompleteText:'Review performance by topic or begin a new set.',
      noAnswers:'No questions have been answered yet.',
      filterSession:'Filtered set',randomSession:'Random challenge',fullSession:'Full chapter exam',bookmarksSession:'Saved questions',
      reviewAnswers:'Answer review',
      resetConfirm:'Clear the answers in the current session and start again?',
      resetAllConfirm:'Clear every answered question and saved progress in the Viral Skin Diseases chapter and restart from zero? Bookmarks will stay saved.',
      bookmarksEmpty:'No saved questions yet.',
      strongestEmpty:'—',reviewEmpty:'—',
      resultAnswered:'answered',resultCorrect:'correct'
    }
  };

  const els = {};
  let state = {
    mode:'study',
    filters:{topic:'all',type:'all',difficulty:'all',search:''},
    bookmarksOnly:false,
    session:[],
    sessionKind:'filtered',
    index:0,
    answers:{},
    bookmarks:new Set(),
    reviewMode:false,
    completed:false
  };

  function lang(){ return window.currentDMLang === 'en' ? 'en' : 'ar'; }
  function t(key){ return copy[lang()][key] ?? key; }
  function local(obj){ return obj?.[lang()] || obj?.en || ''; }

  function cacheElements(){
    [
      'virTopicJump','virTopicGrid','virModeSwitch','virTopicFilter','virTypeFilter','virDifficultyFilter','virSearch',
      'virApplyFilters','virRandomTen','virBookmarksOnly','virSessionTitle','virSessionCount','virScoreArc','virScorePercent',
      'virAnsweredCount','virCorrectCount','virSavedCount','virResetSession','virResetAllProgress','virProgressBar','virQuestionCard',
      'virQuestionId','virQuestionType','virQuestionDifficulty','virQuestionSource','virBookmarkBtn','virQuestionTopic',
      'virQuestionCounter','virQuestionImageWrap','virQuestionImage','virZoomImage','virQuestionText','virOptions',
      'virFeedback','virFeedbackIcon','virFeedbackTitle','virExplanation','virReasoning','virExamMessage',
      'virPrevQuestion','virSkipQuestion','virNextQuestion','virEmptyState','virExamFinish','virExamFinishTitle',
      'virFinishPercent','virFinishDetail','virFinishText','virReviewExam','virRestartExam','virOverallScore',
      'virCoverage','virStrongest','virReviewNext','virResultsGrid','virImageDialog','virCloseImage','virDialogImage',
      'randomTenHero','fullExamHero'
    ].forEach(id => els[id] = document.getElementById(id));
  }

  function loadProgress(){
    try{
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      state.answers = saved.answers && typeof saved.answers === 'object' ? saved.answers : {};
      state.bookmarks = new Set(Array.isArray(saved.bookmarks) ? saved.bookmarks : []);
    }catch{
      state.answers = {};
      state.bookmarks = new Set();
    }
  }

  function saveProgress(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers:state.answers,
      bookmarks:[...state.bookmarks]
    }));
  }

  function setStaticTranslations(){
    document.querySelectorAll('[data-vir-i18n]').forEach(el => {
      const value = t(el.dataset.virI18n);
      if(value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('[data-vir-i18n-html]').forEach(el => {
      const value = t(el.dataset.virI18nHtml);
      if(value !== undefined) el.innerHTML = value;
    });
    if(els.virSearch){
      els.virSearch.placeholder = lang()==='ar' ? 'HSV، VZV، أسيكلوفير...' : 'HSV, VZV, acyclovir...';
    }
  }

  function typeLabel(type){
    return t({MCQ:'typeMCQ',Case:'typeCase',Treatment:'typeTreatment',Image:'typeImage'}[type] || type);
  }
  function difficultyLabel(d){
    return t({Easy:'diffEasy',Medium:'diffMedium',Hard:'diffHard'}[d] || d);
  }
  function topicBySlug(slug){ return topics.find(x => x.slug === slug); }

  function renderTopics(){
    els.virTopicJump.innerHTML = topics.map((topic,index) =>
      `<button data-jump="${topic.slug}">${String(index+1).padStart(2,'0')} · ${escapeHtml(local(topic.title))}</button>`
    ).join('');

    els.virTopicGrid.innerHTML = topics.map((topic,index) => {
      const typeBadges = Object.entries(topic.types)
        .map(([kind,count]) => `<span>${escapeHtml(typeLabel(kind))} ${count}</span>`).join('');
      return `<article class="vir-topic-card reveal visible" id="topic-${topic.slug}">
        <div class="vir-topic-photo">
          <img src="${topic.image}" alt="${escapeAttr(local(topic.title))}" loading="lazy">
          <span>${escapeHtml(topic.title.en.toUpperCase())}</span>
          <b>${String(index+1).padStart(2,'0')}</b>
        </div>
        <div class="vir-topic-body">
          <div class="vir-topic-title-row">
            <h3>${escapeHtml(local(topic.title))}</h3>
            <span>${topic.count} ${escapeHtml(t('questionsWord'))}</span>
          </div>
          <p>${escapeHtml(local(topic.summary))}</p>
          <div class="vir-topic-type-row">${typeBadges}</div>
          <div class="vir-topic-pearl">
            <small>${escapeHtml(t('clinicalPearl'))}</small>
            <b>${escapeHtml(local(topic.pearl))}</b>
          </div>
          <button class="vir-topic-action" data-start-topic="${topic.slug}">
            <span>${escapeHtml(t('startTopic'))}</span><b>↗</b>
          </button>
        </div>
      </article>`;
    }).join('');

    els.virTopicJump.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(`topic-${btn.dataset.jump}`);
        target?.scrollIntoView({behavior:'smooth',block:'center'});
      });
    });
    els.virTopicGrid.querySelectorAll('[data-start-topic]').forEach(btn => {
      btn.addEventListener('click', () => startTopic(btn.dataset.startTopic));
    });
  }

  function renderFilterControls(){
    const currentTopic = state.filters.topic;
    const currentType = state.filters.type;
    const currentDifficulty = state.filters.difficulty;

    els.virTopicFilter.innerHTML =
      `<option value="all">${escapeHtml(t('allTopics'))}</option>` +
      topics.map(topic => `<option value="${topic.slug}">${escapeHtml(local(topic.title))} (${topic.count})</option>`).join('');
    els.virTopicFilter.value = currentTopic;

    const types = ['MCQ','Case','Treatment','Image'];
    els.virTypeFilter.innerHTML =
      `<option value="all">${escapeHtml(t('allTypes'))}</option>` +
      types.map(type => `<option value="${type}">${escapeHtml(typeLabel(type))} (${window.VIRAL_STATS.types[type]})</option>`).join('');
    els.virTypeFilter.value = currentType;

    const diffs = ['Easy','Medium','Hard'];
    els.virDifficultyFilter.innerHTML =
      `<option value="all">${escapeHtml(t('allDifficulties'))}</option>` +
      diffs.map(d => `<option value="${d}">${escapeHtml(difficultyLabel(d))} (${window.VIRAL_STATS.difficulties[d]})</option>`).join('');
    els.virDifficultyFilter.value = currentDifficulty;

    els.virSearch.value = state.filters.search;
    updateModeButtons();
    els.virBookmarksOnly.classList.toggle('active',state.bookmarksOnly);
    const heart = els.virBookmarksOnly.querySelector('span');
    if(heart) heart.textContent = state.bookmarksOnly ? '♥' : '♡';
  }

  function updateModeButtons(){
    els.virModeSwitch.querySelectorAll('[data-mode]').forEach(btn => {
      btn.classList.toggle('active',btn.dataset.mode === state.mode);
    });
  }

  function readControls(){
    state.filters.topic = els.virTopicFilter.value;
    state.filters.type = els.virTypeFilter.value;
    state.filters.difficulty = els.virDifficultyFilter.value;
    state.filters.search = els.virSearch.value.trim();
  }

  function normalizedSearch(q){
    return [
      q.id,q.topicEn,q.topicAr,q.type,q.difficulty,q.source,
      q.question.en,q.question.ar,q.explanation.en,q.explanation.ar,q.reasoning.en,q.reasoning.ar,
      ...q.options.flatMap(o => [o.en,o.ar])
    ].join(' ').toLocaleLowerCase();
  }

  function getFilteredPool(){
    const term = state.filters.search.toLocaleLowerCase();
    return questions.filter(q => {
      if(state.bookmarksOnly && !state.bookmarks.has(q.id)) return false;
      if(state.filters.topic !== 'all' && q.topic !== state.filters.topic) return false;
      if(state.filters.type !== 'all' && q.type !== state.filters.type) return false;
      if(state.filters.difficulty !== 'all' && q.difficulty !== state.filters.difficulty) return false;
      if(term && !normalizedSearch(q).includes(term)) return false;
      return true;
    });
  }

  function getSeed(){
    let seed = Number(sessionStorage.getItem(SESSION_SEED_KEY));
    if(!Number.isFinite(seed) || seed <= 0){
      seed = Math.floor(Math.random()*2147483646)+1;
      sessionStorage.setItem(SESSION_SEED_KEY,String(seed));
    }
    return seed;
  }

  function hashString(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h,16777619);
    }
    return h >>> 0;
  }

  function seededRandom(seed){
    let a = seed >>> 0;
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let r = Math.imul(a ^ a >>> 15,1 | a);
      r = r + Math.imul(r ^ r >>> 7,61 | r) ^ r;
      return ((r ^ r >>> 14) >>> 0) / 4294967296;
    };
  }

  function shuffled(items,seedText){
    const arr = [...items];
    const rand = seededRandom(hashString(seedText));
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(rand()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function getDisplayOptions(q){
    return shuffled(q.options,`${getSeed()}-${q.id}`);
  }

  function startSession({randomLimit=null,forceAll=false,kind='filtered'} = {}){
    readControls();
    if(forceAll){
      state.filters = {topic:'all',type:'all',difficulty:'all',search:''};
      state.bookmarksOnly = false;
      renderFilterControls();
    }
    let pool = getFilteredPool();
    if(randomLimit){
      pool = shuffled(pool,`${Date.now()}-${Math.random()}`).slice(0,randomLimit);
    }
    state.session = pool;
    state.sessionKind = kind;
    state.index = 0;
    state.reviewMode = false;
    state.completed = false;
    showPractice();
    renderQuestion();
    updateSessionSummary();
    document.getElementById('question-bank')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function startTopic(slug){
    state.filters.topic = slug;
    state.filters.type = 'all';
    state.filters.difficulty = 'all';
    state.filters.search = '';
    state.bookmarksOnly = false;
    state.mode = 'study';
    renderFilterControls();
    startSession({kind:'filtered'});
  }

  function startRandomTen(){
    readControls();
    state.mode = 'study';
    state.bookmarksOnly = false;
    renderFilterControls();
    startSession({randomLimit:10,kind:'random'});
  }

  function startFullExam(){
    state.mode = 'exam';
    state.filters = {topic:'all',type:'all',difficulty:'all',search:''};
    state.bookmarksOnly = false;
    renderFilterControls();
    startSession({randomLimit:null,forceAll:true,kind:'full'});
    state.session = shuffled(state.session,`${Date.now()}-full-exam`);
    state.index = 0;
    renderQuestion();
    updateSessionSummary();
  }

  function showPractice(){
    const empty = state.session.length === 0;
    els.virEmptyState.hidden = !empty;
    els.virQuestionCard.hidden = empty;
    els.virExamFinish.hidden = true;
    if(empty && state.bookmarksOnly){
      const p = els.virEmptyState.querySelector('p');
      if(p) p.textContent = t('bookmarksEmpty');
    }else{
      const p = els.virEmptyState.querySelector('p');
      if(p) p.textContent = t('empty.text');
    }
  }

  function currentQuestion(){ return state.session[state.index]; }

  function renderQuestion(){
    if(!state.session.length){
      showPractice();
      updateSessionSummary();
      return;
    }
    showPractice();
    const q = currentQuestion();
    const answer = state.answers[q.id];
    const displayOptions = getDisplayOptions(q);

    els.virQuestionId.textContent = q.id;
    els.virQuestionType.textContent = typeLabel(q.type).toUpperCase();
    els.virQuestionDifficulty.textContent = difficultyLabel(q.difficulty).toUpperCase();
    els.virQuestionSource.textContent = q.source;
    els.virQuestionTopic.textContent = lang()==='ar' ? q.topicAr : q.topicEn.toUpperCase();
    els.virQuestionCounter.textContent = `${String(state.index+1).padStart(2,'0')} / ${String(state.session.length).padStart(2,'0')}`;
    els.virQuestionText.textContent = local(q.question);
    els.virProgressBar.style.width = `${((state.index+1)/state.session.length)*100}%`;

    els.virBookmarkBtn.classList.toggle('saved',state.bookmarks.has(q.id));
    els.virBookmarkBtn.textContent = state.bookmarks.has(q.id) ? '♥' : '♡';

    if(q.image){
      els.virQuestionImageWrap.hidden = false;
      els.virQuestionImage.src = q.image;
      els.virQuestionImage.alt = `${q.id} ${local(q.question)}`;
    }else{
      els.virQuestionImageWrap.hidden = true;
      els.virQuestionImage.removeAttribute('src');
    }

    els.virOptions.innerHTML = displayOptions.map((option,index) => `
      <button class="vir-option" data-letter="${option.letter}">
        <span>${String.fromCharCode(65+index)}</span>
        <b>${escapeHtml(option[lang()] || option.en)}</b>
      </button>
    `).join('');

    els.virFeedback.className = 'vir-feedback';
    els.virExamMessage.hidden = true;

    els.virOptions.querySelectorAll('.vir-option').forEach(btn => {
      btn.addEventListener('click',() => chooseAnswer(btn.dataset.letter));
    });

    if(answer){
      if(state.mode === 'study' || state.reviewMode){
        revealAnswer(q,answer.selected);
      }else{
        markExamSelection(answer.selected);
      }
    }

    els.virPrevQuestion.disabled = state.index === 0;
    els.virNextQuestion.disabled = !answer && !state.reviewMode;
    els.virNextQuestion.querySelector('[data-vir-i18n="question.next"]')?.replaceChildren(
      document.createTextNode(state.index === state.session.length-1
        ? (lang()==='ar' ? 'إنهاء المجموعة' : 'Finish set')
        : t('question.next'))
    );
    updateSessionSummary();
  }

  function chooseAnswer(letter){
    const q = currentQuestion();
    if(!q) return;
    if((state.mode === 'study' || state.reviewMode) && state.answers[q.id]) return;

    state.answers[q.id] = {selected:letter,correct:letter===q.correct,updatedAt:Date.now()};
    saveProgress();

    if(state.mode === 'study' || state.reviewMode){
      revealAnswer(q,letter);
    }else{
      markExamSelection(letter);
    }
    els.virNextQuestion.disabled = false;
    updateSessionSummary();
    renderResults();
  }

  function markExamSelection(letter){
    els.virOptions.querySelectorAll('.vir-option').forEach(btn => {
      btn.classList.toggle('selected',btn.dataset.letter === letter);
    });
    els.virExamMessage.hidden = false;
  }

  function revealAnswer(q,selectedLetter){
    const good = selectedLetter === q.correct;
    els.virOptions.querySelectorAll('.vir-option').forEach(btn => {
      btn.disabled = true;
      if(btn.dataset.letter === q.correct) btn.classList.add('correct');
      if(btn.dataset.letter === selectedLetter && !good) btn.classList.add('wrong');
    });
    els.virFeedback.className = `vir-feedback show ${good ? 'good' : 'bad'}`;
    els.virFeedbackIcon.textContent = good ? '✓' : '×';
    els.virFeedbackTitle.textContent = good ? t('correct') : `${t('incorrect')} — ${t('correctAnswer')}: ${correctOptionText(q)}`;
    els.virExplanation.textContent = local(q.explanation);
    els.virReasoning.textContent = local(q.reasoning);
    els.virExamMessage.hidden = true;
  }

  function correctOptionText(q){
    const option = q.options.find(o => o.letter === q.correct);
    return option ? (option[lang()] || option.en) : q.correct;
  }

  function navigate(delta){
    if(!state.session.length) return;
    const next = state.index + delta;
    if(next < 0) return;
    if(next >= state.session.length){
      finishSession();
      return;
    }
    state.index = next;
    renderQuestion();
    els.virQuestionCard.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function skipQuestion(){
    if(state.index >= state.session.length-1){
      finishSession();
    }else{
      state.index++;
      renderQuestion();
    }
  }

  function finishSession(){
    state.completed = true;
    const result = sessionStats();
    els.virQuestionCard.hidden = true;
    els.virEmptyState.hidden = true;
    els.virExamFinish.hidden = false;
    els.virExamFinishTitle.textContent = state.mode === 'exam' ? t('examComplete') : t('studyComplete');
    els.virFinishPercent.textContent = `${result.percent}%`;
    els.virFinishDetail.textContent = `${result.correct} / ${result.answered} ${t('answeredWord')}`;
    els.virFinishText.textContent = state.mode === 'exam' ? t('examCompleteText') : t('studyCompleteText');
    updateSessionSummary();
    renderResults();
  }

  function reviewSession(){
    state.reviewMode = true;
    state.index = 0;
    state.completed = false;
    els.virExamFinish.hidden = true;
    els.virQuestionCard.hidden = false;
    renderQuestion();
  }

  function restartSession(){
    clearSessionAnswers();
    state.index = 0;
    state.reviewMode = false;
    state.completed = false;
    showPractice();
    renderQuestion();
  }

  function clearSessionAnswers(){
    state.session.forEach(q => delete state.answers[q.id]);
    saveProgress();
    renderResults();
    updateSessionSummary();
  }

  function resetCurrentSession(){
    if(!state.session.length) return;
    if(window.confirm(t('resetConfirm'))){
      restartSession();
    }
  }

  function resetAllProgress(){
    if(!window.confirm(t('resetAllConfirm'))) return;
    state.answers = {};
    state.index = 0;
    state.examSubmitted = false;
    state.reviewing = false;
    saveProgress();
    renderResults();
    updateSessionSummary();
    renderQuestion();
    window.scrollTo({top:document.getElementById('question-bank')?.offsetTop || 0,behavior:'smooth'});
  }

  function toggleBookmark(){
    const q = currentQuestion();
    if(!q) return;
    if(state.bookmarks.has(q.id)) state.bookmarks.delete(q.id);
    else state.bookmarks.add(q.id);
    saveProgress();
    els.virBookmarkBtn.classList.toggle('saved',state.bookmarks.has(q.id));
    els.virBookmarkBtn.textContent = state.bookmarks.has(q.id) ? '♥' : '♡';
    updateSessionSummary();
    renderResults();
    if(state.bookmarksOnly && !state.bookmarks.has(q.id)){
      state.session = getFilteredPool();
      state.index = Math.min(state.index,Math.max(0,state.session.length-1));
      renderQuestion();
    }
  }

  function sessionStats(){
    const answered = state.session.filter(q => state.answers[q.id]);
    const correct = answered.filter(q => state.answers[q.id].selected === q.correct);
    return {
      answered:answered.length,
      correct:correct.length,
      percent:answered.length ? Math.round(correct.length/answered.length*100) : 0
    };
  }

  function sessionTitle(){
    if(state.reviewMode) return t('reviewAnswers');
    if(state.sessionKind === 'random') return t('randomSession');
    if(state.sessionKind === 'full') return t('fullSession');
    if(state.bookmarksOnly) return t('bookmarksSession');
    if(state.filters.topic !== 'all') return local(topicBySlug(state.filters.topic)?.title);
    return t('filterSession');
  }

  function updateSessionSummary(){
    const s = sessionStats();
    els.virSessionTitle.textContent = sessionTitle();
    els.virSessionCount.textContent = `${state.session.length} ${t('questionsWord')}`;
    els.virAnsweredCount.textContent = s.answered;
    els.virCorrectCount.textContent = s.correct;
    els.virSavedCount.textContent = state.bookmarks.size;
    els.virScorePercent.textContent = `${s.percent}%`;
    els.virScoreArc.style.strokeDashoffset = String(314-(314*s.percent/100));
  }

  function allStats(){
    const answered = questions.filter(q => state.answers[q.id]);
    const correct = answered.filter(q => state.answers[q.id].selected === q.correct);
    return {
      answered:answered.length,
      correct:correct.length,
      percent:answered.length ? Math.round(correct.length/answered.length*100) : 0
    };
  }

  function topicStats(topic){
    const set = questions.filter(q => q.topic === topic.slug);
    const answered = set.filter(q => state.answers[q.id]);
    const correct = answered.filter(q => state.answers[q.id].selected === q.correct);
    return {
      total:set.length,
      answered:answered.length,
      correct:correct.length,
      percent:answered.length ? Math.round(correct.length/answered.length*100) : 0
    };
  }

  function renderResults(){
    const overall = allStats();
    const stats = topics.map(topic => ({topic,...topicStats(topic)}));
    const active = stats.filter(x => x.answered > 0);
    const strongest = active.length ? [...active].sort((a,b) => b.percent-a.percent || b.answered-a.answered)[0] : null;
    const review = active.length ? [...active].sort((a,b) => a.percent-b.percent || b.answered-a.answered)[0] : null;

    els.virOverallScore.textContent = `${overall.percent}%`;
    els.virCoverage.textContent = `${overall.answered} / ${questions.length}`;
    els.virStrongest.textContent = strongest ? local(strongest.topic.title) : t('strongestEmpty');
    els.virReviewNext.textContent = review ? local(review.topic.title) : t('reviewEmpty');

    els.virResultsGrid.innerHTML = stats.map(item => `
      <article class="vir-result-card" style="--pct:${item.percent}%">
        <div><span>${escapeHtml(local(item.topic.title))}</span><b>${item.percent}%</b></div>
        <i></i>
        <small>${item.answered} / ${item.total} ${escapeHtml(t('resultAnswered'))} · ${item.correct} ${escapeHtml(t('resultCorrect'))}</small>
      </article>
    `).join('');
  }

  function toggleBookmarksOnly(){
    state.bookmarksOnly = !state.bookmarksOnly;
    state.filters.topic = 'all';
    state.filters.type = 'all';
    state.filters.difficulty = 'all';
    state.filters.search = '';
    renderFilterControls();
    startSession({kind:'filtered'});
  }

  function openImage(){
    const q = currentQuestion();
    if(!q?.image) return;
    els.virDialogImage.src = q.image;
    els.virImageDialog.showModal();
  }

  function readUrlParams(){
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    const type = params.get('type');
    const difficulty = params.get('difficulty');
    const mode = params.get('mode');
    if(topicBySlug(topic)) state.filters.topic = topic;
    if(['MCQ','Case','Treatment','Image'].includes(type)) state.filters.type = type;
    if(['Easy','Medium','Hard'].includes(difficulty)) state.filters.difficulty = difficulty;
    if(['study','exam'].includes(mode)) state.mode = mode;
  }

  function bindEvents(){
    els.virModeSwitch.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click',() => {
        state.mode = btn.dataset.mode;
        state.reviewMode = false;
        updateModeButtons();
        renderQuestion();
      });
    });
    els.virApplyFilters.addEventListener('click',() => {
      state.bookmarksOnly = false;
      startSession({kind:'filtered'});
      renderFilterControls();
    });
    els.virRandomTen.addEventListener('click',startRandomTen);
    els.randomTenHero?.addEventListener('click',startRandomTen);
    els.fullExamHero?.addEventListener('click',startFullExam);
    document.querySelectorAll('[data-start-mode="study"]').forEach(btn => btn.addEventListener('click',() => {
      state.mode = 'study';
      renderFilterControls();
      startSession({kind:'filtered'});
    }));
    els.virBookmarksOnly.addEventListener('click',toggleBookmarksOnly);
    els.virPrevQuestion.addEventListener('click',() => navigate(-1));
    els.virNextQuestion.addEventListener('click',() => navigate(1));
    els.virSkipQuestion.addEventListener('click',skipQuestion);
    els.virBookmarkBtn.addEventListener('click',toggleBookmark);
    els.virResetSession.addEventListener('click',resetCurrentSession);
    els.virResetAllProgress?.addEventListener('click',resetAllProgress);
    els.virReviewExam.addEventListener('click',reviewSession);
    els.virRestartExam.addEventListener('click',restartSession);
    els.virZoomImage.addEventListener('click',openImage);
    els.virQuestionImage.addEventListener('click',openImage);
    els.virCloseImage.addEventListener('click',() => els.virImageDialog.close());
    els.virImageDialog.addEventListener('click',e => { if(e.target === els.virImageDialog) els.virImageDialog.close(); });
    els.virSearch.addEventListener('keydown',e => {
      if(e.key === 'Enter'){
        e.preventDefault();
        state.bookmarksOnly = false;
        startSession({kind:'filtered'});
      }
    });
    window.addEventListener('dm-language-change',() => {
      setStaticTranslations();
      renderTopics();
      renderFilterControls();
      renderQuestion();
      renderResults();
      updateSessionSummary();
    });
  }

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g,ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  }
  function escapeAttr(value){ return escapeHtml(value); }

  function init(){
    cacheElements();
    loadProgress();
    readUrlParams();
    setStaticTranslations();
    renderTopics();
    renderFilterControls();
    bindEvents();
    state.session = getFilteredPool();
    renderQuestion();
    renderResults();
    updateSessionSummary();
  }

  document.addEventListener('DOMContentLoaded',init);
})();
