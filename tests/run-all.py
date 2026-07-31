#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMMANDS = [
    [sys.executable, str(ROOT / 'tests' / 'static-smoke.py')],
    ['node', str(ROOT / 'tests' / 'study-backup-smoke.cjs')],
    ['node', str(ROOT / 'tests' / 'content-integrity.cjs')],
]

for command in COMMANDS:
    result = subprocess.run(command, cwd=ROOT)
    if result.returncode:
        raise SystemExit(result.returncode)

print('PASS: all Derma-Maze checks completed successfully.')
