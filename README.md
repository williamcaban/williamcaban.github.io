# williamcaban.github.io

Source for [williamcaban.github.io](https://williamcaban.github.io) — William Caban's site for AI safety, security, and evaluation research, analysis, and writing.

**[English](./README.md) | [简体中文](./README.zh-CN.md)**

## Sections

- **[Daily Briefing](https://williamcaban.github.io/news)** — automated daily AI safety & trends briefing, generated and published by a scheduled agent job (`reports/`, synced into `src/content/blog/` at build time).
- **[Weekly AI Safety Briefing](https://williamcaban.github.io/pm-briefing)** — a weekly briefing for product/engineering leaders, synthesized from that week's daily reports (`reports/weekly-pm/`, synced into `src/content/weekly-pm/`).
- **[Publications](https://williamcaban.github.io/publications)** — papers, imported from `citations.bib` via the BibTeX import pipeline.
- **[Writing](https://williamcaban.github.io/writing)** — long-form posts, migrated from the shift.zone/Medium blog with original publish dates preserved (`src/content/writing/`).

## Stack

Astro 5 + Tailwind + Pagefind search, built on the [Scholar-Lite](https://github.com/fjd2004711/scholar-lite) template. i18n support across 8 languages via `src/i18n/ui.ts`.

## Development

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # sync content, import BibTeX, build, and index search
```

## Content

- `src/content/blog/`, `src/content/weekly-pm/` — gitignored, regenerated at build time from `reports/` by the pipeline scripts in `scripts/`. Don't edit these directly.
- `src/content/writing/`, `src/content/publications/` — committed content, edited directly as Markdown.
- `src/content.config.ts` — collection schemas.
- `src/config.ts` — site metadata and navigation.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.
