// preempt (E14): after a seeded 1st-3rd change, or mid-drag, the user interrupts. cancel: success only for a finish
// that leaves the page as it was at the notice (a drag held at a mid-drag notice may still be dropped); switch (tasks with retarget): new spec, tolerance and start error, a re-render and
// "Change of plan: <instruction>", the goal text unchanged. status().notice carries the message.
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage, same } from './fixtures.mjs';

const retarget = (spec, model) => ({ ...spec, target: model.x > 50 ? 10 : 90 });
// Pin the notice to the first change (the timing is seeded; see the timing tests below).
const first = (p) => { Object.assign(p.env._rt.preempt, { after: 1, midDrag: false }); return p; };
const step1 = (p) => {
  const { env, ctx } = p;
  ctx().update({ ...env.model, x: env.model.x + (env.spec.target > env.model.x ? 1 : -1) });
  env.stepClock();
};

test('cancel: the notice after the first change; the oracle stops and reports', async () => {
  for (let seed = 0; seed < 6; seed++) {
    const p = first(await roundPage({ knobs: { interruptions: 'cancel' }, seed }));
    assert.equal(p.env.status().notice, null);
    const actions = p.play();
    assert.match(p.env.status().notice, /stop|hold on/i);
    assert.ok(p.drawn.some((d) => d[0] === 'notice'));
    const last = actions[actions.length - 1];
    assert.equal(last.type, 'finish');
    same([p.env.status().success, p.env.status().reward_dense, p.env.status().end_reason], [true, 1, 'finish'], `seed ${seed}`);
  }
});

test('cancel: a change after the notice, or the end control, scores 0', async () => {
  const a = first(await roundPage({ knobs: { interruptions: 'cancel' } }));
  step1(a);
  assert.ok(a.env.status().notice);
  a.ctx().update({ ...a.env.model, x: a.env.spec.target });
  a.env.finish('Done, all set.');
  same([a.env.status().success, a.env.status().reward_dense], [false, 0]);
  assert.equal(a.env.status().progress, -0.5);
  const b = first(await roundPage({ knobs: { interruptions: 'cancel' } }));
  step1(b);
  b.env.submit();
  same([b.env.status().success, b.env.status().reward_dense], [false, 0]);
});

test('switch: new goal, re-render, telescoping start error; the oracle solves the new goal', async () => {
  const p = first(await roundPage({ knobs: { interruptions: 'switch' }, task: { retarget } }));
  const goal = p.env.instruction();
  const n = p.renders.length;
  step1(p);
  const target = p.env.spec.target;
  assert.ok(target === 10 || target === 90);
  assert.equal(p.renders.length, n + 1);
  assert.equal(p.renders[p.renders.length - 1].spec.target, target);
  assert.match(p.env.status().notice, new RegExp(`Set the value to ${target}\\.$`));
  assert.equal(p.env.instruction(), goal);
  assert.equal(p.env.error0, Math.abs(p.env.model.x - target));
  assert.equal(p.env.status().progress, 0);
  p.play();
  same([p.env.status().success, p.env.model.x], [true, target]);
});

test('switch falls back to cancel without retarget (knob) or when retarget gives nothing (at the notice)', async () => {
  const a = await roundPage({ knobs: { interruptions: 'switch' } });
  assert.equal(a.env.episode.preempt, 'cancel');
  const b = first(await roundPage({ knobs: { interruptions: 'switch' }, task: { retarget: () => null } }));
  assert.equal(b.env.episode.preempt, 'switch');
  step1(b);
  same(b.env.status().score.violations, []);
  assert.match(b.env.status().notice, /stop|hold on/i);
  b.play();
  assert.equal(b.env.status().success, true);
});

test('nothing fires without a change', async () => {
  const p = await roundPage({ knobs: { interruptions: 'cancel' } });
  for (let i = 0; i < 5; i++) p.env.stepClock();
  assert.equal(p.env.status().notice, null);
});

test('timing: seeded 1st, 2nd or 3rd change, or mid-drag (cancel only); the oracle still ends right', async () => {
  const seen = new Set();
  for (let seed = 0; seed < 40; seed++) {
    for (const mode of ['cancel', 'switch']) {
      const p = await roundPage({ knobs: { interruptions: mode }, seed, task: { retarget } });
      const { after, midDrag } = p.env._rt.preempt;
      seen.add(midDrag ? 'drag' : after);
      if (mode === 'switch') assert.equal(midDrag, false);
      for (let i = 1; i < after; i++) { step1(p); assert.equal(p.env.status().notice, null, `seed ${seed} change ${i}`); }
      step1(p);
      assert.ok(p.env.status().notice, `seed ${seed} ${mode} after ${after}`);
      p.play();
      assert.equal(p.env.status().success, true, `seed ${seed} ${mode}`);
    }
  }
  same([...seen].sort(), [1, 2, 3, 'drag'].sort());
});

test('mid-drag cancel: the notice on the second held step; the drop counts, nothing after it', async () => {
  const drag = async () => {
    const p = await roundPage({ knobs: { interruptions: 'cancel' } });
    Object.assign(p.env._rt.preempt, { after: 1, midDrag: true });
    p.env.lastPointer = { x: 10, y: 10, buttons: 1 };
    p.env.stepClock(); // press
    assert.equal(p.env.status().notice, null);
    p.ctx().update({ ...p.env.model, x: p.env.model.x + 1 });
    p.env.stepClock(); // a move with the button held
    assert.match(p.env.status().notice, /stop|hold on/i);
    p.env.lastPointer = { x: 12, y: 10, buttons: 0 };
    p.ctx().update({ ...p.env.model, x: p.env.model.x + 1 });
    p.env.stepClock(); // the release drops what was held
    return p;
  };
  const a = await drag();
  // The test task has no judge modes or facts: the stop notice carries the reply format.
  assert.match(a.env.status().notice, /\n\n/);
  a.env.finish('Stopped after moving it a little.'); // free text: not a structured reply
  same([a.env.status().success, a.env.status().reward_dense], [false, 0]);
  const a2 = await drag();
  a2.env.finish(a2.win.__megawobKit.reply.format(a2.env, { status: 'stopped' }));
  same([a2.env.status().success, a2.env.status().reward_dense], [true, 1]);
  const b = await drag();
  b.ctx().update({ ...b.env.model, x: b.env.model.x + 1 });
  b.env.stepClock();
  b.env.finish(b.win.__megawobKit.reply.format(b.env, { status: 'stopped' }));
  assert.equal(b.env.status().success, false);
  const c = await drag();
  assert.match(c.play().at(-1).message, /made one change/);
});

test('cancel with parts(): the reply names exactly the items changed before the stop; replyFormat=free names them in plain text', async () => {
  const parts = (m) => [{ name: 'Volume', value: m.x, aliases: ['vol'] }, { name: 'Balance', value: 0 }];
  const run = async (reply, o) => {
    const p = first(await roundPage({ knobs: { interruptions: 'cancel', replyFormat: reply }, task: { parts } }));
    step1(p);
    assert.ok(p.env.status().notice);
    p.env.finish(typeof o === 'string' ? o : p.win.__megawobKit.reply.format(p.env, o));
    return p.env.status().success;
  };
  assert.equal(await run('structured', { status: 'stopped', changes: ['Volume'] }), true);
  assert.equal(await run('structured', { status: 'stopped', changes: ['the vol slider'] }), true);
  assert.equal(await run('structured', { status: 'stopped', changes: [] }), false);
  assert.equal(await run('structured', { status: 'stopped', changes: ['Volume', 'Balance'] }), false);
  assert.equal(await run('structured', { status: 'done', changes: ['Volume'] }), false);
  assert.equal(await run('free', 'ok'), false);
  assert.equal(await run('free', 'Stopped. I only changed the vol slider.'), true);
  assert.equal(await run('free', `Stopped after the volume. ${'x'.repeat(300)}`), false);
  for (const reply of ['free', 'auto']) {
    const q = first(await roundPage({ knobs: { interruptions: 'cancel', replyFormat: reply }, task: { parts } }));
    q.play();
    assert.equal(q.env.status().success, true, reply);
  }
  const p = first(await roundPage({ knobs: { interruptions: 'cancel' }, task: { parts } }));
  p.play();
  assert.equal(p.env.status().success, true);
});
