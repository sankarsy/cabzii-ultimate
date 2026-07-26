import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "src");
const reps = [
  ["mx-auto w-full max-w-5xl px-4", "section-shell"],
  ["mx-auto grid w-full max-w-5xl grid-cols-1", "section-shell grid w-full grid-cols-1"],
  ["mx-auto flex w-full max-w-5xl flex-col", "section-shell flex w-full flex-col"],
  ["mx-auto max-w-5xl px-4 md:px-6", "section-shell"],
  ["mx-auto max-w-5xl px-4 py-6 pb-8", "section-shell py-6 pb-8"],
  ["mx-auto max-w-5xl px-4 py-6", "section-shell py-6"],
  ["mx-auto max-w-5xl px-4 py-8", "section-shell py-8"],
  ["mx-auto max-w-5xl px-4 py-10", "section-shell py-10"],
  ["mx-auto max-w-5xl px-4 py-16", "section-shell py-16"],
  ["mx-auto max-w-5xl px-4 pb-8", "section-shell pb-8"],
  ["mx-auto max-w-5xl px-4 pt-6 md:px-6", "section-shell pt-6"],
  ["mx-auto max-w-5xl px-4", "section-shell"],
  ["mx-auto max-w-6xl px-4 md:px-6", "section-shell"],
  ["mx-auto max-w-6xl px-4 py-6", "section-shell py-6"],
  ["mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14", "section-shell py-10 md:py-14"],
  ["relative mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14", "relative section-shell py-10 md:py-14"],
  ["mx-auto max-w-6xl px-4", "section-shell"],
  ["mx-auto flex max-w-6xl items-center justify-between gap-3", "section-shell flex items-center justify-between gap-3"],
  ["mx-auto max-w-4xl px-4 py-8 sm:py-10", "section-shell py-8 sm:py-10"],
  ["mx-auto max-w-4xl px-4 py-8", "section-shell py-8"],
  ["mx-auto max-w-4xl px-4", "section-shell"],
  ["mx-auto max-w-3xl px-4 py-10 md:py-14", "section-shell py-10 md:py-14"],
  ["mx-auto max-w-3xl px-4 py-16 text-center", "section-shell py-16 text-center"],
  ["mx-auto max-w-7xl px-4 md:px-6 lg:px-8", "section-shell"],
  ["max-w-7xl mx-auto px-4 md:px-6 lg:px-8", "section-shell"],
  ["mx-auto flex max-w-5xl justify-center gap-3 px-4 pb-10", "section-shell flex justify-center gap-3 pb-10"],
  ["mx-auto grid max-w-5xl grid-cols-1", "section-shell grid grid-cols-1"],
  ["app-page-shell", "section-shell"]
];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(ent.name)) {
      let c = fs.readFileSync(p, "utf8");
      const orig = c;
      for (const [from, to] of reps) c = c.split(from).join(to);
      if (c !== orig) {
        fs.writeFileSync(p, c);
        console.log("updated", p);
      }
    }
  }
}

walk(root);
