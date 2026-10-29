// The task clock: advance() / stepClock(), tick sub-steps, ended() from ticks, overlay scheduling and expiry,
// site.pauseOnOverlay and the initial overlay.
import test from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './stubdom.mjs';
import { lineTask, same } from './fixtures.mjs';

// A timed task that records every tick's dt and task time.
function timedTask(over = {}) {
  const ticks = [];
  const fam = lineTask({
    tick(m, s, dt, now) {
      ticks.push([dt, now]);
      return { ...m, t: (m.t || 0) + dt };
    },
    ...over,
  });
  return { fam, ticks };
}
const overlayState = (env) => env.state().episode.overlay;

test('untimed tasks: the clock moves, no tick', () => {
  const { env } = testEnv({ task: lineTask() });
  env.reset(0, {});
  assert.equal(env.timed, false);
  env.stepClock();
  env.stepClock();
  assert.deepEqual([env.clockMs, env.taskMs, env._rt.clock.steps === 2], [2000, 2000, true]);
});

test('ticks run in tickMs sub-steps (default 50), stepMs per action', () => {
  const { fam, ticks } = timedTask();
  const { env } = testEnv({ task: fam });
  env.reset(0, { stepms: '200' });
  env.stepClock();
  same(ticks, [[50, 50], [50, 100], [50, 150], [50, 200]]);
  assert.equal(env.model.t, 200);
  const b = timedTask({ tickMs: 300 });
  const e2 = testEnv({ task: b.fam }).env;
  e2.reset(0, {});
  e2.advance(700);
  same(b.ticks, [[300, 300], [300, 600], [100, 700]]);
});

test('ended() in a tick stops the clock and ends the episode', () => {
  const { fam, ticks } = timedTask({ ended: (m) => m.t >= 120 && 'timeout' });
  const { env } = testEnv({ task: fam });
  env.reset(0, {});
  env.stepClock();
  assert.equal(ticks.length, 3);
  assert.deepEqual([env.done, env.status().end_reason], [true, 'timeout']);
  const before = env.clockMs;
  env.stepClock();
  assert.equal(env.clockMs, before);
});

test('clock=real: stepClock does not move task time', () => {
  const { fam, ticks } = timedTask();
  const { env } = testEnv({ task: fam });
  env.reset(0, { clock: 'real' });
  assert.equal(env.clockMode, 'real');
  env.stepClock();
  assert.deepEqual([ticks.length, env.clockMs], [0, 0]);
});

test('a perturbation overlay shows at perturbAt x stepMs and stays until dismissed', () => {
  const { env } = testEnv({ task: lineTask() });
  env.reset(0, { popups: 'cookie', popupAt: 2 });
  same(overlayState(env), { kind: 'cookie', shown: false, gone: false });
  env.stepClock();
  assert.equal(overlayState(env).shown, false);
  env.stepClock();
  assert.equal(overlayState(env).shown, true);
  for (let i = 0; i < 5; i++) env.stepClock();
  assert.equal(overlayState(env).gone, false);
  env.dismissOverlay();
  assert.equal(overlayState(env).gone, true);
  const ev = env.events().filter((e) => e.type.startsWith('overlay')).map(({ type, kind, how }) => [type, kind, how]);
  same(ev, [['overlay', 'cookie', undefined], ['overlay-dismiss', 'cookie', 'button']]);
});

test('perturbAt 0 shows at reset; a toast expires after ttlSteps actions', () => {
  const { env } = testEnv({ task: lineTask() });
  env.reset(0, { popups: 'toast', popupAt: 0 });
  assert.equal(overlayState(env).shown, true);
  env.stepClock();
  env.stepClock();
  assert.equal(overlayState(env).gone, false);
  env.stepClock();
  assert.equal(overlayState(env).gone, true);
  assert.equal(env.events().find((e) => e.type === 'overlay-dismiss').how, 'expired');
});

test('the site overlay() gets kind, lang and a dismiss callback, and must return { el, dismiss }', () => {
  let got;
  const { env } = testEnv({ task: lineTask(), site: { name: 'base', langs: ['de'] } });
  const base = env.siteDef.overlay;
  env.siteDef.overlay = (ctx) => { got = ctx; return base(ctx); };
  env.reset(0, { popups: 'promo', popupAt: 0, pageLanguage: 'de' });
  assert.deepEqual([got.kind, got.initial, got.lang, got.locale], ['promo', false, 'de', 'de-DE']);
  got.dismiss();
  assert.equal(overlayState(env).gone, true);
  env.siteDef.overlay = () => ({ el: null });
  assert.throws(() => env.reset(0, { popups: 'promo', popupAt: 0 }), /must return/);
});

test('dragSteps=split: an overlay due while the button is held waits for the release', () => {
  const { env } = testEnv({ task: lineTask() });
  env.reset(0, { popups: 'chat', popupAt: 1, dragSteps: 'split' });
  env.lastPointer = { clientX: 0, clientY: 0, buttons: 1 };
  env.stepClock();
  assert.equal(overlayState(env).shown, false);
  env.lastPointer.buttons = 0;
  env.stepClock();
  assert.equal(overlayState(env).shown, true);
});

test('reset releases a button the last episode left held (native drag: no pointerup)', () => {
  const { env } = testEnv({ task: lineTask() });
  env.reset(0, { dragSteps: 'split' });
  env.lastPointer = { clientX: 3, clientY: 4, buttons: 1 };
  env.reset(0, { popups: 'chat', popupAt: 1, dragSteps: 'split' });
  same(env.lastPointer, { clientX: 3, clientY: 4, buttons: 0 });
  env.stepClock();
  assert.equal(overlayState(env).shown, true);
});

test('pauseOnOverlay: task time stops while an overlay shows and for the dismissing action', () => {
  const { fam, ticks } = timedTask();
  const { env } = testEnv({ task: fam, site: { pauseOnOverlay: true } });
  env.reset(0, { popups: 'cookie', popupAt: 1 });
  env.stepClock(); // 0..1000: the overlay shows at the end
  assert.deepEqual([env.clockMs, env.taskMs], [1000, 1000]);
  env.stepClock();
  assert.deepEqual([env.clockMs, env.taskMs], [2000, 1000]);
  env.dismissOverlay();
  env.stepClock(); // the dismissing action is free
  assert.deepEqual([env.clockMs, env.taskMs], [3000, 1000]);
  env.stepClock();
  assert.deepEqual([env.clockMs, env.taskMs], [4000, 2000]);
  assert.equal(ticks.length, 40);
});

test('pauseOnOverlay: an expiring toast does not make the next action free', () => {
  const { env } = testEnv({ task: timedTask().fam, site: { pauseOnOverlay: true } });
  env.reset(0, { popups: 'toast', popupAt: 0 });
  for (let i = 0; i < 3; i++) env.stepClock();
  assert.equal(overlayState(env).gone, true);
  env.stepClock();
  assert.equal(env.taskMs, 1000);
});

test('initialOverlay: shown at its step, suppressed by a literal popups=off, p draws its own stream', () => {
  const site = { initialOverlay: { kind: 'chat', at: 1 } };
  const { env } = testEnv({ task: lineTask(), site });
  env.reset(0, {});
  assert.equal(env.state().episode.initialOverlay.shown, false);
  env.stepClock();
  same(env.state().episode.initialOverlay, { kind: 'chat', shown: true, gone: false });
  env.reset(0, { popups: 'off' });
  assert.equal(env.state().episode.initialOverlay, null);
  env.reset(0, { popups: 'off:.5,cookie:.5' }); // weights are not a literal off
  assert.notEqual(env.state().episode.initialOverlay, null);
  const half = testEnv({ task: lineTask(), site: { initialOverlay: { kind: 'chat', p: 0.5 } } }).env;
  const shown = [];
  for (let seed = 0; seed < 20; seed++) {
    half.reset(seed, {});
    shown.push(!!half._rt.overlay.initial);
    half.reset(seed, { difficulty: 'easy', instructionNoise: 'typo' });
    assert.equal(!!half._rt.overlay.initial, shown[seed]);
  }
  assert.ok(shown.includes(true) && shown.includes(false));
});

test('dismissOverlay() takes the initial overlay first, then the perturbation', () => {
  const { env } = testEnv({ task: lineTask(), site: { initialOverlay: { kind: 'chat' } } });
  env.reset(0, { popups: 'cookie', popupAt: 0 });
  env.dismissOverlay();
  assert.deepEqual([env._rt.overlay.initial.gone, env._rt.overlay.perturb.gone], [true, false]);
  env.dismissOverlay();
  assert.equal(env._rt.overlay.perturb.gone, true);
});

test('tick() is stepClock + status + inputFeedback; bootInfo() is the setup read', () => {
  const { env } = testEnv({ task: lineTask() });
  env.reset(0, {});
  env.rejectInput('wheel', {});
  const t = env.tick();
  assert.deepEqual([env.clockMs, t.status.done, t.feedback.includes('wheel')], [1000, false, true]);
  assert.equal(env.tick().feedback, '');
  env.ready = true; // set by boot(), which the stub skips
  const boot = env.bootInfo();
  assert.deepEqual([boot.ready, boot.bootError, boot.goal === env.goal(), boot.scenario === env.spec.scenario], [true, null, true, true]);
  assert.equal(boot.status.progress, env.status().progress);
});
