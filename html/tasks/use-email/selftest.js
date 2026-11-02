/* use-email/selftest.js: task checks, loaded only by the checker and node tests. */
(function () {
  'use strict';
  env.selfTest('use-email', (T) => {
    const fam = T.def;
    const {
      SCENARIOS, ned, ccScore, matches, isUndo, errorOf, act, endedOf, baseModel, initModel, planOf, simulate, stepValid, solveOf, coreOf, instructionOf, factsOf, silentOf, retargetOf
    } = T.lib;
    let silents = 0;
    let retargets = 0;
    const modes = ['off', 'partial', 'wrong'];
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ scenario, seed, rng }) => {
      const startMode = modes[seed % 3];
      const tag = `${scenario} seed ${seed} (${startMode})`;
      let spec;
      let model;
      try {
        // Every fourth seed: an Outlook-like widget (flag column only, Ctrl-click ticks, Delete key).
        const traits = seed % 4 === 3 ? { rowIcons: ['star'], select: 'modifier', keys: true, search: true } : { search: true };
        const route = [undefined, undefined, 'pointer', 'wheel', 'keyboard'][seed % 5];
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: SCENARIOS, traits, startMode, ood: seed % 5 === 4,
          csplit: seed % 7 === 3 ? 'heldout' : 'train', isplit: seed % 2 ? 'heldout' : 'train', recover: seed % 4 < 2, route });
        model = initModel(spec, rng.fork('i'));
        model.stack = seed % 6 === 5;
        if (seed % 3 === 1) spec.route = spec.route === 'search' ? 'search' : 'wheel';
      } catch (e) {
        T.fail(`${tag}: ${e && e.stack || e}`);
        return;
      }
      const n = spec.emails.length;
      if (n < 3 || n > 50) T.fail(`${tag}: ${n} emails`);
      const e0 = errorOf(model, spec);
      if (startMode === 'off' && !(e0 > fam.tolerance(spec).minInitialError)) T.fail(`${tag}: start error ${e0}`);
      T.check(e0 > 0, `${tag}: starts solved`);
      if (endedOf(model, spec)) T.fail(`${tag}: starts ended`);
      // Identification is unique.
      if (spec.target !== null && spec.by) {
        const e = spec.emails[spec.target];
        const same = (f) => spec.emails.filter((x, i) => i !== spec.target && f(x)).length;
        if (spec.by === 'sender' && same((x) => x.name === e.name)) T.fail(`${tag}: sender not unique`);
        if (spec.by === 'subject' && same((x) => x.subject === e.subject)) T.fail(`${tag}: subject not unique`);
        if (spec.by === 'content' && same((x) => x.body.includes(e.ref.code))) T.fail(`${tag}: code not unique`);
        if (spec.by === 'attachment' && same((x) => x.att.some((a) => a.group === spec.group))) T.fail(`${tag}: attachment not unique`);
        if ((spec.by === 'sender-subject' || spec.by === 'sender-order') && same((x) => x.name === e.name) !== 1) T.fail(`${tag}: sender count`);
        if (spec.refName !== e.name && spec.emails.some((x) => x.first === spec.refName && x.name !== e.name)) T.fail(`${tag}: ambiguous first name`);
        if (!matches(spec, spec.target, spec.searchKey)) T.fail(`${tag}: search key misses the target`);
      }
      if (spec.dest && spec.dest.name === spec.emails[spec.target].name) T.fail(`${tag}: forward to the sender`);
      if (isUndo(spec)) {
        const t = spec.target;
        if (model.box[t] !== spec.undo.box) T.fail(`${tag}: undo target not moved`);
        if (startMode === 'off' && e0 !== 1) T.fail(`${tag}: undo start error ${e0}`);
        if (startMode === 'off' && errorOf(act(model, spec, { view: spec.undo.box }), spec) !== 0.75) T.fail(`${tag}: undo folder credit`);
        if (!spec.home.some((b, i) => i !== t && b !== 'inbox')) T.fail(`${tag}: undo without mail in other folders`);
        if (spec.undo.kind === 'spam' && !model.junk) T.fail(`${tag}: spam without a Spam folder`);
      }
      // Instruction content.
      for (let k = 0; k < 3; k++) {
        const { core } = coreOf(spec, rng.fork(`c${k}`));
        const text = instructionOf(spec, rng.fork(`i${k}`));
        const lc = core.toLowerCase();
        if (/\{|\}|undefined|null/.test(text)) T.fail(`${tag}: bad instruction ${text}`);
        if (/submit/i.test(text)) T.fail(`${tag}: names the end control: ${text}`);
        const need = [];
        if (spec.reply) need.push(spec.reply);
        if (spec.dest) need.push(spec.dest.name);
        if (spec.folder && spec.task === 'move') need.push(spec.folder);
        if (spec.mail) need.push(spec.mail.to.name, spec.mail.subject, spec.mail.body);
        if (spec.bulk && spec.bulk.name) need.push(spec.bulk.name);
        if (spec.by === 'sender' || spec.by === 'sender-order' || spec.by === 'sender-subject') need.push(spec.refName);
        if (spec.by === 'subject' || spec.by === 'sender-subject') need.push(spec.emails[spec.target].subject);
        if (spec.by === 'content') need.push(spec.emails[spec.target].ref.code);
        for (const s of need) if (!lc.includes(s.toLowerCase())) T.fail(`${tag}: instruction lacks ${s}: ${core}`);
      }
      // Plan (with one silent failure after the first step it applies to, on every other seed).
      let m = model;
      let k = 0;
      let last = e0;
      let silentTried = seed % 2 !== 0;
      try {
        for (; k < 44 && errorOf(m, spec) > 0; k++) {
          const step = planOf(m, spec);
          if (!step) break;
          if (!stepValid(m, spec, step)) throw new Error(`invalid step ${JSON.stringify(step)}`);
          const before = m;
          m = simulate(m, spec, step);
          if (endedOf(m, spec)) throw new Error(`plan ended the episode (${endedOf(m, spec)}) at ${JSON.stringify(step)}`);
          const e = errorOf(m, spec);
          if (startMode === 'off' && e > last + 1e-9) throw new Error(`error rose ${last} -> ${e} at ${JSON.stringify(step)}`);
          last = e;
          if (!silentTried && e < errorOf(before, spec) - 1e-9) {
            const sm = silentOf(m, before, spec, rng.fork(`silent${k}`));
            if (sm) {
              silentTried = true;
              silents++;
              if (!(errorOf(sm, spec) > 0)) throw new Error('silent: error not above tau');
              if (JSON.stringify(Object.keys(sm).sort()) !== JSON.stringify(Object.keys(m).sort())) throw new Error('silent: model shape changed');
              if (endedOf(sm, spec)) throw new Error('silent: episode ended');
              m = sm;
              last = errorOf(m, spec);
            }
          }
        }
      } catch (e) {
        T.fail(`${tag}: ${e}`);
      }
      if (errorOf(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps (${JSON.stringify(planOf(m, spec))})`);
      if (k > 42) T.fail(`${tag}: plan took ${k} steps`);
      if (errorOf(solveOf(spec, model), spec) !== 0) T.fail(`${tag}: solve() not on target`);
      // facts of the solved model; retarget from the start state.
      if (!spec.judge) {
        const fs = factsOf(solveOf(spec, model), spec);
        if (fs.length < 2 || fs.length > 4 || fs.some((f) => !f.label || typeof f.value !== 'string' || !f.value || /undefined|NaN/.test(f.label + f.value))) T.fail(`${tag}: facts ${JSON.stringify(fs)}`);
        const ns = retargetOf(spec, model, rng.fork('retarget'));
        if (ns) {
          retargets++;
          const t2 = instructionOf(ns, rng.fork('rt-i'));
          if (!t2 || /\{|\}|undefined|null/.test(t2)) T.fail(`${tag}: retarget instruction ${t2}`);
          if (!(errorOf(model, ns) > 0)) T.fail(`${tag}: retarget already satisfied`);
          let r = model;
          let j = 0;
          for (; j < 44 && errorOf(r, ns) > 0; j++) {
            const step = planOf(r, ns);
            if (!step) break;
            r = simulate(r, ns, step);
          }
          if (errorOf(r, ns) !== 0) T.fail(`${tag}: retarget plan ends at error ${errorOf(r, ns)}`);
        }
      }
    });
    if (!silents) T.fail('silent: never applied');
    if (!retargets) T.fail('retarget: never applied');
    gradingChecks(T);
  });

  function gradingChecks(T) {
    const { baseModel, errorOf, act, endedOf, ccScore, ned } = T.lib;
    // Grading spot checks.
    const P = (name) => ({ name, first: name, addr: `${name.toLowerCase()}@x.io` });
    const mk = (name, body) => ({ ...P(name), subject: `S ${name}`, body, time: '1:00 PM', cc: [], att: [], ref: null, starred: false, important: false, unread: false });
    const spec = { task: 'forward', scenario: 'forward', rows: 5, target: 1, dest: P('Ana'), confirm: false, recoverable: false, folders: [],
      emails: [mk('Lia', 'Aa bb.'), { ...mk('Bo', 'Cc dd ee.'), important: true }] };
    const m0 = baseModel(spec);
    if (errorOf(m0, spec) !== 1) T.fail('forward: start error not 1');
    const opened = act(m0, spec, { open: 1 });
    if (Math.abs(errorOf(opened, spec) - 0.8) > 1e-9) T.fail('forward: opening the target is not 0.2 credit');
    const draft = act(opened, spec, { forward: 1 });
    if (Math.abs(errorOf(draft, spec) - 0.3) > 1e-9) T.fail(`forward: fresh draft error ${errorOf(draft, spec)}`);
    const wrongTo = act(act(draft, spec, { field: ['to', 'Lia'] }), spec, { send: true });
    if (!(errorOf(wrongTo, spec) > 0.5) || endedOf(wrongTo, spec) !== 'wrong-send') T.fail('forward: wrong recipient not penalized');
    const right = act(act(draft, spec, { field: ['to', ' ANA@x.io '] }), spec, { send: true });
    if (errorOf(right, spec) !== 0 || endedOf(right, spec)) T.fail(`forward: correct send not accepted (${errorOf(right, spec)})`);
    const side = act(right, spec, { flag: [0, 'star'] });
    if (Math.abs(errorOf(side, spec) - 0.2) > 1e-9) T.fail('forward: side effect not counted');
    const del = act(m0, spec, { move: [[0], 'trash'] });
    if (errorOf(del, spec) < 2 || endedOf(del, spec) !== 'wrong-delete') T.fail('forward: wrong delete not penalized');
    const rspec = { ...spec, recoverable: true };
    const del2 = act(m0, rspec, { move: [[0], 'trash'] });
    if (endedOf(del2, rspec)) T.fail('recoverable: first wrong delete ended the episode');
    const undone = act(del2, rspec, { undo: true });
    if (errorOf(undone, rspec) !== 1) T.fail(`recoverable: undo did not clear the penalty (${errorOf(undone, rspec)})`);
    if (endedOf(act(undone, rspec, { move: [[0], 'trash'] }), rspec) !== 'wrong-delete') T.fail('recoverable: second wrong delete did not end');
    if (ccScore('ana, Lia', [P('Ana'), P('Lia')]) !== 1 || ccScore('', []) !== 1 || ccScore('ana', [P('Ana'), P('Lia')]) !== 0.5) T.fail('ccScore');
    if (ned('abc', 'abd') !== 1 / 3 || ned('', '') !== 0) T.fail('ned');
  }
})();
