// env.instruct (template splits, registers, aliases, typos, messy text) and the util message checks used by judge
// episodes. Pinned outputs: changing these helpers changes instructions for a seed (see html/kit/README.md, "Auditing kit usage").
import test from 'node:test';
import assert from 'node:assert/strict';
import { bootPage, loadKit } from './stubdom.mjs';
import { same } from './fixtures.mjs';

const { env } = loadKit();
const I = env.instruct;
const R = (s) => new env.Rng(s);
const CORE = 'Move the "Budget" card to Friday and set the volume to 40%.';
const T = ['Set {v}.', 'Make it {v}.', 'Change to {v}.', 'Put it at {v}.', 'Adjust to {v}.', 'Go to {v}.', 'Use {v}.'];

test('fill, lcFirst, ucFirst', () => {
  assert.equal(I.fill('Set {a} to {b}.', { a: 'x', b: () => 3 }), 'Set x to 3.');
  same([I.lcFirst('Move it'), I.lcFirst('URL bar'), I.ucFirst('move')], ['move it', 'URL bar', 'Move']);
});

test('template split: about one in five held out by hash, never empty', () => {
  const seen = (sp) => new Set([...Array(40).keys()].map((s) => I.pick(R(s), T, sp)));
  same([...seen('heldout')], ['Put it at {v}.']);
  assert.ok(!seen('train').has('Put it at {v}.'));
  assert.equal(seen('all').size, T.length);
  // No member hashes to held out: the lowest-hash one is held out, so heldout never falls back to train text.
  const two = ['Set {v}.', 'Make it {v}.'];
  assert.equal(new Set([...Array(20).keys()].map((s) => I.pick(R(s), two, 'heldout'))).size, 1);
  assert.equal(I.pick(R(0), ['Only {v}.'], 'heldout'), 'Only {v}.');
});

test('all-heldout template lists reserve a disjoint training template', () => {
  // Real task lists that previously returned the entire list for both train and heldout.
  const lists = [
    ['Move "{title}" to {day} at {at}, keeping its duration.', 'Reschedule "{title}" for {at} on {day}, with the same duration.'],
    ['On line {L}, type {t} right before "{tok}".', 'Put the cursor just before "{tok}" on line {L} and type {t}.'],
    ['Create an account on {store}.', 'Sign me up for a {store} account.'],
  ];
  for (const texts of lists) {
    assert.ok(texts.every((t) => env.util.hash32(t) % 5 === 0));
    // Object templates split by id, even when their displayed text changes.
    for (const templates of [texts, texts.map((id, i) => ({ id, text: `Template ${i}` }))]) {
      const seen = (sp, ts = templates) => new Set(Array.from({ length: 100 }, (_, s) => I.pick(R(s), ts, sp)));
      const train = seen('train');
      const held = seen('heldout');
      assert.equal(train.size, 1);
      assert.equal(held.size, 1);
      assert.ok([...held].every((t) => !train.has(t)));
      assert.equal(seen('all').size, 2);
      same([...train], [...seen('train', [...templates].reverse())]);
      same([...held], [...seen('heldout', [...templates].reverse())]);
      // Selecting from a singleton partition still consumes the same one RNG draw.
      const a = R(17), b = R(17);
      I.pick(a, templates, 'train');
      b.pick(templates);
      assert.equal(a.next(), b.next());
    }
  }
});

test('duplicate template keys stay together; single distinct keys remain nonempty', () => {
  const keys = ['Create an account on {store}.', 'Sign me up for a {store} account.'];
  for (const isplit of ['train', 'heldout', 'all']) {
    assert.equal(I.pick(R(0), [keys[0], keys[0]], isplit), keys[0]);
    const oneKey = [{ id: keys[0], text: 'One' }, { id: keys[0], text: 'Another' }];
    assert.ok(oneKey.includes(I.pick(R(0), oneKey, isplit)));
  }
  for (const ids of [keys, ['Set {v}.', 'Make it {v}.']]) {
    const templates = ids.flatMap((id) => [{ id, text: `${id} A` }, { id, text: `${id} B` }]);
    const seen = (sp) => new Set(Array.from({ length: 100 }, (_, s) => I.pick(R(s), templates, sp).id));
    assert.equal(seen('train').size, 1);
    assert.equal(seen('heldout').size, 1);
    assert.ok([...seen('heldout')].every((id) => !seen('train').has(id)));
  }
});

test('real calendar, editor and signup instruction branches keep disjoint core phrasings', async () => {
  const cases = [
    ['use-calendar', { scenario: 'move', title: 'Budget', month: 'June', goal: { day: 8, start: 600, duration: 30 }, people: [] }],
    ['use-text-editor', { scenario: 'cursor', goal: { kind: 'insert', text: 'new_', ref: { by: 'before', line: 2, tok: 'item' } } }],
    ['avoid-dark-patterns', { scenario: 'trickq', say: { kind: 'signup', store: 'Market', nouns: ['news', 'offers'], want: 'news' } }],
  ];
  for (const [task, spec] of cases) {
    const { env: page } = await bootPage({ task });
    // Isolate task templates from the separately split register/noise wrappers.
    page.instruct.say = (rng, core) => core;
    const draw = (isplit) => new Set(Array.from({ length: 100 }, (_, s) =>
      page.taskDef.instruction({ ...spec, isplit }, new page.Rng(s))));
    const train = draw('train'), held = draw('heldout');
    assert.ok(train.size > 0 && held.size > 0);
    assert.ok([...held].every((text) => !train.has(text)), task);
  }
});

test('pinned outputs: pick, say, alias, typo, tol', () => {
  same([...Array(6).keys()].map((s) => I.pick(R(s), T, 'train')),
    ['Make it {v}.', 'Adjust to {v}.', 'Go to {v}.', 'Go to {v}.', 'Use {v}.', 'Go to {v}.']);
  const opts = { terse: 'budget -> fri', steps: ['Move the "Budget" card to Friday.', 'Set the volume to 40%.'] };
  same([...Array(6).keys()].map((s) => I.say(R(s), CORE, opts)), [
    CORE,
    'When you get a chance, move the "Budget" card to Friday and set the volume to 40%.',
    'hi! move the "Budget" card to Friday and set the volume to 40%.',
    'Hey, move the "Budget" card to Friday and set the volume to 40%.',
    'A customer reported this earlier today. budget -> fri',
    'Small change, should only take a moment. hi! move the "Budget" card to Friday and set the volume to 40%.',
  ]);
  same([0, 1, 7].map((s) => I.alias(R(s), 'Save draft', ['Store draft', 'Keep draft'])), ['Store draft', 'Save draft', 'Store draft']);
  same([0, 1, 2].map((s) => I.typo(R(s), CORE)), [
    'Move the "Budget" card to Friday and set the vloume to 40%.',
    'Move the "Budget" card to Friday and set the vlume to 40%.',
    'Move the "Budget" card to Friday and set the voulme to 40%.',
  ]);
  same([0, 1].map((s) => I.tol(R(s), '(±0.1)')), ['(±0.1)', '']);
});

test('polite register never puts a core that does not start with a verb after Please / Could you / Kindly', () => {
  const polite = { registers: { polite: 1, imperative: 0, chat: 0, ticket: 0 }, noise: 0, typo: 0 };
  const bad = /^(Please|Kindly|Could you|Can you|I'd like you to) /;
  for (const core of ['In the Nation field, pick "Portugal".', 'The brand color is hex 006B22. Set it.', 'When the button loads, press it.',
    'You only have a few seconds: pick "M".', 'Only 2 posts should be liked.', 'Walking from A to B, where is the midpoint? Click it.']) {
    for (const isplit of ['train', 'heldout', 'all']) {
      for (let s = 0; s < 60; s++) {
        const out = I.say(R(s), core, { ...polite, isplit });
        assert.ok(!bad.test(out), `${isplit} ${s}: ${out}`);
      }
    }
  }
  // Verb-first cores keep every polite template.
  const verbs = new Set([...Array(200).keys()].map((s) => I.say(R(s), CORE, { ...polite, isplit: 'all' }).split(' ')[0]));
  assert.ok(verbs.has('Please') && verbs.has('Could') && verbs.has('Kindly'));
});

test('pinned outputs: messy modes', () => {
  same(['terse', 'typo', 'chatter', 'mixed'].map((m) => I.messy(R(7), CORE, m, 'train')), [
    'move "Budget" card to friday & set volume to 40%',
    'Move the "Budget" card to Friday and set the volmme to 40%.',
    'ugh, long day. Move the "Budget" card to Friday and set the volume to 40%.',
    'Move the "Budget" card to Friday and set the vlome to 40%. ping me after',
  ]);
  assert.equal(I.messy(R(7), CORE, 'off', 'train'), CORE);
});

test('typos and messy text never touch quoted labels or numbers', () => {
  for (let s = 0; s < 200; s++) {
    for (const out of [I.typo(R(s), CORE), ...['terse', 'typo', 'chatter', 'mixed'].map((m) => I.messy(R(s), CORE, m, 'all'))]) {
      assert.ok(out.includes('"Budget"') && out.includes('40%'), `seed ${s}: ${out}`);
    }
  }
});

