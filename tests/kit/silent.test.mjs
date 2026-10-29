// silent (J4): tasks with silent(); asked once, at the first action that lowered the error; a corrupted model
// above tolerance replaces the model and the widget re-renders; the oracle notices and fixes it. Which improving
// change (1st-3rd, 3:2:1, fork 'silent-when') is drawn per episode; the older tests pin it to the 1st.
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage, same } from './fixtures.mjs';

function hook(make) {
  const calls = [];
  const silent = (next, prev, spec, rng) => {
    calls.push([next.x, prev.x]);
    return make(next, prev, spec, rng);
  };
  return { calls, silent };
}

test('silent: the drawn improving action is saved wrong; asked once', async () => {
  const h = hook((next) => ({ ...next, x: next.x + 7 }));
  const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: h.silent } });
  p.env._rt.silent.at = 1;
  const x0 = p.env.model.x;
  const n = p.renders.length;
  p.ctx().update({ ...p.env.model, x: p.env.spec.target });
  p.env.stepClock();
  same(h.calls, [[p.env.spec.target, x0]]);
  assert.equal(p.env.model.x, p.env.spec.target + 7);
  assert.equal(p.renders.length, n + 1);
  same(p.env.status().silent, { applied: true });
  p.ctx().update({ ...p.env.model, x: p.env.spec.target });
  p.env.stepClock();
  assert.equal(h.calls.length, 1);
  assert.equal(p.env.model.x, p.env.spec.target);
});

test('silent: a null or within-tolerance result changes nothing, and is not asked again', async () => {
  for (const make of [() => null, (next) => ({ ...next, x: next.x + 1 })]) {
    const h = hook(make);
    const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: h.silent } });
    p.env._rt.silent.at = 1;
    p.ctx().update({ ...p.env.model, x: p.env.spec.target });
    p.env.stepClock();
    assert.equal(p.env.model.x, p.env.spec.target);
    same(p.env.status().silent, { applied: false });
  }
});

test('silent: a change that does not lower the error is not asked', async () => {
  const h = hook(() => null);
  const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: h.silent } });
  const away = p.env.model.x + (p.env.spec.target > p.env.model.x ? -3 : 3);
  p.ctx().update({ ...p.env.model, x: away });
  p.env.stepClock();
  same(h.calls, []);
});

test('silent: the oracle still succeeds; off without the hook', async () => {
  for (let seed = 0; seed < 6; seed++) {
    const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: (next) => ({ ...next, x: next.x - 9 }) }, seed });
    p.play();
    assert.equal(p.env.status().success, true, `seed ${seed}`);
  }
  const q = await roundPage({ knobs: { silentFailures: 'on' } });
  same([q.env.episode.silent, q.env.status().silent], [false, null]);
});

test('silent: the 1st, 2nd or 3rd improving change is drawn (3:2:1) and only that one is asked', async () => {
  const seen = { 1: 0, 2: 0, 3: 0 };
  const bySeed = {};
  for (let seed = 0; seed < 90; seed++) {
    const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: (next) => ({ ...next, x: next.x + 7 }) }, seed });
    const at = p.env._rt.silent.at;
    seen[at]++;
    bySeed[at] = bySeed[at] ?? seed;
  }
  assert.ok(seen[1] > seen[2] && seen[2] > seen[3] && seen[3] > 0, JSON.stringify(seen));
  for (const at of [1, 2, 3]) {
    const h = hook((next) => ({ ...next, x: next.x + 7 }));
    const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: h.silent }, seed: bySeed[at] });
    assert.equal(p.env._rt.silent.at, at);
    const t = p.env.spec.target;
    let x = p.env.model.x;
    const err = (v) => p.env.taskDef.error({ ...p.env.model, x: v }, p.env.spec);
    // A decoy change that does not lower the error is not counted; each small step toward the target is.
    const step = t > x ? 1 : -1;
    for (let i = 1; i < at; i++) {
      x += step;
      assert.ok(err(x) < err(x - step));
      p.ctx().update({ ...p.env.model, x });
      p.env.stepClock();
      assert.equal(h.calls.length, 0, `asked early at change ${i} of ${at}`);
      same(p.env.status().silent, { applied: false });
    }
    p.ctx().update({ ...p.env.model, x: t });
    p.env.stepClock();
    assert.equal(h.calls.length, 1, `at ${at}`);
    assert.equal(p.env.model.x, t + 7);
    same(p.env.status().silent, { applied: true });
  }
});

test('silent: a task finished before the drawn change is never corrupted', async () => {
  for (let seed = 0; seed < 40; seed++) {
    const h = hook((next) => ({ ...next, x: next.x + 7 }));
    const p = await roundPage({ knobs: { silentFailures: 'on' }, task: { silent: h.silent }, seed });
    if (p.env._rt.silent.at < 2) continue;
    p.ctx().update({ ...p.env.model, x: p.env.spec.target });
    p.env.stepClock();
    assert.equal(h.calls.length, 0);
    assert.equal(p.env.model.x, p.env.spec.target);
    same(p.env.status().silent, { applied: false });
    return;
  }
  assert.fail('no seed drew 2 or 3');
});
