import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SVG_LINK = '<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2"';
const ICO_LINK = '<link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=2"';
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function assertFaviconLinksInOrder(html, label) {
  const svgIndex = html.indexOf(SVG_LINK);
  const icoIndex = html.indexOf(ICO_LINK);

  assert.notEqual(svgIndex, -1, `${label} must include ${SVG_LINK}`);
  assert.notEqual(icoIndex, -1, `${label} must include ${ICO_LINK}`);
  assert.ok(svgIndex < icoIndex, `${label} must place SVG favicon before ICO favicon`);
}

test('public/favicon.svg defines 64x64 dark rounded badge with official K strokes', () => {
  const svgPath = path.resolve('public/favicon.svg');
  const svg = fs.readFileSync(svgPath, 'utf-8');

  assert.match(svg, /viewBox="0 0 64 64"/, 'favicon.svg must have viewBox="0 0 64 64"');

  const rectMatch = svg.match(/<rect\b[^>]*>/);
  assert.ok(rectMatch, 'favicon.svg must contain a <rect> background');
  const rectTag = rectMatch[0];
  assert.match(rectTag, /\bwidth="64"/, 'background rect must have width="64"');
  assert.match(rectTag, /\bheight="64"/, 'background rect must have height="64"');
  assert.match(rectTag, /\brx="14"/, 'background rect must have rx="14"');
  assert.match(rectTag, /\bfill="#141414"/i, 'background rect must have fill="#141414"');

  const groupMatch = svg.match(
    /<g\s+transform="translate\(-68\.63,\s*-5\.48\)\s+scale\(0\.22\)"\s*>([\s\S]*?)<\/g>/
  );
  assert.ok(
    groupMatch,
    'favicon.svg must wrap K strokes in <g transform="translate(-68.63, -5.48) scale(0.22)">'
  );

  const groupContent = groupMatch[1];
  const paths = [...groupContent.matchAll(/<path\b[^>]*>/g)].map((m) => m[0]);
  assert.equal(paths.length, 4, `Expected exactly 4 K paths inside <g>, found ${paths.length}`);

  const fills = paths.map((tag) => {
    const fillMatch = tag.match(/\bfill="([^"]+)"/i);
    return fillMatch ? fillMatch[1].toUpperCase() : null;
  });

  assert.equal(fills.filter((c) => c === '#FD9851').length, 1, 'Expected 1 path with #FD9851');
  assert.equal(fills.filter((c) => c === '#FD7416').length, 1, 'Expected 1 path with #FD7416');
  assert.equal(fills.filter((c) => c === '#FCFCFC').length, 2, 'Expected 2 paths with #FCFCFC');

  assert.doesNotMatch(svg, /#FF0000/i, 'favicon.svg must not contain #FF0000');
  assert.doesNotMatch(svg, /#171717/i, 'favicon.svg must not contain #171717');
});

test('public/favicon.ico is a valid multi-resolution (32x32 and 48x48) PNG-encoded ICO', () => {
  const icoPath = path.resolve('public/favicon.ico');
  const buf = fs.readFileSync(icoPath);

  assert.ok(buf.length > 1000, `favicon.ico must not be the old 655B file (got ${buf.length}B)`);

  assert.equal(buf.readUInt16LE(0), 0, 'ICO reserved header bytes must be 0x0000');
  assert.equal(buf.readUInt16LE(2), 1, 'ICO type bytes must be 0x0001');
  assert.equal(buf.readUInt16LE(4), 2, 'ICO image count must be 2');

  const expectedSizes = [32, 48];
  const headerAndDirSize = 6 + expectedSizes.length * 16;
  assert.ok(buf.length > headerAndDirSize, 'ICO buffer too short for directory entries');

  const entries = expectedSizes.map((expectedSize, index) => {
    const entryOffset = 6 + index * 16;
    const width = buf[entryOffset];
    const height = buf[entryOffset + 1];
    const bytesInRes = buf.readUInt32LE(entryOffset + 8);
    const imageOffset = buf.readUInt32LE(entryOffset + 12);

    assert.equal(width, expectedSize, `Entry ${index} width must be ${expectedSize}`);
    assert.equal(height, expectedSize, `Entry ${index} height must be ${expectedSize}`);
    assert.ok(bytesInRes > 0, `Entry ${index} size must be positive`);
    assert.ok(
      imageOffset >= headerAndDirSize,
      `Entry ${index} offset (${imageOffset}) must be >= ${headerAndDirSize}`
    );
    assert.ok(
      imageOffset + bytesInRes <= buf.length,
      `Entry ${index} range [${imageOffset}, ${imageOffset + bytesInRes}) exceeds file length ${buf.length}`
    );

    const payload = buf.subarray(imageOffset, imageOffset + bytesInRes);
    assert.equal(
      Buffer.compare(payload.subarray(0, 8), PNG_SIGNATURE),
      0,
      `Entry ${index} payload must start with PNG signature`
    );

    const pngWidth = payload.readUInt32BE(16);
    const pngHeight = payload.readUInt32BE(20);
    assert.equal(pngWidth, expectedSize, `Entry ${index} PNG IHDR width must be ${expectedSize}`);
    assert.equal(pngHeight, expectedSize, `Entry ${index} PNG IHDR height must be ${expectedSize}`);

    return { imageOffset, bytesInRes };
  });

  assert.ok(
    entries[0].imageOffset + entries[0].bytesInRes <= entries[1].imageOffset ||
      entries[1].imageOffset + entries[1].bytesInRes <= entries[0].imageOffset,
    'ICO image payloads must not overlap'
  );
});

test('src/layouts/BaseLayout.astro links cache-busted SVG and ICO favicons in order', () => {
  const layoutPath = path.resolve('src/layouts/BaseLayout.astro');
  const layout = fs.readFileSync(layoutPath, 'utf-8');
  assertFaviconLinksInOrder(layout, 'src/layouts/BaseLayout.astro');
});

test('dist build outputs updated favicon links and exact favicon files', () => {
  const distIndexPath = path.resolve('dist/index.html');
  const distEnIndexPath = path.resolve('dist/en/index.html');
  const distSvgPath = path.resolve('dist/favicon.svg');
  const distIcoPath = path.resolve('dist/favicon.ico');

  assert.ok(fs.existsSync(distIndexPath), 'dist/index.html must exist (run build first)');
  assert.ok(fs.existsSync(distEnIndexPath), 'dist/en/index.html must exist (run build first)');
  assert.ok(fs.existsSync(distSvgPath), 'dist/favicon.svg must exist (run build first)');
  assert.ok(fs.existsSync(distIcoPath), 'dist/favicon.ico must exist (run build first)');

  assertFaviconLinksInOrder(fs.readFileSync(distIndexPath, 'utf-8'), 'dist/index.html');
  assertFaviconLinksInOrder(fs.readFileSync(distEnIndexPath, 'utf-8'), 'dist/en/index.html');

  assert.equal(
    Buffer.compare(
      fs.readFileSync(distSvgPath),
      fs.readFileSync(path.resolve('public/favicon.svg'))
    ),
    0,
    'dist/favicon.svg must match public/favicon.svg byte for byte'
  );

  assert.equal(
    Buffer.compare(
      fs.readFileSync(distIcoPath),
      fs.readFileSync(path.resolve('public/favicon.ico'))
    ),
    0,
    'dist/favicon.ico must match public/favicon.ico byte for byte'
  );
});
