import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';

const BG_COMPONENT_PATH = path.resolve('src/components/HeroTypographyBackground.astro');
const HERO_COMPONENT_PATH = path.resolve('src/components/Hero.astro');
const DIST_ES_PATH = path.resolve('dist/index.html');
const DIST_EN_PATH = path.resolve('dist/en/index.html');

function extractScriptFromAstro(source) {
  const match = source.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, 'Expected <script> tag inside HeroTypographyBackground.astro');
  return stripTypeScriptTypes(match[1], { mode: 'strip' });
}

function createEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent(event) {
      const set = listeners.get(event.type);
      if (!set) return;
      for (const fn of [...set]) {
        fn(event);
      }
    },
    listenerCount(type) {
      return listeners.get(type)?.size ?? 0;
    },
  };
}

function createHeroBackgroundHarness({
  width = 1024,
  height = 144,
  dpr = 2,
  reducedMotion = false,
  charWidthRatio = 0.85,
} = {}) {
  const source = fs.readFileSync(BG_COMPONENT_PATH, 'utf-8');
  const jsCode = extractScriptFromAstro(source);

  let nowMs = 1000;
  let nextRafId = 1;
  const rafQueue = new Map();
  const cancelledRafIds = [];
  const stateStack = [];

  const drawHistory = [];
  let currentDraw = null;
  const setTransformCalls = [];
  const measureTextCalls = [];

  const ctx = {
    font: '',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    globalAlpha: 1,
    setTransform(...args) {
      setTransformCalls.push(args);
    },
    clearRect() {
      currentDraw = { fillTexts: [], strokeTexts: [], gradients: [] };
      drawHistory.push(currentDraw);
    },
    save() {
      stateStack.push({
        font: this.font,
        textAlign: this.textAlign,
        textBaseline: this.textBaseline,
        shadowColor: this.shadowColor,
        shadowBlur: this.shadowBlur,
        shadowOffsetX: this.shadowOffsetX,
        shadowOffsetY: this.shadowOffsetY,
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
        globalAlpha: this.globalAlpha,
      });
    },
    restore() {
      const prev = stateStack.pop();
      if (prev) Object.assign(this, prev);
    },
    measureText(text) {
      const sizeMatch = String(this.font).match(/(\d+(?:\.\d+)?)px/);
      const px = sizeMatch ? Number(sizeMatch[1]) : 16;
      const measuredWidth = px * text.length * charWidthRatio;
      measureTextCalls.push({ text, font: this.font, px, width: measuredWidth });
      return { width: measuredWidth };
    },
    fillText(text, x, y) {
      if (!currentDraw) {
        currentDraw = { fillTexts: [], strokeTexts: [], gradients: [] };
        drawHistory.push(currentDraw);
      }
      currentDraw.fillTexts.push({
        text,
        x,
        y,
        font: this.font,
        shadowColor: this.shadowColor,
        shadowBlur: this.shadowBlur,
        shadowOffsetX: this.shadowOffsetX,
        shadowOffsetY: this.shadowOffsetY,
        fillStyle: this.fillStyle,
        globalAlpha: this.globalAlpha,
      });
    },
    strokeText(text, x, y) {
      if (!currentDraw) {
        currentDraw = { fillTexts: [], strokeTexts: [], gradients: [] };
        drawHistory.push(currentDraw);
      }
      currentDraw.strokeTexts.push({
        text,
        x,
        y,
        font: this.font,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
        globalAlpha: this.globalAlpha,
      });
    },
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
      const stops = [];
      const grad = {
        x0,
        y0,
        r0,
        x1,
        y1,
        r1,
        stops,
        addColorStop(offset, color) {
          stops.push([offset, color]);
        },
      };
      currentDraw?.gradients.push(grad);
      return grad;
    },
  };

  let stageWidth = width;
  let stageHeight = height;

  const heroSection = {
    ...createEventTarget(),
    tagName: 'SECTION',
  };

  const stageEl = {
    ...createEventTarget(),
    getBoundingClientRect() {
      return { left: 0, top: 0, width: stageWidth, height: stageHeight };
    },
  };

  const canvas = {
    id: 'hero-typography-canvas',
    width: 0,
    height: 0,
    parentElement: stageEl,
    closest(selector) {
      return selector === 'section' ? heroSection : null;
    },
    getBoundingClientRect() {
      return { left: 0, top: 0, width: stageWidth, height: stageHeight };
    },
    getContext(kind) {
      return kind === '2d' ? ctx : null;
    },
  };

  const motionQuery = {
    ...createEventTarget(),
    matches: reducedMotion,
    media: '(prefers-reduced-motion: reduce)',
  };

  const documentTarget = createEventTarget();
  const documentMock = {
    getElementById(id) {
      return id === 'hero-typography-canvas' ? canvas : null;
    },
    addEventListener: documentTarget.addEventListener,
    removeEventListener: documentTarget.removeEventListener,
    dispatchEvent: documentTarget.dispatchEvent,
    listenerCount: documentTarget.listenerCount,
    fonts: { ready: Promise.resolve() },
  };

  const windowTarget = createEventTarget();
  const windowMock = {
    devicePixelRatio: dpr,
    matchMedia(query) {
      assert.equal(query, '(prefers-reduced-motion: reduce)');
      return motionQuery;
    },
    addEventListener: windowTarget.addEventListener,
    removeEventListener: windowTarget.removeEventListener,
    dispatchEvent: windowTarget.dispatchEvent,
    listenerCount: windowTarget.listenerCount,
  };

  const observers = [];
  class IntersectionObserverMock {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = [];
      this.disconnected = false;
      observers.push(this);
    }
    observe(el) {
      this.observed.push(el);
    }
    disconnect() {
      this.disconnected = true;
    }
    trigger(isIntersecting) {
      if (this.disconnected) return;
      this.callback([{ isIntersecting, target: this.observed[0] ?? heroSection }]);
    }
  }

  const sandbox = {
    document: documentMock,
    window: windowMock,
    performance: {
      now: () => nowMs,
    },
    requestAnimationFrame(cb) {
      const id = nextRafId++;
      rafQueue.set(id, cb);
      return id;
    },
    cancelAnimationFrame(id) {
      cancelledRafIds.push(id);
      rafQueue.delete(id);
    },
    IntersectionObserver: IntersectionObserverMock,
    Math,
    Number,
    Promise,
  };

  vm.runInNewContext(jsCode, sandbox);

  return {
    canvas,
    ctx,
    heroSection,
    stageEl,
    motionQuery,
    documentMock,
    windowMock,
    observers,
    drawHistory,
    setTransformCalls,
    measureTextCalls,
    rafQueue,
    cancelledRafIds,
    setStageSize(w, h) {
      stageWidth = w;
      stageHeight = h;
    },
    advanceFrame(dtMs = 32) {
      nowMs += dtMs;
      const entries = [...rafQueue.entries()];
      rafQueue.clear();
      for (const [, cb] of entries) {
        cb(nowMs);
      }
    },
    advanceFrames(count, dtMs = 32) {
      for (let i = 0; i < count; i++) {
        this.advanceFrame(dtMs);
      }
    },
  };
}

test('HeroTypographyBackground component exists with accessible canvas contract', () => {
  assert.ok(fs.existsSync(BG_COMPONENT_PATH), 'HeroTypographyBackground.astro must exist');
  const source = fs.readFileSync(BG_COMPONENT_PATH, 'utf-8');

  assert.match(source, /<canvas\b[^>]*id="hero-typography-canvas"/);
  assert.match(source, /<canvas\b[^>]*aria-hidden="true"/);
  assert.match(source, /pointer-events-none/);
  assert.match(source, /const WORD = 'KOREXUS'/);
});

test('HeroTypographyBackground fits KOREXUS within 320px viewport using measureText', () => {
  const harness = createHeroBackgroundHarness({
    width: 320,
    height: 96,
    dpr: 2,
    charWidthRatio: 0.85,
  });

  assert.equal(harness.canvas.width, 640);
  assert.equal(harness.canvas.height, 192);
  assert.deepEqual(harness.setTransformCalls[0], [2, 0, 0, 2, 0, 0]);
  assert.ok(harness.measureTextCalls.length >= 1, 'measureText must be called');
  assert.equal(harness.measureTextCalls[0].text, 'KOREXUS');

  const lastDraw = harness.drawHistory.at(-1);
  assert.ok(lastDraw && lastDraw.fillTexts.length >= 3, 'draw() must render shadow, base, and glow text passes');

  const fontMatch = lastDraw.fillTexts[0].font.match(/(\d+(?:\.\d+)?)px/);
  assert.ok(fontMatch, 'draw() must set pixel font size');
  const finalFontSize = Number(fontMatch[1]);

  // Initial fontSize = floor(min(320*0.16=51.2, 96*0.72=69.12, 165)) = 51.
  // Measured width = 51 * 7 * 0.85 = 303.45 > 320 * 0.88 (281.6) => scaled down to 47px.
  assert.ok(finalFontSize >= 16 && finalFontSize < 51, `Expected scaled fontSize in [16, 51), got ${finalFontSize}`);
  assert.ok(finalFontSize * 7 * 0.85 <= 320 * 0.88 + 1, 'Fitted text must fit inside 88% of 320px width');
});

test('HeroTypographyBackground reacts to pointerdown and pointermove with directional shadow', () => {
  const harness = createHeroBackgroundHarness({ width: 1000, height: 144, dpr: 1 });
  const observer = harness.observers[0];
  assert.ok(observer, 'IntersectionObserver must be created');
  observer.trigger(true);

  // Light on far right & top => text at center (500, 74.88) casts shadow left (shadowOffsetX < 0) & down (shadowOffsetY > 0)
  harness.heroSection.dispatchEvent({
    type: 'pointerdown',
    clientX: 950,
    clientY: 10,
  });
  harness.advanceFrames(20, 32);

  const afterPointerDown = harness.drawHistory.at(-1).fillTexts[0];
  assert.equal(afterPointerDown.text, 'KOREXUS');
  assert.ok(afterPointerDown.shadowOffsetX < -1, `Expected negative shadowOffsetX, got ${afterPointerDown.shadowOffsetX}`);
  assert.ok(afterPointerDown.shadowOffsetY > 0.5, `Expected positive shadowOffsetY, got ${afterPointerDown.shadowOffsetY}`);

  // Light on far left & bottom => shadow casts right (shadowOffsetX > 0) & up (shadowOffsetY < 0)
  harness.heroSection.dispatchEvent({
    type: 'pointermove',
    clientX: 50,
    clientY: 135,
  });
  harness.advanceFrames(20, 32);

  const afterPointerMove = harness.drawHistory.at(-1).fillTexts[0];
  assert.ok(afterPointerMove.shadowOffsetX > 1, `Expected positive shadowOffsetX, got ${afterPointerMove.shadowOffsetX}`);
  assert.ok(afterPointerMove.shadowOffsetY < -0.5, `Expected negative shadowOffsetY, got ${afterPointerMove.shadowOffsetY}`);
});

test('HeroTypographyBackground respects prefers-reduced-motion initially and on media change', () => {
  const reducedHarness = createHeroBackgroundHarness({ reducedMotion: true });
  assert.equal(reducedHarness.drawHistory.length, 1, 'Static initial frame must still render');
  reducedHarness.observers[0].trigger(true);
  assert.equal(reducedHarness.rafQueue.size, 0, 'Must not schedule rAF when prefers-reduced-motion is reduce');

  const dynamicHarness = createHeroBackgroundHarness({ reducedMotion: false });
  dynamicHarness.observers[0].trigger(true);
  assert.equal(dynamicHarness.rafQueue.size, 1, 'rAF loop starts when visible and motion allowed');

  const drawsBeforeChange = dynamicHarness.drawHistory.length;
  dynamicHarness.motionQuery.matches = true;
  dynamicHarness.motionQuery.dispatchEvent({ type: 'change' });
  assert.equal(dynamicHarness.rafQueue.size, 0, 'rAF loop must stop when reduced motion is enabled');
  assert.ok(dynamicHarness.cancelledRafIds.length >= 1, 'cancelAnimationFrame must be called');
  assert.equal(dynamicHarness.drawHistory.length, drawsBeforeChange + 1, 'Must redraw static frame on motion reduction');

  dynamicHarness.motionQuery.matches = false;
  dynamicHarness.motionQuery.dispatchEvent({ type: 'change' });
  assert.equal(dynamicHarness.rafQueue.size, 1, 'rAF loop resumes when reduced motion is disabled while visible');
});

test('HeroTypographyBackground manages IntersectionObserver visibility and astro:before-swap cleanup', () => {
  const harness = createHeroBackgroundHarness();
  const observer = harness.observers[0];
  assert.equal(harness.rafQueue.size, 0, 'rAF must wait until intersection observer reports visible');

  observer.trigger(true);
  assert.equal(harness.rafQueue.size, 1, 'rAF starts on intersection');

  observer.trigger(false);
  assert.equal(harness.rafQueue.size, 0, 'rAF pauses when scrolled out of view');
  assert.ok(harness.cancelledRafIds.length >= 1);

  observer.trigger(true);
  assert.equal(harness.rafQueue.size, 1, 'rAF resumes when scrolled back into view');

  assert.equal(harness.heroSection.listenerCount('pointermove'), 1);
  assert.equal(harness.heroSection.listenerCount('pointerdown'), 1);
  assert.equal(harness.heroSection.listenerCount('pointerleave'), 1);

  harness.documentMock.dispatchEvent({ type: 'astro:before-swap' });
  assert.equal(observer.disconnected, true, 'IntersectionObserver must disconnect on astro:before-swap');
  assert.equal(harness.rafQueue.size, 0, 'Active rAF must be cancelled on astro:before-swap');
  assert.equal(harness.heroSection.listenerCount('pointermove'), 0);
  assert.equal(harness.heroSection.listenerCount('pointerdown'), 0);
  assert.equal(harness.heroSection.listenerCount('pointerleave'), 0);
  assert.equal(harness.windowMock.listenerCount('resize'), 0);
  assert.equal(harness.motionQuery.listenerCount('change'), 0);
  assert.equal(harness.documentMock.listenerCount('astro:before-swap'), 0);
  assert.equal(harness.windowMock.listenerCount('pagehide'), 0);
});

test('HeroTypographyBackground handles BFCache pagehide and pageshow persisted true/false', () => {
  const harness = createHeroBackgroundHarness();
  const firstObserver = harness.observers[0];
  firstObserver.trigger(true);
  assert.equal(harness.rafQueue.size, 1);

  harness.windowMock.dispatchEvent({ type: 'pagehide' });
  assert.equal(firstObserver.disconnected, true, 'pagehide must disconnect observer');
  assert.equal(harness.rafQueue.size, 0, 'pagehide must cancel active rAF');
  assert.equal(harness.heroSection.listenerCount('pointermove'), 0);
  assert.equal(harness.windowMock.listenerCount('pagehide'), 0);

  const drawsAfterPagehide = harness.drawHistory.length;
  harness.windowMock.dispatchEvent({ type: 'pageshow', persisted: false });
  assert.equal(harness.observers.length, 1, 'pageshow with persisted:false must NOT reinitialize');
  assert.equal(harness.drawHistory.length, drawsAfterPagehide);
  assert.equal(harness.heroSection.listenerCount('pointermove'), 0);

  harness.windowMock.dispatchEvent({ type: 'pageshow', persisted: true });
  assert.equal(harness.observers.length, 2, 'pageshow with persisted:true must reinitialize');
  assert.equal(harness.drawHistory.length, drawsAfterPagehide + 1, 'Reinitialized instance must draw');
  assert.equal(harness.heroSection.listenerCount('pointermove'), 1);
  assert.equal(harness.heroSection.listenerCount('pointerdown'), 1);
  assert.equal(harness.windowMock.listenerCount('pagehide'), 1);

  harness.observers[1].trigger(true);
  assert.equal(harness.rafQueue.size, 1, 'Reinitialized instance must resume rAF when visible');
});

test('Hero.astro implements Option 1 layout without peach arch', () => {
  const heroSource = fs.readFileSync(HERO_COMPONENT_PATH, 'utf-8');

  assert.match(heroSource, /import HeroTypographyBackground from '\.\/HeroTypographyBackground\.astro';/);
  assert.match(heroSource, /<section\s+id="inicio"\s+class="[^"]*pb-10 sm:pb-14[^"]*"/);
  assert.doesNotMatch(heroSource, /<section\s+id="inicio"\s+class="[^"]*\bpb-0\b/);
  assert.doesNotMatch(heroSource, /pb-8 md:pb-0/);

  // Dedicated typography band between subtitle and action bar
  const subtitleIndex = heroSource.indexOf("{t('hero.subtitle')}");
  const stripMarkup = '<div class="relative w-full h-24 sm:h-32 md:h-36 my-4 sm:my-6 overflow-hidden">';
  const stripIndex = heroSource.indexOf(stripMarkup);
  const bgIndex = heroSource.indexOf('<HeroTypographyBackground />');
  const gridIndex = heroSource.indexOf('md:grid-cols-[1fr_auto_1fr] items-center');

  assert.ok(subtitleIndex !== -1, 'Subtitle must exist in Hero.astro');
  assert.ok(stripIndex !== -1, 'Dedicated typography band h-24 sm:h-32 md:h-36 must exist');
  assert.ok(bgIndex !== -1, '<HeroTypographyBackground /> must be rendered in Hero.astro');
  assert.ok(gridIndex !== -1, 'Action grid must use md:grid-cols-[1fr_auto_1fr] items-center');
  assert.ok(subtitleIndex < stripIndex && stripIndex < bgIndex && bgIndex < gridIndex, 'Typography band must sit between subtitle and action grid');

  // Flanks must not have pb-8
  assert.doesNotMatch(heroSource, /<div class="hidden md:block pb-8/);
  assert.doesNotMatch(heroSource, /<div class="pb-8 text-center/);

  // Total absence of peach arch
  assert.doesNotMatch(heroSource, /rounded-t-\[175px\]/);
  assert.doesNotMatch(heroSource, /h-\[160px\]\s+sm:h-\[190px\]/);

  // Dual dark action pill intact
  assert.match(heroSource, /bg-\[#141414\] p-1\.5 rounded-full flex items-center gap-2/);
  assert.match(heroSource, /href="#sistemas"/);
  assert.match(heroSource, /href=\{contactUrl\}/);
  assert.match(heroSource, /\{t\('hero\.cta_systems'\)\}/);
  assert.match(heroSource, /\{t\('hero\.cta_contact'\)\}/);
  assert.match(heroSource, /<ArrowUpRight/);
});

test('dist ES and EN HTML render Option 1 hero without peach arch', () => {
  assert.ok(fs.existsSync(DIST_ES_PATH), 'dist/index.html must exist');
  assert.ok(fs.existsSync(DIST_EN_PATH), 'dist/en/index.html must exist');

  const esHtml = fs.readFileSync(DIST_ES_PATH, 'utf-8');
  const enHtml = fs.readFileSync(DIST_EN_PATH, 'utf-8');

  const cases = [
    {
      label: 'ES (dist/index.html)',
      html: esHtml,
      ctaSystems: 'Ver sistemas',
      ctaContact: 'Contáctanos',
      contactHref: 'href="/contacto"',
    },
    {
      label: 'EN (dist/en/index.html)',
      html: enHtml,
      ctaSystems: 'Explore systems',
      ctaContact: 'Get in touch',
      contactHref: 'href="/en/contact"',
    },
  ];

  for (const { label, html, ctaSystems, ctaContact, contactHref } of cases) {
    assert.doesNotMatch(html, /rounded-t-\[175px\]/, `${label} must not contain peach arch rounded-t-[175px]`);
    assert.doesNotMatch(html, /h-\[160px\]/, `${label} must not contain h-[160px]`);
    assert.doesNotMatch(html, /sm:h-\[190px\]/, `${label} must not contain sm:h-[190px]`);

    const heroMatch = html.match(/<section\b[^>]*id="inicio"[^>]*>[\s\S]*?<\/section>/);
    assert.ok(heroMatch, `${label} must contain <section id="inicio">`);
    const heroHtml = heroMatch[0];

    assert.match(heroHtml, /<section\b[^>]*class="[^"]*pb-10 sm:pb-14[^"]*"/, `${label} #inicio must have pb-10 sm:pb-14`);
    assert.doesNotMatch(heroHtml, /<section\b[^>]*class="[^"]*\bpb-0\b/, `${label} #inicio must not have pb-0`);
    assert.doesNotMatch(heroHtml, /pb-8 md:pb-0/, `${label} #inicio must not have pb-8 md:pb-0`);

    assert.match(heroHtml, /h-24 sm:h-32 md:h-36/, `${label} must include dedicated typography strip classes`);
    assert.match(heroHtml, /<canvas\b[^>]*aria-hidden="true"[^>]*id="hero-typography-canvas"/, `${label} must render hero typography canvas`);
    assert.match(heroHtml, /md:grid-cols-\[1fr_auto_1fr\] items-center/, `${label} must center action grid`);
    assert.doesNotMatch(heroHtml, /\bpb-8\b/, `${label} #inicio flanks must not have pb-8`);

    const canvasPos = heroHtml.indexOf('id="hero-typography-canvas"');
    const pillPos = heroHtml.indexOf('bg-[#141414] p-1.5 rounded-full');
    assert.ok(canvasPos !== -1 && pillPos !== -1 && canvasPos < pillPos, `${label} canvas band must appear above action pill`);

    assert.match(heroHtml, /href="#sistemas"/, `${label} must preserve #sistemas link`);
    assert.ok(heroHtml.includes(contactHref), `${label} must preserve ${contactHref}`);
    assert.ok(heroHtml.includes(ctaSystems), `${label} must preserve "${ctaSystems}"`);
    assert.ok(heroHtml.includes(ctaContact), `${label} must preserve "${ctaContact}"`);
  }
});
