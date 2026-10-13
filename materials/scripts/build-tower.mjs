
import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'vite';
const result=await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,target:'safari14',minify:'esbuild',lib:{entry:'public/tower/app.mjs',formats:['iife'],name:'CloudSpire'},rollupOptions:{output:{inlineDynamicImports:true}}}});
const output=Array.isArray(result)?result[0].output:result.output;
const js=output.find(x=>x.type==='chunk').code.replace(/<\/script/gi,'<\\/script');
const css=(await readFile('public/tower/style.css','utf8')).replace(/<\/style/gi,'<\\/style');
let html=await readFile('public/tower/legacy.html','utf8');
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>').replace('<script type="module" src="./app.mjs"></script>','');
html=html.replace('</body>','<script>'+js+'</script></body>');

await writeFile('dist/tower/legacy.html',html);
// The archive keeps its original save key and behaviour.

console.log('Tower: single-page Safari 14 bundle; no external module required at startup.');

const labResult=await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,target:'safari14',minify:'esbuild',lib:{entry:'public/tower/build-lab-app.mjs',formats:['iife'],name:'BuildLab'},rollupOptions:{output:{inlineDynamicImports:true}}}});
const labOutput=(Array.isArray(labResult)?labResult[0].output:labResult.output).find(x=>x.type==='chunk').code.replace(/<\/script/gi,'<\\/script');
let labHTML=await readFile('public/tower/build-lab.html','utf8');labHTML=labHTML.replace('<script type="module" src="./build-lab-app.mjs"></script>','<script>'+labOutput+'</script>');await writeFile('dist/tower/build-lab.html',labHTML);

const adventureResult=await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,target:'safari14',minify:'esbuild',lib:{entry:'public/tower/build-adventure-app.mjs',formats:['iife'],name:'BuildAdventure'},rollupOptions:{output:{inlineDynamicImports:true}}}});
const adventureJS=(Array.isArray(adventureResult)?adventureResult[0].output:adventureResult.output).find(x=>x.type==='chunk').code.replace(/<\/script/gi,'<\\/script');
let adventureHTML=await readFile('public/tower/builds.html','utf8');
const adventureCSS=(await readFile('public/tower/build-adventure.css','utf8')).replace(/<\/style/gi,'<\\/style');
adventureHTML=adventureHTML.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>').replace('<link rel="stylesheet" href="./build-adventure.css">','<style>'+adventureCSS+'</style>').replace('<script type="module" src="./build-adventure-app.mjs"></script>','<script>'+adventureJS+'</script>');
await writeFile('dist/tower/builds.html',adventureHTML);

// All historical game bookmarks now open the revised card set.
for(const entry of ['build-colours.html', 'index.html', 'play.html', 'strategy.html', 'quiz.html', 'battle.html', 'left.html', 'hand.html', 'combo.html', 'flavor.html', 'ui.html', 'debuff.html', 'foes.html', 'learning.html', 'heroes.html', 'models.html', 'relics.html', 'reactor.html', 'rules.html', 'routes.html', 'flow.html', 'bosses.html', 'junk.html', 'junk-debug.html', 'turns.html', 'impact.html', 'starter.html', 'vocabulary.html', 'options.html', 'header.html', 'ascent.html', 'refined.html', 'starters.html', 'restart.html', 'starter-update.html', 'menu.html', 'icons.html', 'icons-v2.html', 'icons-flat.html', 'study.html', 'compact.html', 'fan.html', 'hand-icons.html', 'role-seams.html'])await writeFile('dist/tower/'+entry,adventureHTML);
