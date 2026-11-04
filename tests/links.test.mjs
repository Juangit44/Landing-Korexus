import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

test('internal links validation in dist', () => {
  const distDir = path.resolve('dist');
  assert.ok(fs.existsSync(distDir), 'dist folder must exist (run build first)');

  const htmlFiles = getHtmlFiles(distDir);
  assert.ok(htmlFiles.length >= 10, 'Expected at least 10 generated pages');

  const knownRoutes = new Set([
    '/',
    '/en',
    '/en/',
    '/contacto',
    '/en/contact',
    '/sistemas/sistema-uno',
    '/sistemas/sistema-dos',
    '/en/systems/system-one',
    '/en/systems/system-two',
    '/aviso-de-privacidad',
    '/en/privacy-policy',
    '/404',
    '/en/404',
  ]);

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const hrefMatches = content.matchAll(/href="(\/[^"#?]*)(?:#[^"]*)?"/g);

    for (const match of hrefMatches) {
      const link = match[1];
      if (link.startsWith('/_astro') || link.startsWith('/favicon')) continue;
      
      const normalized = link.endsWith('/') && link !== '/' ? link.slice(0, -1) : link;
      assert.ok(
        knownRoutes.has(normalized) || knownRoutes.has(link),
        `Broken internal link "${link}" found in ${path.relative(distDir, file)}`
      );
    }
  }
});
