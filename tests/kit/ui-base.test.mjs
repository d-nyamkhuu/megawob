// env.ui._base: the helpers the kit/ui primitive files share (kit/ui/_base.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadKit, element } from './stubdom.mjs';
import { same } from './fixtures.mjs';

const { win, env } = loadKit();
const b = env.ui._base;

test('_base is not listed among the primitives', () => {
  assert.ok(b);
  assert.ok(!Object.keys(env.ui).includes('_base'));
  assert.ok(Object.keys(env.ui).includes('slider'));
});

test('val: functions are called; a default replaces only null or undefined, and only when given', () => {
  assert.equal(b.val(() => 3), 3);
  assert.equal(b.val(0, 5), 0);
  assert.equal(b.val(undefined, 5), 5);
  assert.equal(b.val(null, 5), 5);
  assert.equal(b.val(null), null);
});

test('angles: 0 = 12 o\'clock, clockwise; polar and angleAt are inverse', () => {
  same(b.polar([0, 0], 10, 90).map((v) => Math.round(v * 1e9) / 1e9), [10, 0]);
  assert.equal(b.angleAt([0, 0], [0, -10]), 0);
  assert.equal(b.angleAt([0, 0], [10, 0]), 90);
  assert.equal(b.wrap180(-180), 180);
  assert.equal(b.wrap180(270), -90);
  assert.equal(b.mod360(-30), 330);
});

test('rects: toRect normalizes every shape; mid is its centre', () => {
  const want = { x: 1, y: 2, w: 3, h: 4 };
  same(b.toRect([1, 2, 3, 4]), want);
  same(b.toRect({ x: 1, y: 2, w: 3, h: 4 }), want);
  same(b.toRect({ left: 1, top: 2, width: 3, height: 4 }), want);
  same(b.toRect({ left: 1, top: 2, right: 4, bottom: 6 }), want);
  same(b.mid(want), [2.5, 4]);
  assert.throws(() => b.toRect({ a: 1 }), /not a rect/);
});

test('centres: visibleCenter is null off screen; where() throws with the label', () => {
  const el = element(win, 'div', [10, 20, 30, 40]);
  same(b.center(el), [25, 40]);
  same(b.where(el, 'thumb'), [25, 40]);
  const empty = element(win, 'div', [0, 0, 0, 0]);
  assert.equal(b.visibleCenter(empty), null);
  assert.throws(() => b.where(empty, 'thumb'), /env\.ui: thumb is not rendered/);
});

test('onKeys: mapped keys run and prevent the default unless the handler returns false', () => {
  const el = element(win, 'div', [0, 0, 10, 10]);
  const seen = [];
  const detach = b.onKeys(el, { a: () => seen.push('a'), b: () => false });
  const fire = (key) => {
    const e = { key, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const fn of el._listeners.keydown || []) fn(e);
    return e.defaultPrevented;
  };
  assert.equal(fire('a'), true);
  assert.equal(fire('b'), false);
  assert.equal(fire('toString'), false);
  detach();
  assert.equal(fire('a'), false);
  same(seen, ['a']);
});
