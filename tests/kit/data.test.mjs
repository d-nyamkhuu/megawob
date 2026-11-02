// Pure helpers for task logic on env.util (kit/runtime/data.js, plus rng.js's hash32).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadKit } from './stubdom.mjs';
import { same } from './fixtures.mjs';

const { env } = loadKit();
const u = env.util;

test('lev: edit distance over strings or arrays, by index', () => {
  assert.equal(u.lev('kitten', 'sitting'), 3);
  assert.equal(u.lev('', 'abc'), 3);
  assert.equal(u.lev('abc', ''), 3);
  assert.equal(u.lev('same', 'same'), 0);
  assert.equal(u.lev('😀a', 'a'), 2); // UTF-16 units
  assert.equal(u.lev([...'😀a'], [...'a']), 1); // code points
});

test('clone: JSON deep copy', () => {
  const x = { a: [1, { b: 2 }], u: undefined };
  const c = u.clone(x);
  same(c, { a: [1, { b: 2 }] });
  c.a[1].b = 3;
  assert.equal(x.a[1].b, 2);
});

test('keepIdx: must indices plus one sample draw from the rest, ascending', () => {
  const r = () => new env.Rng(11);
  const rest = [0, 1, 2, 4, 5, 6, 8, 9];
  const want = [...new Set([3, 7, ...r().sample(rest, 3)])].sort((a, b) => a - b);
  same(u.keepIdx(r(), 10, [7, 3], 3), want);
  same(u.keepIdx(r(), 4, [1], 9), [0, 1, 2, 3]);
  same(u.keepIdx(r(), 4, [2], -1), [2]);
});

test('hash32: FNV-1a, unsigned', () => {
  assert.equal(u.hash32(''), 0x811c9dc5);
  assert.equal(u.hash32('a'), 0xe40c292c);
});

test('clamp, cap, quote, pad, nonEmpty, sameJson', () => {
  assert.equal(u.clamp(5, 0, 3), 3);
  assert.equal(u.clamp(-1, 0, 3), 0);
  assert.equal(u.clamp(2, 0, 3), 2);
  assert.equal(u.cap('word'), 'Word');
  assert.equal(u.cap(''), '');
  assert.equal(u.cap(undefined), undefined);
  assert.equal(u.quote('a b'), '"a b"');
  assert.equal(u.pad(7), '07');
  assert.equal(u.pad(7, 4), '0007');
  assert.equal(u.pad2(123), '123');
  assert.equal(u.nonEmpty(['a', 'b']), true);
  assert.equal(u.nonEmpty([]), false);
  assert.equal(u.nonEmpty(['a', ' ']), false);
  assert.equal(u.nonEmpty('a'), false);
  assert.equal(u.sameJson({ a: [1, 2] }, { a: [1, 2] }), true);
  assert.equal(u.sameJson({ a: 1, b: 2 }, { b: 2, a: 1 }), false); // key order counts, as JSON does
});

test('pickWeighted: one rng.pick from items repeated by weight', () => {
  const r = () => new env.Rng(5);
  const pool = ['a', 'a', 'b', 'c', 'c', 'c'];
  for (let i = 0; i < 5; i++) assert.equal(u.pickWeighted(new env.Rng(i), ['a', 'b', 'c'], { a: 2, c: 3 }), new env.Rng(i).pick(pool));
  assert.equal(u.pickWeighted(r(), ['x', 'y'], {}), r().pick(['x', 'y']));
});

test('reportFactsOf: the model facts, else those of the solved model unless the spec is judged', () => {
  const factsOf = (m) => (m.shown ? [{ label: 'n', value: String(m.n) }] : []);
  const solveOf = () => ({ shown: true, n: 7 });
  const facts = u.reportFactsOf(factsOf, solveOf);
  same(facts({ shown: true, n: 3 }, {}), [{ label: 'n', value: '3' }]);
  same(facts({ shown: false }, {}), [{ label: 'n', value: '7' }]);
  same(facts({ shown: false }, { judge: {} }), []);
});

test('civilToDays / daysToCivil: proleptic Gregorian, 1970-01-01 is day 0', () => {
  assert.equal(u.civilToDays(1970, 1, 1), 0);
  assert.equal(u.civilToDays(2000, 3, 1), 11017);
  same(u.daysToCivil(0), [1970, 1, 1]);
  same(u.daysToCivil(11016), [2000, 2, 29]);
  for (const n of [-800000, -1, 19000, 60000]) same(u.civilToDays(...u.daysToCivil(n)), n);
});

test('srgbToLab / deltaE00: white is L 100, identical colours differ by 0, the Sharma test pair', () => {
  const white = u.srgbToLab([255, 255, 255]);
  assert.ok(Math.abs(white[0] - 100) < 0.01 && Math.abs(white[1]) < 0.01 && Math.abs(white[2]) < 0.01);
  assert.equal(u.deltaE00([50, 2.6772, -79.7751], [50, 0, -82.7485]).toFixed(4), '2.0425');
  assert.equal(u.deltaE00(white, white), 0);
});
