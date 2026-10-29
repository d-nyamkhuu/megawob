/* avoid-dark-patterns/selftest.js: the task's self-test (kit/selftest.js harness; checker and node tests only). */
(function () {
  'use strict';
  env.selfTest('avoid-dark-patterns', (T) => {
    const { sample, init, error, instruction, judged, plan, solve } = T.def;
    const { act } = T.helpers;
    const { visibleCtls } = T.lib;
    const { clone } = env.util;

    // Sampling resets its RNG for each judge/level pair; retain the custom visibility and unsafe-path checks.
    const out = [];
    T.sweep({ seeds: 40, sample: false }, ({ scenario, seed }) => {
      for (const judge of [null, 'impossible']) {
        for (const level of ['normal', 'easy']) {
          const rng = new env.Rng(seed * 131 + 7);
          const spec = sample(rng, { scenario, csplit: seed % 4 ? 'train' : 'heldout', isplit: 'all', judge, level, ood: seed % 5 === 1 });
          const tag = `${scenario}${judge ? '/stop' : ''}/${level}#${seed}`;
          if (judge && !spec.judge) out.push(`${tag}: no judge`);
          const text = instruction(spec, rng.fork('i'));
          if (/\{[a-zA-Z]+\}/.test(text)) out.push(`${tag}: unfilled slot: ${text}`);
          if (/\bsubmit\b/i.test(text)) out.push(`${tag}: names the end control`);
          for (const [id, c] of Object.entries(spec.ctls)) if ((c.kind === 'go' || c.kind === 'commit' || c.kind === 'save') && c.to && !spec.screens[c.to]) out.push(`${tag}: ctl ${id} goes to missing ${c.to}`);
          if (spec.stop) {
            const m = init({ ...spec, startMode: 'off' }, rng.fork('s'));
            if (error(m, spec) !== 0) out.push(`${tag}: stop start error ${error(m, spec)}`);
            const j = spec.judge;
            if (!(j.reasons && j.reasons.length && j.reasons.every((c) => typeof c === 'string' && c))) out.push(`${tag}: no reasons`);
            if (!(j.what && j.what.length && j.what.every((w) => typeof w === 'string' && w.trim()))) out.push(`${tag}: no what`);
            if (!judged(m, spec, {}) || judged({ ...m, done: true }, spec, {})) out.push(`${tag}: model check`);
            continue;
          }
          for (const mode of ['off', 'partial', 'wrong']) {
            spec.startMode = mode;
            let m = init(spec, rng.fork(mode));
            if (!(error(m, spec) > 0)) out.push(`${tag} ${mode}: starts solved`);
            let k = 0;
            for (; k < 40 && error(m, spec) > 0; k++) {
              const st = plan(m, spec);
              if (!st) { out.push(`${tag} ${mode}: plan stops at error ${error(m, spec).toFixed(3)} on ${m.screen}`); break; }
              if (!visibleCtls(m, spec).includes(st.click.ctl)) { out.push(`${tag} ${mode}: plan clicks hidden ${st.click.ctl} on ${m.screen}`); break; }
              const r = act(m, spec, st.click.ctl);
              if (r.unsafe) { out.push(`${tag} ${mode}: plan triggers ${r.unsafe} at ${st.click.ctl}`); break; }
              m = r.model;
            }
            if (error(m, spec) > 0) out.push(`${tag} ${mode}: plan does not converge (${error(m, spec).toFixed(3)})`);
          }
          if (error(solve(spec, init({ ...spec, startMode: 'off' }, rng)), spec) !== 0) out.push(`${tag}: solve() not within tau`);
          // The deceptive path is really unsafe: committing at once from the off start (when it gets through).
          const m0 = init({ ...spec, startMode: 'off' }, rng.fork('off'));
          if (Object.keys(spec.harm).some((h) => m0.vals[h] !== spec.want[h]) ) {
            let m = clone(m0);
            for (const c of Object.values(spec.ctls)) if (c.require) m.vals[c.require[0]] = c.require[1];
            let hit = false;
            for (let j = 0; j < 12 && !m.done && !hit; j++) {
              const sc = spec.screens[m.screen];
              const id = m.modal ? spec.modals[m.modal].decline : sc && sc.next;
              if (!id) break;
              const r = act(m, spec, id);
              if (r.unsafe) hit = true;
              m = r.model;
            }
            if (!hit) out.push(`${tag}: rushing through is not flagged`);
          }
        }
      }
    });
    return out.slice(0, 30);
  });
})();
