import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const data = readFileSync(
  new URL("../data/vocabulary.ts", import.meta.url),
  "utf8",
);
for (const [level, expected] of Object.entries({
  A1: 25,
  A2: 25,
  B1: 15,
  B2: 10,
  C1: 5,
  C2: 5,
})) {
  const count = [
    ...data.matchAll(new RegExp(`\"${level.toLowerCase()}-\\d+\"`, "g")),
  ].length;
  assert.equal(count, expected, `${level} should have ${expected} cards`);
}
const progress = { "a1-1": "know", "a1-2": "learning", "a1-3": "again" };
assert.equal(Object.values(progress).filter((s) => s === "know").length, 1);
assert.equal(Object.values(progress).filter((s) => s === "learning").length, 1);
assert.equal(Object.values(progress).filter((s) => s === "again").length, 1);
const app = readFileSync(
  new URL("../components/FlashcardApp.tsx", import.meta.url),
  "utf8",
);
const progressLib = readFileSync(
  new URL("../lib/progress.ts", import.meta.url),
  "utf8",
);
assert.match(
  app,
  /utterance\.lang = \"nl-NL\"/,
  "pronunciation should request nl-NL",
);
assert.match(
  progressLib,
  /localStorage\.setItem\(progressKey/,
  "progress should be saved to localStorage",
);
assert.match(app, /event\.code === \"Space\"/, "space key should flip cards");
assert.doesNotMatch(
  app,
  /role="button"/,
  "interactive controls should use real buttons",
);
assert.match(app, /Marked words/, "progress page should list marked words");
console.log("flashcard and progress behavior checks passed");
const manifest = readFileSync(
  new URL("../public/manifest.webmanifest", import.meta.url),
  "utf8",
);
const serviceWorker = readFileSync(
  new URL("../public/service-worker.js", import.meta.url),
  "utf8",
);
assert.match(
  manifest,
  /"display": "standalone"/,
  "iPhone PWA should launch standalone",
);
assert.match(manifest, /"start_url": "\/"/, "PWA should start at the app root");
assert.match(
  serviceWorker,
  /CACHE_NAME/,
  "service worker should define an app cache",
);
const qrPage = readFileSync(
  new URL("../public/iphone-install-qr.html", import.meta.url),
  "utf8",
);
const qrScript = readFileSync(
  new URL("../scripts/iphone-qr-url.mjs", import.meta.url),
  "utf8",
);
assert.match(
  qrPage,
  /quickchart\.io\/qr/,
  "QR page should render a scannable QR image",
);
assert.match(
  qrPage,
  /localhost/,
  "QR page should warn against iPhone localhost usage",
);
assert.match(
  qrScript,
  /networkInterfaces/,
  "QR script should discover local network URLs",
);
