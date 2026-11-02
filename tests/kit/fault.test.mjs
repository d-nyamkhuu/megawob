// fault (K1): miss swallows one stage press, revert undoes the first change, clear resets to the start model,
// hang shows a busy overlay the oracle waits out, shift re-renders under an inserted banner; the oracle still
// succeeds with every kind, and the knob off changes nothing. miss, revert and clear strike the 1st, 2nd or 3rd
// press / change (3:2:1, fork 'fault-when'; env._rt.fault.at); some tests pin it to the 1st.
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage, same } from './fixtures.mjs';

const first = (p) => { p.env._rt.fault.at = 1; return p; };
const kinds = (drawn) => drawn.filter((d) => d[0] === 'fault').map((d) => d[1]);

test('off: no watcher, no fault listeners, no fault records', async () => {
  const { env, fire, play } = await roundPage();
  assert.equal(env._rt.fault, null);
  assert.equal(env._rt.clock.last, null);
  assert.equal(fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, false);
  play();
  assert.equal(env.status().success, true);
  assert.equal(env.status().fault, null);
});

test('miss: the first stage press is swallowed with its click; presses outside the stage pass', async () => {
  const { env, fire } = first(await roundPage({ knobs: { pageFaults: 'miss' } }));
  assert.equal(fire('pointerdown', { clientX: 5, clientY: 5, buttons: 1 })._stopped, false); // header, not the stage
  fire('pointerup', { clientX: 5, clientY: 5 });
  const down = fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 });
  assert.equal(down._stopped, true);
  assert.equal(fire('pointermove', { clientX: 120, clientY: 300, buttons: 1 })._stopped, true);
  assert.equal(fire('pointerup', { clientX: 120, clientY: 300 })._stopped, true);
  assert.equal(fire('click', { clientX: 120, clientY: 300 })._stopped, true);
  assert.equal(fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, false); // once only
  same(env.status().fault, { kind: 'miss', fired: true });
});

test('revert waits while the button is held (split drag)', async () => {
  const { env, ctx, fire } = first(await roundPage({ knobs: { pageFaults: 'revert' } }));
  const x0 = env.model.x;
  fire('pointerdown', { clientX: 5, clientY: 5, buttons: 1 });
  ctx().update({ ...env.model, x: env.spec.target });
  env.stepClock();
  assert.equal(env.model.x, env.spec.target);
  fire('pointerup', { clientX: 5, clientY: 5 });
  env.stepClock();
  assert.equal(env.model.x, x0);
});

test('clear: a change within tau clears before the drawn change', async () => {
  const { env, ctx } = await roundPage({ knobs: { pageFaults: 'clear' } });
  env._rt.fault.at = 2;
  const start = env.model.x;
  ctx().update({ ...env.model, x: env.spec.target });
  env.stepClock();
  assert.equal(env.model.x, start);
});

test('hang: busy overlay for 2-3 steps; stage input swallowed, the oracle waits', async () => {
  const { win, env, fire, drawn } = await roundPage({ knobs: { pageFaults: 'hang' } });
  const busyNow = () => win.__megawobKit.fault.busy(env);
  let steps = 0;
  while (!kinds(drawn).includes('hang') && steps++ < 5) env.stepClock();
  assert.ok(busyNow());
  same(env.oracle(), { type: 'wait' });
  assert.equal(fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, true);
  fire('pointerup', { clientX: 100, clientY: 300 });
  let busy = 0;
  while (busyNow() && busy < 5) { env.stepClock(); busy++; }
  assert.ok(busy >= 2 && busy <= 3, `busy ${busy}`);
  assert.equal(env.oracle().type, 'drag');
});

test('shift: the banner is drawn and the widget re-rendered (fresh anchors, no layout violation)', async () => {
  const { env, renders, drawn } = await roundPage({ knobs: { pageFaults: 'shift' } });
  const n = renders.length;
  for (let i = 0; i < 4; i++) env.stepClock();
  same(kinds(drawn), ['shift']);
  assert.equal(renders.length, n + 1);
  same(env.score().violations, []);
});

test('the oracle succeeds under every fault kind; sites without fault() get miss', async () => {
  for (const kind of ['miss', 'revert', 'clear', 'hang', 'shift']) {
    for (let seed = 0; seed < 6; seed++) {
      const { env, play } = await roundPage({ knobs: { pageFaults: kind }, seed });
      play();
      assert.equal(env.status().success, true, `${kind} seed ${seed}`);
    }
  }
  const { env } = await roundPage({ knobs: { pageFaults: 'hang' }, site: { fault: undefined } });
  assert.equal(env.episode.fault, 'miss');
});


// A seed whose fault-when draw is `at` for this kind.
async function seedFor(kind, at) {
  for (let seed = 0; seed < 90; seed++) {
    const p = await roundPage({ knobs: { pageFaults: kind }, seed });
    if (p.env._rt.fault.at === at) return seed;
  }
  assert.fail(`no seed drew ${at} for ${kind}`);
}

test('fault-when: miss, revert and clear draw the 1st-3rd event at 3:2:1', async () => {
  for (const kind of ['miss', 'revert', 'clear']) {
    const seen = { 1: 0, 2: 0, 3: 0 };
    for (let seed = 0; seed < 90; seed++) seen[(await roundPage({ knobs: { pageFaults: kind }, seed })).env._rt.fault.at]++;
    assert.ok(seen[1] > seen[2] && seen[2] > seen[3] && seen[3] > 0, `${kind} ${JSON.stringify(seen)}`);
  }
  for (const kind of ['hang', 'shift']) { // timed kinds keep their fixed point
    const p = await roundPage({ knobs: { pageFaults: kind } });
    assert.ok(p.env._rt.fault.at >= 1);
  }
});

test('miss: the drawn press is swallowed, the ones before it pass', async () => {
  for (const at of [1, 2, 3]) {
    const { env, fire } = await roundPage({ knobs: { pageFaults: 'miss' }, seed: await seedFor('miss', at) });
    for (let i = 1; i < at; i++) {
      assert.equal(fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, false, `press ${i} of ${at}`);
      fire('pointerup', { clientX: 100, clientY: 300 });
      same(env.status().fault, { kind: 'miss', fired: false });
    }
    assert.equal(fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, true, `press ${at}`);
    assert.equal(fire('pointerup', { clientX: 100, clientY: 300 })._stopped, true);
    assert.equal(fire('click', { clientX: 100, clientY: 300 })._stopped, true);
    same(env.status().fault, { kind: 'miss', fired: true });
    assert.equal(fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, false); // once only
  }
});

test('revert: the drawn change goes back, the earlier ones stick; a task done sooner never meets it', async () => {
  for (const at of [1, 2, 3]) {
    const { env, ctx, drawn, renders } = await roundPage({ knobs: { pageFaults: 'revert' }, seed: await seedFor('revert', at) });
    const t = env.spec.target;
    const step = t > env.model.x ? 1 : -1;
    for (let i = 1; i < at; i++) {
      ctx().update({ ...env.model, x: env.model.x + step });
      env.stepClock();
      same(kinds(drawn), []);
    }
    const before = env.model.x;
    const n = renders.length;
    ctx().update({ ...env.model, x: t });
    env.stepClock();
    assert.equal(env.model.x, before, `reverted at change ${at}`);
    assert.equal(renders.length, n + 1);
    same(kinds(drawn), ['revert']);
    same(env.status().fault, { kind: 'revert', fired: true });
    ctx().update({ ...env.model, x: t });
    env.stepClock();
    assert.equal(env.model.x, t);
  }
  const late = await roundPage({ knobs: { pageFaults: 'revert' }, seed: await seedFor('revert', 3) });
  late.play();
  assert.equal(late.env.status().success, true);
});

test('clear: the drawn change resets to the start model; earlier changes within tau-free steps stick', async () => {
  for (const at of [1, 2, 3]) {
    const { env, ctx, drawn } = await roundPage({ knobs: { pageFaults: 'clear' }, seed: await seedFor('clear', at) });
    const start = env.model.x;
    const step = env.spec.target > start ? 1 : -1;
    for (let i = 1; i <= at; i++) {
      ctx().update({ ...env.model, x: env.model.x + step });
      env.stepClock();
      if (i < at) { assert.equal(env.model.x, start + i * step); same(kinds(drawn), []); }
    }
    assert.equal(env.model.x, start, `cleared at change ${at}`);
    same(kinds(drawn), ['clear']);
  }
});

test('faults(spec) -> false: the knob draws, the episode gets no fault; true keeps it', async () => {
  const off = await roundPage({ knobs: { pageFaults: 'miss' }, task: { faults: () => false } });
  assert.equal(off.env._rt.fault, null);
  assert.equal(off.env.episode.fault, null);
  assert.equal(off.fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, false);
  assert.equal(off.env.status().fault, null);
  const on = first(await roundPage({ knobs: { pageFaults: 'miss' }, task: { faults: (spec) => !!spec } }));
  assert.equal(on.env.episode.fault, 'miss');
  assert.equal(on.fire('pointerdown', { clientX: 100, clientY: 300, buttons: 1 })._stopped, true);
});
