// Kit helpers for widgets and sites: ctx.patch, util.css, env.ui.scrollPane and the content frame draws.
import test from 'node:test';
import assert from 'node:assert/strict';
import { testEnv, loadKit, element } from './stubdom.mjs';
import { lineTask, same } from './fixtures.mjs';

test('ctx.patch merges a partial model into the current one', () => {
  let ctx = null;
  const { env } = testEnv({
    task: lineTask({ init: () => ({ x: 10, note: 'a' }) }),
    widget: { render: (c) => { ctx = c; return { anchors: [] }; } },
  });
  env.reset(1, { startState: 'off' });
  ctx.patch({ note: 'b' });
  same(env.model, { x: 10, note: 'b' });
  ctx.patch({ x: 12 });
  same(env.model, { x: 12, note: 'b' });
});

test('util.css adds one <style id> to <head>, once', () => {
  const { win, env } = loadKit();
  const byId = (id) => win.document.head.children.find((n) => n.id === id) || null;
  win.document.getElementById = byId;
  const a = env.util.css('t-style', '.a { color: red; }');
  const b = env.util.css('t-style', '.b { color: blue; }');
  assert.equal(a, b);
  assert.equal(a.textContent, '.a { color: red; }');
  assert.equal(win.document.head.children.filter((n) => n.id === 't-style').length, 1);
});

test('scrollPane: wheel deltas in px, lines and pages; to() clamps and reports', () => {
  const { win, env } = loadKit();
  const pane = element(win, 'div', [0, 0, 100, 200]);
  pane.scrollTop = 0;
  for (const [k, v] of Object.entries({ clientHeight: 200, scrollHeight: 1000 })) Object.defineProperty(pane, k, { value: v });
  const seen = [];
  const sp = env.ui.scrollPane(pane, { onScroll: (px) => seen.push(px) });
  const wheel = (deltaY, deltaMode = 0) => {
    const e = { deltaY, deltaX: 0, deltaMode, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    for (const fn of pane._listeners.wheel) fn(e);
    return e.defaultPrevented;
  };
  assert.equal(wheel(30), true);
  assert.equal(sp.get(), 30);
  wheel(2, 1); // 2 lines x 40 px
  assert.equal(sp.get(), 110);
  wheel(1, 2); // 1 page = clientHeight
  assert.equal(sp.get(), 310);
  sp.to(5000);
  assert.equal(sp.get(), 800); // max = scrollHeight - clientHeight
  sp.to(-5);
  assert.equal(sp.get(), 0);
  same(seen, [30, 110, 310, 800, 0]);
  assert.throws(() => sp.locateThumb(), /has no thumb/);
});

test('content frame draws match the inline forms they replace', () => {
  const { env } = loadKit();
  const c = env.content;
  const r = () => new env.Rng(7);
  assert.equal(c.endLabel(r()), r().pick(c.END_LABELS));
  same(c.decoyLabels(r(), 2), r().sample(c.DECOY_LABELS, 2));
  same(c.bannerText(r(), 'cookie'), r().pick(c.BANNER_TEXTS.cookie));
  assert.throws(() => c.bannerText(r(), 'nope'), /no banner kind/);
  for (let seed = 0; seed < 50; seed++) {
    const label = c.END_LABELS[seed % c.END_LABELS.length];
    const other = c.collideLabel(new env.Rng(seed), label.toUpperCase());
    assert.ok(c.END_LABELS.includes(other));
    assert.notEqual(other.toLowerCase(), label.toLowerCase());
  }
});
