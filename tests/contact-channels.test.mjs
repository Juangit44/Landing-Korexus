import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ui } from '../src/i18n/ui.ts';

const FORBIDDEN_LEGACY_STRINGS = [
  'geminiprojuan22@gmail.com',
  'contacto@korexus.com',
  '5210000000000',
  '59178130974',
];

function walkFiles(dirPath, filterFn = () => true) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, filterFn));
    } else if (entry.isFile() && filterFn(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function readDistPage(relativePath) {
  const fullPath = path.resolve('dist', relativePath);
  assert.ok(fs.existsSync(fullPath), `Expected built page to exist: ${relativePath}`);
  return fs.readFileSync(fullPath, 'utf-8');
}

function stripHtmlTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

test('contact config exports CONTACT_CHANNELS and all 4 consumer files import it', async () => {
  const configPath = path.resolve('src/config/contact.ts');
  assert.ok(fs.existsSync(configPath), 'Expected src/config/contact.ts to exist');

  const { CONTACT_CHANNELS } = await import('../src/config/contact.ts');
  assert.deepEqual(CONTACT_CHANNELS, {
    email: 'korexussoporte@gmail.com',
    emailHref: 'mailto:korexussoporte@gmail.com',
    whatsappNumber: '59171085116',
    whatsappDisplay: '+591 71085116',
    whatsappHref: 'https://wa.me/59171085116',
  });

  const consumers = [
    { file: 'src/components/ContactSection.astro', importPath: '../config/contact' },
    { file: 'src/components/ContactForm.astro', importPath: '../config/contact' },
    { file: 'src/pages/aviso-de-privacidad.astro', importPath: '../config/contact' },
    { file: 'src/pages/en/privacy-policy.astro', importPath: '../../config/contact' },
  ];

  for (const { file, importPath } of consumers) {
    const fullPath = path.resolve(file);
    assert.ok(fs.existsSync(fullPath), `Expected consumer file to exist: ${file}`);
    const source = fs.readFileSync(fullPath, 'utf-8');
    const escapedImportPath = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const importRegex = new RegExp(
      `import\\s*\\{[^}]*\\bCONTACT_CHANNELS\\b[^}]*\\}\\s*from\\s*['"]${escapedImportPath}['"]`
    );
    assert.match(source, importRegex, `Expected ${file} to import CONTACT_CHANNELS from ${importPath}`);
    assert.match(source, /\bCONTACT_CHANNELS\./, `Expected ${file} to reference CONTACT_CHANNELS`);
  }
});

test('i18n defines localized contact.whatsapp_direct labels in es and en', () => {
  assert.equal(ui.es['contact.whatsapp_direct'], 'WhatsApp Chat Directo');
  assert.equal(ui.en['contact.whatsapp_direct'], 'WhatsApp Direct Chat');
});

test('all 6 built pages with email render paired mailto href and visible email inside the same anchor', () => {
  const emailPages = [
    'index.html',
    path.join('en', 'index.html'),
    path.join('contacto', 'index.html'),
    path.join('en', 'contact', 'index.html'),
    path.join('aviso-de-privacidad', 'index.html'),
    path.join('en', 'privacy-policy', 'index.html'),
  ];

  for (const page of emailPages) {
    const html = readDistPage(page);
    const mailtoAnchors = [
      ...html.matchAll(/<a\b[^>]*\bhref="mailto:korexussoporte@gmail\.com"[^>]*>([\s\S]*?)<\/a>/gi),
    ];
    assert.ok(
      mailtoAnchors.length >= 1,
      `Expected at least one <a href="mailto:korexussoporte@gmail.com"> in ${page}`
    );

    const hasVisibleEmailInSameAnchor = mailtoAnchors.some(([, innerHtml]) =>
      stripHtmlTags(innerHtml).includes('korexussoporte@gmail.com')
    );
    assert.ok(
      hasVisibleEmailInSameAnchor,
      `Expected visible text "korexussoporte@gmail.com" inside <a href="mailto:korexussoporte@gmail.com"> in ${page}`
    );
  }
});

test('all 4 built pages with WhatsApp render external wa.me/59171085116 links with security attributes', () => {
  const whatsappPages = [
    'index.html',
    path.join('en', 'index.html'),
    path.join('contacto', 'index.html'),
    path.join('en', 'contact', 'index.html'),
  ];

  for (const page of whatsappPages) {
    const html = readDistPage(page);
    const waLinks = [...html.matchAll(/<a\b[^>]*\bhref="https:\/\/wa\.me\/59171085116"[^>]*>/gi)];
    assert.ok(
      waLinks.length >= 1,
      `Expected at least one <a href="https://wa.me/59171085116"> in ${page}`
    );

    for (const [tag] of waLinks) {
      assert.match(tag, /\btarget="_blank"/, `Expected target="_blank" on WhatsApp link in ${page}`);
      assert.match(
        tag,
        /\brel="noopener noreferrer"/,
        `Expected rel="noopener noreferrer" on WhatsApp link in ${page}`
      );
    }
  }
});

test('built contact pages render localized WhatsApp direct chat label', () => {
  const esContactHtml = readDistPage(path.join('contacto', 'index.html'));
  assert.match(esContactHtml, /WhatsApp Chat Directo/);

  const enContactHtml = readDistPage(path.join('en', 'contact', 'index.html'));
  assert.match(enContactHtml, /WhatsApp Direct Chat/);
  assert.doesNotMatch(enContactHtml, /WhatsApp Chat Directo/);
});

test('recursive sweep over src/ finds zero legacy contact strings', () => {
  const srcDir = path.resolve('src');
  assert.ok(fs.existsSync(srcDir), 'Expected src/ directory to exist');
  const srcFiles = walkFiles(srcDir);
  assert.ok(srcFiles.length > 0, 'Expected files inside src/');

  for (const filePath of srcFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(process.cwd(), filePath);
    for (const legacy of FORBIDDEN_LEGACY_STRINGS) {
      assert.equal(
        content.includes(legacy),
        false,
        `Unexpected legacy contact string "${legacy}" in ${relPath}`
      );
    }
  }
});

test('recursive sweep over dist/ HTML pages (min 12) finds zero legacy contact strings', () => {
  const distDir = path.resolve('dist');
  assert.ok(fs.existsSync(distDir), 'Expected dist/ directory to exist');
  const htmlFiles = walkFiles(distDir, (filePath) => filePath.endsWith('.html'));
  assert.ok(
    htmlFiles.length >= 12,
    `Expected at least 12 HTML pages in dist/, found ${htmlFiles.length}`
  );

  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(process.cwd(), filePath);
    for (const legacy of FORBIDDEN_LEGACY_STRINGS) {
      assert.equal(
        content.includes(legacy),
        false,
        `Unexpected legacy contact string "${legacy}" in ${relPath}`
      );
    }
  }
});
