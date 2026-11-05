import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd(), out=path.join(root,'test-results');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
const source=process.env.WIHTML_URL||pathToFileURL(path.join(root,'index.html')).href;
const fixture={id:'journey-test',title:'Eigen les $& $` $\' <wiskunde>',level:'5 havo',route:'practice',layout:'equal',
 features:{drawing:false,voting:false,clock:true,focus:true,picker:true,notes:true,printing:true},
 slides:[
 {id:'q',type:'question',title:'Eigen vraag',prompt:'Kies en verklaar',options:['Regel 1\nRegel 2','Nee'],correct:-1,later:true,explanation:'Nog niet tonen'},
 {id:'quiz',type:'quizset',title:'Begripsvragen',questions:[{prompt:'Twee keuzes\nMet een tweede regel | in de vraag',options:['Ja','Nee'],correct:1,explanation:'Omdat | dit klopt\nTweede regel'}]},
 {id:'task',type:'practice',title:'Eigen opgaven',tasks:['Eerste regel\nTweede regel','Tweede opgave'],hints:['','Hulp bij twee'],solutions:['','Uitwerking twee']},
 {id:'table',type:'table',title:'Tabel',columnLabels:['t','N'],tableRows:[['0','0'],['1 | a','12\n13']],tableExplanation:'Tabeluitleg'},
 {id:'compare',type:'compare',title:'Vergelijken',compareLabels:['Voor','Na'],compareItems:[['Eerst | keuze','Later\nverklaring']],compareConclusion:'Conclusie'},
 {id:'steps',type:'steps',title:'Stappen',steps:['Stap 1\nVervolg','Stap 2']},
 {id:'graph',type:'graph',title:'Eigen grafiek',g:2.2,b:75000,target:2,experiments:[{label:'Eigen proef',question:'Wat gebeurt er?',instruction:'Verklaar',g:2.2,b:75000,target:2}]},
 {id:'error',type:'error',title:'Foutenanalyse',wrong:'0,15^t = 0,5',challenge:'Wat klopt niet?',correction:'Gebruik 0,85'},
 {id:'text',type:'text',title:'Tekst',body:'Letterlijke formule $& en $` en $\' <tekst>\nVolgende regel'}
 ]};
const upload=async(p,doc,name='les.json')=>{
 await p.locator('#import').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(doc))});
 await p.waitForFunction(title=>document.querySelector('#title').value===title,doc.title||doc.titel);
};
const download=async(p,id,file)=>{
 const [d]=await Promise.all([p.waitForEvent('download'),p.locator(id).click()]);
 await d.saveAs(file);return file;
};
const tool=async(p,name)=>{await p.locator('#toolbtn').click();await p.locator(`[data-tool="${name}"]`).click()};
try{
 const p=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
 p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());
 await p.goto(source);await upload(p,fixture);
 // Selecting every slide and saving must not change multiline values, pipes or short quiz questions.
 for(let i=0;i<fixture.slides.length;i++)await p.locator(`#items [data-i="${i}"]`).click();
 const saved=path.join(out,'journey-les.json');await download(p,'#save',saved);
 const json=JSON.parse(await fs.readFile(saved,'utf8'));
 assert.equal(json.route,'practice');assert.deepEqual(json.slides.map(x=>x.id),fixture.slides.map(x=>x.id));
 for(const [index,keys] of [[0,['options','correct','later']],[1,['questions']],[2,['tasks','hints','solutions']],[3,['tableRows']],[4,['compareItems']],[5,['steps']]])
  for(const key of keys)assert.deepEqual(json.slides[index][key],fixture.slides[index][key],`${index} ${key}`);
 // Reload the downloaded JSON in the same UI, keeping its manual order and lesson settings.
 await upload(p,json);await p.locator('#items [data-i="1"]').click();
 await p.locator('[data-design-quiz="option"][data-option="1"]').fill('Nee, verklaar je keuze');
 await p.locator('#items [data-i="2"]').click();
 await p.locator('[data-design-array="tasks"][data-index="0"]').fill('Nieuwe opgave\nMet twee regels');
 await p.locator('[data-design-action="addTask"]').click();
 await p.locator('[data-design-array="tasks"][data-index="2"]').fill('Derde opgave');
 await p.locator('.design-task-help').nth(2).locator('summary').click();
 await p.locator('[data-design-array="hints"][data-index="2"]').fill('Hulp drie');
 await p.locator('[data-design-array="solutions"][data-index="2"]').fill('Uitwerking drie');
 // A real drag must move a slide while retaining the selected slide.
 await p.locator('#items [data-i="8"]').dragTo(p.locator('#items [data-i="0"]'));
 await p.locator('#designCopy').click();await p.locator('#designRemove').click();
 assert.equal(await p.locator('#items .slide-item').count(),9);
 await p.locator('#items .slide-item').filter({hasText:'Eigen grafiek'}).click();
 await p.locator('.design-experiments summary').click();
 await p.locator('[data-experiment="0"][data-experiment-field="label"]').fill('Mijn eigen experiment');
 await p.locator('[data-experiment="0"][data-experiment-field="b"]').fill('80000');
 await p.locator('[data-design-action="addExperiment"]').click();
 assert.equal(await p.locator('[data-experiment-field="label"]').count(),2);
 await p.locator('[data-design-layout="right"]').click();
 await p.locator('#designPreview').click();
 assert.equal(await p.locator('#graphG').inputValue(),'2.2');
 assert.equal(await p.locator('#graphB').inputValue(),'80000');
 assert.match(await p.locator('#graphFormula').innerText(),/80.000/);
 assert.equal(await p.locator('#graphTabs button').count(),2);
 assert.equal(await p.locator('#graphPollActions').isVisible(),false);
 await p.locator('#toolbtn').click();assert.equal(await p.locator('[data-tool="pen"]').isVisible(),false);await p.locator('#toolbtn').click();
 // Slider keyboard input must not advance the slide.
 const position=await p.locator('#position').innerText();
 await p.locator('#graphB').focus();await p.keyboard.press('ArrowRight');
 assert.equal(await p.locator('#position').innerText(),position);
 await p.locator('#close').click();
 // Apply a design without HTML/CSS.
 await p.locator('#editTemplate').click();await p.locator('#themeBg').fill('#f4f1e9');
 await p.locator('#themeText').fill('#202826');await p.locator('#themeFont').selectOption('serif');
 await p.locator('#templateApply').click();
 await p.screenshot({path:path.join(out,'journey-studio.png'),fullPage:true});
 const html=path.join(out,'journey-zelfstandige-les.html');await download(p,'#export',html);
 const standalone=await browser.newPage({viewport:{width:1920,height:1080}});
 standalone.on('pageerror',e=>errors.push('export: '+e.message));
 // A downloaded lesson must need no network at all.
 await standalone.route(/^https?:/,route=>route.abort());
 await standalone.goto(pathToFileURL(html).href);await standalone.locator('.viewer.show').waitFor();
 assert.equal(await standalone.locator('#deckTitle').innerText(),fixture.title);
 assert.match(await standalone.locator('#slidecontent').innerText(),/Letterlijke formule \$&/);
 await standalone.locator('#next').click(); // question
 assert.equal(await standalone.locator('#questionPoll').isVisible(),false);
 await standalone.keyboard.press('p');assert.equal(await standalone.locator('#draw.armed').count(),0);
 await standalone.locator('#next').click(); // quiz
 assert.equal(await standalone.locator('.quiz-choice').count(),2);
 assert.equal(await standalone.locator('.quiz-feedback').count(),0);
 await standalone.locator('#quizRevealAll').click();assert.match(await standalone.locator('.quiz-feedback').innerText(),/Omdat \| dit klopt/);
 await standalone.locator('#next').click(); // practice
 assert.equal(await standalone.locator('.practice-item').count(),3);
 await standalone.locator('[data-hint="1"]').click();await standalone.locator('[data-solution="2"]').click();
 assert.match(await standalone.locator('#slidecontent').innerText(),/Hulp bij twee/);
 assert.match(await standalone.locator('#slidecontent').innerText(),/Uitwerking drie/);
 // Overview navigation must reset reveal state, just like Next.
 await tool(standalone,'overview');await standalone.locator('#overviewPanel [data-go="4"]').click();
 assert.equal(await standalone.locator('.unknown-value').count(),2);
 assert.equal(await standalone.locator('.reveal').count(),0);
 await standalone.locator('#tableNext').click();assert.match(await standalone.locator('.research-table').innerText(),/0/);
 await standalone.locator('#next').click();await standalone.locator('#compareNext').click();
 assert.match(await standalone.locator('.research-table').innerText(),/Later/);
 await standalone.locator('#next').click();assert.equal(await standalone.locator('#stepList').innerText(),'');
 await standalone.locator('#stepNext').click();assert.match(await standalone.locator('#stepList').innerText(),/Vervolg/);
 await standalone.locator('#next').click();await standalone.locator('#graphMarks').click();await standalone.locator('#graphLinear').click();await standalone.locator('#graphLines').click();
 assert.match(await standalone.locator('#graphResult').innerText(),/Verdubbeling/);
 await standalone.screenshot({path:path.join(out,'journey-presentatie.png')});
 await standalone.locator('#next').click();assert.equal(await standalone.locator('.mistake-answer').count(),0);
 await standalone.locator('#errorReveal').click();assert.match(await standalone.locator('.mistake-answer').innerText(),/0,85/);
 // Teacher timer and second window are real UI operations.
 await tool(standalone,'timer');await standalone.locator('#timerHalf').click();assert.equal(await standalone.locator('#timerReadout').innerText(),'00:30');
 await standalone.locator('#timerStart').click();await standalone.locator('#timerStart').click();await standalone.locator('#timerPanel [data-dismiss]').click();
 const popupPromise=standalone.waitForEvent('popup');await tool(standalone,'presenter');const presenter=await popupPromise;
 await presenter.waitForLoadState();assert.match(await presenter.locator('#notes').innerText(),/Foutenanalyse/);await presenter.close();
 await standalone.close();
 // Layout-only changes are saved, even after an immediate reload.
 await p.locator('[data-design-layout="left"]').click();await p.reload();
 await p.locator('#draftRestore').click();
 await p.locator('#items .slide-item').filter({hasText:'Eigen grafiek'}).click();
 assert.equal(await p.locator('#designCanvas').getAttribute('data-design-layout'),'left');
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:path.join(out,'journey-mobiel.png'),fullPage:true});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Mobiel mag niet horizontaal overlopen');
 assert.deepEqual(errors,[]);
 console.log('Gebruikersroute geslaagd: import, negen werkvormen, directe bewerking, slepen, vormgeving, JSON-heropening, offline HTML, docenttools en conceptherstel.');
}finally{await browser.close()}
