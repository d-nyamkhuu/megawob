/* pick-color/selftest.js: the task's self-test (kit/selftest.js harness; loaded only by the checker and node tests). */
(function () {
  'use strict';
  const task = env.taskOf('pick-color');
  const { CONTROLS, NAMED, clamp01, wheelXY, wheelHS, CH, dE } = task.lib;
  const { MIN_TRACK_PX, math } = task.helpers;
  const { deltaE00, srgbToLab, rgbToHsv, hsvToRgb, rgbToHsl, hslToRgb, hslToHsv, hsvToHsl,
    hex, parseColor, channels, fromHex, modelHsl } = math;
  const SCENARIOS = task.scenarios;
  const plan = (model, spec) => task.plan(model, spec);

  // Model-space widget at the minimum sizes: a drag sets one control to its target plus up to `jitter` px per
  // axis (what pointer quantization can cost); clicks and typing act exactly.
  function simulate(model, step, spec, jitter) {
    // A press outside the popover closes it (presets, the eyedropper and the image sit outside).
    const shut = spec.popover ? { open: false } : {};
    if (step.type) {
      const [t, text] = step.type;
      if (t.field === 'hex') {
        const rgb = parseColor(text);
        return rgb ? { ...model, ...rgbToHsv(rgb) } : model;
      }
      const c = channels(model);
      c[CH[t.field]] = Number(text);
      return { ...model, ...rgbToHsv(c) };
    }
    if (step.click) {
      const t = step.click;
      if (t.popover) return { ...model, open: true };
      if (t.tool) return { ...model, picking: !model.picking, ...shut };
      if (t.region) {
        const r = spec.scene.regions.find((x) => x.id === t.region);
        return { ...model, ...rgbToHsv(fromHex(r.hex)), picking: false, ...shut };
      }
      if (t.preset !== undefined) {
        return { ...model, ...rgbToHsv(fromHex(spec.presets[t.preset].hex)), preset: t.preset, ...shut };
      }
    }
    const t = step.drag[1];
    const L = MIN_TRACK_PX - 1;
    const lin = (f) => clamp01((f * L + jitter()) / L);
    switch (t.surface) {
      case 'hue': return { ...model, h: lin(t.h / 360) * 360 };
      case 'sv': return { ...model, s: lin(t.s), v: 1 - lin(1 - t.v) };
      case 'value': return { ...model, v: lin(t.v) };
      case 'sl': return { ...model, ...hslToHsv(model.h, lin(t.s), 1 - lin(1 - t.l)) };
      case 'sat': {
        const [, , l] = modelHsl(model);
        return { ...model, ...hslToHsv(model.h, lin(t.s), l) };
      }
      case 'light': {
        const [, s] = modelHsl(model);
        return { ...model, ...hslToHsv(model.h, s, lin(t.l)) };
      }
      case 'wheel': {
        const [x, y] = wheelXY(t.h, t.s);
        return { ...model, ...wheelHS(x + jitter(), y + jitter()) };
      }
      default: {
        const c = channels(model);
        c[CH[t.surface]] = lin(t.value / 255) * 255;
        return { ...model, ...rgbToHsv(c) };
      }
    }
  }

  function checkMath(T) {
    // Sharma, Wu & Dalal (2005) reference pairs.
    const pairs = [
      [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
      [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
      [[50, 2.5, 0], [73, 25, -18], 27.1492],
      [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
      [[2.0776, 0.0795, -1.135], [0.9033, -0.0636, -0.5514], 0.9082],
    ];
    for (const [a, b, want] of pairs) {
      for (const [x, y] of [[a, b], [b, a]]) {
        const got = deltaE00(x, y);
        T.check(Math.abs(got - want) <= 1e-4, `deltaE00(${x}, ${y}) = ${got}, want ${want}`);
      }
    }
    const white = srgbToLab([255, 255, 255]);
    T.check(!(Math.abs(white[0] - 100) > 1e-3 || Math.abs(white[1]) > 1e-2 || Math.abs(white[2]) > 1e-2), `srgbToLab(white) = ${white}`);
    for (const rgb of [[255, 0, 0], [12, 200, 77], [128, 128, 128], [3, 9, 250], [250, 240, 10]]) {
      const { h, s, v } = rgbToHsv(rgb);
      const back = hsvToRgb(h, s, v);
      T.check(back.join() === rgb.join(), `hsv round trip ${rgb} -> ${back}`);
      const [hh, ss, ll] = rgbToHsl(rgb);
      T.check(hslToRgb(hh, ss, ll).join() === rgb.join(), `hsl round trip ${rgb}`);
    }
    for (const [h, sv, v] of [[0, 1, 1], [196, 0.68, 0.77], [300, 0.3, 0.35], [45, 0.95, 0.4], [120, 0.5, 1]]) {
      const back = hslToHsv(...hsvToHsl(h, sv, v));
      T.check(!(Math.abs(back.s - sv) > 1e-9 || Math.abs(back.v - v) > 1e-9), `hsv/hsl round trip ${[h, sv, v]}`);
      const [hh, ss, ll] = hsvToHsl(h, sv, v);
      T.check(hslToRgb(hh, ss, ll).join() === hsvToRgb(h, sv, v).join(), `hslToRgb vs hsvToRgb at ${[h, sv, v]}`);
    }
    T.check(hex([255, 10, 0]) === '#FF0A00', `hex([255,10,0]) = ${hex([255, 10, 0])}`);
    for (const [t, want] of [['#3fa2c4', '63,162,196'], ['3FA2C4', '63,162,196'], ['rgb(63, 162, 196)', '63,162,196'], ['#3FA2C', null], ['rgb(300,1,1)', null]]) {
      const got = parseColor(t);
      T.check((got && got.join()) === (want || null), `parseColor(${t}) = ${got}`);
    }
    for (let i = 0; i < NAMED.length; i++) {
      for (let j = i + 1; j < NAMED.length; j++) {
        T.check(!(dE(NAMED[i].rgb, NAMED[j].rgb) < 16), `named ${NAMED[i].name} ~ ${NAMED[j].name}`);
      }
    }
  }

  function checkPlans(T) {
    // Plan convergence per control set and scenario, with up to 1 px of landing error per axis; every fourth
    // seed behind a popover; input routes from the route knob (unset, keyboard, pointer).
    const MAX_STEPS = 8;
    const ROUTES = [undefined, 'keyboard', 'pointer'];
    for (const controls of CONTROLS) {
      for (const scenario of SCENARIOS) {
        for (let seed = 0; seed < 40; seed++) {
          const rng = new env.Rng(seed * 7919 + controls.length * 31 + scenario.length);
          const startMode = ['off', 'partial', 'wrong'][seed % 3];
          const traits = seed % 4 === 1 ? { controls, popover: true } : { controls };
          const route = ROUTES[Math.floor(seed / 3) % 3];
          const so = { scenario, scenarios: SCENARIOS, traits, startMode, ood: seed % 5 === 4 };
          const spec = task.sample(rng.fork('spec'), { ...so, route });
          const knowsCode = scenario === 'hex' || (scenario === 'palette' && spec.ref === 'hex');
          if (route === undefined) {
            const same = task.sample(rng.fork('spec'), { ...so, route: 'wheel' });
            T.check(JSON.stringify(same) === JSON.stringify(spec), `${controls}/${scenario} seed ${seed}: route 'wheel' changed the spec`);
          } else if (scenario !== 'hex-typed') {
            const want = route === 'pointer' ? [false, null, 'drag'] : knowsCode ? [true, 'hex', 'type'] : null;
            T.check(!(want && [spec.keys, spec.fields, spec.route].join() !== want.join()), `${controls}/${scenario} seed ${seed}: route ${route} gave keys ${spec.keys}, fields ${spec.fields}, route ${spec.route}`);
          }
          let model = task.init(spec, rng.fork('init'));
          if (spec.popover) {
            const first = plan(model, spec);
            T.check(!(model.open !== false || ((first.drag || first.type) && !first.click)), `${controls}/${scenario} seed ${seed}: popover not opened first`);
          }
          const jitter = () => rng.float(-1, 1);
          let n = 0;
          while (task.error(model, spec) > spec.tau && n < MAX_STEPS) {
            model = simulate(model, plan(model, spec), spec, jitter);
            n++;
          }
          const err = task.error(model, spec);
          if (err > spec.tau) {
            T.fail(`${controls}/${scenario} seed ${seed}: plan did not converge (error ${err.toFixed(3)} > tau ${spec.tau} after ${n} steps)`);
            break;
          }
          T.check(!(task.error(task.solve(spec, model), spec) > 1e-9), `${scenario}: solve() not exact`);
          const inst = task.instruction(spec, rng.fork('i'));
          T.check(!/submit/i.test(inst), `${scenario}: instruction names the end control: ${inst}`);
          T.check(!(spec.code && !inst.includes(spec.code) && !/[Tt]ask|step/i.test(inst) && spec.scenario !== 'palette'), `${scenario}: goal text lacks the code ${spec.code}: ${inst}`);
        }
      }
    }
  }

  function checkJudges(T) {
    // judge episodes: the instruction holds the ambiguous pair or the impossible color; cands / what are structural
    for (const scenario of SCENARIOS) {
      for (const judge of task.judgeModes) {
        for (let seed = 0; seed < 8; seed++) {
          const spec = task.sample(new env.Rng(seed * 313 + 5), { scenarios: SCENARIOS, scenario, judge, traits: { controls: CONTROLS[seed % CONTROLS.length] } });
          const j = spec.judge;
          const tag = `${scenario}/${judge} seed ${seed}`;
          const inst = task.instruction(spec, new env.Rng(seed)).toLowerCase();
          const ok = (w) => typeof w === 'string' && w.trim();
          if (judge === 'ambiguous') {
            if (!j.cands || j.cands.length < 2 || j.cands.some((c) => !c.length || !c.every(ok))) T.fail(`${tag}: cands ${JSON.stringify(j.cands)}`);
            else T.check(j.cands.every((c) => inst.includes(c[0].toLowerCase())), `${tag}: instruction does not hold both candidates: ${inst}`);
          } else T.check(!(!j.what || !j.what.length || !j.what.every(ok) || !inst.includes(j.what[0].toLowerCase())), `${tag}: what ${JSON.stringify(j.what)}: ${inst}`);
        }
      }
    }
  }

  env.selfTest('pick-color', (T) => {
    checkMath(T);
    checkPlans(T);
    checkJudges(T);
  });
})();
