import { cp, mkdir, rm, access, readFile } from 'node:fs/promises';
import { works } from '../assets/js/works.js';
const root = new URL('../', import.meta.url);
for (const item of ['index.html', 'alien/index.html', 'editorial/index.html', ...works.map(w => w.image.slice(1))]) await access(new URL(item, root));
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root));
for (const item of ['index.html', 'alien', 'editorial', 'assets']) await cp(new URL(item, root), new URL('dist/' + item, root), { recursive: true });
console.log('Static build complete: dist/ — 3 pages, ' + works.length + ' works.');
