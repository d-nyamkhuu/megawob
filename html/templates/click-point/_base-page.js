/* click-point/_base-page: reference drawing implementation; overridable units stay in reference.js. */
(function () {
  'use strict';
  function placeCard(S, card, ctx) {
    const s = ctx.stage.getBoundingClientRect();
    const r = card.getBoundingClientRect();
    const lo = [s.left - r.left + 4, s.top - r.top + 4];
    const hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
    const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -80), Math.min(b, 80))) : 0);
    card.style.position = 'relative';
    card.style.left = pick(lo[0], hi[0]) + 'px';
    card.style.top = pick(lo[1], hi[1]) + 'px';
  }

  function vertex(S) {
    if (S.spec.scenario === 'bisect') return S.spec.v;
    if (S.spec.scenario === 'right-angle') return S.spec.b;
    return null;
  }

  function showMarker(S, util, model) {
    S.markG.replaceChildren();
    const p = model && model.point;
    if (S.posEl) S.posEl.textContent = p ? `${S.style.flavor === 'tiles' ? 'Pin' : 'Marker'}: (${p[0].toFixed(3)}, ${p[1].toFixed(3)})` : '';
    if (!p) return;
    const [x, y] = S.px(p);
    const vtx = S.vertex();
    if (vtx) S.line(util, S.markG, vtx, p, { stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '7 5' });
    if (S.spec.scenario === 'right-angle' && S.spec.labels) S.label(util, S.markG, p, Math.atan2(p[1] - vtx[1], p[0] - vtx[0]) + S.style.labelTurn, 'C', 26);
    if (S.style.flavor === 'tiles') {
      // A map pin whose tip is the point.
      util.svg('path', { d: `M${S.f1(x)},${S.f1(y)} c-5,-9 -13,-13 -13,-22 a13,13 0 1,1 26,0 c0,9 -8,13 -13,22z`, fill: '#e03131', stroke: '#fff', 'stroke-width': 2 }, S.markG);
      util.svg('circle', { cx: S.f1(x), cy: S.f1(y - 22), r: 4.5, fill: '#fff' }, S.markG);
      return;
    }
    util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 9, fill: 'none', stroke: 'var(--panel)', 'stroke-width': 5, opacity: 0.9 }, S.markG);
    util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 9, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }, S.markG);
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      util.svg('line', { x1: S.f1(x - dx * 14), y1: S.f1(y - dy * 14), x2: S.f1(x - dx * 4), y2: S.f1(y - dy * 4), stroke: 'var(--accent)', 'stroke-width': 2 }, S.markG);
      util.svg('line', { x1: S.f1(x + dx * 4), y1: S.f1(y + dy * 4), x2: S.f1(x + dx * 14), y2: S.f1(y + dy * 14), stroke: 'var(--accent)', 'stroke-width': 2 }, S.markG);
    }
    util.svg('circle', { cx: S.f1(x), cy: S.f1(y), r: 1.6, fill: 'var(--accent)' }, S.markG);
  }

  function bindClicks(S, ctx) {
    const { util } = ctx;
    return S.env.ui.board(S.svg, {
      toBoard: ([x, y]) => {
        const r = S.svg.getBoundingClientRect();
        return [(x - r.left) / S.scale, (y - r.top) / S.scale];
      },
      fromBoard: ([bx, by]) => {
        const r = S.svg.getBoundingClientRect();
        return [r.left + bx * S.scale, r.top + by * S.scale];
      },
      bounds: { x0: 0, y0: 0, x1: S.spec.board.w, y1: S.spec.board.h },
      value: ctx.model.point,
      onChange: (point) => {
        ctx.update({ point });
        S.showMarker(util, ctx.model);
        if (S.afterClick) S.afterClick(point);
      },
      label: 'board',
    });
  }

  function build(S, ctx, flavor) {
    S.ensureStyle();
    const { util, rng, size } = ctx;
    S.spec = ctx.spec;
    S.afterClick = null;
    S.posEl = null;
    S.style = {
      flavor,
      grid: rng.pick(['dots', 'lines', 'lines', 'plain']),
      gridStep: rng.int(20, 32),
      sw: rng.pick([2, 2.5, 3, 4]),
      point: rng.pick(['dot', 'dot', 'cross', 'ring']),
      guide: rng.bool(0.5),
      angleMark: rng.bool(0.6),
      rayEnd: rng.pick(['arrow', 'dot', 'none']),
      minDash: rng.pick(['2 5', '5 5', '1 4']),
      minFill: rng.bool(0.4),
      fill: rng.pick(S.FILLS),
      edges: rng.bool(0.5),
      dashOutline: rng.bool(0.2),
      serif: rng.bool(0.3),
      labelTurn: rng.float(-0.7, 0.7),
      rulerFill: rng.pick(['#f6e7b0', '#e9eef3', '#f3f0e6', '#dfe9d8']),
      minorGrid: rng.bool(0.5),
      markers: rng.bool(0.6),
      water: rng.pick(['#b9d6ea', '#a9cbe3', '#c3dcec']),
      land: rng.pick(['#e9e4d0', '#e4ead2', '#efe9dc']),
      graticule: rng.pick(['rgba(40,60,90,.45)', 'rgba(20,20,20,.35)']),
      gratDash: rng.pick(['none', '4 4']),
      casing: rng.pick(['#c9c3b3', '#bfc5cc']),
      road: rng.int(7, 11),
    };

    const aspect = S.spec.board.w / S.spec.board.h;
    const fit = Math.min(size.height - 72 - (flavor === 'cad' ? 52 : flavor === 'tiles' ? 58 : 0), (size.width - 80 - (flavor === 'cad' ? 22 : 0)) / aspect);
    const H = Math.floor(Math.min(fit, rng.int(440, 600)));
    S.scale = H / S.spec.board.h;
    const W = Math.round(S.spec.board.w * S.scale);

    const wrap = util.el('div', 'cp-wrap', ctx.stage);
    let board;
    let rulers = null;
    let card = null;
    if (flavor === 'cad') {
      // corner | top ruler / left ruler | board / status bar / command line (a 2-column grid)
      card = util.el('div', 'cp-cad', wrap);
      util.el('div', 'cp-corner', card);
      rulers = {
        top: util.svg('svg', { class: 'cp-ruler', width: W, height: 22, viewBox: `0 0 ${W} 22` }, card),
        left: util.svg('svg', { class: 'cp-ruler', width: 22, height: H, viewBox: `0 0 22 ${H}` }, card),
      };
      board = util.el('div', 'cp-board', card);
    } else if (flavor === 'tiles') {
      card = util.el('div', 'cp-tiles', wrap);
      const head = util.el('div', 'cp-head', card);
      util.el('span', '', head, rng.pick(['Atlas', 'Wayfinder', 'City map', 'Cartograph']));
      util.el('div', 'cp-search', head, 'Search places');
      const zoom = util.el('div', 'cp-zoom', head);
      for (const sign of ['+', '−']) {
        const b = util.el('button', '', zoom, sign);
        b.type = 'button';
        b.setAttribute('aria-label', sign === '+' ? 'Zoom in' : 'Zoom out');
        b.addEventListener('click', () => ctx.log('decoy', { what: 'zoom' }));
      }
      board = util.el('div', 'cp-board', card);
    } else board = util.el('div', 'cp-board', wrap);
    S.svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, board);
    S.svg.dataset.role = 'board';
    if (S.spec.scenario === 'path-mid') Object.assign(S.style, { grid: 'lines', gridStep: S.spec.grid * S.scale });
    if (S.spec.scenario === 'map' || S.spec.scenario === 'axis' && S.spec.kind !== 'ruler') S.style.grid = 'plain';
    S.drawGrid(util, W, H);
    const g = util.svg('g', { class: 'cp-fig' }, S.svg);
    if (S.spec.scenario === 'center') S.drawCenter(util, g);
    else if (S.spec.scenario === 'midpoint') S.drawMidpoint(util, g);
    else if (S.spec.scenario === 'bisect') S.drawBisect(util, g);
    else if (S.spec.scenario === 'right-angle') S.drawRightAngle(util, g);
    else if (S.spec.scenario === 'axis') S.drawAxis(util, g, rng);
    else if (S.spec.scenario === 'map') S.drawMap(util, g, rng, W, H);
    else if (S.spec.scenario === 'path-mid') S.drawPath(util, g);
    else S.drawDense(util, g, rng);
    S.markG = util.svg('g', { class: 'cp-mark' }, S.svg);
    S.showMarker(util, ctx.model);
    S.surface = S.bindClicks(ctx);
    if (flavor === 'cad') S.buildCad(ctx, card, rulers, W, H);
    if (flavor === 'tiles') util.el('div', 'cp-attrib', card, 'Map data © contributors');

    if (flavor !== 'cad') {
      const hint = util.el('div', 'cp-hint', wrap);
      hint.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="9" cy="9" r="1.6" fill="var(--accent)"/></svg>';
      util.el('span', '', hint, flavor === 'tiles' ? rng.pick(['Click the map to drop a pin. Clicking again moves it.', 'Click to place the pin; click again to move it.'])
        : rng.pick(['Click on the board to place the marker. Clicking again moves it.', 'Click to drop a marker; click again to move it.', 'One click places the marker.']));
      S.posEl = util.el('span', 'cp-pos', hint);
      S.showMarker(util, ctx.model);
    }
    const sync = (m) => {
      S.surface.set(m.point);
      S.showMarker(util, m);
    };
    S.placeCard(wrap, ctx);
    return { anchors: [S.svg], sync };
  }

  function buildCad(S, ctx, card, rulers, W, H) {
    const { util } = ctx;
    const tick = (parent, horizontal, k, label) => {
      const u = k * 0.02;
      const p = u * S.scale;
      const major = k % 5 === 0;
      const len = major ? 10 : 4;
      if (horizontal) util.svg('line', { x1: S.f1(p), y1: 22, x2: S.f1(p), y2: 22 - len, stroke: '#6d7a88', 'stroke-width': 1 }, parent);
      else util.svg('line', { x1: 22, y1: S.f1(p), x2: 22 - len, y2: S.f1(p), stroke: '#6d7a88', 'stroke-width': 1 }, parent);
      if (major && label) {
        const t = util.svg('text', horizontal ? { x: S.f1(p + 2), y: 9 } : { x: 1, y: S.f1(p + 10) }, parent);
        t.textContent = u.toFixed(1);
      }
    };
    for (let k = 0; k * 0.02 <= S.spec.board.w + 1e-9; k++) tick(rulers.top, true, k, true);
    for (let k = 0; k * 0.02 <= S.spec.board.h + 1e-9; k++) tick(rulers.left, false, k, k > 0);
    const cross = util.svg('g', { class: 'cp-mark', display: 'none' }, S.svg);
    const hl = util.svg('line', { x1: 0, x2: W, stroke: '#ffb000', 'stroke-width': 1, opacity: 0.55 }, cross);
    const vl = util.svg('line', { y1: 0, y2: H, stroke: '#ffb000', 'stroke-width': 1, opacity: 0.55 }, cross);
    const status = util.el('div', 'cp-status', card);
    const xy = util.el('span', '', status);
    util.el('span', '', status, 'SNAP OFF  ORTHO OFF  GRID ON');
    const cmd = util.el('div', 'cp-cmd', card);
    const fmt = (v) => v.toFixed(3);
    const setXY = (x, y) => { xy.innerHTML = `X <b>${fmt(x)}</b>   Y <b>${fmt(y)}</b>`; };
    const prompt = (t) => { cmd.innerHTML = `Command: <i>${t}</i>`; };
    setXY(0, 0);
    prompt(ctx.model.point ? `Point: ${fmt(ctx.model.point[0])}, ${fmt(ctx.model.point[1])}  -  Specify point:` : 'Specify point:');
    S.svg.addEventListener('pointermove', (e) => {
      const r = S.svg.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cross.setAttribute('display', '');
      hl.setAttribute('y1', S.f1(y));
      hl.setAttribute('y2', S.f1(y));
      vl.setAttribute('x1', S.f1(x));
      vl.setAttribute('x2', S.f1(x));
      setXY(x / S.scale, y / S.scale);
    });
    S.svg.addEventListener('pointerleave', () => cross.setAttribute('display', 'none'));
    S.afterClick = (p) => prompt(`Point: ${fmt(p[0])}, ${fmt(p[1])}  -  Specify point:`);
  }

  function locatePoint(S, t) {
    if (!t || !t.point) throw new Error(`click-point cannot locate ${JSON.stringify(t)}`);
    return S.surface.locate(t.point);
  }

  env.template('click-point/_base-page', () => ({ placeCard, vertex, showMarker, bindClicks, build, buildCad, locatePoint }));
})();
