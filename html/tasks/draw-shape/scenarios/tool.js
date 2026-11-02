/*
 * draw / tool: a drawing app: pick the right tool, then draw a line / rectangle / ellipse / pen route.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('draw-shape');
  const { boxOf, dist, EMPTY, errorOf, fin, I, ideal, keyRoute, keyTool, pathPts, pt, ptsTargets, sampleConnect,
    samplePath, T, tauK, TOOL_KEYS, traceError, undoStep } = fam.lib;

  // Tool items: line / rect / ellipse are [press, release]; pen keeps the samples.
  function itemError(item, spec) {
    if (!item || item.kind !== spec.target || !item.pts || item.pts.length < 2) return EMPTY;
    const p = item.pts;
    if (spec.target === 'pen') return fin(traceError(p, spec.path));
    const s0 = p[0];
    const s1 = p[p.length - 1];
    if (spec.target === 'line') {
      return fin(Math.min(Math.max(dist(s0, spec.a), dist(s1, spec.b)), Math.max(dist(s0, spec.b), dist(s1, spec.a))));
    }
    const u = boxOf(s0, s1);
    const v = boxOf(spec.a, spec.b);
    return fin(Math.max(...u.map((x, i) => Math.abs(x - v[i]))));
  }

  function itemFromStroke(tool, pts) {
    if (!pts || pts.length < 2) return null;
    if (tool === 'pen') return { kind: 'pen', pts: pts.map(pt) };
    const a = pts[0];
    const b = pts[pts.length - 1];
    if (dist(a, b) < 0.012) return null; // a click, not a shape
    return { kind: tool, pts: [pt(a), pt(b)] };
  }

  function sampleTool(rng, opts, F) {
    let target = rng.pick(['line', 'rect', 'rect', 'ellipse', 'ellipse', 'pen']);
    if (opts.level === 'easy' && target === 'pen') target = 'line';
    const start = rng.pick(['pen', 'line', 'rect', 'ellipse'].filter((t) => t !== target));
    const out = { target, start, ...keyRoute(rng, opts.route) };
    if (target === 'line') return { ...out, ...sampleConnect(rng, opts.ood, F) };
    if (target === 'pen') return { ...out, path: samplePath(rng, opts.ood ? rng.int(4, 5) : opts.level ? 2 : rng.int(2, 3), F) };
    for (;;) {
      const w = opts.ood ? rng.float(0.12, 0.2) : rng.float(0.3, Math.min(0.8, F.w - 0.17));
      const h = opts.ood ? rng.float(0.1, 0.16) : rng.float(0.22, Math.min(0.6, F.h - 0.17));
      const x = F.x + rng.float(0.08, F.w - 0.08 - w);
      const y = F.y + rng.float(0.08, F.h - 0.08 - h);
      const flip = rng.bool();
      const a = [x, flip ? y + h : y];
      const b = [x + w, flip ? y : y + h];
      return { ...out, a: pt(a), b: pt(b), show: target === 'ellipse' ? 'outline' : rng.pick(['dots', 'outline']) };
    }
  }

  const TOOL_NAMES = { pen: 'pen', line: 'line', rect: 'rectangle', ellipse: 'ellipse', eraser: 'eraser' };

  const TOOL_ALIASES = { pen: ['pencil', 'freehand'], line: ['straight line', 'line tool'], rect: ['box', 'rectangle tool'], ellipse: ['oval', 'ellipse tool'] };

  const TAU_TOOL = 0.025;

  env.scenario('draw-shape', {
    name: 'tool',
    placed: true,
    layered: true,
    sample(rng, { o, F }) {
      return sampleTool(rng, o, F);
    },
    tolerance() {
      return { tau: TAU_TOOL };
    },
    ideal(spec) {
      return spec.target === 'pen' ? pathPts(spec.path) : [spec.a, spec.b];
    },
    init(spec, rng, mode) {
      if (mode === 'partial') return { tool: spec.target, items: [] };
      if (mode === 'wrong') {
        const t = spec.target;
        let item;
        if (t === 'pen') item = { kind: 'line', pts: [spec.path[0], spec.path[spec.path.length - 1]] };
        else if (t === 'line') item = { kind: 'rect', pts: [spec.a, spec.b] };
        else if (t === 'rect') {
          const [x0, y0, x1, y1] = boxOf(spec.a, spec.b);
          item = { kind: 'pen', pts: [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]].map(pt) };
        } else item = { kind: 'rect', pts: [spec.a, spec.b] };
        return { tool: spec.start, items: [item] };
      }
      return { tool: spec.level === 'easy' ? spec.target : spec.start, items: [] };
    },
    error(model, spec) {
      const items = model.items || [];
      let best = Infinity;
      for (const it of items) best = Math.min(best, itemError(it, spec));
      const base = best < EMPTY ? best : model.tool === spec.target ? 0.85 : EMPTY;
      const others = items.length - (best < EMPTY ? 1 : 0);
      return base + 0.3 * others;
    },
    solve(spec) {
      return { tool: spec.target, items: [itemFromStroke(spec.target, ideal(spec))] };
    },
    plan(model, spec) {
      const items = model.items || [];
      const tau = TAU_TOOL * tauK(spec);
      if (items.length > 1 || (items.length === 1 && itemError(items[0], spec) > tau)) return undoStep(spec.keyRoute);
      if (model.tool !== spec.target) return spec.keyRoute ? { key: TOOL_KEYS[spec.target] } : { click: { tool: spec.target } };
      const k = ideal(spec);
      if (spec.target === 'pen') return { path: ptsTargets(k) };
      return { drag: [{ point: k[0].slice() }, { point: k[1].slice() }] };
    },
    figurePts(spec) {
      return spec.target === 'pen' ? spec.path : [spec.a, spec.b];
    },
    instruction(spec, rng, say, tolP) {
      const tn = I.alias(rng, TOOL_NAMES[spec.target], TOOL_ALIASES[spec.target], 0.3);
      const steps = [`select the ${tn} tool`, spec.target === 'line' ? 'drag from A to B' : spec.target === 'pen' ? 'trace the path' : 'drag from one corner to the opposite corner'];
      let core;
      if (spec.target === 'line') {
        core = T(rng, spec, [
          'Using the {tool} tool, draw a line from A to B.',
          'Pick the {tool} tool and connect dot A to dot B.',
          'Switch to the {tool} tool, then draw a straight line between A and B.',
          'Draw a straight line from A to B with the {tool} tool.',
          'With the {tool} tool, join the two labelled dots.',
          'Choose {tool} in the toolbar and link A to B.',
          'Join A to B in one drag with {tool} selected.',
          'Set your tool to {tool}, then span A and B with a line.',
          'Start at A and drag to B after choosing {tool}.',
          'Create a single line between dots A and B using {tool}.',
          'Make A and B endpoints of one line using {tool}.',
          'A line that joins A and B requires {tool}.',
          'For a straight connection from A to B, select {tool}.',
          'With {tool} active, start a line at A and end it at B.',
          'Release at B after drawing a line from A with {tool}.',
          'Activate {tool} before dragging a line between A and B.',
          'Keep {tool} selected for one straight stroke from A to B.',
          'Use {tool} for one line with ends at A and B.',
          'A starts and B ends the line you draw using {tool}.',
          'Select {tool} and leave one straight line joining A and B.',
          'Both dots must be joined by a line drawn with {tool}.',
          'After choosing {tool}, draw only the line A to B.',
        ], { tool: tn });
      } else if (spec.target === 'pen') {
        core = T(rng, spec, [
          'Use the {tool} tool to trace the dashed route from the start dot to the arrow.',
          'Pick the {tool} and follow the dashed path from start to the arrowhead.',
          'Switch to the {tool} tool, then trace the route in one stroke.',
          'Trace the path freehand with the {tool} tool.',
          'With the {tool}, draw along the dashed route from the start dot to its end.',
          'Choose {tool} in the toolbar and go over the dashed route.',
          'With {tool}, follow the dashes from dot to arrow in one stroke.',
          'From the start dot, trace dashes to the arrow in one {tool} stroke.',
          'Trace dashes in one {tool} stroke, start dot to arrowhead.',
          'The dashed route needs one {tool} stroke from dot to arrow.',
          'With {tool}, release at the arrow after tracing dashes from the dot.',
          'Stay on dashes with {tool}, drawing dot to arrow without a break.',
          'Lift only at the arrow once {tool} has traced dashes from the dot.',
          'Keep {tool} moving along dashes from dot to arrow without lifting.',
          'Do not lift during the {tool} trace of dashes from dot to arrow.',
          'Select {tool} and trace dashes from dot to arrowhead in one go.',
          'Hold down at the dot to trace the dashes to the arrow with {tool}.',
          'Follow each bend in the dashes, dot to arrow, in one {tool} stroke.',
          'Choose {tool}, press at the dot, follow dashes, and end at the arrow.',
          'Cover dashes in a continuous {tool} stroke from dot to arrow.',
        ], { tool: tn });
      } else if (spec.target === 'rect') {
        core = T(rng, spec, spec.show === 'dots' ? [
          'Draw a rectangle whose opposite corners are the two dots.',
          'Using the {tool} tool, draw a box with corners on the two marked dots.',
          'Pick the {tool} tool and drag out a rectangle from one dot to the other.',
          'Make a rectangle spanning the two dots (they are opposite corners).',
          'Switch to the {tool} tool and draw a box between the two corner dots.',
          'Draw a box that has the two dots as diagonal corners.',
          'With the rectangle tool, drag along the diagonal between the dots.',
          'Let the dots fix opposite corners of a rectangle made with the {tool}.',
          'Place opposite corners on the dots using the rectangle tool.',
          'Set {tool} for a rectangle with dots at both ends of its diagonal.',
          'Each dot belongs at an opposite corner of the box drawn with {tool}.',
          'The rectangle tool needs one drag joining both dots diagonally.',
        ] : [
          'Draw a rectangle over the dashed outline.',
          'Using the {tool} tool, draw a box that matches the dashed rectangle.',
          'Pick the {tool} tool and cover the dashed outline with a rectangle.',
          'Make a rectangle exactly on top of the dashed box.',
          'Switch to the {tool} tool and redraw the dashed rectangle.',
          'Draw a box that lines up with the dashed outline.',
          'Pick the rectangle tool to reproduce the dashed box.',
          'The rectangle tool should put each edge on a dashed edge.',
          'With {tool} active, match a rectangle to the dashed border.',
          'Fit a rectangle to the dashed guide with the rectangle tool.',
          'Give the dashed box a solid outline with the rectangle tool.',
          'Set {tool}, then align a rectangle with the dashed box.',
          'Keep the box on the dashes with the rectangle tool.',
          'The rectangle made with {tool} must sit on the dashes.',
          'Let the dashed frame guide a single rectangle tool drag.',
          'One {tool} drag should copy the dashed box as an outline.',
          'Make all four sides follow the dashed box using {tool}.',
          'Match the dashed box in size and position using {tool}.',
          'Using {tool}, drag between the opposite dashed corners.',
          'Your rectangle must match the dashed box. Use {tool}.',
          'Reproduce all four dashed sides using one {tool} drag.',
          'Drag the rectangle tool along a diagonal of the dashed box.',
          'The dashed box sets the bounds for one rectangle tool drag.',
        ], { tool: tn });
      } else {
        core = T(rng, spec, [
          'Draw an ellipse that fits the dashed box.',
          'Using the {tool} tool, draw an oval inside the dashed rectangle, touching all four sides.',
          'Pick the {tool} tool and drag across the dashed box to draw an ellipse.',
          'Make an ellipse whose bounding box is the dashed rectangle.',
          'Switch to the {tool} tool and fill the dashed frame with an oval.',
          'Draw an oval that just fits the dashed outline.',
          'Use the ellipse tool to touch each side inside the dashed box.',
          'With {tool}, place an oval against all four sides of the dashed box.',
          'Use the ellipse tool for an oval bounded by the dashed box.',
          'Let all four dashed sides touch an oval made with the ellipse tool.',
          'With {tool}, size an oval to the dashed box and keep it inside.',
          'Keep the oval inside the dashed box, tangent to each side, with {tool}.',
          'The ellipse tool must make an oval reaching each dashed box edge.',
          'Give the dashed box an inscribed oval with {tool}.',
        ], { tool: tn });
      }
      return say(core, `${TOOL_NAMES[spec.target]} tool`, steps);
    },
    facts(model, spec, out) {
      if (model.tool && TOOL_NAMES[model.tool]) out.push({ label: 'Selected tool', value: TOOL_NAMES[model.tool], labels: ['Active tool', 'Current tool'] });
      out.push({ label: 'Shapes on the canvas', value: String((model.items || []).length), labels: ['Shapes', 'Items drawn'] });
    },
    parts(model, spec) {
      return [{ name: 'Selected tool', value: model.tool || null, aliases: ['Tool', 'Active tool'] },
        { name: 'Canvas', value: (model.items || []).length, aliases: ['Shapes', 'Drawing'] }];
    },
    silent(next, prev, spec, rng, cands) {
      const C = env.util.clone;
      const p = prev || {};
      if ((next.items || []).length > (p.items || []).length) cands.push(() => ({ ...C(next), items: C(next.items.slice(0, -1)) }));
      if (p.tool && next.tool !== p.tool) cands.push(() => ({ ...C(next), tool: p.tool }));
    },
    retarget(spec, model, rng, ok) {
      if (spec.show !== 'outline' || !['rect', 'ellipse'].includes(spec.target)) return null;
      return ok({ ...spec, target: spec.target === 'rect' ? 'ellipse' : 'rect' });
    },
    simulate(m, spec, step) {
      if (step.key) {
        if (step.key === 'Control+z') m.items.pop();
        else m.tool = keyTool(step.key);
      } else if (step.path) {
        const it = itemFromStroke(m.tool, step.path.map((t) => t.point.slice()));
        if (it) m.items.push(it);
      } else if (step.drag) {
        const it = itemFromStroke(m.tool, step.drag.map((t) => t.point));
        if (it) m.items.push(it);
      } else if (step.click.tool) m.tool = step.click.tool;
      else if (step.click.control === 'undo') m.items.pop();
      return m;
    },
    check(fails) {
      const ts = fam.sample(new env.Rng(6), { scenarios: fam.scenarios, scenario: 'tool' });
      const wrongKind = { tool: ts.target, items: [{ ...itemFromStroke(ts.target, ideal(ts)), kind: ts.target === 'pen' ? 'line' : 'pen' }] };
      if (errorOf(wrongKind, ts) <= TAU_TOOL) fails.push('tool: wrong kind passes');
    },
  });
  Object.assign(fam.helpers, { itemFromStroke });
})();
