// answerIn=reply (kit/runtime/answer.js): tasks with answers() / answered() and widgets with answerReply: true; the
// answer goes in the ending message (finish mode), is graded through the task's error() on the fields it fills, and
// counts nothing before the episode ends; the oracle navigates, then finishes with the answer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage, same } from './fixtures.mjs';

// A lookup on the line page: move x to the target (navigation, half the error), then the code (target x 2) goes in
// the answer field (the other half; partial credit by distance).
const code = (s) => String(s.target * 2);
const lookup = (over = {}) => ({
  init: () => ({ x: 0, answers: [''] }),
  error: (m, s) => {
    const nav = m.x === s.target ? 0 : 0.5;
    const v = Number(m.answers[0]);
    const ans = m.answers[0] !== '' && Number.isFinite(v) ? Math.min(1, Math.abs(v - Number(code(s))) / 10) : 1;
    return nav + 0.5 * ans;
  },
  tolerance: () => ({ tau: 0, sigma: 0.35, minInitialError: 0.5 }),
  sample(rng, opts) {
    const spec = { scenario: opts.scenario || rng.pick(opts.scenarios), target: rng.int(20, 80), isplit: opts.isplit };
    if (opts.answer === 'reply' && spec.scenario === 'a') spec.answerBy = 'reply';
    return spec;
  },
  answers: (s) => [{ label: 'code', labels: ['number'], value: code(s) }],
  answered: (m, s, values) => ({ ...m, answers: [String(values[0] ?? '')] }),
  plan: (m, s) => {
    if (m.x !== s.target) return { drag: [{ x: 100 + m.x, y: 300 }, { x: 100 + s.target, y: 300 }] };
    return s.answerBy === 'reply' ? { finish: true } : { type: [{ field: 0 }, code(s)] };
  },
  solve: (s, m) => ({ ...m, x: s.target, answers: [code(s)] }),
  ...over,
});
const page = (knobs, o = {}) => roundPage({ knobs: { answerIn: 'reply', ...knobs }, task: lookup(o.task),
  widget: { answerReply: true, ...o.widget }, seed: o.seed ?? 1 });

test('answer: reply only with the task hooks, the widget opt-in and a spec built for it', async () => {
  let p = await page({}, { task: { scenarios: ['a'] } });
  same([p.env.episode.answer, p.env.episode.finish, p.env.submitEl], ['reply', true, null]);
  assert.match(p.env.instruction(), /^Set the value to \d+\. \S.*code/);
  for (const o of [{ widget: { answerReply: false } }, { task: { answered: undefined } }, { task: { scenarios: ['b'] } }]) {
    p = await page({}, { task: { scenarios: ['a'], ...o.task }, widget: o.widget });
    same([p.env.episode.answer, p.env.episode.finish], [null, false], JSON.stringify(o));
  }
  p = await page({ answerIn: 'field' }, { task: { scenarios: ['a'] } });
  same([p.env.episode.answer, p.env.instruction()], [null, `Set the value to ${p.env.spec.target}.`]);
});

test('answer: the oracle navigates, then finishes with the answer (free text and structured)', async () => {
  for (const reply of ['auto', 'free', 'structured']) {
    for (let seed = 0; seed < 5; seed++) {
      const p = await page({ replyFormat: reply }, { task: { scenarios: ['a'] }, seed });
      const actions = p.play();
      const last = actions[actions.length - 1];
      assert.equal(last.type, 'finish');
      if (reply !== 'structured') assert.equal(last.message, code(p.env.spec));
      else same(p.win.__megawobKit.reply.parse(p.env, last.message).facts, [['code', code(p.env.spec)]]);
      same([p.env.status().success, p.env.status().reward_dense], [true, 1], `${reply} seed ${seed}`);
    }
  }
});

test('answer: a value typed into the model never counts; progress before the finish is the navigation', async () => {
  const p = await page({}, { task: { scenarios: ['a'] } });
  p.ctx().update({ ...p.env.model, answers: [code(p.env.spec)] });
  assert.equal(p.env.score().error, 1);
  p.ctx().update({ ...p.env.model, x: p.env.spec.target });
  assert.equal(p.env.score().error, 0.5);
  same([p.env.error0, p.env.status().done], [1, false]);
});

test('answer: free text is the bare value or "label: value", once; structured needs status done', async () => {
  const end = async (reply, message, nav = true) => {
    const p = await page({ replyFormat: reply }, { task: { scenarios: ['a'] } });
    if (nav) p.ctx().update({ ...p.env.model, x: p.env.spec.target });
    p.env.finish(typeof message === 'function' ? message(p) : message);
    return p.env.status();
  };
  const C = (p) => code(p.env.spec);
  const free = [
    [(p) => `${C(p)}.`, true], [(p) => `"${C(p)}"`, true], [(p) => `Code: ${C(p)}`, true], [(p) => `number: ${C(p)}`, true],
    [(p) => `The code is ${C(p)}`, false], [(p) => `Code: ${C(p)}; code: 1`, false], [(p) => `${C(p)} ${C(p)}0`, false],
    [(p) => `Code: ${C(p)}${' pad'.repeat(60)}`, false], [() => 'Done.', false],
  ];
  for (const [m, ok] of free) assert.equal((await end('free', m)).success, ok, String(m));
  // partial credit carries over: 4 off of 10 leaves 0.2 of the answer half
  const near = await end('free', (p) => String(Number(C(p)) + 4));
  assert.ok(Math.abs(near.score.error - 0.2) < 1e-9, String(near.score.error));
  assert.equal((await end('free', (p) => C(p), false)).success, false, 'the navigation still counts');
  // a closing period is read both ways: a value that ends in one ("Co.") and a sentence's full stop both pass
  const dotted = await roundPage({ knobs: { answerIn: 'reply', replyFormat: 'free' }, widget: { answerReply: true },
    task: lookup({ scenarios: ['a'], answers: (s) => [{ label: 'supplier', value: 'Harbor Supply Co.' }],
      error: (m) => (m.answers[0] === 'Harbor Supply Co.' ? 0 : 1) }) });
  dotted.env.finish('Harbor Supply Co.');
  assert.equal(dotted.env.status().success, true);
  const fmt = (p, o) => p.win.__megawobKit.reply.format(p.env, o);
  const structured = [
    [(p) => fmt(p, { status: 'done', facts: [['Code', C(p)]] }), true],
    [(p) => fmt(p, { status: 'done', facts: [['number', ` ${C(p)}`]] }), true],
    [(p) => fmt(p, { status: 'done', facts: [['code', C(p)], ['code', '1']] }), false],
    [(p) => fmt(p, { status: 'impossible', facts: [['code', C(p)]] }), false],
    [(p) => C(p), false],
  ];
  for (const [m, ok] of structured) assert.equal((await end('structured', m)).success, ok, String(m));
});

test('answer: with report, one reply carries the answer and the facts', async () => {
  const facts = (m, s) => [{ label: 'Target', value: String(s.target) }];
  for (const reply of ['free', 'structured']) {
    const p = await page({ reportFacts: 'on', replyFormat: reply }, { task: { scenarios: ['a'], facts } });
    same([p.env.episode.report, p.env.episode.answer], [true, 'reply']);
    const actions = p.play();
    if (reply === 'free') assert.equal(actions[actions.length - 1].message, `code: ${code(p.env.spec)}; Target: ${p.env.spec.target}`);
    same([p.env.status().success, p.env.status().reward_dense], [true, 1], reply);
  }
});

test('answer: combined lookup replies keep supplier punctuation, long messages and commas in report labels', async () => {
  const { bootPage } = await import('./stubdom.mjs');
  const { env, win } = await bootPage({ task: 'find-fact' });
  const kit = win.__megawobKit;
  const useWidget = (scenario) => {
    env.widgetDef = env.widgetsFor('find-fact').map((n) => env.widgetOf('find-fact', n))
      .find((s) => (s.scenarios || []).includes(scenario));
  };
  const solved = (scenario, seed, reply) => {
    env.reset(seed, scenario, { answerIn: 'reply', reportFacts: 'on', replyFormat: reply, popups: 'off', finishByMessage: '1' });
    same([env.episode.answer, env.episode.report], ['reply', true]);
    env.model = env.taskDef.solve(env.spec, env.util.clone(env.model));
    return kit.answer.message(env, kit.report.facts(env).map((f) => [String(f.label), String(f.value)]));
  };
  // content banks change which seed shows each case, so search for one: a supplier name ending in a period before
  // the next field, a long message, a comma inside a report label
  const cases = [['tooltip', (m) => /\.;/.test(m)], ['table', (m) => m.length > 160], ['table', (m) => m.split('; ').some((f) => f.split(': ')[0].includes(', '))]];
  for (const [scenario, has] of cases) {
    useWidget(scenario);
    const seed = Array.from({ length: 400 }, (_, i) => i).find((s) => has(solved(scenario, s, 'free')));
    assert.ok(seed !== undefined, `${scenario}: no seed in 0..399 has the case ${has}`);
    for (const reply of ['free', 'structured']) {
      const message = solved(scenario, seed, reply);
      if (reply === 'free') assert.ok(has(message), message);
      env.finish(message);
      same([env.score().error, env.status().success, env.status().reward_dense], [0, true, 1], `${scenario}/${seed}/${reply}`);
    }
  }
});

test('answer: both graders budget all requested fields and still reject dumps and repeated answers', async () => {
  const answer = 'Harbor Supply Company '.repeat(8).trim();
  const make = () => page({ reportFacts: 'on', replyFormat: 'free' }, { task: {
    scenarios: ['a'], facts: () => [{ label: 'Stock', value: '61' }],
    answers: () => [{ label: 'supplier', value: answer }],
    error: (m) => m.answers[0] === answer ? 0 : 1,
  } });
  const message = `supplier: ${answer}; Stock: 61`;
  const p = await make();
  assert.ok(message.length > 160);
  p.env.finish(message);
  same([p.env.status().success, p.win.__megawobKit.report.share(p.env)], [true, 1]);
  for (const invalid of [`${message}; ${'page dump '.repeat(100)}`, `${message}; supplier: something else`]) {
    const q = await make();
    q.env.finish(invalid);
    assert.equal(q.env.status().success, false);
    assert.equal(q.env.score().error, 1, invalid);
  }
});
