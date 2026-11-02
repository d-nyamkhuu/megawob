/* rotate-object/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';

  // Converge with exact landings from a start state; returns [model, steps, problem?].
  function run(task, spec, model) {
    const { tau } = task.tolerance(spec);
    let n = 0;
    while (task.error(model, spec) > tau && n < 40) {
      const step = task.plan(model, spec);
      if (!step) break;
      if (spec.turntable && step.drag[1].rotateBy[1] !== 0) return [model, n, 'turntable drag with pitch'];
      model = task.lib.simulate(model, step, spec);
      n++;
    }
    return [model, n, task.error(model, spec) > tau ? `plan stuck at ${task.error(model, spec).toFixed(2)}` : null];
  }

  function checkFrames(T, out) {
    const task = T.def;
    const Rng = env.Rng;
    const { FACES, X, Y, compose, euler, faceWorld, quat, randomQuat, rotation } = T.lib;
    const close = (a, b, eps = 1e-6) => a.every((v, i) => Math.abs(v - b[i]) < eps) || a.every((v, i) => Math.abs(v + b[i]) < eps);
    // Face frames: normals are the six axis directions, labels upright when the face is in front.
    const seen = new Set();
    FACES.forEach((f, i) => {
      const front = faceWorld(quat.conj(f.q), i);
      if (!close(front.normal, [0, 0, 1]) || !close(front.up, [0, -1, 0])) out.push(`face ${f.id}: solve() frame wrong`);
      seen.add(faceWorld([1, 0, 0, 0], i).normal.map(Math.round).join(','));
    });
    if (seen.size !== 6) out.push('faces do not cover six directions');
    // Drag right turns the front face to the right; drag down tips it down.
    const r = quat.rotate(rotation(30, 0), [0, 0, 1]);
    const d = quat.rotate(rotation(0, 30), [0, 0, 1]);
    if (!(r[0] > 0.4 && Math.abs(r[1]) < 1e-9)) out.push('rotation(yaw) does not turn the front right');
    if (!(d[1] > 0.4 && Math.abs(d[0]) < 1e-9)) out.push('rotation(pitch) does not tip the front down');
    // Euler decompositions reconstruct the rotation.
    for (let s = 0; s < 200; s++) {
      const q = randomQuat(new Rng(s));
      for (const [A, B] of [[X, Y], [Y, X]]) {
        const e = euler(q, A, B);
        if (!close(compose(A, B, e), q, 1e-6)) out.push(`euler ${A === X ? 'XYX' : 'YXY'} seed ${s}`);
      }
    }
    for (const [A, B] of [[X, Y], [Y, X]]) {
      for (const g of [quat.axisAngle(A, 37), quat.mul(quat.axisAngle(B, 180), quat.axisAngle(A, -50))]) {
        if (!close(compose(A, B, euler(g, A, B)), g, 1e-6)) out.push('euler gimbal case');
      }
    }
  }

  function checkEpisodes(T, out) {
    const task = T.def;
    const Rng = env.Rng;
    const { MAX_DRAG } = T.lib;
    // The plan converges in pure math (steps applied exactly) for every scenario, start mode and route.
    const LIMIT = { cube: 9, dial: 32, orient: 2, photo: 3, compass: 1 };
    for (let seed = 0; seed < 300; seed++) {
      const rng = new Rng(seed);
      const startMode = ['off', 'off', 'partial', 'wrong'][seed % 4];
      for (const scenario of task.scenarios) {
        const spec = task.sample(rng.fork(scenario), { scenario, scenarios: task.scenarios, startMode, ood: seed % 7 === 3 });
        let model = task.init(spec, rng.fork('init' + scenario));
        const { tau } = task.tolerance(spec);
        const e0 = task.error(model, spec);
        if (startMode === 'off' && !(e0 > 3 * tau)) out.push(`seed ${seed} ${scenario}: off start error ${e0}`);
        if (startMode !== 'off' && !(e0 > tau)) out.push(`seed ${seed} ${scenario} ${startMode}: start error ${e0} within tau`);
        if (task.error(task.solve(spec, model), spec) > 1e-6) out.push(`seed ${seed} ${scenario}: solve() not at target`);
        let n = 0;
        while (task.error(model, spec) > tau && n < 40) {
          const step = task.plan(model, spec);
          if (!step) break;
          if (step.drag && step.drag[1].rotateBy) {
            const [yaw, pitch] = step.drag[1].rotateBy;
            if (Math.abs(yaw) > MAX_DRAG + 1e-9 || Math.abs(pitch) > MAX_DRAG + 1e-9) out.push(`seed ${seed}: drag too long`);
          }
          model = task.lib.simulate(model, step, spec);
          n++;
        }
        if (task.error(model, spec) > tau) out.push(`seed ${seed} ${scenario} ${spec.route || ''}: plan stuck at ${task.error(model, spec).toFixed(2)}`);
        if (n > LIMIT[scenario]) out.push(`seed ${seed} ${scenario} ${spec.route || ''}: plan took ${n} steps`);
        const text = task.instruction(spec, rng.fork('i' + scenario));
        if (/submit/i.test(text)) out.push(`${scenario}: instruction names the end control`);
      }
    }
  }

  function checkRoutesAndTurntable(T, out) {
    const task = T.def;
    const Rng = env.Rng;
    const { FACES, quat, yawOf } = T.lib;
    // Episode knob route: the same draws as without it, then the forced route where the scenario has one.
    const strip = (x) => JSON.stringify({ ...x, keys: 0, wheel: 0, route: 0 });
    for (let seed = 0; seed < 120; seed++) {
      for (const scenario of task.scenarios) {
        const opts = { scenario, scenarios: task.scenarios, startMode: ['off', 'partial', 'wrong'][seed % 3], ood: seed % 5 === 2 };
        const plain = task.sample(new Rng(seed), opts);
        for (const route of ['pointer', 'keyboard', 'wheel']) {
          const spec = task.sample(new Rng(seed), { ...opts, route });
          const tag = `route ${route} seed ${seed} ${scenario}`;
          if (strip(spec) !== strip(plain)) out.push(`${tag}: changed more than the route`);
          const inp = task.inputs(spec);
          if (route === 'pointer' && inp.length !== 1) out.push(`${tag}: inputs ${inp}`);
          if (scenario === 'dial' && spec.route !== { pointer: 'drag', keyboard: 'keys', wheel: 'wheel' }[route]) out.push(`${tag}: route ${spec.route}`);
          if (route === 'keyboard' && ((scenario === 'orient' && spec.mode === 'heading') || (scenario === 'photo' && spec.mode !== 'upright'))
            && (spec.route !== 'type' || !inp.includes('keyboard'))) out.push(`${tag}: not typed`);
          if (route === 'wheel' && scenario !== 'dial' && strip(spec) + spec.route !== strip(plain) + plain.route) out.push(`${tag}: should be ignored`);
          const [, n, bad] = run(task, spec, task.init(spec, new Rng(seed + 7)));
          if (bad) out.push(`${tag}: ${bad}`);
          if (n > 34) out.push(`${tag}: plan took ${n} steps`);
        }
      }
    }
    // Turntable trait: side targets, yaw-only starts and drags; widgets without it sample as before.
    const yawOnly = (q) => Math.abs(q[1]) < 1e-9 && Math.abs(q[3]) < 1e-9;
    for (let seed = 0; seed < 200; seed++) {
      const startMode = ['off', 'partial', 'wrong', 'off'][seed % 4];
      const opts = { scenario: 'cube', scenarios: task.scenarios, startMode, ood: seed % 7 === 3 };
      const tag = `turntable seed ${seed} ${startMode}`;
      if (JSON.stringify(task.sample(new Rng(seed), { ...opts, traits: {} })) !== JSON.stringify(task.sample(new Rng(seed), opts))) out.push(`${tag}: traits {} changed sampling`);
      const spec = task.sample(new Rng(seed), { ...opts, traits: { turntable: true } });
      if (!spec.turntable || spec.upright || !(spec.target >= 0 && spec.target <= 3)) out.push(`${tag}: spec ${JSON.stringify(spec)}`);
      const model = task.init(spec, new Rng(seed + 1));
      const { tau } = task.tolerance(spec);
      const e0 = task.error(model, spec);
      if (!yawOnly(model.q)) out.push(`${tag}: start not yaw-only`);
      if (startMode === 'off' ? !(e0 > 3 * tau) : !(e0 > tau)) out.push(`${tag}: start error ${e0}`);
      if (Math.abs(Math.abs(yawOf(quat.mul(model.q, FACES[spec.target].q))) - e0) > 1e-6) out.push(`${tag}: yawOf disagrees with error`);
      const [end, n, bad] = run(task, spec, model);
      if (bad) out.push(`${tag}: ${bad}`);
      if (!yawOnly(end.q)) out.push(`${tag}: plan left the turntable plane`);
      if (n > 2) out.push(`${tag}: plan took ${n} steps`);
      if (/submit/i.test(task.instruction(spec, new Rng(seed)))) out.push('turntable: instruction names the end control');
    }
  }

  function checkDialsAndOrient(T, out) {
    const task = T.def;
    const Rng = env.Rng;
    const { DIALS, HEADING, dialAngleFor, dialStep, dialValue, orientError, parseAngle } = T.lib;
    for (const dd of [...DIALS, HEADING]) {
      const spec = { ...dd, kind: dd === HEADING ? 'heading' : 'value', start: dd === HEADING ? 0 : -dd.sweep / 2, wheelStep: dd.tstep };
      for (const v of [spec.min, (spec.min + spec.max) / 2, spec.max - spec.tau]) {
        if (Math.abs(dialValue(spec, dialAngleFor(spec, v)) - v) > 1e-9) out.push(`dial ${dd.label} roundtrip ${v}`);
      }
      // Straight down lies in the dead zone of a value dial and clamps to an end.
      if (spec.kind === 'value' && ![spec.min, spec.max].some((x) => Math.abs(dialValue(spec, 180) - x) < 1e-9)) out.push(`dial ${dd.label} dead zone`);
      // Off-grid values snap toward the step direction.
      const mid = spec.min + 3.4 * spec.wheelStep;
      if (Math.abs(dialStep(spec, mid, 1) - (spec.min + 4 * spec.wheelStep)) > 1e-6) out.push(`dialStep up ${dd.label}`);
      if (Math.abs(dialStep(spec, mid, -1) - (spec.min + 3 * spec.wheelStep)) > 1e-6) out.push(`dialStep down ${dd.label}`);
    }
    if (Math.abs(orientError({ target: 10, order: 3 }, 250) - 0) > 1e-9) out.push('orient symmetry');
    if (Math.abs(orientError({ target: 350, order: 1 }, 5) - 15) > 1e-9) out.push('orient wrap');
    if (parseAngle('-7.5°') !== -7.5 || !Number.isNaN(parseAngle('abc'))) out.push('parseAngle');
    // Orient traits (shapes / modes / grip): widgets without them sample as before; the ell shape has symmetry order 1.
    for (let seed = 0; seed < 200; seed++) {
      const startMode = ['off', 'partial', 'wrong', 'off'][seed % 4];
      const opts = { scenario: 'orient', scenarios: task.scenarios, startMode, ood: seed % 7 === 3 };
      const tag = `orient traits seed ${seed} ${startMode}`;
      if (JSON.stringify(task.sample(new Rng(seed), { ...opts, traits: {} })) !== JSON.stringify(task.sample(new Rng(seed), opts))) out.push(`${tag}: traits {} changed sampling`);
      const spec = task.sample(new Rng(seed), { ...opts, traits: { shapes: ['ell'], modes: ['match'], grip: 'hub' } });
      if (spec.mode !== 'match' || spec.shape !== 'ell' || spec.order !== 1 || spec.grip !== 'hub' || spec.keys) { out.push(`${tag}: spec ${JSON.stringify(spec)}`); continue; }
      const model = task.init(spec, new Rng(seed + 1));
      const { tau } = task.tolerance(spec);
      if (!(task.error(model, spec) > tau)) out.push(`${tag}: start within tau`);
      const [end, n, bad] = run(task, spec, model);
      if (bad) out.push(`${tag}: ${bad}`);
      else if (n > 2) out.push(`${tag}: plan took ${n} steps`);
      const step = task.plan(model, spec);
      if (step && !(step.drag && step.drag[0].hub === true && step.drag[1].handleAngle !== undefined)) out.push(`${tag}: plan ${JSON.stringify(step)}`);
      if (orientError({ ...spec, order: 1 }, (spec.target + 180) % 360) < 179) out.push(`${tag}: ell target ambiguous`);
    }
  }

  function checkJudges(T, out) {
    const task = T.def;
    const Rng = env.Rng;
    // judge modes: ambiguous has two non-empty candidates, impossible names what is missing
    T.sweep({ seeds: 12, sample: false }, ({ scenario, seed }) => {
      for (const judge of task.judgeModes) {
        const tag = `${scenario} seed ${seed} ${judge}`;
        try {
          const js = task.sample(new Rng(seed * 17 + 3), { scenario, scenarios: task.scenarios, startMode: 'off', judge });
          const j = js.judge;
          if (!j) continue;
          if (!task.instruction(js, new Rng(seed + 4))) out.push(`${tag}: no instruction`);
          if (judge === 'ambiguous' && !(j.cands && j.cands.length >= 2 && j.cands.every((c) => c.length && c.every((n) => typeof n === 'string' && n)))) out.push(`${tag}: cands ${JSON.stringify(j.cands)}`);
          if (judge === 'impossible' && !(j.what && j.what.length)) out.push(`${tag}: no what`);
        } catch (e) {
          out.push(`${tag}: ${e}`);
        }
      }
    });
  }

  env.selfTest('rotate-object', (T) => {
    const out = [];
    checkFrames(T, out);
    checkEpisodes(T, out);
    checkRoutesAndTurntable(T, out);
    checkDialsAndOrient(T, out);
    checkJudges(T, out);
    out.slice(0, 20).forEach((message) => T.check(false, message));
  });
})();
