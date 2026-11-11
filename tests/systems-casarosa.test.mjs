import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ui } from '../src/i18n/ui.ts';

function readDistPage(relativePath) {
  const fullPath = path.resolve('dist', relativePath);
  assert.ok(fs.existsSync(fullPath), `Expected built page to exist: ${relativePath}`);
  return fs.readFileSync(fullPath, 'utf-8');
}

function extractSection(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  assert.notEqual(start, -1, `Marker not found: ${startMarker}`);
  const end = html.indexOf(endMarker, start);
  assert.notEqual(end, -1, `End marker not found: ${endMarker}`);
  return html.slice(start, end);
}

test('i18n systems.s1 keys define Casa Rosa metadata in es and en', () => {
  assert.equal(ui.es['systems.s1.tag'], 'Web App');
  assert.equal(ui.en['systems.s1.tag'], 'Web App');
  assert.equal(ui.es['systems.s1.meta'], 'Producción 2026');
  assert.equal(ui.en['systems.s1.meta'], 'Production 2026');
  assert.equal(ui.es['systems.s1.title'], 'Casa Rosa — Cafetería y Pastelería');
  assert.equal(ui.en['systems.s1.title'], 'Casa Rosa — Café & Artisanal Bakery');
  assert.match(ui.es['systems.s1.desc'], /catálogo de productos estrella/);
  assert.match(ui.es['systems.s1.desc'], /WhatsApp/);
  assert.match(ui.en['systems.s1.desc'], /star-product catalog/);
  assert.match(ui.en['systems.s1.desc'], /WhatsApp ordering/);
});

test('ES homepage SystemsSection renders Casa Rosa card with live link above stretched card link', () => {
  const html = readDistPage('index.html');
  const systemsSection = extractSection(html, 'id="sistemas"', '</section>');
  const system1 = extractSection(html, '<!-- System 1: Public -->', '<!-- System 2: Private -->');
  const system2 = extractSection(html, '<!-- System 2: Private -->', '</section>');

  assert.match(system1, /Casa Rosa — Cafetería y Pastelería/);
  assert.match(system1, /Web App/);
  assert.match(system1, /Producción 2026/);
  assert.match(system1, /href="\/sistemas\/sistema-uno"/);
  assert.match(system1, /<span class="absolute inset-0" aria-hidden="true"><\/span>/);

  const liveLinks = [...system1.matchAll(/<a\b[^>]*href="https:\/\/casarosa\.pages\.dev\/"[^>]*>/g)];
  assert.equal(liveLinks.length, 1, 'Expected 1 live Casa Rosa link on ES homepage');
  assert.match(liveLinks[0][0], /target="_blank"/);
  assert.match(liveLinks[0][0], /rel="noopener noreferrer"/);
  assert.match(liveLinks[0][0], /relative z-20/);

  assert.doesNotMatch(system1, /<!-- Actions -->\s*<div[^>]*relative z-20/);
  assert.match(
    system1,
    /<div[^>]*(?:aria-hidden="true"[^>]*pointer-events-none|pointer-events-none[^>]*aria-hidden="true")/
  );

  assert.match(system2, /Portal de Clientes y Cotizaciones/);
  assert.match(system2, /href="\/sistemas\/sistema-dos"/);
  assert.match(system2, /Acceso privado/);
  assert.doesNotMatch(system2, /casarosa\.pages\.dev/);

  assert.doesNotMatch(html, /https:\/\/casarosa\.pages\.dev\/[^\s"']+/);
  assert.doesNotMatch(systemsSection, /href="#"/);
});

test('EN homepage SystemsSection renders Casa Rosa card with live link above stretched card link', () => {
  const html = readDistPage(path.join('en', 'index.html'));
  const systemsSection = extractSection(html, 'id="sistemas"', '</section>');
  const system1 = extractSection(html, '<!-- System 1: Public -->', '<!-- System 2: Private -->');
  const system2 = extractSection(html, '<!-- System 2: Private -->', '</section>');

  assert.match(system1, /Casa Rosa — Café &amp; Artisanal Bakery|Casa Rosa — Café & Artisanal Bakery/);
  assert.match(system1, /Web App/);
  assert.match(system1, /Production 2026/);
  assert.match(system1, /href="\/en\/systems\/system-one"/);
  assert.match(system1, /<span class="absolute inset-0" aria-hidden="true"><\/span>/);

  const liveLinks = [...system1.matchAll(/<a\b[^>]*href="https:\/\/casarosa\.pages\.dev\/"[^>]*>/g)];
  assert.equal(liveLinks.length, 1, 'Expected 1 live Casa Rosa link on EN homepage');
  assert.match(liveLinks[0][0], /target="_blank"/);
  assert.match(liveLinks[0][0], /rel="noopener noreferrer"/);
  assert.match(liveLinks[0][0], /relative z-20/);

  assert.doesNotMatch(system1, /<!-- Actions -->\s*<div[^>]*relative z-20/);
  assert.match(
    system1,
    /<div[^>]*(?:aria-hidden="true"[^>]*pointer-events-none|pointer-events-none[^>]*aria-hidden="true")/
  );

  assert.match(system2, /Client Portal &amp; Estimations Hub|Client Portal & Estimations Hub/);
  assert.match(system2, /href="\/en\/systems\/system-two"/);
  assert.match(system2, /Private access/);
  assert.doesNotMatch(system2, /casarosa\.pages\.dev/);

  assert.doesNotMatch(html, /https:\/\/casarosa\.pages\.dev\/[^\s"']+/);
  assert.doesNotMatch(systemsSection, /href="#"/);
});

test('ES case study page renders Casa Rosa content and 2 live links', () => {
  const html = readDistPage(path.join('sistemas', 'sistema-uno', 'index.html'));

  assert.match(html, /Casa Rosa/);
  assert.match(html, /Vallegrande, Bolivia/);
  assert.match(html, /WhatsApp/);
  assert.match(html, /Objetivo del proyecto/);
  assert.match(html, /Qué construyó Korexus/);
  assert.match(html, /Vista previa en vivo/);
  assert.match(html, /href="\/#sistemas"/);
  assert.match(html, /href="\/contacto"/);

  const liveLinks = [...html.matchAll(/<a\b[^>]*href="https:\/\/casarosa\.pages\.dev\/"[^>]*>/g)];
  assert.equal(liveLinks.length, 2, 'Expected 2 live links on ES case study page');
  for (const [tag] of liveLinks) {
    assert.match(tag, /target="_blank"/);
    assert.match(tag, /rel="noopener noreferrer"/);
  }
});

test('EN case study page renders Casa Rosa content and 2 live links', () => {
  const html = readDistPage(path.join('en', 'systems', 'system-one', 'index.html'));

  assert.match(html, /Casa Rosa/);
  assert.match(html, /Vallegrande, Bolivia/);
  assert.match(html, /WhatsApp/);
  assert.match(html, /Project Objective/);
  assert.match(html, /What Korexus Built/);
  assert.match(html, /Live Preview/);
  assert.match(html, /href="\/en\/#sistemas"/);
  assert.match(html, /href="\/en\/contact"/);

  const liveLinks = [...html.matchAll(/<a\b[^>]*href="https:\/\/casarosa\.pages\.dev\/"[^>]*>/g)];
  assert.equal(liveLinks.length, 2, 'Expected 2 live links on EN case study page');
  for (const [tag] of liveLinks) {
    assert.match(tag, /target="_blank"/);
    assert.match(tag, /rel="noopener noreferrer"/);
  }
});

test('Casa Rosa case study pages render without internal subpaths or href="#"', () => {
  const pages = [
    path.join('sistemas', 'sistema-uno', 'index.html'),
    path.join('en', 'systems', 'system-one', 'index.html'),
  ];

  for (const page of pages) {
    const html = readDistPage(page);
    assert.doesNotMatch(
      html,
      /https:\/\/casarosa\.pages\.dev\/[^\s"']+/,
      `Unexpected internal subpath under https://casarosa.pages.dev/ in ${page}`
    );
    assert.doesNotMatch(html, /href="#"/, `Unexpected placeholder href="#" in ${page}`);
  }
});
