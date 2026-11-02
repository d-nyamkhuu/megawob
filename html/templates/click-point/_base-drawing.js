/* click-point/_base-drawing: reference drawing implementation; overridable units stay in reference.js. */
(function () {
  'use strict';
  function ensureStyle(S) {
    if (document.getElementById('cp-style')) return;
    const s = document.createElement('style');
    s.id = 'cp-style';
    s.textContent = S.CSS;
    document.head.append(s);
  }

  function drawGrid(S, util, W, H) {
    util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'var(--panel)' }, S.svg);
    if (S.style.flavor === 'cad') {
      // Minor grid every 0.05 board units, a brighter major line every 0.25.
      for (let k = 0, u = 0; u <= S.spec.board.w + 1e-9; k++, u = k * 0.05) {
        util.svg('line', { x1: S.f1(u * S.scale), y1: 0, x2: S.f1(u * S.scale), y2: H, stroke: k % 5 ? '#1a212a' : '#2a3441', 'stroke-width': 1 }, S.svg);
      }
      for (let k = 0, u = 0; u <= S.spec.board.h + 1e-9; k++, u = k * 0.05) {
        util.svg('line', { x1: 0, y1: S.f1(u * S.scale), x2: W, y2: S.f1(u * S.scale), stroke: k % 5 ? '#1a212a' : '#2a3441', 'stroke-width': 1 }, S.svg);
      }
      return;
    }
    if (S.style.grid === 'plain') return;
    const step = S.style.gridStep;
    const defs = util.svg('defs', {}, S.svg);
    const pat = util.svg('pattern', { id: 'cp-grid', width: step, height: step, patternUnits: 'userSpaceOnUse' }, defs);
    if (S.style.grid === 'dots') util.svg('circle', { cx: step / 2, cy: step / 2, r: 1.4, fill: 'var(--line)' }, pat);
    else util.svg('path', { d: `M ${step} 0 L 0 0 0 ${step}`, fill: 'none', stroke: 'var(--line)', 'stroke-width': 1, opacity: 0.7 }, pat);
    util.svg('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#cp-grid)' }, S.svg);
  }

  function point(S, util, g, p, hollow) {
    const [x, y] = S.px(p);
    const ink = 'var(--fg)';
    if (hollow) {
      util.svg('circle', { cx: x, cy: y, r: 7, fill: 'var(--panel)', stroke: ink, 'stroke-width': 2.5 }, g);
      return;
    }
    if (S.style.point === 'cross') {
      const k = 7;
      util.svg('circle', { cx: x, cy: y, r: 10, fill: 'var(--panel)', opacity: 0.85 }, g);
      for (const [dx, dy] of [[k, k], [k, -k]]) {
        util.svg('line', { x1: x - dx, y1: y - dy, x2: x + dx, y2: y + dy, stroke: ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
      }
      return;
    }
    if (S.style.point === 'ring') {
      util.svg('circle', { cx: x, cy: y, r: 8, fill: 'var(--panel)', stroke: ink, 'stroke-width': 2 }, g);
      util.svg('circle', { cx: x, cy: y, r: 3, fill: ink }, g);
      return;
    }
    util.svg('circle', { cx: x, cy: y, r: 8.5, fill: 'var(--panel)' }, g);
    util.svg('circle', { cx: x, cy: y, r: 6, fill: ink }, g);
  }

  function label(S, util, g, p, th, text, off = 22) {
    const [x, y] = S.px(p);
    const W = S.spec.board.w * S.scale;
    const H = S.spec.board.h * S.scale;
    const lx = Math.min(W - 14, Math.max(14, x + Math.cos(th) * off));
    const ly = Math.min(H - 12, Math.max(14, y + Math.sin(th) * off));
    const t = util.svg('text', { x: S.f1(lx), y: S.f1(ly), class: `cp-label${S.style.serif ? ' serif' : ''}`, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
    t.textContent = text;
  }

  function line(S, util, g, a, b, attrs) {
    const [x1, y1] = S.px(a);
    const [x2, y2] = S.px(b);
    return util.svg('line', { x1: S.f1(x1), y1: S.f1(y1), x2: S.f1(x2), y2: S.f1(y2), 'stroke-linecap': 'round', ...attrs }, g);
  }

  function minCircle(S, util, g, c) {
    const [x, y] = S.px(c);
    util.svg('circle', {
      cx: S.f1(x), cy: S.f1(y), r: S.f1(S.spec.minLen * S.scale), fill: S.style.minFill ? 'var(--line)' : 'none', 'fill-opacity': 0.25,
      stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': S.style.minDash, opacity: 0.9,
    }, g);
  }

  function arcPath(S, c, r, a0, a1) {
    return env.templateLib('click-point/_geometry').arcPath(S.at, S.f1, c, r, a0, a1);
  }

  function drawCenter(S, util, g) {
    const c = S.px(S.spec.c);
    const r = S.spec.r * S.scale;
    const sw = S.style.sw;
    if (S.spec.shape === 'circle') {
      util.svg('circle', { cx: S.f1(c[0]), cy: S.f1(c[1]), r: S.f1(r), fill: 'none', stroke: 'var(--fg)', 'stroke-width': sw, 'stroke-dasharray': S.style.dashOutline ? '10 6' : 'none' }, g);
    } else if (S.spec.shape === 'ring') {
      const w = S.spec.ringWidth * S.scale;
      util.svg('circle', { cx: S.f1(c[0]), cy: S.f1(c[1]), r: S.f1(r), fill: 'none', stroke: S.style.fill, 'stroke-width': S.f1(w), opacity: 0.8 }, g);
      if (S.style.edges) {
        for (const rr of [r - w / 2, r + w / 2]) util.svg('circle', { cx: S.f1(c[0]), cy: S.f1(c[1]), r: S.f1(rr), fill: 'none', stroke: 'var(--fg)', 'stroke-width': 1.5 }, g);
      }
    } else if (S.spec.shape === 'disc') {
      util.svg('circle', { cx: S.f1(c[0]), cy: S.f1(c[1]), r: S.f1(r), fill: S.style.fill, 'fill-opacity': 0.75, stroke: S.style.edges ? 'var(--fg)' : 'none', 'stroke-width': 2 }, g);
    } else {
      const a0 = S.spec.arc.start;
      const a1 = a0 + S.spec.arc.span;
      util.svg('path', { d: S.arcPath(c, r, a0, a1), fill: 'none', stroke: 'var(--fg)', 'stroke-width': sw + 1, 'stroke-linecap': S.style.edges ? 'butt' : 'round' }, g);
      if (S.style.edges) {
        for (const a of [a0, a1]) {
          const p = S.at(c, a, r - 7);
          const q = S.at(c, a, r + 7);
          util.svg('line', { x1: S.f1(p[0]), y1: S.f1(p[1]), x2: S.f1(q[0]), y2: S.f1(q[1]), stroke: 'var(--fg)', 'stroke-width': 2 }, g);
        }
      }
    }
  }

  function drawMidpoint(S, util, g) {
    if (S.style.guide) S.line(util, g, S.spec.a, S.spec.b, { stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '6 6', opacity: 0.8 });
    S.point(util, g, S.spec.a);
    S.point(util, g, S.spec.b);
    if (S.spec.labels) {
      const th = Math.atan2(S.spec.b[1] - S.spec.a[1], S.spec.b[0] - S.spec.a[0]);
      S.label(util, g, S.spec.a, th + Math.PI + S.style.labelTurn, 'A');
      S.label(util, g, S.spec.b, th - S.style.labelTurn, 'B');
    }
  }

  function drawBisect(S, util, g) {
    const v = S.spec.v;
    S.minCircle(util, g, v);
    const [r0, r1] = S.spec.rays;
    if (S.style.angleMark) {
      const rr = Math.min(0.055, S.spec.minLen * 0.55) * S.scale;
      util.svg('path', { d: S.arcPath(S.px(v), rr, r0.angle, r1.angle), fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5 }, g);
    }
    for (const ray of S.spec.rays) {
      const end = S.at(v, ray.angle, ray.len);
      S.line(util, g, v, end, { stroke: 'var(--fg)', 'stroke-width': S.style.sw });
      if (S.style.rayEnd === 'arrow') {
        const tip = S.px(end);
        const back = S.at(tip, ray.angle, -14);
        const n = ray.angle + Math.PI / 2;
        const h1 = S.at(back, n, 7);
        const h2 = S.at(back, n, -7);
        util.svg('polygon', { points: [tip, h1, h2].map((p) => p.map(S.f1).join(',')).join(' '), fill: 'var(--fg)' }, g);
      } else if (S.style.rayEnd === 'dot') {
        const e = S.px(end);
        util.svg('circle', { cx: S.f1(e[0]), cy: S.f1(e[1]), r: 4, fill: 'var(--fg)' }, g);
      }
    }
    S.point(util, g, v);
    if (S.spec.labels) {
      S.label(util, g, S.at(v, r0.angle, r0.len), r0.angle, 'A', 18);
      S.label(util, g, S.at(v, r1.angle, r1.len), r1.angle, 'B', 18);
      S.label(util, g, v, S.spec.bisector + Math.PI + S.style.labelTurn, 'V', 24);
    }
  }

  function drawRightAngle(S, util, g) {
    const { a, b } = S.spec;
    const th = Math.atan2(a[1] - b[1], a[0] - b[0]);
    S.minCircle(util, g, b);
    if (S.style.guide) {
      const far = 2;
      S.line(util, g, S.at(b, th, -far), S.at(b, th, far), { stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '4 6', opacity: 0.7 });
    }
    S.line(util, g, b, a, { stroke: 'var(--fg)', 'stroke-width': S.style.sw });
    S.point(util, g, a, !S.spec.labels);
    S.point(util, g, b);
    if (S.spec.labels) {
      S.label(util, g, a, th + S.style.labelTurn, 'A');
      S.label(util, g, b, th + Math.PI + S.style.labelTurn, 'B');
    }
  }

  env.template('click-point/_base-drawing', () => ({ ensureStyle, drawGrid, point, label, line, minCircle, arcPath, drawCenter, drawMidpoint, drawBisect, drawRightAngle }), { uses: ['click-point/_geometry'] });
})();
