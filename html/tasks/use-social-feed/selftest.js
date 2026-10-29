/* use-social-feed/selftest.js: task self-test; loaded only by the checker and node tests. */
(function () {
  'use strict';
  const fam = env.taskOf('use-social-feed');
  const { clone } = env.util;
  const { act, feedOf, moreToLoad, keyOf, collapsedBy } = fam.helpers;
  const { single, USER_ITEMS, instructionOf, initModel, errorOf, terminal, planOf, tickOf,
    silentOf, solveOf, factsOf, retargetOf, firstOf, inView } = fam.lib;

  // Model-space effect of one plan step with a feed showing `rows` equal rows of ROW px (selfTest).
  const ROW = 150;
  function relayout(m, spec, rows) {
    const feed = feedOf(spec, m);
    const n = feed.length;
    const maxS = Math.max(0, n + (moreToLoad(spec, m) ? 0.4 : 0) - rows);
    m.scroll = Math.max(0, Math.min(maxS, m.scroll || 0));
    const a = Math.ceil(m.scroll - 1e-9);
    const b = Math.min(n - 1, Math.floor(m.scroll + rows + 1e-9) - 1);
    m.view = feed.slice(a, b + 1);
    m.atEnd = moreToLoad(spec, m) && m.scroll + rows >= n + 0.2;
    m.px = { top: m.scroll * ROW, h: rows * ROW, offs: feed.map((_, i) => i * ROW) };
    if (m.atEnd && m.loadAt === null) m.loadAt = m.t;
    return m;
  }

  function simulate(model, spec, step, rows = 3) {
    let m = clone(model);
    if (step.drag) {
      m.scroll = step.drag[1].scroll;
      m.menu = null;
      return relayout(m, spec, rows);
    }
    if (step.wheel) {
      m.scroll = (m.scroll || 0) + step.wheel[1] / ROW;
      m.menu = null;
      return relayout(m, spec, rows);
    }
    if (step.wait) return relayout(m, spec, rows);
    if (step.move) return act(m, spec, { hover: step.move.post });
    if (step.type) return act(m, spec, { draft: step.type[1] });
    const t = step.click;
    if (!t) return m;
    const need = (p) => { if (!inView(m, p)) throw new Error(`clicked hidden post ${p}`); };
    if (t.action) {
      need(t.action[0]);
      if (spec.hoverBar && m.hover !== t.action[0]) throw new Error('clicked a hidden hover-bar button');
      m = act(m, spec, { toggle: keyOf(t.action[0], t.action[1]) });
    } else if (t.more !== undefined) {
      need(t.more);
      m = act(m, spec, { more: t.more });
    } else if (t.item !== undefined) {
      if (m.menu === null) throw new Error('picked an item with no menu open');
      m = act(m, spec, { item: [m.menu, t.item] });
    } else if (t.confirm) m = act(m, spec, t.confirm === 'ok' ? { confirm: true } : { cancel: true });
    else if (t.send) m = act(m, spec, { send: true });
    else if (t.undo === 'toast') m = act(m, spec, spec.scenario === 'reply' ? { unsend: true } : { undo: m.picks.length - 1 });
    else if (t.undo !== undefined) {
      need(t.undo);
      m = act(m, spec, { undo: collapsedBy(spec, m, t.undo) });
    } else if (t.showmore !== undefined) {
      need(t.showmore);
      m = act(m, spec, { expand: t.showmore });
    } else if (t.tab) {
      m = act(m, spec, { tab: t.tab });
      return relayout(m, spec, rows);
    }
    return relayout(m, spec, rows);
  }

  function sweepEpisodes(T) {
    let silents = 0;
    let retargets = 0;
    const modes = ['off', 'partial', 'wrong', 'solved', 'scene'];
    T.sweep({ seeds: 60, rng: (seed) => new env.Rng(seed * 7919 + 17), sample: false }, ({ scenario, seed, rng }) => {
      const mode = modes[seed % 5];
      const tag = `${scenario} seed ${seed} ${mode}`;
      let spec;
      try {
        spec = fam.sample(rng.fork('s'), { scenario, scenarios: fam.scenarios, traits: seed % 3 === 1 ? { simpleFeed: true } : {}, startMode: mode, ood: seed % 5 === 0,
          csplit: seed % 3 === 0 ? 'heldout' : 'train', isplit: seed % 2 ? 'heldout' : 'train', recover: seed % 7 === 0 ? false : null });
      } catch (e) {
        T.fail(`${tag}: ${e}`);
        return;
      }
      if (seed % 3 === 1) {
        if (Object.keys(spec.lists).length !== 1 || spec.page || spec.posts.some((q) => q.quote) || spec.action === 'share') T.fail(`${tag}: simpleFeed not honoured`);
      }
      const handles = new Set(spec.posts.map((p) => p.handle));
      for (const a of handles) for (const b of handles) if (a !== b && a.startsWith(b)) T.fail(`${tag}: handle ${b} prefixes ${a}`);
      if (new Set(spec.posts.map((p) => p.text)).size !== spec.posts.length) T.fail(`${tag}: duplicate texts`);
      if (spec.phrase && spec.posts.filter((p) => p.text.includes(spec.phrase)).length !== 1) T.fail(`${tag}: phrase not unique`);
      if (single(spec) && spec.by === 'user' && !USER_ITEMS.includes(spec.action)
        && spec.posts.filter((p) => p.handle === spec.posts[spec.post].handle).length !== 1) T.fail(`${tag}: by user but handle not unique`);
      if (scenario === 'some' && !(spec.count >= 1 && spec.count <= spec.targets.length)) T.fail(`${tag}: bad count`);
      if ((scenario === 'all' || scenario === 'some') && spec.targets.length < 2) T.fail(`${tag}: too few targets`);
      const text = instructionOf(spec, rng.fork('i'));
      if (!text) T.fail(`${tag}: empty instruction`);
      if (/submit/i.test(text)) T.fail(`${tag}: instruction names the end control: ${text}`);
      let m = relayout(initModel(spec), spec, 3);
      const tol = fam.tolerance(spec);
      const e0 = errorOf(m, spec);
      if (mode === 'off' && !(e0 > tol.minInitialError)) T.fail(`${tag}: start error ${e0}`);
      if (mode !== 'solved' && !(e0 > 0)) T.fail(`${tag}: ${mode} start already solved`);
      if (terminal(m, spec)) T.fail(`${tag}: start is terminal`);
      const m0 = m;
      let k = 0;
      let silentTried = seed % 2 !== 0;
      try {
        for (; k < 44 && errorOf(m, spec) > 0; k++) {
          const step = planOf(m, spec);
          if (!step) break;
          const before = m.strikes;
          const prevM = m;
          const e0k = errorOf(m, spec);
          m = simulate(m, spec, step);
          if (m.strikes > before) throw new Error(`plan made a wrong choice ${JSON.stringify(step)}`);
          if (step.wait) m = tickOf(m, spec, 1000);
          if (!silentTried && errorOf(m, spec) < e0k - 1e-9) {
            const sm = silentOf(m, prevM, spec, rng.fork(`silent${k}`));
            if (sm) {
              silentTried = true;
              silents++;
              if (!(errorOf(sm, spec) > 0)) throw new Error('silent: error not above tau');
              if (JSON.stringify(Object.keys(sm).sort()) !== JSON.stringify(Object.keys(m).sort())) throw new Error('silent: model shape changed');
              if (terminal(sm, spec) || sm.strikes !== m.strikes) throw new Error('silent: changed the strikes');
              m = sm;
            }
          }
        }
      } catch (e) {
        T.fail(`${tag}: ${e}`);
      }
      if (errorOf(m, spec) !== 0) T.fail(`${tag}: plan ends at error ${errorOf(m, spec)} after ${k} steps`);
      if (k > 40) T.fail(`${tag}: plan took ${k} steps`);
      if (errorOf(solveOf(spec, initModel(spec)), spec) !== 0) T.fail(`${tag}: solve() not on target`);
      // facts of the solved model; retarget from the start state.
      if (!spec.judge) {
        const fs = factsOf(solveOf(spec, initModel(spec)), spec);
        if (fs.length < 2 || fs.length > 4 || fs.some((f) => !f.label || typeof f.value !== 'string' || !f.value || /undefined|NaN/.test(f.label + f.value))) T.fail(`${tag}: facts ${JSON.stringify(fs)}`);
        const ns = retargetOf(spec, m0, rng.fork('retarget'));
        if (ns) {
          retargets++;
          const t2 = instructionOf(ns, rng.fork('rt-i'));
          if (!t2 || /\{|\}|undefined|null/.test(t2) || /submit/i.test(t2)) T.fail(`${tag}: retarget instruction ${t2}`);
          if (!(errorOf(m0, ns) > 0)) T.fail(`${tag}: retarget already satisfied`);
          let r = m0;
          let j = 0;
          try {
            for (; j < 44 && errorOf(r, ns) > 0; j++) {
              const step = planOf(r, ns);
              if (!step) break;
              r = simulate(r, ns, step);
              if (step.wait) r = tickOf(r, ns, 1000);
            }
          } catch (e) {
            T.fail(`${tag}: retarget plan ${e}`);
          }
          if (errorOf(r, ns) !== 0) T.fail(`${tag}: retarget plan ends at error ${errorOf(r, ns)}`);
        }
      }
    });
    if (!silents) T.fail('silent: never applied');
    if (!retargets) T.fail('retarget: never applied');
  }

  function checkGrading(T) {
    const posts = [0, 1, 2, 3].map((i) => ({ handle: `@u${i}`, text: `t${i}` }));
    const base = { posts, lists: { home: [0, 1, 2, 3] }, start: ['1:like'] };
    const m0 = { on: ['1:like'], menu: null, confirm: null, picks: [], strikes: 0 };
    const all = { ...base, scenario: 'all', action: 'retweet', targets: [0, 2] };
    T.check(errorOf(m0, all) === 1, 'all: start error');
    T.check(errorOf({ ...m0, on: ['0:retweet', '1:like'] }, all) === 0.5, 'all: half done');
    if (errorOf({ ...m0, on: ['0:retweet', '1:like', '1:retweet'] }, all) !== 1) T.fail('all: wrong post not counted');
    if (errorOf({ ...m0, on: ['0:retweet', '2:retweet'] }, all) !== 0.5) T.fail('all: untoggled start key not counted');
    const some = { ...all, scenario: 'some', count: 1 };
    if (errorOf({ ...m0, on: ['1:like', '2:retweet'] }, some) !== 0) T.fail('some: one of two not accepted');
    if (errorOf({ ...m0, on: ['0:retweet', '1:like', '2:retweet'] }, some) !== 1) T.fail('some: too many not counted');
    const one = { ...base, start: [], scenario: 'one', action: 'like', post: 2, targets: [2], recoverable: false };
    const w1 = act({ ...m0, on: [] }, one, { toggle: '1:like' });
    if (!terminal(w1, one)) T.fail('one: wrong post not ended');
    const oneR = { ...one, recoverable: true };
    const w2 = act({ ...m0, on: [] }, oneR, { toggle: '1:like' });
    if (terminal(w2, oneR) || Math.abs(errorOf(w2, oneR) - 1) > 1e-9) T.fail('one: recoverable wrong toggle');
    const w3 = act(w2, oneR, { toggle: '1:like' });
    if (Math.abs(errorOf(w3, oneR) - 0.7) > 1e-9 || w3.strikes !== 1) T.fail('one: undo of a wrong toggle');
    if (!terminal(act(w3, oneR, { toggle: '3:like' }), oneR)) T.fail('one: second strike not ended');
    const menu = { ...base, start: [], scenario: 'menu', action: 'mute', post: 1, targets: [1, 3], recoverable: false };
    if (Math.abs(errorOf({ ...m0, on: [], menu: 3 }, menu) - 0.35) > 1e-9) T.fail('menu: open menu credit');
    if (errorOf({ ...m0, on: [], picks: [[3, 'mute']] }, menu) !== 0) T.fail('menu: mute from another post by the user');
    if (!terminal(act({ ...m0, on: [] }, menu, { item: [0, 'mute'] }), menu)) T.fail('menu: wrong user not ended');
    const blk = { ...menu, action: 'block' };
    const c1 = act({ ...m0, on: [] }, blk, { item: [1, 'block'] });
    if (!c1.confirm || Math.abs(errorOf(c1, blk) - 0.175) > 1e-9) T.fail('menu: confirm credit');
    if (errorOf(act(c1, blk, { confirm: true }), blk) !== 0) T.fail('menu: confirmed block');
    const rp = { ...base, start: [], scenario: 'reply', action: 'reply', post: 1, targets: [1], text: 'Thanks a lot!', recoverable: true };
    const r0 = { ...m0, on: [], draft: null, sent: [] };
    if (Math.abs(errorOf(r0, rp) - 0.7) > 1e-9) T.fail('reply: start error');
    const r1 = act(r0, rp, { toggle: '1:reply' });
    if (!r1.draft || r1.draft.post !== 1 || r1.on.length || Math.abs(errorOf(r1, rp) - 0.49) > 1e-9) T.fail('reply: composer open credit');
    const r2 = act(r1, rp, { draft: 'Thanks a lot!' });
    if (!(errorOf(r2, rp) > 0) || errorOf(act(r2, rp, { send: true }), rp) !== 0) T.fail('reply: right text not accepted');
    const rw = act(act(act(r0, rp, { toggle: '0:reply' }), rp, { draft: 'Thanks a lot!' }), rp, { send: true });
    if (rw.strikes !== 1 || errorOf(rw, rp) !== 1 || terminal(rw, rp)) T.fail('reply: wrong post not a recoverable strike');
    const ru = act(rw, rp, { unsend: true });
    if (ru.sent.length || !ru.draft || ru.draft.post !== 0 || !(errorOf(ru, rp) > 0.3)) T.fail('reply: unsend');
    if (!terminal(act(rw, rp, { toggle: '3:like' }), rp)) T.fail('reply: second strike not ended');
    if (!terminal(act(act(act(r0, { ...rp, recoverable: false }, { toggle: '1:reply' }), { ...rp, recoverable: false }, { draft: 'nope' }), { ...rp, recoverable: false }, { send: true }), { ...rp, recoverable: false })) T.fail('reply: wrong text not ended');
  }

  function checkJudges(T) {
    for (const scenario of fam.scenarios) {
      for (const jm of ['ambiguous', 'impossible']) {
        for (let seed = 0; seed < 12; seed++) {
          const tag = `judge ${jm} ${scenario} seed ${seed}`;
          try {
            const sp = fam.sample(new env.Rng(seed * 104729 + 3), { scenario, scenarios: fam.scenarios, startMode: 'off', csplit: 'train', isplit: 'train', judge: jm });
            const j = sp.judge;
            if (!j) continue;
            const text = fam.instruction(sp, new env.Rng(seed));
            if (j.mode === 'ambiguous') {
              if (!Array.isArray(j.cands) || j.cands.length < 2 || j.cands.some((c) => !c.length || c.some((x) => !x || typeof x !== 'string'))) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
              else if (!j.cands.every((c) => c[0].split(' ').length > 1 && c[0].toLowerCase().startsWith(firstOf(c[0]).toLowerCase()))) T.fail(`${tag}: cands not full names`);
              else if (!text.includes(firstOf(j.cands[0][0]))) T.fail(`${tag}: instruction lacks the shared name: ${text}`);
              if (!Array.isArray(j.others)) T.fail(`${tag}: others`);
            } else if (!j.what || !j.what.length || !text.includes(j.what[0])) T.fail(`${tag}: what ${JSON.stringify(j.what)} / ${text}`);
          } catch (e) {
            T.fail(`${tag}: ${e}`);
          }
        }
      }
    }
  }

  env.selfTest('use-social-feed', (T) => {
    sweepEpisodes(T);
    checkGrading(T);
    checkJudges(T);
  });
})();
