
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const sourceDir = path.join(root, "src");

const extensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".json",
];

const ignoredDirs = new Set(["node_modules", "dist", ".git"]);
const errors = [];

function getFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return ignoredDirs.has(entry.name) ? [] : getFiles(fullPath);
    }

    return /\.(js|jsx|mjs)$/.test(entry.name) ? [fullPath] : [];
  });
}

function resolveImport(importer, specifier) {
  const base = path.resolve(path.dirname(importer), specifier);
  const candidates = [
    base,
    ...extensions.map((ext) => base + ext),
    ...extensions.map((ext) => path.join(base, `index${ext}`)),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function checkCase(importer, specifier, resolvedPath) {
  const relative = path.relative(root, resolvedPath);
  const segments = relative.split(path.sep);
  let current = root;

  for (const segment of segments) {
    const entries = fs.readdirSync(current);

    if (!entries.includes(segment)) {
      const actual = entries.find(
        (entry) => entry.toLowerCase() === segment.toLowerCase()
      );

      if (actual) {
        errors.push(
          `${path.relative(root, importer)}: "${specifier}" has incorrect casing.\n` +
          `  Expected segment: "${segment}"\n` +
          `  Actual segment:   "${actual}"`
        );
        return;
      }

      errors.push(
        `${path.relative(root, importer)}: cannot find "${specifier}".`
      );
      return;
    }

    current = path.join(current, segment);
  }
}

for (const file of getFiles(sourceDir)) {
  const source = fs.readFileSync(file, "utf8");

  const importPattern =
    /(?:import\s+(?:[\s\S]*?\s+from\s+)?|export\s+[\s\S]*?\s+from\s+|import\s*\()\s*["']([^"']+)["']/g;

  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1];

    if (!specifier.startsWith(".")) continue;

    const resolved = resolveImport(file, specifier);

    if (!resolved) {
      errors.push(
        `${path.relative(root, file)}: cannot resolve "${specifier}".`
      );
      continue;
    }

    checkCase(file, specifier, resolved);
  }
}

if (errors.length) {
  console.error("\nImport path checks failed:\n");
  console.error([...new Set(errors)].join("\n\n"));
  process.exit(1);
}

console.log("Import path casing check passed.");
