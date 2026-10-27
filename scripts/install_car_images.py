#!/usr/bin/env python3
"""Safely install Smart Rental's approved car photographs from a root-level ZIP.
Requires Python 3 standard library only. Does not modify pricing or booking logic.
"""
from pathlib import Path
import re, sys, zipfile

zip_path=Path(sys.argv[1] if len(sys.argv)>1 else 'smart-rental-car-images-ready.zip')
asset_dir=Path(sys.argv[2] if len(sys.argv)>2 else 'assets')
if not zip_path.is_file():
    print("Image archive not found, nothing to import.");sys.exit(0)
fleet=Path("fleet-data.js").read_text(encoding="utf-8")
allowed={m+'.webp' for m in re.findall(r"\['[^']+',(?:null|\d+),'[^']+','([^']+)'\]",fleet)}
if len(allowed)<50:raise RuntimeError("Failed to load expected vehicle slugs from fleet-data.js")
asset_dir.mkdir(parents=True,exist_ok=True)
installed=set()
with zipfile.ZipFile(zip_path) as z:
    entries=[n for n in z.namelist() if not n.endswith('/')]
    if len(entries)>100:raise RuntimeError("Unexpected image archive contents")
    for n in entries:
        base=Path(n).name.lower()
        if base not in allowed:raise RuntimeError(f"Unexpected file: {base}")
        b=z.read(n)
        if len(b)>3_000_000 or not(b[:4]==b'RIFF' and b[8:12]==b'WEBP'):
            raise RuntimeError(f"Not a valid WebP file: {base}")
        (asset_dir/base).write_bytes(b)
        installed.add(base)
missing=sorted(allowed-installed)
print(f"Installed {len(installed)} photographs in {asset_dir}")
print("Not supplied: "+", ".join(missing))
