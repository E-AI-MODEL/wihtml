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
  await page.locator("#editTemplate").click();
  await page.locator("#templateDialog").waitFor({ state: "visible" });
  await page.locator("#themeBg").fill("#f0f3ed");
  await page.locator("#themeFont").selectOption("serif");
  assert.match(await page.locator("#templateCSS").inputValue(), /Georgia, serif/);
  assert.match(await page.locator("#templateCSS").inputValue(), /#f0f3ed/);
  await page.locator("#templatePreset").selectOption("board");
  await page.locator("#templatePreview").click();
  assert.equal(await page.locator("#templateError").innerText(), "");
  const [templateDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#templateDownload").click()
  ]);
  const templateFile = path.join(os.tmpdir(), "wihtml-template-test.html");
  await templateDownload.saveAs(templateFile);
  assert.match(await fs.readFile(templateFile,"utf8"), /wihtml-template/);
  await page.locator("#templateImport").click();
  await page.locator("#templateFile").setInputFiles(templateFile);
  await page.waitForFunction(() => document.querySelector("#templateError").textContent.includes("Sjabloon geopend"), { timeout: 5000 });
  await page.locator("#templateApply").click();
  assert.equal(await page.locator("#templateDialog").isVisible(), false);
  await page.locator("#preview").click();
  await page.locator(".viewer.show").waitFor();
  assert.equal(await page.locator(".wi-board").count(), 1);
  await page.locator("#close").click();
  await page.locator("#editTemplate").click();
  await page.locator("#templateCodeDetails summary").click();
  await page.locator("#templateHTML").fill('<div><script>alert(1)</script><div data-slot="content"></div><div data-slot="footer"></div></div>');
  await page.locator("#templateApply").click();
  assert.match(await page.locator("#templateError").innerText(), /niet toegestaan/i);
  // Een sjabloon met twee buitenste elementen mag de huidige les niet beschadigen.
  await page.locator("#templateHTML").fill('<section class="wi-shell"><div data-slot="content"></div></section><footer class="wi-bottom" data-slot="footer"></footer>');
  await page.locator("#templateApply").click();
  assert.match(await page.locator("#templateError").innerText(), /één buitenste HTML-element/);
  assert.equal(await page.locator("#templateDialog").isVisible(), true);
  // Een optionele faseplek moet ook in de echte presentatie ingevuld zijn.
  await page.locator("#templateHTML").fill('<section class="wi-shell"><div class="wi-phase" data-slot="phase"></div><div class="wi-content" data-slot="content"></div><footer class="wi-bottom" data-slot="footer"></footer></section>');
  await page.locator("#templateApply").click();
  await page.locator("#preview").click();
  assert.equal(await page.locator('.wi-shell [data-slot="phase"]').innerText(), "Voorspellen");
  await page.locator("#close").click();
  await page.locator("#editTemplate").click();
  await page.locator("#templatePreset").selectOption("editorial");
  await page.locator("#templateApply").click();
  await page.locator("#preview").click();
  await page.locator(".viewer.show").waitFor();
  assert.match(await page.locator("#slidecontent").innerText(), /€ 1.000 wordt € 2.000/);
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="black"]').click();
  assert.equal(await page.locator("#blackMask").isVisible(), true);
  assert.equal(await page.locator("#blackMask").evaluate(el=>getComputedStyle(el).backgroundColor), "rgb(5, 8, 7)");
  await page.locator("#closeBlack").click();
  assert.equal(await page.locator("#blackMask").count(), 0);
  // Twee losse kopieën van de voorbeeldles delen geen stemopslag.
  const sampleId = await page.evaluate(()=>lesson.id);
  const secondSession = await browser.newPage();
  await secondSession.goto(pathToFileURL(path.join(root, "index.html")).href);
  const secondId = await secondSession.evaluate(()=>lesson.id);
  assert.notEqual(sampleId, secondId);
  await secondSession.close();

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
  await page.locator('[data-tool="overview"]').click();
  assert.equal(await page.locator("#overviewPanel").isVisible(),true);
  await page.locator("#overviewPanel [data-go='0']").click();
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="names"]').click();
  await page.locator("#pickerNames").fill("Iris\nMo\nSam");
  await page.locator("#chooseName").click();
  assert.notEqual(await page.locator("#nameResult").innerText(), "Nog niemand gekozen");
  await page.locator("#namesPanel [data-dismiss]").click();
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="spotlight"]').click();
  assert.equal(await page.locator("#spotlightOverlay").count(), 1);
  await page.locator("#spotlightOverlay .mask-close").click();
  assert.equal(await page.locator("#spotlightOverlay").count(), 0);
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="curtain"]').click();
  assert.equal(await page.locator("#curtainOverlay").count(), 1);
  await page.locator("#curtainOverlay .mask-close").click();
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="stopwatch"]').click();
  assert.equal(await page.locator("#stopwatchReadout").count(), 1);
  await page.locator("#watchStart").click();
  await page.locator("#watchStart").click();
  await page.locator("#stopwatchPanel [data-dismiss]").click();
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="marker"]').click();
  const box = await page.locator("#draw").boundingBox();
  await page.mouse.move(box.x+box.width*.35,box.y+box.height*.35);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*.48,box.y+box.height*.35,{steps:5});
  await page.mouse.up();
  assert.equal(await page.locator('#draw path[stroke="#f3c745"]').count(),1);
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="eraser"]').click();
  await page.mouse.click(box.x+box.width*.38,box.y+box.height*.35);
  assert.equal(await page.locator("#draw path").count(),0);
  await page.locator("#toolbtn").click();
  await page.locator('[data-tool="stopPen"]').click();
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
  await page.locator("#graphLinear").click();
  assert.equal(await page.locator("#graphLinear").getAttribute("aria-pressed"),"true");
  await page.locator("#graphMarks").click();
  assert.equal(await page.locator("#plot circle").count()>=5,true);
  assert.equal(await page.locator("#graphValues tr").count(),5);
  await page.locator('#graphValues [data-time="2"]').click();
  assert.match(await page.locator("#graphSelected").innerText(),/Gekozen meetpunt/);
  await page.locator("#graphReset").click();
  assert.equal(await page.locator("#graphLinear").getAttribute("aria-pressed"),"false");

  await page.screenshot({ path: path.join(screenshots, "grafiek-desktop.png") });
  await page.locator("#close").click();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export").click()
  ]);
  const exported = path.join(os.tmpdir(), "wihtml-export-browser-check.html");
  await download.saveAs(exported);
  await fs.copyFile(exported,path.join(screenshots,"volledige-wihtml-export.html"));
  const contents = await fs.readFile(exported, "utf8");
  assert.match(contents, /classList.add\("standalone"\)/);
  assert.match(contents, /wi-shell/);
  const standalone = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  standalone.on("pageerror", e => errors.push("export: " + e.message));
  await standalone.goto(pathToFileURL(exported).href);
  await standalone.locator(".viewer.show").waitFor({ timeout: 10000 });
  assert.match(await standalone.locator("#deckTitle").innerText(),/Verdubbelen en halveren/);
  await standalone.locator('[data-answer-index="1"]').click();
  assert.equal(await standalone.locator('.choice.selected').count(),1);
  assert.equal(await standalone.locator("#questionReveal").count(),0);
  await standalone.locator("#questionPoll").click();
  await standalone.locator('#pollPanel [data-plus="1"]').click();
  await standalone.locator("#saveRound1").click();
  await standalone.locator("#pollPanel [data-dismiss]").click();
  await standalone.screenshot({ path: path.join(screenshots, "presentatie-export.png") });
  await standalone.locator("#next").click();
  assert.equal(await standalone.locator(".quiz-card").count(),3);
  assert.equal(await standalone.locator(".quiz-feedback").count(),0);
  await standalone.locator('[data-quiz="0"][data-choice="2"]').click();
  assert.equal(await standalone.locator(".quiz-choice.selected").count(),1);
  await standalone.locator("#quizRevealAll").click();
  assert.equal(await standalone.locator(".quiz-feedback").count(),3);
  await standalone.screenshot({ path: path.join(screenshots, "export-voorkennis-interactief.png") });
  await standalone.locator("#next").click();
  await standalone.locator("#next").click();
  assert.equal(await standalone.locator("#graphTabs button").count(),4);
  await standalone.locator('#graphTabs [data-exp="1"]').click();
  assert.match(await standalone.locator("#graphScenarioTitle").innerText(),/beginwaarde/i);
  await standalone.locator('#graphTabs [data-exp="2"]').click();
  await standalone.locator("#graphLinear").click();
  await standalone.locator("#graphMarks").click();
  assert.equal(await standalone.locator("#graphLinear").getAttribute("aria-pressed"),"true");
  assert.equal(await standalone.locator("#graphValues tr").count(),5);
  await standalone.locator('#graphValues [data-time="2"]').click();
  assert.match(await standalone.locator("#graphSelected").innerText(),/Gekozen meetpunt/);
  await standalone.locator("#graphPollSecond").click();
  assert.match(await standalone.locator("#pollPanel").innerText(),/€ 1.000 wordt € 2.000/);
  await standalone.locator('#pollPanel [data-plus="0"]').click();
  await standalone.locator("#saveRound2").click();
  await standalone.locator("#compareVotes").click();
  assert.match(await standalone.locator("#comparePanel").innerText(),/Eerst/);
  assert.match(await standalone.locator("#comparePanel").innerText(),/Later/);
  await standalone.locator("#comparePanel [data-dismiss]").click();
  await standalone.locator("#pollPanel [data-dismiss]").click();
  await standalone.screenshot({ path: path.join(screenshots, "export-vier-experimenten.png") });
  for(let i=0;i<8;i++)await standalone.locator("#next").click();
  assert.equal(await standalone.locator(".mistake-panel").count(),2);
  assert.equal(await standalone.locator(".mistake-answer").count(),0);
  await standalone.locator("#errorReveal").click();
  assert.match(await standalone.locator(".mistake-answer").innerText(),/0,85/);
  await standalone.screenshot({ path: path.join(screenshots, "export-zoek-de-fout.png") });
  await standalone.locator("#next").click();
  assert.equal(await standalone.locator(".practice-item").count(),3);
  await standalone.locator('[data-solution="0"]').click();
  assert.match(await standalone.locator(".practice-item").first().innerText(),/2,64 uur/);
  await standalone.close();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#preview").click();
  await page.locator("#toolbtn").click();
  await page.locator(".toolpop.show").waitFor();
  await page.screenshot({ path: path.join(screenshots, "presentatie-mobiel.png") });
  const reference = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  reference.on("pageerror", e => errors.push("v9: "+e.message));
  await reference.goto(pathToFileURL(path.join(root, "examples/verdubbelen-halveren-v9.html")).href);
  assert.equal(await reference.locator("section.slide").count(), 12);
  await reference.locator("#floatingToolBtn").click();
  await reference.locator("#quickPen").waitFor({state:"visible"});
  await reference.locator("#quickMore").click();
  await reference.locator("#toolDrawer.advanced").waitFor();
  await reference.locator("#quickMarker").click();
  await reference.locator("#nextBtn").click();
  await reference.screenshot({ path: path.join(screenshots, "v9-volledige-les.png") });
  await reference.close();

  // Test nieuwe werkvormen met echte editorinvoer in een tweede browserpagina.
  const builder = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  builder.on("pageerror", e => errors.push("builder: "+e.message));
  await builder.goto(pathToFileURL(path.join(root, "index.html")).href);
  builder.on("dialog", d=>d.accept());
  await builder.locator("#newLesson").click();
  assert.equal(await builder.locator("#title").inputValue(),"Nieuwe wiskundeles");
  assert.equal(await builder.locator("#items .slide-item").count(),4);
  await builder.locator("#advancedFields > summary").click();
  await builder.locator("#add").click();
  await builder.locator("#type").selectOption("table");
  await builder.locator("#f-title").fill("Onderzoekstabel");
  await builder.locator("#f-columnLabels").fill("Tijd | Bedrag");
  await builder.locator("#f-tableRows").fill("0 | 1000\n12 | 2000");
  await builder.locator("#f-tableExplanation").fill("De groei is exponentieel.");
  await builder.locator("#add").click();
  await builder.locator("#type").selectOption("practice");
  await builder.locator("#f-title").fill("Zelfstandig oefenen");
  await builder.locator("#f-tasks").fill("Bereken de groeifactor.");
  await builder.locator("#f-hints").fill("Deel de nieuwe waarde door de oude waarde.");
  await builder.locator("#f-solutions").fill("g = 1,05.");
  await builder.locator("#add").click();
  await builder.locator("#type").selectOption("compare");
  await builder.locator("#f-title").fill("Vergelijk twee antwoorden");
  await builder.locator("#f-compareLabels").fill("Voor | Na");
  await builder.locator("#f-compareItems").fill("Ik gokte | Ik berekende");
  await builder.locator("#f-compareConclusion").fill("Wat is er veranderd?");
  await builder.locator("#preview").click();
  await builder.locator("#next").click();
  assert.equal(await builder.locator(".research-table").count(), 1);
  assert.equal(await builder.locator(".unknown-value").count(), 2);
  await builder.locator("#tableNext").click();
  assert.match(await builder.locator(".research-table").innerText(), /1000/);
  await builder.locator("#tableExplain").click();
  assert.match(await builder.locator("#slidecontent").innerText(), /De groei is exponentieel/);
  await builder.locator("#next").click();
  assert.match(await builder.locator("#slidecontent").innerText(), /Bereken de groeifactor/);
  await builder.locator('[data-hint="0"]').click();
  assert.match(await builder.locator("#slidecontent").innerText(), /Deel de nieuwe waarde/);
  await builder.locator('[data-solution="0"]').click();
  assert.match(await builder.locator("#slidecontent").innerText(), /g = 1,05/);
  await builder.locator("#next").click();
  assert.equal(await builder.locator(".research-table").count(), 1);
  await builder.locator("#compareNext").click();
  assert.match(await builder.locator(".research-table").innerText(), /Ik berekende/);
  await builder.locator("#compareConclusion").click();
  assert.match(await builder.locator("#slidecontent").innerText(), /Wat is er veranderd/);
  await builder.screenshot({path:path.join(screenshots,"zelfgemaakte-werkvormen.png")});
  await builder.locator("#close").click();
  const [lessonFile] = await Promise.all([builder.waitForEvent("download"),builder.locator("#export").click()]);
  const exportedBuilder = path.join(os.tmpdir(),"wihtml-werkvormen-check.html");
  await lessonFile.saveAs(exportedBuilder);
  const exportedText = await fs.readFile(exportedBuilder,"utf8");
  assert.match(exportedText,/Onderzoekstabel/);
  assert.match(exportedText,/Zelfstandig oefenen/);
  assert.match(exportedText,/Vergelijk twee antwoorden/);
  const builtLesson = await browser.newPage({viewport:{width:1280,height:720}});
  builtLesson.on("pageerror",e=>errors.push("bouwvormen-export: "+e.message));
  await builtLesson.goto(pathToFileURL(exportedBuilder).href);
  await builtLesson.locator(".viewer.show").waitFor();
  await builtLesson.locator("#next").click();
  assert.equal(await builtLesson.locator(".research-table").count(),1);
  await builtLesson.locator("#tableNext").click();
  assert.match(await builtLesson.locator(".research-table").innerText(),/1000/);
  await builtLesson.close();
  await builder.close();


  // Externe JSON die niet eerder door WiHTML is gemaakt.
  const imported = await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
  imported.on("pageerror",e=>errors.push("JSON-import: "+e.message));
  await imported.goto(pathToFileURL(path.join(root, "index.html")).href);
  const externalJSON={
    titel:"Mijn exponentiële les",niveau:"4 havo",leerdoelen:["Groeifactor uitleggen","Tijd bepalen"],
    vlakverdeling:"right",functies:{tekenen:false,stemmen:false,timer:true,spotlicht:false},
    lesdelen:[
      {fase:"Voorspellen",type:"meerkeuze",titel:"Wat denk je?",vraag:"Welke grafiek groeit sneller?",antwoorden:["A","B","C"],juisteAntwoord:"B",layout:"equal",leerlingactiviteit:"Kies zelf."},
      {fase:"Onderzoeken",type:"grafiek",titel:"Onderzoek de groeifactor",vraag:"Varieer de beginwaarde.",groeifactor:1.05,beginwaarde:1000,doelfactor:2,experimenten:[{naam:"Groeifactor 5%",vraag:"Hoe snel groeit het?",groeifactor:1.05,beginwaarde:1000,doelfactor:2},{naam:"Groeifactor 10%",vraag:"Wat verandert er?",groeifactor:1.10,beginwaarde:1000,doelfactor:2}]},
      {fase:"Exit ticket",type:"oefenen",titel:"Zelf rekenen",opgaven:[{vraag:"Bereken de verdubbelingstijd.",hint:"Gebruik de groeifactor.",uitwerking:"Ongeveer 14,2 jaar."}]}
    ]
  };
  await imported.locator("#import").setInputFiles({name:"externe-lesinhoud.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(externalJSON))});
  await imported.waitForFunction(() => document.querySelector("#title").value==="Mijn exponentiële les" || document.querySelector("#status").textContent.startsWith("JSON niet ingelezen"), null, {timeout:10000});
  assert.equal(await imported.locator("#title").inputValue(),"Mijn exponentiële les");
  assert.equal(await imported.locator("#items .slide-item").count(),3);
  assert.equal(await imported.locator("#defaultLayout").inputValue(),"right");
  await imported.locator("#preview").click();
  assert.equal(await imported.locator("#slidecontent .wi-layout.equal").count(),1);
  await imported.locator("#toolbtn").click();
  assert.equal(await imported.locator('[data-tool="pen"]').isHidden(),true);
  assert.equal(await imported.locator('[data-tool="vote"]').isHidden(),true);
  assert.equal(await imported.locator('[data-tool="timer"]').isVisible(),true);
  await imported.locator("#toolbtn").click();
  await imported.locator("#next").click();
  assert.equal(await imported.locator("#slidecontent .wi-layout.right").count(),1);
  assert.equal(await imported.locator("#plot").count(),1);
  await imported.screenshot({path:path.join(screenshots,"json-en-vlakverdeling.png")});
  await imported.locator("#close").click();
  await imported.locator("#advancedFields > summary").click();
  await imported.locator("#toolsSetup summary").click();
  await imported.locator('[data-feature="drawing"]').check();
  await imported.locator("#preview").click();
  await imported.locator("#toolbtn").click();
  assert.equal(await imported.locator('[data-tool="pen"]').isVisible(),true);
  await imported.locator("#close").click();
  const [jsonOutput]=await Promise.all([imported.waitForEvent("download"),imported.locator("#export").click()]);
  const exportedJSONLesson=path.join(os.tmpdir(),"wihtml-json-import-output.html");
  await jsonOutput.saveAs(exportedJSONLesson);
  const importedStandalone=await browser.newPage({viewport:{width:1200,height:720}});
  importedStandalone.on("pageerror",e=>errors.push("JSON-export: "+e.message));
  await importedStandalone.goto(pathToFileURL(exportedJSONLesson).href);
  await importedStandalone.locator(".viewer.show").waitFor();
  assert.match(await importedStandalone.locator("#slidecontent").innerText(),/Welke grafiek groeit sneller/);
  assert.equal(await importedStandalone.locator("#slidecontent .wi-layout.equal").count(),1);
  await importedStandalone.locator("#next").click();
  assert.equal(await importedStandalone.locator("#slidecontent .wi-layout.right").count(),1);
  assert.equal(await importedStandalone.locator("#graphTabs button").count(),2);
  await importedStandalone.locator('#graphTabs [data-exp="1"]').click();
  assert.match(await importedStandalone.locator("#graphScenarioTitle").innerText(),/10%/);
  await importedStandalone.close();
  const initialTitle=await imported.locator("#title").inputValue();
  await imported.locator("#import").setInputFiles({name:"fout.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify({titel:"Fout",lesdelen:[{type:"onbekend",titel:"?"}]}))});
  assert.equal(await imported.locator("#title").inputValue(),initialTitle);
  assert.match(await imported.locator("#status").innerText(),/onbekend type/);
  const [sampleJSON]=await Promise.all([imported.waitForEvent("download"),imported.locator("#jsonExample").click()]);
  const examplePath=path.join(os.tmpdir(),"wihtml-example.json");
  await sampleJSON.saveAs(examplePath);
  assert.equal(JSON.parse(await fs.readFile(examplePath,"utf8")).vragen.length,1);

  // Inhoud zonder dia-indeling, gevolgd door een andere lesroute. Geen lesdeel mag verdwijnen.
  const looseContent={
    titel:"Inhoud zonder dia's",niveau:"5 havo",leerdoelen:["Groeifactor verklaren"],
    inhoud:[{titel:"Lees de uitleg",tekst:"Exponentiële groei heeft een vaste groeifactor."}],
    vragen:[{titel:"Voorspel",vraag:"Wat gebeurt er bij een grotere groeifactor?",antwoorden:["Sneller","Langzamer"],juisteAntwoord:"A"}],
    opgaven:[{vraag:"Bereken de groeifactor.",hint:"Gebruik een verhouding.",uitwerking:"g=1,05"}]
  };
  await imported.locator("#import").setInputFiles({name:"inhoud-zonder-dia.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(looseContent))});
  await imported.waitForFunction(() => document.querySelector("#title").value==="Inhoud zonder dia\'s", null, {timeout:10000});
  assert.equal(await imported.locator("#items .slide-item").count(),3);
  assert.equal(await imported.locator("#title").inputValue(),"Inhoud zonder dia's",await imported.locator("#status").innerText());
  await imported.locator("#structureSetup summary").click();
  await imported.locator("#routePreset").selectOption("practice");
  await imported.locator("#applyRoute").click();
  assert.equal(await imported.locator("#items .slide-item").count(),3);
  assert.match(await imported.locator("#items").innerText(),/Lees de uitleg/);
  assert.match(await imported.locator("#items").innerText(),/Voorspel/);
  assert.match(await imported.locator("#items").innerText(),/Opgaven/);
  await imported.locator("#preview").click();
  assert.match(await imported.locator("#slidecontent").innerText(),/Exponentiële groei heeft een vaste groeifactor/);
  await imported.locator("#close").click();

  await imported.close();


  // De docent werkt rechtstreeks op de dia, niet via een groot formulier.
  const studio = await browser.newPage({ viewport: { width: 1500, height: 920 }, acceptDownloads: true });
  studio.on("pageerror", e => errors.push("visual-editor: "+e.message));
  await studio.goto(pathToFileURL(path.join(root, "index.html")).href);
  await studio.locator("#designCanvas [data-design-edit='title']").waitFor();
  assert.equal(await studio.locator("#advancedFields").evaluate(el=>el.open),false);
  await studio.locator("#designCanvas [data-design-edit='title']").fill("Mijn eigen lesvraag");
  assert.equal(await studio.locator("#f-title").inputValue(),"Mijn eigen lesvraag");
  await studio.locator("#designCanvas [data-design-edit='prompt']").fill("Wat verwacht je na twaalf jaar?");
  assert.equal(await studio.locator("#f-prompt").inputValue(),"Wat verwacht je na twaalf jaar?");
  await studio.locator("#designCanvas [data-design-array='options'][data-index='0']").fill("Het bedrag blijft gelijk");
  assert.match(await studio.locator("#f-options").inputValue(),/Het bedrag blijft gelijk/);
  await studio.locator("#designCanvas [data-design-action='setCorrect'][data-index='1']").click();
  assert.equal(await studio.locator("#f-correct").inputValue(),"1");
  await studio.locator("[data-design-layout='left']").click();
  assert.equal(await studio.locator("#designCanvas").getAttribute("data-design-layout"),"left");
  await studio.screenshot({path:path.join(screenshots,"studio-direct-bewerken.png"),fullPage:true});
  const slidesBeforeCopy=await studio.locator("#items .slide-item").count();
  await studio.locator("#designCopy").click();
  assert.equal(await studio.locator("#items .slide-item").count(),slidesBeforeCopy+1);
  await studio.locator("#designType").selectOption("practice");
  await studio.locator("#designCanvas [data-design-array='tasks'][data-index='0']").fill("Bereken het bedrag na 12 jaar.");
  assert.match(await studio.locator("#f-tasks").inputValue(),/Bereken het bedrag na 12 jaar/);
  await studio.locator("#designCanvas [data-design-action='addTask']").click();
  assert.equal(await studio.locator("#designCanvas [data-design-array='tasks']").count(),2);
  await studio.locator("#designCanvas [data-design-array='tasks'][data-index='1']").fill("Controleer de groeifactor.");
  await studio.locator("#designPreview").click();
  await studio.locator(".viewer.show").waitFor();
  assert.match(await studio.locator("#slidecontent").innerText(),/Bereken het bedrag na 12 jaar/);
  await studio.locator("#close").click();
  const [visualDownload] = await Promise.all([
    studio.waitForEvent("download"),
    studio.locator("#export").click()
  ]);
  const visualExport = path.join(os.tmpdir(),"wihtml-visueel-bewerkt.html");
  await visualDownload.saveAs(visualExport);
  const readBack = await browser.newPage();
  readBack.on("pageerror",e=>errors.push("visual-export: "+e.message));
  await readBack.goto(pathToFileURL(visualExport).href);
  await readBack.locator(".viewer.show").waitFor();
  await readBack.locator("#next").click();
  assert.match(await readBack.locator("#slidecontent").innerText(),/Controleer de groeifactor/);
  await readBack.close();
  await studio.close();

  assert.deepEqual(errors, [], "JavaScript-fouten tijdens browsertest");
  console.log("Browsertest geslaagd: editor, presentatie, stemrondes, pen, grafiek en HTML-export.");
} finally {
  await browser.close();
}
