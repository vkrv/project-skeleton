#!/usr/bin/env node
/**
 * Deterministic AI-harness self-check. Node stdlib only.
 *
 *   node scripts/check-harness.mjs
 *   HARNESS_MODE=product node scripts/check-harness.mjs
 *   node scripts/check-harness.mjs --self-test
 *
 * Default (template) mode allows bootstrap placeholders.
 * Product mode fails if those placeholders remain. Unadopted packs under
 * `profiles/` are skipped (catalog); adopted copies in `.cursor/rules/` are
 * still scanned. ALL-CAPS `{{TOKEN}}` only: JSX/style object literals and
 * GitHub Actions `${{ }}` expressions are ignored.
 *
 * Also checks Agent Skills under .agents/skills (frontmatter, slug, RULES-INDEX)
 * and that .claude/skills is a symlink to that folder. ExecPlan files under
 * docs/plan/exec/ (except _template.md and README.md) must include every
 * mandatory section heading from docs/plan/PLANS.md.
 *
 * Project memory lives in docs/ai-harness/MEMORY.md and
 * docs/ai-harness/memory/*.md (Standing heading; dated entries newest-first).
 * EVOLUTION-LOG date order remains non-decreasing. Memory checks are
 * standalone functions, separate from product-mode placeholder scanning.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODE = (process.env.HARNESS_MODE ?? "template").toLowerCase();
const AGENTS_WARN_LINES = 200;
const AGENTS_ERROR_BYTES = 32 * 1024;
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".turbo",
  "coverage",
  ".next",
  ".cache",
  ".pnpm-store",
]);
const PLACEHOLDER_EXT = new Set([
  ".md",
  ".mdc",
  ".json",
  ".yml",
  ".yaml",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".html",
  ".css",
]);

const errors = [];
const warnings = [];

function rel(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

function error(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function read(abs) {
  return fs.readFileSync(abs, "utf8").replace(/\r\n/g, "\n");
}

function walk(dir, pred, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(abs, pred, acc);
    } else if (pred(abs, ent.name)) {
      acc.push(abs);
    }
  }
  return acc;
}

function mdcFiles() {
  return [
    ...walk(path.join(ROOT, ".cursor", "rules"), (abs) => abs.endsWith(".mdc")),
    ...walk(path.join(ROOT, "profiles"), (abs) => abs.endsWith(".mdc")),
  ];
}

function skillFiles() {
  return walk(
    path.join(ROOT, ".agents", "skills"),
    (abs, name) => name === "SKILL.md",
  );
}

function listedSkillPaths(indexText) {
  const listed = new Set();
  const re =
    /\.agents\/skills\/([a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*)/g;
  for (const m of indexText.matchAll(re)) {
    listed.add(m[1].replace(/\/SKILL\.md$/, "").replace(/\/$/, ""));
  }
  return listed;
}

function listedMdcNames(indexText) {
  const listed = new Set();
  const consider = (raw) => {
    const item = raw.trim().replace(/^\.\//, "").split("#")[0];
    // Skip globs used as category labels (e.g. `.cursor/rules/*.mdc`).
    if (!item || /[*?]/.test(item)) return;
    listed.add(item);
  };
  for (const m of indexText.matchAll(/`([^`\n]+\.mdc)`/g)) consider(m[1]);
  for (const m of indexText.matchAll(/\[[^\]]*\]\(([^)\s]+\.mdc)/g)) {
    consider(m[1]);
  }
  return listed;
}

function checkRulesIndex() {
  const indexAbs = path.join(ROOT, "docs", "ai-harness", "RULES-INDEX.md");
  if (!fs.existsSync(indexAbs)) {
    error("docs/ai-harness/RULES-INDEX.md is missing");
    return;
  }
  const listed = listedMdcNames(read(indexAbs));
  const files = mdcFiles();
  const diskBasenames = new Set(files.map((f) => path.basename(f)));
  const diskPaths = new Set(files.map(rel));

  for (const abs of files) {
    const posix = rel(abs);
    const base = path.basename(abs);
    const hit =
      listed.has(posix) ||
      listed.has(base) ||
      [...listed].some((item) => item === posix || item.endsWith(`/${base}`));
    if (!hit) {
      error(`${posix} is not listed in docs/ai-harness/RULES-INDEX.md`);
    }
  }

  for (const item of listed) {
    const base = path.posix.basename(item);
    if (item.includes("/")) {
      const fromRoot = path.resolve(ROOT, item);
      const fromIndex = path.resolve(path.dirname(indexAbs), item);
      if (!fs.existsSync(fromRoot) && !fs.existsSync(fromIndex)) {
        error(`RULES-INDEX lists missing file: ${item}`);
      }
    } else if (!diskBasenames.has(base) && !diskPaths.has(item)) {
      error(`RULES-INDEX lists missing file: ${item}`);
    }
  }
}

function parseFrontmatter(content) {
  if (!content.startsWith("---")) return null;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return { closed: false, body: "" };
  return { closed: true, body: content.slice(3, end).trim() };
}

function fieldValue(fm, name) {
  const m = fm.match(new RegExp(`^${name}\\s*:\\s*(.*)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "");
}

function checkFrontmatter() {
  for (const abs of mdcFiles()) {
    const fm = parseFrontmatter(read(abs));
    const posix = rel(abs);
    if (!fm) {
      error(`${posix}: missing YAML frontmatter`);
      continue;
    }
    if (!fm.closed) {
      error(`${posix}: unclosed YAML frontmatter`);
      continue;
    }
    const description = fieldValue(fm.body, "description");
    const hasGlobs = /^globs\s*:/m.test(fm.body);
    const hasAlways = /^alwaysApply\s*:/m.test(fm.body);
    if (!description) {
      error(`${posix}: frontmatter needs a non-empty description`);
    }
    if (!hasGlobs && !hasAlways) {
      error(`${posix}: frontmatter needs globs or alwaysApply`);
    }
  }
}

function stripFences(src) {
  return src.replace(/```[\s\S]*?```/g, "\n");
}

function extractHrefs(markdown) {
  const hrefs = [];
  const re = /\[[^\]]*\]\((<[^>]+>|[^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)/g;
  let m;
  while ((m = re.exec(stripFences(markdown)))) {
    let href = m[1].trim();
    if (href.startsWith("<") && href.endsWith(">")) href = href.slice(1, -1);
    hrefs.push(href);
  }
  return hrefs;
}

function skipHref(href) {
  if (!href || href.startsWith("#")) return true;
  if (href.startsWith("//")) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return true;
  return false;
}

function insideRepo(abs) {
  const r = path.relative(ROOT, abs);
  return r === "" || (!r.startsWith("..") && !path.isAbsolute(r));
}

function checkLinks() {
  const files = [
    path.join(ROOT, "AGENTS.md"),
    path.join(ROOT, "BOOTSTRAP.md"),
    path.join(ROOT, "README.md"),
    path.join(ROOT, "CLAUDE.md"),
    ...walk(path.join(ROOT, "docs"), (abs) => abs.endsWith(".md")),
    ...walk(path.join(ROOT, "profiles"), (abs) => abs.endsWith(".md") || abs.endsWith(".mdc")),
    ...walk(path.join(ROOT, ".agents", "skills"), (abs) => abs.endsWith(".md")),
  ].filter((abs, i, arr) => fs.existsSync(abs) && arr.indexOf(abs) === i);

  for (const abs of files) {
    for (const href of extractHrefs(read(abs))) {
      if (skipHref(href)) continue;
      let decoded;
      try {
        decoded = decodeURIComponent(href.split("#")[0].split("?")[0]);
      } catch {
        error(`${rel(abs)}: malformed link ${href}`);
        continue;
      }
      if (!decoded) continue;
      const target = path.resolve(path.dirname(abs), decoded);
      if (!insideRepo(target)) {
        error(`${rel(abs)}: relative link escapes repo: ${href}`);
        continue;
      }
      if (!fs.existsSync(target)) {
        error(`${rel(abs)}: dead relative link ${href}`);
      }
    }
  }
}

function checkAgentsSize() {
  const abs = path.join(ROOT, "AGENTS.md");
  if (!fs.existsSync(abs)) {
    error("AGENTS.md is missing");
    return;
  }
  const stat = fs.statSync(abs);
  if (stat.size > AGENTS_ERROR_BYTES) {
    error(
      `AGENTS.md is ${stat.size} bytes; keep it under ${AGENTS_ERROR_BYTES} (32 KiB)`,
    );
  }
  const text = read(abs);
  const lines = text.split("\n");
  const lineCount = text.endsWith("\n") ? lines.length - 1 : lines.length;
  if (lineCount > AGENTS_WARN_LINES) {
    warn(
      `AGENTS.md has ${lineCount} lines (soft limit ${AGENTS_WARN_LINES}; hard limit 32 KiB)`,
    );
  }
}

function skipProductPlaceholderPath(posix) {
  if (posix === "scripts/check-harness.mjs") return true;
  // Unadopted packs are a catalog. adopt-profile copies `.mdc` files into
  // `.cursor/rules/` (same filenames); those copies stay in the scan.
  if (posix === "profiles" || posix.startsWith("profiles/")) return true;
  return false;
}

function matchBootstrapPlaceholders(text) {
  // ALL-CAPS bootstrap placeholders only. JSX/style `{ … }` / `{{ mt: 2 }}`
  // and GitHub Actions `${{ github.token }}` / `${{ secrets.X }}` do not match
  // (`{{` followed by A-Z then only A-Z, digits, underscore).
  return text.match(/\{\{[A-Z][A-Z0-9_]*\}\}/g);
}

function checkPlaceholders() {
  if (MODE !== "product") return;
  const files = walk(ROOT, (abs) => {
    const posix = rel(abs);
    const ext = path.extname(abs);
    if (!PLACEHOLDER_EXT.has(ext)) return false;
    if (skipProductPlaceholderPath(posix)) return false;
    return true;
  });
  for (const abs of files) {
    const hits = matchBootstrapPlaceholders(read(abs));
    if (!hits) continue;
    const uniq = [...new Set(hits)];
    error(
      `${rel(abs)}: leftover placeholder(s) in product mode: ${uniq.join(", ")}`,
    );
  }
}

function selfTestPlaceholders() {
  const failures = [];
  const fail = (msg) => failures.push(msg);

  if (
    !skipProductPlaceholderPath("profiles/git-submodule/160-git-submodule.mdc")
  ) {
    fail("profiles/*.mdc catalog paths must be skipped");
  }
  if (!skipProductPlaceholderPath("profiles/git-submodule/README.md")) {
    fail("profiles/** README catalog paths must be skipped");
  }
  if (skipProductPlaceholderPath("AGENTS.md")) {
    fail("core files must still be scanned");
  }
  if (skipProductPlaceholderPath(".cursor/rules/160-git-submodule.mdc")) {
    fail("adopted copies in .cursor/rules/ must still be scanned");
  }
  if (skipProductPlaceholderPath("docs/architecture/testing.md")) {
    fail("docs outside profiles/ must still be scanned");
  }

  const ignored = [
    "token: ${{ secrets.GH_PAT }}",
    "${{ github.token }}",
    "const style = { color: 'red' };",
    "<Box sx={{ mt: 2 }} />",
  ];
  for (const sample of ignored) {
    const hits = matchBootstrapPlaceholders(sample);
    if (hits) {
      fail(`false positive ${hits.join(", ")} in ${JSON.stringify(sample)}`);
    }
  }

  const leftover = "Product {{PROJECT_NAME}} app {{PRIMARY_APP}}";
  const leftoverHits = matchBootstrapPlaceholders(leftover) ?? [];
  if (
    !leftoverHits.includes("{{PROJECT_NAME}}") ||
    !leftoverHits.includes("{{PRIMARY_APP}}")
  ) {
    fail("ALL-CAPS bootstrap tokens in core text must still match");
  }

  const submodule = path.join(
    ROOT,
    "profiles",
    "git-submodule",
    "160-git-submodule.mdc",
  );
  if (fs.existsSync(submodule)) {
    const posix = rel(submodule);
    if (!skipProductPlaceholderPath(posix)) {
      fail(`${posix} must be skipped as unadopted catalog`);
    }
    const hits = matchBootstrapPlaceholders(read(submodule)) ?? [];
    if (hits.length === 0) {
      fail(`${posix} is the catalog fixture and should still contain pack tokens`);
    }
  }

  const profileDir = path.join(ROOT, "profiles");
  if (fs.existsSync(profileDir)) {
    const files = walk(profileDir, (abs) =>
      PLACEHOLDER_EXT.has(path.extname(abs)),
    );
    for (const abs of files) {
      const posix = rel(abs);
      if (!skipProductPlaceholderPath(posix)) {
        fail(`${posix} must be skipped as profiles/ catalog`);
      }
    }
  }

  if (failures.length) {
    for (const msg of failures) {
      console.error(`error: placeholder self-test: ${msg}`);
    }
    console.error(
      `check-harness: ${failures.length} error(s), 0 warning(s)`,
    );
    process.exit(1);
  }
  console.log("check-harness: placeholder self-test ok");
  process.exit(0);
}

if (process.argv.includes("--self-test")) {
  selfTestPlaceholders();
}

function checkSkills() {
  const skillsRoot = path.join(ROOT, ".agents", "skills");
  if (!fs.existsSync(skillsRoot)) {
    error(".agents/skills/ is missing (canonical Agent Skills location)");
  }

  const claudeSkills = path.join(ROOT, ".claude", "skills");
  let claudeStat;
  try {
    claudeStat = fs.lstatSync(claudeSkills);
  } catch (err) {
    if (err && err.code === "ENOENT") {
      error(
        ".claude/skills is missing (symlink to .agents/skills; Claude Code does not load .agents/skills)",
      );
    } else {
      throw err;
    }
  }
  if (claudeStat) {
    if (!claudeStat.isSymbolicLink()) {
      error(
        ".claude/skills must be a symlink to .agents/skills (do not duplicate skill files)",
      );
    } else if (fs.existsSync(skillsRoot)) {
      let target;
      try {
        target = fs.realpathSync(claudeSkills);
      } catch {
        error(".claude/skills symlink is broken; it must resolve to .agents/skills");
        target = null;
      }
      if (target && target !== fs.realpathSync(skillsRoot)) {
        error(".claude/skills must resolve to .agents/skills");
      }
    }
  }

  const indexAbs = path.join(ROOT, "docs", "ai-harness", "RULES-INDEX.md");
  const indexText = fs.existsSync(indexAbs) ? read(indexAbs) : "";
  const listed = listedSkillPaths(indexText);
  const onDisk = new Set();

  for (const abs of skillFiles()) {
    const posix = rel(abs);
    const slug = path.basename(path.dirname(abs));
    const skillDir = rel(path.dirname(abs));
    const fromAgents = skillDir.replace(/^\.agents\/skills\/?/, "");
    onDisk.add(fromAgents || slug);

    const fm = parseFrontmatter(read(abs));
    if (!fm) {
      error(`${posix}: missing YAML frontmatter`);
      continue;
    }
    if (!fm.closed) {
      error(`${posix}: unclosed YAML frontmatter`);
      continue;
    }
    const name = fieldValue(fm.body, "name");
    const description = fieldValue(fm.body, "description");
    if (!name) {
      error(`${posix}: frontmatter needs a non-empty name`);
    }
    if (!description) {
      error(`${posix}: frontmatter needs a non-empty description`);
    }
    if (name && name !== slug) {
      error(`${posix}: name "${name}" must match folder slug "${slug}"`);
    }
    if (
      !listed.has(slug) &&
      !listed.has(fromAgents) &&
      !indexText.includes(`.agents/skills/${slug}`)
    ) {
      error(`${posix}: skill is not listed in docs/ai-harness/RULES-INDEX.md`);
    }
  }

  for (const item of listed) {
    const skillMd = path.join(ROOT, ".agents", "skills", item, "SKILL.md");
    if (!fs.existsSync(skillMd) && !onDisk.has(item)) {
      error(`RULES-INDEX lists missing skill: .agents/skills/${item}`);
    }
  }
}

const EXEC_PLAN_DIR = path.join(ROOT, "docs", "plan", "exec");
const EXEC_PLAN_REQUIRED_HEADINGS = [
  "Purpose / Big Picture",
  "Progress",
  "Surprises & Discoveries",
  "Decision Log",
  "Outcomes & Retrospective",
  "Context and Orientation",
  "Plan of Work",
  "Concrete Steps",
  "Validation and Acceptance",
  "Idempotence and Recovery",
  "Interfaces",
];

function headingTitle(line) {
  const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
  return m ? m[1].replace(/[*_`]/g, "").trim() : null;
}

function headingCovers(title, required) {
  const t = title.toLowerCase();
  const r = required.toLowerCase();
  return t === r || t.startsWith(`${r} `) || t.startsWith(`${r}/`) || t.startsWith(`${r}:`);
}

function checkExecPlans() {
  if (!fs.existsSync(EXEC_PLAN_DIR)) return;
  const files = walk(EXEC_PLAN_DIR, (abs, name) => {
    if (!abs.endsWith(".md")) return false;
    if (name === "README.md") return false;
    if (name.startsWith("_")) return false;
    return true;
  });
  for (const abs of files) {
    const titles = read(abs)
      .split("\n")
      .map(headingTitle)
      .filter(Boolean);
    for (const required of EXEC_PLAN_REQUIRED_HEADINGS) {
      const hit = titles.some((title) => headingCovers(title, required));
      if (!hit) {
        error(
          `${rel(abs)}: missing mandatory ExecPlan heading "${required}"`,
        );
      }
    }
  }
}

function checkEvolutionLog() {
  const abs = path.join(ROOT, "docs", "ai-harness", "EVOLUTION-LOG.md");
  if (!fs.existsSync(abs)) {
    error("docs/ai-harness/EVOLUTION-LOG.md is missing");
    return;
  }
  let last = null;
  for (const line of read(abs).split("\n")) {
    const m = line.match(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|/);
    if (!m) continue;
    const day = m[1];
    if (last && day < last) {
      error(
        `EVOLUTION-LOG dates must be non-decreasing: ${day} follows ${last}`,
      );
    }
    last = day;
  }
}

const MEMORY_INDEX = path.join(ROOT, "docs", "ai-harness", "MEMORY.md");
const MEMORY_DIR = path.join(ROOT, "docs", "ai-harness", "memory");

/** Dated entry lines in memory category files (headings, tables, or list items). */
function parseMemoryEntryDates(text) {
  const dates = [];
  for (const line of text.split("\n")) {
    const m = line.match(
      /^(?:#{2,6}\s+|\|\s+|[-*]\s+\*{0,2})(\d{4}-\d{2}-\d{2})\b/,
    );
    if (m) dates.push(m[1]);
  }
  return dates;
}

function referencedPathsFromMemoryIndex(indexText, indexAbs) {
  const paths = [];
  for (const href of extractHrefs(indexText)) {
    if (skipHref(href)) continue;
    let decoded;
    try {
      decoded = decodeURIComponent(href.split("#")[0].split("?")[0]);
    } catch {
      error(`docs/ai-harness/MEMORY.md: malformed link ${href}`);
      continue;
    }
    if (!decoded) continue;
    paths.push({
      href,
      target: path.resolve(path.dirname(indexAbs), decoded),
    });
  }
  return paths;
}

function checkMemoryIndexReferences(refs) {
  for (const { href, target } of refs) {
    if (!insideRepo(target)) {
      error(`docs/ai-harness/MEMORY.md: relative link escapes repo: ${href}`);
      continue;
    }
    if (!fs.existsSync(target)) {
      error(`docs/ai-harness/MEMORY.md: referenced file missing: ${href}`);
    }
  }
}

function checkMemoryCategoryFiles(refs) {
  if (!fs.existsSync(MEMORY_DIR)) {
    error("docs/ai-harness/memory/ is missing");
    return;
  }
  const files = walk(MEMORY_DIR, (abs) => abs.endsWith(".md"));
  if (files.length === 0) {
    error("docs/ai-harness/memory/ has no category markdown files");
    return;
  }
  const referenced = new Set(refs.map(({ target }) => path.resolve(target)));
  for (const abs of files) {
    const posix = rel(abs);
    if (!referenced.has(path.resolve(abs))) {
      error(`${posix}: not referenced from docs/ai-harness/MEMORY.md`);
    }
    const text = read(abs);
    const titles = text.split("\n").map(headingTitle).filter(Boolean);
    if (!titles.some((title) => headingCovers(title, "Standing"))) {
      error(`${posix}: missing Standing heading`);
    }
    let last = null;
    for (const day of parseMemoryEntryDates(text)) {
      if (last && day > last) {
        error(
          `${posix}: memory entry dates must be newest-first (non-increasing): ${day} follows ${last}`,
        );
      }
      last = day;
    }
  }
}

function checkProjectMemory() {
  if (!fs.existsSync(MEMORY_INDEX)) {
    error("docs/ai-harness/MEMORY.md is missing");
    return;
  }
  const refs = referencedPathsFromMemoryIndex(read(MEMORY_INDEX), MEMORY_INDEX);
  checkMemoryIndexReferences(refs);
  checkMemoryCategoryFiles(refs);
}

checkRulesIndex();
checkFrontmatter();
checkSkills();
checkLinks();
checkAgentsSize();
checkPlaceholders();
checkEvolutionLog();
checkProjectMemory();
checkExecPlans();

for (const w of warnings) console.warn(`warn: ${w}`);
for (const e of errors) console.error(`error: ${e}`);

if (errors.length) {
  console.error(
    `check-harness: ${errors.length} error(s), ${warnings.length} warning(s)`,
  );
  process.exit(1);
}

console.log(
  `check-harness: ok (${MODE} mode, ${warnings.length} warning(s))`,
);
