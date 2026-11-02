/* read-figure/_base-figures: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function polyPoints(unitScope, n, cx, cy, r, rotDeg, inner) {
    const pts = [];
    const k = inner ? 2 * n : n;
    for (let i = 0; i < k; i++) {
      const a = ((rotDeg + (i * 360) / k) * Math.PI) / 180;
      const rr = inner && i % 2 ? inner : r;
      pts.push(`${(cx + rr * Math.sin(a)).toFixed(2)},${(cy - rr * Math.cos(a)).toFixed(2)}`);
    }
    return pts.join(' ');
  }

  function drawIcon(unitScope, util, parent, name, cx, cy, s, color, glyphs) {
    const { ICON_SHAPES, fam } = unitScope;
    const set = glyphs && fam().helpers.GLYPHS && fam().helpers.GLYPHS[glyphs];
    if (set) {
      const ch = set[name][0];
      const t = util.svg('text', glyphs === 'emoji'
        ? { x: cx, y: cy + s * 0.04, class: 'up-emoji', 'font-size': (s * 0.86).toFixed(1) }
        : { x: cx, y: cy + s * 0.02, class: 'up-sym', fill: color, 'font-size': (s * 1.1).toFixed(1) }, parent);
      t.textContent = glyphs === 'emoji' ? ch : `${ch}\uFE0E`;
      return t;
    }
    const k = s / 24;
    const g = util.svg('g', { class: 'up-fig', transform: `translate(${(cx - s / 2).toFixed(2)},${(cy - s / 2).toFixed(2)}) scale(${k.toFixed(4)})` }, parent);
    for (const [tag, a] of ICON_SHAPES[name]) {
      const { F, W, ...attrs } = a;
      util.svg(tag, { ...attrs, fill: F ? color : 'none', stroke: color, 'stroke-width': W || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return g;
  }

  function drawFigure(unitScope, util, parent, kind, text, cx, cy, s, fill, glyphs) {
    const { drawIcon, polyPoints } = unitScope;
    const h = s / 2;
    if (kind === 'icon') return drawIcon(util, parent, text, cx, cy, s, fill, glyphs);
    if (kind !== 'shape') {
      const t = util.svg('text', { x: cx, y: cy + s * 0.04, class: 'up-glyph', fill, 'font-size': (s * 1.08).toFixed(1) }, parent);
      t.textContent = text;
      return t;
    }
    const a = { class: 'up-fig', fill };
    switch (text) {
      case 'circle': return util.svg('circle', { ...a, cx, cy, r: h * 0.95 }, parent);
      case 'square': return util.svg('rect', { ...a, x: cx - h * 0.86, y: cy - h * 0.86, width: h * 1.72, height: h * 1.72 }, parent);
      case 'triangle': return util.svg('polygon', { ...a, points: `${cx},${cy - h} ${cx + h},${cy + h * 0.8} ${cx - h},${cy + h * 0.8}` }, parent);
      case 'diamond': return util.svg('polygon', { ...a, points: `${cx},${cy - h} ${cx + h * 0.72},${cy} ${cx},${cy + h} ${cx - h * 0.72},${cy}` }, parent);
      case 'star': return util.svg('polygon', { ...a, points: polyPoints(5, cx, cy + h * 0.06, h, 0, h * 0.44) }, parent);
      case 'pentagon': return util.svg('polygon', { ...a, points: polyPoints(5, cx, cy + h * 0.05, h, 0) }, parent);
      case 'hexagon': return util.svg('polygon', { ...a, points: polyPoints(6, cx, cy, h, 30) }, parent);
      default: throw new Error(`unknown shape ${text}`);
    }
  }

  function palette(unitScope, spec) {
    const { fam } = unitScope;
    const f = fam();
    return f.helpers.itemColors ? f.helpers.itemColors(spec) : { colors: f.helpers.ITEM_COLORS, board: null };
  }

  function boardSvg(unitScope, util, parent, W, H, spec) {
    const { palette } = unitScope;
    const svg = util.svg('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'up-board' }, parent);
    const pal = palette(spec);
    if (pal.board) {
      svg.classList.add('up-low');
      svg.style.background = pal.board;
    }
    return svg;
  }

  function drawBoard(unitScope, ctx, parent, spec, cell, clickable) {
    const { boardSvg, drawFigure, palette } = unitScope;
    const { util, rng } = ctx;
    const W = spec.cols * cell;
    const H = spec.rows * cell;
    const svg = boardSvg(util, parent, W, H, spec);
    svg.dataset.role = 'board';
    if (rng.bool(0.5)) {
      for (let c = 1; c < spec.cols; c++) util.svg('line', { x1: c * cell, y1: 0, x2: c * cell, y2: H, class: 'gl' }, svg);
      for (let r = 1; r < spec.rows; r++) util.svg('line', { x1: 0, y1: r * cell, x2: W, y2: r * cell, class: 'gl' }, svg);
    }
    const colors = palette(spec).colors;
    const tinyPx = Math.max(11, Math.min(16, Math.round(cell * 0.26)));
    return spec.items.map((it) => {
      const g = util.svg('g', clickable ? { class: 'up-item' } : {}, svg);
      g.dataset.role = 'item';
      const s = it.size === 'tiny' ? tinyPx : cell * (it.size === 'small' ? 0.44 : it.kind === 'icon' ? 0.66 : 0.78);
      // Tiny items sit at a jittered spot of their cell; others at the center.
      const jx = it.size === 'tiny' ? rng.float(-0.25, 0.25) * cell : 0;
      const jy = it.size === 'tiny' ? rng.float(-0.25, 0.25) * cell : 0;
      const cx = it.c * cell + cell / 2 + jx;
      const cy = it.r * cell + cell / 2 + jy;
      if (clickable) {
        if (it.size === 'tiny') util.svg('rect', { x: cx - s / 2 - 4, y: cy - s / 2 - 4, width: s + 8, height: s + 8, rx: 4, class: 'hit' }, g);
        else util.svg('rect', { x: it.c * cell + 1, y: it.r * cell + 1, width: cell - 2, height: cell - 2, rx: 6, class: 'hit' }, g);
      }
      drawFigure(util, g, it.kind, it.text, cx, cy, s, colors[it.color], spec.glyphs);
      return g;
    });
  }
  env.template('read-figure/_base-figures', () => ({ polyPoints, drawIcon, drawFigure, palette, boardSvg, drawBoard }));
})();
