#!/usr/bin/env python3
"""Generate profile stat cards (light/dark SVGs) in assets/ from the GitHub API.

Needs GITHUB_TOKEN in the environment; the default Actions token is enough
since only public data is queried.
"""

import json
import os
import pathlib
import urllib.request

USER = "kriuchkov"
TITLE_NAME = "Nikita's"
OUT_DIR = pathlib.Path(__file__).resolve().parent.parent / "assets"

WIDTH, HEIGHT = 420, 165
FONTS = "'Segoe UI', system-ui, -apple-system, Ubuntu, sans-serif"

THEMES = {
    "light": {"title": "#0969da", "text": "#24292f", "icon": "#0969da"},
    "dark": {"title": "#4493f8", "text": "#c9d1d9", "icon": "#4493f8"},
}

# Octicons (16x16): star, git-commit, git-pull-request, repo
ICONS = {
    "stars": "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z",
    "commits": "M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5ZM10.5 7.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z",
    "prs": "M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z",
    "contrib": "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z",
}

QUERY = """
query {
  user(login: "%s") {
    pullRequests { totalCount }
    repositoriesContributedTo(contributionTypes: [COMMIT, PULL_REQUEST]) { totalCount }
    contributionsCollection { totalCommitContributions }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        languages(first: 10) { edges { size node { name color } } }
      }
    }
  }
}
""" % USER


def fetch():
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=json.dumps({"query": QUERY}).encode(),
        headers={
            "Authorization": f"bearer {os.environ['GITHUB_TOKEN']}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req) as resp:
        payload = json.loads(resp.read())
    if payload.get("errors"):
        raise SystemExit(f"GraphQL errors: {payload['errors']}")
    return payload["data"]["user"]


def fmt(n):
    return f"{n:,}".replace(",", " ")


def stats_card(rows, theme):
    c = THEMES[theme]
    y = 62
    body = []
    for key, label, value in rows:
        body.append(
            f'<g transform="translate(24 {y - 12})"><path fill="{c["icon"]}" d="{ICONS[key]}"/></g>'
            f'<text x="52" y="{y}" font-size="14" fill="{c["text"]}">{label}</text>'
            f'<text x="{WIDTH - 24}" y="{y}" font-size="14" font-weight="600" text-anchor="end" '
            f'fill="{c["text"]}" style="font-variant-numeric: tabular-nums">{value}</text>'
        )
        y += 27
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" '
        f'viewBox="0 0 {WIDTH} {HEIGHT}" font-family="{FONTS}" role="img" aria-label="GitHub stats">'
        f'<text x="24" y="34" font-size="17" font-weight="600" fill="{c["title"]}">'
        f"{TITLE_NAME} GitHub Stats</text>" + "".join(body) + "</svg>"
    )


def langs_card(langs, theme):
    c = THEMES[theme]
    bar_x, bar_y, bar_w, bar_h = 24, 50, WIDTH - 48, 10
    total = sum(size for _, size, _ in langs) or 1
    segments, x = [], bar_x
    for name, size, color in langs:
        w = size / total * bar_w
        segments.append(f'<rect x="{x:.1f}" y="{bar_y}" width="{w:.1f}" height="{bar_h}" fill="{color}"/>')
        x += w
    legend = []
    for i, (name, size, color) in enumerate(langs):
        col, row = divmod(i, (len(langs) + 1) // 2)
        lx = 24 + col * ((WIDTH - 48) // 2)
        ly = 88 + row * 23
        pct = size / total * 100
        legend.append(
            f'<circle cx="{lx + 5}" cy="{ly - 4}" r="5" fill="{color}"/>'
            f'<text x="{lx + 18}" y="{ly}" font-size="12.5" fill="{c["text"]}">{name} {pct:.1f}%</text>'
        )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" '
        f'viewBox="0 0 {WIDTH} {HEIGHT}" font-family="{FONTS}" role="img" aria-label="Most used languages">'
        f'<text x="24" y="34" font-size="17" font-weight="600" fill="{c["title"]}">Most Used Languages</text>'
        f'<clipPath id="bar"><rect x="{bar_x}" y="{bar_y}" width="{bar_w}" height="{bar_h}" rx="5"/></clipPath>'
        f'<g clip-path="url(#bar)">' + "".join(segments) + "</g>" + "".join(legend) + "</svg>"
    )


def main():
    user = fetch()
    repos = user["repositories"]
    if repos["totalCount"] > 100:
        print(f"warning: only first 100 of {repos['totalCount']} repos counted")

    rows = [
        ("stars", "Total Stars Earned", fmt(sum(r["stargazerCount"] for r in repos["nodes"]))),
        ("commits", "Commits (last year)", fmt(user["contributionsCollection"]["totalCommitContributions"])),
        ("prs", "Total PRs", fmt(user["pullRequests"]["totalCount"])),
        ("contrib", "Contributed to", fmt(user["repositoriesContributedTo"]["totalCount"])),
    ]

    sizes, colors = {}, {}
    for repo in repos["nodes"]:
        for edge in repo["languages"]["edges"]:
            name = edge["node"]["name"]
            sizes[name] = sizes.get(name, 0) + edge["size"]
            colors[name] = edge["node"]["color"] or "#8b949e"
    langs = sorted(sizes.items(), key=lambda kv: (-kv[1], kv[0]))[:6]
    langs = [(name, size, colors[name]) for name, size in langs]

    OUT_DIR.mkdir(exist_ok=True)
    for theme in THEMES:
        (OUT_DIR / f"stats-{theme}.svg").write_text(stats_card(rows, theme) + "\n")
        (OUT_DIR / f"langs-{theme}.svg").write_text(langs_card(langs, theme) + "\n")
    print(f"wrote 4 cards to {OUT_DIR}")


if __name__ == "__main__":
    main()
