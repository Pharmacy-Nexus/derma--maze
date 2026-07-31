(() => {
  'use strict';

  const cfg = window.DM_SUPABASE || {};
  const configured = Boolean(
    cfg.url && cfg.anonKey &&
    !String(cfg.url).includes('PASTE_') &&
    !String(cfg.anonKey).includes('PASTE_')
  );
  const db = configured && window.supabase ? window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false
    },
    global: { headers: { 'X-Client-Info': 'derma-maze-admin/6.3.2' } }
  }) : null;

  const BUCKET = 'updates-media';
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const ALLOWED_STATUS = new Set(['draft', 'published']);
  const ALLOWED_CATEGORY = new Set(['correction', 'content', 'treatment', 'questions', 'book', 'website']);
  const RECORD_FIELDS = 'id,slug,status,category,featured,version,chapter,title_ar,title_en,summary_ar,summary_en,content_ar,content_en,cover_image,images,tags,published_at,created_at,updated_at';

  let records = [];
  let editingImages = [];
  let editingCover = '';
  let pendingObjectUrls = [];

  const $ = id => document.getElementById(id);
  const msg = (id, text, error = false) => {
    const node = $(id);
    if (!node) return;
    node.textContent = text;
    node.className = `admin-message visible${error ? ' error' : ''}`;
  };
  const clearMsg = id => {
    const node = $(id);
    if (node) node.className = 'admin-message';
  };

  function slugify(value) {
    return String(value || 'update').toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 70) || `update-${Date.now()}`;
  }

  function storagePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    let path = raw;
    if (/^https?:\/\//i.test(raw)) {
      try {
        const url = new URL(raw);
        const markers = [
          '/storage/v1/object/public/updates-media/',
          '/storage/v1/object/sign/updates-media/',
          '/storage/v1/object/authenticated/updates-media/'
        ];
        const marker = markers.find(item => url.pathname.includes(item));
        if (!marker) return '';
        path = decodeURIComponent(url.pathname.split(marker)[1] || '');
      } catch (_) { return ''; }
    }
    path = path.replace(/^\/+/, '');
    if (!path || path.includes('..') || path.length > 500 || !/^[a-zA-Z0-9/_.,-]+$/.test(path)) return '';
    return path;
  }

  function isValidId(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
  }

  function showLogin() {
    $('adminLogin').style.display = 'block';
    $('adminApp').classList.remove('visible');
  }

  function showApp(user) {
    $('adminLogin').style.display = 'none';
    $('adminApp').classList.add('visible');
    $('adminIdentity').textContent = user.email || user.id;
  }

  async function checkAdmin(session) {
    if (!session) { showLogin(); return false; }
    const { data, error } = await db.from('update_admins')
      .select('user_id').eq('user_id', session.user.id).maybeSingle();
    if (error || !data) {
      showLogin();
      msg('loginMessage', 'الحساب مسجل لكنه غير مصرح له بإدارة التحديثات.', true);
      await db.auth.signOut();
      return false;
    }
    showApp(session.user);
    await loadRecords();
    return true;
  }

  function revokePendingObjectUrls() {
    pendingObjectUrls.forEach(url => URL.revokeObjectURL(url));
    pendingObjectUrls = [];
  }

  function resetForm() {
    revokePendingObjectUrls();
    $('updateForm').reset();
    $('updateId').value = '';
    $('editorTitle').textContent = 'إضافة تحديث';
    editingImages = [];
    editingCover = '';
    $('coverPreview').replaceChildren();
    $('galleryPreview').replaceChildren();
    clearMsg('saveMessage');
  }

  async function signedUrl(value) {
    const path = storagePath(value);
    if (!path) return '';
    const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 600);
    return error ? '' : data?.signedUrl || '';
  }

  async function addImagePreview(container, value, removeIndex = null) {
    const path = storagePath(value);
    const src = /^blob:/i.test(String(value)) ? String(value) : await signedUrl(path);
    if (!src) return;
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.referrerPolicy = 'no-referrer';
    figure.appendChild(image);
    if (removeIndex !== null) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '×';
      button.setAttribute('aria-label', 'Remove image');
      button.addEventListener('click', () => {
        editingImages.splice(removeIndex, 1);
        previewImages();
      });
      figure.appendChild(button);
    }
    container.appendChild(figure);
  }

  async function previewImages() {
    const cover = $('coverPreview');
    const gallery = $('galleryPreview');
    cover.replaceChildren();
    gallery.replaceChildren();
    if (editingCover) await addImagePreview(cover, editingCover);
    for (let index = 0; index < editingImages.length; index += 1) {
      await addImagePreview(gallery, editingImages[index], index);
    }
  }

  function editRecord(id) {
    if (!isValidId(id)) return;
    const record = records.find(item => item.id === id);
    if (!record) return;
    $('updateId').value = record.id;
    $('status').value = record.status;
    $('category').value = record.category;
    $('featured').value = String(Boolean(record.featured));
    $('version').value = record.version || '';
    $('chapter').value = record.chapter || '';
    $('slug').value = record.slug || '';
    $('titleAr').value = record.title_ar || '';
    $('titleEn').value = record.title_en || '';
    $('summaryAr').value = record.summary_ar || '';
    $('summaryEn').value = record.summary_en || '';
    $('contentAr').value = record.content_ar || '';
    $('contentEn').value = record.content_en || '';
    $('tags').value = (record.tags || []).join(', ');
    $('publishedAt').value = record.published_at ? new Date(record.published_at).toISOString().slice(0, 16) : '';
    editingCover = storagePath(record.cover_image);
    editingImages = (Array.isArray(record.images) ? record.images : []).map(storagePath).filter(Boolean);
    $('editorTitle').textContent = 'تعديل التحديث';
    previewImages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removeRecord(id) {
    if (!isValidId(id) || !window.confirm('حذف التحديث نهائيًا؟')) return;
    const record = records.find(item => item.id === id);
    const { error } = await db.from('derma_updates').delete().eq('id', id);
    if (error) { msg('saveMessage', error.message || 'تعذر حذف التحديث.', true); return; }
    const paths = [storagePath(record?.cover_image), ...(record?.images || []).map(storagePath)].filter(Boolean);
    if (paths.length) {
      const { error: storageError } = await db.storage.from(BUCKET).remove(paths);
      if (storageError) msg('saveMessage', 'تم حذف التحديث، لكن تعذر تنظيف بعض الصور القديمة.', true);
    }
    await loadRecords();
    if ($('updateId').value === id) resetForm();
  }

  function renderList() {
    const list = $('adminUpdateList');
    list.replaceChildren();
    if (!records.length) {
      const empty = document.createElement('p');
      empty.textContent = 'لا توجد تحديثات بعد.';
      list.appendChild(empty);
      return;
    }
    records.forEach(record => {
      const article = document.createElement('article');
      article.className = 'admin-item';
      const top = document.createElement('div');
      top.className = 'admin-item-top';
      const status = document.createElement('span');
      status.className = `status-pill ${ALLOWED_STATUS.has(record.status) ? record.status : 'draft'}`;
      status.textContent = ALLOWED_STATUS.has(record.status) ? record.status : 'draft';
      const version = document.createElement('small');
      version.textContent = record.version || '';
      top.append(status, version);
      const title = document.createElement('h3');
      title.textContent = record.title_ar || record.title_en || 'Untitled';
      const detail = document.createElement('p');
      const updated = Number.isNaN(new Date(record.updated_at).getTime()) ? '' : new Date(record.updated_at).toLocaleDateString('ar-EG');
      detail.textContent = `${record.chapter || 'General'}${updated ? ` · ${updated}` : ''}`;
      const actions = document.createElement('div');
      actions.className = 'admin-item-buttons';
      const edit = document.createElement('button');
      edit.type = 'button'; edit.textContent = 'تعديل'; edit.addEventListener('click', () => editRecord(record.id));
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = 'حذف'; remove.addEventListener('click', () => removeRecord(record.id));
      actions.append(edit, remove);
      article.append(top, title, detail, actions);
      list.appendChild(article);
    });
  }

  async function loadRecords() {
    const { data, error } = await db.from('derma_updates')
      .select(RECORD_FIELDS).order('updated_at', { ascending: false }).range(0, 99);
    if (error) { msg('saveMessage', error.message || 'تعذر تحميل التحديثات.', true); return; }
    records = data || [];
    renderList();
  }

  function validateFile(file) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) throw new Error('حجم الصورة يجب ألا يتجاوز 5MB');
    if (!ALLOWED_MIME.has(file.type)) throw new Error('صيغة الصورة غير مسموحة. استخدم JPG أو PNG أو WebP.');
  }

  async function uploadOne(file, prefix) {
    if (!file) return '';
    validateFile(file);
    const extension = ({'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp'})[file.type];
    const name = `${prefix}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error } = await db.storage.from(BUCKET).upload(name, file, {
      cacheControl: '3600', upsert: false, contentType: file.type
    });
    if (error) throw error;
    return name;
  }

  function value(id, max) {
    return String($(id).value || '').trim().slice(0, max);
  }

  async function save(event) {
    event.preventDefault();
    clearMsg('saveMessage');
    $('saveBtn').disabled = true;
    const uploaded = [];
    const previousCover = editingCover;
    const previousImages = [...editingImages];
    try {
      const status = ALLOWED_STATUS.has($('status').value) ? $('status').value : 'draft';
      const category = ALLOWED_CATEGORY.has($('category').value) ? $('category').value : 'content';
      const titleAr = value('titleAr', 180);
      const titleEn = value('titleEn', 180);
      const summaryAr = value('summaryAr', 600);
      const summaryEn = value('summaryEn', 600);
      if (!titleAr || !titleEn || !summaryAr || !summaryEn) throw new Error('العناوين والملخصات مطلوبة.');

      const id = $('updateId').value;
      if (id && !isValidId(id)) throw new Error('معرّف التحديث غير صالح.');
      const oldRecord = id ? records.find(item => item.id === id) : null;
      const oldPaths = new Set([storagePath(oldRecord?.cover_image), ...(oldRecord?.images || []).map(storagePath)].filter(Boolean));

      const coverFile = $('coverFile').files[0];
      if (coverFile) {
        const path = await uploadOne(coverFile, 'covers');
        uploaded.push(path);
        editingCover = path;
      }
      for (const file of $('galleryFiles').files) {
        const path = await uploadOne(file, 'gallery');
        uploaded.push(path);
        editingImages.push(path);
      }

      const isPublished = status === 'published';
      const payload = {
        status,
        category,
        featured: $('featured').value === 'true',
        version: value('version', 40) || null,
        chapter: value('chapter', 100) || null,
        slug: slugify(value('slug', 70) || titleEn),
        title_ar: titleAr,
        title_en: titleEn,
        summary_ar: summaryAr,
        summary_en: summaryEn,
        content_ar: value('contentAr', 30000),
        content_en: value('contentEn', 30000),
        tags: [...new Set(value('tags', 1000).split(',').map(item => item.trim().slice(0, 60)).filter(Boolean))].slice(0, 30),
        published_at: $('publishedAt').value ? new Date($('publishedAt').value).toISOString() : (isPublished ? new Date().toISOString() : null),
        cover_image: storagePath(editingCover) || null,
        images: [...new Set(editingImages.map(storagePath).filter(Boolean))].slice(0, 20)
      };

      const query = id
        ? db.from('derma_updates').update(payload).eq('id', id)
        : db.from('derma_updates').insert(payload);
      const { error } = await query;
      if (error) throw error;

      const newPaths = new Set([payload.cover_image, ...payload.images].filter(Boolean));
      const stale = [...oldPaths].filter(path => !newPaths.has(path));
      let cleanupWarning = false;
      if (stale.length) {
        const { error: cleanupError } = await db.storage.from(BUCKET).remove(stale);
        cleanupWarning = Boolean(cleanupError);
      }
      await loadRecords();
      resetForm();
      msg('saveMessage', cleanupWarning
        ? 'تم الحفظ، لكن تعذر تنظيف بعض الصور المستبدلة.'
        : 'تم حفظ التحديث بنجاح.', cleanupWarning);
    } catch (error) {
      if (uploaded.length) await db.storage.from(BUCKET).remove(uploaded);
      editingCover = previousCover;
      editingImages = previousImages;
      await previewImages();
      console.warn('Update save failed:', error?.message || 'Unknown error');
      msg('saveMessage', error?.message || 'حدث خطأ أثناء الحفظ.', true);
    } finally {
      $('saveBtn').disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (!db) {
      showLogin();
      msg('loginMessage', 'أنشئ supabase/config.js من ملف config.example.js أولًا.', true);
      $('loginBtn').disabled = true;
      return;
    }
    $('loginForm').addEventListener('submit', async event => {
      event.preventDefault();
      clearMsg('loginMessage');
      $('loginBtn').disabled = true;
      const email = value('adminEmail', 320);
      const password = String($('adminPassword').value || '');
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      $('loginBtn').disabled = false;
      if (error) { msg('loginMessage', 'تعذر تسجيل الدخول. راجع البيانات وحاول مرة أخرى.', true); return; }
      await checkAdmin(data.session);
    });
    $('logoutBtn').addEventListener('click', async () => { await db.auth.signOut(); showLogin(); });
    $('newUpdateBtn').addEventListener('click', resetForm);
    $('cancelEditBtn').addEventListener('click', resetForm);
    $('updateForm').addEventListener('submit', save);
    $('coverFile').addEventListener('change', event => {
      revokePendingObjectUrls();
      const file = event.target.files[0];
      if (!file) return previewImages();
      try { validateFile(file); } catch (error) { msg('saveMessage', error.message, true); event.target.value = ''; return; }
      const url = URL.createObjectURL(file); pendingObjectUrls.push(url);
      $('coverPreview').replaceChildren(); addImagePreview($('coverPreview'), url);
    });
    $('galleryFiles').addEventListener('change', async event => {
      const gallery = $('galleryPreview');
      await previewImages();
      for (const file of event.target.files) {
        try { validateFile(file); } catch (error) { msg('saveMessage', error.message, true); continue; }
        const url = URL.createObjectURL(file); pendingObjectUrls.push(url); await addImagePreview(gallery, url);
      }
    });
    const { data } = await db.auth.getSession();
    await checkAdmin(data.session);
  });
})();
