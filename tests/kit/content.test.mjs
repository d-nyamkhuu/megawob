// env.content eval split (csplit): heldout episodes never fall back to training text, and helpers that build
// text from banks draw every part from the requested split.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadKit } from './stubdom.mjs';

const { env } = loadKit();
const C = env.content;

test('split: a bank of 10+ items with no heldout hash still has a heldout part, disjoint from train', () => {
  const list = C.BANNER_TEXTS.notice;
  assert.ok(list.length >= 10 && !list.some(C.isHeldout));
  const held = C.split(list, 'heldout');
  const train = C.split(list, 'train');
  assert.equal(held.length, 1);
  assert.equal(held.length + train.length, list.length);
  assert.ok(!train.includes(held[0]));
  // Short lists (formats, enums) keep the whole list for both parts.
  const short = ['a', 'b', 'c'].filter((x) => !C.isHeldout(x));
  if (short.length === 3) assert.deepEqual(C.split(short, 'heldout'), short);
});

test('fileName draws its words, last names and companies from the requested split', () => {
  const parts = (csplit) => new Set([...C.split(C.LAST_NAMES, csplit), ...C.split(C.COMPANIES, csplit)]
    .map((x) => C.ascii(x).split(' ')[0].replace(/[^A-Za-z]/g, '')));
  const train = parts('train');
  const held = parts('heldout');
  const onlyHeld = [...held].filter((x) => !train.has(x));
  const onlyTrain = [...train].filter((x) => !held.has(x));
  let sawHeld = 0;
  for (let s = 0; s < 400; s++) {
    const words = (n) => n.split(/[^A-Za-z]+/);
    const h = C.fileName(new env.Rng(s), 'pdf', { csplit: 'heldout' });
    const t = C.fileName(new env.Rng(s), 'pdf');
    assert.ok(!words(h).some((w) => onlyTrain.includes(w)), h);
    assert.ok(!words(t).some((w) => onlyHeld.includes(w)), t);
    if (words(h).some((w) => onlyHeld.includes(w))) sawHeld++;
  }
  assert.ok(sawHeld > 20);
});
