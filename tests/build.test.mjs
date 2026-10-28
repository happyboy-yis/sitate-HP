import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { works, categories } from '../assets/js/works.js';
test('all portfolio records have unique IDs, supported categories and real WebP files', async()=>{
 assert.equal(works.length,8);assert.equal(new Set(works.map(w=>w.id)).size,8);
 for(const w of works){assert.ok(categories.includes(w.category));assert.ok(w.alt);const b=await readFile(new URL('../dist'+w.image,import.meta.url));assert.equal(b.toString('ascii',8,12),'WEBP');assert.ok(b.length<500000);}
});
test('all 3 built pages resolve local scripts, styles and images',async()=>{
 for(const route of ['index.html','alien/index.html','editorial/index.html']){
 const page=await readFile(new URL('../dist/'+route,import.meta.url),'utf8');assert.match(page,/<meta name="viewport"/);assert.match(page,/<title>/);
 for(const [,path] of page.matchAll(/(?:src|href)="(\/[^"#]+)"/g)){await stat(new URL('../dist'+path,import.meta.url));}
 }
});
