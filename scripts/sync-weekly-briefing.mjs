// scripts/sync-weekly-briefing.mjs
// Syncs every markdown file in reports/weekly-pm/ into the weeklyPmBriefing
// collection that powers the PM Briefing section. Run via `npm run sync`
// (also part of dev/build). Mirrors scripts/sync-reports.mjs's daily-report
// pipeline — see that file for the reasoning behind each transform.
import { readdir, readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SRC_DIR = 'reports/weekly-pm';
const OUT_DIR = 'src/content/weekly-pm';

const MARKDOWN_RE = /\.(md|mdx)$/i;
const FILENAME_DATE_RE = /(\d{4}-\d{2}-\d{2})/;

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.valueOf());
}

// Format a Date using its local calendar day (for mtimes and prose dates,
// which are parsed in local time).
function localYMD(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Resolve the post date as a YYYY-MM-DD string, in order of preference:
// frontmatter `date` > YYYY-MM-DD in the filename > date in the H1 > file mtime.
async function resolveDate(data, file, firstHeading) {
  if (data.date) {
    // YAML parses bare dates into Date objects at UTC midnight
    if (isValidDate(data.date)) return data.date.toISOString().split('T')[0];
    const asString = String(data.date);
    const ymd = asString.match(FILENAME_DATE_RE)?.[1];
    if (ymd) return ymd;
    const d = new Date(asString);
    if (isValidDate(d)) return localYMD(d);
    console.warn(`  ! Ignoring unparseable frontmatter date "${asString}" in ${file}`);
  }

  const fromName = file.match(FILENAME_DATE_RE)?.[1];
  if (fromName) return fromName;

  if (firstHeading) {
    // e.g. "Weekly AI Safety & Evals Briefing — Week of July 21, 2026" -> tail
    const tail = firstHeading.split(/[:—–]\s*/).pop();
    const d = new Date(tail);
    if (isValidDate(d)) return localYMD(d);
  }

  return localYMD((await stat(path.join(SRC_DIR, file))).mtime);
}

// Loose comparison for "is this heading just the title again?" — case,
// whitespace, and dash-style shouldn't cause a false negative.
function normalizeHeading(s) {
  return s.trim().toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ');
}

function toSlug(file) {
  return file
    .replace(MARKDOWN_RE, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.log(`No ${SRC_DIR}/ directory found, skipping sync.`);
    return;
  }

  // Clean output dir so removed/renamed reports don't linger as stale pages
  if (existsSync(OUT_DIR)) await rm(OUT_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });

  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  const skipped = entries.filter(e => e.isFile() && !MARKDOWN_RE.test(e.name)).map(e => e.name);
  const files = entries.filter(e => e.isFile() && MARKDOWN_RE.test(e.name)).map(e => e.name);

  const seen = new Map();

  for (const file of files) {
    const raw = await readFile(path.join(SRC_DIR, file), 'utf-8');
    let { data, content } = matter(raw);

    const firstHeading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const dateStr = await resolveDate(data, file, firstHeading);
    const title = data.title || firstHeading || `Weekly AI Safety & Evals Briefing — ${dateStr}`;

    // Drop a leading H1 that just repeats the title (see sync-reports.mjs for
    // why this also strips a leading "---" divider immediately after it).
    if (firstHeading && normalizeHeading(firstHeading) === normalizeHeading(title)) {
      content = content.replace(/^#\s+.+$/m, '').replace(/^\s+/, '');
      content = content.replace(/^-{3,}\s*\n+/, '');
    }

    // Link arXiv references: "arXiv:2607.02514" -> https://arxiv.org/pdf/2607.02514
    // (skipped when the reference is already the text of a markdown link)
    content = content.replace(
      /\barXiv:(\d{4}\.\d{4,5}(?:v\d+)?)(?!\]\()/gi,
      (m, id) => `[${m}](https://arxiv.org/pdf/${id})`
    );

    let slug = toSlug(file) || dateStr;
    if (seen.has(slug)) {
      console.warn(`  ! Slug collision: ${file} and ${seen.get(slug)} both map to "${slug}"`);
      let i = 2;
      while (seen.has(`${slug}-${i}`)) i++;
      slug = `${slug}-${i}`;
    }
    seen.set(slug, file);

    const frontmatter = {
      title,
      date: dateStr,
      description: data.description || '',
      tags: data.tags || ['ai-safety-pm', 'evals'],
      draft: data.draft ?? false,
    };
    if (data.weekOf) frontmatter.weekOf = data.weekOf;

    const output = matter.stringify(content, frontmatter);
    await writeFile(path.join(OUT_DIR, `${slug}.md`), output, 'utf-8');
    console.log(`  ✓ ${file} -> ${slug}.md (${dateStr}: ${title})`);
  }

  for (const file of skipped) {
    console.warn(`  ! Skipped ${file} (not a markdown file)`);
  }

  console.log(`Synced ${files.length} weekly briefing(s) into ${OUT_DIR}/`);
}

main().catch(err => {
  console.error('Weekly briefing sync failed:', err);
  process.exit(1);
});
