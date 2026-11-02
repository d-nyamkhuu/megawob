// report (E9): tasks with facts(); finish is forced, the goal text asks for the facts, the finish message is
// graded on them (success needs all; the dense base is scaled by 0.5 + 0.5 fs); the oracle states them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { roundPage, same } from './fixtures.mjs';

const facts = (m, s) => [{ label: 'Value', value: String(m.x) }, { label: 'Status', value: m.x === s.target ? 'Saved' : 'Draft',
  aliases: ['stored'] }];

test('report: finish mode, the goal text names the facts, the task text is unchanged', async () => {
  const { env } = await roundPage({ knobs: { reportFacts: 'on' }, task: { facts } });
  same([env.episode.report, env.episode.finish, env.submitEl], [true, true, null]);
  assert.equal(env.plainInstructionText, `Set the value to ${env.spec.target}.`);
  assert.ok(env.instruction().startsWith(env.plainInstructionText));
  assert.match(env.instruction(), /Value and Status\.$/);
});

const fmt = (p, o) => p.win.__megawobKit.reply.format(p.env, o);

test('report: the oracle finishes with the facts and succeeds (structured and free replies)', async () => {
  for (const reply of ['structured', 'free']) {
    for (let seed = 0; seed < 6; seed++) {
      const p = await roundPage({ knobs: { reportFacts: 'on', replyFormat: reply }, task: { facts }, seed });
      const actions = p.play();
      const last = actions[actions.length - 1];
      assert.equal(last.type, 'finish');
      if (reply === 'free') assert.equal(last.message, `Done. Value: ${p.env.spec.target}; Status: Saved.`);
      else same(p.win.__megawobKit.reply.parse(p.env, last.message).facts, [['Value', String(p.env.spec.target)], ['Status', 'Saved']]);
      same([p.env.status().success, p.env.status().reward_dense], [true, 1], `${reply} seed ${seed}`);
    }
  }
});

test('report: structured facts are graded by label and exact value; base scales with the share stated', async () => {
  const solve = async (reply, message) => {
    const p = await roundPage({ knobs: { reportFacts: 'on', replyFormat: reply }, task: { facts } });
    p.ctx().update({ ...p.env.model, x: p.env.spec.target });
    p.env.finish(typeof message === 'function' ? message(p) : message);
    return p.env.status();
  };
  const t = (p) => String(p.env.spec.target);
  const cases = [
    ['Done.', false, 0.5],
    [(p) => fmt(p, { status: 'done', facts: [['Status', 'stored']] }), false, 0.75], // an alias of one fact
    [(p) => fmt(p, { status: 'done', facts: [['value', ` ${t(p)}.0`], ['STATUS', 'saved']] }), true, 1],
    [(p) => fmt(p, { status: 'done', facts: [['Value', t(p)], ['Value', '0'], ['Status', 'Saved']] }), false, 0.75], // twice
    [(p) => fmt(p, { status: 'done', facts: [['Value', `${t(p)} 0 1 2 3`], ['Status', 'Saved Draft']] }), false, 0.5], // sprays
    [(p) => fmt(p, { status: 'impossible', facts: [['Value', t(p)], ['Status', 'Saved']] }), false, 0.5], // wrong status
  ];
  for (const [m, ok, r] of cases) {
    const s = await solve('structured', m);
    same([s.success, s.reward_dense], [ok, r], String(m));
  }
  // free text: the value right after its label in the same clause, in a short message.
  const p = await roundPage({ knobs: { reportFacts: 'on', replyFormat: 'free' }, task: { facts } });
  const T = p.env.spec.target;
  for (const [m, ok, r] of [[`Done: value ${T}, status saved.`, true, 1], ['All set, it is stored now.', false, 0.5],
    [`Done. Status: saved. Value: ${T}.`, true, 1], [`Value Status ${Array.from({ length: 200 }, (_, i) => i).join(' ')} saved`, false, 0.5]]) {
    const s = await solve('free', m);
    same([s.success, s.reward_dense], [ok, r], m);
  }
  // A value with a comma keeps its clause whole; other facts still split at commas.
  const room = (model, spec) => [{ label: 'Room', value: 'Juniper Room, 2nd Floor' }, { label: 'Value', value: model.x }];
  for (const [m, ok] of [[`Done. Room: Juniper Room, 2nd Floor; value ${T}.`, true], [`Done, room Juniper Room, value ${T}.`, false]]) {
    const q = await roundPage({ knobs: { reportFacts: 'on', replyFormat: 'free' }, task: { facts: room } });
    q.ctx().update({ ...q.env.model, x: q.env.spec.target });
    q.env.finish(m);
    assert.equal(q.env.status().success, ok, m);
  }
});

test('report: off without facts(), and in judge episodes', async () => {
  const a = await roundPage({ knobs: { reportFacts: 'on' } });
  same([a.env.episode.report, a.env.episode.finish], [false, false]);
  const judgeFam = { facts, judgeModes: ['ambiguous'],
    sample: (rng, o) => ({ scenario: 'a', target: 50, judge: o.judge ? { mode: o.judge } : undefined }),
    init: () => ({ x: 50 }) };
  const b = await roundPage({ knobs: { reportFacts: 'on', judgment: 'ambiguous' }, task: judgeFam });
  same([b.env.episode.judge, b.env.episode.report], ['ambiguous', false]);
  assert.equal(b.env.instruction(), b.env.plainInstructionText);
});
