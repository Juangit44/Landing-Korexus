import test from 'node:test';
import assert from 'node:assert/strict';
import { ui } from '../src/i18n/ui.ts';

test('i18n completeness: es and en have matching keys', () => {
  const esKeys = Object.keys(ui.es).sort();
  const enKeys = Object.keys(ui.en).sort();

  const missingInEn = esKeys.filter((key) => !(key in ui.en));
  const missingInEs = enKeys.filter((key) => !(key in ui.es));

  assert.deepEqual(missingInEn, [], `Keys missing in English: ${missingInEn.join(', ')}`);
  assert.deepEqual(missingInEs, [], `Keys missing in Spanish: ${missingInEs.join(', ')}`);
});
