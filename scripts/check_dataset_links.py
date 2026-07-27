#!/usr/bin/env python3
"""Health-check the dataset source links in data/datasets.yml.

Most ``format`` URLs point at stable publisher pages (ACM / IEEE / Springer /
CVF / AAAI author kits) and never break. A few point at edition-specific pages
(e.g. an SDM 2026 submissions page) that 404 once the cycle rolls over. This
script pings every ``format`` URL and, when one is dead, opens a GitHub Issue
(label ``dataset-check``) listing the broken links — so the "update formats
yearly" chore becomes reactive: you only touch a link when it actually breaks.

Runs weekly in the same GitHub Action as the deadline sync. Read-only on the
data; the only side effect is opening an issue. Requires: requests, ruamel.yaml.
GITHUB_TOKEN + GITHUB_REPOSITORY enable issue creation; without them it prints.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import requests
import urllib3
from ruamel.yaml import YAML

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "datasets.yml"
UA = {"User-Agent": ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                     "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")}


def is_dead(url: str) -> tuple[bool, str]:
    """Return (dead, reason). Tries HEAD then GET; tolerates servers that block HEAD."""
    for method in ("head", "get"):
        try:
            r = requests.request(method, url, headers=UA, timeout=30,
                                 allow_redirects=True, stream=(method == "get"), verify=False)
            code = r.status_code
            if method == "get":
                r.close()
            if code < 400:
                return False, f"{code}"
            if code in (403, 405, 406, 415, 418) and method == "head":
                continue  # some hosts block HEAD / bots — retry with GET
            if code in (401, 403, 406, 415, 418, 429) or 500 <= code <= 599:
                # bot/rate-limit/WAF walls (415 = content-negotiation reject on GET) +
                # transient gateway errors (502/503/504) aren't "dead"
                return False, f"{code} (wall, assumed alive)"
            return True, f"HTTP {code}"
        except requests.exceptions.SSLError:
            return False, "SSL cert issue (assumed alive)"  # cert ≠ gone
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            # connection reset/refused/timeout: some hosts drop non-browser clients at
            # the socket level, which is a wall, not a 404. Don't cry wolf.
            if method == "get":
                return False, f"{type(e).__name__} (assumed alive)"
            continue
        except requests.RequestException as e:
            if method == "get":
                return True, type(e).__name__
            continue
    return True, "unreachable"


def open_issue(dead: list[dict]) -> None:
    token = os.environ.get("GITHUB_TOKEN")
    repo = os.environ.get("GITHUB_REPOSITORY")
    title = f"Dead dataset links: {len(dead)} need updating"
    body = (
        "The weekly link check found broken dataset source links in "
        "`data/datasets.yml`. Update the `link` field for each:\n\n"
        + "\n".join(f"- **{d['id']}** ({d['name']}): {d['reason']}\n  {d['link']}" for d in dead)
        + "\n\nMost breakages happen when a venue's edition-specific page rolls "
          "over — point the link at the next cycle's page or a stable publisher template."
    )
    if not (token and repo):
        print("  (no GITHUB_TOKEN/REPOSITORY — printing instead of opening issue)\n")
        print(body)
        return
    api = f"https://api.github.com/repos/{repo}"
    hdrs = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}
    q = requests.get(f"{api}/issues", headers=hdrs,
                     params={"state": "open", "labels": "dataset-check"}, timeout=30)
    if q.ok and any(i["title"].startswith("Dead dataset links") for i in q.json()):
        print("  dataset-check issue already open — skipping")
        return
    r = requests.post(f"{api}/issues", headers=hdrs, timeout=30,
                      json={"title": title, "body": body, "labels": ["dataset-check"]})
    print(f"  issue {'created' if r.ok else 'FAILED ' + str(r.status_code)}")


def main() -> int:
    yaml = YAML()
    docs = yaml.load(DATA.read_text())
    dead = []
    for c in docs:
        url = c.get("link")
        if not url:
            continue
        bad, reason = is_dead(str(url))
        flag = "DEAD" if bad else "ok"
        print(f"  [{flag}] {c['id']:<13} {reason:<22} {url}")
        if bad:
            dead.append({"id": c["id"], "name": c["name"], "link": url, "reason": reason})

    if dead:
        print(f"\n{len(dead)} dead dataset link(s):")
        open_issue(dead)
    else:
        print("\nAll dataset links healthy.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
