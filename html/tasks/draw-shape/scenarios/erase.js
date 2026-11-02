/*
 * draw / erase: erase the strokes a description names from a whiteboard.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { frameOf, inBoard, INKS, keyRoute, keyTool, polyDist, pt, resample, T, TOOL_KEYS, undoStep } = fam.lib;

  const SHAPES = ['line', 'circle', 'zigzag', 'wave', 'triangle', 'square'];

  function erasedSet(model) { return new Set(model.erased || []); }

  function strokeShape(rng, shape, c, s) {
    const P = (x, y) => pt([c[0] + x * s, c[1] + y * s]);
    const rot = rng.float(-0.5, 0.5);
    const R = (q) => {
      const x = q[0] - c[0];
      const y = q[1] - c[1];
      return pt([c[0] + x * Math.cos(rot) - y * Math.sin(rot), c[1] + x * Math.sin(rot) + y * Math.cos(rot)]);
    };
    let pts;
    switch (shape) {
      case 'line': pts = Array.from({ length: 12 }, (_, i) => P(-0.5 + i / 11, 0)); break;
      case 'circle': pts = Array.from({ length: 33 }, (_, i) => P(0.42 * Math.cos((i / 32) * 2 * Math.PI), 0.42 * Math.sin((i / 32) * 2 * Math.PI))); break;
      case 'zigzag': pts = Array.from({ length: 7 }, (_, i) => P(-0.5 + i / 6, i % 2 ? 0.22 : -0.22)); break;
      case 'wave': pts = Array.from({ length: 33 }, (_, i) => P(-0.5 + i / 32, 0.2 * Math.sin((i / 32) * 4 * Math.PI))); break;
      case 'triangle': pts = [P(0, -0.42), P(0.45, 0.36), P(-0.45, 0.36), P(0, -0.42)]; break;
      default: pts = [P(-0.38, -0.38), P(0.38, -0.38), P(0.38, 0.38), P(-0.38, 0.38), P(-0.38, -0.38)];
    }
    return shape === 'circle' ? pts : pts.map(R);
  }

  function sampleErase(rng, opts, board) {
    const F = frameOf(board);
    for (;;) {
      let cols = opts.ood ? 4 : 3;
      let rows = opts.ood ? 3 : 2;
      let n = opts.ood ? rng.int(8, 11) : rng.int(4, 6);
      if (opts.level) n = opts.level === 'easy' ? 4 : 5;
      // Narrow boards (traits.aspect): fewer columns, more rows (at most 4), fewer strokes if they do not fit.
      while (cols > 2 && board.w / cols < 0.36) cols--;
      rows = Math.max(rows, Math.min(4, Math.ceil(n / cols)));
      n = Math.min(n, cols * rows);
      const cw = board.w / cols;
      const ch = board.h / rows;
      const cells = rng.sample([...Array(cols * rows).keys()], n);
      const strokes = cells.map((k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const s = Math.min(cw, ch) * rng.float(0.5, 0.72);
        const m = s * 0.55;
        const cen = [c * cw + rng.float(m, cw - m), r * ch + rng.float(m, ch - m)];
        const shape = rng.pick(SHAPES);
        return { shape, color: rng.pick(Object.keys(INKS)), pts: strokeShape(rng, shape, cen, s) };
      });
      // Grab point: the stroke point farthest from every other stroke.
      for (const [i, st] of strokes.entries()) {
        let best = null;
        let bd = -1;
        for (const p of resample(st.pts, 0.01)) {
          let d = Infinity;
          for (const [j, o] of strokes.entries()) if (j !== i) d = Math.min(d, polyDist(p, o.pts));
          if (inBoard(p, 0.02, F) && d > bd) { bd = d; best = p; }
        }
        st.grab = pt(best || st.pts[0]);
        if (bd < 0.06) st.bad = true;
      }
      if (strokes.some((s) => s.bad)) continue;
      // Goal: one stroke by its (minimal unique) description, or every stroke of a color / shape.
      const key = (s, d) => (!d.color || s.color === d.color) && (!d.shape || s.shape === d.shape);
      let desc;
      let targets;
      if (rng.bool(opts.ood ? 0.6 : 0.35) && opts.level !== 'easy') {
        const by = rng.pick(['color', 'shape']);
        const groups = {};
        strokes.forEach((s, i) => (groups[s[by]] ||= []).push(i));
        const ok = Object.entries(groups).filter(([, v]) => v.length >= 2 && v.length <= 3);
        if (!ok.length) continue;
        const [val, idx] = rng.pick(ok);
        desc = { [by]: val, all: true };
        targets = idx;
      } else {
        const t = rng.int(0, n - 1);
        const s = strokes[t];
        const opts2 = [{ shape: s.shape }, { color: s.color }, { color: s.color, shape: s.shape }];
        desc = opts2.find((d) => strokes.filter((o) => key(o, d)).length === 1);
        if (!desc) continue;
        targets = [t];
      }
      strokes.forEach((s) => { delete s.bad; });
      return { strokes, targets, desc, ...keyRoute(rng, opts.route) };
    }
  }

  // Undo in the model: the last op is an erase (restore the stroke) or a drawn stroke.
  function undoOp(m) {
    const op = m.ops.pop();
    if (op && op[0] === 'e') m.erased = m.erased.filter((i) => i !== op[1]);
    else if (op) m.drawn.pop();
  }

  env.scenario('draw-shape', {
    name: 'erase',
    sample(rng, { o, board }) {
      return sampleErase(rng, o, board);
    },
    tolerance() {
      return { tau: 0, sigma: 0.5, minInitialError: 0.4 };
    },
    init(spec, rng, mode) {
      if (mode === 'partial') {
        return spec.targets.length >= 2
          ? { tool: 'eraser', erased: [spec.targets[0]], drawn: [], ops: [['e', spec.targets[0]]] }
          : { tool: 'eraser', erased: [], drawn: [], ops: [] };
      }
      if (mode === 'wrong') {
        const non = spec.strokes.map((_, i) => i).filter((i) => !spec.targets.includes(i));
        const w = rng.pick(non);
        return { tool: 'eraser', erased: [w], drawn: [], ops: [['e', w]] };
      }
      return { tool: 'pen', erased: [], drawn: [], ops: [] };
    },
    error(model, spec) {
      const er = erasedSet(model);
      const tg = new Set(spec.targets);
      const missing = spec.targets.filter((i) => !er.has(i)).length;
      const wrong = [...er].filter((i) => !tg.has(i)).length;
      return (missing + wrong + 0.5 * (model.drawn || []).length) / spec.targets.length;
    },
    solve(spec) {
      return { tool: 'eraser', erased: spec.targets.slice(), drawn: [], ops: spec.targets.map((i) => ['e', i]) };
    },
    plan(model, spec) {
      const tg = new Set(spec.targets);
      const bad = (model.ops || []).some((o) => o[0] === 'd' || !tg.has(o[1]));
      if (bad) return undoStep(spec.keyRoute);
      if (model.tool !== 'eraser') return spec.keyRoute ? { key: TOOL_KEYS.eraser } : { click: { tool: 'eraser' } };
      const er = erasedSet(model);
      const next = spec.targets.find((i) => !er.has(i));
      return next === undefined ? null : { click: { grab: next } };
    },
    figurePts(spec) {
      return spec.strokes.flatMap((st) => st.pts);
    },
    instruction(spec, rng, say, tolP) {
      const d = spec.desc;
      const shape = d.shape ? (d.all ? `${d.shape === 'zigzag' ? 'zigzags' : d.shape + 's'}` : d.shape) : null;
      let what;
      if (d.all) what = d.color ? `all the ${d.color} strokes` : `all the ${shape}`;
      else what = `the ${[d.color, shape || 'stroke'].filter(Boolean).join(' ')}`;
      return say(T(rng, spec, [
        'Erase {what}.',
        'Use the eraser to remove {what}.',
        'Get rid of {what} on the board; leave everything else.',
        'Pick the eraser and delete {what}.',
        'Remove {what} from the whiteboard.',
        'Clean up the board: erase {what} and nothing else.',
        'Wipe out {what}.',
        'Have {what} erased.',
        'Clear away {what}; keep the rest.',
        'Erase {what} without touching any other ink.',
        'Make {what} disappear using the eraser.',
        'Erase only {what}; add no ink.',
        'The board should be free of {what}.',
        'Leave no trace of {what}.',
        'Keep everything except {what}.',
        'The sole change: erase {what}.',
        'Please erase {what}; no new marks.',
        'Your eraser task: {what}.',
        'The only ink to erase is {what}.',
        'Nothing but {what} should be erased.',
        '{what} must go; all other marks stay.',
        'Use eraser mode on {what} alone.',
        'Finish with {what} erased and no added ink.',
        'Erase {what}; preserve the other ink.',
        'No drawing needed: erase {what}.',
      ], { what }), `erase ${what.replace(/^the /, '')}`);
    },
    facts(model, spec, out) {
      const er = erasedSet(model);
      const left = spec.strokes.filter((_, i) => !er.has(i));
      out.push({ label: 'Strokes left', value: String(left.length), labels: [
        'Doodles left', 'Remaining strokes', 'Strokes remaining', 'Intact originals', 'Unerased count'
      ] });
      out.push({ label: 'Colors left', value: String(new Set(left.map((s) => s.color)).size), labels: ['Ink colors left', 'Colors remaining'] });
    },
    parts(model, spec) {
      const er = erasedSet(model);
      const groups = new Map();
      spec.strokes.forEach((st, i) => {
        const name = `${st.color} ${st.shape}`;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(er.has(i));
      });
      const out = [...groups].map(([name, v]) => ({ name, value: v }));
      out.push({ name: 'New strokes', value: (model.drawn || []).length, aliases: ['Drawn strokes'] });
      return out;
    },
    silent(next, prev, spec, rng, cands) {
      const C = env.util.clone;
      const p = prev || {};
      const was = erasedSet(p);
      const now = (next.erased || []).filter((i) => !was.has(i));
      if (now.length) {
        const i = rng.pick(now);
        cands.push(() => {
          const m = C(next);
          m.erased = m.erased.filter((k) => k !== i);
          const at = m.ops.map((o) => o[0] === 'e' && o[1] === i).lastIndexOf(true);
          if (at >= 0) m.ops.splice(at, 1);
          return m;
        });
      }
    },
    retarget(spec, model, rng, ok) {
      const er = erasedSet(model);
      const key = (s, d) => (!d.color || s.color === d.color) && (!d.shape || s.shape === d.shape);
      for (const t of rng.shuffle(spec.strokes.map((_, i) => i))) {
        if (er.has(t) || (spec.targets.length === 1 && spec.targets[0] === t)) continue;
        const s = spec.strokes[t];
        const desc = [{ shape: s.shape }, { color: s.color }, { color: s.color, shape: s.shape }].find((d) => spec.strokes.filter((o) => key(o, d)).length === 1);
        if (desc) return ok({ ...spec, desc, targets: [t] });
      }
      return null;
    },
    simulate(m, spec, step) {
      if (step.key) {
        if (step.key === 'Control+z') undoOp(m);
        else m.tool = keyTool(step.key);
      } else if (step.click.tool) m.tool = step.click.tool;
      else if (step.click.control === 'undo') undoOp(m);
      else if (step.click.grab !== undefined) {
        const i = step.click.grab;
        if (m.tool === 'eraser' && !m.erased.includes(i)) { m.erased.push(i); m.ops.push(['e', i]); }
      }
      return m;
    },
  });
})();
