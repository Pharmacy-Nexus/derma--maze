(() => {
  'use strict';

  const cfg = window.DM_SUPABASE || {};
  const configured = Boolean(cfg.url && cfg.anonKey && !String(cfg.url).includes('PASTE_') && !String(cfg.anonKey).includes('PASTE_'));
  const db = configured && window.supabase ? window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { 'X-Client-Info': 'derma-maze-updates/6.3.2' } }
  }) : null;
  const BUCKET = 'updates-media';
  const PAGE_SIZE = 36;
  const PUBLIC_FIELDS = 'id,slug,status,category,featured,version,chapter,title_ar,title_en,summary_ar,summary_en,content_ar,content_en,cover_image,images,tags,published_at,created_at,updated_at';

  const categoryLabels = {
    all:{ar:'الكل',en:'All'}, correction:{ar:'تصحيح',en:'Correction'}, content:{ar:'إضافة محتوى',en:'Content'}, treatment:{ar:'تحديث علاجي',en:'Treatment'}, questions:{ar:'أسئلة جديدة',en:'Questions'}, book:{ar:'أخبار الكتاب',en:'Book news'}, website:{ar:'تحديث الموقع',en:'Website'}
  };
  let updates = [];
  let active = 'all';
  let search = '';
  const signedCache = new Map();
  const el = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const lang = () => window.currentDMLang === 'en' ? 'en' : 'ar';
  const text = (item, key) => item[`${key}_${lang()}`] || item[`${key}_en`] || item[`${key}_ar`] || '';

  function storagePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    let path = raw;
    if (/^https?:\/\//i.test(raw)) {
      try {
        const url = new URL(raw);
        const markers = ['/storage/v1/object/public/updates-media/', '/storage/v1/object/sign/updates-media/'];
        const marker = markers.find(item => url.pathname.includes(item));
        if (!marker) return '';
        path = decodeURIComponent(url.pathname.split(marker)[1] || '');
      } catch (_) { return ''; }
    }
    path = path.replace(/^\/+/, '');
    return path && !path.includes('..') && path.length <= 500 && /^[a-zA-Z0-9/_.,-]+$/.test(path) ? path : '';
  }

  async function mediaUrl(value) {
    const path = storagePath(value);
    if (!path || !db) return '';
    if (signedCache.has(path)) return signedCache.get(path);
    const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 3600);
    const result = error ? '' : data?.signedUrl || '';
    signedCache.set(path, result);
    return result;
  }

  function dateText(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(lang() === 'ar' ? 'ar-EG' : 'en-GB', {day:'numeric',month:'short',year:'numeric'}).format(date);
  }

  function parseContent(raw) {
    const lines = String(raw || '').split(/\r?\n/);
    let html = '';
    let list = false;
    const close = () => { if (list) { html += '</ul>'; list = false; } };
    for (const line of lines) {
      const value = line.trim();
      if (!value) { close(); continue; }
      if (value.startsWith('## ')) { close(); html += `<h3>${escapeHTML(value.slice(3))}</h3>`; }
      else if (value.startsWith('- ')) { if (!list) { html += '<ul>'; list = true; } html += `<li>${escapeHTML(value.slice(2))}</li>`; }
      else { close(); html += `<p>${escapeHTML(value)}</p>`; }
    }
    close();
    return html;
  }

  function meta(item) {
    const category = categoryLabels[item.category] || categoryLabels.content;
    return `<div class="update-meta"><span>${escapeHTML(category[lang()])}</span>${item.version ? `<span>${escapeHTML(item.version)}</span>` : ''}<span>${escapeHTML(dateText(item.published_at || item.created_at))}</span>${item.chapter ? `<span>${escapeHTML(item.chapter)}</span>` : ''}</div>`;
  }

  async function media(item, className = '') {
    const source = item.cover_image || (Array.isArray(item.images) && item.images[0]) || '';
    const src = await mediaUrl(source);
    return src ? `<img class="${escapeHTML(className)}" src="${escapeHTML(src)}" alt="${escapeHTML(text(item, 'title'))}" loading="lazy" referrerpolicy="no-referrer">` : '';
  }

  async function openUpdate(id) {
    const item = updates.find(record => record.id === id);
    if (!item) return;
    const images = Array.isArray(item.images) ? item.images.map(storagePath).filter(Boolean).slice(0, 20) : [];
    const cover = await media(item, 'update-dialog-cover');
    const galleryUrls = (await Promise.all(images.map(mediaUrl))).filter(Boolean);
    el('updateDialogContent').innerHTML = `${cover}<div class="update-dialog-body"><div class="updates-label">${escapeHTML((categoryLabels[item.category] || categoryLabels.content)[lang()])}</div><h2>${escapeHTML(text(item, 'title'))}</h2>${meta(item)}<div class="update-rich">${parseContent(text(item, 'content'))}</div>${galleryUrls.length ? `<div class="update-gallery">${galleryUrls.map(src => `<img src="${escapeHTML(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">`).join('')}</div>` : ''}</div>`;
    el('updateDialog').showModal();
  }

  function filtered() {
    const query = search.trim().toLocaleLowerCase();
    return updates.filter(item => {
      if (active !== 'all' && item.category !== active) return false;
      if (!query) return true;
      return [item.title_ar,item.title_en,item.summary_ar,item.summary_en,item.chapter,item.version,...(item.tags || [])]
        .join(' ').toLocaleLowerCase().includes(query);
    });
  }

  function renderFilters() {
    const categories = ['all', ...new Set(updates.map(item => item.category).filter(Boolean))];
    const container = el('updatesFilters');
    container.innerHTML = categories.map(category => `<button class="updates-filter ${category === active ? 'active' : ''}" type="button" data-category="${escapeHTML(category)}">${escapeHTML((categoryLabels[category] || {ar:category,en:category})[lang()])}</button>`).join('');
  }

  async function render() {
    renderFilters();
    const data = filtered();
    el('updatesCount').textContent = String(updates.length).padStart(2, '0');
    const featured = data.find(item => item.featured) || data[0];
    const feature = el('updatesFeatured');
    if (featured) {
      feature.classList.add('visible');
      feature.innerHTML = `<div class="updates-featured-media">${await media(featured)}</div><div class="updates-featured-body"><div class="updates-label">${escapeHTML((categoryLabels[featured.category] || categoryLabels.content)[lang()])}</div><h2>${escapeHTML(text(featured, 'title'))}</h2><p>${escapeHTML(text(featured, 'summary'))}</p>${meta(featured)}<button class="update-open" type="button" data-update-id="${escapeHTML(featured.id)}">${lang() === 'ar' ? 'اقرأ التحديث' : 'Read update'} ↗</button></div>`;
    } else {
      feature.classList.remove('visible');
      feature.replaceChildren();
    }
    const rest = featured ? data.filter(item => item.id !== featured.id) : data;
    const cards = await Promise.all(rest.map(async item => `<article class="update-card"><div class="update-card-media">${await media(item)}</div><div class="update-card-body"><div class="updates-label">${escapeHTML((categoryLabels[item.category] || categoryLabels.content)[lang()])}</div><h3>${escapeHTML(text(item, 'title'))}</h3><p>${escapeHTML(text(item, 'summary'))}</p>${meta(item)}<button class="update-open" type="button" data-update-id="${escapeHTML(item.id)}">${lang() === 'ar' ? 'التفاصيل' : 'Details'} ↗</button></div></article>`));
    el('updatesGrid').innerHTML = cards.join('');
    el('updatesEmpty').classList.toggle('visible', data.length === 0);
  }

  function showConfigState() {
    el('updatesEmpty').classList.add('visible');
    el('updatesEmpty').textContent = lang() === 'ar' ? 'صفحة التحديثات غير مفعلة حاليًا.' : 'Updates are not enabled at the moment.';
  }

  async function load() {
    el('updatesLoader').style.display = 'block';
    if (!db) { el('updatesLoader').style.display = 'none'; showConfigState(); return; }
    const { data, error } = await db.from('derma_updates').select(PUBLIC_FIELDS)
      .eq('status', 'published').lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false }).range(0, PAGE_SIZE - 1);
    el('updatesLoader').style.display = 'none';
    if (error) { console.warn('Updates load failed:', error.message || 'Unknown error'); showConfigState(); return; }
    updates = data || [];
    await render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    el('updatesSearch')?.addEventListener('input', event => { search = event.target.value; render(); });
    el('updatesFilters')?.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      active = button.dataset.category;
      render();
    });
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-update-id]');
      if (button) openUpdate(button.dataset.updateId);
    });
    el('updateDialogClose')?.addEventListener('click', () => el('updateDialog').close());
    el('updateDialog')?.addEventListener('click', event => { if (event.target === el('updateDialog')) el('updateDialog').close(); });
    load();
  });
  window.addEventListener('dm-language-change', render);
})();
