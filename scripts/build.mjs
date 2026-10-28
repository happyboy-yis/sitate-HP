import { cp, mkdir, rm, access, readFile, writeFile, readdir } from 'node:fs/promises';
import { works } from '../assets/js/works.js';
const root = new URL('../', import.meta.url);
for (const item of ['index.html', 'alien/index.html', 'editorial/index.html', ...works.map(w => w.image.slice(1))]) await access(new URL(item, root));
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/', root));
for (const item of ['index.html', 'alien', 'editorial', 'assets']) await cp(new URL(item, root), new URL('dist/' + item, root), { recursive: true });
const base = process.env.BASE_PATH || '';
if (base && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(base)) throw new Error('BASE_PATH must be a path like /sitate-HP without a trailing slash');
if (base) {
  async function prefixPaths(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
      if (entry.isDirectory()) await prefixPaths(file);
      else if (/\.(html|js|css)$/.test(entry.name)) {
        const source = await readFile(file, 'utf8');
        await writeFile(file, source.replace(/(["'])\/(?!\/)/g, '$1' + base + '/'));
      }
    }
  }
  await prefixPaths(new URL('dist/', root));
}
await writeFile(new URL('dist/.nojekyll', root), '');
console.log('Static build complete: dist/ — 3 pages, ' + works.length + ' works.');
