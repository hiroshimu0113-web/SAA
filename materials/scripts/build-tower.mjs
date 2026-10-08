
import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'vite';
const result=await build({configFile:false,publicDir:false,logLevel:'error',build:{write:false,target:'safari14',minify:'esbuild',lib:{entry:'public/tower/app.mjs',formats:['iife'],name:'CloudSpire'},rollupOptions:{output:{inlineDynamicImports:true}}}});
const output=Array.isArray(result)?result[0].output:result.output;
const js=output.find(x=>x.type==='chunk').code.replace(/<\/script/gi,'<\\/script');
const css=(await readFile('public/tower/style.css','utf8')).replace(/<\/style/gi,'<\\/style');
let html=await readFile('public/tower/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>').replace('<script type="module" src="./app.mjs"></script>','');
html=html.replace('</body>','<script>'+js+'</script></body>');
await writeFile('dist/tower/index.html',html);
// Fresh path avoids previously cached index.html; saves remain on the same origin.
await writeFile('dist/tower/play.html',html);
await writeFile('dist/tower/strategy.html',html);
await writeFile('dist/tower/quiz.html',html);
console.log('Tower: single-page Safari 14 bundle; no external module required at startup.');

await writeFile('dist/tower/battle.html',html);

await writeFile('dist/tower/left.html',html);

await writeFile('dist/tower/hand.html',html);

await writeFile('dist/tower/combo.html',html);

await writeFile('dist/tower/flavor.html',html);

await writeFile('dist/tower/ui.html',html);

await writeFile('dist/tower/debuff.html',html);

await writeFile('dist/tower/foes.html',html);

await writeFile('dist/tower/learning.html',html);

await writeFile('dist/tower/heroes.html',html);

await writeFile('dist/tower/models.html',html);

await writeFile('dist/tower/relics.html',html);

await writeFile('dist/tower/reactor.html',html);

await writeFile('dist/tower/rules.html',html);

await writeFile('dist/tower/routes.html',html);

await writeFile('dist/tower/flow.html',html);

await writeFile('dist/tower/bosses.html',html);

await writeFile('dist/tower/junk.html',html);

await writeFile('dist/tower/junk-debug.html',html);

await writeFile('dist/tower/turns.html',html);

await writeFile('dist/tower/impact.html',html);

await writeFile('dist/tower/starter.html',html);

await writeFile('dist/tower/vocabulary.html',html);

await writeFile("dist/tower/options.html",html);

await writeFile("dist/tower/header.html",html);

await writeFile("dist/tower/ascent.html",html);

await writeFile("dist/tower/refined.html",html);

await writeFile("dist/tower/starters.html",html);

await writeFile("dist/tower/restart.html",html);
await writeFile("dist/tower/starter-update.html",html);

await writeFile("dist/tower/menu.html",html);

await writeFile('dist/tower/icons.html',html);

await writeFile('dist/tower/icons-v2.html',html);

await writeFile('dist/tower/icons-flat.html',html);

await writeFile('dist/tower/study.html',html);

await writeFile('dist/tower/compact.html',html);

await writeFile('dist/tower/fan.html',html);

await writeFile('dist/tower/hand-icons.html',html);

await writeFile('dist/tower/role-seams.html',html);
