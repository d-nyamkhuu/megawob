/* click-point/selftest.js: the task's self-test (kit/selftest.js harness; checker and node tests only). */
(function () {
  'use strict';
  const { angleBetween, room, fmtLat, fmtLon, DEG, sub, target, inBoard, ANGULAR, len, dist,
    EMPTY_DEG, show, BOARD, aspectRange, PLACED, area, figureBounds } = env.taskOf('click-point').lib;

  const boardOf = (spec) => ({ x0: 0, y0: 0, x1: spec.board.w, y1: spec.board.h });

  const rot = (c, p, deg) => {
    const a = deg / DEG;
    const d = sub(p, c);
    return [c[0] + d[0] * Math.cos(a) - d[1] * Math.sin(a), c[1] + d[0] * Math.sin(a) + d[1] * Math.cos(a)];
  };

  function checkEpisodes(T) {
    const { def } = T;
    T.sweep({ seeds: 60, sample: false }, ({ scenario, seed: s }) => {
      const ood = s % 6 === 5;
      const spec = def.sample(new env.Rng(7100 + s), { scenarios: def.scenarios, scenario, ood });
      const { tau } = def.tolerance(spec);
      const p = target(spec);
      const e0 = def.error({ point: null }, spec);
      T.check(e0 > 3 * tau, `${scenario}/${s}: empty model error ${e0} not clearly off`);
      T.check(inBoard(p, 0.02, boardOf(spec)), `${scenario}/${s}: target ${p} not inside the board`);
      const e = def.error(def.solve(spec), spec);
      T.check(e <= tau * 0.1, `${scenario}/${s}: ideal click error ${e} > 0.1 tau`);
      for (const mode of ['partial', 'wrong']) {
        const m = def.init({ ...spec, startMode: mode }, new env.Rng(s));
        const em = def.error(m, spec);
        T.check(em > tau, `${scenario}/${s}: ${mode} start within tau (${em})`);
        T.check(inBoard(m.point, 0, boardOf(spec)), `${scenario}/${s}: ${mode} start outside the board`);
      }
      const text = def.instruction(spec, new env.Rng(s));
      T.check(!(/submit/i.test(text)), `${scenario}: instruction names the end control`);
      if (!ANGULAR.has(scenario)) {
        const off = [p[0] + 3 * tau * 0.6, p[1] + 3 * tau * 0.8];
        if (scenario === 'axis' && spec.kind === 'ruler') {
          const u = sub(spec.to, spec.from);
          const l = len(u);
          const miss = [p[0] + (u[0] / l) * 3 * tau, p[1] + (u[1] / l) * 3 * tau];
          T.check(!(def.error({ point: miss }, spec) <= tau), `${scenario}/${s}: 3 tau miss along the ruler passes`);
        } else T.check(!(def.error({ point: off }, spec) <= tau), `${scenario}/${s}: 3 tau miss passes`);
        T.check(!(scenario === 'midpoint' && def.error({ point: spec.a }, spec) <= tau), `${scenario}/${s}: clicking A passes`);
        if (scenario === 'center' && spec.shape !== 'disc') {
          const rim = [spec.c[0] + spec.r, spec.c[1]];
          T.check(!(def.error({ point: rim }, spec) <= tau), `${scenario}/${s}: clicking the rim passes`);
        }
        if (scenario === 'dense') {
          spec.dots.forEach((d, i) => {
            T.check(!(i !== spec.target && def.error({ point: d.p }, spec) <= tau), `${scenario}/${s}: dot ${i} passes`);
          });
        }
        return;
      }
      const vtx = scenario === 'bisect' ? spec.v : spec.b;
      const turned = rot(vtx, p, 3 * tau);
      T.check(!(def.error({ point: turned }, spec) <= tau), `${scenario}/${s}: 3 tau turn passes`);
      const near = [vtx[0] + (p[0] - vtx[0]) * 0.5 * spec.minLen / dist(p, vtx), vtx[1] + (p[1] - vtx[1]) * 0.5 * spec.minLen / dist(p, vtx)];
      T.check(!(def.error({ point: near }, spec) <= tau), `${scenario}/${s}: click inside the min circle passes`);
      T.check(!(def.error({ point: vtx }, spec) <= tau), `${scenario}/${s}: click on the vertex passes`);
      if (scenario === 'bisect') {
        const back = [2 * vtx[0] - p[0], 2 * vtx[1] - p[1]];
        T.check(!(def.error({ point: back }, spec) !== EMPTY_DEG.bisect), `${scenario}/${s}: opposite ray error is not the cap`);
        const onRay = [vtx[0] + Math.cos(spec.rays[0].angle) * spec.rays[0].len, vtx[1] + Math.sin(spec.rays[0].angle) * spec.rays[0].len];
        T.check(!(def.error({ point: onRay }, spec) <= tau), `${scenario}/${s}: clicking a ray end passes`);
      } else {
        const mirror = [2 * vtx[0] - p[0], 2 * vtx[1] - p[1]];
        T.check(!(def.error({ point: mirror }, spec) > tau), `${scenario}/${s}: the other perpendicular side fails`);
        T.check(!(def.error({ point: spec.a }, spec) <= tau), `${scenario}/${s}: clicking A passes`);
      }
    });
  }

  function checkTraits(T) {
    const { def } = T;
    // Opt-in sampling traits: widgets without them sample as before; with them the geometry is constrained.
    for (let s = 0; s < 60; s++) {
      const o = { scenarios: def.scenarios, ood: s % 6 === 5 };
      const same = (scenario, tr) => JSON.stringify(def.sample(new env.Rng(7300 + s), { ...o, scenario })) === JSON.stringify(def.sample(new env.Rng(7300 + s), { ...o, scenario, traits: tr }));
      for (const v of def.scenarios) T.check(same(v, {}), `${v}/${s}: traits {} changed sampling`);
      // placement is a no-op for axis / map (no draws, no spec.area).
      for (const v of ['axis', 'map']) T.check(same(v, { placement: 'left' }), `${v}/${s}: traits.placement changed sampling`);
      const arc = def.sample(new env.Rng(7300 + s), { ...o, scenario: 'center', traits: { shapes: ['arc'] } });
      T.check(!(arc.shape !== 'arc' || !arc.arc || def.error(def.solve(arc), arc) > 1e-6), `center/${s}: shapes arc -> ${arc.shape}`);
      const mid = def.sample(new env.Rng(7300 + s), { ...o, scenario: 'midpoint', traits: { orient: 'horizontal' } });
      T.check(!(mid.a[1] !== mid.b[1] || !(mid.a[0] < mid.b[0]) || (!o.ood && dist(mid.a, mid.b) < 0.59)), `midpoint/${s}: not horizontal / wide`);
      const ra = def.sample(new env.Rng(7300 + s), { ...o, scenario: 'right-angle', traits: { orient: 'horizontal', exclusion: 7 } });
      T.check(!(ra.a[1] !== ra.b[1] || !(ra.a[0] < ra.b[0]) || Math.abs(dist(ra.a, ra.b) / ra.minLen - 7) > 0.2), `right-angle/${s}: horizontal / ratio ${dist(ra.a, ra.b) / ra.minLen}`);
      const bi = def.sample(new env.Rng(7300 + s), { ...o, scenario: 'bisect', traits: { exclusion: [6, 8] } });
      const meanRay = (bi.rays[0].len + bi.rays[1].len) / 2;
      T.check(!(!(meanRay / bi.minLen >= 5.9 && meanRay / bi.minLen <= 8.1) || def.error(def.solve(bi), bi) > 0.25), `bisect/${s}: exclusion ratio ${meanRay / bi.minLen}`);
    }
  }

  function checkGeometry(T) {
    const { def } = T;
    // Geometry traits: malformed values throw a clear error; aspect / placement reshape the board and confine the
    // figure, and the ideal click still scores 0 (within 0.1 tau) on every new geometry.
    const bad = [['aspect', 0.5], ['aspect', 3], ['aspect', NaN], ['aspect', [2, 1.2]], ['aspect', [1.2]], ['aspect', 'wide'], ['aspect', null],
      ['placement', 'middle'], ['placement', { x: 0.7, y: 0, w: 0.4, h: 1 }], ['placement', { x: 0, y: 0, w: 0, h: 1 }], ['placement', { x: 0, y: 0, w: 0.5, h: -1 }],
      ['placement', { x: NaN, y: 0, w: 0.5, h: 0.5 }], ['placement', { x: -0.1, y: 0, w: 0.5, h: 0.5 }], ['placement', [0, 0, 1, 1]], ['placement', null]];
    for (const [key, val] of bad) {
      for (const scenario of ['center', 'axis']) {
        let err = null;
        try {
          def.sample(new env.Rng(1), { scenarios: def.scenarios, scenario, traits: { [key]: val } });
        } catch (e) {
          err = e;
        }
        T.check(!(!err || !String(err.message).startsWith(`click-point: traits.${key} must be`)), `${scenario}: traits.${key} = ${show(val)} not rejected (${err && err.message})`);
      }
    }
    const GEOS = [{ aspect: 1 }, { aspect: 2.2 }, { aspect: [1, 2.2] }, { placement: 'left' }, { placement: 'right' }, { placement: 'top' },
      { placement: 'bottom' }, { placement: 'center' }, { aspect: 1, placement: 'right' }, { aspect: 2.2, placement: 'left' },
      { aspect: [1, 2.2], placement: { x: 0.3, y: 0.3, w: 0.4, h: 0.4 } }, { aspect: 1, placement: { x: 0.6, y: 0, w: 0.4, h: 0.4 } },
      { aspect: 1.2, placement: { x: 0, y: 0.55, w: 0.45, h: 0.45 }, orient: 'horizontal', exclusion: 7, shapes: ['arc'] }];
    for (const tr of GEOS) {
      for (const scenario of def.scenarios) {
        for (let s = 0; s < 12; s++) {
          const ood = s % 4 === 3;
          const spec = def.sample(new env.Rng(7500 + s), { scenarios: def.scenarios, scenario, ood, traits: tr });
          const tag = `${scenario}/${s} ${show(tr)}`;
          const [alo, ahi] = tr.aspect === undefined ? [BOARD.w, BOARD.w] : aspectRange(tr.aspect);
          T.check(spec.board.w >= alo && spec.board.w <= ahi && spec.board.h === BOARD.h, `${tag}: board ${show(spec.board)}`);
          T.check(!((tr.placement !== undefined && PLACED.has(scenario)) !== !!spec.area), `${tag}: area ${show(spec.area)}`);
          const A = area(spec);
          T.check(!(A.x0 < 0 || A.y0 < 0 || A.x1 > spec.board.w + 1e-9 || A.y1 > spec.board.h + 1e-9), `${tag}: area ${show(A)} outside the board`);
          const fb = figureBounds(spec);
          T.check(!(fb.x0 < A.x0 - 1e-9 || fb.y0 < A.y0 - 1e-9 || fb.x1 > A.x1 + 1e-9 || fb.y1 > A.y1 + 1e-9), `${tag}: figure ${show(fb)} outside ${show(A)}`);
          const { tau } = def.tolerance(spec);
          T.check(inBoard(target(spec), 0.02, A), `${tag}: target outside the area`);
          const e0 = def.error({ point: null }, spec);
          T.check(e0 > 3 * tau, `${tag}: empty model error ${e0} not clearly off`);
          const e = def.error(def.solve(spec), spec);
          T.check(e <= 0.1 * tau, `${tag}: ideal click error ${e} > 0.1 tau`);
          for (const mode of ['partial', 'wrong']) {
            const m = def.init({ ...spec, startMode: mode }, new env.Rng(s));
            T.check(!(!(def.error(m, spec) > tau) || !inBoard(m.point, 0, boardOf(spec))), `${tag}: ${mode} start within tau or off the board`);
          }
        }
      }
    }
  }

  function checkJudges(T) {
    const { def } = T;
    // judge episodes: nothing to click on, and the reply names what is missing
    for (const scenario of def.scenarios) {
      for (let s = 0; s < 12; s++) {
        const spec = def.sample(new env.Rng(7700 + s), { scenarios: def.scenarios, scenario, judge: 'impossible' });
        const j = spec.judge;
        if (!j || !Array.isArray(j.what) || !j.what.length || j.what.some((w) => typeof w !== 'string' || !w.trim())) T.fail(`${scenario}/${s}: judge what ${show(j && j.what)}`);
        else T.check(def.instruction(spec, new env.Rng(s)).toLowerCase().includes(j.what[0].toLowerCase().split(' ')[0]), `${scenario}/${s}: instruction does not name ${show(j.what)}`);
      }
    }
  }

  env.selfTest('click-point', (T) => {
    T.check(!(Math.abs(angleBetween([1, 0], [0, 2]) - 90) > 1e-9), 'angleBetween off');
    T.check(!(Math.abs(room([0.5, 0.5], [1, 0], 0, { x0: 0, y0: 0, x1: 1.5, y1: 1 }) - 1) > 1e-9), 'room off');

    T.check(!(fmtLat(47.25, 'dm') !== '47°15′ N' || fmtLon(-8.5) !== '8.5° W'), `fmtCoord ${fmtLat(47.25, 'dm')} ${fmtLon(-8.5)}`);

    checkEpisodes(T);
    checkTraits(T);
    checkGeometry(T);
    checkJudges(T);
    T.fails.length = Math.min(T.fails.length, 30);
  });
})();
