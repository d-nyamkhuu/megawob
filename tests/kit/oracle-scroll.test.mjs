// Optional locate point metadata reveals nested controls through ordinary, counted wheel actions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './stubdom.mjs';
import { lineTask, plain, same } from './fixtures.mjs';

function nested({ x = 450, y = 120, metadata = true, detached = false, inputs = ['pointer', 'wheel'] } = {}) {
  let pane, target;
  const point = () => {
    const p = [x - pane.scrollLeft, y - pane.scrollTop];
    return metadata ? Object.defineProperty(p, 'element', { value: target }) : p;
  };
  const { win, env } = testEnv({
    task: lineTask({ inputs, plan: () => ({ click: {} }) }),
    widget: {
      render(ctx) {
        pane = ctx.util.el('div', '', ctx.stage);
        pane._rect = { left: 100, top: 100, width: 200, height: 200 };
        for (const [key, value] of Object.entries({ clientLeft: 0, clientTop: 0, clientWidth: 200, clientHeight: 200,
          scrollWidth: 600, scrollHeight: 600 })) Object.defineProperty(pane, key, { value });
        target = ctx.util.el('button', '', pane);
        return { anchors: [] };
      },
      locate: point,
    },
  });
  const css = win.getComputedStyle;
  win.getComputedStyle = (el) => el === pane ? { overflowX: 'auto', overflowY: 'auto' } : css(el);
  win.document.hit = () => pane;
  env.reset(1, { startState: 'off' });
  if (detached) target.remove();
  return { env, pane, point };
}

test('horizontal and vertical inner panes scroll explicitly without changing offsets during oracle()', () => {
  for (const [x, y, dx, dy] of [[450, 120, 250, 0], [120, 450, 0, 250], [450, 450, 250, 250]]) {
    const { env, pane } = nested({ x, y });
    const first = plain(env.oracle());
    same(first, { type: 'wheel', at: [200, 200], dx, dy });
    assert.equal(pane.scrollLeft, 0);
    assert.equal(pane.scrollTop, 0);
    // The driver performs this separate action; the next call reads fresh target coordinates.
    pane.scrollLeft += dx;
    pane.scrollTop += dy;
    same(env.oracle(), { type: 'click', at: [x - dx, y - dy] });
  }
});

test('metadata is absent from serialized coordinates and detached targets do not trigger scrolling', () => {
  const { env, point } = nested();
  assert.equal(JSON.stringify(point()), '[450,120]');
  assert.deepEqual(Object.keys(point()), ['0', '1']);
  assert.equal(env.episode.scrollable, false); // inner panes do not opt into page scrolling
  same(nested({ detached: true }).env.oracle(), { type: 'click', at: [450, 120] });
});

test('ordinary coordinate arrays retain their existing behavior', () => {
  same(nested({ metadata: false }).env.oracle(), { type: 'click', at: [450, 120] });
});

test('a task without the wheel input gets the click, not an inner-pane wheel it would reject', () => {
  const { env, pane } = nested({ x: 450, y: 120, inputs: ['pointer'] });
  same(plain(env.oracle()), { type: 'click', at: [450, 120] });
  assert.equal(pane.scrollLeft, 0);
});
