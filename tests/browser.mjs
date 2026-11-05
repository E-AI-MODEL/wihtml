import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const screenshots = path.join(root, "test-results");
await fs.mkdir(screenshots, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
let page;
try {
  page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await page.getByRole("heading", { name: "Wat gaan leerlingen zelf ontdekken?" }).waitFor();
  await page.locator("#preview").click();
  await page.locator(".viewer.show").waitFor();
  assert.match(await page.locator("#slidecontent").innerText(), /€ 1.000 wordt € 2.000/);

  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="reveal"]').click();
  assert.match(await page.locator("#notesPanel").innerText(), /antwoord nog niet/i);
  await page.locator("#notesPanel [data-dismiss]").click();

  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="vote"]').click();
  await page.locator('#pollPanel [data-plus="1"]').click();
  await page.locator('#pollPanel [data-plus="1"]').click();
  await page.locator("#saveRound1").click();
  await page.locator("#resetDraft").click();
  await page.locator('#pollPanel [data-plus="0"]').click();
  await page.locator("#saveRound2").click();
  await page.locator("#compareVotes").click();
  assert.match(await page.locator("#comparePanel").innerText(), /Eerst/);
  assert.match(await page.locator("#comparePanel").innerText(), /Later/);
  await page.screenshot({ path: path.join(screenshots, "stemmen-desktop.png") });

  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="pen"]').click();
  const rect = await page.locator("#draw").boundingBox();
  await page.mouse.move(rect.x + rect.width * .2, rect.y + rect.height * .5);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width * .4, rect.y + rect.height * .6, { steps: 5 });
  await page.mouse.up();
  assert.equal(await page.locator("#draw path").count(), 1);
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="undo"]').click();
  assert.equal(await page.locator("#draw path").count(), 0);
  await page.locator("#next").click();
  await page.locator("#next").click();
  await page.locator("#next").click();
  assert.match(await page.locator("#slidecontent").innerText(), /Hoe lang duurt een verdubbeling/);
  await page.locator("#graphLines").click();
  assert.match(await page.locator("#graphResult").innerText(), /Verdubbeling/);
  await page.screenshot({ path: path.join(screenshots, "grafiek-desktop.png") });
  await page.locator("#close").click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export").click()
  ]);
  const exported = path.join(os.tmpdir(), "wihtml-export-browser-check.html");
  await download.saveAs(exported);
  const contents = await fs.readFile(exported, "utf8");
  assert.match(contents, /classList.add\("standalone"\)/);
  const standalone = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  standalone.on("pageerror", e => errors.push("export: " + e.message));
  await standalone.goto(pathToFileURL(exported).href);
  await standalone.locator(".viewer.show").waitFor({ timeout: 10000 });
  await standalone.screenshot({ path: path.join(screenshots, "presentatie-export.png") });
  await standalone.close();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#preview").click();
  await page.locator("#toolbtn").click();
  await page.locator(".toolpop.show").waitFor();
  await page.screenshot({ path: path.join(screenshots, "presentatie-mobiel.png") });
  assert.deepEqual(errors, [], "JavaScript-fouten tijdens browsertest");
  console.log("Browsertest geslaagd: editor, presentatie, stemrondes, pen, grafiek en HTML-export.");
} finally {
  await browser.close();
}
