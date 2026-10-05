import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const book = await readFile('deliverables/SAA-starter.epub');
assert.equal(book.readUInt32LE(0),0x04034b50);
assert.equal(book.readUInt16LE(8),0,'mimetype must be stored');
assert.equal(book.subarray(30,38).toString(),'mimetype');
assert.equal(book.subarray(38,58).toString(),'application/epub+zip');
let offset=0;const files=new Map();
while(book.readUInt32LE(offset)===0x04034b50){const size=book.readUInt32LE(offset+18),n=book.readUInt16LE(offset+26),extra=book.readUInt16LE(offset+28),name=book.subarray(offset+30,offset+30+n).toString();const start=offset+30+n+extra;files.set(name,book.subarray(start,start+size).toString());offset=start+size;}
assert.equal(files.size,11);
assert.ok(files.get('EPUB/package.opf').includes('version="3.0"'));
assert.equal((files.get('EPUB/questions.xhtml').match(/id="q\d+"/g)||[]).length,20);
assert.equal((files.get('EPUB/answers.xhtml').match(/id="q\d+-answer"/g)||[]).length,20);
for(const [name,body] of files) if(name.endsWith('.xhtml')) for(const match of body.matchAll(/href="([^"#]+)(?:#[^"]*)?"/g)) if(!match[1].startsWith('https://')) assert.ok(files.has('EPUB/'+match[1]),`${name}: ${match[1]}`);
console.log('PASS: EPUB3 container, stored mimetype, 20 questions/answers, internal file links. Apple Books rendering not verified.');
