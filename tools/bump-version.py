#!/usr/bin/env python3
"""Update the Derma-Maze release number and static cache-busting query strings."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION_RE = re.compile(r"^\d+\.\d+\.\d+$")
TEXT_SUFFIXES = {'.html', '.js', '.txt'}


def current_version() -> str:
    text = (ROOT / 'js/core/site-config.js').read_text(encoding='utf-8')
    match = re.search(r"version:\s*'([^']+)'", text)
    if not match:
        raise SystemExit('Could not find DM_SITE_CONFIG.version.')
    return match.group(1)


def candidate_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob('*'):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if 'docs' in path.parts or 'tests' in path.parts or 'tools' in path.parts:
            continue
        files.append(path)
    return sorted(files)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('version', help='New semantic version, for example 6.4.0')
    parser.add_argument('--dry-run', action='store_true', help='Show files without writing changes')
    args = parser.parse_args()

    if not VERSION_RE.fullmatch(args.version):
        raise SystemExit('Version must use x.y.z format.')

    old = current_version()
    if old == args.version:
        print(f'Already on {old}.')
        return

    changed: list[Path] = []
    for path in candidate_files():
        text = path.read_text(encoding='utf-8')
        updated = text.replace(old, args.version)
        if updated != text:
            changed.append(path)
            if not args.dry_run:
                path.write_text(updated, encoding='utf-8')

    mode = 'Would update' if args.dry_run else 'Updated'
    print(f'{mode} {len(changed)} files: {old} -> {args.version}')
    for path in changed:
        print(f'  {path.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
