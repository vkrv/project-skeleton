#!/usr/bin/env node
/**
 * Deterministic AI-harness self-check. Node stdlib only.
 *
 *   node scripts/check-harness.mjs
 *   HARNESS_MODE=product node scripts/check-harness.mjs
 *
 * Default (template) mode allows bootstrap placeholders.
 * Product mode fails if those placeholders remain. JSX/style object literals are ignored.
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
    ...walk(path.join(ROOT, "docs"), (abs) => abs.endsWith(".md")),
    ...walk(path.join(ROOT, "profiles"), (abs) => abs.endsWith(".md") || abs.endsWith(".mdc")),
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

function checkPlaceholders() {
  if (MODE !== "product") return;
  const files = walk(ROOT, (abs) => {
    const ext = path.extname(abs);
    if (!PLACEHOLDER_EXT.has(ext)) return false;
    if (rel(abs) === "scripts/check-harness.mjs") return false;
    return true;
  });
  // ALL-CAPS bootstrap placeholders only; ignore JSX/style object literals.
  const token = /\{\{[A-Z][A-Z0-9_]*\}\}/g;
  for (const abs of files) {
    const hits = read(abs).match(token);
    if (!hits) continue;
    const uniq = [...new Set(hits)];
    error(
      `${rel(abs)}: leftover placeholder(s) in product mode: ${uniq.join(", ")}`,
    );
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

checkRulesIndex();
checkFrontmatter();
checkLinks();
checkAgentsSize();
checkPlaceholders();
checkEvolutionLog();

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
