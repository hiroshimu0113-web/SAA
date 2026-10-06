
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
