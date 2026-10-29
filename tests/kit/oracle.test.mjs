// oracle(): plan steps to actions, overlays first, the end control or finish once within tau, judge messages and
// the dragSteps=split press / move / release sequence.
import test from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './stubdom.mjs';
import { lineTask, plain, same } from './fixtures.mjs';

const SUBMIT = [600, 670];
const act = (env) => plain(env.oracle());
const moveTo = (env, x) => env._update({ ...env.model, x });

function episode(knobs = {}, over = {}) {
  const { win, env } = testEnv({ task: lineTask(over.task), site: over.site, widget: over.widget });
  env.reset(1, { startState: 'off', ...knobs });
  return { win, env, x: env.model.x, t: env.spec.target };
}

test('off target: the plan step; within tau: the end control, or finish without one', () => {
  let { env, x, t } = episode();
  same(act(env), { type: 'drag', from: [100 + x, 300], to: [100 + t, 300] });
  moveTo(env, t + 1);
  same(act(env), { type: 'click', at: SUBMIT });
  ({ env, t } = episode({ finishByMessage: '1' }));
  assert.equal(env.episode.finish, true);
  moveTo(env, t);
  same(act(env), { type: 'finish', message: 'Done.' }); // no judge modes or facts: no reply format in the goal
  env.finish('Done.');
  assert.equal(env.oracle(), null);
});

test('plan step vocabulary', () => {
  const steps = [
    [{ click: { x: 1, y: 2 }, modifiers: ['Shift'] }, { type: 'click', at: [1, 2], modifiers: ['Shift'] }],
    [{ dblclick: { x: 1, y: 2 } }, { type: 'dblclick', at: [1, 2] }],
    [{ tripleclick: { x: 1, y: 2 } }, { type: 'tripleclick', at: [1, 2] }],
    [{ rightclick: { x: 1, y: 2 } }, { type: 'rightclick', at: [1, 2] }],
    [{ type: [{ x: 1, y: 2 }, 42] }, { type: 'type', at: [1, 2], text: '42' }],
    [{ key: 'Enter' }, { type: 'key', key: 'Enter' }],
    [{ move: { x: 1, y: 2 } }, { type: 'move', at: [1, 2] }],
    [{ down: { x: 1, y: 2 } }, { type: 'down', at: [1, 2] }],
    [{ up: { x: 1, y: 2 } }, { type: 'up', at: [1, 2] }],
    [{ wheel: [{ x: 1, y: 2 }, 120] }, { type: 'wheel', at: [1, 2], dx: 0, dy: 120 }],
    [{ path: [{ x: 1, y: 2 }, { x: 3, y: 4 }], modifiers: ['Alt'] }, { type: 'path', points: [[1, 2], [3, 4]], modifiers: ['Alt'] }],
    [{ wait: true }, { type: 'wait' }],
    [{ finish: true }, { type: 'click', at: SUBMIT }],
    [{ finish: true, message: 7 }, { type: 'click', at: SUBMIT }], // outside judge episodes the message is not used
  ];
  for (const [step, want] of steps) {
    const { env } = episode({}, { task: { plan: () => step } });
    same(act(env), want, JSON.stringify(step));
  }
  const { env } = episode({}, { task: { plan: () => null } });
  assert.equal(env.oracle(), null);
  const bad = episode({}, { task: { plan: () => ({ teleport: 1 }) } }).env;
  assert.throws(() => bad.oracle(), /unknown plan step/);
});

test('an open overlay is dismissed first; the one whose dismiss control is on top', () => {
  const { win, env, x, t } = episode({ popups: 'cookie', popupAt: 0 }, { site: { initialOverlay: { kind: 'chat' } } });
  // The default test overlay puts both dismiss controls at (100, 100); move the initial one.
  env._rt.overlay.initial.dismissEl._rect = { left: 190, top: 190, width: 20, height: 20 };
  same(act(env), { type: 'click', at: [200, 200] }); // nothing hit: the first open one (initial)
  win.document.hit = () => env._rt.overlay.perturb.dismissEl;
  same(act(env), { type: 'click', at: [100, 100] }); // the perturbation covers the initial overlay's button
  env.dismissOverlay('button', env._rt.overlay.perturb);
  win.document.hit = null;
  same(act(env), { type: 'click', at: [200, 200] });
  env.dismissOverlay();
  same(act(env), { type: 'drag', from: [100 + x, 300], to: [100 + t, 300] });
});

const judgeTask = {
  reply: true,
  judgeModes: ['ambiguous', 'impossible', 'confirm'],
  sample(rng, opts) {
    const spec = { scenario: 'a', target: rng.int(20, 80) };
    if (opts.judge) spec.judge = { mode: opts.judge, ...(opts.judge === 'impossible' ? { message: 'No such card.' } : {}) };
    return spec;
  },
  init: (spec, rng) => ({ x: spec.judge && spec.judge.mode !== 'confirm' ? spec.target : rng.int(0, 100) }),
};

test('judge episodes: ambiguous / impossible say so at once; confirm prepares, then asks (structured or free replies)', () => {
  for (const reply of ['structured', 'free']) {
    const parse = (env, m) => env.__kit.reply.parse(env, m);
    const run = (mode) => {
      const r = episode({ judgment: mode, replyFormat: reply }, { task: judgeTask });
      r.env.__kit = r.win.__megawobKit;
      return r;
    };
    for (const [mode, status] of [['ambiguous', 'ask'], ['impossible', 'impossible']]) {
      const { env } = run(mode);
      const a = act(env);
      assert.equal(a.type, 'finish');
      if (reply === 'structured') assert.equal(parse(env, a.message).status, status);
      env.finish(a.message);
      assert.equal(env.status().success, true, `${reply} ${mode}: ${a.message}`);
    }
    const { env, x, t } = run('confirm');
    same(act(env), { type: 'drag', from: [100 + x, 300], to: [100 + t, 300] });
    moveTo(env, t);
    const a = act(env);
    if (reply === 'structured') assert.equal(parse(env, a.message).status, 'confirm');
    else assert.equal(a.message, 'Everything is ready. Should I go ahead?');
    env.finish(a.message);
    assert.equal(env.status().success, true);
  }
});

test('dragSteps=split: down, move via the midpoint, up, each a separate action', () => {
  const { env, x, t } = episode({ dragSteps: 'split' });
  const a = [100 + x, 300];
  const b = [100 + t, 300];
  same(act(env), { type: 'down', at: a });
  same(act(env), { type: 'move', at: [(a[0] + b[0]) / 2, 300] });
  same(act(env), { type: 'up', at: b });
  moveTo(env, t);
  same(act(env), { type: 'click', at: SUBMIT });
});

test('dragSteps=split: a path moves in at most two actions; modifiers go on down and up', () => {
  const pts = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]].map(([x, y]) => ({ x, y }));
  const { env } = episode({ dragSteps: 'split' }, { task: { plan: () => ({ path: pts, modifiers: ['Shift'] }) } });
  same(act(env), { type: 'down', at: [0, 0], modifiers: ['Shift'] });
  same(act(env), { type: 'move', at: [2, 2], points: [[1, 1], [2, 2]] });
  same(act(env), { type: 'move', at: [4, 4], points: [[3, 3], [4, 4]] });
  same(act(env), { type: 'up', at: [5, 5], modifiers: ['Shift'] });
});

test('dragSteps=split: held steps are relocated when something scrolled and the whole step moved as one, kept otherwise', () => {
  let dy = 0;
  let wobble = 0;
  const widget = { locate: (p) => [p.x + (p.x > 150 ? wobble : 0), p.y + dy] };
  const { env, x, t, win } = episode({ dragSteps: 'split' }, { widget });
  const a = [100 + x, 300];
  const b = [100 + t, 300];
  act(env); // down
  dy = 40;
  win.dispatchEvent({ type: 'scroll' });
  same(act(env), { type: 'move', at: [(a[0] + b[0]) / 2, 340] });
  wobble = 25; // only some points moved: keep the stored ones
  same(act(env), { type: 'up', at: b });
});

test('dragSteps=split: a dragged item that follows the pointer is not taken for a scroll (no double move)', () => {
  let dy = 0;
  const widget = { locate: (p) => [p.x, p.y + dy] };
  const { env, x, t } = episode({ dragSteps: 'split' }, { widget });
  act(env); // down
  dy = 40; // every point shifted, but nothing scrolled: the item moved with the pointer
  same(act(env), { type: 'move', at: [100 + (x + t) / 2, 300] });
  same(act(env), { type: 'up', at: [100 + t, 300] });
});

test('dragSteps=split: an overlay due mid-drag waits; the held move comes first', () => {
  const { env } = episode({ dragSteps: 'split', popups: 'toast', popupAt: 1 });
  act(env); // down: held steps queued
  env.lastPointer = { clientX: 0, clientY: 0, buttons: 1 };
  env.stepClock();
  assert.equal(env._rt.overlay.perturb.shown, false);
  assert.equal(act(env).type, 'move');
});
