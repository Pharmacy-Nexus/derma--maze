#!/usr/bin/env python3
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def fail(message: str) -> None:
    errors.append(message)


def is_local(ref: str) -> bool:
    if not ref or ref.startswith(('#', 'data:', 'mailto:', 'tel:', 'javascript:')):
        return False
    parsed = urlsplit(ref)
    return not parsed.scheme and not parsed.netloc

# 1) JavaScript syntax.
for path in sorted((ROOT / 'js').rglob('*.js')):
    result = subprocess.run(['node', '--check', str(path)], capture_output=True, text=True)
    if result.returncode:
        fail(f'JavaScript syntax error: {path.relative_to(ROOT)}\n{result.stderr}')

# 2) Local HTML references.
attr_pattern = re.compile(r'''(?:src|href)=["']([^"']+)["']''', re.I)
for html in sorted(ROOT.glob('*.html')):
    text = html.read_text(encoding='utf-8')
    for ref in attr_pattern.findall(text):
        if not is_local(ref):
            continue
        clean = urlsplit(ref).path
        if not clean or clean.endswith('/'):
            continue
        target = (html.parent / clean).resolve()
        try:
            target.relative_to(ROOT.resolve())
        except ValueError:
            fail(f'Path escapes project root: {html.name} -> {ref}')
            continue
        if not target.exists():
            fail(f'Missing local file: {html.name} -> {ref}')

# 3) Production security assertions.
admin_html = (ROOT / 'admin-updates.html').read_text(encoding='utf-8')
if re.search(r'<script[^>]+(?:supabase|admin-updates)', admin_html, re.I):
    fail('Disabled admin page still loads Supabase/admin scripts.')
if '<form' in admin_html.lower():
    fail('Disabled admin page still exposes a login/editor form.')
if (ROOT / 'supabase/config.js').exists():
    fail('supabase/config.js must not be committed in the production bundle.')
if not (ROOT / 'supabase/config.example.js').exists():
    fail('Missing Supabase config example.')

admin_js = (ROOT / 'js/pages/admin-updates.js').read_text(encoding='utf-8')
updates_js = (ROOT / 'js/pages/updates.js').read_text(encoding='utf-8')
for name, text in [('admin-updates.js', admin_js), ('updates.js', updates_js)]:
    if "select('*')" in text or 'select("*")' in text:
        fail(f'Unbounded/sensitive select(*) remains in {name}.')
    if re.search(r'onclick\s*=', text, re.I):
        fail(f'Inline click handler remains in {name}.')
if 'persistSession: false' not in admin_js:
    fail('Admin auth session is not explicitly memory-only.')
if 'createSignedUrl' not in admin_js or 'createSignedUrl' not in updates_js:
    fail('Private media signed URL flow is incomplete.')

# 4) Version/cache consistency.
site_config = (ROOT / 'js/core/site-config.js').read_text(encoding='utf-8')
version_match = re.search(r"version:\s*'([^']+)'", site_config)
if not version_match:
    fail('Site config version is missing or unreadable.')
expected_version = version_match.group(1)
for html in sorted(ROOT.glob('*.html')):
    text = html.read_text(encoding='utf-8')
    for ref in attr_pattern.findall(text):
        clean_path = urlsplit(ref).path.lower()
        if is_local(ref) and clean_path.endswith(('.css', '.js')) and f'v={expected_version}' not in ref:
            fail(f'Local runtime asset has a missing or mismatched cache version: {html.name} -> {ref}')

# 5) Runtime filenames must stay version-neutral.
for legacy in ('css/production-v6.css', 'css/home-motion-v6-1.css', 'js/pages/home-motion-v6-1.js'):
    if (ROOT / legacy).exists():
        fail(f'Legacy versioned runtime filename remains: {legacy}')
for required in ('css/theme.css', 'css/pages/home-motion.css', 'js/pages/home-motion.js'):
    if not (ROOT / required).exists():
        fail(f'Missing version-neutral runtime file: {required}')

# 6) Paused pages stay out of sitemap.
sitemap = (ROOT / 'sitemap.xml').read_text(encoding='utf-8')
for paused in ('updates.html', 'shipping-returns.html', 'admin-updates.html'):
    if paused in sitemap:
        fail(f'Paused page appears in sitemap: {paused}')

if errors:
    print('\n'.join(f'FAIL: {item}' for item in errors))
    sys.exit(1)
print('PASS: JavaScript syntax, local references, paused admin surface, versioning, and core security assertions.')
