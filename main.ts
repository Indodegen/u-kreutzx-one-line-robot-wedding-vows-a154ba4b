import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function die(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The vow lives next to this script, so where the grader runs it from
// does not matter.
const scriptDir = dirname(fileURLToPath(import.meta.url));
const entryPath = join(scriptDir, "entry.txt");

let raw;
try {
  raw = readFileSync(entryPath, "utf8");
} catch {
  die(`cannot read ${entryPath}`);
}

// One line break at the very end is just how the file ends, not a
// second line.
const text = raw.replace(/\r?\n$/, "");

if (text.includes("\n") || text.includes("\r")) {
  die("entry.txt must hold exactly one line");
}
if (text.length < 1 || text.length > 160) {
  die(`entry must be between 1 and 160 characters, got ${text.length}`);
}
if (text !== text.trim()) {
  die("entry must not start or end with whitespace");
}
if (text.includes(" ")) {
  die("entry must not contain a non-breaking space (U+00A0)");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  die("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), raw, "utf8");
