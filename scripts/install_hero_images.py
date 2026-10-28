#!/usr/bin/env python3
"""Install six AI-generated showcase images separately from product photographs."""
from pathlib import Path
import zipfile
import sys

archive=Path("smart-rental-hero-images-ready.zip")
destination=Path("assets/hero")
required={"rolls-royce-cullinan.webp","bentley-bentayga.webp","lamborghini-urus.webp","ferrari-f8.webp","porsche-911.webp","mercedes-g63.webp"}
if not archive.is_file():raise SystemExit("Expected hero ZIP in repository root")
with zipfile.ZipFile(archive) as z:
    names={n for n in z.namelist() if not n.endswith("/")}
    if names!=required:raise SystemExit(f"Expected these 6 files: {sorted(required)}; got {sorted(names)}")
    data={}
    for n in names:
        if Path(n).name!=n:raise SystemExit("Unexpected nested path")
        b=z.read(n)
        if len(b)>1_000_000 or b[:4]!=b"RIFF" or b[8:12]!=b"WEBP":
            raise SystemExit(f"Invalid WebP: {n}")
        data[n]=b
destination.mkdir(parents=True,exist_ok=True)
for name,b in data.items():
    (destination/name).write_bytes(b)
    print(f"Installed {name}: {len(b)} bytes")
print("Installed six AI showcase images; original vehicle photos untouched")
