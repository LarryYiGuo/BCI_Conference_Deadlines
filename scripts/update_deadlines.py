#!/usr/bin/env python3
"""Sync conference deadlines from the ccfddl/ccf-deadlines dataset.

For every entry in data/conferences.yml that carries a `ccfddl` key (the
base filename in the ccfddl repo, e.g. ``nips`` or ``sigkdd``), fetch the
upstream data and:

* entries are only touched when they are *stale*: ``estimated: true``,
  ``deadline: TBD``, or the recorded deadline has already passed.
  Manually verified dates (``estimated: false``) are protected — community
  datasets are occasionally off by a day (e.g. AAAI-27, WACV-27);
* if an upcoming deadline exists upstream -> update year/link/deadline/
  abstract_deadline/timezone/date/place/track and clear ``estimated``;
* if every known deadline has passed -> set ``deadline: TBD`` and mark
  ``estimated: true`` (i.e. wait for the next CFP to be announced upstream).

Conferences without a ``ccfddl`` key (SfN, OHBM, EMBC, NER, BCI Meeting,
ACII, ISBI, ...) are left untouched and stay manually maintained.

Designed to run inside GitHub Actions (see .github/workflows/update-deadlines.yml).
Requires: requests, ruamel.yaml
"""

from __future__ import annotations

import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests
from ruamel.yaml import YAML

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "conferences.yml"
RAW = "https://raw.githubusercontent.com/ccfddl/ccf-deadlines/main/conference/{cat}/{name}.yml"
CATS = ["AI", "DB", "CG", "MX", "HI", "NW", "SC", "SE", "CT"]

yaml = YAML()
yaml.preserve_quotes = True
yaml.width = 4096


def tz_to_offset(tz_label: str) -> str:
    """'AoE' -> '-12:00', 'UTC-12' -> '-12:00', 'UTC+8' -> '+08:00'."""
    if not tz_label or tz_label.strip().upper() == "AOE":
        return "-12:00"
    m = re.match(r"UTC([+-])(\d{1,2})(?::?(\d{2}))?", tz_label.strip(), re.I)
    if not m:
        return "-12:00"
    sign, hh, mm = m.group(1), int(m.group(2)), m.group(3) or "00"
    return f"{sign}{hh:02d}:{mm}"


def parse_dt(s: str, tz_label: str) -> datetime | None:
    """ccfddl 'YYYY-MM-DD HH:MM:SS' (+ timezone label) -> aware datetime."""
    s = (s or "").strip()
    if not s or s.upper() == "TBD":
        return None
    off = tz_to_offset(tz_label)
    sign = 1 if off[0] == "+" else -1
    h, m = off[1:].split(":")
    delta = timezone(sign * timedelta(hours=int(h), minutes=int(m)))
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt).replace(tzinfo=delta)
        except ValueError:
            continue
    return None


_cache: dict[str, list | None] = {}


def fetch_ccfddl(name: str) -> list | None:
    if name in _cache:
        return _cache[name]
    for cat in CATS:
        r = requests.get(RAW.format(cat=cat, name=name), timeout=30)
        if r.status_code == 200:
            _cache[name] = yaml.load(r.text)
            return _cache[name]
    _cache[name] = None
    return _cache[name]


def best_upcoming(entry: dict, now: datetime):
    """Return (cycle, timeline_item, deadline_dt) of the earliest upcoming deadline."""
    best = None
    for cyc in entry.get("confs", []):
        tz_label = str(cyc.get("timezone", "AoE"))
        for item in cyc.get("timeline", []):
            dl = parse_dt(str(item.get("deadline", "")), tz_label)
            if dl and dl > now and (best is None or dl < best[2]):
                best = (cyc, item, dl)
    return best


def fmt(dt_str: str) -> str:
    """'2026-07-28 23:59:59' -> '2026-07-28 23:59'."""
    return re.sub(r":\d{2}$", "", dt_str.strip())


def main() -> int:
    now = datetime.now(timezone.utc)
    docs = yaml.load(DATA.read_text())
    changed = []

    for c in docs:
        name = c.get("ccfddl")
        if not name:
            continue

        # protect manually verified, still-valid entries
        our_dl = parse_dt(str(c.get("deadline", "TBD")), c.get("tz_label", "AoE"))
        stale = bool(c.get("estimated")) or c.get("deadline") == "TBD" or (our_dl is not None and our_dl < now)

        data = fetch_ccfddl(str(name))
        if not data:
            print(f"  [skip] {c['id']}: ccfddl file '{name}' not found")
            continue
        entry = data[0]

        hit = best_upcoming(entry, now) if stale else None
        if hit:
            cyc, item, _dl = hit
            tz_label = str(cyc.get("timezone", "AoE"))
            updates = {
                "year": cyc.get("year", c["year"]),
                "link": cyc.get("link", c["link"]),
                "deadline": fmt(str(item["deadline"])),
                "abstract_deadline": fmt(str(item["abstract_deadline"])) if item.get("abstract_deadline") else None,
                "tz": tz_to_offset(tz_label),
                "tz_label": "AoE" if tz_label.upper() == "AOE" else tz_label,
                "date": str(cyc.get("date", c["date"])),
                "place": str(cyc.get("place", c["place"])),
                "track": str(item["comment"]) if item.get("comment") else None,
                "estimated": False,
            }
            if any(c.get(k) != v for k, v in updates.items()):
                c.update(updates)
                changed.append(f"{c['id']} -> {updates['deadline']} {updates['tz_label']}")
        elif our_dl is not None and our_dl < now:
            # our deadline passed and upstream has nothing newer: wait for the
            # next CFP. (A future *estimated* deadline is kept as-is.)
            if c.get("deadline") != "TBD":
                c["deadline"] = "TBD"
                c["abstract_deadline"] = None
                c["track"] = None
                c["estimated"] = True
                changed.append(f"{c['id']} -> TBD (cycle closed, waiting for next CFP)")

        # bonus: cross-check CORE rank from ccfddl
        core = (entry.get("rank") or {}).get("core")
        if core and c.get("core") != core:
            c["core"] = core
            changed.append(f"{c['id']} core -> {core}")

    if changed:
        yaml.dump(docs, DATA.open("w"))
        print("Updated:")
        for line in changed:
            print("  " + line)
    else:
        print("No changes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
