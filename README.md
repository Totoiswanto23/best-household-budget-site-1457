# NusaBudget — Anggaran Rumah Tangga Indonesia

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Totoiswanto23/best-household-budget-site-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Totoiswanto23/best-household-budget-site-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A household budget site for Indonesia — an entry for make.fun's
[Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457)
bounty ($50, top 10 share $5 each).

## What it is

**NusaBudget** helps an Indonesian household plan its monthly money with real
national figures from Statistics Indonesia (BPS, Susenas) and working tools.
No network requests, no build step — plain static files under `app/`,
hand-drawn SVG charts, system fonts only.

- **Beranda (Dashboard)** — headline figures for Susenas March 2026 (average
  spending Rp1,657,281 per person per month, food 49.8%, non-food 50.2%),
  food vs non-food donut, biggest spending categories, links to every tool.
- **Kalkulator** — a working budget calculator: monthly income vs expenses,
  add/remove expense rows, live 50/30/20 breakdown, surplus/deficit verdict.
- **Rincian Belanja** — the full BPS commodity breakdown (March 2026) in tables
  and bar charts, plus the March 2024 comparison and the Jakarta contrast.
- **Tabungan** — a savings-goal planner: target, amount saved, monthly saving,
  months to reach it and the finish date, with ready-made presets.
- **Panduan** — the 50/30/20 rule explained, three example household budget
  templates (clearly labelled as examples), and six practical saving tips.
- **Sumber** — every BPS publication behind every figure, plus reading notes.

## Run

Open `app/index.html` in a browser, or serve `app/` with any static server:

```sh
python3 -m http.server --directory app 8080
```

## Hand-in

`main.ts` (Node 22) copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of the site (desktop 1280×800
and phone 390×844), taken with headless Chromium.

## License

MIT — see [LICENSE](LICENSE).
