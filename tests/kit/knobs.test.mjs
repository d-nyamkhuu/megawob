// Randomization parameters in reset(): draw order, streams, defaults and gating. The pinned draws guard the order of the
// shared knobs/<task> stream (start, perturb, instr, finish, perturbAt, route, compose, stray, lang) and the
// own-stream knobs (level, judge, messy, drag, stepms, timescale, fault, report, preempt, silent, safety); see html/kit/README.md, "Auditing kit usage".
import test from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './stubdom.mjs';
import { lineTask, same } from './fixtures.mjs';

const MIX = {
  instructionDisplay: 'header:.4,panel:.2,toast:.15,hidden:.25', finishByMessage: '0:.75,1:.25', startState: 'off:.55,partial:.15,wrong:.15,solved:.15',
  popups: 'off:.55,cookie:.09,toast:.09,chat:.09,promo:.09,banner:.09', pageLanguage: 'en:.7,de:.05,fr:.05,ja:.2',
  inputRoute: 'pointer:.4,keyboard:.3,wheel:.3', composition: 'train:.5,heldout:.5', undeclaredInput: 'reject:.5,void:.5',
  difficulty: 'easy:.3,medium:.3,normal:.4', instructionNoise: 'off:.5,terse:.25,typo:.25', dragSteps: 'atomic:.5,split:.5',
};
const KEYS = ['instr', 'finish', 'start', 'perturb', 'perturbAt', 'route', 'compose', 'stray', 'lang', 'level', 'messy', 'drag'];
const pick = (ep, keys = KEYS) => keys.map((k) => ep[k]);
const refEnv = (over = {}) => testEnv({ task: lineTask(over.task), site: { name: 'base', langs: ['en', 'de', 'ja'], ...over.site },
  widget: over.widget, params: over.params });

test('knob draws for a weighted mix are pinned', () => {
  const { env } = refEnv();
  const want = {
    0: [['toast', true, 'off', 'banner', 2, 'pointer', 'heldout', 'reject', 'en', 'normal', 'off', 'split'], { scenario: 'b', target: 37 }, 91],
    1: [['header', false, 'off', null, 3, 'keyboard', 'train', 'void', 'en', 'medium', 'off', 'split'], { scenario: 'b', target: 69 }, 6],
    2: [['header', false, 'off', 'promo', 3, 'pointer', 'heldout', 'void', 'ja', 'normal', 'off', 'atomic'], { scenario: 'a', target: 68 }, 38],
    3: [['toast', false, 'partial', null, 2, 'wheel', 'train', 'reject', 'de', 'normal', 'typo', 'split'], { scenario: 'b', target: 35 }, 39],
    5: [['hidden', false, 'off', null, 0, 'wheel', 'heldout', 'void', 'en', 'normal', 'typo', 'split'], { scenario: 'b', target: 28 }, 14],
  };
  for (const [seed, [knobs, spec, x]] of Object.entries(want)) {
    env.reset(Number(seed), MIX);
    same(pick(env.episode), knobs, `seed ${seed}`);
    assert.equal(env.spec.scenario, spec.scenario);
    assert.equal(env.spec.target, spec.target);
    assert.equal(env.model.x, x);
  }
  env.reset(3, MIX);
  assert.equal(env.instruction(), 'Set the vaaleu to 35.'); // instructionNoise=typo
  assert.equal(env.plainInstructionText, 'Set the value to 35.');
});

test('defaults: only instr and perturbAt draw', () => {
  const { env } = refEnv();
  env.reset(0, {});
  same(env.episode, {
    instr: 'header', finish: false, start: 'off', perturb: null, perturbAt: 3, isplit: 'train', csplit: 'train', ood: false,
    recover: null, scrollable: false, route: null, compose: 'train', stray: 'reject', lang: 'en', locale: 'en-US', dsf: 1,
    level: 'normal', judge: null, messy: 'off', drag: 'atomic', clock: 'step', stepMs: 1000, timescale: 1,
    fault: null, report: false, preempt: null, silent: false, safety: null, reply: 'auto', answer: null,
  });
});

test('own-stream knobs never move the shared stream, the spec or the model', () => {
  const { env } = refEnv();
  const shared = ['instr', 'finish', 'start', 'perturb', 'perturbAt', 'route', 'compose', 'stray', 'lang'];
  for (let seed = 0; seed < 20; seed++) {
    const base = { ...MIX, difficulty: undefined, instructionNoise: undefined, dragSteps: undefined };
    env.reset(seed, base);
    const a = [pick(env.episode, shared), env.spec, env.model];
    env.reset(seed, { ...MIX, stepms: '500:.5,1000:.5', timescale: '1:.5,2:.5' });
    same([pick(env.episode, shared), env.spec, env.model], a, `seed ${seed}`);
  }
});

test('round-2 knobs (own streams) never move the other knobs, the spec, the model or the instruction', () => {
  const hooks = { facts: () => [{ label: 'Value', value: '5' }], silent: () => null, retarget: () => null };
  const stub = () => ({ el: null });
  const { env } = refEnv({ task: hooks, site: { fault: stub, hazard: stub } });
  const ROUND2 = { pageFaults: 'off:.5,miss:.1,revert:.1,clear:.1,hang:.1,shift:.1', reportFacts: 'off:.5,on:.5',
    interruptions: 'off:.4,cancel:.3,switch:.3', silentFailures: 'off:.5,on:.5', safetyHazards: 'off:.5,on:.5' };
  const other = [...KEYS.filter((k) => k !== 'finish'), 'judge', 'stepMs', 'timescale', 'isplit', 'csplit'];
  const drawn = { fault: new Set(), report: new Set(), preempt: new Set(), silent: new Set(), safety: new Set() };
  for (let seed = 0; seed < 30; seed++) {
    env.reset(seed, MIX);
    const a = [pick(env.episode, other), env.spec, env.model, env.plainInstructionText, env.episode.finish];
    // Hazards are drawn later (overlay channel); the stub site draws none, so keep them from showing.
    env.reset(seed, { ...MIX, ...ROUND2 });
    same([pick(env.episode, other), env.spec, env.model, env.plainInstructionText], a.slice(0, 4), `seed ${seed}`);
    if (env.episode.report) assert.equal(env.episode.finish, true); // report forces finish mode
    else assert.equal(env.episode.finish, a[4]);
    for (const k of Object.keys(drawn)) drawn[k].add(env.episode[k]);
  }
  same([...drawn.fault].map(String).sort(), ['clear', 'hang', 'miss', 'null', 'revert', 'shift']);
  same([...drawn.report].sort(), [false, true]);
  same([...drawn.preempt].map(String).sort(), ['cancel', 'null', 'switch']);
  same([...drawn.silent].sort(), [false, true]);
  assert.ok(drawn.safety.size > 4 && drawn.safety.has(null)); // on picks a kind from env.content.HAZARD_KINDS
  // One knob's weights never move another's draw.
  for (let seed = 0; seed < 20; seed++) {
    env.reset(seed, { pageFaults: ROUND2.pageFaults });
    const f = env.episode.fault;
    env.reset(seed, ROUND2);
    assert.equal(env.episode.fault, f);
  }
});

test('round-2 knobs: gating per task and site', () => {
  const ep = (task, site, opts) => { const { env } = refEnv({ task, site }); env.reset(0, opts); return env.episode; };
  const all = { pageFaults: 'revert', reportFacts: 'on', interruptions: 'switch', silentFailures: 'on', safetyHazards: 'phish' };
  const R2 = ['fault', 'report', 'preempt', 'silent', 'safety']; // their episode fields
  // No hooks: report / silent off, switch becomes cancel, revert needs site.fault (else miss), safety site.hazard.
  same(pick(ep({}, {}, all), R2), ['miss', false, 'cancel', false, null]);
  const site = { fault: () => ({}), hazard: () => ({ el: null }) };
  const fam = { facts: () => [], silent: () => null, retarget: () => null };
  same(pick(ep(fam, site, all), R2), ['revert', true, 'switch', true, 'phish']);
  same(pick(ep({ ...fam, faults: false }, site, all), R2), [null, true, 'switch', true, 'phish']);
  same(pick(ep(fam, site, { pageFaults: 'storm', reportFacts: '1', interruptions: 'later', silentFailures: 'true', safetyHazards: 'storm' }), R2),
    [null, true, null, true, null]);
  assert.ok(ep(fam, site, { safetyHazards: 'on' }).safety); // a kind
  assert.equal(ep(fam, site, { reportFacts: 'on' }).finish, true);
});

test('a later shared knob never moves an earlier one', () => {
  const { env } = refEnv();
  const early = ['start', 'perturb', 'instr', 'finish', 'perturbAt', 'route', 'compose', 'stray'];
  for (let seed = 0; seed < 20; seed++) {
    env.reset(seed, { ...MIX, pageLanguage: undefined });
    const a = pick(env.episode, early);
    env.reset(seed, MIX);
    same(pick(env.episode, early), a);
  }
});

test('a fixed perturbat skips its draw (the knobs after it shift)', () => {
  const { env } = refEnv();
  env.reset(0, { ...MIX, popupAt: 1 });
  assert.equal(env.episode.perturbAt, 1);
  const moved = [];
  for (let seed = 0; seed < 20; seed++) {
    env.reset(seed, MIX);
    const a = env.episode.route;
    env.reset(seed, { ...MIX, popupAt: 0 });
    if (env.episode.route !== a) moved.push(seed);
  }
  assert.ok(moved.length > 0);
});

test('weights: zero weights are never drawn; unknown values fall back', () => {
  const { env } = refEnv();
  for (let seed = 0; seed < 30; seed++) {
    env.reset(seed, { instructionDisplay: 'panel:0,toast:1', startState: 'wrong', pageLanguage: 'xx', difficulty: 'hard', instructionNoise: 'loud', dragSteps: 'weird', judgment: 'ambiguous' });
    assert.equal(env.episode.instr, 'toast');
    assert.equal(env.episode.start, 'off'); // wrong is not in startModes
    assert.equal(env.episode.lang, 'en');
    assert.equal(env.episode.level, 'normal');
    assert.equal(env.episode.messy, 'off');
    assert.equal(env.episode.drag, 'atomic');
    assert.equal(env.episode.judge, null); // the task has no judgeModes
  }
});

test('stepms and timescale: weights and invalid values', () => {
  const { env } = refEnv();
  env.reset(0, { stepms: '250' });
  assert.equal(env.stepMs, 250);
  assert.equal(env.episode.stepMs, 250);
  env.reset(0, { stepms: '-5', timescale: '0' });
  assert.equal(env.stepMs, 1000);
  assert.equal(env.timescale, 1);
  const seen = new Set();
  for (let seed = 0; seed < 20; seed++) seen.add(env.reset(seed, { stepms: '500:.5,1000:.5' }) && env.stepMs);
  same([...seen].sort(), [1000, 500]);
});

test('route is honoured on the base site only', () => {
  assert.equal((() => { const { env } = refEnv(); env.reset(0, { inputRoute: 'keyboard' }); return env.episode.route; })(), 'keyboard');
  const other = (site, widget) => { const { env } = refEnv({ site: { name: 'other', ...site }, widget }); env.reset(0, { inputRoute: 'wheel' }); return env.episode.route; };
  assert.equal(other({}), null);
  assert.equal(other({ route: true }, { traits: { route: true } }), null);
  const { env } = refEnv();
  env.reset(0, { inputRoute: 'teleport' });
  assert.equal(env.episode.route, null);
});

test('lang only where the site lists it; locale follows', () => {
  const { env } = refEnv();
  env.reset(0, { pageLanguage: 'ja' });
  same([env.episode.lang, env.episode.locale], ['ja', 'ja-JP']);
  env.reset(0, { pageLanguage: 'fr' });
  same([env.episode.lang, env.episode.locale], ['en', 'en-US']);
});

test('perturb needs site.overlay and a known kind', () => {
  const noOverlay = refEnv({ site: { overlay: undefined } }).env;
  noOverlay.reset(0, { popups: 'cookie' });
  assert.equal(noOverlay.episode.perturb, null);
  const { env } = refEnv({ site: { overlayKinds: ['tour'] } });
  env.reset(0, { popups: 'tour' });
  assert.equal(env.episode.perturb, null);
  env.reset(0, { popups: 'storm' });
  assert.equal(env.episode.perturb, null);
});

test('sample() gets the randomization parameters as opts', () => {
  const fam = lineTask();
  const { env } = testEnv({ task: fam, site: { name: 'base' }, widget: { traits: { grip: 'edge' } } });
  env.reset(4, { startState: 'partial', instructionSplit: 'heldout', contentSplit: 'all', ood: '1', recover: '0', inputRoute: 'wheel', difficulty: 'easy',
    dragSteps: 'split', stepms: '500' });
  const o = fam.lastOpts;
  same(
    { scenarios: o.scenarios, traits: o.traits, stepMs: o.stepMs, startMode: o.startMode, isplit: o.isplit, csplit: o.csplit,
      ood: o.ood, recover: o.recover, route: o.route, compose: o.compose, lang: o.lang, level: o.level, judge: o.judge, drag: o.drag },
    { scenarios: ['a', 'b'], traits: { grip: 'edge' }, stepMs: 500, startMode: 'partial', isplit: 'heldout', csplit: 'all',
      ood: true, recover: false, route: 'wheel', compose: 'train', lang: 'en', level: 'easy', judge: undefined, drag: 'split' },
  );
  assert.equal(env.spec.startMode, 'partial');
  same([o.fault, o.report, o.preempt, o.silent, o.safety], [undefined, undefined, undefined, undefined, undefined]);
  env.reset(4, { pageFaults: 'miss', interruptions: 'cancel' });
  same([fam.lastOpts.fault, fam.lastOpts.preempt], ['miss', 'cancel']);
});

test('widget scenarios restrict sampling; an unsupported forced scenario throws', () => {
  const fam = lineTask();
  const { env } = testEnv({ task: fam, widget: { scenarios: ['b'] } });
  env.reset(0, 'b');
  same(fam.lastOpts.scenarios, ['b']);
  assert.equal(fam.lastOpts.scenario, 'b');
  assert.throws(() => env.reset(0, 'a'), /not supported/);
});

test('start modes: off is clearly off, partial is off target, solved is within tau', () => {
  const { env } = refEnv();
  for (let seed = 0; seed < 20; seed++) {
    env.reset(seed, { startState: 'off' });
    assert.ok(env.error0 > 3 * env.tau, `off seed ${seed}`);
    env.reset(seed, { startState: 'partial' });
    assert.equal(env.error0, 4);
    env.reset(seed, { startState: 'solved' });
    assert.ok(env.error0 <= env.tau);
  }
});

test('minInitialError from tolerance() sets how far off an off start is', () => {
  const { env } = refEnv({ task: { tolerance: () => ({ tau: 1, minInitialError: 40 }) } });
  for (let seed = 0; seed < 10; seed++) {
    env.reset(seed, {});
    assert.ok(env.error0 > 40);
  }
});

test('judge: only judgeModes, and only when sample() builds spec.judge', () => {
  const judgeFam = {
    judgeModes: ['ambiguous', 'confirm'],
    sample(rng, opts) {
      const spec = { scenario: 'a', target: rng.int(20, 80) };
      if (opts.judge && spec.target % 2 === 0) spec.judge = { mode: opts.judge };
      return spec;
    },
    init: (spec, rng) => ({ x: spec.judge && spec.judge.mode !== 'confirm' ? spec.target : rng.int(0, 100) }),
  };
  const { env } = refEnv({ task: judgeFam });
  const modes = new Set();
  for (let seed = 0; seed < 20; seed++) {
    env.reset(seed, { judgment: 'ambiguous' });
    modes.add(env.episode.judge);
    assert.equal(env.episode.judge, env.spec.judge ? 'ambiguous' : null);
    if (env.spec.judge) assert.ok(env.error0 <= env.tau); // ambiguous starts are "already right"
  }
  same([...modes].sort(), ['ambiguous', null]);
  env.reset(0, { judgment: 'impossible' });
  assert.equal(env.episode.judge, null); // not in judgeModes
});

test('scrollable widgets: episode.scrollable and the wheel input', () => {
  const { env } = refEnv({ widget: { scrollable: (spec) => spec.target > 50 } });
  for (let seed = 0; seed < 10; seed++) {
    env.reset(seed, {});
    assert.equal(env.episode.scrollable, env.spec.target > 50);
    same(env.inputs(), env.spec.target > 50 ? ['pointer', 'wheel'] : ['pointer']);
  }
});

test('reset is deterministic and reset(seed, opts) also takes opts as the second argument', () => {
  const { env } = refEnv();
  env.reset(12, MIX);
  const a = JSON.stringify([env.state(), env.instruction()]);
  env.reset(3, {});
  env.reset(12, undefined, MIX);
  assert.equal(JSON.stringify([env.state(), env.instruction()]), a);
});
