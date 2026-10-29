// env.Rng: the seeded generator every episode draws from. Pinned values: a change here changes every episode.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadKit } from './stubdom.mjs';
import { same } from './fixtures.mjs';

const { env } = loadKit();

test('mulberry32 sequence is pinned', () => {
  const r = new env.Rng(42);
  same([r.next(), r.next(), r.next()], [0.6011037519201636, 0.44829055899754167, 0.8524657934904099]);
});

test('seed is taken as uint32', () => {
  assert.equal(new env.Rng(-1).seed, 4294967295);
  assert.equal(new env.Rng(2 ** 32 + 5).seed, 5);
});

test('fork seeds are FNV-1a of "<seed>/<label>" (pinned)', () => {
  assert.equal(new env.Rng(7).fork('a').seed, 1777808270);
  assert.equal(new env.Rng(7).fork('b').seed, 1761030651);
});

test('a fork does not depend on what the parent drew', () => {
  const a = new env.Rng(9);
  const b = new env.Rng(9);
  b.next();
  b.next();
  assert.equal(a.fork('x').next(), b.fork('x').next());
});

test('int is inclusive, float and bool stay in range', () => {
  const r = new env.Rng(3);
  const ints = new Set();
  for (let i = 0; i < 2000; i++) {
    const n = r.int(2, 5);
    assert.ok(Number.isInteger(n) && n >= 2 && n <= 5);
    ints.add(n);
    const f = r.float(-1, 1);
    assert.ok(f >= -1 && f < 1);
    assert.equal(typeof r.bool(0.3), 'boolean');
  }
  same([...ints].sort(), [2, 3, 4, 5]);
  assert.equal(new env.Rng(7).int(0, 1000), 11);
});

test('shuffle and sample are pinned and do not mutate the input', () => {
  const xs = [1, 2, 3, 4, 5, 6];
  same(new env.Rng(1).shuffle(xs), [5, 2, 6, 3, 1, 4]);
  same(xs, [1, 2, 3, 4, 5, 6]);
  const s = new env.Rng(1).sample(xs, 3);
  same(s, [5, 2, 6]);
  assert.equal(new Set(new env.Rng(5).sample(xs, 6)).size, 6);
});

test('pick draws one value', () => {
  const r = new env.Rng(11);
  const ref = new env.Rng(11);
  assert.equal(r.pick(['a', 'b', 'c']), ['a', 'b', 'c'][Math.floor(ref.next() * 3)]);
  assert.equal(r.next(), ref.next());
});
